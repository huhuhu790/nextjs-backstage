import { Filter, WithId, ObjectId } from "mongodb";
import { dbConnectionMes } from "./connection";
import { DictItem, DictValue } from "@/types/system/dictionary";
import { PaginationRequest } from "@/types/database";
import { LocalDict, updateDictValueDataType } from "@/types/api";

function dbDictToLocalDict({ _id, values, ...rest }: WithId<DictItem>) {
    return {
        id: _id.toString(),
        ...rest,
        values: values.map(value => ({
            ...value,
            _id: value._id!.toString()
        }))
    };
}

function dbDictsToLocalDicts(dbDicts: WithId<DictItem>[]) {
    return dbDicts.map(dbDictToLocalDict);
}

export async function getDictByPage(options?: PaginationRequest) {
    const db = await dbConnectionMes()
    const dictsCollection = db.collection<DictItem>('dictionaries');
    const query: Filter<DictItem> = {};
    if (options?.keyword) {
        query.$or = [
            { name: { $regex: options.keyword, $options: 'i' } },
            { description: { $regex: options.keyword, $options: 'i' } }
        ];
    }
    const currentPage = options?.currentPage
    const pageSize = options?.pageSize
    const total = await dictsCollection.countDocuments(query);
    const dicts = currentPage && pageSize ? await dictsCollection.find(query)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .toArray() : await dictsCollection.find(query).toArray();
    return {
        data: dbDictsToLocalDicts(dicts),
        total,
        currentPage,
        pageSize
    };
}

export async function getDictSingleById(id: string) {
    if (!id) throw new Error("字典ID不能为空")
    const db = await dbConnectionMes()
    const dictsCollection = db.collection<DictItem>('dictionaries');
    const dict = await dictsCollection.findOne({ _id: new ObjectId(id) });
    if (!dict) throw new Error("字典不存在")
    return dbDictToLocalDict(dict);
}

export async function createDictSingle(data: Partial<LocalDict>, operatorId: string) {
    if (!data.name) throw new Error("字典名称不能为空")
    const db = await dbConnectionMes()
    const date = new Date();
    const collection = db.collection<DictItem>("dictionaries");
    const result = await collection.insertOne({
        name: data.name,
        description: data.description || "",
        values: [],
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

export async function updateDictSingle(data: Partial<LocalDict>, operatorId: string) {
    if (!data.id) throw new Error("字典ID不能为空")
    if (!data.name) throw new Error("字典名称不能为空")
    const db = await dbConnectionMes()
    const date = new Date();
    const collection = db.collection<DictItem>("dictionaries");
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

export async function deleteDictSingle(id: string, operatorId: string) {
    if (!id) throw new Error("字典ID不能为空")
    const db = await dbConnectionMes()
    const collection = db.collection<DictItem>("dictionaries");
    const dictItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!dictItem) throw new Error("字典不存在")
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
}

export async function deleteDictValueSingle(valueId: string, dictId: string, operatorId: string) {
    if (!valueId) throw new Error("字典值ID不能为空")
    if (!dictId) throw new Error("字典ID不能为空")
    const db = await dbConnectionMes()
    const collection = db.collection<DictItem>("dictionaries");
    const dictItem = await collection.findOne({ _id: new ObjectId(dictId) })
    if (!dictItem) throw new Error("字典不存在")
    const result = await collection.updateOne(
        { _id: new ObjectId(dictId) },
        {
            $pull: { values: { _id: new ObjectId(valueId) } },
            $set: {
                updatedAt: new Date(),
                updatedBy: operatorId,
            }
        }
    )
    return result
}

export async function updateDictValueSingle(value: DictValue, dictId: string, operatorId: string) {
    if (!dictId) throw new Error("字典表ID不能为空")
    if (!value._id) throw new Error("字典值ID不能为空")
    if (!value.name) throw new Error("字典值名称不能为空")
    if (!value.value) throw new Error("字典值不能为空")
    const db = await dbConnectionMes()
    const collection = db.collection<DictItem>("dictionaries");
    const dictItem = await collection.findOne({ _id: new ObjectId(dictId) })
    if (!dictItem) throw new Error("字典表不存在")
    const date = new Date();
    const valueResult = await collection.updateOne(
        {
            _id: new ObjectId(dictId),
            "values._id": new ObjectId(value._id)
        },
        {
            $set: {
                "values.$.name": value.name,
                "values.$.value": value.value,
                "values.$.description": value.description,
            },
        }
    )
    const result = await collection.updateOne(
        { _id: new ObjectId(dictId) },
        {
            $set: { updatedAt: date, updatedBy: operatorId }
        }
    )
    return result
}

export async function addDictValueSingle(value: DictValue, dictId: string, operatorId: string) {
    if (!dictId) throw new Error("字典表ID不能为空")
    if (!value.name) throw new Error("字典值名称不能为空")
    if (!value.value) throw new Error("字典值不能为空")
    const db = await dbConnectionMes()
    const collection = db.collection<DictItem>("dictionaries");
    const dictItem = await collection.findOne({ _id: new ObjectId(dictId) })
    if (!dictItem) throw new Error("字典表不存在")
    const result = await collection.updateOne(
        { _id: new ObjectId(dictId) },
        {
            $push: {
                values: {
                    _id: new ObjectId(),
                    name: value.name,
                    value: value.value,
                    description: value.description || "",
                    isActive: value.isActive || true,
                }
            },
            $set: { updatedAt: new Date(), updatedBy: operatorId }
        }
    )
    return result
}
