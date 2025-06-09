import crypto from "crypto-js"
export async function sha256(text: string) {
    return crypto.SHA256( text).toString();
}