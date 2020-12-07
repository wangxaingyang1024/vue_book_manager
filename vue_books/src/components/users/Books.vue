<template>
  <el-table :data="booklist" style="width: 100%" :stripe="true">
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
    <el-table-column label="操作" prop="status">
      <template slot-scope="scope">
        <el-button
          type="primary"
          size="mini"
          @click="borrowBook(scope.row.isbn)"
          v-if="scope.row.status.toString() === 'true'"
          >借阅此书</el-button
        >
        <el-button type="" size="mini" disabled v-else>借阅此书</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      booklist: [],
      jobNumber: "",
    };
  },
  created() {
    this.getBookList();
  },
  methods: {
    async getBookList() {
      const { data: res } = await this.$http.get(
        "http://localhost:8080/api/admin/find"
      );
      if (res.status !== 6011) {
        return this.$message.error("获取图书列表失败！");
      }
      this.booklist = res.data;
      // console.log(res.status);
    },
    async borrowBook(isbn) {
      this.jobNumber = window.sessionStorage.getItem("jobNumber");
      const { data: res } = await this.$http.post(
        "http://localhost:8080/api/book/borrow",
        {
          jobNumber: this.jobNumber,
          isbn: isbn,
        }
      );
      //console.log(res);
      if (res.status !== 6006){
        return this.$message.error("借阅书籍失败！")
      }
      this.$message.success('借阅书籍成功!')
      this.getBookList();
    },
  },
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
