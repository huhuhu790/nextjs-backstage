import { OptionalLocalId } from "@/types/api";
import { BasicDict, DictValue } from "@/types/system/dictionary";

export type DictDrawerDataType = OptionalLocalId<BasicDict>

export type DictValueDrawerDataType = {
    id: string,
    values: OptionalLocalId<DictValue>[]
}