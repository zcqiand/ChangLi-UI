import { request, MagicTextBaseURL } from "@/api"

/** 查 */
export function queryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPosition/Query",
		method: "get",
		params
	})
}

export function getApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPosition/Get",
		method: "get",
		params
	})
}

export function queryTreeSelectApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPosition/QueryTreeSelect",
		method: "get",
		params
	})
}

/** 增 */
export function createApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPosition/Create",
		method: "post",
		data
	})
}

/** 改 */
export function updateApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPosition/Update",
		method: "post",
		data
	})
}

/** 删 */
export function deleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPosition/Delete",
		method: "post",
		data
	})
}

export function batchDeleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPosition/BatchDelete",
		method: "post",
		data
	})
}

export function batchImportApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPosition/BatchImport",
		method: "post",
		data
	})
}
