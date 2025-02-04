<template>
  <div>Waiting...</div>
</template>

<script setup lang="ts" name="login">
import { onMounted } from "vue"
import AuthService from "@/services/auth.service"

const auth = new AuthService()

onMounted(() => {
  auth
    .callback()
    .then(function (user) {
      window.location.href = "../"
    })
    .catch(function (err) {
      console.log(err)
    })
})
</script>
<style scoped lang="scss"></style>
