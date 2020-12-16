<template>
  <van-form status-icon>
    <van-field v-model="userForm.username" label="用户名" disabled />
    <van-field
      v-model="userForm.nickName"
      label="昵称"
      placeholder="设置您的昵称"
      clearable
      :rules="[{ pattern: nickNameRule, message: '请输入3-10位用户名' }]"
    />
    <van-field label="性别">
      <template #input>
        <van-radio-group v-model="userForm.gender" direction="horizontal">
          <van-radio name="1">男</van-radio>
          <van-radio name="2">女</van-radio>
        </van-radio-group>
      </template>
    </van-field>

    <!-- <van-field
      readonly
      clickable
      type="date"
      name="datetimePicker"
      :value="value"
      label="时间选择"
      placeholder="点击选择时间"
      @click="showPicker = true"
    /> -->
    <!-- <van-field> -->

    <van-cell is-link @click="showPopup"
      ><span class="birth">生日</span>
      <span>{{
        this.currentDate.getFullYear() +
        "-" +
        this.currentDate.getMonth() +
        "-" +
        this.currentDate.getDate()
      }}</span></van-cell
    >
    <van-popup
      v-model="show"
      position="bottom"
      round
      @confirm="success"
      @cancel="info"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <!-- </van-field> -->
    <van-field
      v-model="userForm.phone"
      label="手机"
      name="phone"
      placeholder="输入您的手机"
      type="tel"
      clearable
      :rules="[{ pattern, message: '请输入正确手机号' }]"
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
      show: false,
      nickNameRule: /^.{3,10}$/,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2020, 10, 1),
      currentDate: new Date(),
      pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
      // value: "",
      // showPicker: false,
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      userForm: {
        nickName: "",
        gender: "",
      },
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() >= Date.now();
      //   },
      // },
    };
  },
  created() {
    this.getUserForm();
  },
  methods: {
    showPopup() {
      this.show = true;
    },
    success() {
      console.log(111);
    },
    info() {
      console.log(222);
    },
    async getUserForm() {
      const { data: res } = await this.$http.get(`profile/${this.jobNumber}`);

      console.log(res.data);
      if (res.status !== 200) {
        return this.$toast.fail("获取个人信息失败！");
      }
      this.userForm = res.data;
    },
    //点击按钮提交表单
    async editUser() {
      const { data: res } = await this.$http.put("upProfile", this.userForm);
      if (res.status !== 3032) {
        return this.$toast.fail("修改失败！");
      } else {
        location.reload();
        // this.getUserForm();
        this.$toast.success("修改成功！");
        console.log(this.userForm.nickName);
        window.sessionStorage.setItem("nickName", this.userForm.nickName);
      }
    },
  },
  // watch: {
  //   currentDate(val) {
  //     console.log(val);
  //   },
  // },
};
</script>

<style lang="less" scoped>
.birth {
  margin-right: 4.3rem;
}
</style>