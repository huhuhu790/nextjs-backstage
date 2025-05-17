"use client"
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

const Page: React.FC = () => {
    const router = useRouter();
    return (
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary" onClick={() => { router.push(process.env.NEXT_PUBLIC_SYSTEM_PREFIX!) }}>Back Home</Button>}
        />
    );
}

export default Page;