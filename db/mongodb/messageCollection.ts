import { Message, MessageWithID } from "@/types/system/message";
import { dbConnectionMes } from "./connection";
import { User, UserWithID } from "@/types/system/user";
import { PaginationRequest } from "@/types/database";
import { Filter, MongoOperationTimeoutError, WithId } from "mongodb";
import { ObjectId } from "mongodb";
import { LocalMessage } from "@/types/api";

function dbMessageToLocalMessage(dbMessage: WithId<Message>): MessageWithID {
    return {
        id: dbMessage._id.toString(),
        ...dbMessage,
    };
}

function dbMessagesToLocalMessages(dbMessages: WithId<Message>[]): MessageWithID[] {
    return dbMessages.map(dbMessageToLocalMessage);
}

export async function getMessageListByPage(user: UserWithID, options: PaginationRequest) {
    const userId = user.id
    if (!userId) throw new Error('用户未登录')
    const messageDb = await dbConnectionMes()
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
    const messages = currentPage && pageSize ? await collection.find(query)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .toArray() : await collection.find(query).toArray();
    return {
        data: dbMessagesToLocalMessages(messages),
        total,
        currentPage,
        pageSize
    };
}


export async function sendingMessage(message: Partial<LocalMessage>, operatorId: string) {
    if (!message) throw new Error('消息不能为空')
    if (!message.title) throw new Error('消息标题不能为空')
    if (!message.content) throw new Error('消息内容不能为空')
    const messageDb = await dbConnectionMes()
    const userCollection = messageDb.collection<User>("users")
    const users = await userCollection.find({}).toArray()
    const date = new Date()
    users.forEach(async (user) => {
        const collection = messageDb.collection<Message>("messages")
        await collection.insertOne({
            from: operatorId,
            to: user._id.toString(),
            title: message.title!,
            content: message.content!,
            isRead: false,
            type: 'info',
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


export async function createMessageEventListner(callback: (change: MessageWithID) => void, operatorId: string) {
    const messageDb = await dbConnectionMes()
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
                callback(dbMessageToLocalMessage(change.fullDocument as WithId<Message>))
        })
        .on('error', e => {
            console.log(e);
            if (e instanceof MongoOperationTimeoutError && !changeStream.closed) {
                // do nothing
            } else {
                changeStream.close();
            }
        });
}