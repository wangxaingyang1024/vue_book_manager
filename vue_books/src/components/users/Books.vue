<template>
  <el-table :data="booklist" style="width: 100%" :stripe="true">
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="书名">
            <span>{{ props.row.name }}</span>
          </el-form-item>
          <el-form-item label="作者">
            <span>{{ props.row.author}}</span>
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
      <el-button
          type=""
          size="mini"
          @click="borrowBook"
        >借阅此书</el-button>
    </el-table-column>
  </el-table>
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
  methods: {},
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