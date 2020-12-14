<template>
  <div>
    <!-- 导航区域 -->
    <van-nav-bar
      title="新用户注册"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    >
    </van-nav-bar>
    <!-- 注册表单区域 -->
    <van-form :model="SignUpForm" ref="SignUpRef">
      <van-field
        v-model="SignUpForm.username"
        name="username"
        label="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="SignUpForm.password"
        type="password"
        name="password"
        label="密码"
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        type="password"
        name="password"
        label="确认密码"
        :rules="[{ required: true, message: '请再次填写密码' }]"
      />
      <div style="margin: 35px">
        <van-button round block type="primary" @click="signup">
          注册
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
        SignUpForm:{
            username:'111',
            password:'123456'
        }
    };
  },
  methods: {
    //返回上一层
    onClickLeft() {
      this.$router.push("/login");
    },
    //注册按钮
    signup(){

    }
  },
};
</script>

<style lang="less" scoped>
.van-field {
  margin-top: 20px;
}
</style>