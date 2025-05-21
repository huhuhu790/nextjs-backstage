import { getAllMenusServer } from "@/app/api/system/menu/getMenuAll/serverGetMenu";
import ClientPage from "./_component/clientpage";
import { getHeadUserData } from "@/utils/getHeadUserData";

export default async function Page() {
  const userData = await getHeadUserData();
  try {
    const menuData = await getAllMenusServer(userData);
    return (
      <ClientPage dataSource={menuData} />
    );
  } catch (error) {
    return "fetch data error";
  }
};