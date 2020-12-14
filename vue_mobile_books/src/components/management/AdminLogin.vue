<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="管理员登录">
      <template #left>
        <span class="span">中均图书</span>
      </template>
      <template #right>
        <van-icon
          @click="checkout"
          name="exchange"
          size="20"
        />
      </template>
    </van-nav-bar>
    <div class="welcome">
      <p>欢迎登录中均图书</p>
    </div>
    <!-- 登录表单区域 -->
  </div>
</template>

<script>
export default {
  data(){
    return{

    }
  },
  methods:{
    checkout(){
      //跳转到用户登录
      this.$router.push('/login')
    }
  }
};
</script>

<style lang="less" scoped>
.span {
  font-size: 20px;
  color: deepskyblue;
  font-family: 宋体;
}
.welcome {
  margin-top: 5px;
  width: 100%;
  height: 80px;
  line-height: 80px;
  background-image: url("../../assets/beijing.png");
  p {
    text-align: center;
    color: #eee;
    margin: 0;
  }
}
</style>