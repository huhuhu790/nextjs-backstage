import { IconType } from "antd/es/notification/interface";
import { WithLocalId } from "../api";
import { DefaultModel } from "../database"

export interface BasicMessage {
    from: string;
    to: string;
    title: string;
    content: string;
    isRead: boolean;
    type: IconType;
    code?: number;
}

export interface Message extends DefaultModel, BasicMessage { }

export type MessageWithID = WithLocalId<BasicMessage>
