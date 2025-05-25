import { LocalMenu } from "@/types/api";

// 无需验证权限可访问的页面
export const publicPermissionPaths: LocalMenu[] = [
    {
        id: 'user-center',
        name: '用户中心',
        path: '/user/center',
        parentId: null,
        iconPath: 'user',
        type: 'menu',
    },
    {
        id: 'user-message',
        name: '用户消息',
        path: '/user/message',
        parentId: null,
        iconPath: 'message',
        type: 'menu',
    },
];