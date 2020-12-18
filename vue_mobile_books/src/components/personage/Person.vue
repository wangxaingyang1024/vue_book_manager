<template>
  <div>
    <!-- 用户信息栏 -->
    <van-card>
      <template #thumb>
        <div class="img">
          <span>{{ imgNickName }}</span>
        </div>
      </template>
      <template #title>
        <p>{{ userForm.nickName }}</p>
        <br />
      </template>
      <template #desc>
        <div class="show">用户名:{{ userForm.username }}</div>
        <div class="show">工号:{{ userForm.jobNumber }}</div>
      </template>
      <template #footer>
        <van-icon
          size="20"
          name="arrow-down"
          v-if="msg === false"
          @click="show($event)"
        />
        <van-icon size="20" name="arrow-up" v-else @click="show($event)" />
      </template>
      <template #price>
        <div v-show="msg">
          <div class="show">生日:{{ userForm.birth }}</div>    
          <div class="show shows">手机号:{{ userForm.phone }}</div>
        </div>
      </template>
    </van-card>
    <!-- 用户操作栏 -->
    <div class="separated"></div>
    <van-cell title="我的收藏" is-link to="" icon="star-o" />
    <van-cell title="我的评论" is-link to="" icon="comment-o" />
    <div class="separated"></div>
    <van-cell title="设置" is-link icon="setting-o" @click="toSetting" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      imgNickName: "",
      msg: false,
      userForm: {}
    };
  },
  created() {
    this.getUserForm();
    if (this.nickName !== null) {
      this.imgNickName = this.nickName.slice(-2);
    }
  },
  methods: {
    async getUserForm() {
      const { data: res } = await this.$http.get(`profile/${this.jobNumber}`);

      console.log(res);
      if (res.status === 402) {
        return this.$toast.fail("请先登录！");
      }
      if (res.status !== 200) {
        return this.$toast.fail("获取个人信息失败！");
      }
      this.userForm = res.data;
      this.userForm.birth = this.userForm.birth.slice(0, 10);
    },
    //判断是否点击了下拉按钮
    show(e) {
      if (e.currentTarget === e.target) {
        this.msg = !this.msg;
      }
    },
    toSetting() {
      if (this.nickName === null) {
        return this.$toast.fail("请先登录！");
      }
      this.$router.push("/setting");
    }
  }
};
</script>

<style lang="less" scoped>
.van-card {
  background-color: #fff;
  padding-top: 20px;
  padding-bottom: 0px;
}
p {
  margin-top: 8px;
  font-size: 20px;
}
.show {
  font-size: 11px;
  padding: 2px;
}
.shows{
  top: -3px;
  position: relative;
}
.van-card__footer{
 top:85px;
 right: 20px;
  position: absolute;
}

.img {
  width: 75px;
  height: 75px;
  background-color: #3296fa;
  border-radius: 50%;
  text-align: center;
  line-height: 75px;
  margin-top: 10px;
  span {
    color: #fff;
    font-size: 25px;
  }
}
.separated {
  width: 100%;
  height: 5px;
  border: 1px solid #e7e7e7;
}
</style>
