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
  const headersList = await headers()
  const userData = await getHeadUserData(headersList);
  const permissions = await getPermissionsServer(userData?.roles || [])
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