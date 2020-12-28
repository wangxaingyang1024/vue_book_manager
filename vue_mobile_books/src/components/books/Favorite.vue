<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="爱看书籍">
      <template #left>
        <van-icon name="arrow-left" @click="onClickLeft" />
      </template>
    </van-nav-bar>
    <!-- 我的书籍 -->
    <div style="height: calc(100vh - 150px); overflow: auto">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getBookList"
      >
        <van-swipe-cell v-for="item in booklist" :key="item.isbn" right-width="100">
          <van-collapse v-model="activeName" accordion>
            <van-collapse-item :title="'《' + item.name + '》'" :name="item.isbn">
              <div><span class="title">作者:</span> {{ item.author }}</div>
              <div><span class="title">编号:</span> {{ item.isbn }}</div>
              <div><span class="title">简介:</span> {{ item.synopsis }}</div>
              <div><span class="title">类型:</span> {{ item.type }}</div>
              <div class="btn">
                <van-button
                  type="primary"
                  size="mini"
                  @click="cancelFavorite(item.isbn)"
                  id="cancelFavoriteButton"
                  >取消收藏</van-button
                >
              </div>
            </van-collapse-item>
          </van-collapse>
        </van-swipe-cell>
      </van-list>
    </div>
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
      loading: false,
      finished: true,
      booklist: [
        {
          name: "dasda",
          author: "dasdas",
          isbn: 524121,
          synopsis: "dasdasdasd",
          type: "sadasdasd",
        },
      ],
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      activeName: "",
    };
  },
  methods: {
    //获取书籍列表
    async getBookList() {
      const { data: res } = await this.$http.get(`book/getFavorite/${this.jobNumber}`);
      if (res.status !== 6013) {
        return this.$toast.fail("获取图书列表失败！");
      }
      this.booklist = res.data;
      console.log(res.data);
    },
    //取消收藏
    async cancelFavorite(isbn) {
      //console.log(isbn);
      const confirmResult = await this.$dialog
        .confirm({
          message: "确定要取消收藏吗？",
          confirmButtonColor: "red",
        })
        .catch((err) => err);
      if (confirmResult !== "confirm") {
        return;
      } else {
        const { data: res } = await this.$http.post(`book/favorite`, {
          jobNumber: this.jobNumber,
          isbn: isbn,
          isClick: false,
        });
        console.log(res);
        if (res.status !== 6014) {
          return this.$toast.fail("取消收藏失败");
        }
        this.$toast.success("取消收藏成功！");
        this.getBookList();
      }
    },
    //返回
    onClickLeft() {
      this.$router.push("person");
    },
  },
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
  background-image: linear-gradient(to right, rgba(255, 0, 0, 0), rgb(89, 201, 108));
}
.title {
  color: rgb(138, 197, 224);
}
.btn {
  .van-button {
    float: right;
    top: -20px;
  }
}
</style>
