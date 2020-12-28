<template>
  <el-card>
    <el-button type="primary" @click="showAddTypeDialog" id="addTypeButton"
      >添加分类</el-button
    >
    <tree-table
      :data="typeList"
      :columns="columns"
      :selection-type="false"
      :expand-type="false"
      show-index
      border
      :default-expand-all="true"
      :show-row-hover="false"
      v-loading="loading"
      id="treeTable"
    >
      <template slot="order" slot-scope="scope">
        <el-tag v-if="scope.row.level === 1">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.level === 2">二级</el-tag>
        <el-tag type="warning" v-else>三级</el-tag>
      </template>
      <template slot="opt" slot-scope="scope">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          circle
          @click="removeTypeDialog(scope.row)"
          id="removeTypeButton"
        ></el-button>
      </template>
    </tree-table>

    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addTypeDialogVisible"
      width="50%"
      @close="addTypeDialogClosed"
    >
      <el-form
        :model="addTypeForm"
        :rules="addTypeFormRules"
        ref="addTypeFormRef"
        label-width="80px"
        status-icon
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="addTypeForm.name"
            placeholder="分类名称"
            id="name"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentTypeList"
            :props="cascaderProps"
            clearable
            id="parentCategory"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTypeDialogVisible = false" id="cancelButton"
          >取 消</el-button
        >
        <el-button type="primary" @click="addType" id="confirmButton"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      typeList: [],
      columns: [
        {
          label: "分类名称",
          prop: "name",
        },
        {
          label: "分类等级",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      addTypeDialogVisible: false,
      addTypeForm: {
        name: "",
        parentId: 0,
        level: 1,
      },
      addTypeFormRules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      parentTypeList: [],
      cascaderProps: {
        value: "mid",
        label: "name",
        children: "children",
        checkStrictly: true,
        expandTrigger: "hover",
      },
      selectedKeys: [],
    };
  },
  created() {
    this.getTypeList();
  },
  methods: {
    //获取分类列表
    async getTypeList() {
      this.loading = !this.loading;
      const { data: res } = await this.$http.get("admin/type/3");
      this.loading = !this.loading;
      if (res.status !== 200) return this.$message.error("获取图书分类失败！");
      this.typeList = res.data;
      console.log(this.typeList);
    },
    showAddTypeDialog() {
      this.getParentTypeList();
      this.addTypeDialogVisible = true;
    },
    //获取父级分类列表
    async getParentTypeList() {
      const { data: res } = await this.$http.get("admin/type/2");
      if (res.status !== 200) return this.$message.error("获取父级分类失败！");
      this.parentTypeList = res.data;
    },
    //添加分类
    addType() {
      this.$refs.addTypeFormRef.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.put(
          "admin/bookType/add",
          this.addTypeForm
        );
        if (res.status === 2001)
          return this.$message.error("分类已存在，添加失败！");
        if (res.status !== 200) return this.$message.error("添加失败！");
        this.$message.success("添加分类成功！");
        this.addTypeDialogVisible = false;
        this.getTypeList();
      });
    },
    addTypeDialogClosed() {
      this.$refs.addTypeFormRef.resetFields();
      this.selectedKeys = [];
      this.addTypeForm.level = 1;
      this.addTypeForm.parentId = 0;
    },
    //删除分类
    async removeTypeDialog(row) {
      //将要删除的mid的子节点mid存放到cid数组
      const cid = [];
      const Arr = [row];
      Arr.forEach((item) => {
        // cid.push(item.mid);
        if (item.children != undefined) {
          let Arr = item.children;
          Arr.forEach((item) => {
            cid.push(item.mid);
          });
        }
      });
      // console.log(cid.join(","));
      // console.log(row.level);
      // console.log(row.mid);
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") return;
      const { data: res } = await this.$http.post("admin/bookType/remove", {
        cid: cid.join(","),
        level: row.level,
        mid: row.mid,
      });
      if (res.status !== 200) return this.$message.error("删除分类失败！");
      this.$message.success("删除分类成功！");
      this.getTypeList();
    },
  },
  watch: {
    selectedKeys(val) {
      if (this.selectedKeys.length > 0) {
        this.addTypeForm.parentId = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addTypeForm.level = this.selectedKeys.length + 1;
        return;
      } else {
        this.addTypeForm.parentId = 0;
        this.addTypeForm.level = 1;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
.el-card {
  width: 100%;
  min-height: calc(100% - 2px);
}
</style>
