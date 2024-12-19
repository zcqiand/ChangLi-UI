<template>
  <!-- 新增/修改 -->
  <el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
      <el-form-item prop="departmentId" label="部门">
        <el-tree-select
          v-model="formData.departmentId"
          :data="departmentTreeSelectData"
          check-strictly
          :render-after-expand="false"
          show-checkbox
          check-on-click-node
          clearable
        />
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="formData.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="code" label="身份证">
        <el-input v-model="formData.code" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="gender" label="性别">
        <el-radio-group v-model="formData.gender">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="nickName" label="昵称">
        <el-input v-model="formData.nickName" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="tel" label="联系电话">
        <el-input v-model="formData.tel" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="email" label="电子邮箱">
        <el-input v-model="formData.email" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input v-model="formData.remark" placeholder="请输入" />
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
import { queryTreeSelectApi as queryDepartmentTreeSelectApi } from "@/api/management/common/ownerDepartment"
import { getApi, createApi, updateApi } from "@/api/management/common/ownerEmployee"

//#region 初始化
const props = defineProps({
  ownerId: String
})
const emit = defineEmits(["success"])

onMounted(() => {
  queryDepartmentTreeSelectData()
})
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
        formData.departmentId = res.data.departmentId
        formData.userId = res.data.userId
        formData.code = res.data.code
        formData.name = res.data.name
        formData.nickName = res.data.nickName
        formData.tel = res.data.tel
        formData.email = res.data.email
        formData.gender = res.data.gender
        formData.remark = res.data.remark
        formData.enabledFlag = res.data.enabledFlag
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
  formData.departmentId = ""
  formData.userId = ""
  formData.code = ""
  formData.name = ""
  formData.nickName = ""
  formData.tel = ""
  formData.email = ""
  formData.gender = ""
  formData.remark = ""
  formData.enabledFlag = ""
  formData.sortNo = ""
}

const departmentTreeSelectData = ref<any[]>([])
const queryDepartmentTreeSelectData = () => {
  queryDepartmentTreeSelectApi({
    ownerId: props.ownerId
  })
    .then((res: any) => {
      departmentTreeSelectData.value = res.data
    })
    .catch(() => {
      departmentTreeSelectData.value = []
    })
    .finally(() => {})
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  departmentId: "",
  userId: "",
  code: "",
  name: "",
  nickName: "",
  tel: "",
  email: "",
  gender: "",
  remark: "",
  enabledFlag: "",
  sortNo: ""
})
const formRules: FormRules = reactive({
  departmentId: [{ required: true, trigger: "blur", message: "请输入部门标识" }],
  userId: [{ required: true, trigger: "blur", message: "请输入用户标识" }],
  code: [{ required: true, trigger: "blur", message: "请输入编号" }],
  name: [{ required: true, trigger: "blur", message: "请输入姓名" }],
  gender: [{ required: true, trigger: "blur", message: "请输入性别" }],
  sortNo: [{ required: true, trigger: "blur", message: "请输入排序号" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createApi({
          departmentId: formData.departmentId,
          userId: formData.userId,
          code: formData.code,
          name: formData.name,
          nickName: formData.nickName,
          tel: formData.tel,
          email: formData.email,
          gender: formData.gender,
          remark: formData.remark,
          enabledFlag: formData.enabledFlag,
          sortNo: formData.sortNo
        }).then(() => {
          dialogVisible.value = false
          emit("success")
        })
      } else {
        updateApi({
          id: currentUpdateId.value,
          departmentId: formData.departmentId,
          userId: formData.userId,
          code: formData.code,
          name: formData.name,
          nickName: formData.nickName,
          tel: formData.tel,
          email: formData.email,
          gender: formData.gender,
          remark: formData.remark,
          enabledFlag: formData.enabledFlag,
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
        departmentId: formData.departmentId,
        userId: formData.userId,
        code: formData.code,
        name: formData.name,
        nickName: formData.nickName,
        tel: formData.tel,
        email: formData.email,
        gender: formData.gender,
        remark: formData.remark,
        enabledFlag: formData.enabledFlag,
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
