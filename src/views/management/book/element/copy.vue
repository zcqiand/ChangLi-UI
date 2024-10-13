<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" title="批量导入" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-divider content-position="left">源信息</el-divider>
			<el-form-item prop="bookId" label="作品">
				<el-select v-model="formData.bookId" placeholder="请选择" @change="handleSelectBook" clearable>
					<el-option v-for="item in bookData" :key="item.id" :label="item.name" :value="item.id" />
				</el-select>
			</el-form-item>
			<el-form-item prop="no" label="待导入">
				<el-table :data="tableData" row-key="id" @selection-change="selectionChange" border default-expand-all>
					<el-table-column type="selection" width="50" align="center" />
					<el-table-column prop="name" label="名称">
						<template #default="scope"> {{ scope.row.no }}.{{ scope.row.name }}</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-divider content-position="left">目标信息</el-divider>
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
			<el-form-item>
				<el-button type="primary" @click="handleBatchImport">确认</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineExpose, onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { queryApi as queryBookApi } from "@/api/management/book/book"
import { queryApi, batchImportApi, queryTreeSelectApi } from "@/api/management/book/book-element"

//#region 初始化
const props = defineProps({
	bookId: String
})
const loading = ref<boolean>(false)
const emit = defineEmits(["success"])

onMounted(() => {
	queryBookData()
})
//#endregion

//#region 主体
//设置表单
const handleUpdate = (id: undefined | string) => {
	tableData.value = []
	queryTreeSelectData()
	dialogVisible.value = true
}
//重置表单
const resetForm = () => {
	formData.bookId = undefined
	formData.parentId = undefined
}
//选择作品
const handleSelectBook = () => {
	queryTableData()
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
//获取作品清单
const bookData = ref<any[]>([])
const queryBookData = () => {
	queryBookApi({
		pageIndex: 1,
		pageSize: 20,
		name: undefined
	})
		.then((res: any) => {
			bookData.value = res.data.items
		})
		.catch(() => {
			bookData.value = []
		})
		.finally(() => {})
}
//表格选择
const selection = ref<any[]>([])
const selectionChange = (items: any[]) => {
	selection.value = items
}
//获取清单
const tableData = ref<any[]>([])
const queryTableData = () => {
	if (formData.bookId !== undefined && formData.bookId !== "") {
		loading.value = true
		queryApi({
			bookId: formData.bookId,
			parentId: undefined,
			name: undefined
		})
			.then((res: any) => {
				tableData.value = res.data
			})
			.catch(() => {
				tableData.value = []
			})
			.finally(() => {
				loading.value = false
			})
	} else {
		tableData.value = []
	}
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	bookId: undefined,
	parentId: undefined
})
const formRules: FormRules = reactive({})
const handleBatchImport = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			batchImportApi({
				bookId: props.bookId,
				parentId: formData.parentId,
				ids: selection.value.map(v => v.id)
			}).then(() => {
				ElMessage.success("导入成功")
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
