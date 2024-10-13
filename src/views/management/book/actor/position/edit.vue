<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="no" label="序号">
				<el-input v-model="formData.no" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="organizationId" label="势力">
				<el-tree-select
					v-model="formData.organizationId"
					:data="oTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/><el-button style="margin-left: 8px" type="primary" link @click="handleAddOrganization">添加</el-button>
			</el-form-item>
			<el-form-item prop="ranking" label="排位">
				<el-input v-model="formData.ranking" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="positionId" label="职务">
				<el-tree-select
					v-model="formData.positionId"
					:data="pTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/><el-button style="margin-left: 8px" type="primary" link @click="handleAddPosition">添加</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleCreate">保存</el-button>
				<el-button v-show="currentUpdateId !== undefined" @click="handleSaveAs">另存为</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	<editPosition
		v-if="positionDialogVisible"
		ref="editPositionRef"
		:bookId="bookId"
		@success="handleSavePositionSuccess"
	></editPosition>
	<editOrganization
		v-if="organizationDialogVisible"
		ref="editOrganizationRef"
		:bookId="bookId"
		@success="handleSaveOrganizationSuccess"
	></editOrganization>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, defineExpose, onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { queryTreeSelectApi as queryOTreeSelectApi } from "@/api/management/book/book-organization"
import { queryTreeSelectApi as queryPTreeSelectApi } from "@/api/management/book/book-position"
import { getApi, createApi, updateApi } from "@/api/management/book/book-actor-position"
import editPosition from "../../position/edit.vue"
import editOrganization from "../../organization/edit.vue"

//#region 初始化
const bookId = ref<string | undefined>(undefined)
const props = defineProps({
	bookId: String,
	actorId: String
})
const emit = defineEmits(["success"])

onMounted(() => {
	bookId.value = props.bookId
	queryOTreeSelectData()
	queryPTreeSelectData()
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
				formData.no = res.data.no
				formData.organizationId = res.data.organizationId
				formData.ranking = res.data.ranking
				formData.positionId = res.data.positionId
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
	formData.no = ""
	formData.organizationId = undefined
	formData.ranking = ""
	formData.positionId = undefined
}

const oTreeSelectData = ref<any[]>([])
const queryOTreeSelectData = () => {
	queryOTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			oTreeSelectData.value = res.data
		})
		.catch(() => {
			oTreeSelectData.value = []
		})
		.finally(() => {})
}

const pTreeSelectData = ref<any[]>([])
const queryPTreeSelectData = () => {
	queryPTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			pTreeSelectData.value = res.data
		})
		.catch(() => {
			pTreeSelectData.value = []
		})
		.finally(() => {})
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	no: "",
	organizationId: undefined,
	ranking: "",
	positionId: undefined
})
const formRules: FormRules = reactive({
	no: [{ required: true, trigger: "blur", message: "请输入序号" }]
})
const handleCreate = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			if (currentUpdateId.value === undefined) {
				createApi({
					actorId: props.actorId,
					no: formData.no,
					organizationId: formData.organizationId,
					ranking: formData.ranking,
					positionId: formData.positionId
				}).then(() => {
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					actorId: props.actorId,
					no: formData.no,
					organizationId: formData.organizationId,
					ranking: formData.ranking,
					positionId: formData.positionId
				}).then(() => {
					ElMessage.success("修改成功")
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
				actorId: props.actorId,
				no: formData.no,
				organizationId: formData.organizationId,
				ranking: formData.ranking,
				positionId: formData.positionId
			}).then(() => {
				dialogVisible.value = false
				emit("success")
			})
		} else {
			return false
		}
	})
}
//添加职务
const editPositionRef = ref<FormInstance | null>(null)
const positionDialogVisible = ref<boolean>(false)
const handleAddPosition = () => {
	positionDialogVisible.value = true
	nextTick(() => {
		editPositionRef.value?.handleUpdate(undefined)
	})
}
//职务成功保存
const handleSavePositionSuccess = () => {
	queryPTreeSelectData()
}

//添加势力
const editOrganizationRef = ref<FormInstance | null>(null)
const organizationDialogVisible = ref<boolean>(false)
const handleAddOrganization = () => {
	organizationDialogVisible.value = true
	nextTick(() => {
		editOrganizationRef.value?.handleUpdate(undefined)
	})
}
//势力成功保存
const handleSaveOrganizationSuccess = () => {
	queryOTreeSelectData()
}
//#endregion

defineExpose({
	handleUpdate
})
</script>
