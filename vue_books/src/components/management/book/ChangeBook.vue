<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入内容"
          clearable
          v-model="queryInfo.name"
          prefix-icon="el-icon-search"
        >
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAddBook">添加书籍</el-button>
      </el-col>
    </el-row>
    <el-table :data="booklist" border stripe>
      <el-table-column type="index" label="序号" width="50px">
      </el-table-column>
      <el-table-column prop="name" label="图书名"> </el-table-column>
      <el-table-column prop="author" label="作者"> </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        :filters="typeList"
        :filter-method="typeFilter"
        filter-placement="bottom-end"
      >
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.status.toString() === 'true'"
            >可借阅</el-tag
          >
          <el-tag v-else>已借出</el-tag>
          <!-- {{ scope.row.status }} -->
        </template>
      </el-table-column>
      <el-table-column prop="isbn" label="书号"> </el-table-column>
      <el-table-column prop="synopsis" label="简介"> </el-table-column>
      <el-table-column label="操作">
        <!-- 修改按钮 -->
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            circle
            @click="showEditDialog(scope.row)"
            v-if="scope.row.status.toString() === 'true'"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            circle
            @click="removeBook(scope.row.isbn)"
            v-if="scope.row.status.toString() === 'true'"
          ></el-button>
          <el-tag type="info" v-else>禁止修改</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
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
        <el-form-item prop="level" label="分类">
          <el-cascader
            v-model="editForm.level"
            placeholder="请选择书的类别"
            :options="typeList"
            :props="cascaderProps"
            clearable
          ></el-cascader>
        </el-form-item>
        <!-- 简介 -->
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
      queryInfo: {
        //模糊查询
        name: "",
        //当前页数
        pageNum: 1,
        //当前每页显示多少条数据
        pageSize: 5,
      },

      //数据总条数
      total: 0,
      booklist: [],
      //控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      //查询到的用户信息对象
      editForm: {},
      //修改书的验证规则对象
      editFormRules: {
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
        level: [{ required: true, message: "请选择类别", trigger: "change" }],
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
      typeList: [],
      cascaderProps: {
        value: "mid",
        label: "name",
        children: "children",
        expandTrigger: "hover",
      },
      typeList: [],
    };
  },
  created() {
    this.getBookList();
  },
  methods: {
    //监听 pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize;
      this.queryInfo.pageNum = 1;
      this.getBookList();
    },
    //监听 页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pageNum = newPage;
      this.getBookList();
    },
    //跳转添加书籍路由
    goAddBook() {
      this.$router.push("/addBook");
    },
    async getBookList() {
      const { data: res } = await this.$http.get(
        `http://localhost:8080/api/admin/find`,
        {
          params: this.queryInfo,
        }
      );
      console.log(res.data);
      if (res.status !== 6011) {
        return this.$message.error("获取图书列表失败！");
      }
      this.booklist = res.data.list;
      let list = [];
      this.booklist.forEach((item) => {
        list.push(item.type);
      });
      list = [...new Set(list)];
      list.forEach((item) => {
        const type = { text: item, value: item };
        this.typeList.push(type);
      });
      this.total = res.data.total;
    },
    typeFilter(value, row) {
      return row.type === value;
    },
    //监听修改书籍对话框的开启事件
    showEditDialog(data) {
      this.getTypeList();
      this.editDialogVisible = true;
      this.editForm = data;
    },
    //获取书籍分类
    async getTypeList() {
      const { data: res } = await this.$http.get(
        "http://localhost:8080/api/admin/type/3"
      );
      // console.log(res.data);
      if (res.status !== 200)
        return this.$message.error("获取书籍分类列表失败！");
      this.typeList = res.data;
    },
    //监听修改书籍对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    //修改书籍信息并提交
    editBookInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        if (this.editForm.level.length !== 3) {
          this.editForm.level = [];
          return this.$message.error("书籍分类必须为三级分类！");
        }
        this.editForm.type = this.editForm.level[
          this.editForm.level.length - 1
        ];
        //发起修改用户信息的请求
        const { data: res } = await this.$http.post(
          "http://localhost:8080/api/admin/update",
          this.editForm
        );

        if (res.status !== 6004) {
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
      // console.log(typeof isbn);
      const { data: res } = await this.$http.post(
        "http://localhost:8080/api/admin/delete/" + isbn
        // `http://localhost:8080/api/admin/remove/jobNumber/`
      );
      if (res.status !== 6002) {
        return this.$message.error("删除书籍失败");
      }
      this.$message.success("删除书籍成功！");
      this.getBookList();
    },
  },
  watch: {
    "queryInfo.name"(val) {
      this.queryInfo.pageNum = 1;
      setTimeout(() => {
        this.getBookList();
      }, 500);
    },
  },
};
</script>
<style lang="less">
.el-table__column-filter-trigger i {
  font-size: 20px;
}
.el-pagination,
.el-table {
  margin-top: 25px;
}
</style>
