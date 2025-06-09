"use client"
import { useRef, useState } from 'react';
import { Button, Card, List, Skeleton } from 'antd';
import { PaginationResponse } from '@/types/database';
import { LocalMessage } from '@/types/api';
import { getMessageListByPage } from '@/api/system/message';

export default function Page(
  {
    initData
  }: {
    initData: PaginationResponse<LocalMessage[]>
  }
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<LocalMessage[]>(initData.data);
  const [showLoadMore, setShowLoadMore] = useState(initData.data.length < initData.total);
  const currentPage = useRef(1);
  const total = useRef(initData.total);

  const onLoadMore = () => {
    setLoading(true);
    const nextPage = currentPage.current + 1;
    currentPage.current = nextPage;
    getMessageListByPage({ currentPage: nextPage }).then((res) => {
      if (Array.isArray(res)) {
        const newData = data.concat(res);
        setData(newData);
        if (newData.length >= total.current) {
          setShowLoadMore(false);
        } else {
          setShowLoadMore(true);
        }
      }
    }).catch((err) => {
      
    }).finally(() => {
      setLoading(false);
      // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
      // In real scene, you can using public method of react-virtualized:
      // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
      window.dispatchEvent(new Event('resize'));
    })
  };

  return (
    <Card>
      <List
        loading={loading}
        itemLayout="horizontal"
        loadMore={showLoadMore ? <div
          style={{
            textAlign: 'center',
            marginTop: 12,
            height: 32,
            lineHeight: '32px',
          }}
        >
          <Button loading={loading} onClick={onLoadMore}>loading more</Button>
        </div> : null}
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            actions={[<Button type="text">已读</Button>]}
          >
            <Skeleton avatar title={false} loading={loading} active>
              <List.Item.Meta
                title={item.title}
                description={item.content}
              />
            </Skeleton>
          </List.Item>
        )}
      />
    </Card>
  );
};