<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="钧钧图书馆">
      <template #left>
        <img src="~assets/logo.jpg" />
      </template>
      <template #right>
        <!-- <span v-if="jobNumber === null">
          <van-icon
            size="23"
            @click="login"
            name="https://b.yzcdn.cn/vant/icon-demo-1126.png"
          />
        </span> -->
        <span v-if="jobNumber === null">
          <van-button type="info" size="mini" @click="login">登录</van-button>
          <van-button type="primary" size="mini" @click="signUp"
            >注册</van-button
          >
        </span>
        <van-popover
          placement="bottom-end"
          v-model="showPopover"
          theme="dark"
          :actions="actions"
          trigger="click"
          @select="onSelect"
          v-else
        >
          <template #reference> <van-icon name="manager-o" /> Hi,zzz </template>
        </van-popover>
      </template>
    </van-nav-bar>
    <!-- 搜索 -->
    <form action="/">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词"
        @cancel="onCancel"
      />
    </form>
    <!-- 书籍 -->
    <van-collapse
      v-model="activeNames"
      v-for="item in bookList"
      :key="item.id"
      accordion
    >
      <van-collapse-item :title="item.name" :name="item.id">{{
        item.isbn
      }}</van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      showPopover: false,
      actions: [
        { text: "我的书籍", icon: "newspaper-o" },
        { text: "个人中心", icon: "user-o" },
        { text: "密码设置", icon: "setting-o" },
        { text: "退出登录", icon: "down" }
      ],
      value: "",
      activeNames: ["1"],
      bookList: [
        { id: "1", name: "aaa", isbn: 1231231 },
        { id: "2", name: "bbb", isbn: 1231231 },
        { id: "3", name: "ccc", isbn: 1231231 },
        { id: "4", name: "ddd", isbn: 1231231 }
      ]
    };
  },
  methods: {
    //跳转到登录界面
    login() {
      this.$router.push("login");
    },
    signUp() {
      this.$router.push("/signUp");
      //window.sessionStorage.clear();
    },
    //点击选项按钮跳转
    onSelect(actions) {
      switch (actions.text) {
        case "我的书籍":
          //
          this.$toast.success("1");
          break;
        case "个人中心":
          //
          this.$toast.success("2");
          break;
        case "密码设置":
          //
          this.$toast.success("3");
          break;
        case "退出登录":
          //this.$toast.success("4");
          this.$router.push("/login");
          window.sessionStorage.clear();
          break;
      }
    },
    onCancel(val) {
      this.val = "";
    }
  }
};
</script>

<style lang="less" scoped>
img {
  width: 60px;
  margin-top: 7px;
}
</style>
