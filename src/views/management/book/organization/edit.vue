<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="parentId" label="父级">
				<el-tree-select
					v-model="formData.parentId"
					:data="treeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/>
			</el-form-item>
			<el-form-item prop="organizationCategoryId" label="类别">
				<el-tree-select
					v-model="formData.organizationCategoryId"
					:data="organizationCategoryData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/>
				<el-button style="margin-left: 8px" type="primary" link @click="handleAddOrganizationCategory">添加</el-button>
			</el-form-item>
			<el-form-item prop="organizationFactionId" label="派系">
				<el-select v-model="formData.organizationFactionId" placeholder="请选择" clearable>
					<el-option v-for="item in organizationFactionData" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
				<el-button style="margin-left: 8px" type="primary" link @click="handleAddOrganizationFaction">添加</el-button>
			</el-form-item>
			<el-form-item prop="systemId" label="体系">
				<el-select v-model="formData.systemId" placeholder="请选择" clearable>
					<el-option v-for="item in systemData" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
				<el-button style="margin-left: 8px" type="primary" link @click="handleAddSystem">添加</el-button>
			</el-form-item>
			<el-form-item prop="no" label="序号">
				<el-input v-model="formData.no" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="name" label="名称">
				<el-input v-model="formData.name" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="shortName" label="简称">
				<el-input v-model="formData.shortName" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="locationId" label="所在地">
				<el-tree-select
					v-model="formData.locationId"
					:data="locationTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/><el-button style="margin-left: 8px" type="primary" link @click="handleAddLocation">添加</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleCreate">保存</el-button>
				<el-button v-show="currentUpdateId !== undefined" @click="handleSaveAs">另存为</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	<editOrganizationCategory
		v-if="organizationCategoryDialogVisible"
		ref="editOrganizationCategoryRef"
		:bookId="bookId"
		@success="handleSaveOrganizationCategorySuccess"
	></editOrganizationCategory>
	<editOrganizationFaction
		v-if="organizationFactionDialogVisible"
		ref="editOrganizationFactionRef"
		:bookId="bookId"
		@success="handleSaveOrganizationFactionSuccess"
	></editOrganizationFaction>
	<editSystem v-if="systemDialogVisible" ref="editSystemRef" :bookId="bookId" @success="handleSaveSystemSuccess"></editSystem>
	<editLocation
		v-if="locationDialogVisible"
		ref="editLocationRef"
		:bookId="bookId"
		@success="handleSaveLocationSuccess"
	></editLocation>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, defineExpose, onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { getApi, createApi, updateApi, queryTreeSelectApi } from "@/api/management/book/book-organization"
import { queryTreeSelectApi as queryOrganizationCategoryApi } from "@/api/management/book/book-organization-category"
import { queryApi as queryOrganizationFactionApi } from "@/api/management/book/book-organization-faction"
import { queryApi as querySystemApi } from "@/api/management/book/book-system"
import { queryTreeSelectApi as queryLocationTreeSelectApi } from "@/api/management/book/book-location"
import editOrganizationCategory from "../organization-category/edit.vue"
import editOrganizationFaction from "../organization-faction/edit.vue"
import editSystem from "../system/edit.vue"
import editLocation from "../location/edit.vue"

//#region 初始化
const bookId = ref<string | undefined>(undefined)
const props = defineProps({
	bookId: String
})
const emit = defineEmits(["success"])

onMounted(() => {
	bookId.value = props.bookId
	queryTreeSelectData()
	queryOrganizationCategoryData()
	queryOrganizationFactionData()
	querySystemData()
	queryLocationTreeSelectData()
})
//#endregion

//#region 主体
//设置表单
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (id: undefined | string) => {
	if (id === undefined) {
		resetForm()
	} else {
		currentUpdateId.value = id
		getApi({
			id: id
		})
			.then((res: any) => {
				formData.parentId = res.data.parentId
				formData.organizationCategoryId = res.data.organizationCategoryId
				formData.organizationFactionId = res.data.organizationFactionId
				formData.systemId = res.data.systemId
				formData.no = res.data.no
				formData.name = res.data.name
				formData.shortName = res.data.shortName
				formData.locationId = res.data.locationId
			})
			.catch(() => {
				resetForm()
			})
			.finally(() => {})
	}
	dialogVisible.value = true
}
//重置表单
const resetForm = () => {
	currentUpdateId.value = undefined
	formData.parentId = undefined
	formData.organizationCategoryId = undefined
	formData.organizationFactionId = undefined
	formData.systemId = undefined
	formData.no = ""
	formData.name = ""
	formData.shortName = ""
	formData.locationId = undefined
}
//获取父级清单
const treeSelectData = ref<any[]>([])
const queryTreeSelectData = () => {
	queryTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			treeSelectData.value = res.data
		})
		.catch(() => {
			treeSelectData.value = []
		})
		.finally(() => {})
}

const organizationCategoryData = ref<any[]>([])
const queryOrganizationCategoryData = () => {
	queryOrganizationCategoryApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			organizationCategoryData.value = res.data
		})
		.catch(() => {
			organizationCategoryData.value = []
		})
		.finally(() => {})
}

const organizationFactionData = ref<any[]>([])
const queryOrganizationFactionData = () => {
	queryOrganizationFactionApi({
		pageIndex: 1,
		pageSize: 1000,
		bookId: props.bookId
	})
		.then((res: any) => {
			organizationFactionData.value = res.data.items
		})
		.catch(() => {
			organizationFactionData.value = []
		})
		.finally(() => {})
}

const systemData = ref<any[]>([])
const querySystemData = () => {
	querySystemApi({
		pageIndex: 1,
		pageSize: 1000,
		bookId: props.bookId
	})
		.then((res: any) => {
			systemData.value = res.data.items
		})
		.catch(() => {
			systemData.value = []
		})
		.finally(() => {})
}

const locationTreeSelectData = ref<any[]>([])
const queryLocationTreeSelectData = () => {
	queryLocationTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			locationTreeSelectData.value = res.data
		})
		.catch(() => {
			locationTreeSelectData.value = []
		})
		.finally(() => {})
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	parentId: undefined,
	organizationCategoryId: undefined,
	organizationFactionId: undefined,
	systemId: undefined,
	no: "",
	name: "",
	shortName: "",
	locationId: undefined
})
const formRules: FormRules = reactive({
	no: [{ required: true, trigger: "blur", message: "请输入序号" }]
})
const handleCreate = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			if (currentUpdateId.value === undefined) {
				createApi({
					bookId: props.bookId,
					parentId: formData.parentId,
					organizationCategoryId: formData.organizationCategoryId,
					organizationFactionId: formData.organizationFactionId,
					systemId: formData.systemId,
					no: formData.no,
					name: formData.name,
					shortName: formData.shortName,
					locationId: formData.locationId
				}).then(() => {
					queryTreeSelectData()
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					bookId: props.bookId,
					parentId: formData.parentId,
					organizationCategoryId: formData.organizationCategoryId,
					organizationFactionId: formData.organizationFactionId,
					systemId: formData.systemId,
					no: formData.no,
					name: formData.name,
					shortName: formData.shortName,
					locationId: formData.locationId
				}).then(() => {
					ElMessage.success("修改成功")
					queryTreeSelectData()
					dialogVisible.value = false
					emit("success")
				})
			}
		} else {
			return false
		}
	})
}
//另存为
const handleSaveAs = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			createApi({
				bookId: props.bookId,
				parentId: formData.parentId,
				organizationCategoryId: formData.organizationCategoryId,
				organizationFactionId: formData.organizationFactionId,
				systemId: formData.systemId,
				no: formData.no,
				name: formData.name,
				shortName: formData.shortName,
				locationId: formData.locationId
			}).then(() => {
				queryTreeSelectData()
				dialogVisible.value = false
				emit("success")
			})
		} else {
			return false
		}
	})
}
//添加类别
const editOrganizationCategoryRef = ref<FormInstance | null>(null)
const organizationCategoryDialogVisible = ref<boolean>(false)
const handleAddOrganizationCategory = () => {
	organizationCategoryDialogVisible.value = true
	nextTick(() => {
		editOrganizationCategoryRef.value?.handleUpdate(undefined)
	})
}
//类别成功保存
const handleSaveOrganizationCategorySuccess = () => {
	queryOrganizationCategoryData()
}

//添加派系
const editOrganizationFactionRef = ref<FormInstance | null>(null)
const organizationFactionDialogVisible = ref<boolean>(false)
const handleAddOrganizationFaction = () => {
	organizationFactionDialogVisible.value = true
	nextTick(() => {
		editOrganizationFactionRef.value?.handleUpdate(undefined)
	})
}
//派系成功保存
const handleSaveOrganizationFactionSuccess = () => {
	queryOrganizationFactionData()
}

//添加体系
const editSystemRef = ref<FormInstance | null>(null)
const systemDialogVisible = ref<boolean>(false)
const handleAddSystem = () => {
	systemDialogVisible.value = true
	nextTick(() => {
		editSystemRef.value?.handleUpdate(undefined)
	})
}
//体系成功保存
const handleSaveSystemSuccess = () => {
	querySystemData()
}

//添加地点
const editLocationRef = ref<FormInstance | null>(null)
const locationDialogVisible = ref<boolean>(false)
const handleAddLocation = () => {
	locationDialogVisible.value = true
	nextTick(() => {
		editLocationRef.value?.handleUpdate(undefined)
	})
}
//地点成功保存
const handleSaveLocationSuccess = () => {
	queryLocationTreeSelectData()
}
//#endregion

defineExpose({
	handleUpdate
})
</script>
