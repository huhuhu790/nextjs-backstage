import { Message } from "@/types/system/message";
import { dbConnectionMessage } from "./connection";
import { UserWithID } from "@/types/system/user";
import { PaginationRequest } from "@/types/database";
import { Filter } from "mongodb";

export async function createMessageCollection(userId: string) {
    const messageDb = await dbConnectionMessage()
    const colectionName = `message_${userId}`
    return await messageDb.createCollection(colectionName)
}

export async function deleteMessageCollection(userId: string) {
    const messageDb = await dbConnectionMessage()
    const colectionName = `message_${userId}`
    await messageDb.dropCollection(colectionName)
}

const defaultPageSize = 10
const defaultCurrentPage = 1
export async function getMessageByPage(user: UserWithID, options: PaginationRequest) {
    const messageDb = await dbConnectionMessage()
    const colectionName = `message_${user.id}`
    const collection = messageDb.collection<Message>(colectionName)
    const query: Filter<Message> = {}
    if (options.keyword) {
        query.$or = [
            { title: { $regex: options.keyword, $options: 'i' } },
            { content: { $regex: options.keyword, $options: 'i' } },
        ]
    }
    const currentPage = options?.currentPage || defaultCurrentPage
    const pageSize = options?.pageSize || defaultPageSize
    const total = await collection.countDocuments(query);
    const messages = await collection.find(query)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .toArray()
    return {
        data: messages,
        total,
        currentPage,
        pageSize
    };
}


