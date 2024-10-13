<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="returnGoodsId" label="退货标识">
				<el-input v-model="formData.returnGoodsId" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="goodsId" label="物品标识">
				<el-input v-model="formData.goodsId" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="quantity" label="数量">
				<el-input v-model="formData.quantity" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="unitPrice" label="单价">
				<el-input v-model="formData.unitPrice" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="totalPrice" label="总价">
				<el-input v-model="formData.totalPrice" placeholder="请输入" />
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
import { getApi, createApi, updateApi } from "@/api/management/erp/returnGoodsItem"

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
				formData.returnGoodsId = res.data.returnGoodsId
				formData.goodsId = res.data.goodsId
				formData.quantity = res.data.quantity
				formData.unitPrice = res.data.unitPrice
				formData.totalPrice = res.data.totalPrice
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
	formData.returnGoodsId = ""
	formData.goodsId = ""
	formData.quantity = ""
	formData.unitPrice = ""
	formData.totalPrice = ""
	formData.remark = ""
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	returnGoodsId: "",
	goodsId: "",
	quantity: "",
	unitPrice: "",
	totalPrice: "",
	remark: "",
})
const formRules: FormRules = reactive({
	returnGoodsId: [{ required: true, trigger: "blur", message: "请输入退货标识" }],
	goodsId: [{ required: true, trigger: "blur", message: "请输入物品标识" }],
	quantity: [{ required: true, trigger: "blur", message: "请输入数量" }],
	unitPrice: [{ required: true, trigger: "blur", message: "请输入单价" }],
	totalPrice: [{ required: true, trigger: "blur", message: "请输入总价" }],
})
const handleCreate = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			if (currentUpdateId.value === undefined) {
				createApi({
					returnGoodsId: formData.returnGoodsId,
					goodsId: formData.goodsId,
					quantity: formData.quantity,
					unitPrice: formData.unitPrice,
					totalPrice: formData.totalPrice,
					remark: formData.remark,
				}).then(() => {
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					returnGoodsId: formData.returnGoodsId,
					goodsId: formData.goodsId,
					quantity: formData.quantity,
					unitPrice: formData.unitPrice,
					totalPrice: formData.totalPrice,
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
				returnGoodsId: formData.returnGoodsId,
				goodsId: formData.goodsId,
				quantity: formData.quantity,
				unitPrice: formData.unitPrice,
				totalPrice: formData.totalPrice,
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

