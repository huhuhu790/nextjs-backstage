"use client"
import { UserWithID } from '@/types/system/user';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { userInfoAtom } from '@/store/user/userAtom';
import { useHydrateAtoms } from 'jotai/utils';
import '@ant-design/v5-patch-for-react-19';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';

const ClientLayout = ({ children, userData }:
  React.PropsWithChildren<{ userData: UserWithID | null }>) => {
  useHydrateAtoms([[userInfoAtom, userData]])
  return (
    <AntdRegistry>
      <ConfigProvider locale={zhCN}>
        {children}
      </ConfigProvider>
    </AntdRegistry>
  )
};

export default ClientLayout;