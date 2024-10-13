<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="enterpriseType" label="企业类型">
				<el-input v-model="formData.enterpriseType" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="name" label="企业全称">
				<el-input v-model="formData.name" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="shortName" label="企业简称">
				<el-input v-model="formData.shortName" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="categoryId" label="企业类别标识">
				<el-input v-model="formData.categoryId" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="contactPerson" label="联系人">
				<el-input v-model="formData.contactPerson" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="contactTel" label="联系电话">
				<el-input v-model="formData.contactTel" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="contactAddress" label="联系地址">
				<el-input v-model="formData.contactAddress" placeholder="请输入" />
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
import { getApi, createApi, updateApi } from "@/api/management/erp/businessEnterprise"

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
				formData.enterpriseType = res.data.enterpriseType
				formData.name = res.data.name
				formData.shortName = res.data.shortName
				formData.categoryId = res.data.categoryId
				formData.contactPerson = res.data.contactPerson
				formData.contactTel = res.data.contactTel
				formData.contactAddress = res.data.contactAddress
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
	formData.enterpriseType = ""
	formData.name = ""
	formData.shortName = ""
	formData.categoryId = ""
	formData.contactPerson = ""
	formData.contactTel = ""
	formData.contactAddress = ""
	formData.remark = ""
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	enterpriseType: "",
	name: "",
	shortName: "",
	categoryId: "",
	contactPerson: "",
	contactTel: "",
	contactAddress: "",
	remark: "",
})
const formRules: FormRules = reactive({
	enterpriseType: [{ required: true, trigger: "blur", message: "请输入企业类型" }],
	name: [{ required: true, trigger: "blur", message: "请输入企业全称" }],
	shortName: [{ required: true, trigger: "blur", message: "请输入企业简称" }],
})
const handleCreate = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			if (currentUpdateId.value === undefined) {
				createApi({
					enterpriseType: formData.enterpriseType,
					name: formData.name,
					shortName: formData.shortName,
					categoryId: formData.categoryId,
					contactPerson: formData.contactPerson,
					contactTel: formData.contactTel,
					contactAddress: formData.contactAddress,
					remark: formData.remark,
				}).then(() => {
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					enterpriseType: formData.enterpriseType,
					name: formData.name,
					shortName: formData.shortName,
					categoryId: formData.categoryId,
					contactPerson: formData.contactPerson,
					contactTel: formData.contactTel,
					contactAddress: formData.contactAddress,
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
				enterpriseType: formData.enterpriseType,
				name: formData.name,
				shortName: formData.shortName,
				categoryId: formData.categoryId,
				contactPerson: formData.contactPerson,
				contactTel: formData.contactTel,
				contactAddress: formData.contactAddress,
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

