import { request, AppBaseURL } from "@/api"

/* 新增 */
export function createApi(data: any) {
	return request({
		url: AppBaseURL + "/Erp/businessEnterprise/Create",
		method: "post",
		data
	})
}

/* 更新 */
export function updateApi(data: any) {
	return request({
		url: AppBaseURL + "/Erp/businessEnterprise/Update",
		method: "post",
		data
	})
}

/* 删除 */
export function deleteApi(data: any) {
	return request({
		url: AppBaseURL + "/Erp/businessEnterprise/Delete",
		method: "post",
		data
	})
}

/* 批量删除 */
export function batchDeleteApi(data: any) {
	return request({
		url: AppBaseURL + "/Erp/businessEnterprise/BatchDelete",
		method: "post",
		data
	})
}

/* 获取清单 */
export function queryApi(params: any) {
	return request({
		url: AppBaseURL + "/Erp/businessEnterprise/Query",
		method: "get",
		params
	})
}

/* 获取详情 */
export function getApi(params: any) {
	return request({
		url: AppBaseURL + "/Erp/businessEnterprise/Get",
		method: "get",
		params
	})
}
