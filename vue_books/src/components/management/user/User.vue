<template>
  <el-card class="box-card">
    <el-table :data="userlist" border style="width: 100%" :stripe="true">
      <el-table-column type="index" label="序号" width="180"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="180">
      </el-table-column>
      <el-table-column prop="jobNumber" label="工号" width="180">
      </el-table-column>
      <el-table-column prop="nickName" label="昵称" width="180">
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="180">
        <template slot-scope="scope">
          {{ scope.row.gender == 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="180"> </el-table-column>
      <el-table-column prop="age" label="年龄" width="180"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUser(scope.row.jobNumber)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      userlist: [],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get(
        "http://localhost:8080/api/admin/emps"
      );
      if (res.status !== 900) {
        return this.$message.error("获取用户列表失败！");
      }
      this.userlist = res.data;
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
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.post(
        "http://localhost:8080/api/admin/remove/" + jobNumber
        // `http://localhost:8080/api/admin/remove/jobNumber/`
      );

      if (res.meta.status !== 3033) {
        return this.$message.error("删除用户失败");
      }

      this.$message.success("删除用户成功！");
      this.getUserList();
    },
  },
};
</script>


<style lang="less" scoped>
</style>