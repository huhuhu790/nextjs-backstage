import { checkPermission } from "@/db/mongodb/userCollection";
import { sendingMessagePermission } from "../../appPagePermission";
import ClientPage from "./_component/clientPage";
import { getHeadUserData } from "@/utils/getHeadUserData";

export default async function Page() {
    try {
        const userData = await getHeadUserData();
        await checkPermission(sendingMessagePermission, userData)
        return (
            <ClientPage />
        );
    } catch (error) {
        console.log(error);
        return (error as Error).message || '获取页面失败'
    }
}
