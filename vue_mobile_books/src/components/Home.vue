<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="钧钧图书馆">
      <template #left>
        <img src="~assets/logo.jpg" />
      </template>
      <template #right>
        <span v-if="jobNumber === null">
          <van-icon size="23" @click="login" name="https://b.yzcdn.cn/vant/icon-demo-1126.png" />
        </span>
        <!-- <span v-if="jobNumber === null">
          <van-button type="info" size="mini" @click="login">登录</van-button>
          <van-button type="primary" size="mini" @click="signUp"
            >注册</van-button
          >
        </span> -->
        <van-popover placement="bottom-end" v-model="showPopover" theme="dark" :actions="actions" trigger="click" @select="onSelect" v-else>
          <template #reference>
            <van-icon name="manager-o" /> Hi,zzz
          </template>
        </van-popover>
      </template>
    </van-nav-bar>
    <!-- 搜索 -->
    <form action="/">
      <van-search v-model="value" show-action placeholder="请输入搜索关键词" @cancel="onCancel" />
    </form>
    {{value}}
    <!-- <p>图书列表</p> -->
    <!-- 书籍 -->
    <van-collapse v-model="activeNames" v-for="item in booklist" :key="item.isbn" accordion>
      <van-collapse-item v-if="item.name.indexOf('value') !== -1" :title="'《' + item.name + '》'" :name="item.isbn">
        <van-row type="flex" justify="space-between">
          <van-col span="8">作者: {{ item.author }}</van-col>
          <van-col span="10">编号: {{ item.isbn }}</van-col>
        </van-row>
        <van-row class="row1" type="flex" justify="space-between">
          <van-col span="8">状态:
            <span>
              <van-tag type="success" v-if="item.status.toString() === 'true'">未借出</van-tag>
              <van-tag v-else>已借出</van-tag>
            </span>
          </van-col>
          <van-col span="10">简介: {{ item.synopsis }}</van-col>
        </van-row>
        <van-row class="row2" type="flex" justify="space-between">
          <van-col span="8">类型: {{ item.type }}</van-col>
          <van-col span="8">
            <van-button type="primary" size="mini" v-if="item.status.toString() === 'true'" @click="borrowBook(item.isbn)">借阅</van-button>
            <van-button disabled size="mini" v-else>借阅</van-button>
          </van-col>
        </van-row>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
export default {
  //生命周期函数获取书籍列表
  created () {
    //this.getBookList();
  },
  data () {
    return {
      nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      token: window.sessionStorage.getItem("token"),
      showPopover: false,
      actions: [
        { text: "我的书籍", icon: "newspaper-o" },
        { text: "个人中心", icon: "user-o" },
        { text: "密码设置", icon: "setting-o" },
        { text: "退出登录", icon: "down" },
      ],
      value: "",
      activeNames: ["741852963"],
      booklist: [],
      typeList: [],
      queryInfo: {
        //模糊查询
        name: "",
        //当前页数
        pageNum: 1,
        //当前每页显示多少条数据
        pageSize: 5,
      },
      //数据总条数
      total: 0,
    };
  },
  methods: {
    //跳转到登录界面
    login () {
      this.$router.push("login");
    },
    signUp () {
      this.$router.push("/signUp");
      //window.sessionStorage.clear();
    },
    //点击选项按钮跳转
    onSelect (actions) {
      switch (actions.text) {
        case "我的书籍":
          this.$router.push('/mybooks')
          //this.$toast.success("1");
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
          this.$dialog.confirm({
            message: '确定要退出吗？',
            confirmButtonColor: 'red'
          }).then(() => {
            this.$router.push('/login')
            //window.sessionStorage.clear();
          }).catch(() => {
            console.log('点击了取消')
          })
          break;
      }
    },
    onCancel (val) {
      this.val = "";
    },
    //获取书籍列表
    async getBookList () {
      this.booklist = [];
      this.typeList = [];
      const { data: res } = await this.$http.get("admin/find", {
        params: this.queryInfo,
      });
      if (res.status !== 6011) {
        return this.$totast.fail("获取图书列表失败！");
      }
      console.log(res);
      res.data.list.forEach((item) => {
        if (item.type !== null) {
          this.booklist.push(item);
        }
      });
      let list = [];
      this.booklist.forEach((item) => {
        list.push(item.type);
      });
      list = [...new Set(list)];
      list.forEach((item) => {
        const type = { text: item, value: item };
        this.typeList.push(type);
      });
      this.total = res.data.total;
    },
    //借阅书籍
    async borrowBook (isbn) {
      if (this.jobNumber === null || this.token === null) {
        return this.$toast.fail("请先登录！");
      }
      const { data: res } = await this.$http.post("book/borrow", {
        jobNumber: this.jobNumber,
        isbn: isbn,
      });
      //console.log(res);
      if (res.status !== 6006) {
        return this.$toast.fail("借阅失败！");
      }
      this.$toast.success("借阅成功!");
      this.getBookList();
    },
  },
};
</script>

<style lang="less" scoped>
img {
  width: 60px;
  margin-top: 7px;
}
.van-row {
  margin-left: 20px;
  margin-right: 60px;
}
.row1 {
  margin-top: 30px;
}
.row2 {
  margin-top: 30px;
  margin-right: -50px;
}
.van-button {
  margin-right: 10px;
}
/*p{
  margin-left: 10px;
  margin-bottom: 10px;
  font-family: 宋体;
  font-size: 20px;
}*/
</style>
