import { DefaultModel } from "./database";

export interface DictValue {
    name: string;
    discription: string;
    value: string;
    status: boolean;
}

export interface DictItem extends DefaultModel{
    name: string;
    discription: string;
    values: DictValue[];
}