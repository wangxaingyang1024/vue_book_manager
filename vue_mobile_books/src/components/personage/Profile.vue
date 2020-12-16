<template>
  <van-form
    ref="editFormRef"
    :model="userForm"
    :rules="editFormRules"
    status-icon
  >
    <van-field v-model="userForm.username" label="用户名" disabled />
    <van-field
      v-model="userForm.nickName"
      label="昵称"
      placeholder="设置您的昵称"
      prop="nickName"
    />
    <van-field v-model="gender" label="性别">
      <template #input>
        <van-radio-group v-model="userForm.gender" direction="horizontal">
          <van-radio name="1">男</van-radio>
          <van-radio name="2">女</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-field
      readonly
      clickable
      name="datetimePicker"
      :value="value"
      label="时间选择"
      placeholder="点击选择时间"
      @click="showPicker = true"
    />
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        type="time"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
    <van-field
      v-model="value1"
      label="手机"
      name="pattern"
      placeholder="输入您的手机"
      :rules="[{ pattern, message: '请输入正确内容' }]"
    />
    <div style="margin: 16px">
      <van-button round block type="info" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
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
    return {
      value: "",
      showPicker: false,
      jobNumber: window.sessionStorage.getItem("jobNumber"),
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
    onConfirm(time) {
      this.value = time;
      this.showPicker = false;
    },
    async getUserForm() {
      const { data: res } = await this.$http.get(`profile/${this.jobNumber}`);

      console.log(res.data);
      if (res.status !== 200) {
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
          const { data: res } = await this.$http.put(
            "upProfile",
            this.userForm
          );
          if (res.status !== 3032) {
            return this.$message.error("修改失败！");
          } else {
            location.reload();
            // this.getUserForm();
            this.$message.success("修改成功！");
            console.log(this.userForm.nickName);
            window.sessionStorage.setItem("nickName", this.userForm.nickName);
          }
        }
      });
    },
  },
};
</script>

<style>
</style>