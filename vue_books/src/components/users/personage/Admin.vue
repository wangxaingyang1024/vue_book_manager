<template>
  <el-card>
    <!-- 个人信息区域 -->
    <el-form
      ref="editFormRef"
      :model="userForm"
      :rules="editFormRules"
      status-icon
    >
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
          v-model="userForm.password"
          prefix-icon="el-icon-lock"
          type="password"
          placeholder="设置您的登录密码"
        ></el-input>
      </el-form-item>
      <!-- 二次验证密码 -->
      <el-form-item prop="checkPassword">
        <el-input
          type="password"
          v-model="userForm.checkPassword"
          autocomplete="off"
          prefix-icon="el-icon-edit"
          placeholder="请再次输入您的密码"
        ></el-input>
      </el-form-item>
      <!-- 新密码 -->
      <el-form-item prop="editPassword">
        <el-input
          type="password"
          v-model="userForm.editPassword"
          autocomplete="off"
          prefix-icon="el-icon-edit"
          placeholder="请输入要修改的密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" round @click="editUser">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data() {
    //验证密码
    const validatePassword = (rule, value, callback) => {
      const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
      if (!regPass.test(value)) {
        //不合法密码
        return callback(
          new Error("需包含大小写字母数字，不使用特殊字符8~15长度")
        );
      }
      if (
        this.userForm.password !== "" &&
        this.userForm.checkPassword !== "" &&
        this.userForm.password !== this.userForm.checkPassword
      ) {
        return callback(new Error("两次输入密码不一致"));
      }
      if (this.userForm.editPassword === this.userForm.password) {
        return callback(new Error("新密码与旧密码不能相同"));
      }
      return callback();
    };
    return {
      userForm: {},
      editFormRules: {
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            validator: validatePassword,
            trigger: "blur",
          },
        ],
        checkPassword: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
          },
          {
            validator: validatePassword,
            trigger: "blur",
          },
        ],
        editPassword: [
          {
            required: true,
            message: "请输入要修改的密码",
            trigger: "blur",
          },
          {
            validator: validatePassword,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //点击按钮提交表单
    editUser() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        const confirmResult = await this.$confirm("是否确认修改?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).catch((err) => err);
        if (confirmResult === "confirm") {
          const { data: res } = await this.$http.post("url", this.jobNumber);
          if (res.status !== 3024) {
            this.$message.error("修改失败！");
          } else {
            this.$message.success("修改成功！");
          }
        }
        //可发起注册网络请求
        // const { data: res } = await this.$http.post("signUp", this.userForm);
        //注册成功跳转到登录，失败则停留当前页面
        // if (res.status == 3021) return this.$message.error("用户名已存在！");
        // if (res.status !== 3024) {
        //   this.$message.error("注册失败！");
        // } else {
        //   this.$message.success("注册成功！请登录！");
        //   this.$router.push("/Login");
        // }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.el-form {
  padding: 50px;
  width: 500px;
  .el-input,
  .el-button {
    width: 500px;
    margin-top: 15px;
  }
}
</style>
