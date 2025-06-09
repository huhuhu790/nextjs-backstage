import { getAllMenusServer } from "@/app/api/system/menu/getListByPage/serverGetMenu";
import ClientPage from "./_component/clientPage";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { checkPermission } from "@/db/mongodb/userCollection";
import { menuPermission } from "../../appPagePermission";

export default async function Page() {
  try {
    const headersList = await headers()
    const userData = await getHeadUserData(headersList);
    await checkPermission(menuPermission, userData)
    const menuData = await getAllMenusServer(userData);
    return (
      <ClientPage initData={menuData} />
    );
  } catch (error) {
    console.error(error);
    return (error as Error).message || '获取页面失败'
  }
};

export const dynamic = 'force-dynamic'; 