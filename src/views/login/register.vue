<template>
	<div class="login-container flx-center">
		<div class="login-box">
			<SwitchDark class="dark" />
			<div class="login-left">
				<img src="@/assets/images/login_left11.png" alt="login" />
			</div>
			<div class="login-form">
				<div class="login-logo">
					<h2 class="logo-text">欢迎注册</h2>
				</div>
				<RegisterForm />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="login">
import SwitchDark from "@/components/SwitchDark/index.vue"
import RegisterForm from "./components/RegisterForm.vue"
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
