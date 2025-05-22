import { getDictServer } from "@/app/api/system/dict/getDictByPage/serverGetDict";
import { getHeadUserData } from "@/utils/getHeadUserData";
import ClientPage from "./_component/clientpage";

export default async function Page() {
  const userData = await getHeadUserData();
  try {
    const dictData = await getDictServer(userData);
    return (
      <ClientPage initData={dictData} />
    );
  } catch (error) {
    return "fetch data error";
  }
};