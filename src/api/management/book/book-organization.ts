import { request, MagicTextBaseURL } from "@/api"

/** 查 */
export function queryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/Query",
		method: "get",
		params
	})
}

export function getApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/Get",
		method: "get",
		params
	})
}

export function queryTreeSelectApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/QueryTreeSelect",
		method: "get",
		params
	})
}

export function queryByCategoryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/QueryByCategory",
		method: "get",
		params
	})
}

export function queryByFactionApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/QueryByFaction",
		method: "get",
		params
	})
}

export function queryBySystemApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/QueryBySystem",
		method: "get",
		params
	})
}

export function queryByLocationApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/QueryByLocation",
		method: "get",
		params
	})
}

/** 增 */
export function createApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/Create",
		method: "post",
		data
	})
}

/** 改 */
export function updateApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/Update",
		method: "post",
		data
	})
}

/** 删 */
export function deleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/Delete",
		method: "post",
		data
	})
}

export function batchDeleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookOrganization/BatchDelete",
		method: "post",
		data
	})
}
