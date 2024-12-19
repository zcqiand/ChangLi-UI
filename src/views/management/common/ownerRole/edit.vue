<template>
  <!-- 新增/修改 -->
  <el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
      <el-form-item prop="code" label="编号">
        <el-input v-model="formData.code" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="name" label="名称">
        <el-input v-model="formData.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="sortNo" label="排序号">
        <el-input v-model="formData.sortNo" placeholder="请输入" />
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
import { getApi, createApi, updateApi } from "@/api/management/common/ownerRole"

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
        formData.code = res.data.code
        formData.name = res.data.name
        formData.sortNo = res.data.sortNo
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
  formData.code = ""
  formData.name = ""
  formData.sortNo = ""
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  code: "",
  name: "",
  sortNo: ""
})
const formRules: FormRules = reactive({
  code: [{ required: true, trigger: "blur", message: "请输入编号" }],
  name: [{ required: true, trigger: "blur", message: "请输入名称" }],
  sortNo: [{ required: true, trigger: "blur", message: "请输入排序号" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createApi({
          code: formData.code,
          name: formData.name,
          sortNo: formData.sortNo
        }).then(() => {
          dialogVisible.value = false
          emit("success")
        })
      } else {
        updateApi({
          id: currentUpdateId.value,
          code: formData.code,
          name: formData.name,
          sortNo: formData.sortNo
        }).then(() => {
          ElMessage.success("修改成功")
          dialogVisible.value = false
          emit("success")
        })
      }
    }
  })
}
//另存为
const handleSaveAs = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      createApi({
        code: formData.code,
        name: formData.name,
        sortNo: formData.sortNo
      }).then(() => {
        dialogVisible.value = false
        emit("success")
      })
    }
  })
}
//#endregion

defineExpose({
  handleUpdate
})
</script>
@/api/management/common/ownerRole
