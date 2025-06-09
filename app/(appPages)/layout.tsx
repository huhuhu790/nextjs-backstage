import ClientLayout from "./_component/clientLayout"
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import getMenusByRolesServer from "@/app/api/system/menu/getListByPage/serverGetMenu";

const Layout = async ({ children }: React.PropsWithChildren) => {
  try {
    const headersList = await headers()
    const userData = await getHeadUserData(headersList);
    const menuData = await getMenusByRolesServer(userData);
    return (
      <ClientLayout menuData={menuData}>
        {children}
      </ClientLayout>
    );
  } catch (error) {
    console.error(error);
    return (error as Error).message || '获取页面失败'
  }
};

export default Layout;