export interface DefaultModel {
    createdAt: Date | string;
    createdBy: string;
    updatedAt: Date | string;
    updatedBy: string;
    isDeleted: boolean;
    deletedAt: Date | string | null;
    deletedBy: string | null;
    isActive: boolean;
}

export interface PaginationRequest {
    keyword?: string,
    currentPage: number,
    pageSize: number
}

export interface PaginationResponse<T> {
    currentPage: number,
    pageSize: number
    total: number,
    data: T
}