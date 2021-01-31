<template>
  <div>
    <el-table :data="getRoleList" border style="width: 100%">
      <el-table-column prop="id" label="角色编号" width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="角色名称" width="180">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status==1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="primary" @click="edit(item.row.id)" size="small"
              >编辑</el-button
            >
            <el-button type="danger" @click="del(item.row.id)" size="small"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
//引入封装好的接口模块
import { deleteRole } from "../../util/axios";
export default {
  data() {
    return {};
  },
  mounted() {
    //组件一加载触发这个获取角色列表的行动
    this.getRoleListAction();
  },
  computed: {
    //store模块添加了命名空间，所以要修改名字
    ...mapGetters({
      getRoleList: "role/getRoleList"
    })
  },
  methods: {
    ...mapActions({
      getRoleListAction: "role/getRoleListAction"
    }),
    //封装编辑事件，传递id给role这个父组件
    edit(id) {
      this.$emit("edit", id);
    },
    //封装一个删除事件
    del(id) {
      this.$confirm("你确定要删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //调取删除接口
          deleteRole({
            id
          }).then(res => {
            if(res.data.code===200){
              this.$message.success(res.data.msg)
              //删除之后要重新调取列表
              this.getRoleListAction()
            }else{
              this.$message.error(res.data.msg)
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style lang="" scoped></style>
