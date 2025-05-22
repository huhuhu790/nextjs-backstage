export interface DefaultModel {
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
    isDeleted: boolean;
    deletedAt: Date | null;
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