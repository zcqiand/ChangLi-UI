<template>
  <div>Waiting...</div>
</template>

<script setup lang="ts" name="login">
import { onMounted } from "vue"
import { useRouter } from "vue-router"
import { HOME_URL } from "@/config"
import { ElNotification } from "element-plus"
import { useUserStore } from "@/stores/modules/user"
import { useTabsStore } from "@/stores/modules/tabs"
import { useKeepAliveStore } from "@/stores/modules/keepAlive"
import { initDynamicRouter } from "@/routers/modules/dynamicRouter"
import AuthService from "@/services/auth.service"

const router = useRouter()
const userStore = useUserStore()
const tabsStore = useTabsStore()
const keepAliveStore = useKeepAliveStore()

const auth = new AuthService()

onMounted(() => {
  // try {
  auth.getUser().then(async (user: any) => {
    if (user && user !== null && !user.expired) {
      userStore.setToken(user.access_token)
      // 2.添加动态路由
      await initDynamicRouter()
      // 3.清空 tabs、keepAlive 数据
      tabsStore.setTabs([])
      keepAliveStore.setKeepAliveName([])
      // 4.跳转到首页
      router.push(HOME_URL)
      ElNotification({
        title: "登录",
        dangerouslyUseHTMLString: true,
        message: "欢迎登录 南荣基础框架",
        type: "success",
        duration: 8000
      })
    } else {
      // 1.执行登录接口
      await auth.login()
    }
  })
  // } finally {
  // }
})
</script>
<style scoped lang="scss"></style>
