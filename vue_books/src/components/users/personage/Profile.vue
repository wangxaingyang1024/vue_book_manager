<template>
  <!-- 个人信息区域 -->
  <el-form
    ref="editFormRef"
    :model="userForm"
    :rules="editFormRules"
    status-icon
  >
    <!-- 用户名 -->
    <el-form-item>
      <el-input
        v-model="userForm.username"
        prefix-icon="el-icon-user"
        disabled
      ></el-input>
    </el-form-item>
    <!-- 昵称 -->
    <el-form-item prop="nickName">
      <el-input
        v-model="userForm.nickName"
        prefix-icon="el-icon-mobile"
        placeholder="设置您的昵称"
      ></el-input>
    </el-form-item>
    <!-- 性别 -->
    <el-form-item prop="gender">
      <el-radio v-model="userForm.gender" label="1">男</el-radio>
      <el-radio v-model="userForm.gender" label="0">女</el-radio>
    </el-form-item>
    <!-- 生日 -->
    <el-form-item prop="date">
      <el-date-picker
        v-model="userForm.date"
        type="date"
        placeholder="请选择您的生日"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      >
        >
      </el-date-picker>
    </el-form-item>
    <!-- 电话 -->
    <el-form-item prop="phone">
      <el-input
        v-model="userForm.phone"
        prefix-icon="el-icon-phone-outline"
        placeholder="请输入您的电话"
      ></el-input>
    </el-form-item>
    <!-- 年龄 -->
    <el-form-item prop="age">
      <el-input
        v-model="userForm.age"
        prefix-icon="el-icon-suitcase"
        placeholder="请输入您的年龄"
        disabled
      ></el-input>
    </el-form-item>
    <!-- 按钮区域 -->
    <el-form-item>
      <el-button type="primary" round @click="editUser">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  data() {
    //验证手机规则
    const checkPhone = (rule, value, callback) => {
      if (value === "") {
        return callback();
      }
      const regPhone = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/;

      if (regPhone.test(value)) {
        //合法手机
        return callback();
      }
      callback(new Error("请输入合法手机号"));
    };

    //验证年龄;
    const checkAge = (rule, value, callback) => {
      if (value === "") {
        return callback();
      }
      const regAge = /^[0-9][0-9]{0,1}$/;

      if (regAge.test(value)) {
        return callback();
      }

      callback(new Error("请输入合法年龄"));
    };
    return {
      userForm: {},
      editFormRules: {
        nickName: [
          {
            min: 3,
            max: 10,
            message: "长度3~10之间",
            trigger: "blur",
          },
        ],
        //验证手机
        phone: [
          {
            validator: checkPhone,
            trigger: "blur",
          },
        ],
        age: [
          {
            validator: checkAge,
            trigger: "blur",
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() >= Date.now();
        },
      },
    };
  },
  created() {
    this.getUserForm();
  },
  methods: {
    async getUserForm() {
      const { data: res } = await this.$http.get();
      if (res.status !== 6011) {
        return this.$message.error("获取个人信息失败！");
      }
      this.userForm = res.data;
    },
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
            return this.$message.error("修改失败！");
          } else {
            this.getUserForm();
            this.$message.success("修改成功！");
          }
        }
      });
    },
  },
  watch: {
    "userForm.date"(val) {
      this.userForm.age = new Date().getFullYear() - +val.slice(0, 4);
    },
  },
};
</script>
<style lang="less" scoped>
.el-form {
  padding: 50px;
  width: 500px;
  .el-input,
  .el-select,
  .el-button {
    width: 500px;
    margin-top: 20px;
  }
}
.el-card {
  width: 100%;
}
</style>
