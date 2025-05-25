import { LocalDict } from "@/types/api";
import { fetchData } from "../fetchApi";
import { PaginationRequest, PaginationResponse } from "@/types/database";

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