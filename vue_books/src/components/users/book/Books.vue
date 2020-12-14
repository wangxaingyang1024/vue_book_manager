<template>
  <el-card>
    <el-col :span="8">
      <el-input
        placeholder="请输入内容"
        clearable
        v-model="queryInfo.name"
        prefix-icon="el-icon-search"
      >
      </el-input
    ></el-col>
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
      <el-table-column
        prop="type"
        label="类型"
        :filters="typeList"
        :filter-method="typeFilter"
        filter-placement="bottom-end"
      >
      </el-table-column>
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
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        //模糊查询
        name: "",
        //当前页数
        pageNum: 1,
        //当前每页显示多少条数据
        pageSize: 5,
      },

      booklist: [],
      typeList: [],
      jobNumber: window.sessionStorage.getItem("jobNumber"),
    };
  },
  created() {
    this.getBookList();
  },
  methods: {
    async getBookList() {
      const { data: res } = await this.$http.get("admin/find", {
        params: this.queryInfo,
      });
      if (res.status !== 6011) {
        return this.$message.error("获取图书列表失败！");
      }
      res.data.list.forEach((item) => {
        if (item.type !== null) {
          this.booklist.push(item);
        }
      });
      let list = [];
      this.booklist.forEach((item) => {
        list.push(item.type);
      });
      list = [...new Set(list)];
      list.forEach((item) => {
        const type = { text: item, value: item };
        this.typeList.push(type);
      });
    },
    async borrowBook(isbn) {
      const { data: res } = await this.$http.post("book/borrow", {
        jobNumber: this.jobNumber,
        isbn: isbn,
      });
      //console.log(res);
      if (res.status !== 6006) {
        return this.$message.error("借阅书籍失败！");
      }
      this.$message.success("借阅书籍成功!");
      this.getBookList();
    },
    typeFilter(value, row) {
      return row.type === value;
    },
  },
  watch: {
    "queryInfo.name"(val) {
      if (val === null) return this.getBookList();
      setTimeout(() => {
        this.getBookListByName();
      }, 500);
    },
  },
};
</script>

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
</style>
