<template>
  <el-card>
    <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"  clearable>
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddBook">添加书籍</el-button>
        </el-col>
      </el-row>
  </el-card>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    this.getBookList();
  },
  methods: {
    goAddBook(){
      this.$router.push('/addBook')
    }
  },
};
</script>

<style>
</style>