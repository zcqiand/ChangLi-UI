<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="returnGoodsType" label="退货类型">
				<el-input v-model="formData.returnGoodsType" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="returnGoodsNumber" label="退货编号">
				<el-input v-model="formData.returnGoodsNumber" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="returnGoodsDate" label="退货日期">
				<el-input v-model="formData.returnGoodsDate" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="returnGoodsTitle" label="退货标题">
				<el-input v-model="formData.returnGoodsTitle" placeholder="请输入" />
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
import { getApi, createApi, updateApi } from "@/api/management/erp/returnGoods"

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
				formData.returnGoodsType = res.data.returnGoodsType
				formData.returnGoodsNumber = res.data.returnGoodsNumber
				formData.returnGoodsDate = res.data.returnGoodsDate
				formData.returnGoodsTitle = res.data.returnGoodsTitle
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
	formData.returnGoodsType = ""
	formData.returnGoodsNumber = ""
	formData.returnGoodsDate = ""
	formData.returnGoodsTitle = ""
	formData.remark = ""
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	returnGoodsType: "",
	returnGoodsNumber: "",
	returnGoodsDate: "",
	returnGoodsTitle: "",
	remark: "",
})
const formRules: FormRules = reactive({
	returnGoodsType: [{ required: true, trigger: "blur", message: "请输入退货类型" }],
	returnGoodsDate: [{ required: true, trigger: "blur", message: "请输入退货日期" }],
	returnGoodsTitle: [{ required: true, trigger: "blur", message: "请输入退货标题" }],
})
const handleCreate = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			if (currentUpdateId.value === undefined) {
				createApi({
					returnGoodsType: formData.returnGoodsType,
					returnGoodsNumber: formData.returnGoodsNumber,
					returnGoodsDate: formData.returnGoodsDate,
					returnGoodsTitle: formData.returnGoodsTitle,
					remark: formData.remark,
				}).then(() => {
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					returnGoodsType: formData.returnGoodsType,
					returnGoodsNumber: formData.returnGoodsNumber,
					returnGoodsDate: formData.returnGoodsDate,
					returnGoodsTitle: formData.returnGoodsTitle,
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
				returnGoodsType: formData.returnGoodsType,
				returnGoodsNumber: formData.returnGoodsNumber,
				returnGoodsDate: formData.returnGoodsDate,
				returnGoodsTitle: formData.returnGoodsTitle,
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

