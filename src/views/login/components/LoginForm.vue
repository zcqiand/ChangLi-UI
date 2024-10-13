<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
		<el-form-item prop="username">
			<el-input v-model="loginForm.username" placeholder="用户名">
				<template #prefix>
					<el-icon class="el-input__icon"><user /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item prop="password">
			<el-input type="password" v-model="loginForm.password" placeholder="密码" show-password autocomplete="new-password">
				<template #prefix>
					<el-icon class="el-input__icon"><lock /></el-icon>
				</template>
			</el-input>
		</el-form-item>
	</el-form>
	<div class="login-btn">
		<el-button round @click="login(loginFormRef)" size="large" type="primary" :loading="loading"> 登录 </el-button>
		<el-button round @click="register(loginFormRef)" size="large" type="link">注册新用户</el-button>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { Login } from "@/api/interface"
import { ElNotification } from "element-plus"
import { loginApi } from "@/api/modules/login"
import { GlobalStore } from "@/stores"
import { TabsStore } from "@/stores/modules/tabs"
import { KeepAliveStore } from "@/stores/modules/keepAlive"
import { getTimeState } from "@/utils/util"
import { HOME_URL } from "@/config/config"
import { initDynamicRouter } from "@/routers/modules/dynamicRouter"
import { UserFilled } from "@element-plus/icons-vue"
import type { ElForm } from "element-plus"

const router = useRouter()
const tabsStore = TabsStore()
const keepAlive = KeepAliveStore()
const globalStore = GlobalStore()

// 定义 formRef（校验规则）
type FormInstance = InstanceType<typeof ElForm>
const loginFormRef = ref<FormInstance>()
const loginRules = reactive({
	username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
	password: [{ required: true, message: "请输入密码", trigger: "blur" }]
})

const loading = ref(false)
const loginForm = reactive<Login.ReqLoginForm>({
	grant_type: import.meta.env.VITE_GRANT_TYPE,
	client_id: import.meta.env.VITE_CLIENT_ID,
	client_secret: import.meta.env.VITE_CLIENT_SECRET,
	username: "",
	password: ""
})
const login = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	formEl.validate(async valid => {
		if (!valid) return
		loading.value = true
		try {
			// 1.执行登录接口
			const data = await loginApi({
				grant_type: import.meta.env.VITE_GRANT_TYPE,
				client_id: import.meta.env.VITE_CLIENT_ID,
				client_secret: import.meta.env.VITE_CLIENT_SECRET,
				username: loginForm.username,
				password: loginForm.password
			})
			globalStore.setToken(data.access_token)

			// 2.添加动态路由
			await initDynamicRouter()

			// 3.清空 tabs、keepAlive 保留的数据
			tabsStore.closeMultipleTab()
			keepAlive.setKeepAliveName()

			// 4.跳转到首页
			router.push(HOME_URL)
			ElNotification({
				title: getTimeState(),
				message: "欢迎登录 ChangLi",
				type: "success",
				duration: 3000
			})
		} finally {
			loading.value = false
		}
	})
}
const register = (formEl: FormInstance | undefined) => {
	if (!formEl) return
	router.push(`/register`)
}

onMounted(() => {
	// 监听enter事件（调用登录）
	document.onkeydown = (e: any) => {
		e = window.event || e
		if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
			if (loading.value) return
			login(loginFormRef.value)
		}
	}
})
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
