"use client"
import { Button, Table } from 'antd';
import { MenuTableDataType } from './menuPageType';
import { LocalRole } from '@/types/api';


export default function ClientPage({ initData }: { initData: LocalRole[] }) {
  return (
    <>
      {initData.map((item) => {
        return (
          <div key={item.id}>
            {item.name}
          </div>
        )
      })}
    </>
  );
};