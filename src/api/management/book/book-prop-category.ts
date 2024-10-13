import { request, MagicTextBaseURL } from "@/api"

/** 查 */
export function queryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPropCategory/Query",
		method: "get",
		params
	})
}

export function getApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPropCategory/Get",
		method: "get",
		params
	})
}

export function queryTreeSelectApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPropCategory/QueryTreeSelect",
		method: "get",
		params
	})
}

/** 增 */
export function createApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPropCategory/Create",
		method: "post",
		data
	})
}

/** 改 */
export function updateApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPropCategory/Update",
		method: "post",
		data
	})
}

/** 删 */
export function deleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPropCategory/Delete",
		method: "post",
		data
	})
}

export function batchDeleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPropCategory/BatchDelete",
		method: "post",
		data
	})
}

export function batchImportApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookPropCategory/BatchImport",
		method: "post",
		data
	})
}
