import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./_component/clientLayout"
import { Provider } from 'jotai'
import { getHeadUserData } from "@/utils/getHeadUserData";
import { getPermissionsServer } from "./api/system/user/getUserByPage/getPermissionsServer";

export const metadata: Metadata = {
  title: "MES",
  description: "MES",
};

const Layout = async ({ children }: React.PropsWithChildren) => {
  const userData = await getHeadUserData();
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