import { OptionalLocalId } from "@/types/api";
import { BasicMenu } from "@/types/system/menu";

export type MenuTableDataType = OptionalLocalId<Omit<BasicMenu, "children">> & {
    key: string,
    children?: MenuTableDataType[]
}

export type MenuDataBasic = OptionalLocalId<BasicMenu>