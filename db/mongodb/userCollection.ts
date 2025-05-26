import { Db, ObjectId, WithId, Filter } from 'mongodb';
import { dbConnectionMes } from './connection';
import { Role, User, UserWithID } from '@/types/system/user';
import { createMessageCollection, deleteMessageCollection } from './messageCollection';
import { getUserOption, updateUserDataType } from '@/types/api';
import { deleteFile, uploadFile } from './gridFSCollection';
import { serverEncrypt } from '@/utils/serverEncrypt';
function dbUserToLocalUser(dbUser: WithId<User>): UserWithID {
    let { _id, ...rest } = dbUser;
    return {
        id: _id.toString(),
        ...rest, // 保留其他字段
    };
}

export async function getPermissions(roleIds: string[]) {
    const db = await dbConnectionMes()
    const permissions = await getUniquePermissions(roleIds, db)
    return permissions
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
    const password = await serverEncrypt(user.password)
    const dbUser = await usersCollection.findOne({ username: user.username, password });
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
    const currentPage = options?.currentPage
    const pageSize = options?.pageSize
    const total = await usersCollection.countDocuments(query);
    const users = currentPage && pageSize ? await usersCollection
        .find(query)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .toArray() : await usersCollection.find(query).toArray();
    return {
        data: dbUsersToLocalUsers(users),
        total,
        currentPage,
        pageSize
    };
}

export async function createUserSingle(data: Partial<updateUserDataType>, operatorId: string) {
    if (!data.username) throw new Error("用户名不能为空")
    if (!data.name) throw new Error("姓名不能为空")
    if (!data.workingId) throw new Error("工号不能为空")
    if (!data.phone) throw new Error("电话不能为空")
    if (!data.gender) throw new Error("性别不能为空")
    const db = await dbConnectionMes()
    // 上传头像时同时存在文件与文件名时更新
    if (data.file && data.avatar) {
        const fileId = await uploadFile(data.avatar, data.file, db)
        data.avatar = fileId
    }
    const date = new Date();
    const collection = db.collection<User>("users");
    const result = await collection.insertOne({
        username: data.username,
        password: await serverEncrypt(process.env.DEFAULT_PASSWORD!),
        email: data.email || null,
        phone: data.phone,
        name: data.name,
        workingId: data.workingId,
        gender: data.gender!,
        avatar: data.avatar || null,
        birthday: data.birthday || null,
        address: data.address || null,
        department: data.department || null,
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

export async function updateUserOwnData(data: Partial<updateUserDataType>, operatorId: string) {
    if (!data.id) throw new Error("用户ID不能为空")
    if (!data.name) throw new Error("姓名不能为空")
    if (!data.phone) throw new Error("电话不能为空")
    if (!data.gender) throw new Error("性别不能为空")
    const db = await dbConnectionMes()
    const collection = db.collection<User>("users");
    const userItem = await collection.findOne({ _id: new ObjectId(data.id) })
    if (!userItem) throw new Error("用户不存在")
    const date = new Date();
    const setData: Partial<User> = {
        email: data.email || null,
        phone: data.phone,
        name: data.name,
        gender: data.gender,
        address: data.address || null,
        updatedAt: date,
        updatedBy: operatorId,
    }
    // 标准化时间
    if (data.birthday) {
        setData.birthday = new Date(data.birthday as string)
    }
    // 同时存在文件与文件名且与原文件名不一致时更新
    if (data.file && userItem.avatar !== data.avatar) {
        if (!data.avatar || !data.file) throw new Error("上传文件不能为空")
        if (userItem.avatar) await deleteFile(userItem.avatar, db)
        const fileId = await uploadFile(data.avatar, data.file, db)
        setData.avatar = fileId
    }
    const result = await collection.updateOne(
        { _id: new ObjectId(data.id) },
        {
            $set: setData
        }
    );
    return result;
}

export async function updateUserSingle(data: Partial<updateUserDataType>, operatorId: string) {
    if (!data.id) throw new Error("用户ID不能为空")
    if (!data.username) throw new Error("用户名不能为空")
    if (!data.name) throw new Error("姓名不能为空")
    if (!data.workingId) throw new Error("工号不能为空")
    if (!data.phone) throw new Error("电话不能为空")
    if (!data.gender) throw new Error("性别不能为空")
    const db = await dbConnectionMes()
    const collection = db.collection<User>("users");
    const userItem = await collection.findOne({ _id: new ObjectId(data.id) })
    if (!userItem) throw new Error("用户不存在")
    const date = new Date();
    const setData: Partial<User> = {
        username: data.username,
        email: data.email || null,
        phone: data.phone,
        name: data.name,
        workingId: data.workingId,
        gender: data.gender,
        address: data.address || null,
        department: data.department || null,
        updatedAt: date,
        updatedBy: operatorId,
    }
    // 标准化时间
    if (data.birthday) {
        setData.birthday = new Date(data.birthday as string)
    }
    // 同时存在文件与文件名且与原文件名不一致时更新
    if (data.file && userItem.avatar !== data.avatar) {
        if (!data.avatar || !data.file) throw new Error("上传文件不能为空")
        if (userItem.avatar) await deleteFile(userItem.avatar, db)
        const fileId = await uploadFile(data.avatar, data.file, db)
        setData.avatar = fileId
    }
    const result = await collection.updateOne(
        { _id: new ObjectId(data.id) },
        {
            $set: setData
        }
    );
    return result;
}

export async function deleteUserSingle(id: string, operatorId: string) {
    if (!id) throw new Error("用户ID不能为空")
    const db = await dbConnectionMes()
    const collection = db.collection<User>("users");
    const userItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!userItem) throw new Error("用户不存在")
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (userItem.avatar) await deleteFile(userItem.avatar, db)
    if (userItem.roles.length > 0) {
        const rolesCollection = db.collection<Role>("roles");
        await rolesCollection.updateMany({ _id: { $in: userItem.roles.map(role => new ObjectId(role)) } }, { $pull: { users: id } });
    }
    await deleteMessageCollection(id)
    return result;
}

export async function updateUserRole(id: string, roleIds: string[], operatorId: string) {
    if (!id) throw new Error("用户ID不能为空")
    if (!roleIds) throw new Error("角色ID不能为空")
    const db = await dbConnectionMes()
    const collection = db.collection<User>("users");
    const userItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!userItem) throw new Error("用户不存在")
    const oldRoleIds = userItem.roles
    const removedRoleIds = oldRoleIds.filter(role => !roleIds.includes(role))
    const addedRoleIds = roleIds.filter(role => !oldRoleIds.includes(role))
    const rolesCollection = db.collection<Role>("roles");
    await rolesCollection.updateMany({ _id: { $in: removedRoleIds.map(role => new ObjectId(role)) } }, { $pull: { users: id } });
    await rolesCollection.updateMany({ _id: { $in: addedRoleIds.map(role => new ObjectId(role)) } }, { $push: { users: id } });
    const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                roles: roleIds,
                updatedAt: new Date(),
                updatedBy: operatorId
            }
        }
    );
    return result;
}


export async function updateUserOwnPassword(data: {
    originPassword: string,
    newPassword: string,
    id: string
}, operatorId: string) {
    if (!data.id) throw new Error("用户ID不能为空")
    if (!data.originPassword) throw new Error("原密码不能为空")
    if (!data.newPassword) throw new Error("新密码不能为空")
    const db = await dbConnectionMes()
    const collection = db.collection<User>("users");
    const userItem = await collection.findOne({ _id: new ObjectId(data.id) })
    if (!userItem) throw new Error("用户不存在")
    const originPassword = await serverEncrypt(data.originPassword)
    if (userItem.password !== originPassword) throw new Error("原密码错误")
    const newPassword = await serverEncrypt(data.newPassword)
    const result = await collection.updateOne(
        { _id: new ObjectId(data.id) },
        { $set: { password: newPassword, updatedAt: new Date(), updatedBy: operatorId } }
    );
    return result;
}
