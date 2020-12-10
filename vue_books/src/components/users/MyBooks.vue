<template>
  <el-card>
    <el-table :data="booklist" stripe>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="书名">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="作者">
              <span>{{ props.row.author }}</span>
            </el-form-item>
            <el-form-item label="类型">
              <span>{{ props.row.type }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span>{{
                props.row.status.toString() === "true" ? "未借出" : "已借出"
              }}</span>
            </el-form-item>
            <el-form-item label="简介">
              <span>{{ props.row.synopsis }}</span>
            </el-form-item>
            <el-form-item label="编号">
              <span>{{ props.row.isbn }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="书名" prop="name"> </el-table-column>
      <el-table-column label="作者" prop="author"> </el-table-column>
      <el-table-column label="编号" prop="isbn"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 归还按钮 -->
          <el-button
            type="success"
            size="mini"
            @click="returnBook(scope.row.isbn)"
            >归还</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      booklist: [],
      jobNumber: window.sessionStorage.getItem("jobNumber"),
    };
  },
  created() {
    this.getBookList();
  },
  methods: {
    async getBookList() {
      const { data: res } = await this.$http.get(
        "http://localhost:8080/api/book/findOne/" + this.jobNumber
      );
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("获取图书列表失败！");
      }
      this.booklist = res.data;
      console.log(res.status);
    },
    async returnBook(isbn) {
      const { data: res } = await this.$http.post(
        "http://localhost:8080/api/book/return",
        {
          jobNumber: this.jobNumber,
          isbn: isbn,
        }
      );
      if (res.status !== 6008) {
        return this.$message.error("归还书籍失败！");
      }
      this.$message.success("归还书籍成功!");
      this.getBookList();
    },
  },
};
</script>

<style lang="less" scoped></style>
