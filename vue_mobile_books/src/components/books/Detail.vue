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
        <van-icon v-if="collection === true" name="star-o" size="22" />
        <van-icon v-else color="#00a1d6" name="star" size="22" />
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
      <van-button type="primary">发表评论</van-button>
    </van-action-sheet>
    <!-- 评论内容界面 -->
    <span class="commentSpan">热门评论</span>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了">
      <div class="exterComment" v-for="(item, index) in commentlist" :key="index">
        <p class="name">{{ item.name }}</p>
        <p class="time">{{ item.time }}</p>
        <p class="comments">{{ item.comments }}</p>
        <van-icon size="18" name="chat-o" @click="interComment(item.jobnumber)" />
        <div class="interComment">
          <span>余福东：</span><span>哈哈哈哈哈哈哈哈哈哈或</span>
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
      <van-button type="primary">发表评论</van-button>
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
  },
  data() {
    return {
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      token: window.sessionStorage.getItem("token"),
      loading: false,
      finished: true,
      bookObject: {},
      //判断收藏按钮颜色变化
      collection: true,
      //评论框是否弹出
      show1: false,
      show2: false,
      //评论弹框数据绑定内容
      message1: "",
      message2: "",
      //获取二级评论数据绑定
      placeholder: "",
      //获取的评论列表
      commentlist: [
        {
          name: "yhh",
          comments: "判断收藏按钮颜色变化",
          time: "12-7",
          jobnumber: 111,
        },
        {
          name: "lii",
          comments: "取的评论列表",
          time: "12-6",
          jobnumber: 222,
        },
      ],
    };
  },
  methods: {
    //跳转回图书页面
    onClickLeft() {
      this.$router.push("books");
      window.sessionStorage.clear();
    },
    //弹出评论框
    exterComment(bookObject) {
      this.show1 = true;
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
    getCommentList() {},
    //二级评论按钮
    interComment(jobnumber) {
      this.show2 = true;
      //找到当前对应的评论
      let a = {};
      this.commentlist.forEach((val) => {
        if (val.jobnumber == jobnumber) {
          a = val;
        }
      });
      this.placeholder = a.name;
      console.log(a);
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
    margin-left: 10px;
    margin-right: 115px;
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
  }
}
.interComment {
  width: 80%;
  background-color: #f7f7f7;
  margin: 20px;
  font-size: 14px;
  padding: 10px;
  :nth-child(1) {
    color: #2a3e8d;
  }
}
</style>
