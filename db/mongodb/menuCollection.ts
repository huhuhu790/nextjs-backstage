import { Db, ObjectId, WithId } from 'mongodb';
import { mongoConnection } from './connection';
import { MenuItem, MenuItemWithID } from '@/types/menu';
import { checkPermission, getUniquePermissions } from './userCollection';

function dbMenusToLocalMenus(dbMenus: WithId<MenuItem>[]): MenuItemWithID[] {
    return dbMenus.map(({ _id, ...rest }) => {
        return {
            id: _id.toString(),
            ...rest, // 保留其他字段
        };
    });
}

// no authentication if already logged in as user
export async function getMenusByRoles(roleIds: string[]) {
    return await mongoConnection(async (db) => {
        const uniquePermissions = await getUniquePermissions(roleIds, db);
        if (!uniquePermissions) {
            return []
        }
        const permissionsObjectIDs = uniquePermissions.map(id => new ObjectId(id))
        const usersCollection = db.collection<WithId<MenuItem>>('menus');
        return dbMenusToLocalMenus(await usersCollection.find({ _id: { $in: permissionsObjectIDs } }).toArray());
    })
}

// authCode: ---6826b7e80d62e88cd9215a97---
export async function getAllMenus(roleIds: string[]) {
    checkPermission('6826b7e80d62e88cd9215a97', roleIds)
    return await mongoConnection(async (db) => {
        const usersCollection = db.collection<WithId<MenuItem>>('menus');
        return dbMenusToLocalMenus(await usersCollection.find({}).toArray());
    })
}