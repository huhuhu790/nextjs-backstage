import ClientPage from "./_component/clientPage";

export default async function Page() {
    try {
        return (
            <ClientPage />
        );
    } catch (error) {
        console.error(error);
        return (error as Error).message || '获取页面失败'
    }
};

export const dynamic = 'force-dynamic'; 