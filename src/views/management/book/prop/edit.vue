<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="propCategoryId" label="分类">
				<el-tree-select
					v-model="formData.propCategoryId"
					:data="propCategoryTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/>
			</el-form-item>
			<el-form-item prop="elementId" label="元素">
				<el-tree-select
					v-model="formData.elementId"
					:data="elementTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/>
				<el-button style="margin-left: 8px" type="primary" link @click="handleAddElement">添加</el-button>
			</el-form-item>
			<el-form-item prop="levelRealmId" label="境界">
				<el-tree-select
					v-model="formData.levelRealmId"
					:data="levelRealmTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/>
				<el-button style="margin-left: 8px" type="primary" link @click="handleAddLevelRealm">添加</el-button>
			</el-form-item>
			<el-form-item prop="levelGradationId" label="层次">
				<el-tree-select
					v-model="formData.levelGradationId"
					:data="levelGradationTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/>
				<el-button style="margin-left: 8px" type="primary" link @click="handleAddLevelGradation">添加</el-button>
			</el-form-item>
			<el-form-item prop="levelGradeId" label="等级">
				<el-tree-select
					v-model="formData.levelGradeId"
					:data="levelGradeTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/>
				<el-button style="margin-left: 8px" type="primary" link @click="handleAddLevelGrade">添加</el-button>
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
	<editElement
		v-if="elementDialogVisible"
		ref="editElementRef"
		:bookId="bookId"
		@success="handleSaveElementSuccess"
	></editElement>
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
import { queryTreeSelectApi as queryPropCategoryTreeSelectApi } from "@/api/management/book/book-prop-category"
import { queryTreeSelectApi as queryElementTreeSelectApi } from "@/api/management/book/book-element"
import { queryTreeSelectApi as queryLevelRealmTreeSelectApi } from "@/api/management/book/book-level-realm"
import { queryTreeSelectApi as queryLevelGradationTreeSelectApi } from "@/api/management/book/book-level-gradation"
import { queryTreeSelectApi as queryLevelGradeTreeSelectApi } from "@/api/management/book/book-level-grade"
import { getApi, createApi, updateApi } from "@/api/management/book/book-prop"
import editElement from "../element/edit.vue"
import editLevelRealm from "../level-realm/edit.vue"
import editLevelGradation from "../level-gradation/edit.vue"
import editLevelGrade from "../level-grade/edit.vue"

//#region 初始化
const bookId = ref<string | undefined>(undefined)
const props = defineProps({
	bookId: String
})
const emit = defineEmits(["success"])

onMounted(() => {
	bookId.value = props.bookId
	queryPropCategoryTreeSelectData()
	queryElementTreeSelectData()
	queryLevelRealmTreeSelectData()
	queryLevelGradationTreeSelectData()
	queryLevelGradeTreeSelectData()
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
				formData.propCategoryId = res.data.propCategoryId
				formData.elementId = res.data.elementId
				formData.levelRealmId = res.data.levelRealmId
				formData.levelGradationId = res.data.levelGradationId
				formData.levelGradeId = res.data.levelGradeId
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
	formData.propCategoryId = ""
	formData.elementId = ""
	formData.levelRealmId = ""
	formData.levelGradationId = ""
	formData.levelGradeId = ""
	formData.no = ""
	formData.name = ""
	formData.shortName = ""
}
const propCategoryTreeSelectData = ref<any[]>([])
const queryPropCategoryTreeSelectData = () => {
	queryPropCategoryTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			propCategoryTreeSelectData.value = res.data
		})
		.catch(() => {
			propCategoryTreeSelectData.value = []
		})
		.finally(() => {})
}

const elementTreeSelectData = ref<any[]>([])
const queryElementTreeSelectData = () => {
	queryElementTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			elementTreeSelectData.value = res.data
		})
		.catch(() => {
			elementTreeSelectData.value = []
		})
		.finally(() => {})
}

const levelRealmTreeSelectData = ref<any[]>([])
const queryLevelRealmTreeSelectData = () => {
	queryLevelRealmTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			levelRealmTreeSelectData.value = res.data
		})
		.catch(() => {
			levelRealmTreeSelectData.value = []
		})
		.finally(() => {})
}

const levelGradationTreeSelectData = ref<any[]>([])
const queryLevelGradationTreeSelectData = () => {
	queryLevelGradationTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			levelGradationTreeSelectData.value = res.data
		})
		.catch(() => {
			levelGradationTreeSelectData.value = []
		})
		.finally(() => {})
}

const levelGradeTreeSelectData = ref<any[]>([])
const queryLevelGradeTreeSelectData = () => {
	queryLevelGradeTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			levelGradeTreeSelectData.value = res.data
		})
		.catch(() => {
			levelGradeTreeSelectData.value = []
		})
		.finally(() => {})
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	propCategoryId: "",
	elementId: "",
	levelRealmId: "",
	levelGradationId: "",
	levelGradeId: "",
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
					propCategoryId: formData.propCategoryId,
					elementId: formData.elementId,
					levelRealmId: formData.levelRealmId,
					levelGradationId: formData.levelGradationId,
					levelGradeId: formData.levelGradeId,
					no: formData.no,
					name: formData.name,
					shortName: formData.shortName
				}).then(() => {
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					bookId: props.bookId,
					propCategoryId: formData.propCategoryId,
					elementId: formData.elementId,
					levelRealmId: formData.levelRealmId,
					levelGradationId: formData.levelGradationId,
					levelGradeId: formData.levelGradeId,
					no: formData.no,
					name: formData.name,
					shortName: formData.shortName
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
				bookId: props.bookId,
				propCategoryId: formData.propCategoryId,
				elementId: formData.elementId,
				levelRealmId: formData.levelRealmId,
				levelGradationId: formData.levelGradationId,
				levelGradeId: formData.levelGradeId,
				no: formData.no,
				name: formData.name,
				shortName: formData.shortName
			}).then(() => {
				dialogVisible.value = false
				emit("success")
			})
		} else {
			return false
		}
	})
}

//添加元素
const editElementRef = ref<FormInstance | null>(null)
const elementDialogVisible = ref<boolean>(false)
const handleAddElement = () => {
	elementDialogVisible.value = true
	nextTick(() => {
		editElementRef.value?.handleUpdate(undefined)
	})
}
//元素成功保存
const handleSaveElementSuccess = () => {
	queryElementTreeSelectData()
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
	queryLevelRealmTreeSelectData()
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
	queryLevelGradationTreeSelectData()
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
	queryLevelGradeTreeSelectData()
}
//#endregion

defineExpose({
	handleUpdate
})
</script>
