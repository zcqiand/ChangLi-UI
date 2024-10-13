<template>
	<div class="app-container">
		<el-card v-loading="loading" shadow="never">
			<div class="search-wrapper">
				<el-form ref="searchFormRef" :inline="true" :model="searchData">
					<el-form-item prop="returnGoodsTitle" label="退货标题">
						<el-input v-model="searchData.returnGoodsTitle" placeholder="请输入" />
					</el-form-item>
					<el-form-item>
						<el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
						<el-button :icon="Refresh" @click="resetSearch">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="toolbar-wrapper">
				<div>
					<el-button type="primary" :icon="CirclePlus" @click="handleAdd">新增</el-button>
					<el-button type="danger" :icon="Delete" :disabled="selection.length == 0" @click="handleBatchDelete"
						>批量删除</el-button
					>
				</div>
				<div>
					<el-tooltip content="刷新表格">
						<el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
					</el-tooltip>
				</div>
			</div>
			<div class="table-wrapper">
				<el-table :data="tableData" row-key="id" @selection-change="selectionChange" border default-expand-all>
					<el-table-column type="selection" width="50" align="center" />
					<el-table-column prop="returnGoodsNumber" label="退货编号" width="150" align="center" />
					<el-table-column prop="returnGoodsTitle" label="退货标题">
						<template #default="scope">{{ scope.row.returnGoodsTitle }}</template>
					</el-table-column>
					<el-table-column prop="returnGoodsDate" :formatter="dateFormat" label="最后更新时间" width="150" align="center" />
					<el-table-column fixed="right" label="操作" width="140" align="center">
						<template #default="scope">
							<el-button type="primary" text bg size="small" @click="handleEdit(scope.row)">修改</el-button>
							<el-dropdown
								@command="
											(command: string) => {
												handleCommand(command, scope.row)
											}
										"
							>
								<el-button type="primary" text bg size="small" style="margin-left: 5px"
									>更多<el-icon class="el-icon--right"><arrow-down /></el-icon
								></el-button>
								<template #dropdown>
									<el-dropdown-menu>
										<el-dropdown-item command="delete">删除</el-dropdown-item>
									</el-dropdown-menu>
								</template>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pager-wrapper">
				<el-pagination
					background
					:layout="paginationData.layout"
					:page-sizes="paginationData.pageSizes"
					:total="paginationData.total"
					:page-size="paginationData.pageSize"
					:currentPage="paginationData.currentPage"
					@size-change="handleSizeChange"
					@current-change="handleCurrentChange"
				/>
			</div>
		</el-card>
		<edit v-if="dialogVisible" ref="editRef" @success="handleSaveSuccess"></edit>
	</div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router"
import { reactive, ref, watch, nextTick, onMounted } from "vue"
import { deleteApi, batchDeleteApi, queryApi } from "@/api/management/erp/returnGoods"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, Delete, CirclePlus, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import moment from "moment"
import edit from "./edit.vue"

//#region 初始化
const loading = ref<boolean>(false)
const router = useRouter()
const route = useRoute()

onMounted(() => {
	queryTableData()
})

//日期格式化
const dateFormat = (row: any, column: any) => {
	const date = row[column.property]
	if (date === undefined) {
		return ""
	}
	return moment(date).format("YYYY/MM/DD")
}
//#endregion

//#region 主体
//查询
const handleSearch = () => {
	queryTableData()
}
//查询重置
const resetSearch = () => {
	searchFormRef.value?.resetFields()
	queryTableData()
}
//刷新
const handleRefresh = () => {
	queryTableData()
}
//表格选择
const selection = ref<any[]>([])
const selectionChange = (items: any[]) => {
	selection.value = items
}
//获取清单
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
	returnGoodsTitle: ""
})
const tableData = ref<any[]>([])
const queryTableData = () => {
	loading.value = true
	queryApi({
		pageIndex: paginationData.currentPage,
		pageSize: paginationData.pageSize,
		returnGoodsTitle: searchData.returnGoodsTitle || undefined
	})
		.then((res: any) => {
			paginationData.total = res.data.total
			tableData.value = res.data.items
		})
		.catch(() => {
			tableData.value = []
		})
		.finally(() => {
			loading.value = false
		})
}
//分页
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
watch([() => paginationData.currentPage, () => paginationData.pageSize], queryTableData, { immediate: true })
//添加
const editRef = ref<FormInstance | null>(null)
const dialogVisible = ref<boolean>(false)
const handleAdd = () => {
	dialogVisible.value = true
	nextTick(() => {
		editRef.value?.handleUpdate(undefined)
	})
}
//编辑
const handleEdit = (row: any) => {
	dialogVisible.value = true
	nextTick(() => {
		editRef.value?.handleUpdate(row.id)
	})
}
//更多命令
const handleCommand = (command: string, row: any) => {
	//删除
	if (command == "delete") {
		handleDelete(row)
	}
}
//保存成功
const handleSaveSuccess = () => {
	queryTableData()
}
//删除
const handleDelete = (row: any) => {
	ElMessageBox.confirm(`正在删除：${row.name}，确认删除？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning"
	}).then(() => {
		deleteApi({
			id: row.id
		}).then(() => {
			ElMessage.success("删除成功")
			queryTableData()
		})
	})
}
//批量删除
const handleBatchDelete = () => {
	ElMessageBox.confirm(`确认批量删除？`, "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning"
	}).then(() => {
		batchDeleteApi({
			ids: selection.value.map(v => v.id)
		}).then(() => {
			ElMessage.success("删除成功")
			queryTableData()
		})
	})
}
//#endregion
</script>

<style lang="scss" scoped>
@import "../../index.scss";
</style>
