import { request, CommonBaseURL } from "@/api"

/* 新增 */
export function createApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRoleData/Create",
    method: "post",
    data
  })
}

/* 更新 */
export function updateApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRoleData/Update",
    method: "post",
    data
  })
}

/* 删除 */
export function deleteApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRoleData/Delete",
    method: "post",
    data
  })
}

/* 批量删除 */
export function batchDeleteApi(data: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRoleData/BatchDelete",
    method: "post",
    data
  })
}

/* 获取清单 */
export function queryApi(params: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRoleData/Query",
    method: "get",
    params
  })
}

/* 获取详情 */
export function getApi(params: any) {
  return request({
    url: CommonBaseURL + "/api/ownerRoleData/Get",
    method: "get",
    params
  })
}
