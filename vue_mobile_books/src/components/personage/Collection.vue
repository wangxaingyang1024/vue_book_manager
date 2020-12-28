<template>
  <div>
    <!-- 顶部导航区域 -->
    <van-nav-bar title="爱看书籍">
      <template #left>
        <van-icon name="arrow-left" @click="onClickLeft" />
      </template>
    </van-nav-bar>
    <!-- 书籍列表 -->
    <div style="height: calc(100vh - 150px); overflow: auto">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getLikeList"
      >
        <!-- 书籍 -->
        <van-cell v-for="(item, index) in likelist" :key="index">
          <template #title>
            <span>《{{ item.name }}》</span>
          </template>
          <template #right-icon>
            <van-button type="primary" size="mini" @click="inCollection(item.isbn)"
              >取消收藏</van-button
            >
          </template>
        </van-cell>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getLikeList();
  },
  data() {
    return {
      loading: false,
      finished: true,
      //爱看列表
      likelist: [
        { name: "asdasdas", isbn: 12345566 },
        { name: "aasdassdas", isbn: 12362266 },
      ],
    };
  },
  methods: {
    onClickLeft() {
      this.$router.push("person");
    },
    getLikeList() {},
    inCollection() {},
  },
};
</script>

<style></style>
