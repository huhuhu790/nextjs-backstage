import { getHeadUserData } from "@/utils/getHeadUserData";
import ClientPage from "./_component/clientPage";
import { getMessageServer } from "@/app/api/system/message/getMessageListByPage/getMessageServer";

export default async function Page() {
  try {
    const userData = await getHeadUserData();
    const dictData = await getMessageServer(userData);
    return (
      <ClientPage initData={dictData} />
    );
  } catch (error) {
    console.log(error);
    return (error as Error).message || '获取页面失败'
  }
};