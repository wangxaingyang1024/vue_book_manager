<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="书籍详情">
      <template #left>
        <van-icon name="arrow-left" @click="onClickLeft" />
      </template>
    </van-nav-bar>
    <!-- 书籍详情 -->
    <van-card>
      <template #title>
        <p>{{ bookObject.name }}</p></template
      >
      <template #desc>
        <span class="text">作者：{{ bookObject.author }}</span>
        <span class="spanisbn">编号：{{ bookObject.isbn }}</span>
      </template>
      <template #tags>
        <span class="span">状态：</span>
        <van-tag type="success" v-if="bookObject.status === true">未借出</van-tag>
        <van-tag v-else>已借出</van-tag>
      </template>
      <template #price>
        <span class="text">简介：{{ bookObject.synopsis }}</span>
        <span class="text">类型：{{ bookObject.type }}</span>
        <van-icon name="chat-o" size="22" @click="exterComment" />
        <van-icon v-if="collection === false" name="star-o" size="22" @click="favorite" />
        <van-icon v-else @click="favorite" color="#f17a98" name="star" size="22" />
      </template>
      <template #footer>
        <van-button
          type="primary"
          v-if="bookObject.status === true"
          @click="borrowBook(bookObject.isbn)"
          >借阅</van-button
        >
        <van-button disabled v-else>借阅</van-button>
      </template>
    </van-card>
    <!-- 一级评论弹框 -->
    <van-action-sheet v-model="show1" title="评论此书" @close="closeSheet">
      <van-field
        v-model="message1"
        rows="5"
        autosize
        type="textarea"
        maxlength="100"
        placeholder="请输入评论"
        show-word-limit
        clearable
      />
      <van-button type="primary" @click="add1">发表评论</van-button>
    </van-action-sheet>
    <!-- 评论内容界面 -->
    <span class="commentSpan">热门评论</span>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="this.getCommentList"
    >
      <div class="exterComment" v-for="(item1, index1) in commentlist" :key="index1">
        <p class="name">{{ item1.myName }}</p>
        <p class="time">{{ item1.commentTime.slice(0, 19) }}</p>
        <p class="comments">{{ item1.message }}</p>
        <span class="likeCount1" v-if="like === false">{{ item1.likeCount }}</span>
        <span class="likeCount2" v-else>{{ item1.likeCount }}</span>
        <van-icon size="18" name="thumb-circle-o" v-if="like === false" @click="onLike" />
        <van-icon size="18" color="#f17a98" v-else name="thumb-circle" />
        <van-icon size="18" name="chat-o" @click="interComment(item1.mid)" />
        <div class="interComment" v-for="(item2, index2) in item1.list" :key="index2">
          <span>{{ item2.myName }}：</span>
          <span>{{ item2.message }}</span>
        </div>
      </div>
    </van-list>
    <!-- 二级评论弹框 -->
    <van-action-sheet v-model="show2" title="回复" @close="closeSheet">
      <van-field
        v-model="message2"
        rows="5"
        autosize
        type="textarea"
        maxlength="100"
        :placeholder="'回复@:' + placeholder"
        show-word-limit
        clearable
      />
      <van-button type="primary" @click="add2">发表回复</van-button>
    </van-action-sheet>
  </div>
</template>

<script>
export default {
  created() {
    let r = window.sessionStorage.getItem("bookDetail");
    this.bookObject = JSON.parse(r);
    //console.log(this.bookObject);
    //获取评论列表
    this.getCommentList();
    //获取是否已收藏
    this.getCheck();
  },
  data() {
    return {
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      token: window.sessionStorage.getItem("token"),
      loading: false,
      finished: true,
      bookObject: {},
      //判断收藏按钮颜色变化
      collection: false,
      //评论框是否弹出
      show1: false,
      show2: false,
      //评论弹框数据绑定内容
      message1: "",
      message2: "",
      //获取二级评论数据绑定
      placeholder: "",
      //点赞判断
      like: false,
      //获取的评论列表
      commentlist: [],
    };
  },
  methods: {
    //跳转回图书页面
    onClickLeft() {
      this.$router.push("books");
      window.sessionStorage.removeItem("bookDetail");
    },
    //弹出一级评论框
    exterComment(bookObject) {
      this.show1 = true;
    },
    //发表一级评论
    async add1() {
      if (this.message1 === "") {
        return this.$toast.fail("请先输入内容");
      }
      const date = new Date();
      const { data: res } = await this.$http.post("comment/addComment", {
        myNumber: this.jobNumber,
        parNumber: 0,
        isbn: this.bookObject.isbn,
        message: this.message1,
        commnetTime: this.time(date),
        likeCount: 0,
      });
      if (res.status !== 3034) {
        return this.$toast.fail("发表评论失败");
      }
      this.message1 = "";
      this.$toast.success("发表评论成功");
      this.getCommentList();
    },
    //关闭弹框清除弹框内容
    closeSheet() {
      this.message1 = "";
      this.message2 = "";
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
    //获取评论列表
    async getCommentList() {
      console.log(this.bookObject.isbn);
      const { data: res } = await this.$http.get(
        `comment/findEnd/${this.bookObject.isbn}`
      );
      this.commentlist = res.data;
      console.log(res);
    },
    //二级评论按钮
    interComment(mid) {
      this.show2 = true;
      //找到当前对应的评论
      let a = {};
      this.commentlist.forEach((val) => {
        if (val.mid == mid) {
          a = val;
        }
      });
      this.placeholder = a.myName;
      //console.log(a);
    },
    //点赞
    onLike() {
      this.like = true;
    },
    //收藏
    async favorite() {
      if (this.collection === false) {
        const { data: res } = await this.$http.post("book/favorite", {
          jobNumber: this.jobNumber,
          isbn: this.bookObject.isbn,
          isClick: true,
        });
        if (res.status !== 6015) {
          return this.$toast.fail("收藏失败!");
        }
        this.collection = !this.collection;
        return this.$toast.success("收藏成功!");
      }
      //弹框询问用户是否取消收藏
      const confirmResult = await this.$dialog
        .confirm({
          message: "确定要取消收藏吗？",
          confirmButtonColor: "red",
        })
        .catch((err) => err);
      //如果用户确认删除,则返回值为字符串confirm
      //如果用户取消删除，则返回值为字符串cancel
      if (confirmResult !== "confirm") {
        return;
      }
      const { data: res } = await this.$http.post("book/favorite", {
        jobNumber: this.jobNumber,
        isbn: this.bookObject.isbn,
        isClick: false,
      });
      if (res.status !== 6014) {
        return this.$toast.error("取消收藏失败!");
      }
      this.collection = !this.collection;
      //return this.$toast.success("已取消收藏!");
    },
    //查询是否已收藏
    async getCheck() {
      this.loading = !this.loading;
      const { data: res } = await this.$http.post(`book/isClick`, {
        jobNumber: this.jobNumber,
        isbn: this.bookObject.isbn,
      });
      this.loading = !this.loading;
      //console.log(res);
      if (res.status !== 200) {
        return this.$toast.fail("查询是否已收藏失败!");
      }
      this.collection = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
.van-card {
  background-color: #ffffff;
  min-height: 180px;
  margin-top: 0;
  .van-icon {
    margin-top: 15px;
    margin-left: 16px;
    margin-right: 20px;
  }
  p {
    margin-top: 5px;
    font-size: 24px;
  }
  .van-card__footer {
    display: inline;
  }
}
.text {
  display: block;
  margin-top: 5px;
  margin-left: 10px;
  font-size: 14px;
}
.spanisbn {
  display: block;
  margin-top: 5px;
  margin-left: 10px;
  margin-bottom: 5px;
  font-size: 14px;
}
.span {
  margin-left: 10px;
  font-size: 14px;
}
.van-tag {
  width: 36px;
  display: inline;
}
.van-button {
  height: 30px;
  width: 60px;
  float: right;
  margin-top: -33px;
}
.van-action-sheet {
  .van-button {
    height: 28px;
    width: 90px;
    margin-top: -5px;
    margin-bottom: 5px;
    margin-right: 5px;
  }
}
.commentSpan {
  display: block;
  font-size: 15px;
  margin: 5px;
}
.exterComment {
  border-bottom: 1px solid #e8e8e8;
  background-color: #ffffff;
  padding-top: 10px;
  padding-bottom: 15px;
  .van-icon {
    display: flex;
    justify-content: flex-end;
    margin: 5px;
  }
  .name {
    color: #2a3e8d;
    margin-left: 10px;
    display: inline;
  }
  .time {
    font-size: 12px;
    color: #656565;
    margin-left: 10px;
    display: inline;
  }
  .comments {
    margin-top: 10px;
    margin-left: 30px;
    margin-bottom: 15px;
  }
}
.interComment {
  width: 80%;
  background-color: #f7f7f7;
  margin-left: 20px;
  font-size: 14px;
  padding: 10px;
  :nth-child(1) {
    color: #2a3e8d;
  }
}
.van-list {
  .van-icon {
    width: 20px;
    float: right;
    top: -25px;
    right: 3px;
  }
}
.likeCount1 {
  font-size: 12px;
  float: right;
  margin-top: -17px;
}
.likeCount2 {
  font-size: 12px;
  float: right;
  margin-top: -17px;
  color: #f17a98;
}
</style>
