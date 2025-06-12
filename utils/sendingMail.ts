"use server";
import { getListByPageUser } from "@/db/mongodb/userCollection";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
    host: "smtp.exmail.qq.com",     // SMTP服务器地址
    port: 465,                    // SMTP端口
    secure: true,                 // 使用SSL/TLS
    auth: {
        user: "system@force-test.com.cn",  // 邮箱账号
        pass: "Xlc123456"            // 邮箱密码或应用专用密码
    }
});

export async function sendEmail(to: string, subject: string, content: string) {
    const mailOptions = {
        from: 'system@force-test.com.cn',  // 发件人
        to: to,                                     // 收件人
        subject: subject,                           // 主题
        text: content,                             // 纯文本内容
        //html: `<b>${content}</b>`                  // HTML内容
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("邮件发送成功:", info.messageId);
        return info;
    } catch (error) {
        console.error("邮件发送失败:", error);
        throw error;
    }
}

export async function sendEmails(subject: string, content: string) {
    try {
        const { data } = await getListByPageUser()
        const tasks: Promise<SMTPTransport.SentMessageInfo>[] = []
        for (const user of data) {
            tasks.push(sendEmail(user.email, subject, content))
        }
        await Promise.all(tasks)
    } catch (error) {
        console.error("邮件发送失败:", error);
        throw error;
    }
}