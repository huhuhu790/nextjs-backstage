import { Message, MessageWithID } from "@/types/system/message";
import { dbConnection } from "./connection";
import { User, UserWithID } from "@/types/system/user";
import { PaginationRequest } from "@/types/database";
import { Filter, MongoOperationTimeoutError, WithId } from "mongodb";
import { ObjectId } from "mongodb";
import { LocalMessage } from "@/types/api";
import { stringfyId, stringfyIdList } from "./utils";

export async function getListByPageMessage(user: UserWithID, options?: PaginationRequest) {
    const userId = user.id
    const messageDb = dbConnection()
    const collectionUser = messageDb.collection<User>("users")
    const userInfo = await collectionUser.findOne({ _id: new ObjectId(userId) })
    if (!userInfo) throw new Error('用户不存在')
    const collection = messageDb.collection<Message>("messages")
    const query: Filter<Message> = {
        to: userId
    }
    const currentPage = options?.currentPage
    const pageSize = 10
    const total = await collection.countDocuments(query);
    const messages = currentPage && pageSize ? await collection.aggregate<WithId<Message>>([
        { $match: query },  // 相当于 find(query)
        { $sort: { updatedAt: -1 } },  // 排序
        { $skip: (currentPage - 1) * pageSize },  // 跳过指定数量的文档
        { $limit: pageSize }  // 限制返回的文档数量
    ]).toArray() : await collection.find(query).sort({ updatedAt: -1 }).toArray();
    return {
        data: stringfyIdList(messages),
        total,
        currentPage,
        pageSize
    };
}


export async function sendingMessage(message: Partial<LocalMessage>, operatorId: string) {
    const messageDb = dbConnection()
    const userCollection = messageDb.collection<User>("users")
    const users = await userCollection.find({}).toArray()
    const date = new Date()
    users.forEach(async (user) => {
        const collection = messageDb.collection<Message>("messages")
        await collection.insertOne({
            from: operatorId,
            to: user._id.toString(),
            title: message.title || "",
            content: message.content || "",
            isRead: false,
            type: message.type || 'info',
            createdAt: date,
            createdBy: operatorId,
            updatedAt: date,
            updatedBy: operatorId,
            isDeleted: false,
            deletedAt: null,
            deletedBy: null,
            isActive: true
        })
    })
}


export async function createMessageEventListener(callback: (change: MessageWithID) => void, operatorId: string) {
    const messageDb = dbConnection()
    const collection = messageDb.collection<Message>("messages")
    const changeStream = collection.watch([
        {
            $match: {
                operationType: 'insert',
                'fullDocument.to': operatorId
            }
        }
    ])
        .on('change', (change) => {
            if (change.operationType === 'insert')
                callback(stringfyId(change.fullDocument as WithId<Message>))
        })
        .on('error', e => {
            console.error(e);
            if (e instanceof MongoOperationTimeoutError && !changeStream.closed) {
                // do nothing
            } else {
                changeStream.close();
            }
        });
}