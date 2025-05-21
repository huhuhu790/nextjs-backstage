import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./_component/clientLayout"
import { Provider } from 'jotai'
import { getHeadUserData } from "@/utils/getHeadUserData";

export const metadata: Metadata = {
  title: "MES",
  description: "MES",
};

const Layout = async ({ children }: React.PropsWithChildren) => {
  const userData= await getHeadUserData();
  return (
    <html>
      <body>
        <Provider>
          <ClientLayout userData={userData}>{children}</ClientLayout>
        </Provider>
      </body>
    </html>
  )
};

export default Layout;