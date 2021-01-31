<template>
  <div>
    <el-dialog
      center
      :before-close="cancel"
      :title="addInfo.isAdd ? '添加轮播图' : '编辑轮播图'"
      :visible.sync="addInfo.isShow"
    ><!-- :rules="rules" -->
      <el-form :model="bannerForm"  ref="ruleForm">
        <el-form-item
          prop="title"
          label="标题"
          :label-width="formLabelWidth"
        >
          <el-input v-model="bannerForm.title" autocomplete="off"></el-input>
        </el-form-item>

         <el-form-item
          label="图片"
          :label-width="formLabelWidth"
        >
          <!-- 上传视图 -->
         <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-change="onChange"
            :file-list="fileList"
            :limit="1"
            :on-exceed='handleExceed'
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 预览展示  -->

         <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>


        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="bannerForm.status"
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
import { getBannerAdd, getBannerEdit, getBannerInfo } from "../../util/axios";
export default {
  data() {
    return {
      bannerForm: {
        title:"",
        img:"",
        status: 1 //1是正常2禁用
      },
      // rules: {
      //   username: [
      //     { required: true, message: "请输入用户名称", trigger: "blur" },
      //     { min: 2, max: 15, message: "长度在 2到 15 个字符", trigger: "blur" }
      //   ],
      //   roleid: [
      //     { required: true, message: "请选择所属角色", trigger: "change" }
      //   ]
      // },
      formLabelWidth: "120px",
      dialogImageUrl: "", //预览图片地址
      dialogVisible: false, //预览的弹框默认是false
      imgUrl: "", //文件图片的配置对象
      fileList: [], //文件列表
    };
  },
  computed: {
    // ...mapGetters({
    //   getRoleList: "role/getRoleList"
    // })
  },
  mounted() {
    //用户列表一触发就调用角色列表
    // this.getRoleListAction();
  },
  props: ["addInfo"],
  methods: {
        // 文件上传的限制
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    //当文件改变时,触发的函数方法
    onChange(file) {
      console.log(file, "文件的配置属性");
      this.imgUrl = file.raw;
    },
    //预览时的删除
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    //方法预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },


    ...mapActions({
      getRoleListAction: "role/getRoleListAction",
      getBannerListAction: "banner/getBannerListAction",
      // getCountAction: "banner/getCountAction"
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
      this.bannerForm = {
        id: "", //角色编号
        title: "", //密码
        status: 1 //1是正常2禁用
      };
    },
    //封装一个添加事件
    add(formName) {
      //添加方法执行，触发validate验证器
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.bannerForm.img = this.imgUrl;
          //调取添加接口
          getBannerAdd(this.bannerForm).then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框并重置
              this.cancel();
              //重新获取列表
              this.getBannerListAction();
              //重新调取下总数（当你添加成功，分页也要跟着变化，只有总数变化之后，分页才能跟着变化）
              // this.getCountAction();
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
      getBannerInfo({ id }).then(res => {
        console.log(res, "查询用户一条数据结果");
        if (res.data.code === 200) {
          this.bannerForm = res.data.list;
          this.bannerForm.id = id;
          this.fileList = this.bannerForm.img
            ? [{ url: this.$imgUrl + this.bannerForm.img }]
            : "";
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //封装一个修改事件
    update(formName) {
      //当前密码如果修改就是重新赋值即可，如果为空就是上一次的密码
      //修改方法执行，触发validate验证器
      this.$refs[formName].validate(valid => {
        if (valid) {
          //调取修改接口
          getBannerEdit(this.bannerForm).then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框并重置
              this.cancel();
              //重新获取列表
              this.getBannerListAction();
              
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
