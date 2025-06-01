import ClientLayout from "./_component/clientLayout"
import { getHeadUserData } from "@/utils/getHeadUserData";
import getMenusByRolesServer from "@/app/api/system/menu/getMenuAll/serverGetMenu";

const Layout = async ({ children }: React.PropsWithChildren) => {
  try {
    const userData = await getHeadUserData();
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