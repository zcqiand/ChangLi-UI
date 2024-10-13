<template>
	<div class="app-container">
		<el-card v-loading="loading" shadow="never">
			<el-row :gutter="10">
				<el-col :span="4">
					<el-menu @select="handleBookSelect" class="book-menu-wrapper" :default-active="bookId">
						<el-form ref="searchBookFormRef" :inline="true" :model="searchBookData" class="book-search-wrapper">
							<el-input
								v-model="searchBookData.name"
								placeholder="输入关键字过滤"
								:prefix-icon="Search"
								@input="handleBookSearch"
							/>
						</el-form>
						<el-menu-item v-for="o in bookData" :key="o.id" :index="o.id">
							<div>{{ o.name.substring(0, 12) }}<span v-if="o.name.length > 12">...</span></div>
						</el-menu-item>
					</el-menu>
				</el-col>
				<el-col :span="20" v-if="bookData.length > 0 && bookId != undefined">
					<div class="search-wrapper">
						<el-form ref="searchFormRef" :inline="true" :model="searchData">
							<el-form-item prop="name" label="名称">
								<el-input v-model="searchData.name" placeholder="请输入" />
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
							<el-tooltip content="下载">
								<el-button type="primary" :icon="Download" circle />
							</el-tooltip>
							<el-tooltip content="刷新表格">
								<el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
							</el-tooltip>
						</div>
					</div>
					<div class="table-wrapper">
						<el-table :data="tableData" row-key="id" @selection-change="selectionChange">
							<el-table-column type="selection" width="50" align="center" />
							<el-table-column prop="name" label="名称">
								<template #default="scope"> {{ scope.row.no }}.{{ scope.row.name }}</template>
							</el-table-column>
							<el-table-column prop="lastModifyTime" :formatter="dateFormat" label="最后更新时间" width="150" align="center" />
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
				</el-col>
			</el-row>
		</el-card>
		<edit v-if="dialogVisible" ref="editRef" :bookId="bookId" @success="handleSaveSuccess"></edit>
	</div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router"
import { reactive, ref, watch, nextTick, onMounted } from "vue"
import { queryApi as queryBookApi } from "@/api/management/book/book"
import { deleteApi, batchDeleteApi, queryApi } from "@/api/management/book/book-organization-faction"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, Delete, CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import moment from "moment"
import edit from "./edit.vue"

//#region 初始化
const bookId = ref<string | undefined>(undefined)
const loading = ref<boolean>(false)
const router = useRouter()
const route = useRoute()

onMounted(() => {
	if (route.query.bookId !== undefined) {
		bookId.value = route.query.bookId as string
	}
	queryBookData()
})

watch(
	() => route.query.bookId,
	newBookId => {
		bookId.value = newBookId as string
		queryTableData()
	}
)
//日期格式化
const dateFormat = (row: any, column: any) => {
	const date = row[column.property]
	if (date === undefined) {
		return ""
	}
	return moment(date).format("YYYY/MM/DD HH:mm")
}
//#endregion

//#region 菜单
//查询
const handleBookSearch = () => {
	queryBookData()
}

//选择
const handleBookSelect = (key: string | undefined) => {
	router.push(`?bookId=${key}`)
}

//获取清单
const searchBookFormRef = ref<FormInstance | null>(null)
const searchBookData = reactive({
	name: ""
})
const bookData = ref<any[]>([])
const queryBookData = () => {
	queryBookApi({
		pageIndex: 1,
		pageSize: 20,
		name: searchBookData.name || undefined
	})
		.then((res: any) => {
			bookData.value = res.data.items
			if (res.data.items !== undefined && res.data.items.length > 0) {
				if (bookId.value === undefined) {
					bookId.value = res.data.items[0].id
				}
				queryTableData()
			}
		})
		.catch(() => {
			bookData.value = []
		})
		.finally(() => {})
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
	name: ""
})
const tableData = ref<any[]>([])
const queryTableData = () => {
	if (bookId.value !== undefined && bookId.value.length > 0) {
		loading.value = true
		queryApi({
			pageIndex: paginationData.currentPage,
			pageSize: paginationData.pageSize,
			bookId: bookId.value,
			name: searchData.name || undefined
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
