<template>
  <el-card class="add_box">
    <el-form
      ref="addBookRef"
      :model="addBook"
      :rules="addBookRules"
      label-width="0px"
      class="add_Book"
    >
      <!-- 书名 -->
      <el-form-item prop="name">
        <el-input
          v-model="addBook.name"
          prefix-icon="el-icon-document-checked"
          placeholder="添加书名"
        ></el-input>
      </el-form-item>
      <!-- 作者 -->
      <el-form-item prop="author">
        <el-input
          v-model="addBook.author"
          prefix-icon="el-icon-edit"
          placeholder="添加作者"
        ></el-input>
      </el-form-item>
      <!-- 类型 -->
      <el-form-item prop="type">
        <el-select
          v-model="addBook.type"
          placeholder="请选择书的类别"
          prefix-icon="el-icon-edit"
        >
          <!-- <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option> -->
          <el-option></el-option>
        </el-select>
      </el-form-item>
      <!-- 简介 -->
      <el-form-item prop="synopsis">
        <el-input
          v-model="addBook.synopsis"
          prefix-icon="el-icon-edit-outline"
          placeholder="添加简介"
        ></el-input>
      </el-form-item>
      <!-- 按钮区域 -->
      <el-form-item class="btns">
        <el-button type="primary" @click="add" class="add">确认添加</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      addBook: {
        name: "",
        author: "",
        type: "",
        synopsis: "",
        status: "1",
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
  created() {},
  methods: {
    //点击按钮添加
    add() {
      this.$refs.addBookRef.validate(async (valid) => {
        if (!valid) return;
        //可发起网络请求
        const { data: res } = await this.$hhtp.post("", this.addBook);
        if (res.status !==200) return this.$message.error('添加书籍失败！');
        this.$message.success('添加书籍成功！');
        this.$router.push("/changeBook");
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-input {
  width: 500px;
  margin: 0 auto;
  top: 20px;
  height: 50px;
  margin-top: 10px;
}
.el-select {
  width: 500px;
  margin: 0 auto;
  top: 20px;
  height: 50px;
  margin-top: 10px;
}
.add {
  width: 510px;
  margin-top: 50px;
}
</style>