<template>
	<div class="card top-box">
		<div class="top-title">我在修仙界万古长青</div>
		<div class="top-sub-title">诡秘世界第二部。1368之年，七月之末，深红将从天而降。</div>
		<div class="top-content" style="margin-top: 20px">
			<el-row :gutter="10">
				<el-col class="mb40" :span="4">
					<div class="traffic-box">
						<div class="traffic-img" @click="handleSelect('detail')">
							<img src="../images/a-shangdiandianpu.png" style="max-height: 60px" alt="" />
						</div>
						<span class="item-value"><el-link @click="handleSelect('detail')">作品主页</el-link></span>
					</div>
				</el-col>
				<!-- <el-col class="mb40" :span="4">
					<div class="traffic-box">
						<div class="traffic-img">
							<img src="../images/a-wanchengjilu.png" style="max-height: 60px" alt="" />
						</div>
						<span class="item-value"><el-link @click="handleSelect('actor')">故事情节</el-link></span>
					</div>
				</el-col> -->
				<el-col class="mb40" :span="4">
					<div class="traffic-box">
						<div class="traffic-img" @click="handleSelect('actor')">
							<img src="../images/a-kefufuwu.png" style="max-height: 60px" alt="" />
						</div>
						<span class="item-value"><el-link @click="handleSelect('actor')">人物介绍</el-link></span>
					</div>
				</el-col>
				<el-col class="mb40" :span="4">
					<div class="traffic-box" @click="handleSelect('organization')">
						<div class="traffic-img">
							<img src="../images/a-paihanghuodong.png" style="max-height: 60px" alt="" />
						</div>
						<span class="item-value"><el-link @click="handleSelect('organization')">组织势力</el-link></span>
					</div>
				</el-col>
				<!-- <el-col class="mb40" :span="4">
					<div class="traffic-box">
						<div class="traffic-img">
							<img src="../images/a-tupianzhaopian.png" style="max-height: 60px" alt="" />
						</div>
						<span class="item-value"><el-link @click="handleSelect('actor')">文化风俗</el-link></span>
					</div>
				</el-col> -->
				<el-col class="mb40" :span="4">
					<div class="traffic-box">
						<div class="traffic-img">
							<img src="../images/a-mubiaodaohang.png" style="max-height: 60px" alt="" />
						</div>
						<span class="item-value"><el-link @click="handleSelect('location')">地理信息</el-link></span>
					</div>
				</el-col>
				<el-col class="mb40" :span="4">
					<div class="traffic-box">
						<div class="traffic-img">
							<img src="../images/a-gouwugouwudai.png" style="max-height: 60px" alt="" />
						</div>
						<span class="item-value"><el-link @click="handleSelect('prop')">物品记录</el-link></span>
					</div>
				</el-col>
			</el-row>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

const handleSelect = (cmd: any) => {
	if (cmd == "detail") {
		router.push(`/home/book/${route.params.bookId}/detail`)
	} else if (cmd == "actor") {
		router.push(`/home/book/${route.params.bookId}/actor`)
	} else if (cmd == "organization") {
		router.push(`/home/book/${route.params.bookId}/organization`)
	} else if (cmd == "location") {
		router.push(`/home/book/${route.params.bookId}/location`)
	} else if (cmd == "prop") {
		router.push(`/home/book/${route.params.bookId}/prop`)
	}
}
</script>

<style scoped lang="scss">
@import "./nav.scss";
</style>
