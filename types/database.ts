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