import { getUserServer } from "@/app/api/system/user/getListByPage/serverGetUser";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import ClientPage from "./_component/clientPage";
import { checkPermission } from "@/db/mongodb/userCollection";
import { userPermission } from "../../appPagePermission";

export default async function Page() {
  try {
    const headersList = await headers()
    const userData = await getHeadUserData(headersList);
    await checkPermission(userPermission, userData)
    const userListData = await getUserServer(userData);
    return (
      <ClientPage initData={userListData} />
    );
  } catch (error) {
    console.error(error);
    return (error as Error).message || '获取页面失败'
  }
};

export const dynamic = 'force-dynamic'; 