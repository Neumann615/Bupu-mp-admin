import type { CommonPage, PageParam } from '@zealous-admin/layout/index'
import { http } from '@zealous-admin/layout/index'

export interface FormRecord {
  id: number
  name: string
  description: string
  schema: string
  status: number
  version: number
  createTime: string
  updateTime: string
}

/** 分页获取表单列表 */
export function getFormListAPI(params: PageParam) {
  return http<CommonPage<FormRecord>>({
    url: '/form/list',
    method: 'get',
    params,
  })
}

/** 获取表单详情（含 schema 字符串） */
export function getFormDetailAPI(id: number) {
  return http<FormRecord>({
    url: '/form/detail',
    method: 'get',
    params: { id },
  })
}

/** 新建表单 */
export function createFormAPI(data: { name: string, description?: string }) {
  return http<{ id: number }>({
    url: '/form/create',
    method: 'post',
    data,
  })
}

/** 更新表单（名称/描述/schema/状态） */
export function updateFormAPI(data: { id: number, name?: string, description?: string, schema?: string, status?: number }) {
  return http({
    url: '/form/update',
    method: 'post',
    data,
  })
}

/** 删除表单 */
export function deleteFormAPI(id: number) {
  return http({
    url: '/form/delete',
    method: 'post',
    data: { id },
  })
}
