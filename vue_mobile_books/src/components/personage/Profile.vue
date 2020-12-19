<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="个人信息设置" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <van-form @submit="editUser">
      <van-field v-model="userForm.username" label="用户名" disabled />
      <van-field
        v-model="userForm.nickName"
        label="昵称"
        placeholder="请设置您的昵称"
        clearable
        :rules="[{ validator: nickNameRule, message: '长度为3-10位' }]"
      />
      <van-field label="性别">
        <template #input>
          <van-radio-group v-model="userForm.gender" direction="horizontal">
            <van-radio size="mini" name="1">男</van-radio>
            <van-radio name="0">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>
      <van-cell
        title="生日"
        title-class="van-field__label"
        is-link
        :value="userForm.birth"
        value-class="van-field__control"
        @click="showPopup"
      ></van-cell>
      <van-popup v-model="show" position="bottom" round>
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          :loading="isLoadingShow"
          @cancel="show = false"
          @confirm="confirmPicker"
        />
      </van-popup>
      <van-field
        v-model="userForm.phone"
        label="手机"
        placeholder="输入您的手机号"
        type="tel"
        clearable
        :rules="[{ validator: phoneRule, message: '请输入正确手机号' }]"
      />
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit">
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
      show: false,
      isLoadingShow: true,
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(2020, 12, 31),
      currentDate: new Date(),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      userForm: {}
    };
  },
  created() {
    this.getUserForm();
  },
  methods: {
    async getUserForm() {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        className: "toast"
      });
      const { data: res } = await this.$http.get(`profile/${this.jobNumber}`);
      console.log(res);
      if (res.status !== 200) {
        return this.$toast.fail({
          message: "获取个人信息失败!",
          className: "toast"
        });
      }
      this.userForm = res.data;
      this.$toast.clear();
      this.userForm.birth = this.userForm.birth.slice(0, 10);
      this.userForm.gender = this.userForm.gender + "";
    },
    nickNameRule(val) {
      if (val === "") {
        return true;
      }
      return /^.{3,10}$/.test(val);
    },
    phoneRule(val) {
      if (val === "") {
        return true;
      }
      return /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/.test(
        val
      );
    },
    // 显示弹窗
    showPopup() {
      this.show = true;
      this.isLoadingShow = true;
      setTimeout(() => {
        this.isLoadingShow = false;
      }, 500);
    },
    // 确认选择的时间
    confirmPicker(val) {
      let year = val.getFullYear();
      let month = val.getMonth() + 1;
      let day = val.getDate();
      if (month >= 1 && month <= 9) {
        month = `0${month}`;
      }
      if (day >= 1 && day <= 9) {
        day = `0${day}`;
      }
      this.userForm.birth = `${year}-${month}-${day}`;
      this.show = false;
    },

    //点击按钮提交表单
    async editUser() {
      if (
        this.userForm.nickName !== "" &&
        !this.nickNameRule(this.userForm.nickName)
      ) {
        return;
      }
      if (
        this.userForm.phone !== undefined &&
        !this.phoneRule(this.userForm.phone)
      ) {
        return;
      }
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        className: "toast"
      });
      const { data: res } = await this.$http.put("upProfile", this.userForm);
      if (res.status !== 3032) {
        return this.$toast.fail({ message: "修改失败!", className: "toast" });
      } else {
        // location.reload();
        this.getUserForm();
        this.$toast.success({ message: "修改成功!", className: "toast" });
        console.log(this.userForm.nickName);
        window.sessionStorage.setItem("nickName", this.userForm.nickName);
      }
    },
    onClickLeft() {
      this.$router.push("setting");
    }
  }
};
</script>

<style lang="less" scoped></style>
