<template>
	<div>Waiting...</div>
</template>

<script setup lang="ts" name="login">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { ElNotification } from "element-plus"
import { GlobalStore } from "@/stores"
import { TabsStore } from "@/stores/modules/tabs"
import { KeepAliveStore } from "@/stores/modules/keepAlive"
import { getTimeState } from "@/utils/util"
import { HOME_URL } from "@/config/config"
import { initDynamicRouter } from "@/routers/modules/dynamicRouter"
import AuthService from "@/services/auth.service"

const router = useRouter()
const tabsStore = TabsStore()
const keepAlive = KeepAliveStore()
const globalStore = GlobalStore()
const auth = new AuthService()

onMounted(() => {
	auth.getUser().then(async (user: any) => {
		if (user && user !== null && !user.expired) {
			globalStore.setToken(user.access_token)
			// 2.添加动态路由
			await initDynamicRouter()
			// 3.清空 tabs、keepAlive 保留的数据
			tabsStore.closeMultipleTab()
			keepAlive.setKeepAliveName()
			// 4.跳转到首页
			router.push(HOME_URL)
			ElNotification({
				title: getTimeState(),
				message: "欢迎登录 南荣ERP系统",
				type: "success",
				duration: 3000
			})
		} else {
			// 1.执行登录接口
			await auth.login()
		}
	})
})
</script>

<style scoped lang="scss"></style>
