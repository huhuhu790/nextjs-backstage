import { getUserServer } from "@/app/api/system/user/getUserByPage/serverGetUser";
import { getHeadUserData } from "@/utils/getHeadUserData";
import ClientPage from "./_component/clientPage";
import { checkPermission } from "@/db/mongodb/userCollection";
import { userPermission } from "../../appPagePermission";

export default async function Page() {
  try {
    const userData = await getHeadUserData();
    await checkPermission(userPermission, userData)
    const userListData = await getUserServer(userData);
    return (
      <ClientPage initData={userListData} />
    );
  } catch (error) {
    console.log(error);
    return (error as Error).message || '获取页面失败'
  }
};