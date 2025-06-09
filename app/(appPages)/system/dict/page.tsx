import { getDictServer } from "@/app/api/system/dict/getListByPage/serverGetDict";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import ClientPage from "./_component/clientPage";
import { dictPermission } from "../../appPagePermission";
import { checkPermission } from "@/db/mongodb/userCollection";

export default async function Page() {
  try {
    const headersList = await headers()
    const userData = await getHeadUserData(headersList);
    await checkPermission(dictPermission, userData)
    const dictData = await getDictServer(userData);
    return (
      <ClientPage initData={dictData} />
    );
  } catch (error) {
    console.error(error);
    return (error as Error).message || '获取页面失败'
  }
};

export const dynamic = 'force-dynamic'; 