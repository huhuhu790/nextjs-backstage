import { OptionalLocalId } from "@/types/api";
import { BasicUser } from "@/types/system/user";

export type UserDrawerDataType = Omit<OptionalLocalId<BasicUser>, "password">

export type UserTableDataType = OptionalLocalId<BasicUser> & { key: string }