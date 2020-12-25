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
      <div class="click">
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
    <el-card> </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      book: [],
      check: false,
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
    favorite() {
      this.check = !this.check;
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
}
</style>
