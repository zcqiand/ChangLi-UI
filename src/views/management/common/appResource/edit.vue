<template>
  <!-- 新增/修改 -->
  <el-dialog v-model="dialogVisible" :title="currentUpdateId === undefined ? '新增' : '修改'" @close="resetForm" width="50%">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
      <el-form-item prop="resourceType" label="资源类型">
        <el-radio-group v-model="formData.resourceType">
          <el-radio :label="0">菜单</el-radio>
          <el-radio :label="1">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="parentId" label="父级">
        <el-tree-select
          v-model="formData.parentId"
          :data="treeSelectData"
          check-strictly
          :render-after-expand="false"
          show-checkbox
          check-on-click-node
          clearable
        />
      </el-form-item>
      <el-form-item prop="title" label="标题">
        <el-input v-model="formData.title" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="name" label="名称">
        <el-input v-model="formData.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="path" label="路径">
        <el-input v-model="formData.path" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="component" label="组件">
        <el-input v-model="formData.component" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="icon" label="图标">
        <el-input v-model="formData.icon" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="isLink" label="选项">
        <el-checkbox v-model="formData.isLink" label="是否外链" />
        <el-checkbox v-model="formData.isHide" label="是否隐藏" />
        <el-checkbox v-model="formData.isFull" label="是否全屏" />
        <el-checkbox v-model="formData.isAffix" label="是否固定" />
        <el-checkbox v-model="formData.isKeepAlive" label="是否缓存" />
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
import { getApi, createApi, updateApi, queryTreeSelectApi } from "@/api/management/common/appResource"

//#region 初始化
const emit = defineEmits(["success"])

onMounted(() => {
  queryTreeSelectData()
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
        formData.appId = res.data.appId
        formData.resourceType = res.data.resourceType
        formData.path = res.data.path
        formData.name = res.data.name
        formData.component = res.data.component
        formData.icon = res.data.icon
        formData.title = res.data.title
        formData.isLink = res.data.isLink
        formData.isHide = res.data.isHide
        formData.isFull = res.data.isFull
        formData.isAffix = res.data.isAffix
        formData.isKeepAlive = res.data.isKeepAlive
        formData.remark = res.data.remark
        formData.sortNo = res.data.sortNo
        formData.ownerDepartmentId = res.data.ownerDepartmentId
        formData.parentId = res.data.parentId
        formData.parentNodeId = res.data.parentNodeId
      })
      .catch(() => {
        resetForm()
      })
      .finally(() => {})
  }
  dialogVisible.value = true
}

const treeSelectData = ref<any[]>([])
const queryTreeSelectData = () => {
  queryTreeSelectApi({})
    .then((res: any) => {
      treeSelectData.value = res.data
    })
    .catch(() => {
      treeSelectData.value = []
    })
    .finally(() => {})
}
//重置表单
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.appId = ""
  formData.resourceType = ""
  formData.path = ""
  formData.name = ""
  formData.component = ""
  formData.icon = ""
  formData.title = ""
  formData.isLink = ""
  formData.isHide = ""
  formData.isFull = ""
  formData.isAffix = ""
  formData.isKeepAlive = ""
  formData.remark = ""
  formData.sortNo = ""
  formData.ownerDepartmentId = ""
  formData.parentId = ""
  formData.parentNodeId = ""
}
//保存
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  appId: "",
  resourceType: "",
  path: "",
  name: "",
  component: "",
  icon: "",
  title: "",
  isLink: "",
  isHide: "",
  isFull: "",
  isAffix: "",
  isKeepAlive: "",
  remark: "",
  sortNo: "",
  ownerDepartmentId: "",
  parentId: "",
  parentNodeId: ""
})
const formRules: FormRules = reactive({
  resourceType: [{ required: true, trigger: "blur", message: "请输入资源类型" }],
  title: [{ required: true, trigger: "blur", message: "请输入标题" }],
  name: [{ required: true, trigger: "blur", message: "请输入名称" }],
  path: [{ required: true, trigger: "blur", message: "请输入路径" }],
  sortNo: [{ required: true, trigger: "blur", message: "请输入排序号" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        createApi({
          resourceType: formData.resourceType,
          path: formData.path,
          name: formData.name,
          component: formData.component,
          icon: formData.icon,
          title: formData.title,
          isLink: formData.isLink,
          isHide: formData.isHide,
          isFull: formData.isFull,
          isAffix: formData.isAffix,
          isKeepAlive: formData.isKeepAlive,
          remark: formData.remark,
          sortNo: formData.sortNo,
          ownerDepartmentId: formData.ownerDepartmentId,
          parentId: formData.parentId,
          parentNodeId: formData.parentNodeId
        }).then(() => {
          queryTreeSelectData()
          dialogVisible.value = false
          emit("success")
        })
      } else {
        updateApi({
          id: currentUpdateId.value,
          resourceType: formData.resourceType,
          path: formData.path,
          name: formData.name,
          component: formData.component,
          icon: formData.icon,
          title: formData.title,
          isLink: formData.isLink,
          isHide: formData.isHide,
          isFull: formData.isFull,
          isAffix: formData.isAffix,
          isKeepAlive: formData.isKeepAlive,
          remark: formData.remark,
          sortNo: formData.sortNo,
          ownerDepartmentId: formData.ownerDepartmentId,
          parentId: formData.parentId,
          parentNodeId: formData.parentNodeId
        }).then(() => {
          queryTreeSelectData()
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
        resourceType: formData.resourceType,
        path: formData.path,
        name: formData.name,
        component: formData.component,
        icon: formData.icon,
        title: formData.title,
        isLink: formData.isLink,
        isHide: formData.isHide,
        isFull: formData.isFull,
        isAffix: formData.isAffix,
        isKeepAlive: formData.isKeepAlive,
        remark: formData.remark,
        sortNo: formData.sortNo,
        ownerDepartmentId: formData.ownerDepartmentId,
        parentId: formData.parentId,
        parentNodeId: formData.parentNodeId
      }).then(() => {
        queryTreeSelectData()
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
@/api/management/common/appResource
