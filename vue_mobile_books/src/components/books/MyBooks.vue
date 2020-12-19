<template>
  <div>
    <!-- 我的书籍 -->
    <van-swipe-cell v-for="item in booklist" :key="item.isbn" right-width="100">
      <van-collapse v-model="activeName" accordion>
        <van-collapse-item :title="'《' + item.name + '》'" :name="item.name">
          <div><span class="title">作者:</span> {{ item.author }}</div>
          <div><span class="title">编号:</span> {{ item.isbn }}</div>
          <div><span class="title">简介:</span> {{ item.synopsis }}</div>
          <div><span class="title">类型:</span> {{ item.type }}</div>
        </van-collapse-item>
      </van-collapse>
      <!-- 左滑还书 -->
      <template #right>
        <van-button text="归还" class="return" @click="returnBook(item.isbn)" />
      </template>
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
      console.log(res.status);
      this.$toast({
        message: "左滑还书",
        position: "center",
        className: "toast"
      });
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
      //用户确认删除 返回字符串confirm
      //用户取消删除 返回字符串cancel
      if (confirmResult !== "confirm") {
        console.log("用户取消了归还");
      } else {
        const { data: res } = await this.$http.post("book/return", {
          jobNumber: this.jobNumber,
          isbn: isbn
        });
        if (res.status !== 6008) {
          return this.$toast.fail("归还书籍失败！");
          // console.log("还书失败");
        }
        this.$toast.success("归还书籍成功!");
        this.getBookList();
      }
    }
  }
};
</script>
<style lang="less">
.van-swipe-cell__right {
  background: #fff;
}
.toast {
  background: rgba(75, 76, 76, 0.456);
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
