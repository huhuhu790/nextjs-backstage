import { LocalUser } from "@/types/api";
import { UserWithID } from "@/types/system/user";

export function toLocalUser(user: UserWithID): LocalUser {
    return {
        id: user.id,
        username: user.username,
        name: user.name,
        workingId: user.workingId,
        gender: user.gender,
        email: user.email,
        roles: user.roles,
        avatar: user.avatar,
        birthday: user.birthday,
        address: user.address,
        phone: user.phone,
        department: user.department
    }
}

export function toLocalUserList(users: UserWithID[]): LocalUser[] {
    return users.map(toLocalUser)
}
