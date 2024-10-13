<template>
	<!-- 新增/修改 -->
	<el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
		<el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
			<el-form-item prop="actorSpecyCategoryId" label="种族">
				<el-tree-select
					v-model="formData.actorSpecyCategoryId"
					:data="ascTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/><el-button style="margin-left: 8px" type="primary" link @click="handleAddActorSpecyCategory">添加</el-button>
			</el-form-item>
			<el-form-item prop="no" label="序号">
				<el-input v-model="formData.no" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="lastName" label="姓">
				<el-input v-model="formData.lastName" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="lastName" label="名">
				<el-input v-model="formData.firstName" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="aliasName" label="别名">
				<el-input v-model="formData.aliasName" placeholder="请输入" />
			</el-form-item>
			<el-form-item prop="locationId" label="所在地">
				<el-tree-select
					v-model="formData.locationId"
					:data="lTreeSelectData"
					check-strictly
					:render-after-expand="false"
					show-checkbox
					check-on-click-node
					clearable
				/><el-button style="margin-left: 8px" type="primary" link @click="handleAddLocation">添加</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="handleCreate">保存</el-button>
				<el-button v-show="currentUpdateId !== undefined" @click="handleSaveAs">另存为</el-button>
				<el-button @click="dialogVisible = false">取消</el-button>
			</el-form-item>
		</el-form>
	</el-dialog>
	<editActorSpecyCategory
		v-if="actorSpecyCategoryDialogVisible"
		ref="editActorSpecyCategoryRef"
		:bookId="bookId"
		@success="handleSaveActorSpecyCategorySuccess"
	></editActorSpecyCategory>
	<editLocation
		v-if="locationDialogVisible"
		ref="editLocationRef"
		:bookId="bookId"
		@success="handleSaveLocationSuccess"
	></editLocation>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, defineExpose, onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { queryTreeSelectApi as queryAscTreeSelectApi } from "@/api/management/book/book-actor-specy-category"
import { queryTreeSelectApi as queryLTreeSelectApi } from "@/api/management/book/book-location"
import { getApi, createApi, updateApi } from "@/api/management/book/book-actor"
import editActorSpecyCategory from "../actor-specy-category/edit.vue"
import editLocation from "../location/edit.vue"

//#region 初始化
const bookId = ref<string | undefined>(undefined)
const props = defineProps({
	bookId: String
})
const emit = defineEmits(["success"])

onMounted(() => {
	bookId.value = props.bookId
	queryAscTreeSelectData()
	queryLTreeSelectData()
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
				formData.actorSpecyCategoryId = res.data.actorSpecyCategoryId
				formData.no = res.data.no
				formData.lastName = res.data.lastName
				formData.firstName = res.data.firstName
				formData.aliasName = res.data.aliasName
				formData.locationId = res.data.locationId
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
	formData.actorSpecyCategoryId = ""
	formData.no = ""
	formData.lastName = ""
	formData.firstName = ""
	formData.aliasName = ""
	formData.locationId = ""
}
const ascTreeSelectData = ref<any[]>([])
const queryAscTreeSelectData = () => {
	queryAscTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			ascTreeSelectData.value = res.data
		})
		.catch(() => {
			ascTreeSelectData.value = []
		})
		.finally(() => {})
}

const lTreeSelectData = ref<any[]>([])
const queryLTreeSelectData = () => {
	queryLTreeSelectApi({
		bookId: props.bookId
	})
		.then((res: any) => {
			lTreeSelectData.value = res.data
		})
		.catch(() => {
			lTreeSelectData.value = []
		})
		.finally(() => {})
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
	actorSpecyCategoryId: "",
	no: "",
	lastName: "",
	firstName: "",
	aliasName: "",
	locationId: ""
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
					actorSpecyCategoryId: formData.actorSpecyCategoryId,
					no: formData.no,
					lastName: formData.lastName,
					firstName: formData.firstName,
					aliasName: formData.aliasName,
					locationId: formData.locationId
				}).then(() => {
					queryAscTreeSelectData()
					queryLTreeSelectData()
					dialogVisible.value = false
					emit("success")
				})
			} else {
				updateApi({
					id: currentUpdateId.value,
					bookId: props.bookId,
					actorSpecyCategoryId: formData.actorSpecyCategoryId,
					no: formData.no,
					lastName: formData.lastName,
					firstName: formData.firstName,
					aliasName: formData.aliasName,
					locationId: formData.locationId
				}).then(() => {
					ElMessage.success("修改成功")
					queryAscTreeSelectData()
					queryLTreeSelectData()
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
				actorSpecyCategoryId: formData.actorSpecyCategoryId,
				no: formData.no,
				lastName: formData.lastName,
				firstName: formData.firstName,
				aliasName: formData.aliasName,
				locationId: formData.locationId
			}).then(() => {
				queryAscTreeSelectData()
				queryLTreeSelectData()
				dialogVisible.value = false
				emit("success")
			})
		} else {
			return false
		}
	})
}

//添加种族
const editActorSpecyCategoryRef = ref<FormInstance | null>(null)
const actorSpecyCategoryDialogVisible = ref<boolean>(false)
const handleAddActorSpecyCategory = () => {
	actorSpecyCategoryDialogVisible.value = true
	nextTick(() => {
		editActorSpecyCategoryRef.value?.handleUpdate(undefined)
	})
}
//种族成功保存
const handleSaveActorSpecyCategorySuccess = () => {
	queryAscTreeSelectData()
}

//添加地点
const editLocationRef = ref<FormInstance | null>(null)
const locationDialogVisible = ref<boolean>(false)
const handleAddLocation = () => {
	locationDialogVisible.value = true
	nextTick(() => {
		editLocationRef.value?.handleUpdate(undefined)
	})
}
//地点成功保存
const handleSaveLocationSuccess = () => {
	queryLTreeSelectData()
}
//#endregion

defineExpose({
	handleUpdate
})
</script>
