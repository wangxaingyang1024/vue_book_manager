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
<style lang="less"></style>
