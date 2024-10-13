import { request, MagicTextBaseURL } from "@/api"

/** 查 */
export function queryApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActorJob/Query",
		method: "get",
		params
	})
}

export function getApi(params: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActorJob/Get",
		method: "get",
		params
	})
}

/** 增 */
export function createApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActorJob/Create",
		method: "post",
		data
	})
}

/** 改 */
export function updateApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActorJob/Update",
		method: "post",
		data
	})
}

/** 删 */
export function deleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActorJob/Delete",
		method: "post",
		data
	})
}

export function batchDeleteApi(data: any) {
	return request({
		url: MagicTextBaseURL + "/BookManagement/BookActorJob/BatchDelete",
		method: "post",
		data
	})
}
