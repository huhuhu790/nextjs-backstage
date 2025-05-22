import { Filter, WithId, ObjectId } from "mongodb";
import { mongoConnection } from "./connection";
import { RoleItem, RoleItemWithID } from "@/types/system/role";
import { PaginationRequest } from "@/types/database";
import { RoleDataBasic } from "@/app/dashboard/system/role/_component/rolePageType";
import { TZDate } from "@date-fns/tz";

function dbRolesToLocalRoles(dbRoles: WithId<RoleItem>[]): RoleItemWithID[] {
    return dbRoles.map(({ _id, ...rest }) => {
        return {
            id: _id.toString(),
            ...rest, 
        };
    });
}

const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getRoleByPage(options?: Partial<PaginationRequest>) {
    return await mongoConnection(async (db) => {
        const usersCollection = db.collection<RoleItem>('roles');
        const query: Filter<RoleItem> = {};
        if (options?.keyword) {
            query.$or = [
                { name: { $regex: options.keyword, $options: 'i' } },
                { description: { $regex: options.keyword, $options: 'i' } }
            ];
        }
        const currentPage = options?.currentPage || defaultCurrentPage
        const pageSize = options?.pageSize || defaultPageSize
        const total = await usersCollection.countDocuments(query);
        const roles = await usersCollection.find(query)
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)
            .toArray();
        return {
            data: dbRolesToLocalRoles(roles),
            total,
            currentPage,
            pageSize
        };
    })
}

export async function createRoleSingle(data: RoleDataBasic, userId: string) {
    return await mongoConnection(async (db) => {
        if (!data.name) throw new Error("角色名称不能为空")
        const date = TZDate.tz("Asia/Shanghai");
        const collection = db.collection<RoleItem>("roles");
        const result = await collection.insertOne({
            name: data.name,
            description: data.description || "",
            permissions: [],
            users: [],
            createdAt: date,
            updatedAt: date,
            createdBy: userId,
            updatedBy: userId,
            isDeleted: false,
            deletedAt: null,
            deletedBy: null,
            isActive: true
        });
        return result;
    })
}

export async function updateRoleSingle(data: RoleDataBasic, userId: string) {
    return await mongoConnection(async (db) => {
        if (!data.id) throw new Error("角色ID不能为空")
        if (!data.name) throw new Error("角色名称不能为空")
        const date = TZDate.tz("Asia/Shanghai");
        const collection = db.collection<RoleItem>("roles");
        const result = await collection.updateOne(
            { _id: new ObjectId(data.id) },
            {
                $set: {
                    name: data.name,
                    description: data.description || "",
                    updatedAt: date,
                    updatedBy: userId,
                }
            }
        );
        return result;
    })
}

export async function deleteRoleSingle(id: string, userId: string) {
    return await mongoConnection(async (db) => {
        if (!id) throw new Error("角色ID不能为空")
        const collection = db.collection<RoleItem>("roles");
        const roleItem = await collection.findOne({ _id: new ObjectId(id) })
        if (!roleItem) throw new Error("角色不存在")
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        return result;
    })
}