import { request, MagicTextBaseURL } from "@/api"

/** 查 */
export function queryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/Query",
		method: "get",
		params
	})
}

export function getApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/Get",
		method: "get",
		params
	})
}

export function queryByOrganizationApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/QueryByOrganization",
		method: "get",
		params
	})
}

export function queryByPositionApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/QueryByPosition",
		method: "get",
		params
	})
}

export function queryByJobApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/QueryByJob",
		method: "get",
		params
	})
}

export function queryByLocationApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/QueryByLocation",
		method: "get",
		params
	})
}

export function queryByLevelRealmApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/QueryByLevelRealm",
		method: "get",
		params
	})
}

/** 增 */
export function createApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/Create",
		method: "post",
		data
	})
}

/** 改 */
export function updateApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/Update",
		method: "post",
		data
	})
}

/** 删 */
export function deleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/Delete",
		method: "post",
		data
	})
}

export function batchDeleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActor/BatchDelete",
		method: "post",
		data
	})
}
