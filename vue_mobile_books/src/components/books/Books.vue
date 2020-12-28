<template>
  <div>
    <!-- 搜索 -->
    <van-search v-model="queryInfo.name" placeholder="请输入搜索关键词" />
    <!-- <p>图书列表</p> -->
    <div style="height: calc(100vh - 150px); overflow: auto">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getBookList"
      >
        <!-- 书籍 -->
        <van-swipe-cell v-for="(item, index) in booklist" :key="index" id="moreMessage">
          <van-cell>
            <template #title>
              <span>《{{ item.name }}》</span>
            </template>
            <template #right-icon>
              <van-button type="primary" size="mini" @click="bookDetail(item.isbn)"
                >查看详情</van-button
              >
            </template>
          </van-cell>
          <!-- 左滑借书 -->
          <template #right>
            <van-button
              class="borrow"
              square
              type="info"
              text="借阅"
              v-if="item.status === true"
              @click="borrowBook(item.isbn)"
            ></van-button>
            <van-button class="borrow" disabled text="借阅" v-else></van-button>
          </template>
        </van-swipe-cell>
      </van-list>
    </div>
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
      booklist: [],
      queryInfo: {
        //模糊查询
        name: "",
        //当前页数
        pageNum: 1,
        //当前每页显示多少条数据
        pageSize: 10,
      },
      //数据总条数
      total: 1,
    };
  },
  created() {
    this.getBookList();
    this.queryInfo.pageNum += 1;
  },
  methods: {
    //获取书籍列表
    async getBookList() {
      if (this.booklist.length >= this.total) {
        return (this.finished = true);
      }
      const { data: res } = await this.$http.get("admin/find", {
        params: this.queryInfo,
      });
      if (res.status !== 6011) {
        return this.$totast.fail({
          message: "获取图书列表失败!",
          className: "toast",
        });
      }
      //console.log(res.data.list);
      this.queryInfo.pageNum += 1;
      this.booklist.push(...res.data.list);
      this.loading = false;
      this.total = res.data.total;
    },
    //借阅书籍
    async borrowBook(isbn) {
      if (this.jobNumber === null || this.token === null) {
        return this.$toast.fail({ message: "请先登录!", className: "toast" });
      }
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        className: "toast",
      });
      const { data: res } = await this.$http.post("book/borrow", {
        jobNumber: this.jobNumber,
        isbn: isbn,
      });
      //console.log(res);
      if (res.status !== 6006) {
        return this.$toast.fail({ message: "借阅失败!", className: "toast" });
      }
      this.$toast.success({ message: "借阅成功!", className: "toast" });
      location.reload();
    },
    //详情按钮
    bookDetail(isbn) {
      //先存isbn
      window.sessionStorage.setItem("isbn", isbn);
      //找到当前isbn所对应的对象
      let r = {};
      this.booklist.forEach((val) => {
        if (val.isbn == isbn) {
          r = val;
        }
      });
      let books = JSON.stringify(r);
      window.sessionStorage.setItem("bookDetail", books);
      this.$router.push("detail");
    },
  },
  watch: {
    "queryInfo.name"(val) {
      this.queryInfo.pageNum = 1;
      this.total = 1;
      this.booklist = [];
      this.finished = false;
      this.loading = false;
      this.getBookList();
      this.queryInfo.pageNum += 1;
    },
  },
};
</script>

<style lang="less" scoped>
.van-search {
  position: sticky;
  top: 46px;
  z-index: 1000;
}
.title {
  color: rgb(138, 197, 224);
}

.borrow {
  float: right;
}
</style>
