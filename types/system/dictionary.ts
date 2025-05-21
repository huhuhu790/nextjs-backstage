import { DefaultModel } from "@/types/database";

// 字典值类型
export interface DictValue {
    name: string;
    discription: string;
    value: string;
    isActive: boolean;
}

// 数据库原始字典类型
export interface DictItem extends DefaultModel{
    name: string;
    discription: string;
    values: DictValue[];
}