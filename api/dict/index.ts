import { LocalDict } from "@/types/api";
import { fetchData } from "../fetchApi";
import { PaginationRequest, PaginationResponse } from "@/types/database";
import { DictValue } from "@/types/system/dictionary";

export function getDictList(body: PaginationRequest) {
    return fetchData<PaginationResponse<LocalDict[]>, PaginationRequest>("/api/system/dict/getDictByPage", {
        body,
        showMessage: false
    });
}

export function addDict(data: LocalDict) {
    return fetchData<null, LocalDict>("/api/system/dict/addDictSingle", {
        body: data
    });
}

export function updateDict(data: LocalDict) {
    return fetchData<null, LocalDict>("/api/system/dict/updateDictSingle", {
        body: data
    });
}

export function deleteDict(id: string) {
    return fetchData<null, { id?: string }>("/api/system/dict/deleteDictSingle", {
        body: { id }
    });
}

export function addDictValue(data: DictValue, dictId: string) {
    return fetchData<null, { value: DictValue, dictId: string }>("/api/system/dict/addDictValueSingle", {
        body: { value: data, dictId }
    });
}


export function updateDictValue(data: DictValue, dictId: string) {
    return fetchData<null, { value: DictValue, dictId: string }>("/api/system/dict/updateDictValueSingle", {
        body: { value: data, dictId }
    });
}


export function deleteDictValue(valueId: string, dictId: string) {
    return fetchData<null, { valueId: string, dictId: string }>("/api/system/dict/deleteDictValueSingle", {
        body: { valueId, dictId }
    });
}

export function getDictSingle(dictId: string) {
    return fetchData<LocalDict, { id: string }>("/api/system/dict/getDictSingle", {
        body: { id: dictId },
        showMessage: false
    });
}
