import { ObjectId, WithId, OptionalId } from 'mongodb';
import { mongoConnection } from './connection';
import { MenuItem, MenuItemWithID } from '@/types/system/menu';
import { getUniquePermissions } from './userCollection';
import { MenuClientDataSendType } from '@/app/api/system/menu/menuClientDataSend';
import { TZDate } from '@date-fns/tz';

function dbMenusToLocalMenus(dbMenus: WithId<MenuItem>[]): MenuItemWithID[] {
    return dbMenus.map(({ _id, ...rest }) => {
        return {
            id: _id.toString(),
            ...rest, // 保留其他字段
        };
    });
}

export async function getMenusByRoles(roleIds: string[]) {
    return await mongoConnection(async (db) => {
        const uniquePermissions = await getUniquePermissions(roleIds, db);
        if (!uniquePermissions) {
            return []
        }
        const permissionsObjectIDs = uniquePermissions.map(id => new ObjectId(id))
        const usersCollection = db.collection<MenuItem>('menus');
        // type不为button
        const menus = await usersCollection.find({ _id: { $in: permissionsObjectIDs }, type: { $ne: 'button' } }).toArray();
        return dbMenusToLocalMenus(menus);
    })
}

export async function getAllMenus() {
    return await mongoConnection(async (db) => {
        const usersCollection = db.collection<MenuItem>('menus');
        return dbMenusToLocalMenus(await usersCollection.find({}).toArray());
    })
}

export async function createSingleMenu(menuData: Partial<MenuClientDataSendType>, userId: string) {
    return await mongoConnection(async (db) => {
        const usersCollection = db.collection<MenuItem>('menus');
        if (!menuData.name) throw new Error("目录名称不能为空")
        if (!menuData.path) throw new Error("目录路径不能为空")
        if (!menuData.type) throw new Error("目录类型不能为空")
        if (!menuData.iconPath) throw new Error("目录图标不能为空")
        const date = TZDate.tz("Asia/Shanghai");
        let record: OptionalId<MenuItem> = {
            name: menuData.name,
            path: menuData.path,
            type: menuData.type,
            iconPath: menuData.iconPath,
            parentId: null,
            createdAt: date,
            createdBy: userId,
            updatedAt: date,
            updatedBy: userId,
            isDeleted: false,
            deletedAt: null,
            deletedBy: null,
            isActive: true,
        }
        if (menuData.parentId) {
            const parentMenu = await usersCollection.findOne({ _id: new ObjectId(menuData.parentId) })
            if (!parentMenu) throw new Error("父级目录不存在")
            record.parentId = menuData.parentId;
            record._id = new ObjectId();
            const recordId = record._id.toString();
            await usersCollection.updateOne({ _id: new ObjectId(menuData.parentId) }, { $push: { children: recordId } })
        }
        return await usersCollection.insertOne(record)
    })
}

export async function deleteSingleMenu(id: string, userId: string) {
    return await mongoConnection(async (db) => {
        const usersCollection = db.collection<MenuItem>('menus');
        const menuItem = await usersCollection.findOne({ _id: new ObjectId(id) })
        if (!menuItem) throw new Error("目录不存在")
        if (menuItem.children && menuItem.children.length > 0) throw new Error("目录下有子目录")
        if (menuItem.parentId) {
            const parentMenu = await usersCollection.findOne({ _id: new ObjectId(menuItem.parentId) })
            if (!parentMenu) throw new Error("父级目录不存在")
            await usersCollection.updateOne({ _id: new ObjectId(menuItem.parentId) }, { $pull: { children: id } })
        }
        return await usersCollection.deleteOne({ _id: new ObjectId(id) })
        // 逻辑删除
        // const date = TZDate.tz("Asia/Shanghai");
        // await usersCollection.updateOne({ _id: new ObjectId(id) }, {
        //     $set: {
        //         isDeleted: true,
        //         deletedAt: date,
        //         deletedBy: userId,
        //     }
        // })
    })
}

export async function updateSingleMenu(menuData: Partial<MenuClientDataSendType>, userId: string) {
    return await mongoConnection(async (db) => {
        const usersCollection = db.collection<OptionalId<MenuItem>>('menus');
        if (!menuData.id) throw new Error("目录id不能为空")
        if (!menuData.name) throw new Error("目录名称不能为空")
        if (!menuData.path) throw new Error("目录路径不能为空")
        if (!menuData.type) throw new Error("目录类型不能为空")
        if (!menuData.iconPath) throw new Error("目录图标不能为空")
        const date = TZDate.tz("Asia/Shanghai");
        const menuItem = await usersCollection.findOne({ _id: new ObjectId(menuData.id) })
        if (!menuItem) throw new Error("目录不存在")
        let record: Partial<MenuItem> = {
            name: menuData.name,
            path: menuData.path,
            type: menuData.type,
            iconPath: menuData.iconPath,
            updatedAt: date,
            updatedBy: userId,
        }
        return await usersCollection.updateOne({ _id: new ObjectId(menuData.id) }, { $set: record })
    })
}
