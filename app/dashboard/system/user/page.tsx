import { getUserServer } from "@/app/api/system/user/getUserByPage/serverGetUser";
import { getHeadUserData } from "@/utils/getHeadUserData";
import ClientPage from "./_component/clientpage";

export default async function Page() {
  const userData = await getHeadUserData();
  try {
    const userListData = await getUserServer(userData);
    return (
      <ClientPage initData={userListData} />
    );
  } catch (error) {
    return "fetch data error";
  }
};