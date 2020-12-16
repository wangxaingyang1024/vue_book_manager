<template>
  <van-form v-model="userForm">
    <van-field
      v-model="userForm.oldPsw"
      type="password"
      name="密码"
      label="旧密码"
      placeholder="请填写旧的密码"
      :rules="[
        { required: true },
        {
          validator: psw,
          message: '需包含大小写字母数字，不使用特殊字符8~15长度',
        },
      ]"
    />
    <van-field
      v-model="userForm.newPsw"
      type="password"
      name="密码"
      label="新密码"
      placeholder="请填写新的密码"
      :rules="[
        { required: true },
        {
          validator: psw,
          message: '需包含大小写字母数字，不使用特殊字符8~15长度',
        },
        { validator: newPsw, message: '新密码不能与旧密码相同' },
      ]"
    />
    <van-field
      v-model="userForm.checkPsw"
      type="password"
      name="密码"
      label="新密码"
      placeholder="请再次填写新密码"
      :rules="[
        { required: true },
        {
          validator: psw,
          message: '需包含大小写字母数字，不使用特殊字符8~15长度',
        },
        { validator: reNewPsw, message: '两次密码不一致' },
      ]"
    />
    <div style="margin: 16px">
      <van-button round block type="info" @click="editUser"> 提交 </van-button>
    </div>
  </van-form>
</template>

<script>
export default {
  data() {
    return {
      userForm: {
        oldPsw: "",
        newPsw: "",
        checkPsw: "",
        username: window.sessionStorage.getItem("username"),
      },
    };
  },
  methods: {
    //验证密码
    psw(val) {
      return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(val);
    },
    //验证新密码
    newPsw(val) {
      if (val !== this.userForm.oldPsw) {
        return true;
      }
      return false;
    },
    //新密码二次验证
    reNewPsw(val) {
      if (val === this.userForm.newPsw) {
        return true;
      }
      return false;
    },
    //点击按钮提交表单
    async editUser() {
      const { data: res } = await this.$http.post("changePsw", this.userForm);
      console.log(res);
      if (res.status !== 1002) return this.$toast.fail("修改失败！");

      this.$toast.success("修改成功！");
      window.sessionStorage.clear();
      return this.$router.push("/login");
    },
  },
};
</script>

<style>
</style>