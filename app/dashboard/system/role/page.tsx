import { getRoleServer } from "@/app/api/system/role/getRoleByPage/serverGetRole";
import ClientPage from "./_component/clientpage";
import { getHeadUserData } from "@/utils/getHeadUserData";

export default async function Page() {
  const userData = await getHeadUserData();
  try {
    const roleData = await getRoleServer(userData);
    return (
      <ClientPage initData={roleData} />
    );
  } catch (error) {
    return "fetch data error";
  }
};