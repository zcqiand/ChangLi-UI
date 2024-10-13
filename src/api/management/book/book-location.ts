import { request, MagicTextBaseURL } from "@/api"

/** 查 */
export function queryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/Query",
		method: "get",
		params
	})
}

export function getApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/Get",
		method: "get",
		params
	})
}

export function queryTreeSelectApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/QueryTreeSelect",
		method: "get",
		params
	})
}

export function queryByTypeCategoryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/QueryByTypeCategory",
		method: "get",
		params
	})
}

export function queryByAreaCategoryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/QueryByAreaCategory",
		method: "get",
		params
	})
}

export function queryByElementApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/QueryByElement",
		method: "get",
		params
	})
}

export function queryByLevelRealmApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/QueryByLevelRealm",
		method: "get",
		params
	})
}

/** 增 */
export function createApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/Create",
		method: "post",
		data
	})
}

/** 改 */
export function updateApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/Update",
		method: "post",
		data
	})
}

/** 删 */
export function deleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/Delete",
		method: "post",
		data
	})
}

export function batchDeleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookLocation/BatchDelete",
		method: "post",
		data
	})
}
