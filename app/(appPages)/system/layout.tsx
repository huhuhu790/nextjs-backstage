import { checkPermission } from "@/db/mongodb/userCollection";
import { systemPermission } from "../../../utils/appPagePermission";
import { getHeadUserData } from "@/utils/serverUtils";
import { headers } from "next/headers";
const Layout = async ({ children }: React.PropsWithChildren) => {
  try {
    const headersList = await headers()
    const userData = await getHeadUserData(headersList);
    await checkPermission(systemPermission, userData)
    return children;
  } catch (error) {
    console.error(error);
    return (error as Error).message || '获取页面失败'
  }
};

export default Layout;