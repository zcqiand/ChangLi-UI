<template>
	<el-row>
		<el-col v-for="item in bookData" :key="item.id" :span="6" v-loading="loading">
			<el-card shadow="always" style="margin: 10px">
				<img src="@/assets/images/demo03.jpg" class="image" />
				<div style="padding-top: 10px">
					<span>{{ item.name }}</span>
					<div class="bottom">
						<time class="time">{{ dateFormat(item.lastModifyTime) }}</time>
						<el-button text class="button" @click="handleShowDetail(item.id)">书籍详情</el-button>
					</div>
				</div>
			</el-card>
		</el-col>
	</el-row>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router"
import { ref, onMounted } from "vue"
import { queryApi } from "@/api/management/book/book"
import moment from "moment"

const router = useRouter()
const loading = ref<boolean>(false)

const dateFormat = (date: any) => {
	if (date === undefined) {
		return ""
	}
	return moment(date).format("YYYY/MM/DD HH:mm")
}

const handleShowDetail = (bookId: any) => {
	router.push(`/home/book/${bookId}/detail`)
}

const bookData = ref<any[]>([])
const getBookData = () => {
	loading.value = true
	queryApi({
		pageIndex: 1,
		pageSize: 100,
		name: undefined
	})
		.then((res: any) => {
			bookData.value = res.data.items
		})
		.catch(() => {
			bookData.value = []
		})
		.finally(() => {
			loading.value = false
		})
}
onMounted(() => {
	getBookData()
})
</script>

<style scoped lang="scss">
.time {
	font-size: 12px;
	color: #999999;
}
.bottom {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 10px;
	line-height: 12px;
}
.button {
	min-height: auto;
}
.image {
	display: block;
	width: 100%;
}
</style>
