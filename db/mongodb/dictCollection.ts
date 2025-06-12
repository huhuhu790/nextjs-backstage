import { Filter, WithId, ObjectId } from "mongodb";
import { dbConnection } from "./connection";
import { DictItem, DictValue } from "@/types/system/dictionary";
import { PaginationRequest } from "@/types/database";
import { LocalDict } from "@/types/api";

function toLocal({ _id, values, ...rest }: WithId<DictItem>) {
    return {
        id: _id.toString(),
        ...rest,
        values: values.map(value => ({
            ...value,
            _id: value._id!.toString()
        }))
    };
}

function toLocalList(dbDicts: WithId<DictItem>[]) {
    return dbDicts.map(toLocal);
}

export async function getListByPageDict(options?: PaginationRequest) {
    const db = dbConnection()
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
        data: toLocalList(dicts),
        total,
        currentPage,
        pageSize
    };
}

export async function getOneByIdDict(id: string) {
    const db = dbConnection()
    const dictsCollection = db.collection<DictItem>('dictionaries');
    const dict = await dictsCollection.findOne({ _id: new ObjectId(id) });
    if (!dict) throw new Error("字典不存在")
    return toLocal(dict);
}

export async function insertOneDict(data: LocalDict, operatorId: string) {
    const db = dbConnection()
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

export async function updateOneDict(data:LocalDict, operatorId: string) {
    const db = dbConnection()
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

export async function deleteOneDict(id: string, operatorId: string) {
    const db = dbConnection()
    const collection = db.collection<DictItem>("dictionaries");
    const dictItem = await collection.findOne({ _id: new ObjectId(id) })
    if (!dictItem) throw new Error("字典不存在")
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result;
}

export async function deleteOneDictValue(valueId: string, dictId: string, operatorId: string) {
    const db = dbConnection()
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

export async function updateOneDictValue(value: DictValue, dictId: string, operatorId: string) {
    const db = dbConnection()
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

export async function insertOneDictValue(value: DictValue, dictId: string, operatorId: string) {
    const db = dbConnection()
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
