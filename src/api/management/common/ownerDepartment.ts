import { request, CommonBaseURL } from "@/api"

/* 新增 */
export function createApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerDepartment/Create",
    method: "post",
    data
  })
}

/* 更新 */
export function updateApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerDepartment/Update",
    method: "post",
    data
  })
}

/* 删除 */
export function deleteApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerDepartment/Delete",
    method: "post",
    data
  })
}

/* 批量删除 */
export function batchDeleteApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerDepartment/BatchDelete",
    method: "post",
    data
  })
}

/* 获取清单 */
export function queryApi(params: any) {
  return request({
    url: CommonBaseURL + "/api/ownerDepartment/Query",
    method: "get",
    params
  })
}

/* 获取树清单 */
export function queryTreeSelectApi(params: any) {
  return request({
    url: CommonBaseURL + "/api/ownerDepartment/QueryTreeSelect",
    method: "get",
    params
  })
}

/* 获取详情 */
export function getApi(params: any) {
  return request({
    url: CommonBaseURL + "/api/ownerDepartment/Get",
    method: "get",
    params
  })
}
