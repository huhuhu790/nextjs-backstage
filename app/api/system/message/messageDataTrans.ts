import { LocalMessage } from "@/types/api";
import { MessageWithID } from "@/types/system/message";

export function toLocalMessage(message: MessageWithID): LocalMessage {
    return {
        id: message.id,
        title: message.title,
        content: message.content,
        from: message.from,
        to: message.to,
        isRead: message.isRead,
        type: message.type,
    }
}

export function toLocalMessageList(messages: MessageWithID[]): LocalMessage[] {
    return messages.map(toLocalMessage)
}
