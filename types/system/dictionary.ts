import { DefaultModel } from "@/types/database";
import { WithLocalId } from "../api";

export interface BasicDict {
    name: string;
    description: string;
    values: DictValue[];
}

// 字典值类型
export interface DictValue {
    name: string;
    description: string;
    value: string;
    isActive: boolean;
}

// 数据库原始字典类型
export interface DictItem extends DefaultModel,BasicDict {}

export type DictItemWithID = WithLocalId<DictItem>
