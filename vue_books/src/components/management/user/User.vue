<template>
  <el-card class="box-card">
    <el-table :data="userlist" border stripe>
      <el-table-column type="index" label="序号" width="50px">
      </el-table-column>
      <el-table-column prop="username" label="用户名"> </el-table-column>
      <el-table-column prop="jobNumber" label="工号"> </el-table-column>
      <el-table-column prop="nickName" label="昵称"> </el-table-column>
      <el-table-column prop="gender" label="性别">
        <template slot-scope="scope">
          {{ scope.row.gender == 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话"> </el-table-column>
      <el-table-column prop="birth" label="年龄">
        <template slot-scope="scope">
          {{
            scope.row.birth === null
              ? 0
              : new Date().getFullYear() - scope.row.birth.slice(0, 4)
          }}岁
          <!-- {{ new Date().getFullYear() - scope.row.birth.slice(0, 4) + "岁" }} -->
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUser(scope.row.jobNumber)"
            id="removeUserButton"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[5, 10, , 15, 20]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      id="pagination"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        //当前页数
        pageNum: 1,
        //当前每页显示多少条数据
        pageSize: 5,
      },
      total: 0,
      userlist: [],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.queryInfo.pageNum = 1;
      this.getUserList();
    },
    //监听 页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getUserList();
    },
    async getUserList() {
      const { data: res } = await this.$http.get(
        `admin/emps/${this.queryInfo.pageNum}/${this.queryInfo.pageSize}`
      );
      if (res.status === 3023) {
        return (this.userlist = []);
      }
      if (res.status !== 200) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userlist = res.data.list;
      this.total = res.data.total;
    },
    async removeUser(jobNumber) {
      //弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果用户确认删除,则返回值为字符串confirm
      //如果用户取消删除，则返回值为字符串cancel
      if (confirmResult !== "confirm") {
        return;
      }

      const { data: res } = await this.$http.post(
        "admin/remove/" + jobNumber
        // `admin/remove/jobNumber/`
      );

      if (res.status !== 3033) {
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功！");
      this.getUserList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
.el-card {
  width: 100%;
  min-height: calc(100% - 2px);
}
</style>
