<template>
	<div class="app-container">
		{{ url }}
		<iframe :src="url" frameborder="0"></iframe>
	</div>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { useRoute } from "vue-router"
const route = useRoute()
const url = ref()
onMounted(() => {
	url.value = route.query.url
})
</script>
<style lang="scss" scoped>
/** 关闭tag标签  */
.app-container {
	/* 50px = navbar = 50px */
	height: calc(100vh - 50px);
}

/** 开启tag标签  */
.hasTagsView {
	.app-container {
		/* 84px = navbar + tags-view = 50px + 34px */
		height: calc(100vh - 84px);
	}
}
iframe {
	width: 100%;
	height: 100%;
}
</style>
