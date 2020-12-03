<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容" clearable @clear="getBookList">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getBookList"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAddBook">添加书籍</el-button>
      </el-col>
    </el-row>
    <el-table :data="userlist" border style="width: 100%" :stripe="true">
      <el-table-column type="index" label="序号" width="180"> </el-table-column>
      <el-table-column prop="username" label="图书名" width="180">
      </el-table-column>
      <el-table-column prop="jobNumber" label="作者" width="180">
      </el-table-column>
      <el-table-column prop="nickName" label="类型" width="180">
      </el-table-column>
      <el-table-column prop="gender" label="状态" width="180">
        <template slot-scope="scope">
          {{ scope.row.gender == 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="书号" width="180"> </el-table-column>
      <el-table-column prop="age" label="简介" width="180"> </el-table-column>
      <el-table-column label="操作">
        <!-- 删除按钮 -->
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="removeBook"
        ></el-button>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    this.getBookList();
  },
  methods: {
    //跳转添加书籍路由
    goAddBook() {
      this.$router.push("/addBook");
    },
    async getBookList() {
      const { data: res } = await this.$http.get(
        "http://localhost:8080/api/admin/login"
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取图书列表失败！");
      }
      this.booklist = res.books;
      console.log(res);
    },
    async removeBook(isbn) {
      //弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该书籍, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果用户确认删除,则返回值为字符串confirm
      //如果用户取消删除，则返回值为字符串cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.post(
        "http://localhost:8080/api/admin/remove/" 
        // `http://localhost:8080/api/admin/remove/jobNumber/`
      );

      if (res.meta.status !== 3033) {
        return this.$message.error("删除书籍失败");
      }

      this.$message.success("删除书籍成功！");
      this.getBookList();
    },
  },
};
</script>
<style lang="less">
.el-row {
  margin-bottom: 25px;
}
</style>
<style lang="less" scoped>
</style>