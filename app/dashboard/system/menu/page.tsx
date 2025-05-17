import { getAllMenusServer } from "@/utils/apiServer/menu/getMenus";
import ClientPage from "./_component/clientpage";
import { getHeadUserData } from "@/utils/apiServer/getHeadUserData";

export default async function Page() {
  const userData = await getHeadUserData();
  if (userData?.roles && userData.roles.length > 0) {
    const menuData = await getAllMenusServer(userData.roles);
    return (
      <ClientPage dataSource={menuData} />
    );
  }
  return "fetch data error";
};