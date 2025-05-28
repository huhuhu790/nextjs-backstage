import { useMemo, useRef, useState } from 'react';
import { Select, Spin, Avatar } from 'antd';
import { debounce } from 'lodash';
import { DefaultOptionType } from 'antd/es/select';
import { LocalMenu } from '@/types/api';
import { useRouter } from 'next/navigation';

interface MenuValue {
    label: string;
    value: string;
}

function fetchList(keyword: string, menuList: LocalMenu[]): MenuValue[] {
    const search = keyword.trim();
    if (!search) {
        return [];
    }
    return menuList.filter((menu) => menu.name.includes(search)).map((menu) => ({
        label: menu.name,
        value: menu.path,
    }));
}


const debounceTimeout = 300;
export default function DebounceSelect({ menuData, showSearch }: { menuData: LocalMenu[], showSearch: boolean }) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<MenuValue[]>([]);
    const [value, setValue] = useState<MenuValue | null>(null);
    const fetchRef = useRef(0);
    const router = useRouter();

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            const newOptions = fetchList(value, menuData);
            if (fetchId !== fetchRef.current) {
                // for fetch callback order
                return;
            }

            setOptions(newOptions);
            setFetching(false);
        };

        return debounce(loadOptions, debounceTimeout);
    }, [menuData, debounceTimeout]);

    const handleSelect = (value: MenuValue) => {
        router.push(value.value);
        setOptions([]);
        setFetching(false);
    }

    return (
        <Select
            value={value}
            style={{ width: 240, display: showSearch ? 'block' : 'none' }}
            variant="underlined"
            placeholder="搜索菜单"
            labelInValue
            filterOption={false}
            onSelect={(value) => handleSelect(value as MenuValue)}
            showSearch
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : '未找到'}
            options={options as DefaultOptionType[]}
            optionRender={(option) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {option.data.avatar && <Avatar src={option.data.avatar} style={{ marginRight: 8 }} />}
                    {option.label}
                </div>
            )}
        />
    );
}