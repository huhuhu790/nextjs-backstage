import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
import ClientPage from "./_component/clientPage";
import { getMessageServer } from "@/app/api/system/message/getListByPage/getMessageServer";

export default async function Page() {
  try {
    const headersList = await headers()
    const userData = await getHeadUserData(headersList);
    const dictData = await getMessageServer(userData);
    return (
      <ClientPage initData={dictData} />
    );
  } catch (error) {
    console.error(error);
    return (error as Error).message || '获取页面失败'
  }
};

export const dynamic = 'force-dynamic'; 