<template>
  <div>
    <!-- 搜索 -->
    <van-search v-model="queryInfo.name" placeholder="请输入搜索关键词" />
    <!-- <p>图书列表</p> -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getBookList"
    >
      <!-- 书籍 -->
      <van-collapse
        v-model="activeNames"
        v-for="item in booklist"
        :key="item.isbn"
        accordion
      >
        <van-collapse-item :title="'《' + item.name + '》'" :name="item.isbn">
          <div>作者: {{ item.author }}</div>
          <div>编号: {{ item.isbn }}</div>
          <div>
            状态:
            <van-tag type="success" v-if="item.status === true">未借出</van-tag>
            <van-tag v-else>已借出</van-tag>
          </div>
          <div>简介: {{ item.synopsis }}</div>
          <div>类型: {{ item.type }}</div>
          <div>
            <van-button
              type="primary"
              size="mini"
              v-if="item.status === true"
              @click="borrowBook(item.isbn)"
              >借阅</van-button
            >
            <van-button disabled size="mini" v-else>借阅</van-button>
          </div>
        </van-collapse-item>
      </van-collapse>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      token: window.sessionStorage.getItem("token"),
      loading: false,
      finished: false,
      value: "",
      activeNames: [],
      booklist: [],
      typeList: [],
      queryInfo: {
        //模糊查询
        name: "",
        //当前页数
        pageNum: 1,
        //当前每页显示多少条数据
        pageSize: 10
      },
      //数据总条数
      total: 1
    };
  },
  created() {
    this.getBookList();
    this.queryInfo.pageNum += 1;
  },
  methods: {
    onCancel(val) {
      this.val = "";
    },
    //获取书籍列表
    async getBookList() {
      if (this.booklist.length >= this.total) {
        this.finished = true;
      }
      const { data: res } = await this.$http.get("admin/find", {
        params: this.queryInfo
      });
      if (res.status !== 6011) {
        return this.$totast.fail("获取图书列表失败！");
      }
      this.queryInfo.pageNum += 1;
      this.booklist.push(...res.data.list);
      this.loading = false;
      this.total = res.data.total;
    },
    //借阅书籍
    async borrowBook(isbn) {
      if (this.jobNumber === null || this.token === null) {
        return this.$toast.fail("请先登录！");
      }
      const { data: res } = await this.$http.post("book/borrow", {
        jobNumber: this.jobNumber,
        isbn: isbn
      });
      //console.log(res);
      if (res.status !== 6006) {
        return this.$toast.fail("借阅失败！");
      }
      this.$toast.success("借阅成功!");
      location.reload();
    }
  },
  watch: {
    "queryInfo.name"(val) {
      this.queryInfo.pageNum = 1;
      this.booklist = [];
      this.getBookList();
    }
  }
};
</script>

<style lang="less" scoped>
.van-button{
  float:right;
  margin-bottom: 10px;
}
.div{
  margin-bottom:10px;
}
/*p{
  margin-left: 10px;
  margin-bottom: 10px;
  font-family: 宋体;
  font-size: 20px;
}*/
</style>
