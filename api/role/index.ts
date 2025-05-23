import { LocalRole } from '@/types/api';
import { fetchData } from "@/api/fetchApi";
import { PaginationRequest, PaginationResponse } from '@/types/database';
import { RoleDataBasic } from '@/app/dashboard/system/role/_component/rolePageType';

export async function getRoleByPage(body: PaginationRequest) {
  return await fetchData<PaginationResponse<LocalRole[]>, PaginationRequest>('/api/system/role/getRoleByPage', {
    body,
    showMessage: false
  })
}

export async function deleteRoleById(id: string) {
  return await fetchData<null, { id?: string }>('/api/system/role/deleteRoleSingle', { body: { id } })
}

export async function addRole(body: RoleDataBasic) {
  return await fetchData<null, RoleDataBasic>('/api/system/role/addRoleSingle',
    {
      body
    })
}

export async function updateRole(body: RoleDataBasic) {
  return await fetchData<null, RoleDataBasic>('/api/system/role/updateRoleSingle',
    {
      body
    })
}

export async function updateRolePermissionById(id: string, permissions: string[]) {
  return await fetchData<null, { id: string, permissions: string[] }>('/api/system/role/updateRolePermissionById',
    {
      body: { id, permissions }
    })
}

export async function addUserToRoleById(id: string, userIds: string[]) {
  return await fetchData<null, { id: string, userIds: string[] }>('/api/system/role/addUserToRoleById',
    {
      body: { id, userIds }
    })
}

export async function removeUserFromRoleById(id: string, userIds: string[]) {
  return await fetchData<null, { id: string, userIds: string[] }>('/api/system/role/removeUserFromRoleById',
    {
      body: { id, userIds }
    })
}

