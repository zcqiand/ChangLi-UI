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
			<el-form-item prop="no" label="序号">
				<el-input v-model="formData.no" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="name" label="名称">
				<el-input v-model="formData.name" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="shortName" label="简称">
				<el-input v-model="formData.shortName" placeholder="请输入" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleCreate">保存</el-button>
				<el-button v-show="currentUpdateId !== undefined" @click="handleSaveAs">另存为</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineExpose, onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { getApi, createApi, updateApi, queryTreeSelectApi } from "@/api/management/book/book-element"

//#region 初始化
const props = defineProps({
	bookId: String
})
const emit = defineEmits(["success"])

onMounted(() => {
	queryTreeSelectData()
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
				formData.no = res.data.no
				formData.name = res.data.name
				formData.shortName = res.data.shortName
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
	formData.no = ""
	formData.name = ""
	formData.shortName = ""
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
	no: "",
	name: "",
	shortName: ""
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
					no: formData.no,
					name: formData.name,
					shortName: formData.shortName
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
					no: formData.no,
					name: formData.name,
					shortName: formData.shortName
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
				no: formData.no,
				name: formData.name,
				shortName: formData.shortName
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
//#endregion

defineExpose({
	handleUpdate
})
</script>
