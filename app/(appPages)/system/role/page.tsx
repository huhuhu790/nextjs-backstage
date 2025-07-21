import { getRoleServer } from "@/app/api/system/role/getListByPage/serverGetRole";
import ClientPage from "./_component/clientPage";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import { checkPermission } from "@/db/mongodb/userCollection";
import { rolePermission } from "../../../../utils/appPagePermission";

export default async function Page() {
  try {
    const headersList = await headers()
    const userData = await getHeadUserData(headersList);
    await checkPermission(rolePermission, userData)
    const roleData = await getRoleServer(userData);
    return (
      <ClientPage initData={roleData} />
    );
  } catch (error) {
    console.error(error);
    return (error as Error).message || '获取页面失败'
  }
};

export const dynamic = 'force-dynamic'; 