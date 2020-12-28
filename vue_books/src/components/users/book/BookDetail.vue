<template>
  <div>
    <el-page-header @back="goBack" content="详情页面"> </el-page-header>
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
      <div class="click" @click="borrowBook">
        <!-- <span><i class="el-icon-chat-line-square"></i>评论</span> -->
        <el-tooltip
          effect="light"
          content="借阅"
          placement="top-end"
          offset="-5"
        >
          <i class="el-icon-shopping-cart-2"></i>
        </el-tooltip>
      </div>
      <div class="click" @click="favorite" v-if="click === false">
        <el-tooltip
          effect="light"
          content="收藏"
          placement="top-start"
          offset="5"
        >
          <i class="el-icon-star-off"></i>
        </el-tooltip>
      </div>
      <div class="click" @click="favorite" v-else>
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
    <h3>XX条评论</h3>
    <el-card>
      <!-- <add-comment></add-comment> -->
      <el-input
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
      <div class="add" @click="p">
        发表评论
      </div>
      <hr />
      <!-- <comments></comments> -->
      <div v-for="item in comments" :key="item.myFlag">
        <h5>{{ item.myNickname }}</h5>
        <p>{{ item.message }}</p>
        <span
          >{{ item.commentTime }}
          <span class="comment-icon">
            <i class="el-icon-thumb" @click="like()"></i>
            <i class="el-icon-chat-line-square" @click="reply(item)"></i>
          </span>
        </span>
        <div
          v-for="subItem in item.children"
          :key="subItem.myFlag"
          style="margin-left:100px"
        >
          <h5>{{ subItem.myNickname }} @ {{ item.myNickname }}</h5>
          <p>{{ subItem.message }}</p>
          <span
            >{{ subItem.commentTime }}
            <span class="comment-icon">
              <i class="el-icon-thumb" @click="like()"></i>
              <i
                class="el-icon-chat-line-square"
                @click="reply(item, subItem)"
              ></i>
            </span>
          </span>
        </div>
        <div v-if="active === item.myFlag" style="margin-left:100px">
          <el-input
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
          <div class="add" @click="add">
            发表评论
          </div>
        </div>
        <hr />
      </div>
    </el-card>
  </div>
</template>

<script>
import Comments from "./Comments.vue";
export default {
  components: { Comments },
  data() {
    return {
      loading: false,
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      book: [],
      active: "",
      click: false,
      message: "",
      message1: "",
      message2: "",
      parNumber: 0,
      parFlag: "0",
      place: "",
      comments: [],
    };
  },
  created() {
    this.book = JSON.parse(window.sessionStorage.getItem("book"));
    console.log(this.book);
    this.getCheck();
    this.getComments();
  },
  methods: {
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
    async getComments() {
      console.log(this.book.isbn);
      const { data: res } = await this.$http.get(
        `comment/findEnd/${this.book.isbn}`
      );
      this.comments = res.data;
      console.log(res);
    },
    goBack() {
      window.history.back();
    },
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
    },
    p() {
      this.parNumber = 0;
      this.add();
    },
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
      const { data: res } = await this.$http.post("comment/addComment", {
        myNumber: this.jobNumber,
        parNumber: this.parNumber,
        parFlag: this.parFlag,
        isbn: this.book.isbn,
        message: this.message,
        likeCount: 0,
      });
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
    // time(date) {
    //   var y = date.getFullYear();
    //   var m = date.getMonth() + 1;
    //   m = m < 10 ? "0" + m : m;
    //   var d = date.getDate();
    //   d = d < 10 ? "0" + d : d;
    //   var h = date.getHours();
    //   h = h < 10 ? "0" + h : h;
    //   var minute = date.getMinutes();
    //   minute = minute < 10 ? "0" + minute : minute;
    //   var second = date.getSeconds();
    //   second = second < 10 ? "0" + second : second;
    //   return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    // },
    reply(item, subItem) {
      this.active = item.myFlag;
      if (subItem) {
        this.parNumber = subItem.myNumber;
        this.parFlag = item.myFlag;
        return (this.place = `回复@${subItem.myNickname}:`);
      }
      this.parNumber = item.myNumber;
      this.parFlag = item.myFlag;
      this.place = `回复@${item.myNickname}:`;
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
  z-index: 1000;
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
</style>
