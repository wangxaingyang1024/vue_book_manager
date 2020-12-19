<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="密码设置" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <van-form @submit="editUser">
      <van-field
        v-model="userForm.oldPsw"
        type="password"
        label="旧密码"
        placeholder="请输入旧密码"
        clearable
        :rules="[
          { required: true },
          {
            validator: psw,
            message: '需包含大小写字母数字，不使用特殊字符8~15长度'
          }
        ]"
      />
      <van-field
        v-model="userForm.newPsw"
        type="password"
        label="新密码"
        placeholder="请输入新密码"
        clearable
        :rules="[
          { required: true },
          {
            validator: psw,
            message: '需包含大小写字母数字，不使用特殊字符8~15长度'
          },
          { validator: newPsw, message: '新密码不能与旧密码相同' }
        ]"
      />
      <van-field
        v-model="userForm.checkPsw"
        type="password"
        label="新密码"
        placeholder="请再次输入新密码"
        clearable
        :rules="[
          { required: true },
          {
            validator: psw,
            message: '需包含大小写字母数字，不使用特殊字符8~15长度'
          },
          { validator: reNewPsw, message: '两次密码不一致' }
        ]"
      />
      <div style="margin: 16px">
        <van-button round block type="info" @click="editUser">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userForm: {
        oldPsw: "",
        newPsw: "",
        checkPsw: "",
        username: window.sessionStorage.getItem("username")
      }
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
      // console.log(this.psw(this.userForm.oldPsw));
      if (
        this.userForm.oldPsw === "" ||
        this.userForm.newPsw === "" ||
        this.userForm.checkPsw === "" ||
        !this.psw(this.userForm.oldPsw) ||
        !this.psw(this.userForm.newPsw) ||
        !this.psw(this.userForm.checkPsw) ||
        !this.newPsw(this.userForm.newPsw) ||
        !this.reNewPsw(this.userForm.checkPsw)
      ) {
        return;
      }
      const { data: res } = await this.$http.post("changePsw", this.userForm);
      console.log(res);
      if (res.status !== 1002) return this.$toast.fail("修改失败！");

      this.$toast.success("修改成功！");
      window.sessionStorage.clear();
      return this.$router.push("/login");
    },
    onClickLeft() {
      window.history.back();
    }
  }
};
</script>

<style></style>
