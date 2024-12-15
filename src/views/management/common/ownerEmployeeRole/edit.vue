<template>
  <!-- 新增/修改 -->
  <el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
      <el-form-item prop="userId" label="用户标识">
        <el-input v-model="formData.userId" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="roleId" label="角色标识">
        <el-input v-model="formData.roleId" placeholder="请输入" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleCreate">保存</el-button>
        <el-button v-show="currentUpdateId !== undefined" @click="handleSaveAs">另存为</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, defineExpose, onMounted } from "vue"
import { type FormInstance, type FormRules, ElMessage } from "element-plus"
import { getApi, createApi, updateApi } from "@/api/management/common/ownerEmployeeRole"

//#region 初始化
const emit = defineEmits(["success"])

onMounted(() => {})
//#endregion

//#region 主体
//设置表单
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (id: undefined | string) => {
  if (id === undefined) {
    resetForm()
  } else {
    currentUpdateId.value = id
    getApi({
      id: id
    })
      .then((res: any) => {
        formData.userId = res.data.userId
        formData.roleId = res.data.roleId
      })
      .catch(() => {
        resetForm()
      })
      .finally(() => {})
  }
  dialogVisible.value = true
}
//重置表单
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.userId = ""
  formData.roleId = ""
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  userId: "",
  roleId: ""
})
const formRules: FormRules = reactive({
  userId: [{ required: true, trigger: "blur", message: "请输入用户标识" }],
  roleId: [{ required: true, trigger: "blur", message: "请输入角色标识" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createApi({
          userId: formData.userId,
          roleId: formData.roleId
        }).then(() => {
          dialogVisible.value = false
          emit("success")
        })
      } else {
        updateApi({
          id: currentUpdateId.value,
          userId: formData.userId,
          roleId: formData.roleId
        }).then(() => {
          ElMessage.success("修改成功")
          dialogVisible.value = false
          emit("success")
        })
      }
    } else {
      return false
    }
  })
}
//另存为
const handleSaveAs = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      createApi({
        userId: formData.userId,
        roleId: formData.roleId
      }).then(() => {
        dialogVisible.value = false
        emit("success")
      })
    } else {
      return false
    }
  })
}
//#endregion

defineExpose({
  handleUpdate
})
</script>
@/api/management/common/ownerEmployeeRole
