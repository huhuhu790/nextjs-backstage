import { OptionalLocalId } from "@/types/api";
import { BasicRole } from "@/types/system/role";

export type RoleTableDataType = OptionalLocalId<BasicRole> & { key: string }

export type RoleDataBasic = OptionalLocalId<BasicRole>