import ClientLayout from "./_component/clientLayout"
import { getHeadUserData } from "@/utils/getHeadUserData";
import getMenusByRolesServer from "@/app/api/system/menu/getMenuAll/serverGetMenu";

const Layout = async ({ children }: React.PropsWithChildren) => {
  const userData = await getHeadUserData();
  try {
    const menuData = await getMenusByRolesServer(userData);
    return (
      <ClientLayout menuData={menuData}>
        {children}
      </ClientLayout>
    );
  } catch (error) {
    return "fetch data error";
  }
};

export default Layout;