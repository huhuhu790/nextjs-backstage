import { AuditTestProgrammeWithID, LocalAuditTestProgramme } from "@/types/projects/auditTestProgramme"

export function toLocalAuditTestProgramme(data: AuditTestProgrammeWithID): LocalAuditTestProgramme {
    return {
        id: data.id,
        name: data.name,
        engineerAudit: data.engineerAudit,
        qualityAudit: data.qualityAudit,
        productionAudit: data.productionAudit,
        planAudit: data.planAudit,
        managerAudit: data.managerAudit,
        originFilePath: data.originFilePath,
        originFileName: data.originFileName,
        newFilePath: data.newFilePath,
        backupPath: data.backupPath,
        newFileName: data.newFileName,
        isChecked: data.isChecked,
    }
}

export function toLocalAuditTestProgrammeList(data: AuditTestProgrammeWithID[]): LocalAuditTestProgramme[] {
    return data.map(item => toLocalAuditTestProgramme(item))
}
