import { getRoleServer } from "@/app/api/system/role/getRoleByPage/serverGetRole";
import ClientPage from "./_component/clientPage";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { checkPermission } from "@/db/mongodb/userCollection";
import { rolePermission } from "../../appPagePermission";

export default async function Page() {
  try {
    const userData = await getHeadUserData();
    await checkPermission(rolePermission, userData)
    const roleData = await getRoleServer(userData);
    return (
      <ClientPage initData={roleData} />
    );
  } catch (error) {
    console.log(error);
    return (error as Error).message || '获取页面失败'
  }
};