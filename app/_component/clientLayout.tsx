"use client"
import { UserWithID } from '@/types/system/user';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { userInfoAtom } from '@/store/user/userAtom';
import { useHydrateAtoms } from 'jotai/utils';
import '@ant-design/v5-patch-for-react-19';

const ClientLayout = ({ children, userData }:
  React.PropsWithChildren<{ userData: UserWithID | null }>) => {
  useHydrateAtoms([[userInfoAtom, userData]])
  return (
    <AntdRegistry>{children}</AntdRegistry>
  )
};

export default ClientLayout;