import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./_component/clientLayout"
import { Provider } from 'jotai'
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import { getPermissionsServer } from "./api/system/user/getListByPage/getPermissionsServer";

export const metadata: Metadata = {
  title: "后台管理系统",
  description: "后台管理系统",
};

const Layout = async ({ children }: React.PropsWithChildren) => {
  let userData = null, permissions: string[] = []
  try {
    const headersList = await headers()
    userData = await getHeadUserData(headersList);
    permissions = await getPermissionsServer(userData?.roles || [])
  } catch (error) { }
  return (
    <html>
      <body>
        <Provider>
          <ClientLayout userData={userData} permissions={permissions}>{children}</ClientLayout>
        </Provider>
      </body>
    </html>
  )
};

export default Layout;