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
      <el-form-item prop="oldPsw">
        <el-input
          v-model="userForm.oldPsw"
          prefix-icon="el-icon-lock"
          type="password"
          placeholder="请输入您的旧密码"
          id="oldPsw"
        ></el-input>
      </el-form-item>
      <!-- 新密码 -->
      <el-form-item prop="newPsw">
        <el-input
          type="password"
          v-model="userForm.newPsw"
          autocomplete="off"
          prefix-icon="el-icon-edit"
          placeholder="请输入您的新密码"
          id="newPsw"
        ></el-input>
      </el-form-item>
      <!-- 二次验证密码 -->
      <el-form-item prop="checkPsw">
        <el-input
          type="password"
          v-model="userForm.checkPsw"
          autocomplete="off"
          prefix-icon="el-icon-edit"
          placeholder="请再次输入您的新密码"
          id="checkPsw"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" round @click="editUser" id="editUserButton"
          >提交</el-button
        >
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
        this.userForm.newPsw !== "" &&
        this.userForm.checkPsw !== "" &&
        this.userForm.newPsw !== this.userForm.checkPsw
      ) {
        return callback(new Error("两次输入密码不一致"));
      }
      if (this.userForm.newPsw === this.userForm.oldPsw) {
        return callback(new Error("新密码与旧密码不能相同"));
      }
      return callback();
    };
    return {
      userForm: {
        oldPsw: "",
        newPsw: "",
        checkPsw: "",
        username: window.sessionStorage.getItem("username"),
      },
      editFormRules: {
        oldPsw: [
          {
            required: true,
            message: "请输入旧的密码",
            trigger: "blur",
          },
          {
            validator: validatePassword,
            trigger: "blur",
          },
        ],
        newPsw: [
          {
            required: true,
            message: "请输入新的的密码",
            trigger: "blur",
          },
          {
            validator: validatePassword,
            trigger: "blur",
          },
        ],
        checkPsw: [
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
          const { data: res } = await this.$http.post(
            "changePsw",
            this.userForm
          );
          console.log(res);
          if (res.status !== 1002) return this.$message.error("修改失败！");

          this.$message.success("修改成功！");
          window.sessionStorage.clear();
          return this.$router.push("/login");
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.el-card {
  width: 500px;
  padding: 50px;
  .el-input {
    width: 450px;
  }
  .el-button {
    width: 450px;
  }
}
</style>
