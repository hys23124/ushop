<template>
  <div>
    <el-dialog
      center
      :before-close="cancel"
      :title="addInfo.isAdd ? '添加角色' : '编辑角色'"
      :visible.sync="addInfo.isShow"
    >
      <el-form :model="roleForm" :rules="rules" ref="ruleForm">
        <el-form-item
          prop="rolename"
          label="角色名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="roleForm.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" :label-width="formLabelWidth">
          <!-- 
            角色权限的树结构应该获取的是我们菜单列表的树结构列表 
            data 数据结构  展示数据
            show-checkbox 节点是否可被选择
            node-key	每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
            default-expand-all	是否默认展开所有节点
            props	配置选项，具体看下表
            -->
          <el-tree
            :data="getMenuList"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="{
              children: 'children', //树形层级
              label: 'title' //展示的内容  title指得的是菜单名称
            }"
            ref="tree"
            check-strictly
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="roleForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="addInfo.isAdd" @click="add('ruleForm')" type="primary"
          >确 定</el-button
        >
        <el-button v-else type="primary" @click="update('ruleForm')"
          >编 辑</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
//引入封装好的接口模块
import { addRole, editRole, roleInfo } from "../../util/axios";
export default {
  data() {
    return {
      roleForm: {
        rolename: "", //角色名称
        menus: "", //角色权限//菜单权限 存放的是菜单编号，用逗号隔开 '[1,2,3]'
        status: 1 //1是正常2禁用
      },
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ]
      },
      formLabelWidth: "120px"
    };
  },
  computed: {
    ...mapGetters({
      getMenuList: "menu/getMenuList"
    })
  },
  mounted() {
    //角色列表一触发就调用菜单列表
    this.getMenuListAction();

  },
  props: ["addInfo"],
  methods: {
    ...mapActions({
      getMenuListAction: "menu/getMenuListAction",
      getRoleListAction: "role/getRoleListAction"
    }),
    //封装一个取消事件
    cancel() {
      this.$emit("cancel", {
        isShow: false,
        isAdd: this.addInfo.isAdd
      });
      //调用重置事件
      this.reset();
    },
    //封装一个重置事件
    reset() {
      this.roleForm = {
        rolename: "", //角色名称
        menus: "", //角色权限//菜单权限 存放的是菜单编号，用逗号隔开 '[1,2,3]'
        status: 1 //1是正常2禁用
      };
      //重置角色权限树结构
      this.$refs.tree.setCheckedKeys([]);
    },
    //封装一个添加事件
    add(formName) {
      //this.$refs.tree.getCheckedKeys()  它取值出来的是 [1,2,3]数组格式，我们要的是 "1,2,3,"
      // console.log(this.$refs.tree.getCheckedKeys(),'通过key去获取节点');
      //添加方法执行，触发validate验证器
      this.$refs[formName].validate(valid => {
        if (valid) {
          //调取添加接口
          this.roleForm.menus = this.$refs.tree.getCheckedKeys().join(",");
          // console.log(this.roleForm, "角色表单对象");
          //调取添加接口
          //菜单权限要求的格式是菜单权限 存放的是菜单编号，用逗号隔开 '[1,2,3]' 菜单权限 存放的是菜单编号，用逗号隔开
          addRole(this.roleForm).then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框并重置
              this.cancel();
              //重新获取列表
              this.getRoleListAction();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //封装一个查询一条数据事件
    lookInfo(id) {
      //调取查询接口
      roleInfo({ id }).then(res => {
        console.log(res, "查询角色一条数据结果");
        if (res.data.code === 200) {
          this.roleForm = res.data.list;
          //把menus的返回值设置给角色权限
          this.$refs.tree.setCheckedKeys(this.roleForm.menus.split(","));
          this.roleForm.id = id;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //封装一个修改事件
    update(formName) {
      //修改方法执行，触发validate验证器
      this.$refs[formName].validate(valid => {
        if (valid) {
          //调取添加接口
          this.roleForm.menus = this.$refs.tree.getCheckedKeys().join(",");
          //调取修改接口
          editRole(this.roleForm).then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框并重置
              this.cancel();
              //重新获取列表
              this.getRoleListAction();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="" scoped></style>
