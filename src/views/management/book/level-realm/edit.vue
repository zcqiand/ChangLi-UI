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
			<el-form-item prop="levelValue" label="级别值">
				<el-input v-model="formData.levelValue" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="title" label="称号">
				<el-input v-model="formData.title" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="otherTitle" label="别称">
				<el-input v-model="formData.otherTitle" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="description" label="描述">
				<el-input v-model="formData.description" show-word-limit type="textarea" placeholder="请输入" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleCreate">保存</el-button>
				<el-button v-show="currentUpdateId !== undefined" @click="handleSaveAs">另存为</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	<editSystem v-if="systemDialogVisible" ref="editSystemRef" :bookId="bookId" @success="handleSaveSystemSuccess"></editSystem>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, defineExpose, onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { queryApi as querySystemApi } from "@/api/management/book/book-system"
import { getApi, createApi, updateApi, queryTreeSelectApi } from "@/api/management/book/book-level-realm"
import editSystem from "../system/edit.vue"

//#region 初始化
const props = defineProps({
	bookId: String
})
const emit = defineEmits(["success"])

onMounted(() => {
	queryTreeSelectData()
	querySystemData()
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
				formData.systemId = res.data.systemId
				formData.no = res.data.no
				formData.name = res.data.name
				formData.shortName = res.data.shortName
				formData.levelValue = res.data.levelValue
				formData.title = res.data.title
				formData.otherTitle = res.data.otherTitle
				formData.description = res.data.description
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
	formData.systemId = undefined
	formData.no = ""
	formData.name = ""
	formData.shortName = ""
	formData.levelValue = ""
	formData.title = ""
	formData.otherTitle = ""
	formData.description = ""
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
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	parentId: undefined,
	systemId: undefined,
	no: "",
	name: "",
	shortName: "",
	levelValue: "",
	title: "",
	otherTitle: "",
	description: ""
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
					systemId: formData.systemId,
					no: formData.no,
					name: formData.name,
					shortName: formData.shortName,
					levelValue: formData.levelValue,
					title: formData.title,
					otherTitle: formData.otherTitle,
					description: formData.description
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
					systemId: formData.systemId,
					no: formData.no,
					name: formData.name,
					shortName: formData.shortName,
					levelValue: formData.levelValue,
					title: formData.title,
					otherTitle: formData.otherTitle,
					description: formData.description
				}).then(() => {
					queryTreeSelectData()
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
				bookId: props.bookId,
				parentId: formData.parentId,
				systemId: formData.systemId,
				no: formData.no,
				name: formData.name,
				shortName: formData.shortName,
				levelValue: formData.levelValue,
				title: formData.title,
				otherTitle: formData.otherTitle,
				description: formData.description
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
//#endregion

defineExpose({
	handleUpdate
})
</script>
