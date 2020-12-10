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
          >
            >
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-table :data="loglist" border stripe>
      <el-table-column type="index" label="序号" width="50px">
      </el-table-column>
      <el-table-column prop="nickName" label="借阅人"> </el-table-column>
      <el-table-column prop="jobNumber" label="工号"> </el-table-column>
      <el-table-column prop="lendTime" label="借出时间"> </el-table-column>
      <el-table-column prop="bookName" label="书名"> </el-table-column>
      <el-table-column prop="isbn" label="编号"> </el-table-column>
      <el-table-column prop="returnTime" label="归还时间">
        <template slot-scope="scope">
          <p v-if="scope.row.returnTime">{{ scope.row.returnTime }}</p>
          <el-tag v-else>未归还</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      //获取用户列表的参数对象
      queryInfo: {
        startTime: "",
        endTime: "",
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 2,
      },
      total: 0,
      loglist: [],
      time: [],
    };
  },
  created() {
    this.getLog();
  },
  methods: {
    //监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.queryInfo.pagenum = 1;
      this.getLog();
    },
    //监听 页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getLog();
    },
    async getLog() {
      const { data: res } = await this.$http.get(
        "http://localhost:8080/api/log/admin/newLogs",
        {
          params: this.queryInfo,
        }
      );
      console.log(res.data);
      if (res.status !== 200) {
        return this.$message.error("获取借阅记录失败！");
      }
      this.loglist = res.data.list;
      this.total = res.data.total;
    },
  },
  watch: {
    time(val) {
      this.queryInfo.pageNum = 1;
      if (val === null) {
        return this.getLog();
      }
      this.queryInfo.startTime = val[0]
        .toLocaleString("zh", { hour12: false })
        .replaceAll("/", "-")
        .replace(" 24:", " 00:");
      this.queryInfo.endTime = val[1]
        .toLocaleString("zh", { hour12: false })
        .replaceAll("/", "-")
        .replace(" 24:", " 00:");
      this.getLogByTime();
    },
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
</style>
