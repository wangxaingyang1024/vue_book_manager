<template>
  <div>
    <el-card>
      <el-button type="primary" @click="showAddTypeDialog">添加分类</el-button>
      <tree-table
        :data="typeList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        :show-row-hover="false"
      >
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
      </tree-table>
    </el-card>
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
        <el-form-item label="分类名称" prop="cat_name">
          <el-input
            v-model="addTypeForm.cat_name"
            placeholder="分类名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentTypeList"
            :props="cascaderProps"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTypeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addType">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      typeList: [
        {
          cat_id: 1,
          cat_name: "军事",
          cat_pid: 0,
          cat_level: 0,
          children: [
            {
              cat_id: 3,
              cat_name: "中国军事",
              cat_pid: 1,
              cat_level: 1,
              children: [
                {
                  cat_id: 6,
                  cat_name: "中国陆军",
                  cat_pid: 3,
                  cat_level: 2,
                },
                {
                  cat_id: 7,
                  cat_name: "中国海军",
                  cat_pid: 3,
                  cat_level: 2,
                },
              ],
            },
          ],
        },
      ],
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },

        {
          label: "分类等级",
          type: "template",
          template: "order",
        },
      ],
      addTypeDialogVisible: false,
      addTypeForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      addTypeFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentTypeList: [
        {
          cat_id: 1,
          cat_name: "军事",
          cat_pid: 0,
          cat_level: 0,
          children: [
            {
              cat_id: 3,
              cat_name: "中国军事",
              cat_pid: 1,
              cat_level: 1,
            },
          ],
        },
      ],
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
        expandTrigger: "hover",
      },
      selectedKeys: [],
    };
  },
  created() {
    // this.getTypeList();
  },
  methods: {
    async getTypeList() {
      const { data: res } = await this.$http.get("url");
      if (res.status !== 200) return this.$message.error("获取图书分类失败！");
      this.typeList = res.data.result;
    },
    showAddTypeDialog() {
      //   this.getParentTypeList();
      this.addTypeDialogVisible = true;
    },
    async getParentTypeList() {
      const { data: res } = await this.$http.get("url", {
        params: { type: 2 },
      });
      if (res.status !== 200) return this.$message.error("获取父级分类失败！");
      this.parentTypeList = res.data;
    },
    addType() {
      this.$refs.addTypeFormRef.validate(async (vaild) => {
        if (!vaild) return;
        const { data: res } = await this.$http.post("url", this.addTypeForm);
        if (res.status !== 201)
          return this.$message.error("分类已存在，添加失败！");
        this.$message.success("添加分类成功！");
        this.addTypeDialogVisible = false;
        this.getTypeList();
      });
    },
    addTypeDialogClosed() {
      this.$refs.addTypeFormRef.resetFields();
      this.selectedKeys = [];
      this.addTypeForm.cat_level = 0;
      this.addTypeForm.cat_pid = 0;
    },
  },
  watch: {
    selectedKeys(val) {
      console.log(val);
      if (this.selectedKeys.length > 0) {
        this.addTypeForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ];
        this.addTypeForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addTypeForm.cat_pid = 0;
        this.addTypeForm.cat_level = 0;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px;
}
</style>
