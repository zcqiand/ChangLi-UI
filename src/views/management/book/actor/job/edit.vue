<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="no" label="序号">
				<el-input v-model="formData.no" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="jobId" label="职业">
				<el-tree-select
					v-model="formData.jobId"
					:data="jobTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/><el-button style="margin-left: 8px" type="primary" link @click="handleAddJob">添加</el-button>
			</el-form-item>
			<el-form-item prop="levelRealmId" label="境界">
				<el-tree-select
					v-model="formData.levelRealmId"
					:data="realmTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/><el-button style="margin-left: 8px" type="primary" link @click="handleAddLevelRealm">添加</el-button>
			</el-form-item>
			<el-form-item prop="levelGradationId" label="层次">
				<el-tree-select
					v-model="formData.levelGradationId"
					:data="gradationTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/><el-button style="margin-left: 8px" type="primary" link @click="handleAddLevelGradation">添加</el-button>
			</el-form-item>
			<el-form-item prop="levelGradeId" label="等级">
				<el-tree-select
					v-model="formData.levelGradeId"
					:data="gradeTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/><el-button style="margin-left: 8px" type="primary" link @click="handleAddLevelGrade">添加</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleCreate">保存</el-button>
				<el-button v-show="currentUpdateId !== undefined" @click="handleSaveAs">另存为</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	<editJob v-if="jobDialogVisible" ref="editJobRef" :bookId="bookId" @success="handleSaveJobSuccess"></editJob>
	<editLevelRealm
		v-if="levelRealmDialogVisible"
		ref="editLevelRealmRef"
		:bookId="bookId"
		@success="handleSaveLevelRealmSuccess"
	></editLevelRealm>
	<editLevelGradation
		v-if="levelGradationDialogVisible"
		ref="editLevelGradationRef"
		:bookId="bookId"
		@success="handleSaveLevelGradationSuccess"
	></editLevelGradation>
	<editLevelGrade
		v-if="levelGradeDialogVisible"
		ref="editLevelGradeRef"
		:bookId="bookId"
		@success="handleSaveLevelGradeSuccess"
	></editLevelGrade>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, defineExpose, onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { queryTreeSelectApi as queryGradationTreeSelectApi } from "@/api/management/book/book-level-gradation"
import { queryTreeSelectApi as queryGradeTreeSelectApi } from "@/api/management/book/book-level-grade"
import { queryTreeSelectApi as queryRealmTreeSelectApi } from "@/api/management/book/book-level-realm"
import { queryTreeSelectApi as queryJobTreeSelectApi } from "@/api/management/book/book-job"
import { getApi, createApi, updateApi } from "@/api/management/book/book-actor-job"
import editJob from "../../job/edit.vue"
import editLevelRealm from "../../level-realm/edit.vue"
import editLevelGradation from "../../level-gradation/edit.vue"
import editLevelGrade from "../../level-grade/edit.vue"

//#region 初始化
const bookId = ref<string | undefined>(undefined)
const props = defineProps({
	bookId: String,
	actorId: String
})
const emit = defineEmits(["success"])

onMounted(() => {
	bookId.value = props.bookId
	queryJobTreeSelectData()
	queryRealmTreeSelectData()
	queryGradationTreeSelectData()
	queryGradeTreeSelectData()
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
				formData.jobId = res.data.jobId
				formData.levelRealmId = res.data.levelRealmId
				formData.levelGradationId = res.data.levelGradationId
				formData.levelGradeId = res.data.levelGradeId
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
	formData.jobId = undefined
	formData.levelRealmId = undefined
	formData.levelGradationId = undefined
	formData.levelGradeId = undefined
}

const jobTreeSelectData = ref<any[]>([])
const queryJobTreeSelectData = () => {
	queryJobTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			jobTreeSelectData.value = res.data
		})
		.catch(() => {
			jobTreeSelectData.value = []
		})
		.finally(() => {})
}

const realmTreeSelectData = ref<any[]>([])
const queryRealmTreeSelectData = () => {
	queryRealmTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			realmTreeSelectData.value = res.data
		})
		.catch(() => {
			realmTreeSelectData.value = []
		})
		.finally(() => {})
}

const gradationTreeSelectData = ref<any[]>([])
const queryGradationTreeSelectData = () => {
	queryGradationTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			gradationTreeSelectData.value = res.data
		})
		.catch(() => {
			gradationTreeSelectData.value = []
		})
		.finally(() => {})
}

const gradeTreeSelectData = ref<any[]>([])
const queryGradeTreeSelectData = () => {
	queryGradeTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			gradeTreeSelectData.value = res.data
		})
		.catch(() => {
			gradeTreeSelectData.value = []
		})
		.finally(() => {})
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	no: "",
	jobId: undefined,
	levelRealmId: undefined,
	levelGradationId: undefined,
	levelGradeId: undefined
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
					jobId: formData.jobId,
					levelRealmId: formData.levelRealmId,
					levelGradationId: formData.levelGradationId,
					levelGradeId: formData.levelGradeId
				}).then(() => {
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					actorId: props.actorId,
					no: formData.no,
					jobId: formData.jobId,
					levelRealmId: formData.levelRealmId,
					levelGradationId: formData.levelGradationId,
					levelGradeId: formData.levelGradeId
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
				jobId: formData.jobId,
				levelRealmId: formData.levelRealmId,
				levelGradationId: formData.levelGradationId,
				levelGradeId: formData.levelGradeId
			}).then(() => {
				dialogVisible.value = false
				emit("success")
			})
		} else {
			return false
		}
	})
}

//添加职业
const editJobRef = ref<FormInstance | null>(null)
const jobDialogVisible = ref<boolean>(false)
const handleAddJob = () => {
	jobDialogVisible.value = true
	nextTick(() => {
		editJobRef.value?.handleUpdate(undefined)
	})
}
//职业成功保存
const handleSaveJobSuccess = () => {
	queryJobTreeSelectData()
}

//添加境界
const editLevelRealmRef = ref<FormInstance | null>(null)
const levelRealmDialogVisible = ref<boolean>(false)
const handleAddLevelRealm = () => {
	levelRealmDialogVisible.value = true
	nextTick(() => {
		editLevelRealmRef.value?.handleUpdate(undefined)
	})
}
//境界成功保存
const handleSaveLevelRealmSuccess = () => {
	queryRealmTreeSelectData()
}

//添加层次
const editLevelGradationRef = ref<FormInstance | null>(null)
const levelGradationDialogVisible = ref<boolean>(false)
const handleAddLevelGradation = () => {
	levelGradationDialogVisible.value = true
	nextTick(() => {
		editLevelGradationRef.value?.handleUpdate(undefined)
	})
}
//层次成功保存
const handleSaveLevelGradationSuccess = () => {
	queryGradationTreeSelectData()
}

//添加等级
const editLevelGradeRef = ref<FormInstance | null>(null)
const levelGradeDialogVisible = ref<boolean>(false)
const handleAddLevelGrade = () => {
	levelGradeDialogVisible.value = true
	nextTick(() => {
		editLevelGradeRef.value?.handleUpdate(undefined)
	})
}
//等级成功保存
const handleSaveLevelGradeSuccess = () => {
	queryGradeTreeSelectData()
}
//#endregion

defineExpose({
	handleUpdate
})
</script>
