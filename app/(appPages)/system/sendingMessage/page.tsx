import { checkPermission } from "@/db/mongodb/userCollection";
import { sendingMessagePermission } from "../../../../utils/appPagePermission";
import ClientPage from "./_component/clientPage";
import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";

export default async function Page() {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        await checkPermission(sendingMessagePermission, userData)
        return (
            <ClientPage />
        );
    } catch (error) {
        console.error(error);
        return (error as Error).message || '获取页面失败'
    }
}

export const dynamic = 'force-dynamic'; 
