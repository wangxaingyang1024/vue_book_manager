<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="block">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            id="datePicker"
          >
            >
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-table :data="loglist" border stripe>
      <el-table-column type="index" label="序号" width="70px">
      </el-table-column>
      <el-table-column prop="nickName" label="借阅人" width="120px">
      </el-table-column>
      <el-table-column prop="jobNumber" label="工号" width="120px">
      </el-table-column>
      <el-table-column prop="lendTime" label="借出时间" width="180px">
      </el-table-column>
      <el-table-column prop="bookName" label="书名" width="120px">
      </el-table-column>
      <el-table-column prop="isbn" label="编号" width="120px">
      </el-table-column>
      <el-table-column prop="returnTime" label="归还时间">
        <template slot-scope="scope">
          <p v-if="scope.row.returnTime">{{ scope.row.returnTime }}</p>
          <el-tag v-else>未归还</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-button @click="getAllLog" v-if="all === true" id="getAllLogButton"
      >加载全部</el-button
    >
    <el-button @click="getLog" v-else id="getLogButton">折叠</el-button>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      loglist: [],
      list: [],
      time: [],
      findTime: {
        startTime: "",
        endTime: "",
      },
      all: false,
    };
  },
  created() {
    this.getLog();
  },
  methods: {
    async getLog() {
      this.all = !this.all;
      if (this.list.length !== 0) {
        return (this.loglist = this.list.slice(0, 10));
      }
      const { data: res } = await this.$http.get("log/admin/newLogs");
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("获取借阅记录失败！");
      }
      this.loglist = res.data;
    },
    async getAllLog() {
      this.all = !this.all;
      if (this.list.length !== 0) {
        return (this.loglist = this.list);
      }
      const { data: res } = await this.$http.get("log/admin/allLogs");
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("获取借阅记录失败！");
      }
      this.loglist = res.data;
    },
    async getLogByTime() {
      this.all = true;
      console.log(this.findTime);
      const { data: res } = await this.$http.post(
        "log/admin/logT",
        this.findTime
      );
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("获取借阅记录失败！");
      }
      this.list = res.data;
      this.loglist = this.list.slice(0, 10);
      console.log(this.list);
    },
  },
  watch: {
    time(val) {
      if (val === null) {
        this.all = false;
        this.list = [];
        return this.getLog();
      }
      this.findTime.startTime = val[0]
        .toLocaleString("zh", { hour12: false })
        .replaceAll("/", "-")
        .replace(" 24:", " 00:");
      this.findTime.endTime = val[1]
        .toLocaleString("zh", { hour12: false })
        .replaceAll("/", "-")
        .replace(" 24:", " 00:");
      // console.log(typeof this.findTime);
      this.getLogByTime();
    },
  },
};
</script>

<style lang="less" scoped>
.el-card {
  width: 100%;
  min-height: calc(100% - 2px);
}
.el-table {
  margin-top: 15px;
}
.el-button {
  margin-top: 15px;
  width: 100%;
}
</style>
