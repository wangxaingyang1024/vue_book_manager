<template>
  <div>
    <el-page-header @back="goBack" content="详情页面" id="goBack">
    </el-page-header>
    <!-- 书籍详情 -->
    <el-card v-loading="loading">
      <div>
        <span class="title">书名：</span>
        《 {{ this.book.name }} 》
      </div>
      <div>
        <span class="title">作者：</span>
        {{ this.book.author }}
      </div>
      <div>
        <span class="title">分类：</span>
        {{ this.book.type }}
      </div>
      <div>
        <span class="title">状态：</span>
        <el-tag type="success" v-if="this.book.status === true">可借阅</el-tag>
        <el-tag v-else>已借出</el-tag>
      </div>
      <div>
        <span class="title">简介：</span>
        {{ this.book.synopsis }}
      </div>
      <div class="click" @click="borrowBook" id="borrowBook">
        <el-tooltip
          effect="light"
          content="借阅"
          placement="top-end"
          offset="-5"
        >
          <i class="el-icon-shopping-cart-2"></i>
        </el-tooltip>
      </div>
      <div class="click" id="favorite" @click="favorite" v-if="click === false">
        <el-tooltip
          effect="light"
          content="收藏"
          placement="top-start"
          offset="5"
        >
          <i class="el-icon-star-off"></i>
        </el-tooltip>
      </div>
      <div class="click" id="unFavorite" @click="favorite" v-else>
        <el-tooltip
          effect="light"
          content="取消收藏"
          placement="top-start"
          offset="5"
        >
          <i class="el-icon-star-on"></i>
        </el-tooltip>
      </div>
    </el-card>
    <!-- 评论区 -->
    <h3>{{ num }}条评论</h3>
    <el-card v-loading="commentLoading">
      <el-input
        id="message1"
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="message1"
        maxlength="50"
        show-word-limit
        clearable
        resize="none"
        style="margin-top:15px"
      >
      </el-input>
      <div class="add" @click="p" id="add1">
        发表评论
      </div>
      <hr />
      <!-- 一级评论 -->
      <div v-for="item in comments" :key="item.myFlag">
        <b class="nickname">{{ item.myNickname }}</b>
        <p>{{ item.message }}</p>
        <div class="comment-date">
          {{ item.commentTime.substring(0, item.commentTime.length - 2) }}
          <span class="comment-icon">
            <i
              id="like1"
              class="el-icon-thumb"
              @click="like(item.myFlag)"
              v-if="likeList.indexOf(item.myFlag) === -1"
            ></i>
            <i
              id="unLike1"
              class="el-icon-thumb"
              style="color: rgb(255, 209, 6);"
              @click="like(item.myFlag)"
              v-else
            ></i>
            {{ item.likeCount }}
            <i
              id="reply1"
              class="el-icon-chat-line-square"
              @click="reply(item)"
            ></i>
          </span>
        </div>
        <!-- 二级评论 -->
        <div
          v-for="subItem in item.children"
          :key="subItem.myFlag"
          style="margin-left:70px"
        >
          <div class="comment">
            <b class="nickname">{{ subItem.myNickname }}</b>
            <span v-html="'&nbsp;&nbsp;'"></span>
            <span class="message">{{ subItem.message }}</span>
          </div>
          <div class="comment comment-date">
            {{ subItem.commentTime.substring(0, item.commentTime.length - 2) }}
            <span class="comment-icon">
              <i
                id="like2"
                class="el-icon-thumb"
                @click="like(subItem.myFlag)"
                v-if="likeList.indexOf(subItem.myFlag) === -1"
              ></i>
              <i
                id="unLike2"
                class="el-icon-thumb"
                style="color: rgb(255, 209, 6);"
                @click="like(subItem.myFlag)"
                v-else
              ></i>
              {{ subItem.likeCount }}
              <i
                id="reply2"
                class="el-icon-chat-line-square"
                @click="reply(item, subItem)"
              ></i>
            </span>
          </div>
          <!-- 三级评论 -->
          <div v-for="tinyItem in subItem.children" :key="tinyItem.myFlag">
            <div class="comment">
              <b class="nickname">{{ tinyItem.myNickname }}</b
              >&nbsp; <span class="reply">回复</span> @{{
                tinyItem.parNickname
              }}
              ：
              <span class="message"> {{ tinyItem.message }}</span>
            </div>
            <div class="comment comment-date">
              {{
                tinyItem.commentTime.substring(
                  0,
                  subItem.commentTime.length - 2
                )
              }}
              <span class="comment-icon">
                <i
                  id="like2"
                  class="el-icon-thumb"
                  @click="like(tinyItem.myFlag)"
                  v-if="likeList.indexOf(tinyItem.myFlag) === -1"
                ></i>
                <i
                  id="unLike2"
                  class="el-icon-thumb"
                  style="color: rgb(255, 209, 6);"
                  @click="like(tinyItem.myFlag)"
                  v-else
                ></i>
                {{ tinyItem.likeCount }}
                <i
                  id="reply2"
                  class="el-icon-chat-line-square"
                  @click="reply(item, subItem, tinyItem)"
                ></i>
              </span>
            </div>
          </div>
        </div>
        <div v-if="active === item.myFlag" style="margin-left:70px">
          <el-input
            id="message2"
            type="textarea"
            :rows="3"
            :placeholder="place"
            v-model="message2"
            maxlength="50"
            show-word-limit
            clearable
            resize="none"
          >
          </el-input>
          <div id="add2" class="add" @click="add">
            发表评论
          </div>
        </div>
        <hr />
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 0,
      loading: false,
      commentLoading: false,
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      book: [],
      active: "",
      click: false,
      isLike: true,
      message: "",
      message1: "",
      message2: "",
      parNumber: 0,
      parFlag: "0",
      place: "",
      comments: [],
      likeList: [],
    };
  },
  created() {
    this.book = JSON.parse(window.sessionStorage.getItem("book"));
    this.getCheck();
    this.getComments();
    this.getLikeList();
  },

  methods: {
    //查看是否收藏
    async getCheck() {
      this.loading = !this.loading;
      const { data: res } = await this.$http.post(`book/isClick`, {
        jobNumber: this.jobNumber,
        isbn: this.book.isbn,
      });
      this.loading = !this.loading;
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("查询是否已收藏失败!");
      }
      this.click = res.data;
    },
    //获取评论列表
    async getComments() {
      this.commentLoading = !this.commentLoading;
      const { data: res } = await this.$http.post(`comment/findEnd`, {
        isbn: this.book.isbn,
      });
      this.commentLoading = !this.commentLoading;
      console.log(res);
      if (res.status !== 3036) {
        return this.$message.error("获取评论列表失败!");
      }
      this.comments = res.data;
      this.num = 0;
      this.commentNum();
    },
    //返回书籍列表
    goBack() {
      window.history.back();
    },
    //收藏书籍
    async favorite() {
      if (this.click === false) {
        this.loading = !this.loading;
        const { data: res } = await this.$http.post("book/favorite", {
          jobNumber: this.jobNumber,
          isbn: this.book.isbn,
          isClick: true,
        });
        this.loading = !this.loading;
        if (res.status !== 6015) {
          return this.$message.error("收藏失败!");
        }
        this.click = !this.click;
        return this.$message.success("收藏成功!");
      }
      //弹框询问用户是否取消收藏
      const confirmResult = await this.$confirm("是否确认取消收藏?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);
      //如果用户确认删除,则返回值为字符串confirm
      //如果用户取消删除，则返回值为字符串cancel
      if (confirmResult !== "confirm") {
        return;
      }
      this.loading = !this.loading;
      const { data: res } = await this.$http.post("book/favorite", {
        jobNumber: this.jobNumber,
        isbn: this.book.isbn,
        isClick: false,
      });
      this.loading = !this.loading;
      if (res.status !== 6014) {
        return this.$message.error("取消收藏失败!");
      }
      this.click = !this.click;
      return this.$message.success("已取消收藏!");
    },
    //借阅书籍
    async borrowBook() {
      if (this.jobNumber === null || this.token === null) {
        return this.$message.warning("请先登录再进行此操作！");
      }
      if (this.book.status === false) {
        return this.$message.warning("这本书已经被借走了哦！");
      }
      this.loading = !this.loading;
      const { data: res } = await this.$http.post("book/borrow", {
        jobNumber: this.jobNumber,
        isbn: this.book.isbn,
      });
      this.loading = !this.loading;
      console.log(res);
      if (res.status !== 6006) {
        return this.$message.error("借阅书籍失败！");
      }
      this.$message.success("借阅书籍成功!");
      this.book.status = false;
      window.sessionStorage.setItem("book", JSON.stringify(this.book));
      location.reload();
    },
    //发表父级评论
    p() {
      this.parNumber = 0;
      this.add();
    },
    //发表二级评论
    async add() {
      if (this.parNumber === 0) {
        this.message = this.message1;
        this.parFlag = "0";
      } else {
        this.message = this.message2;
      }
      if (this.message === "") {
        return this.$message.warning("评论内容不能为空!");
      }
      this.commentLoading = !this.commentLoading;
      const { data: res } = await this.$http.post("comment/addComment", {
        myNumber: this.jobNumber,
        parNumber: this.parNumber,
        parFlag: this.parFlag,
        isbn: this.book.isbn,
        message: this.message,
        likeCount: 0,
      });
      this.commentLoading = !this.commentLoading;
      console.log(res);
      if (res.status !== 3034) {
        return this.$message.error("发表评论失败!");
      }
      this.$message.success("发表评论成功!");
      this.message = "";
      this.message1 = "";
      this.message2 = "";
      this.parNumber = 0;
      this.active = "";
      return this.getComments();
    },
    //点赞评论
    async like(myFlag) {
      if (this.likeList.indexOf(myFlag) === -1) {
        this.isLike = true;
      } else {
        this.isLike = false;
      }
      this.commentLoading = !this.commentLoading;
      const { data: res } = await this.$http.post("comment/updateComment", {
        myFlag: myFlag,
        isLike: this.isLike,
        isbn: this.book.isbn,
        jobNumber: this.jobNumber,
      });
      console.log(res);
      this.commentLoading = !this.commentLoading;
      if (res.status !== 3035) {
        return this.$message.error("点赞失败!");
      }
      this.getComments();
      this.getLikeList();
    },
    //获取点赞列表
    async getLikeList() {
      this.commentLoading = !this.commentLoading;
      const { data: res } = await this.$http.post("comment/personalLike", {
        isbn: this.book.isbn,
        jobNumber: this.jobNumber,
      });
      console.log(res);
      this.commentLoading = !this.commentLoading;
      if (res.status !== 200) {
        return this.$message.error("获取点赞列表失败!");
      }
      this.likeList = res.data;
    },
    //点击回复评论
    reply(item, subItem, tinyItem) {
      this.active = item.myFlag;
      if (tinyItem) {
        this.parNumber = tinyItem.myNumber;
        this.parFlag = subItem.myFlag;
        return (this.place = `回复@${tinyItem.myNickname}:`);
      }
      if (subItem) {
        this.parNumber = subItem.myNumber;
        this.parFlag = subItem.myFlag;
        return (this.place = `回复@${subItem.myNickname}:`);
      }
      this.parNumber = item.myNumber;
      this.parFlag = item.myFlag;
      this.place = `回复@${item.myNickname}:`;
    },
    //计算总评论数
    commentNum() {
      this.num = this.num + this.comments.length;
      this.comments.forEach((item) => {
        this.num = this.num + item.children.length;
        item.children.forEach((subItem) => {
          this.num = this.num + subItem.children.length;
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  padding: 10px;
  margin-top: 15px;
  div {
    .title {
      line-height: 40px;
      color: rgb(25, 121, 148);
    }
    .click {
      float: right;
      padding: 10px;
      width: 50px;
      height: 50px;
      i {
        padding: 5px;
        font-size: 30px;
        color: rgb(248, 223, 109);
        background: #fff;
        border-radius: 50%;
        transition: 0.3s all ease-in-out;
      }
      i:hover {
        color: #fff;
        background: rgb(248, 223, 109);
        transform: rotate(360deg);
        font-size: 35px;
      }
    }
  }
  hr {
    margin: 30px 0;
    background-color: rgba(173, 173, 173, 0.541);
  }
}
.el-textarea {
  float: left;
  margin-right: 50px;
  width: 500px;
}
.add {
  background: #00b5e5;
  color: #fff;
  width: 150px;
  height: 80px;
  border-radius: 20px;
  margin-top: 15px;
  display: flex;
  //实现垂直居中
  align-items: center;
  //实现水平居中
  justify-content: center;
}
.add:hover {
  background: #02a3cf;
}
.el-page-header {
  position: sticky;
  top: -20px;
  background: #fff;
  padding: 15px;
  z-index: 999;
  border: 1px solid rgba(90, 88, 88, 0.37);
  box-shadow: 1px 5px 10px rgba(90, 88, 66, 0.61);
}
.comment-icon {
  i {
    margin-left: 15px;
  }
  i:hover {
    color: rgb(255, 209, 6);
  }
}
.comment {
  line-height: 30px;
}
.comment-date {
  font-size: 13px;
  color: #878788;
}
.reply {
  color: rgb(192, 196, 135);
}
.nickname {
  font-size: 13px;
  color: rgba(71, 71, 71, 0.74);
}
.message {
  font-size: 80%;
}
</style>
