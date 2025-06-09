import { UserWithID } from "@/types/system/user"

export async function getHeadUserData(headersList: Headers): Promise<UserWithID | null> {
    const userDataJSON = headersList.get(process.env.SERVER_USERHEADER!)
    const userData = userDataJSON ? JSON.parse(decodeURIComponent(userDataJSON)) : null
    return userData
}