<template>
  <el-card>
    <el-form ref="addBookRef" :model="addBook" :rules="addBookRules">
      <!-- 书名 -->
      <el-form-item prop="name">
        <el-input
          v-model="addBook.name"
          prefix-icon="el-icon-document-checked"
          placeholder="添加书名"
          id="search"
        ></el-input>
      </el-form-item>
      <!-- 作者 -->
      <el-form-item prop="author">
        <el-input
          v-model="addBook.author"
          prefix-icon="el-icon-edit"
          placeholder="添加作者"
          id="author"
        ></el-input>
      </el-form-item>
      <!-- 类型 -->
      <el-form-item prop="type">
        <el-cascader
          v-model="addBook.type"
          placeholder="请选择书的类别"
          :options="typeList"
          :props="cascaderProps"
          clearable
          id="type"
        ></el-cascader>
      </el-form-item>
      <!-- 简介 -->
      <el-form-item prop="synopsis">
        <el-input
          type="textarea"
          resize="none"
          rows="3"
          v-model="addBook.synopsis"
          prefix-icon="el-icon-edit-outline"
          placeholder="添加简介"
          id="synopsis"
        ></el-input>
      </el-form-item>
      <!-- 按钮区域 -->
      <el-form-item class="btns">
        <el-button type="primary" @click="add" id="confirmButton"
          >确认添加</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      typeList: [],
      selectedKeys: [],
      cascaderProps: {
        value: "mid",
        label: "name",
        children: "children",
        expandTrigger: "hover",
      },
      addBook: {
        name: "",
        author: "",
        type: "",
        synopsis: "",
        status: true,
      },
      addBookRules: {
        name: [
          {
            required: true,
            message: "请输入书名",
            trigger: "blur",
          },
          {
            min: 1,
            max: 30,
            message: "长度请小于30",
            trigger: "blur",
          },
        ],
        author: [
          {
            required: true,
            message: "请输入作者名",
            trigger: "blur",
          },
          {
            min: 1,
            max: 12,
            message: "长度请小于12",
            trigger: "blur",
          },
        ],
        type: [{ required: true, message: "请选择类别", trigger: "change" }],
        synopsis: [
          {
            required: true,
            message: "请输入书的简介",
            trigger: "blur",
          },
          {
            min: 1,
            max: 60,
            message: "长度请小于60",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getTypeList();
  },
  methods: {
    //点击按钮添加
    add() {
      this.$refs.addBookRef.validate(async (valid) => {
        if (!valid) return;
        if (this.addBook.type.length !== 3) {
          this.addBook.type = [];
          return this.$message.error("书籍分类必须为三级分类！");
        }
        this.addBook.type = this.addBook.type[this.addBook.type.length - 1];
        //可发起网络请求
        const { data: res } = await this.$http.post("admin/add", this.addBook);
        if (res.status !== 6000) return this.$message.error("添加书籍失败！");
        this.$message.success("添加书籍成功！");
        this.$router.push("/changeBook");
      });
    },
    async getTypeList() {
      const { data: res } = await this.$http.get("admin/type/3");
      if (res.status !== 200)
        return this.$message.error("获取书籍分类列表失败！");
      this.typeList = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  width: 500px;
  padding: 50px;
  .el-input {
    width: 450px;
  }
  .el-button {
    width: 450px;
  }
}
</style>
