import { getHeadUserData } from "@/utils/getHeadUserData";
import { headers } from "next/headers";
import ClientPage from "./_component/clientPage";
import { testProgrammePermission } from "../../appPagePermission";
import { checkPermission } from "@/db/mongodb/userCollection";
import { getAuditTestProgrammeListbyPage } from "@/app/api/projects/auditTestProgramme/getListByPage/server";

export default async function Page() {
    try {
        const headersList = await headers()
        const userData = await getHeadUserData(headersList);
        await checkPermission(testProgrammePermission, userData)
        const dictData = await getAuditTestProgrammeListbyPage(userData);
        return (
            <ClientPage initData={dictData} />
        );
    } catch (error) {
        console.error(error);
        return (error as Error).message || '获取页面失败'
    }
};

export const dynamic = 'force-dynamic'; 