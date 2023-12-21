export class TableData<T> {
    page: number;
    pageSize: number;
    sort: string;
    sortOrder: string;
    data: T[] = [];
    total: number;
}
