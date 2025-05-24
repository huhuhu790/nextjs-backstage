import { Filter, WithId, ObjectId } from "mongodb";
import { dbConnectionMes } from "./connection";
import { DictItem } from "@/types/system/dictionary";
import { PaginationRequest } from "@/types/database";
import { DictDrawerDataType, DictValueDrawerDataType } from "@/app/dashboard/system/dict/_component/dictPageType";
import { TZDate } from "@date-fns/tz";

function dbDictsToLocalDicts(dbDicts: WithId<DictItem>[]) {
    return dbDicts.map(({ _id, ...rest }) => {
        return {
            id: _id.toString(),
            ...rest,
        };
    });
}

const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getDictByPage(options?: Partial<PaginationRequest>) {
    const db = await dbConnectionMes()
    const dictsCollection = db.collection<DictItem>('dictionaries');
    const query: Filter<DictItem> = {};
    if (options?.keyword) {
        query.$or = [
            { name: { $regex: options.keyword, $options: 'i' } },   
            { discription: { $regex: options.keyword, $options: 'i' } }
        ];
    }
    const currentPage = options?.currentPage || defaultCurrentPage
    const pageSize = options?.pageSize || defaultPageSize
    const total = await dictsCollection.countDocuments(query);
    const dicts = await dictsCollection.find(query)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .toArray();
    return {
        data: dbDictsToLocalDicts(dicts),
        total,
        currentPage,
        pageSize
    };
}

export async function createDictSingle(data: DictDrawerDataType, operatorId: string) {
    const db = await dbConnectionMes()
    if (!data.name) throw new Error("字典名称不能为空")
    const date = TZDate.tz("Asia/Shanghai");
    const collection = db.collection<DictItem>("dictionaries");
    const result = await collection.insertOne({
        name: data.name,
        discription: data.discription || "",
        values: data.values || [],
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

export async function updateDictSingle(data: DictDrawerDataType, operatorId: string) {
    const db = await dbConnectionMes()
    if (!data.id) throw new Error("字典ID不能为空")
    if (!data.name) throw new Error("字典名称不能为空")
    const date = TZDate.tz("Asia/Shanghai");
    const collection = db.collection<DictItem>("dictionaries");
    const result = await collection.updateOne(
        { _id: new ObjectId(data.id) },
        {
            $set: {
                name: data.name,
                discription: data.discription || "",
                updatedAt: date,
                updatedBy: operatorId,
            }
        }
    );
    return result;
}

export async function updateDictValueSingle(data: DictValueDrawerDataType, operatorId: string) {
    const db = await dbConnectionMes()
    if (!data.id) throw new Error("字典表ID不能为空")
    const collection = db.collection<DictItem>("dictionaries");
    const dictItem = await collection.findOne({ _id: new ObjectId(data.id) })
    if (!dictItem) throw new Error("字典表不存在")
    const values = data.values.map(record => {
        const { id, name, discription, value, isActive } = record;
        if (!name) throw new Error("字典值名称不能为空")
        if (!value) throw new Error("字典值不能为空")
        if (!isActive) throw new Error("字典值状态不能为空")
        const _id = id ? new ObjectId(id) : new ObjectId()
        return { _id, name, discription, value, isActive }
    })
    const date = TZDate.tz("Asia/Shanghai");
    const result = await collection.updateOne(
        { _id: new ObjectId(data.id) },
        {
            $set: { values },
            updatedAt: date,
            updatedBy: operatorId,
        }
    )
    return result
}

export async function deleteDictSingle(id: string, operatorId: string) {
    const db = await dbConnectionMes()
    if (!id) throw new Error("字典ID不能为空")
    const collection = db.collection<DictItem>("dictionaries");
    const dictItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!dictItem) throw new Error("字典不存在")
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
} 