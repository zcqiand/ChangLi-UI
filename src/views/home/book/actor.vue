<template>
	<div class="dataVisualize-box">
		<Nav />
		<div class="card top-box">
			<div class="top-title">人物一览表</div>
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
					<el-table-column prop="actor" label="人物">
						<template #default="scope">
							<span v-for="item in scope.row.actors" :key="item.id" style="margin-right: 8px">
								<el-tag
									><el-link @click="handleSelect('actor-detail', item.id)">{{ item.fullName }}</el-link></el-tag
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
	queryByOrganizationApi,
	queryByPositionApi,
	queryByJobApi,
	queryByLocationApi,
	queryByLevelRealmApi
} from "@/api/management/book/book-actor"
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
		queryByOrganizationApiData()
	} else if (name == 2) {
		queryByPositionApiData()
	} else if (name == 3) {
		queryByJobApiData()
	} else if (name == 4) {
		queryByLocationApiData()
	} else if (name == 5) {
		queryByLevelRealmApiData()
	}
}

const tableData = ref<any[]>([])
const queryByOrganizationApiData = () => {
	loading.value = true
	queryByOrganizationApi({
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

const queryByPositionApiData = () => {
	loading.value = true
	queryByPositionApi({
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

const queryByJobApiData = () => {
	loading.value = true
	queryByJobApi({
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

const queryByLevelRealmApiData = () => {
	loading.value = true
	queryByLevelRealmApi({
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
	queryByOrganizationApiData()
})

const tab = [
	{ label: "按势力", name: 1 },
	{ label: "按职务", name: 2 },
	{ label: "按职业", name: 3 },
	{ label: "按地域", name: 4 },
	{ label: "按等级", name: 5 }
]
</script>

<style scoped lang="scss">
@import "./detail.scss";
</style>
