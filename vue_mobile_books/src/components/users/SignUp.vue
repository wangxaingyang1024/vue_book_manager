<template>
  <div>
    <!-- 导航区域 -->
    <van-nav-bar
      title="新用户注册"
      left-text="返回登录"
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
        :rules="[{ required: true, message: '请填写用户名' },
                 {pattern ,message:'需以字母开头，字母数字组合3~10长度'}]"
      />
      <van-field
        v-model="SignUpForm.password"
        type="password"
        name="password"
        label="密码"
        :rules="[{ required: true, message: '请填写密码' },
                 { validator,message:'需包含大小写字母数字，不使用特殊字符8~15长度'}]"
      />
      <van-field
        v-model="SignUpForm.checkPassword"
        type="password"
        name="password"
        label="确认密码"
        :rules="[{ required: true, message: '请再次填写密码' },
                 {validator: asyncValidator,message:'两次密码必须一致'}]"
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
            username:'a11',
            password:'Explosion0',
            checkPassword:''
        },
        //检验用户名规则
        pattern:/^[A-Za-z]{1}[A-Za-z0-9]{2,9}/,
    };
  },
  methods: {
    //检验密码规则
    validator(val){
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(val);
    },
    //检验两次密码是否一致
    asyncValidator(val) {
      return new Promise((resolve) => {
        this.$toast.loading('验证中');
        setTimeout(() => {
          this.$toast.clear();
          resolve(this.SignUpForm.password === this.SignUpForm.checkPassword);
        }, 1000);
      });
    },
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