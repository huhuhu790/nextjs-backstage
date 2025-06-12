export function checkProps<T extends Object>(obj: T, props: (keyof T)[]) {
    const result = props.every(prop => prop in obj && obj[prop] !== undefined && obj[prop] !== null && obj[prop] !== '');
    if (!result) {
        throw new Error(`缺少必要的属性: ${props.filter(prop => !(prop in obj)).join(', ')}`);
    }
}