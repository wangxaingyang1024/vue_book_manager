<template>
  <div>
    <div>
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="comment.content"
        maxlength="50"
        show-word-limit
        clearable
      >
      </el-input>
      <div class="add" @click="add">
        发表评论
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comment: {
        nickName: window.sessionStorage.getItem("nickName"),
        content: "",
        date: "",
      },
    };
  },
  methods: {
    add() {
      if (this.comment.content === "") {
        return this.$message.warning("请先输入内容再发表评论！");
      }
      const date = new Date();
      this.comment.date = this.time(date);
      console.log(this.comment);
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
  },
};
</script>

<style lang="less" scoped>
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
</style>
