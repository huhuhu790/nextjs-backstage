import { UserWithID } from "@/types/system/user"
import { headers } from "next/headers"

export async function getHeadUserData(): Promise<UserWithID | null> {
    const headersList = await headers()
    const userDataJSON = headersList.get(process.env.SERVER_USERHEADER!)
    const userData = userDataJSON ? JSON.parse(userDataJSON) : null
    return userData
}