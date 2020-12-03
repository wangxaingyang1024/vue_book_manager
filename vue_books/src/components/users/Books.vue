<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          
          clearable
          @clear="getBookList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getBookList"
          ></el-button>
        </el-input>
      </el-col>
    </el-row>

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
              <span>{{ props.row.status }}</span>
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
          <el-button type="" size="mini" @click="borrowBook(scope.row.isbn)"
            >借阅此书</el-button
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
    };
  },
  created() {
    this.getBookList();
  },
  methods: {
    async getBookList() {
      const { data: res } = await this.$http.get(
        "http://localhost:8080/api/admin"
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取图书列表失败！");
      }
      this.booklist = res.books;
      console.log(res);
    },
    async borrowBook(isbn) {
      const { data: res } = await this.$http.put(
        "http://localhost:8080/api/admin" + isbn
      );
      if (res.meta.status !== 200) {
        return this.$message.error("借阅图书失败！");
      }
      this.$message.success("借阅图书成功！");
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