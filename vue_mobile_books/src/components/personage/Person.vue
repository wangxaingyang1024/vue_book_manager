<template>
  <div>
    <!-- 用户信息栏 -->
    <van-card id="card" style="height: 110px">
      <template #thumb>
        <img src="" style="border-radius: 50%" id="userAvatar" />
        <canvas id="avatarCanvas" style="display: none"></canvas>
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
          id="moreMessage"
        />
        <van-icon
          size="20"
          name="arrow-up"
          v-else
          @click="show($event)"
          id="lessMessage"
        />
      </template>
      <template #price>
        <div id="price" style="height: 0px">
          <div class="show">生日:{{ userForm.birth }}</div>
          <div class="show shows">手机号:{{ userForm.phone }}</div>
        </div>
      </template>
    </van-card>
    <!-- 用户操作栏 -->
    <div class="separated"></div>
    <van-cell
      title="我的收藏"
      is-link
      icon="star-o"
      @click="toFavorite"
      id="favoriteButton"
    />
    <van-cell
      title="我的评论"
      is-link
      to=""
      icon="comment-o"
      id="commentButton"
    />
    <div class="separated"></div>
    <van-cell
      title="设置"
      is-link
      icon="setting-o"
      @click="toSetting"
      id="settingButton"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      msg: false,
      userForm: {}
    };
  },
  created() {
    this.getUserForm();
  },
  mounted() {
    this.generatorAvator(this.nickName, "avatarCanvas", "userAvatar");
  },
  methods: {
    async getUserForm() {
      if (window.sessionStorage.getItem("jobNumber")) {
        this.$toast.loading({
          duration: 0, // 持续展示 toast
          forbidClick: true,
          className: "toast"
        });
      }
      const { data: res } = await this.$http.get(`profile/${this.jobNumber}`);
      this.$toast.clear();
      console.log(res);
      if (res.status === 402) {
        return;
      }
      if (res.status !== 200) {
        return this.$toast.fail({
          message: "获取个人信息失败!",
          className: "toast"
        });
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
      this.$router.push("/setting");
    },
    toFavorite() {
      if (this.jobNumber === null || this.token === null) {
        return this.$toast.fail({ message: "请先登录!", className: "toast" });
      }
      this.$router.push("/favorite");
    },
    generatorAvator(username, canvasId, avatarContainerId) {
      //设置头像昵称，如果为null或者为空时，设置为无
      var nickname = username;
      //设置头像大小
      var avatarSize = 75;

      //设置头像内部文字大小
      var fontSize = 23;

      //设置头像内部字体
      var fontWeight = "normal";

      //设置头像背景颜色
      /*var colors = [
        "#31bc9f",
        "#33cc70",
        "#4a94db",
        "#9b5fb6",
        "#34495e",
        "#16a085",
        "#27ae60",
        "#2980b9",
        "#8e44ad",
        "#2c3e50",
        "#f1cb1e",
        "#e6761b",
        "#e7363b",
        "#00bcd4",
        "#95a5a6",
        "#f39c12",
        "#d35400",
        "#c0392b",
        "#bdc3c7",
        "#7f8c8d",
      ];*/
      var avatarColor = "rgba(50,150,250,0.6)"; //colors[Math.floor(Math.random() * colors.length)];

      /*根据id获取canvas
       * 如果为空，则创建新的canvas
       * */
      var canvas = document.getElementById(canvasId);

      //初始化canvas设置
      canvas.width = avatarSize;
      canvas.height = avatarSize;
      var context = canvas.getContext("2d");

      //头像背景颜色设置
      context.fillStyle = avatarColor;
      context.fillRect(0, 0, canvas.width + 10, canvas.height);

      //头像字体颜色设置
      context.fillStyle = "#FFFFFF";
      context.font = fontWeight + " " + fontSize + "px sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";
      // context.translate(6, 8);
      console.log(nickname);
      if (!nickname) {
        nickname = "null";
      }
      context.fillText(nickname.slice(-2), avatarSize / 2, avatarSize / 2);

      document.getElementById(avatarContainerId).src = canvas.toDataURL(
        "image/png"
      );
    },
    test() {
      this.$router.push("test");
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
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
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
.separated {
  width: 100%;
  height: 5px;
}
</style>
