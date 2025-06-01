import { LocalRole } from '@/types/api';
import { fetchData } from "@/api/fetchApi";
import { PaginationRequest, PaginationResponse } from '@/types/database';
import { MessageInstance } from 'antd/lib/message/interface';

export async function getRoleByPage(body: PaginationRequest) {
  return await fetchData<PaginationResponse<LocalRole[]>, PaginationRequest>('/api/system/role/getRoleByPage', {
    body
  })
}

export async function deleteRoleById(id: string, message: MessageInstance) {
  return await fetchData<null, { id?: string }>('/api/system/role/deleteRoleSingle', { body: { id }, message })
}

export async function addRole(body: LocalRole, message: MessageInstance) {
  return await fetchData<null, LocalRole>('/api/system/role/addRoleSingle',
    {
      body, message
    })
}

export async function updateRole(body: LocalRole, message: MessageInstance) {
  return await fetchData<null, LocalRole>('/api/system/role/updateRoleSingle',
    {
      body, message
    })
}

export async function updateRolePermissionById(id: string, permissions: string[], message: MessageInstance) {
  return await fetchData<null, { id: string, permissions: string[] }>('/api/system/role/updateRolePermissionById',
    {
      body: { id, permissions }, message
    })
}

export async function addUserToRoleById(id: string, userIds: string[], message: MessageInstance) {
  return await fetchData<null, { id: string, userIds: string[] }>('/api/system/role/addUserToRoleById',
    {
      body: { id, userIds }, message
    })
}

export async function removeUserFromRoleById(id: string, userIds: string[], message: MessageInstance) {
  return await fetchData<null, { id: string, userIds: string[] }>('/api/system/role/removeUserFromRoleById',
    {
      body: { id, userIds }, message
    })
}

