import { OptionalLocalId, WithLocalId } from "../api";
import { DefaultModel } from "../database";

export interface BasicAuditTestProgramme {
    name: string;
    originFilePath: string;
    originFileName: string;
    newFilePath: string;
    newFileName: string;
    backupPath: string;
    engineerAudit: boolean;
    qualityAudit: boolean;
    productionAudit: boolean;
    planAudit: boolean;
    managerAudit: boolean;
    isChecked: boolean;
}

// 数据库原始字典类型
export interface AuditTestProgramme extends DefaultModel, BasicAuditTestProgramme { }

export type AuditTestProgrammeWithID = WithLocalId<AuditTestProgramme>

export type LocalAuditTestProgramme = OptionalLocalId<BasicAuditTestProgramme>

export enum AuditTestProgrammeRoles {
    '工程' = '工程',
    '品质' = '品质',
    '生产' = '生产',
    '计划' = '计划',
    '总经理' = '总经理',
}

export interface GetRelativePathApiProps {
    path: string;
    type: "save" | "savePath" | "backup";
}