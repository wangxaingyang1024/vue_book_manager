<template>
  <div>
    <!-- 我的书籍 -->
    <van-swipe-cell v-for="item in booklist" :key="item.isbn" right-width="100">
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item :title="'《' + item.name + '》'" :name="item.isbn">
          <div><span class="title">作者:</span> {{ item.author }}</div>
          <div><span class="title">编号:</span> {{ item.isbn }}</div>
          <div><span class="title">简介:</span> {{ item.synopsis }}</div>
          <div><span class="title">类型:</span> {{ item.type }}</div>
        </van-collapse-item>
      </van-collapse>
    </van-swipe-cell>
  </div>
</template>

<script>
export default {
  //生命周期函数
  created() {
    this.getBookList();
  },
  data() {
    return {
      booklist: [],
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      activeName: ""
    };
  },
  methods: {
    //获取书籍列表
    async getBookList() {
      if (window.sessionStorage.getItem("jobNumber")) {
        this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          className: "toast"
        });
      }
      const { data: res } = await this.$http.get(
        "book/findOne/" + this.jobNumber
      );
      console.log(res);
      if (res.status === 402) {
        return;
      }
      if (res.status !== 200) {
        return this.$toast.fail("获取图书失败！");
      }
      this.booklist = res.data;
      this.$toast.clear();
      if (!window.sessionStorage.getItem("num")) {
        window.sessionStorage.setItem("num", "num");
        this.$toast({
          message: "左滑还书",
          position: "center",
          className: "toast"
        });
      }
    },
    //归还书籍
    async returnBook(isbn) {
      console.log(isbn);
      const confirmResult = await this.$dialog
        .confirm({
          message: "确定要归还吗？",
          confirmButtonColor: "red"
        })
        .catch(err => err);
      //console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return;
      } else {
        this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          className: "toast"
        });
        const { data: res } = await this.$http.post("book/return", {
          jobNumber: this.jobNumber,
          isbn: isbn
        });
        if (res.status !== 6008) {
          return this.$toast.fail({
            message: "归还书籍失败!",
            className: "toast"
          });
          // console.log("还书失败");
        }
        this.getBookList();
        this.$toast.success({ message: "归还书籍成功!", className: "toast" });
      }
    }
  }
};
</script>
<style lang="less">
.van-swipe-cell__right {
  background: #fff;
}
</style>
<style lang="less" scoped>
.van-row {
  margin-left: 20px;
  margin-right: 60px;
}
.row1 {
  margin-top: 30px;
}
/*.row2 {
  margin-top: 30px;
  margin-right: -50px;
}
.van-button {
  margin-right: 10px;
}*/
.return {
  width: 100px;
  height: 100%;
  background-image: linear-gradient(
    to right,
    rgba(255, 0, 0, 0),
    rgb(89, 201, 108)
  );
}
.title {
  color: rgb(138, 197, 224);
}
</style>
