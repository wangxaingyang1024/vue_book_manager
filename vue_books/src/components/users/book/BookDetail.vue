<template>
  <div>
    <el-page-header @back="goBack" content="详情页面"> </el-page-header>
    <el-card>
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
      <div class="click" @click="favorite">
        <el-tooltip
          effect="light"
          content="收藏"
          placement="top-start"
          offset="5"
        >
          <i class="el-icon-star-off" v-if="check === false"></i>
          <i class="el-icon-star-on" v-else></i>
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
        v-model="content"
        maxlength="50"
        show-word-limit
        clearable
      >
      </el-input>
      <div class="add" @click="add">
        发表评论
      </div>
      <hr />
      <!-- <comments></comments> -->
      <div v-for="item in comments" :key="item.id">
        <h5>{{ item.nickName }}</h5>
        <p>{{ item.content }}</p>
        <span
          >{{ item.date }}
          <i class="el-icon-chat-line-square" @click="huifu(item)"></i>
        </span>
        <div
          v-for="subItem in item.children"
          :key="subItem.id"
          style="margin-left:100px"
        >
          <h5>{{ subItem.nickName }}</h5>
          <p>{{ subItem.content }}</p>
          <span
            >{{ subItem.date }}
            <i
              class="el-icon-chat-line-square"
              @click="huifu(item, subItem)"
            ></i>
          </span>
        </div>
        <div v-if="active === item.id" style="margin-left:100px">
          <el-input
            type="textarea"
            :rows="3"
            :placeholder="place"
            v-model="content1"
            maxlength="50"
            show-word-limit
            clearable
          >
          </el-input>
          <div class="add" @click="add1">
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
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      book: [],
      active: "",
      check: false,
      content: "",
      content1: "",
      place: "",
      comments: [
        {
          id: 1,
          nickName: "aaa",
          content: "这本书针不戳",
          date: "2020-12-25",
          children: [
            {
              id: 11,
              nickName: "zzz",
              content: "不会吧不会吧",
              date: "2020-12-25",
            },
            {
              id: 12,
              nickName: "啊哈哈",
              content: "我服了",
              date: "2020-12-25",
            },
          ],
        },
        { id: 2, nickName: "bbb", content: "这本书针不戳", date: "2020-12-25" },
        { id: 3, nickName: "ccc", content: "这本书针不戳", date: "2020-12-25" },
      ],
    };
  },
  created() {
    this.book = JSON.parse(window.sessionStorage.getItem("book"));
    console.log(this.book);
  },
  methods: {
    goBack() {
      window.history.back();
    },
    async favorite() {
      this.check = !this.check;
      if (this.check === true) {
        const { data: res } = await this.$http.post("book/favorite", {
          jobNumber: this.jobNumber,
          isbn: this.book.isbn,
          isClick: this.check,
        });
        if (res.status !== 6015) {
          return this.$message.error("收藏失败!");
        }
        return this.$message.success("收藏成功!");
      }
      const { data: res } = await this.$http.post("book/favorite", {
        jobNumber: this.jobNumber,
        isbn: this.book.isbn,
        isClick: this.check,
      });
      if (res.status !== 6014) {
        return this.$message.error("取消收藏失败!");
      }
      return this.$message.success("已取消收藏!");
    },
    async borrowBook() {
      if (this.jobNumber === null || this.token === null) {
        return this.$message.warning("请先登录再进行此操作！");
      }
      if (this.book.status === false) {
        return this.$message.warning("这本书已经被借走了哦！");
      }
      const { data: res } = await this.$http.post("book/borrow", {
        jobNumber: this.jobNumber,
        isbn: this.book.isbn,
      });
      //console.log(res);
      if (res.status !== 6006) {
        return this.$message.error("借阅书籍失败！");
      }
      this.$message.success("借阅书籍成功!");
    },
    add() {
      if (this.content === "") {
        return this.$message.warning("请先输入内容再发表评论！");
      }
      const date = new Date();
      console.log(this.content);
      this.comments.unshift({
        nickName: window.sessionStorage.getItem("nickName"),
        content: this.content,
        date: this.time(date),
        id: this.comments.length + 1 + "",
      });
      this.content = "";
      this.active = "";
    },
    add1() {
      if (this.content1 === "") {
        return this.$message.warning("请先输入内容再发表评论！");
      }
      const date = new Date();
      console.log(this.content1);
      this.comments.unshift({
        nickName: window.sessionStorage.getItem("nickName"),
        content: this.content1,
        date: this.time(date),
        id: this.comments.length + 1 + "",
      });
      this.content1 = "";
      this.active = "";
    },
    time(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? "0" + minute : minute;
      var second = date.getSeconds();
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
    huifu(item, subItem) {
      this.active = item.id;
      if (subItem) {
        return (this.place = `回复@${subItem.nickName}:`);
      }
      this.place = `回复@${item.nickName}:`;
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
  div {
    margin-top: 15px;
    .title {
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
  display: flex;
  //实现垂直居中
  align-items: center;
  //实现水平居中
  justify-content: center;
}
.add:hover {
  background: #02a3cf;
}
.el-icon-chat-line-square:hover {
  color: rgb(255, 209, 6);
}
.el-page-header {
  position: sticky;
  top: -19px;
  background: #fff;
  padding: 15px;
  z-index: 1000;
  border: 1px solid rgba(90, 88, 88, 0.37);
  box-shadow: 1px 5px 10px rgba(90, 88, 88, 0.61);
}
</style>
