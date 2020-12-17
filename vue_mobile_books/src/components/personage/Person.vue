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
        <p>{{ nickName }}</p>
        <br />
      </template>
      <template #desc>
        用户名:
        <span class="desc">{{ username }}</span
        ><br /><br />
        工号:
        <span class="desc">{{ jobNumber }}</span
        ><br /><br />
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
          生日:
          <span class="desc">1999-04-12</span><br /><br />
          手机号:
          <span class="desc">15594984139</span>
        </div>
      </template>
    </van-card>
    <!-- 显示隐藏的个人信息 -->
    <!-- <van-cell-group border v-show="msg">
      <van-cell title="生日" value="内容" />
      <van-cell title="手机号" value="内容" />
    </van-cell-group> -->
    <!-- 用户操作栏 -->
    <div class="separated"></div>
    <van-cell title="我的收藏" is-link to="index" icon="star-o" />
    <van-cell title="我的评论" is-link to="index" icon="comment-o" />
    <div class="separated"></div>
    <van-cell title="设置" is-link to="/setting" icon="setting-o" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      msg: false,
      username: "bbbb",
    };
  },
  created() {
    this.imgNickName = this.nickName.slice(-2);
  },
  methods: {
    //判断是否点击了下拉按钮
    show(e) {
      if (e.currentTarget === e.target) {
        this.msg = !this.msg;
      }
    },
  },
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
.desc {
  font-size: 11px;
  padding: 8px;
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