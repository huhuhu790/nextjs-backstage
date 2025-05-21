import { Db, ObjectId, WithId } from 'mongodb';
import { mongoConnection } from './connection';
import { Role, User, UserWithID } from '@/types/system/user';

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
    return await mongoConnection(async (db) => {
        const uniquePermissions = await getUniquePermissions(roleIds, db);
        if (!uniquePermissions) throw new Error("权限获取失败")
        if (!uniquePermissions.includes(permissionId)) throw new Error("无权限访问")
        return userData.id
    })
}

export async function verifyUserCredentials(user: { username: string, password: string }) {
    return await mongoConnection(async (db) => {
        const usersCollection = db.collection<User>('users');
        const dbUser = await usersCollection.findOne(user);
        return dbUser ? dbUserToLocalUser(dbUser) : null;
    })
}

export async function getUserInfo(userId: string) {
    return await mongoConnection(async (db) => {
        const usersCollection = db.collection<User>('users');
        const dbUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
        return dbUser ? dbUserToLocalUser(dbUser) : null;
    })
}