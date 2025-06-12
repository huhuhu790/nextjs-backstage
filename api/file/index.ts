import { MessageInstance } from "antd/lib/message/interface";

export async function uploadFile(file: File, message: MessageInstance): Promise<string> {
    // 后期可加入临时token验证等逻辑

    const formData = new FormData();
    formData.append('file', file);

    // 获取path去掉端口
    const path = window.location.origin.replace(/:\d+$/, '');
    const response = await fetch(`${path}:3005/handleFile/upload`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        message.error('文件上传失败');
        throw new Error('文件上传失败');
    }

    const { filename } = await response.json();
    return filename;
}