<template>
	<template v-for="subItem in menuList" :key="subItem.path">
		<el-sub-menu v-if="subItem.children && subItem.children.length > 0" :index="subItem.path">
			<template #title>
				<el-icon>
					<component :is="subItem.meta.icon"></component>
				</el-icon>
				<span>{{ subItem.meta.title }}</span>
			</template>
			<SubMenu :menuList="subItem.children" />
		</el-sub-menu>
		<el-menu-item v-else :index="subItem.path" @click="handleClickMenu(subItem)">
			<el-icon>
				<component :is="subItem.meta.icon"></component>
			</el-icon>
			<template #title>
				<span>{{ subItem.meta.title }}</span>
			</template>
		</el-menu-item>
	</template>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { EXTERNAL_URL } from "@/config/config"

defineProps<{ menuList: Menu.MenuOptions[] }>()

const router = useRouter()
const handleClickMenu = (subItem: Menu.MenuOptions) => {
	if (subItem.meta.isLink) {
		if (subItem.meta.isIframe) {
			router.push({ path: EXTERNAL_URL, query: { url: subItem.meta.isLink } })
		} else {
			return window.open(subItem.meta.isLink, "_blank")
		}
	} else {
		router.push(subItem.path)
	}
}
</script>
