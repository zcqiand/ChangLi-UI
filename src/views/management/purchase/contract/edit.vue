<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="contractNumber" label="合同编号">
				<el-input v-model="formData.contractNumber" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="contractDate" label="合同日期">
				<el-date-picker v-model="formData.contractDate" type="date" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="contractTitle" label="合同标题">
				<el-input v-model="formData.contractTitle" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="partyA" label="甲方">
				<el-input v-model="formData.partyA" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="partyB" label="乙方">
				<el-input v-model="formData.partyB" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="remark" label="备注">
				<el-input v-model="formData.remark" placeholder="请输入" />
			</el-form-item>
			<el-form-item label="合同清单">
				<el-table :data="formData.items" style="width: 100%">
					<el-table-column :prop="item.prop" :label="item.label" v-for="item in tableHeader" :key="item.prop">
						<template #default="scope">
							<div v-show="item.editable || scope.row.editable" class="editable-row">
								<template v-if="item.type === 'input'">
									<el-input size="small" v-model="scope.row[item.prop]" />
								</template>
								<template v-if="item.type === 'date'">
									<el-date-picker v-model="scope.row[item.prop]" type="date" value-format="YYYY-MM-DD" />
								</template>
							</div>
							<div v-show="!item.editable && !scope.row.editable" class="editable-row">
								<span class="editable-row-span">{{ scope.row[item.prop] }}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" width="160" align="center">
						<template #default="scope">
							<el-button v-show="!scope.row.editable" size="small" @click="scope.row.editable = true">编辑</el-button>
							<el-button v-show="scope.row.editable" size="small" type="success" @click="scope.row.editable = false"
								>确定</el-button
							>
							<el-button size="small" type="danger" @click="handleDeleteRow(scope.$index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleCreate">保存</el-button>
				<el-button @click="handleCreateRow">新增清单</el-button>
				<el-button v-show="currentUpdateId !== undefined" @click="handleSaveAs">另存为</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineExpose, onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { getApi, createApi, updateApi } from "@/api/management/erp/contract"

//#region 初始化
const emit = defineEmits(["success"])

const tableHeader = ref([
	{
		prop: "name",
		label: "物品名称",
		editable: false,
		type: "input"
	},
	{
		prop: "brandModel",
		label: "品牌型号",
		editable: false,
		type: "input"
	},
	{
		prop: "quantity",
		label: "数量",
		editable: false,
		type: "input"
	},
	{
		prop: "unitPrice",
		label: "单价",
		editable: false,
		type: "input"
	},
	{
		prop: "totalPrice",
		label: "总价",
		editable: false,
		type: "input"
	}
])

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
				formData.contractType = res.data.contractType
				formData.contractNumber = res.data.contractNumber
				formData.contractDate = res.data.contractDate
				formData.contractTitle = res.data.contractTitle
				formData.remark = res.data.remark
				formData.partyA = res.data.partyA
				formData.partyB = res.data.partyB
				formData.items = res.data.items
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
	formData.contractNumber = ""
	formData.contractDate = ""
	formData.contractTitle = ""
	formData.remark = ""
	formData.partyA = ""
	formData.partyB = ""
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	contractType: 0,
	contractNumber: "",
	contractDate: "",
	contractTitle: "",
	remark: "",
	partyA: "",
	partyB: "",
	items: []
})
const formRules: FormRules = reactive({
	contractDate: [{ required: true, trigger: "blur", message: "请输入合同日期" }],
	contractTitle: [{ required: true, trigger: "blur", message: "请输入合同标题" }],
	partyA: [{ required: true, trigger: "blur", message: "请输入甲方" }],
	partyB: [{ required: true, trigger: "blur", message: "请输入乙方" }]
})
const handleCreate = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			if (currentUpdateId.value === undefined) {
				createApi({
					contractType: formData.contractType,
					contractNumber: formData.contractNumber,
					contractDate: formData.contractDate,
					contractTitle: formData.contractTitle,
					remark: formData.remark,
					partyA: formData.partyA,
					partyB: formData.partyB,
					items: formData.items
				}).then(() => {
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					contractType: formData.contractType,
					contractNumber: formData.contractNumber,
					contractDate: formData.contractDate,
					contractTitle: formData.contractTitle,
					remark: formData.remark,
					partyA: formData.partyA,
					partyB: formData.partyB,
					items: formData.items
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
const handleCreateRow = () => {
	formData.items.push({
		name: "",
		brandModel: "",
		quantity: "",
		unitPrice: "",
		totalPrice: "",
		editable: true
	})
}
const handleDeleteRow = (index: number) => {
	formData.items.splice(index, 1)
}
//另存为
const handleSaveAs = () => {
	formRef.value?.validate((valid: boolean) => {
		if (valid) {
			createApi({
				contractType: formData.contractType,
				contractNumber: formData.contractNumber,
				contractDate: formData.contractDate,
				contractTitle: formData.contractTitle,
				remark: formData.remark,
				partyA: formData.partyA,
				partyB: formData.partyB,
				items: formData.items
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
