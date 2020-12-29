<template>
  <el-card>
    <el-table :data="booklist" stripe>
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
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      token: window.sessionStorage.getItem("token"),
    };
  },
  created() {
    this.getBookList();
  },
  methods: {
    async getBookList() {
      const { data: res } = await this.$http.get(
        `book/getFavorite/${this.jobNumber}`
      );
      if (res.status !== 6013) {
        return this.$message.error("获取图书列表失败！");
      }
      this.booklist = res.data;
    },
    async borrowBook(isbn) {
      if (this.jobNumber === null || this.token === null) {
        return this.$message.warning("请先登录再进行此操作！");
      }
      const { data: res } = await this.$http.post("book/borrow", {
        jobNumber: this.jobNumber,
        isbn: isbn,
      });
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
      const { data: res } = await this.$http.post(`book/favorite`, {
        jobNumber: this.jobNumber,
        isbn: isbn,
        isClick: false,
      });
      console.log(res);
      if (res.status !== 6014) {
        return this.$message.error("取消收藏失败");
      }
      this.$message.success("取消收藏成功！");
      this.getBookList();
    },
  },
};
</script>
<style lang="less">
.el-form-item__label {
  width: 90px;
  font-size: 15px;
  color: #345785c9;
}
</style>
<style lang="less" scoped>
.el-table__column-filter-trigger i {
  font-size: 20px;
}
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
.el-card {
  width: 100%;
  min-height: calc(100% - 2px);
}
.el-pagination,
.el-table {
  margin-top: 15px;
}
</style>
