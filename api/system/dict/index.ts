import { LocalDict } from "@/types/api";
import { fetchData } from "../../fetchApi";
import { PaginationRequest, PaginationResponse } from "@/types/database";
import { DictValue } from "@/types/system/dictionary";
import { MessageInstance } from "antd/lib/message/interface";

export function getDictList(body: PaginationRequest) {
    return fetchData<PaginationResponse<LocalDict[]>, PaginationRequest>("/api/system/dict/getListByPage", {
        body
    });
}

export function addDict(data: LocalDict, message: MessageInstance) {
    return fetchData<null, LocalDict>("/api/system/dict/insert", {
        body: data, message
    });
}

export function updateDict(data: LocalDict, message: MessageInstance) {
    return fetchData<null, LocalDict>("/api/system/dict/update", {
        body: data, message
    });
}

export function deleteDict(id: string, message: MessageInstance) {
    return fetchData<null, { id?: string }>("/api/system/dict/delete", {
        body: { id }, message
    });
}

export function addDictValue(data: DictValue, dictId: string, message: MessageInstance) {
    return fetchData<null, { value: DictValue, dictId: string }>("/api/system/dict/value/insert", {
        body: { value: data, dictId }, message
    });
}


export function updateDictValue(data: DictValue, dictId: string, message: MessageInstance) {
    return fetchData<null, { value: DictValue, dictId: string }>("/api/system/dict/value/update", {
        body: { value: data, dictId }, message
    });
}


export function deleteDictValue(valueId: string, dictId: string, message: MessageInstance) {
    return fetchData<null, { valueId: string, dictId: string }>("/api/system/dict/value/delete", {
        body: { valueId, dictId }, message
    });
}

export function getDictSingle(dictId: string) {
    return fetchData<LocalDict, { id: string }>("/api/system/dict/getOne", {
        body: { id: dictId }
    });
}
