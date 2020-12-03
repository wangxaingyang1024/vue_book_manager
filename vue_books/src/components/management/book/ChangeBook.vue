<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入内容" clearable @clear="getBookList">
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getBookList"
          ></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAddBook">添加书籍</el-button>
      </el-col>
    </el-row>
    <el-table :data="userlist" border style="width: 100%" :stripe="true">
      <el-table-column type="index" label="序号" width="180"> </el-table-column>
      <el-table-column prop="name" label="图书名" width="180">
      </el-table-column>
      <el-table-column prop="author" label="作者" width="180">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="180"> </el-table-column>
      <el-table-column prop="status" label="状态" width="180">
        <template slot-scope="scope">
          {{ scope.row.status == true ? "已借出" : "可借阅" }}
        </template>
      </el-table-column>
      <el-table-column prop="isbn" label="书号" width="180"> </el-table-column>
      <el-table-column prop="synopsis" label="简介" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <!-- 删除按钮 -->
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="removeBook"
        ></el-button>
        <!-- 修改按钮 -->
        <el-button
          type="primary"
          icon="el-icon-edit"
          size="mini"
          @click="showEditDialog(scope.row.isbn)"
        ></el-button>
      </el-table-column>
    </el-table>
    <!-- 修改书籍对话框 -->
    <el-dialog
      title="修改书籍"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="书名">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="editForm.author"></el-input>
        </el-form-item>

        <!-- 类型 -->
        <el-form-item prop="type">
          <el-select
            v-model="addBook.type"
            placeholder="请选择书的类别"
            prefix-icon="el-icon-edit"
          >
            <!-- <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option> -->
            <el-option></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="简介" prop="synopsis">
          <el-input v-model="editForm.synopsis"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editBookInfo">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      booklist: [],
      //控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      //查询到的用户信息对象
      editForm: {},
      //修改书的验证规则对象
      editBookRules: {
        name: [
          {
            required: true,
            message: "请输入书名",
            trigger: "blur",
          },
          {
            min: 1,
            max: 30,
            message: "长度请小于30",
            trigger: "blur",
          },
        ],
        author: [
          {
            required: true,
            message: "请输入作者名",
            trigger: "blur",
          },
          {
            min: 1,
            max: 12,
            message: "长度请小于12",
            trigger: "blur",
          },
        ],
        type: [{ required: true, message: "请选择类别", trigger: "change" }],
        synopsis: [
          {
            required: true,
            message: "请输入书的简介",
            trigger: "blur",
          },
          {
            min: 1,
            max: 60,
            message: "长度请小于60",
            trigger: "blur",
          },
        ],
      },
      //需要被分配角色的用户信息
      userInfo: {},
      //已选中的角色Id值
      selectedRoleId: "",
    };
  },
  created() {
    this.getBookList();
    
  },
  methods: {
    //跳转添加书籍路由
    goAddBook() {
      this.$router.push("/addBook");
    },
    async getBookList() {
      const { data: res } = await this.$http.get(
        "http://localhost:8080/api/admin/login"
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取图书列表失败！");
      }
      this.booklist = res.books;
      console.log(res);
    },
    //监听修改书籍对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改书籍信息并提交
    editBookInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        //发起修改用户信息的请求
        const { data: res } = await this.$http.put(
          "http://localhost:8080/api/admin/" + this.editForm.isbn,
          {
            name: this.editForm.name,
            author: this.editForm.author,
            type: this.editForm.type,
            synopsis: this.editForm.synopsis,
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("更新书籍信息失败！");
        }

        //关闭对话框
        this.editDialogVisible = false;
        //刷新数据列表
        this.getBookList();
        //提示修改成功
        this.$message.success("更新书籍信息成功！");
      });
    },
    async removeBook(isbn) {
      //弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该书籍, 是否继续?",
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
        "http://localhost:8080/api/admin/remove/"
        // `http://localhost:8080/api/admin/remove/jobNumber/`
      );

      if (res.meta.status !== 3033) {
        return this.$message.error("删除书籍失败");
      }

      this.$message.success("删除书籍成功！");
      this.getBookList();
    },
  },
};
</script>
<style lang="less">
.el-row {
  margin-bottom: 25px;
}
</style>
<style lang="less" scoped>
</style>