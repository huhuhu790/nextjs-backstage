import { fetchData } from "@/api/fetchApi";
import { PaginationRequest, PaginationResponse } from "@/types/database";
import { GetRelativePathApiProps, LocalAuditTestProgramme } from "@/types/projects/auditTestProgramme";
import { MessageInstance } from "antd/lib/message/interface";

export async function addAuditTestProgramme(body: Partial<LocalAuditTestProgramme>, message: MessageInstance) {
    return await fetchData<undefined, Partial<LocalAuditTestProgramme>>('/api/projects/auditTestProgramme/insert', { body, message });
}

export async function updateAuditTestProgramme(body: Partial<LocalAuditTestProgramme>, message: MessageInstance) {
    return await fetchData<undefined, Partial<LocalAuditTestProgramme>>('/api/projects/auditTestProgramme/update', { body, message });
}

export async function deleteAuditTestProgramme(id: string, message: MessageInstance) {
    return await fetchData<LocalAuditTestProgramme, { id: string }>('/api/projects/auditTestProgramme/delete', {
        body: { id },
        message
    })
}

export async function getAuditTestProgrammeListbyPage(body: PaginationRequest) {
    return await fetchData<PaginationResponse<LocalAuditTestProgramme[]>, PaginationRequest>('/api/projects/auditTestProgramme/getListByPage', {
        body
    })
}

export async function signByRoleAuditTestProgramme(body: { id: string, roleName: string }, message: MessageInstance) {
    return await fetchData<undefined, { id: string, roleName: string }>('/api/projects/auditTestProgramme/signByRole', {
        body,
        message
    })
}

export async function checkAuditTestProgramme(id: string, message: MessageInstance) {
    return await fetchData<undefined, { id: string }>('/api/projects/auditTestProgramme/check', {
        body: { id },
        message
    })
}

export async function getRelativePath(body: GetRelativePathApiProps) {
    return await fetchData<{
        type: 'file' | 'folder',
        name: string
    }[], GetRelativePathApiProps>('/api/projects/auditTestProgramme/getRelativePath', {
        body
    });
}