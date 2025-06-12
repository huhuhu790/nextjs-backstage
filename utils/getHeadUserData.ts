"use server";
import { UserWithID } from "@/types/system/user"

export async function getHeadUserData(headersList: Headers): Promise<UserWithID> {
    const userDataJSON = headersList.get(process.env.SERVER_USERHEADER!)
    const userData = userDataJSON ? JSON.parse(decodeURIComponent(userDataJSON)) as UserWithID : null
    if (!userData || !userData.id) throw new Error('用户数据未找到')
    return userData
}