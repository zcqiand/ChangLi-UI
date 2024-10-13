import { request, MagicTextBaseURL } from "@/api"

/** 查 */
export function queryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookProp/Query",
		method: "get",
		params
	})
}

export function getApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookProp/Get",
		method: "get",
		params
	})
}

export function queryByCategoryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookProp/QueryByCategory",
		method: "get",
		params
	})
}

export function queryByElementApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookProp/QueryByElement",
		method: "get",
		params
	})
}

export function queryByLevelRealmApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookProp/QueryByLevelRealm",
		method: "get",
		params
	})
}

/** 增 */
export function createApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookProp/Create",
		method: "post",
		data
	})
}

/** 改 */
export function updateApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookProp/Update",
		method: "post",
		data
	})
}

/** 删 */
export function deleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookProp/Delete",
		method: "post",
		data
	})
}

export function batchDeleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookProp/BatchDelete",
		method: "post",
		data
	})
}
