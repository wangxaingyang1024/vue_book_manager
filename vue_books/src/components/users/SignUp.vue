<template>
  <el-container>
    <el-header>
      <span class="topText">注册页面</span>
      <div class="logo"><img src="../../../public/logo.svg" height="" /></div>
    </el-header>
    <el-main>
      <div class="add_container">
        <div class="add_box">
          <!-- 注册表单区域 -->
          <el-form
            ref="addFormRef"
            :model="addForm"
            :rules="addFormRules"
            label-width="0px"
            class="add_form"
          >
            <!-- 用户名 -->
            <el-form-item prop="username">
              <el-input
                v-model="addForm.username"
                prefix-icon="el-icon-user"
                placeholder="设置用户名"
              ></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
              <el-input
                v-model="addForm.password"
                prefix-icon="el-icon-lock"
                type="password"
                placeholder="设置您的登录密码"
              ></el-input>
            </el-form-item>
            <!-- 二次验证密码 -->
            <el-form-item prop="checkPassword">
              <el-input
                type="password"
                v-model="addForm.checkPassword"
                autocomplete="off"
                prefix-icon="el-icon-edit"
                placeholder="请再次输入您的密码"
              ></el-input>
            </el-form-item>
            <!-- 昵称 -->
            <el-form-item prop="nickName">
              <el-input
                v-model="addForm.nickName"
                prefix-icon="el-icon-mobile"
                placeholder="设置您的昵称"
              ></el-input>
            </el-form-item>
            <!-- 工号 -->
            <!-- <el-form-item prop="job_number">
              <el-input
                v-model="addForm.job_number"
                prefix-icon="el-icon-data-line"
                placeholder="请输入您的工号"
              ></el-input>
            </el-form-item> -->
            <!-- 性别 -->
            <el-form-item prop="gender">
              <el-select v-model="addForm.gender" placeholder="请选择您的性别">
                <el-option label="男" value="1"></el-option>
                <el-option label="女" value="0"></el-option>
              </el-select>
            </el-form-item>
            <!-- 电话 -->
            <el-form-item prop="phone">
              <el-input
                v-model="addForm.phone"
                prefix-icon="el-icon-phone-outline"
                placeholder="请输入您的电话"
              ></el-input>
            </el-form-item>
            <!-- 年龄 -->
            <el-form-item prop="age">
              <el-input
                v-model="addForm.age"
                prefix-icon="el-icon-suitcase"
                placeholder="请输入您的年龄"
              ></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
              <el-button type="primary" @click="addUser">提交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div></el-main
    >
  </el-container>
</template>

<script>
export default {
  data() {
    //验证用户名规则
    var checkUsername = (rule, value, callback) => {
      const regUsername = /^[A-Za-z]{1}[A-Za-z0-9]{2,9}/;
      if (regUsername.test(value)) {
        //合法用户名
        return callback();
      }

      callback(new Error("需以字母开头，字母数字组合3~10长度"));
    };
    //验证密码
    var validatePassword = (rule, value, callback) => {
      const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
      if (regPass.test(value)) {
        //合法密码
        return callback();
      }
      callback(new Error("需包含大小写字母数字，不使用特殊字符8~15长度"));
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.addFormRules.checkPassword !== "") {
          this.$refs.addFormRules.validateField("checkPassword");
        }
        callback();
      }
    };
    //二次验证
    var validatePassword2 = (rule, value, callback) => {
      const regPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
      if (regPass.test(value)) {
        //合法密码
        return callback();
      }
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addFormRules.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };

    //验证工号
    // var checkJob_number = (rule, value, callback) => {
    //   const Username = /^[A-Za-z]{1}[A-Za-z0-9]{2,9}/;
    //   if (regUsername.test(value)) {
    //     //合法用户名
    //     return callback();
    //   }

    //   callback(new Error("需包含字母数字，3~10长度"));
    // };

    //验证手机规则
    var checkPhone = (rule, value, callback) => {
      const regPhone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;

      if (regPhone.test(value)) {
        //合法手机
        return callback();
      }

      callback(new Error("请输入合法手机号"));
    };

    //验证年龄
    var checkAge = (rule, value, callback) => {
      const regAge = /^[1-9][0-9]{0,1}$/;

      if (regAge.test(value)) {
        //合法手机
        return callback();
      }

      callback(new Error("请输入合法年龄"));
    };
    return {
      addForm: {
        username: "",
        password: "",
        nickName: "", // 昵称
        job_number: "",
        gender: "",
        phone: "",
        age: "",
        checkPassword: "",
      },
      addFormRules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "需以字母开头，字母数字组合3~10长度",
            trigger: "blur",
          },
          {
            validator: checkUsername,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 8,
            max: 15,
            message: "需包含大小写字母数字，不使用特殊字符8~15长度",
            trigger: "blur",
          },
          { validator: validatePassword, trigger: "blur" },
        ],
        checkPassword: [
          {
            required: true,
            //min: 8,
            //max: 15,
            trigger: "blur",
          },
          { validator: validatePassword2, trigger: "blur" },
        ],
        nickName: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度3~10之间",
            trigger: "blur",
          },
        ],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        //工号
        // job_number: [
        //   {
        //     required: true,
        //     message: "请输入工号",
        //     trigger: "blur",
        //   },
        //   {
        //     min:8,
        //     max:8,
        //     message: "请输入8位工号",
        //     trigger: "blur",
        //   },
        //   {
        //     validate: checkJob_number,
        //     trigger: "blur",
        //   },
        // ],
        //验证手机
        phone: [
          {
            required: true,
            message: "请输入手机",
            trigger: "blur",
          },
          {
            validator: checkPhone,
            trigger: "blur",
          },
        ],
        age: [
          {
            required: true,
            message: "请输入年龄",
            trigger: "blur",
          },
          {
            validator: checkAge,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //点击按钮提交表单
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        //可发起注册网络请求
        const { data: res } = await this.$http.post(
          "http://localhost:8080/api/signUp",
          this.addForm
        );
        //注册成功跳转到登录，失败则停留当前页面
        if (res.status == 3021) return this.$message.error("用户名已存在！");
        if (res.status !== 3024) {
          this.$message.error("注册失败！");
        } else {
          this.$message.success("注册成功！请登录！");
          this.$router.push("/Login");
        }
        console.log(res);
      });
    },
  },
};
</script>

<style lang="less">
.el-form {
  .el-form-item__error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 40px;
    left: 270px;
  }
}
</style>
<style lang="less" scoped>
.el-main {
  padding: 0;
}
.el-header {
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  height: 80px;
  width: 100%;
  position: relative;
  z-index: 1000;
  clear: both;
}
body {
  background-color: #f5f5f6;
}
.add_box {
  margin: 50px auto;
  width: 600px;
  height: 760px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.15);
  background-color: #fff;
}
.topText {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  font-size: 30px;
  position: relative;
  left: 520px;
  top: 2px;
}
.logo {
  position: absolute;
  left: 370px;
  top: 5px;
}
.el-form {
  text-align: center;
}
.el-input {
  width: 500px;
  margin: 0 auto;
  top: 20px;
  height: 50px;
  margin-top: 10px;
}
.el-select {
  width: 500px;
  margin: 0 auto;
  top: 20px;
  height: 50px;
  margin-top: 10px;
}
.el-button {
  width: 500px;
  margin-top: 30px;
}
</style>
