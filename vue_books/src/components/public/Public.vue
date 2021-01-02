<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <img src="~assets/logo.jpg" @click="home" id="home" />
        </el-col>
        <el-col :span="14">
          <span class="topText">明日图书馆</span>
        </el-col>
        <el-col :span="2">
          <el-button
            type="primary"
            round
            @click="login"
            class="logout"
            id="loginButton"
            >登录</el-button
          >
        </el-col>
        <el-col :span="2">
          <el-button
            type="success"
            round
            @click="signUp"
            class="logout"
            id="signUpButton"
            >注册</el-button
          >
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <!-- 内容主体 -->
      <el-main>
        <el-backtop target=".el-main"></el-backtop>
        <el-card>
          <el-col :span="8">
            <el-input
              placeholder="请输入内容"
              clearable
              v-model="queryInfo.name"
              prefix-icon="el-icon-search"
              id="search"
            >
            </el-input
          ></el-col>
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
          </el-table>
          <!-- 分页区域 -->
          <el-pagination
            v-if="loading === false"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            id="pagination"
          ></el-pagination>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      queryInfo: {
        //模糊查询
        name: "",
        //当前页数
        pageNum: 1,
        //当前每页显示多少条数据
        pageSize: 5,
      },
      //数据总条数
      total: 0,
      booklist: [],
      typeList: [],
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
    home() {
      this.$router.push("/public");
    },
    login() {
      //跳转登录界面
      this.$router.push("/login");
    },
    signUp() {
      //跳转注册页面
      this.$router.push("/signUp");
    },
    show(row) {
      this.$refs.tableRef.toggleRowExpansion(row);
    },
    //监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.queryInfo.pageNum = 1;
      this.getBookList();
    },
    //监听 页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getBookList();
    },
    async getBookList() {
      this.loading = !this.loading;
      // this.booklist = [];
      // this.typeList = [];
      const { data: res } = await this.$http.get("admin/find", {
        params: this.queryInfo,
      });
      console.log(res);
      this.loading = !this.loading;
      if (res.status !== 6011) {
        return this.$message.error("获取图书列表失败！");
      }
      res.data.list.forEach((item) => {
        if (item.type !== null) {
          this.booklist.push(item);
        }
      });
      // let list = [];
      // this.booklist.forEach((item) => {
      //   list.push(item.type);
      // });
      // list = [...new Set(list)];
      // list.forEach((item) => {
      //   const type = { text: item, value: item };
      //   this.typeList.push(type);
      // });
      this.booklist = res.data.list;
      this.total = res.data.total;
    },
    // typeFilter(value, row) {
    //   return row.type === value;
    // },
    // table每次只能展开一行
    expandSelect(row, expandedRows) {
      this.expands = [];
      if (expandedRows.length > 0) {
        row ? this.expands.push(row.isbn) : "";
      }
    },
  },
  beforeUpdate() {
    this.nickName = window.sessionStorage.getItem("nickName");
    // console.log(window.sessionStorage.getItem("nickName"));
    if (this.jobNumber !== window.sessionStorage.getItem("jobNumber")) {
      window.sessionStorage.clear();
      return this.$router.push("/login");
    }
  },
  watch: {
    "queryInfo.name"(val) {
      this.queryInfo.pageNum = 1;
      setTimeout(() => {
        this.getBookList();
      }, 500);
    },
  },
};
</script>
<style lang="less" scoped></style>
