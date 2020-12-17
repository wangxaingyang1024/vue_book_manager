<template>
  <div>
    <van-card>
      <template #thumb>
        <div class="img">
          <span>{{imgNickName}}</span>
        </div>
      </template>
      <template #title>
        <p>{{nickName}}</p>
      </template>
      <template #desc>
        用户名:<p class="desc">{{jobNumber}}</p>
      </template>
    </van-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nickName: window.sessionStorage.getItem("nickName"),
      jobNumber: window.sessionStorage.getItem("jobNumber"),
      img:''
    };
  },
  created(){
     
  }
};
</script>

<style lang="less" scoped>
p{
  margin-top: 8px;
  font-size: 25px;
}
.desc{
  display: inline;
  font-size: 12px;
}
.img{
  width: 75px;
  height: 75px;
  background-color: #3296fa;
}
</style>