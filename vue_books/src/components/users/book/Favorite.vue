<template>
  <el-card>
    <el-table
      :data="booklist"
      stripe
      v-loading="loading"
      @row-dblclick="show"
      @expand-change="expandSelect"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
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
            <el-form-item label="状态">
              <span>
                <el-tag
                  type="success"
                  v-if="props.row.status.toString() === 'true'"
                  >未借出</el-tag
                >
                <el-tag v-else>已借出</el-tag>
              </span>
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
      <el-table-column prop="type" label="类型"> </el-table-column>
      <el-table-column label="操作" prop="status" width="300px">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="borrowBook(scope.row.isbn)"
            v-if="scope.row.status.toString() === 'true'"
            id="borrowBookButton"
            >借阅此书</el-button
          >
          <el-button type="" size="mini" disabled v-else>借阅此书</el-button>
          <el-button
            type="warning"
            size="mini"
            @click="cancelFavorite(scope.row.isbn)"
            id="cancelFavoriteButton"
          >
            取消收藏
          </el-button>
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
      loading: false,
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      token: window.sessionStorage.getItem("token"),
      getRowKeys(row) {
        // 行数据的Key
        return row.isbn;
      },
      expands: [], // 通过该属性设置Table目前的展开行，需要设置row-key属性才能使用，该属性为展开行的keys数组
    };
  },
  created() {
    this.getBookList();
  },
  methods: {
    async getBookList() {
      this.loading = !this.loading;
      const { data: res } = await this.$http.get(
        `book/getFavorite/${this.jobNumber}`
      );
      this.loading = !this.loading;
      if (res.status !== 6013) {
        return this.$message.error("获取图书列表失败！");
      }
      this.booklist = res.data;
    },
    async borrowBook(isbn) {
      if (this.jobNumber === null || this.token === null) {
        return this.$message.warning("请先登录再进行此操作！");
      }
      this.loading = !this.loading;
      const { data: res } = await this.$http.post("book/borrow", {
        jobNumber: this.jobNumber,
        isbn: isbn,
      });
      this.loading = !this.loading;
      if (res.status !== 6006) {
        return this.$message.error("借阅书籍失败！");
      }
      this.$message.success("借阅书籍成功!");
      this.getBookList();
    },
    async cancelFavorite(isbn) {
      console.log(isbn);
      //弹框询问用户是否取消收藏
      const confirmResult = await this.$confirm("是否确认取消收藏?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      //如果用户确认删除,则返回值为字符串confirm
      //如果用户取消删除，则返回值为字符串cancel
      if (confirmResult !== "confirm") {
        return;
      }
      this.loading = !this.loading;
      const { data: res } = await this.$http.post(`book/favorite`, {
        jobNumber: this.jobNumber,
        isbn: isbn,
        isClick: false,
      });
      this.loading = !this.loading;
      console.log(res);
      if (res.status !== 6014) {
        return this.$message.error("取消收藏失败");
      }
      this.$message.success("取消收藏成功！");
      this.getBookList();
    },
    show(row) {
      this.$refs.tableRef.toggleRowExpansion(row);
    },
    // table每次只能展开一行
    expandSelect(row, expandedRows) {
      this.expands = [];
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.isbn) : "";
      }
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
<style lang="less" scoped></style>
