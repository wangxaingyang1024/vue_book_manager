<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="书籍详情">
      <template #left>
        <van-icon name="arrow-left" @click="onClickLeft" id="onClickLeftButton" />
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
        <van-icon name="chat-o" size="22" @click="exterComment" id="exterCommentButton" />
        <van-icon
          v-if="collection === false"
          name="star-o"
          size="22"
          @click="favorite"
          id="favoriteButton"
        />
        <van-icon
          v-else
          color="#f17a98"
          name="star"
          size="22"
          @click="favorite"
          id="favoriteButton"
        />
      </template>
      <template #footer>
        <van-button
          type="primary"
          v-if="bookObject.status === true"
          @click="borrowBook(bookObject.isbn)"
          id="borrowBookButton"
          >借阅</van-button
        >
        <van-button disabled v-else>借阅</van-button>
      </template>
    </van-card>
    <!-- 一级评论弹框 -->
    <van-action-sheet
      v-model="show1"
      title="评论此书"
      @close="closeSheet"
      id="closeSheetButton"
    >
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
      <van-button type="primary" @click="p" id="pButton">发表评论</van-button>
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
        <p class="name">{{ item1.myNickname }}</p>
        <p class="time">{{ item1.commentTime.slice(0, 19) }}</p>
        <p class="comments">{{ item1.message }}</p>
        <span class="likeCount1" v-if="likelist.indexOf(item1.myFlag) === -1">{{
          item1.likeCount
        }}</span>
        <span class="likeCount2" v-else>{{ item1.likeCount }}</span>
        <van-icon
          size="18"
          name="thumb-circle-o"
          v-if="likelist.indexOf(item1.myFlag) === -1"
          @click="like(item1.myFlag)"
          class="like"
          id="likeButton"
        />
        <van-icon
          size="18"
          color="#f17a98"
          v-else
          name="thumb-circle"
          class="like"
          @click="like(item1.myFlag)"
          id="likeButton"
        />
        <van-icon
          class="item1"
          size="18"
          name="chat-o"
          @click="interComment(item1)"
          id="interCommentButton"
        />
        <div class="interComment" v-for="(item2, index2) in item1.children" :key="index2">
          <span>{{ item2.myNickname }}：</span>
          <span>{{ item2.message }}</span>
          <van-icon
            size="14"
            name="comment-o"
            @click="interComment(item1, item2)"
            id="interCommentButton"
          />
          <div
            class="penetComment"
            v-for="(item3, index3) in item2.children"
            :key="index3"
          >
            <span>{{ item3.myNickname }}&nbsp;@&nbsp;{{ item2.myNickname }}：</span>
            <span>{{ item3.message }}</span>
            <van-icon
              size="14"
              name="comment-o"
              @click="interComment(item1, item2, item3)"
              id="interCommentButton"
            />
          </div>
        </div>
      </div>
    </van-list>
    <!-- 二级评论弹框 -->
    <van-action-sheet
      v-model="show2"
      title="回复"
      @close="closeSheet"
      id="closeSheetButton"
    >
      <van-field
        v-model="message2"
        rows="5"
        autosize
        type="textarea"
        maxlength="100"
        :placeholder="place"
        show-word-limit
        clearable
      />
      <van-button type="primary" @click="add" id="addButton">发表回复</van-button>
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
    //获取点赞列表
    this.getLikeList();
  },
  /*mounted() {
    this.commentNum();
  },*/
  data() {
    return {
      num: 0,
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
      message: "",
      message1: "",
      message2: "",
      //点赞判断
      islike: true,
      parNumber: 0,
      parFlag: "0",
      //获取评论数据绑定
      place: "",
      //获取的评论列表
      commentlist: [],
      //获取点赞列表
      likelist: [],
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
    p() {
      this, (this.parNumber = 0);
      this.add();
    },
    //发表评论
    async add() {
      if (this.parNumber === 0) {
        this.message = this.message1;
        this.parFlag = "0";
      } else {
        this.message = this.message2;
      }
      if (this.message === "") {
        return this.$toast.fail("请先输入内容");
      }
      const { data: res } = await this.$http.post("comment/addComment", {
        myNumber: this.jobNumber,
        parNumber: this.parNumber,
        parFlag: this.parFlag,
        isbn: this.bookObject.isbn,
        message: this.message,
        likeCount: 0,
      });
      if (res.status !== 3034) {
        return this.$toast.fail("发表评论失败");
      }
      this.message = "";
      this.message1 = "";
      this.message2 = "";
      this.parNumber = 0;
      //this.$toast.success("发表评论成功");
      this.show1 = false;
      this.show2 = false;
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
      const { data: res } = await this.$http.post(`comment/findEnd`, {
        isbn: this.bookObject.isbn,
      });
      this.commentlist = res.data;
      console.log(res);
    },
    //评论按钮
    interComment(item1, item2, item3) {
      this.show2 = true;
      //this.placeholder = item1.myNickname;
      if (item3) {
        this.parNumber = item3.myNumber;
        this.parFlag = item2.myFlag;
        return (this.place = `回复@${item3.myNickname}:`);
      }
      if (item2) {
        this.parNumber = item2.myNumber;
        this.parFlag = item2.myFlag;
        return (this.place = `回复@${item2.myNickname}:`);
      }
      this.parNumber = item1.myNumber;
      this.parFlag = item1.myFlag;
      this.place = `回复@${item1.myNickname}:`;
    },
    //获取点赞列表
    async getLikeList() {
      const { data: res } = await this.$http.post("comment/personalLike", {
        isbn: this.bookObject.isbn,
        jobNumber: this.jobNumber,
      });
      this.likelist = res.data;
    },
    //点赞
    async like(myFlag) {
      if (this.likelist.indexOf(myFlag) === -1) {
        this.islike = true;
      } else {
        this.islike = false;
      }
      const { data: res } = await this.$http.post("comment/updateComment", {
        myFlag: myFlag,
        isLike: this.islike,
        isbn: this.bookObject.isbn,
        jobNumber: this.jobNumber,
      });
      this.getCommentList();
      this.getLikeList();
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
    //计算评论总数
    /*commentNum() {
      this.comments.forEach((item1) => {
        this.num = this.num + 1;
        item1.children.forEach((item2) => {
          this.num += 1;
          item2.children.forEach((item3) => {
            this.num += 1;
          });
        });
      });
      console.log(this.num);
    },*/
  },
};
</script>

<style lang="less" scoped>
.van-nav-bar {
  position: sticky;
  top: 0;
  z-index: 9;
}
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
    font-size: 15px;
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
  .item1 {
    display: inline;
    margin-top: -25px;
    margin-right: 35px;
  }
  .like {
    margin-top: -25px;
  }
}
.interComment {
  width: 80%;
  background-color: #f7f7f7;
  margin-left: 20px;
  font-size: 12px;
  padding: 10px;
  :nth-child(1) {
    color: #2a3e8d;
  }
}
.van-list {
  .van-icon {
    float: right;
    top: -4px;
    right: 3px;
  }
}
.penetComment {
  padding: 10px;
  .van-icon {
    float: right;
    right: -7px;
  }
}
.likeCount1 {
  font-size: 12px;
  float: right;
  margin-top: -27px;
}
.likeCount2 {
  font-size: 12px;
  float: right;
  margin-top: -27px;
  color: #f17a98;
}
</style>
