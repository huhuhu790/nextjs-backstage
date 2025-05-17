import ClientLayout from "./_component/clientLayout"
import { getMenusByRoles } from '@/db/mongodb/menuCollection'
import { MenuItemWithID } from "@/types/menu";
import { getHeadUserData } from "@/utils/apiServer/getHeadUserData";

const Layout = async ({ children }: React.PropsWithChildren) => {
  const userData = await getHeadUserData();
  let menuData: MenuItemWithID[] = [];
  if (userData?.roles && userData.roles.length > 0)
    menuData = await getMenusByRoles(userData.roles);
  return (
    <ClientLayout menuData={menuData}>
      {children}
    </ClientLayout>
  );
};

export default Layout;