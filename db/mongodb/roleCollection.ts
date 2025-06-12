import { Filter, WithId, ObjectId } from "mongodb";
import { dbConnection } from "./connection";
import { RoleItem, RoleItemWithID } from "@/types/system/role";
import { PaginationRequest } from "@/types/database";
import { User } from "@/types/system/user";
import { LocalRole } from "@/types/api";

function toLocalList(dbRoles: WithId<RoleItem>[]): RoleItemWithID[] {
    return dbRoles.map(({ _id, ...rest }) => {
        return {
            id: _id.toString(),
            ...rest,
        };
    });
}


export async function getListByPageRole(options?: Partial<PaginationRequest>) {
    const db = dbConnection()
    const usersCollection = db.collection<RoleItem>('roles');
    const query: Filter<RoleItem> = {};
    if (options?.keyword) {
        query.$or = [
            { name: { $regex: options.keyword, $options: 'i' } },
            { description: { $regex: options.keyword, $options: 'i' } }
        ];
    }
    const currentPage = options?.currentPage
    const pageSize = options?.pageSize
    const total = await usersCollection.countDocuments(query);
    const roles = currentPage && pageSize ? await usersCollection.find(query)
        .sort({ updatedAt: -1 })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .toArray() : await usersCollection.find(query).sort({ updatedAt: -1 }).toArray();
    return {
        data: toLocalList(roles),
        total,
        currentPage,
        pageSize
    };
}

export async function insertOneRole(data: LocalRole, operatorId: string) {
    const db = dbConnection()
    const date = new Date();
    const collection = db.collection<RoleItem>("roles");
    const result = await collection.insertOne({
        name: data.name,
        description: data.description || "",
        permissions: [],
        users: [],
        createdAt: date,
        updatedAt: date,
        createdBy: operatorId,
        updatedBy: operatorId,
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
        isActive: true
    });
    return result;
}

export async function updateOneRole(data: LocalRole, operatorId: string) {
    const db = dbConnection()
    const date = new Date();
    const collection = db.collection<RoleItem>("roles");
    const roleItem = await collection.findOne({ _id: new ObjectId(data.id) })
    if (!roleItem) throw new Error("角色不存在")
    const result = await collection.updateOne(
        { _id: new ObjectId(data.id) },
        {
            $set: {
                name: data.name,
                description: data.description || "",
                updatedAt: date,
                updatedBy: operatorId,
            }
        }
    );
    return result;
}

export async function updatePermissionToRole(id: string, permissions: string[], operatorId: string) {
    if (!id) throw new Error("角色ID不能为空")
    if (!permissions) throw new Error("权限不能为空")
    const db = dbConnection()
    const date = new Date();
    const collection = db.collection<RoleItem>("roles");
    const roleItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!roleItem) throw new Error("角色不存在")
    const result = await collection.updateOne({ _id: new ObjectId(id) }, {
        $set: {
            permissions,
            updatedAt: date,
            updatedBy: operatorId,
        }
    });
    return result;
}
export async function deleteOneRole(id: string, operatorId: string) {
    if (!id) throw new Error("角色ID不能为空")
    const db = dbConnection()
    const collection = db.collection<RoleItem>("roles");
    const roleItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!roleItem) throw new Error("角色不存在")
    const userList = roleItem.users
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    const userCollection = db.collection<User>("users");
    const date = new Date();
    await userCollection.updateMany({
        _id: { $in: userList.map(id => new ObjectId(id)) }
    }, {
        $pull: {
            roles: id
        },
        $set: {
            updatedAt: date,
            updatedBy: operatorId,
        }
    });
    return result;
}

export async function addUserToRole(id: string, userIds: string[], operatorId: string) {
    const db = dbConnection()
    const collection = db.collection<RoleItem>("roles");
    const roleItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!roleItem) throw new Error("角色不存在")
    const date = new Date();
    await collection.updateOne({ _id: new ObjectId(id) }, {
        $addToSet: {
            users: { $each: userIds }
        },
        $set: {
            updatedAt: date,
            updatedBy: operatorId,
        }
    });
    const userCollection = db.collection<User>("users");
    await userCollection.updateMany({
        _id: { $in: userIds.map(id => new ObjectId(id)) }
    }, {
        $push: {
            roles: id
        },
        $set: {
            updatedAt: date,
            updatedBy: operatorId,
        }
    });
}

export async function removeUserFromRole(id: string, userIds: string[], operatorId: string) {
    const db = dbConnection()
    const collection = db.collection<RoleItem>("roles");
    const roleItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!roleItem) throw new Error("角色不存在")
    const date = new Date();
    await collection.updateOne({ _id: new ObjectId(id) }, {
        $pull: {
            users: { $in: userIds }
        },
        $set: {
            updatedAt: date,
            updatedBy: operatorId,
        }
    });
    const userCollection = db.collection<User>("users");
    await userCollection.updateMany({
        _id: { $in: userIds.map(id => new ObjectId(id)) }
    }, {
        $pull: {
            roles: id
        },
        $set: {
            updatedAt: date,
            updatedBy: operatorId,
        }
    });
}
