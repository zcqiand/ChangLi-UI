<template>
	<div class="dataVisualize-box">
		<Nav />
		<div class="card top-box">
			<div class="top-title">势力一览表</div>
			<el-tabs v-model="tabActive" class="demo-tabs" @tab-change="handleTabChange">
				<el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
			</el-tabs>
			<div class="top-content">
				<el-table :data="tableData" stripe style="width: 100%; margin-bottom: 20px" row-key="id" default-expand-all>
					<el-table-column fixed prop="name" label="分类" width="200">
						<template #default="scope">
							<el-link @click="handleSelect('category', scope.row.id)">{{ scope.row.name }}</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="organization" label="势力">
						<template #default="scope">
							<span v-for="item in scope.row.organizations" :key="item.id" style="margin-right: 8px">
								<el-tag
									><el-link @click="handleSelect('organization-detail', item.id)">{{ item.name }}</el-link></el-tag
								>
							</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"
import { ref, onMounted } from "vue"
import type { TabPaneName } from "element-plus"
import {
	queryByCategoryApi,
	queryByFactionApi,
	queryBySystemApi,
	queryByLocationApi
} from "@/api/management/book/book-organization"
import Nav from "./components/nav.vue"

const router = useRouter()
const route = useRoute()
const loading = ref<boolean>(false)
const tabActive = ref(1)

const handleSelect = (cmd: any, id: any) => {
	if (cmd == "actor-detail") {
		// router.push(`/home/book/detail/${route.params.bookId}/actor/detail/${id}`)
	}
	if (cmd == "category") {
		if (tabActive.value == 1) {
			// router.push(`/home/book/detail/${route.params.bookId}/organization/detail/${id}`)
		} else if (tabActive.value == 2) {
			// router.push(`/home/book/detail/${route.params.bookId}/position/detail/${id}`)
		} else if (tabActive.value == 3) {
			// router.push(`/home/book/detail/${route.params.bookId}/position/detail/${id}`)
		} else if (tabActive.value == 4) {
			// router.push(`/home/book/detail/${route.params.bookId}/position/detail/${id}`)
		} else if (tabActive.value == 5) {
			// router.push(`/home/book/detail/${route.params.bookId}/position/detail/${id}`)
		}
	}
}

const handleTabChange = (name: TabPaneName) => {
	if (name == 1) {
		queryByCategoryApiData()
	} else if (name == 2) {
		queryByFactionApiData()
	} else if (name == 3) {
		queryBySystemApiData()
	} else if (name == 4) {
		queryByLocationApiData()
	}
}

const tableData = ref<any[]>([])
const queryByCategoryApiData = () => {
	loading.value = true
	queryByCategoryApi({
		bookId: route.params.bookId
	})
		.then((res: any) => {
			tableData.value = res.data
		})
		.catch(() => {
			tableData.value = []
		})
		.finally(() => {
			loading.value = false
		})
}

const queryByFactionApiData = () => {
	loading.value = true
	queryByFactionApi({
		bookId: route.params.bookId
	})
		.then((res: any) => {
			tableData.value = res.data
		})
		.catch(() => {
			tableData.value = []
		})
		.finally(() => {
			loading.value = false
		})
}

const queryBySystemApiData = () => {
	loading.value = true
	queryBySystemApi({
		bookId: route.params.bookId
	})
		.then((res: any) => {
			tableData.value = res.data
		})
		.catch(() => {
			tableData.value = []
		})
		.finally(() => {
			loading.value = false
		})
}

const queryByLocationApiData = () => {
	loading.value = true
	queryByLocationApi({
		bookId: route.params.bookId
	})
		.then((res: any) => {
			tableData.value = res.data
		})
		.catch(() => {
			tableData.value = []
		})
		.finally(() => {
			loading.value = false
		})
}

onMounted(() => {
	queryByCategoryApiData()
})

const tab = [
	{ label: "按类别", name: 1 },
	{ label: "按派系", name: 2 },
	{ label: "按体系", name: 3 },
	{ label: "按地域", name: 4 }
]
</script>

<style scoped lang="scss">
@import "./detail.scss";
</style>
