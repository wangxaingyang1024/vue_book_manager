<template>
  <el-card>
    <el-table
      :data="booklist"
      stripe
      v-loading="loading"
      @cell-click="show"
      ref="tableRef"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="书名">
              <span>{{ "《" + props.row.name + "》" }}</span>
            </el-form-item>
            <el-form-item label="作者">
              <span>{{ props.row.author }}</span>
            </el-form-item>
            <el-form-item label="类型">
              <span>{{ props.row.type }}</span>
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
            id="returnBookButton"
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
      loading: false,
      booklist: [],
      jobNumber: window.sessionStorage.getItem("jobNumber"),
    };
  },
  created() {
    this.getBookList();
  },
  methods: {
    async getBookList() {
      this.loading = !this.loading;
      const { data: res } = await this.$http.get(
        "book/findOne/" + this.jobNumber
      );
      this.loading = !this.loading;
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("获取图书列表失败！");
      }
      this.booklist = res.data;
      console.log(res.status);
    },
    async returnBook(isbn) {
      const confirmResult = await this.$confirm("是否确认归还?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      //如果用户确认还书,则返回值为字符串confirm
      //如果用户取消还书，则返回值为字符串cancel
      if (confirmResult === "cancel") {
        return;
      }
      const { data: res } = await this.$http.post("book/return", {
        jobNumber: this.jobNumber,
        isbn: isbn,
      });
      if (res.status !== 6008) {
        return this.$message.error("归还书籍失败！");
      }
      this.$message.success("归还书籍成功!");
      this.getBookList();
    },
    show(row) {
      this.$refs.tableRef.toggleRowExpansion(row);
    },
  },
};
</script>
<style lang="less">
.el-form-item__label {
  width: 60px;
  font-size: 15px;
  color: #0a5e3ec9;
}
</style>
<style lang="less" scoped>
.el-card {
  width: 100%;
  min-height: calc(100% - 2px);
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99bfaf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
