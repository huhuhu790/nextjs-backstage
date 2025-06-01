import { checkPermission } from "@/db/mongodb/userCollection";
import { systemPermission } from "../appPagePermission";
import { getHeadUserData } from "@/utils/getHeadUserData";
const Layout = async ({ children }: React.PropsWithChildren) => {
  try {
    const userData = await getHeadUserData();
    await checkPermission(systemPermission, userData)
    return children;
  } catch (error) {
    console.error(error);
    return (error as Error).message || '获取页面失败'
  }
};

export default Layout;