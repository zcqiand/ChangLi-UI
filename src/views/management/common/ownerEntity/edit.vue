<template>
  <!-- 新增/修改 -->
  <el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
      <el-form-item prop="name" label="企业名称">
        <el-col :span="18"><el-input v-model="formData.name" placeholder="请输入企业全称" /></el-col>
        <el-col :span="1" style="text-align: center">-</el-col>
        <el-col :span="5"><el-input v-model="formData.shortName" placeholder="请输入企业简称" /></el-col>
      </el-form-item>
      <el-form-item prop="code" label="信用代码">
        <el-input v-model="formData.code" placeholder="请输入统一社会信用代码" />
      </el-form-item>
      <el-form-item prop="address" label="联系地址">
        <el-col :span="18"><el-input v-model="formData.address" placeholder="请输入联系地址" /></el-col>
        <el-col :span="1" style="text-align: center">-</el-col>
        <el-col :span="5"><el-input v-model="formData.zipCode" placeholder="请输入邮政编码" /></el-col>
      </el-form-item>
      <el-form-item prop="tel" label="联系电话">
        <el-input v-model="formData.tel" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item prop="email" label="电子邮箱">
        <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
      </el-form-item>
      <el-form-item prop="contactPerson" label="联系人">
        <el-input v-model="formData.contactPerson" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item prop="contactPersonTel" label="联系电话">
        <el-input v-model="formData.contactPersonTel" placeholder="请输入联系人电话" />
      </el-form-item>
      <el-form-item prop="remark" label="备注">
        <el-input :rows="2" type="textarea" v-model="formData.remark" placeholder="请输入备注" />
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
import { getApi, createApi, updateApi } from "@/api/management/common/ownerEntity"

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
        formData.shortName = res.data.shortName
        formData.address = res.data.address
        formData.zipCode = res.data.zipCode
        formData.tel = res.data.tel
        formData.email = res.data.email
        formData.contactPerson = res.data.contactPerson
        formData.contactPersonTel = res.data.contactPersonTel
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
  formData.code = ""
  formData.name = ""
  formData.shortName = ""
  formData.address = ""
  formData.zipCode = ""
  formData.tel = ""
  formData.email = ""
  formData.contactPerson = ""
  formData.contactPersonTel = ""
  formData.remark = ""
  formData.enabledFlag = ""
  formData.sortNo = ""
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  code: "",
  name: "",
  shortName: "",
  address: "",
  zipCode: "",
  tel: "",
  email: "",
  contactPerson: "",
  contactPersonTel: "",
  remark: "",
  enabledFlag: "",
  sortNo: ""
})
const formRules: FormRules = reactive({
  code: [{ required: true, trigger: "blur", message: "请输入编号" }],
  name: [{ required: true, trigger: "blur", message: "请输入名称" }],
  enabledFlag: [{ required: true, trigger: "blur", message: "请输入是否启用" }],
  sortNo: [{ required: true, trigger: "blur", message: "请输入排序号" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createApi({
          code: formData.code,
          name: formData.name,
          shortName: formData.shortName,
          address: formData.address,
          zipCode: formData.zipCode,
          tel: formData.tel,
          email: formData.email,
          contactPerson: formData.contactPerson,
          contactPersonTel: formData.contactPersonTel,
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
          code: formData.code,
          name: formData.name,
          shortName: formData.shortName,
          address: formData.address,
          zipCode: formData.zipCode,
          tel: formData.tel,
          email: formData.email,
          contactPerson: formData.contactPerson,
          contactPersonTel: formData.contactPersonTel,
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
        code: formData.code,
        name: formData.name,
        shortName: formData.shortName,
        address: formData.address,
        zipCode: formData.zipCode,
        tel: formData.tel,
        email: formData.email,
        contactPerson: formData.contactPerson,
        contactPersonTel: formData.contactPersonTel,
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
