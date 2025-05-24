import { Db, ObjectId, WithId, Filter } from 'mongodb';
import { dbConnectionMes } from './connection';
import { Role, User, UserWithID } from '@/types/system/user';
import { UserDrawerDataType } from "@/app/dashboard/system/user/_component/userPageType";
import { TZDate } from "@date-fns/tz";
import { sha256 } from '@/utils/encrypt';
import { createMessageCollection, deleteMessageCollection } from './messageCollection';
import { getUserOption } from '@/types/api';
function dbUserToLocalUser(dbUser: WithId<User>): UserWithID {
    const { _id, ...rest } = dbUser;
    return {
        id: _id.toString(),
        ...rest, // 保留其他字段
    };
}

export async function getUniquePermissions(roleIds: string[], db: Db) {
    // 通过角色Id数组在mongogb中获取所有角色的permission列表并去重
    const rolesCollection = db.collection<Role>('roles');
    const rolesObjectIDs = roleIds.map(id => new ObjectId(id))
    const roles = await rolesCollection.find({ _id: { $in: rolesObjectIDs } }).toArray();
    const permissions = roles.flatMap(role => role.permissions);
    const uniquePermissions = [...new Set(permissions)];
    return uniquePermissions;
}


// 检查权限ID是否在角色权限表中存在
export async function checkPermission(permissionId: string, userData?: UserWithID | null) {
    if (!userData) throw new Error("无用户信息")
    const roleIds = userData.roles
    const db = await dbConnectionMes()
    const uniquePermissions = await getUniquePermissions(roleIds, db);
    if (!uniquePermissions) throw new Error("权限获取失败")
    if (!uniquePermissions.includes(permissionId)) throw new Error("无权限访问")
    return userData.id
}

export async function verifyUserCredentials(user: { username: string, password: string }) {
    const db = await dbConnectionMes()
    const usersCollection = db.collection<User>('users');
    const dbUser = await usersCollection.findOne(user);
    return dbUser ? dbUserToLocalUser(dbUser) : null;
}

export async function getUserInfo(userId: string) {
    const db = await dbConnectionMes()
    const usersCollection = db.collection<User>('users');
    const dbUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    return dbUser ? dbUserToLocalUser(dbUser) : null;
}

function dbUsersToLocalUsers(dbUsers: WithId<User>[]): UserWithID[] {
    return dbUsers.map((user) => dbUserToLocalUser(user));
}

const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getUserByPage(options?: getUserOption) {
    const db = await dbConnectionMes()
    const usersCollection = db.collection<User>('users');
    const query: Filter<User> = {};
    if (options?.keyword) {
        query.$or = [
            { username: { $regex: options.keyword, $options: 'i' } }
        ]
    }
    if (options?.roleId) {
        if (options?.unselected) query.roles = { $nin: [options.roleId] }
        else query.roles = { $in: [options.roleId] }
    }
    const currentPage = options?.currentPage || defaultCurrentPage
    const pageSize = options?.pageSize || defaultPageSize
    const total = await usersCollection.countDocuments(query);
    const users = await usersCollection.find(query)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .toArray();
    return {
        data: dbUsersToLocalUsers(users),
        total,
        currentPage,
        pageSize
    };
}

export async function createUserSingle(data: UserDrawerDataType, operatorId: string) {
    const db = await dbConnectionMes()
    if (!data.username) throw new Error("用户名不能为空")
    const date = TZDate.tz("Asia/Shanghai");
    const collection = db.collection<User>("users");
    const result = await collection.insertOne({
        username: data.username,
        password: await sha256(process.env.DEFAULT_PASSWORD!),
        email: data.email || "",
        phone: data.phone || "",
        name: data.name || "",
        workingId: data.workingId || "",
        gender: data.gender || "",
        avatar: data.avatar || "",
        birthday: data.birthday || "",
        address: data.address || "",
        department: data.department || "",
        roles: [],
        isActive: true,
        createdAt: date,
        updatedAt: date,
        createdBy: operatorId,
        updatedBy: operatorId,
        isDeleted: false,
        deletedAt: null,
        deletedBy: null
    });
    await createMessageCollection(result.insertedId.toString())
    return result;
}

export async function updateUserSingle(data: UserDrawerDataType, operatorId: string) {
    const db = await dbConnectionMes()
    if (!data.id) throw new Error("用户ID不能为空")
    if (!data.username) throw new Error("用户名不能为空")
    const date = TZDate.tz("Asia/Shanghai");
    const collection = db.collection<User>("users");
    const result = await collection.updateOne(
        { _id: new ObjectId(data.id) },
        {
            $set: {
                username: data.username,
                email: data.email || "",
                phone: data.phone || "",
                name: data.name || "",
                workingId: data.workingId || "",
                gender: data.gender || "",
                avatar: data.avatar || "",
                birthday: data.birthday || "",
                address: data.address || "",
                department: data.department || "",
                roles: data.roles || [],
                updatedAt: date,
                updatedBy: operatorId,
            }
        }
    );
    return result;
}

export async function deleteUserSingle(id: string, operatorId: string) {
    const db = await dbConnectionMes()
    if (!id) throw new Error("用户ID不能为空")
    const collection = db.collection<User>("users");
    const userItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!userItem) throw new Error("用户不存在")
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    await deleteMessageCollection(id)
    return result;
}