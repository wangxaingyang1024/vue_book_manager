<template>
  <div>
    <!-- 用户信息栏 -->
    <van-card id="card" style="height:110px">
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
        <div id="price" style="height:0px">
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
        if (this.msg === true) {
          document.getElementById("card").style.height = "110px";
          document.getElementById("price").style.height = "0px";
        } else {
          document.getElementById("card").style.height = "150px";
          // setTimeout(() => {
          document.getElementById("price").style.height = "40px";
          // }, 1000);
        }
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
#price {
  text-overflow: clip;
  overflow: hidden;
  transition: height 1s;
}
.van-card {
  background-color: #fff;
  padding-top: 20px;
  padding-bottom: 0px;
  background-image: url("https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1116404228,1514575065&fm=26&gp=0.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
p {
  margin-top: 8px;
  font-size: 20px;
}
.show {
  font-size: 11px;
  padding: 2px;
}
.shows {
  top: -3px;
  position: relative;
}
.van-card {
  transition: height 1s;
}
.van-card__footer {
  top: 85px;
  right: 20px;
  position: absolute;
  .van-icon-arrow-up {
    top: 40px;
    transition: top 1s;
  }
  .van-icon-arrow-down {
    top: 0;
    transition: top 1s;
  }
}

.img {
  width: 75px;
  height: 75px;
  background-color: #0b421750;
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
}
</style>
