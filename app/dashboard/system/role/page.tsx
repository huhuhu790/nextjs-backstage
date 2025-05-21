import { getRoleAllServer } from "@/app/api/system/role/getRoleAll/serverGetRole";
import ClientPage from "./_component/clientpage";
import { getHeadUserData } from "@/utils/getHeadUserData";

export default async function Page() {
  const userData = await getHeadUserData();
  try {
    const menuData = await getRoleAllServer(userData);
    return (
      <ClientPage initData={menuData} />
    );
  } catch (error) {
    return "fetch data error";
  }
};