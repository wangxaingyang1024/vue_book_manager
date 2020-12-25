<template>
  <div>
    <div v-for="item in comments" :key="item.id">
      <h5>{{ item.nickName }}</h5>
      <p>{{ item.conent }}</p>
      <p>{{ item.date }}</p>
      <hr />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      comments: [
        { id: 1, nickName: "aaa", conent: "这本书针不戳", date: "2020-12-25" },
        { id: 2, nickName: "bbb", conent: "这本书针不戳", date: "2020-12-25" },
        { id: 3, nickName: "ccc", conent: "这本书针不戳", date: "2020-12-25" },
      ],
    };
  },
};
</script>

<style lang="less" scoped></style>
