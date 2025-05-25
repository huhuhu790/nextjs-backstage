"use client"
import { userInfoAtom } from "@/store/user/userAtom";
import { useAtomValue } from "jotai";

export default function Page() {
    const user = useAtomValue(userInfoAtom);
    return (
        <div>
            <h1>用户中心</h1>
            <p>{JSON.stringify(user)}</p>
        </div>
    )
}
