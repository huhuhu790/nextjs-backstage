import { WithId } from "mongodb";

export function stringfyId<T>({ _id, ...rest }: WithId<T>) {
    return {
        id: _id.toString(),
        ...rest
    };
}

export function stringfyIdList<T>(dbDicts: WithId<T>[]) {
    return dbDicts.map(stringfyId);
}