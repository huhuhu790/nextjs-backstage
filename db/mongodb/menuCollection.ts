import { ObjectId, OptionalId } from 'mongodb';
import { dbConnection } from './connection';
import { MenuItem } from '@/types/system/menu';
import { getUniquePermissions } from './userCollection';
import { LocalMenu } from '@/types/api';
import { stringfyIdList } from './utils';

export async function getListByRolesMenus(roleIds: string[]) {
    const db = dbConnection()
    const uniquePermissions = await getUniquePermissions(roleIds, db);
    if (!uniquePermissions) {
        return []
    }
    const permissionsObjectIDs = uniquePermissions.map(id => new ObjectId(id))
    const usersCollection = db.collection<MenuItem>('menus');
    // type不为button
    const menus = await usersCollection.find({ _id: { $in: permissionsObjectIDs }, type: { $ne: 'button' } }).sort({ updatedAt: -1 }).toArray();
    return stringfyIdList(menus);
}

export async function getAllMenus() {
    const db = dbConnection()
    const usersCollection = db.collection<MenuItem>('menus');
    return stringfyIdList(await usersCollection.find({}).sort({ updatedAt: -1 }).toArray());
}

export async function insertOneMenu(menuData: LocalMenu, operatorId: string) {
    const db = dbConnection()
    const usersCollection = db.collection<MenuItem>('menus');
    const date = new Date();
    let record: OptionalId<MenuItem> = {
        name: menuData.name,
        path: menuData.path,
        type: menuData.type,
        iconPath: menuData.iconPath,
        parentId: null,
        createdAt: date,
        createdBy: operatorId,
        updatedAt: date,
        updatedBy: operatorId,
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
}

export async function deleteOneMenu(id: string, operatorId: string) {
    if (!id) throw new Error("目录id不能为空")
    const db = dbConnection()
    const menusCollection = db.collection<MenuItem>('menus');
    const menuItem = await menusCollection.findOne({ _id: new ObjectId(id) })
    if (!menuItem) throw new Error("目录不存在")
    if (menuItem.children && menuItem.children.length > 0) throw new Error("目录下有子目录")
    if (menuItem.parentId) {
        const parentMenu = await menusCollection.findOne({ _id: new ObjectId(menuItem.parentId) })
        if (!parentMenu) throw new Error("父级目录不存在")
        await menusCollection.updateOne({ _id: new ObjectId(menuItem.parentId) }, { $pull: { children: id } })
    }
    return await menusCollection.deleteOne({ _id: new ObjectId(id) })
    // 逻辑删除
    //     const date = new Date();
    // await usersCollection.updateOne({ _id: new ObjectId(id) }, {
    //     $set: {
    //         isDeleted: true,
    //         deletedAt: date,
    //         deletedBy: operatorId,
    //     }
    // })
}

export async function updateOneMenu(menuData: LocalMenu, operatorId: string) {
    const db = dbConnection()
    const usersCollection = db.collection<OptionalId<MenuItem>>('menus');
    const date = new Date();
    const menuItem = await usersCollection.findOne({ _id: new ObjectId(menuData.id) })
    if (!menuItem) throw new Error("目录不存在")
    let record: Partial<MenuItem> = {
        name: menuData.name,
        path: menuData.path,
        type: menuData.type,
        iconPath: menuData.iconPath,
        updatedAt: date,
        updatedBy: operatorId,
    }
    return await usersCollection.updateOne({ _id: new ObjectId(menuData.id) }, { $set: record })
}
