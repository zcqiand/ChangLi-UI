<template>
	<div class="dataVisualize-box">
		<Nav />
		<div class="card top-box">
			<div class="top-title">数据可视化</div>
			<el-tabs v-model="tabActive" class="demo-tabs">
				<el-tab-pane v-for="item in tab" :key="item.name" :label="item.label" :name="item.name"></el-tab-pane>
			</el-tabs>
			<div class="top-content">
				<el-row :gutter="40">
					<el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
						<div class="item-left sle">
							<span class="left-title">访问总数</span>
							<div class="img-box">
								<img src="./images/book-sum.png" alt="" />
							</div>
							<span class="left-number">48.15w</span>
						</div>
					</el-col>
					<el-col class="mb40" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
						<div class="item-center">
							<div class="gitee-traffic traffic-box">
								<div class="traffic-img">
									<img src="./images/add_person.png" alt="" />
								</div>
								<span class="item-value">{{ getData.totalOfActor }}</span>
								<span class="traffic-name sle">人物</span>
							</div>
							<div class="gitHub-traffic traffic-box">
								<div class="traffic-img">
									<img src="./images/add_team.png" alt="" />
								</div>
								<span class="item-value">{{ getData.totalOfOrganization }}</span>
								<span class="traffic-name sle">势力</span>
							</div>
							<div class="today-traffic traffic-box">
								<div class="traffic-img">
									<img src="./images/a-jianzhugongsi.png" alt="" />
								</div>
								<span class="item-value">{{ getData.totalOfLocation }}</span>
								<span class="traffic-name sle">地点</span>
							</div>
							<div class="yesterday-traffic traffic-box">
								<div class="traffic-img">
									<img src="./images/a-youhuiyouhuiquan.png" alt="" />
								</div>
								<span class="item-value">{{ getData.totalOfProp }}</span>
								<span class="traffic-name sle">物品</span>
							</div>
						</div>
					</el-col>
					<el-col class="mb40" :xs="24" :sm="24" :md="24" :lg="10" :xl="10">
						<div class="item-right">
							<div class="echarts-title">本月访问量 / 总访问量占比</div>
							<div class="book-echarts">
								<Pie ref="pieRef" />
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import { ref, onMounted } from "vue"
import Pie from "./components/pie.vue"
import Nav from "./components/nav.vue"
import { getApi } from "@/api/management/book/book"

const loading = ref<boolean>(false)
const route = useRoute()
const tabActive = ref(1)
const pieRef = ref()

onMounted(() => {
	getApiData()
	pieRef.value.initChart(pieData)
})

const tab = [{ label: "全部", name: 1 }]
const pieData = [
	{ value: 6800, name: "本月访问量" },
	{ value: 481500, name: "总访问量" }
]

const getData = ref<any>({})

const getApiData = () => {
	loading.value = true
	getApi({
		id: route.params.bookId
	})
		.then((res: any) => {
			getData.value = res.data
		})
		.catch(() => {
			getData.value = {}
		})
		.finally(() => {
			loading.value = false
		})
}
</script>

<style scoped lang="scss">
@import "./detail.scss";
</style>
