<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="stockType" label="库存类型">
				<el-input v-model="formData.stockType" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="stockNumber" label="库存编号">
				<el-input v-model="formData.stockNumber" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="stockDate" label="库存日期">
				<el-input v-model="formData.stockDate" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="stockTitle" label="库存标题">
				<el-input v-model="formData.stockTitle" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="formData.remark" placeholder="请输入" />
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
import { getApi, createApi, updateApi } from "@/api/management/erp/stock"

//#region 初始化
const props = defineProps({
	bookId: String
})
const emit = defineEmits(["success"])

onMounted(() => {})
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
				formData.stockType = res.data.stockType
				formData.stockNumber = res.data.stockNumber
				formData.stockDate = res.data.stockDate
				formData.stockTitle = res.data.stockTitle
				formData.remark = res.data.remark
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
	formData.stockType = ""
	formData.stockNumber = ""
	formData.stockDate = ""
	formData.stockTitle = ""
	formData.remark = ""
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	stockType: "",
	stockNumber: "",
	stockDate: "",
	stockTitle: "",
	remark: "",
})
const formRules: FormRules = reactive({
	stockType: [{ required: true, trigger: "blur", message: "请输入库存类型" }],
	stockDate: [{ required: true, trigger: "blur", message: "请输入库存日期" }],
	stockTitle: [{ required: true, trigger: "blur", message: "请输入库存标题" }],
})
const handleCreate = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			if (currentUpdateId.value === undefined) {
				createApi({
					stockType: formData.stockType,
					stockNumber: formData.stockNumber,
					stockDate: formData.stockDate,
					stockTitle: formData.stockTitle,
					remark: formData.remark,
				}).then(() => {
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					stockType: formData.stockType,
					stockNumber: formData.stockNumber,
					stockDate: formData.stockDate,
					stockTitle: formData.stockTitle,
					remark: formData.remark,
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
				stockType: formData.stockType,
				stockNumber: formData.stockNumber,
				stockDate: formData.stockDate,
				stockTitle: formData.stockTitle,
				remark: formData.remark,
			}).then(() => {
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

