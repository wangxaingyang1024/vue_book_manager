<template>
  <el-card class="box-card">
    <el-row :gutter="20">
      <el-col :span="8">
        <!-- <el-input placeholder="请输入内容" clearable @clear="getBookList">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getBookList"
          ></el-button>
        </el-input> -->
        <div class="block">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
            >
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-table :data="loglist" border style="width: 100%" :stripe="true">
      <el-table-column type="index" label="序号" width="180"> </el-table-column>
      <el-table-column prop="nickName" label="借阅人" width="180">
      </el-table-column>
      <el-table-column prop="jobNumber" label="工号" width="180">
      </el-table-column>
      <el-table-column prop="lendTime" label="借出时间" width="180">
      </el-table-column>
      <el-table-column prop="bookName" label="书名" width="180">
      </el-table-column>
      <el-table-column prop="isbn" label="编号" width="180"> </el-table-column>
      <el-table-column prop="returnTime" label="归还时间" width="180">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      //TODO  通过时间选择器返回起始时间与结束时间
      //   pickerOptions: {
      //     shortcuts: [
      //       {
      //         onClick(picker) {
      //           const end = new Date();
      //           const start = new Date();
      //           start.setTime(start.getTime());
      //           picker.$emit("pick", [start, end]);
      //         },
      //       },
      //     ],
      //   },
      //   time: [new Date(), new Date()],
      loglist: [],
      time: "",
      startTime: "",
      endTime: "",
    };
  },
  created() {
    this.getLog();
  },
  methods: {
    async getLog() {
      const { data: res } = await this.$http.get(
        "http://localhost:8080/api/log/admin/newLogs"
      );
      if (res.status !== 200) {
        return this.$message.error("获取借阅记录失败！");
      }
      this.loglist = res.data;
    },
  },
  watch: {
    time(val) {
      this.startTime = val[0]
        .toLocaleString("zh", { hour12: false })
        .replaceAll("/", "-");
      this.endTime = val[1]
        .toLocaleString("zh", { hour12: false })
        .replaceAll("/", "-");
      this.getLog();
    },
  },
};
</script>

<style lang="less" scoped></style>
