<template>
  <div>
    <el-dialog
      center
      :before-close="cancel"
      :title="addInfo.isAdd ? '添加商品' : '编辑商品'"
      :visible.sync="addInfo.isShow"
      @opened.once="createEditor"
      >
      <el-form :model="goodsForm" :rules="rules" ref="ruleForm">
        <el-form-item
          label="一级分类："
          prop="first_cateid"
          :label-width="formLabelWidth"
        >
          <el-select
            @change="changeCate"
            v-model="goodsForm.first_cateid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in getCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="二级分类："
          prop="second_cateid"
          :label-width="formLabelWidth"
        >
          <el-select
            v-model="goodsForm.second_cateid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in secondCate"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="goodsname"
          label="商品名称"
          :label-width="formLabelWidth"
        >
          <el-input v-model="goodsForm.goodsname" autocomplete="off"></el-input>
        </el-form-item>



        <el-form-item
          prop="price"
          label="价格"
          :label-width="formLabelWidth"
        >
          <el-input v-model="goodsForm.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          prop="market_price"
          label="市场价格"
          :label-width="formLabelWidth"
        >
          <el-input v-model="goodsForm.market_price" autocomplete="off"></el-input>
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




        <el-form-item
          label="商品规格"
          prop="specsid"
          :label-width="formLabelWidth"
        >
          <el-select
            @change="changeSpecs"
            v-model="goodsForm.specsid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in getSpecsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="规格属性"
          prop="specsattr"
          :label-width="formLabelWidth"
        >
          <el-select
            multiple
            
            v-model="goodsForm.specsattr"
            placeholder="请选择"
          >
            <el-option
              v-for="item in specsArr"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

       

         <el-form-item label="是否新品" :label-width="formLabelWidth">
          <el-radio v-model="goodsForm.isnew" :label="1">是</el-radio>
          <el-radio v-model="goodsForm.isnew" :label="2">否</el-radio>
        </el-form-item>

         <el-form-item label="是否热卖" :label-width="formLabelWidth">
           <el-radio v-model="goodsForm.ishot" :label="1">是</el-radio>
          <el-radio v-model="goodsForm.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch
            v-model="goodsForm.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="2"
          >
          </el-switch>
        </el-form-item>

         <el-form-item label="商品描述" :label-width="formLabelWidth">
          <div id="editor"></div>
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
import E from "wangeditor";
import { mapGetters, mapActions } from "vuex";
//引入封装好的接口模块
import { getGoodsAdd, getGoodsEdit, getGoodsInfo } from "../../util/axios";
export default {
  data() {
    return {
      goodsForm: {
        goodsname: "", //商品名称
        first_cateid: "", // 一级编号
        second_cateid: "", // 二级编号
        price: 0, //价格
        market_price: 0, //市场价格
        img: "", // 图片
        description: "", //商品描述
        specsid: "", //商品规格编号
        specsattr: [], //商品规格属性
        isnew: 1, //是否新品
        ishot: 1, // 是否热卖
        status: 1, //1是正常2禁用
      },
      rules: {
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 15, message: "长度在 2到 15 个字符", trigger: "blur" }
        ],
      },
      formLabelWidth: "120px",
      secondCate: [], //二级分类数组列表
      specsArr: [],
      editor: "", // 编辑构造函数
      dialogImageUrl: "", //预览图片地址
      dialogVisible: false, //预览的弹框默认是false
      imgUrl: "", //文件图片的配置对象
      fileList: [], //文件列表
    };
  },
  computed: {
    ...mapGetters({
      getCateList: "cate/getCateList", //分类列表
      getSpecsList: "specs/getSpecsList", //规格列表
    }),
  },
  mounted() {
    //商品列表一触发就调用分类列表
    this.getCateListAction();
    //商品列表一触发就调用规格列表
    this.getSpecsListAction();
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

    //封装一个创建编辑事件
    createEditor() {
      //实例化编辑器的构造函数
      this.editor = new E("#editor");
      // 初始化创建
      this.editor.create();
      //清空多次实例化创建
      // this.editor = this.editor.txt.html(this.goodsForm.description)
      this.editor.txt.html(this.goodsForm.description);
    },
    //封装一个一级分类切换事件
    changeCate() {
      console.log(this.goodsForm.first_cateid, "一级分类id");
      // let index = this.getCateList.findIndex((item)=>{
      //   console.log(item,"sada");
      //   return this.goodsForm.first_cateid == item.id
      // })
      let index = this.getCateList.findIndex(
        (item) => this.goodsForm.first_cateid == item.id
      );
      this.secondCate = this.getCateList[index].children;
      console.log(this.secondCate, "二级分类数据");
    },
    //封装一个规格属性切换事件
    changeSpecs() {
      console.log(this.goodsForm.specsid, "商品规格编号");
      let index = this.getSpecsList.findIndex(
        (item) => this.goodsForm.specsid == item.id
      );
      this.specsArr = this.getSpecsList[index].attrs;
      this.goodsForm.specsattr = "";
    },
    ...mapActions({
      getCateListAction: "cate/getCateListAction",
      getSpecsListAction: "specs/getSpecsListAction",
      getGoodsListAction: "goods/getGoodsListAction",
      getCountAction: "goods/getCountAction",
    }),
    //封装一个取消事件
    cancel() {
      this.$emit("cancel", {
        isShow: false,
        isAdd: this.addInfo.isAdd,
      });
      //调用重置事件
      this.reset();
    },
    //封装一个重置事件
    reset() {
      this.goodsForm= {
        goodsname: "", //商品名称
        first_cateid: "", // 一级编号
        second_cateid: "", // 二级编号
        price: 0, //价格
        market_price: 0, //市场价格
        img: "", // 图片
        description: "", //商品描述
        specsid: "", //商品规格编号
        specsattr: [], //商品规格属性
        isnew: 1, //是否新品
        ishot: 1, // 是否热卖
        status: 1, //1是正常2禁用
      };
      if(this.editor.txt){
        this.editor.txt.clear();
      }
    },
    //封装一个添加事件
    add(formName) {
      // console.log(this.goodsForm, "提交的表单体");
      //添加方法执行，触发validate验证器
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //调取添加接口
          this.goodsForm.description = this.editor.txt.html();
          this.goodsForm.specsattr = this.goodsForm.specsattr ? this.goodsForm.specsattr.join(",") : "";
          this.goodsForm.img = this.imgUrl;
          getGoodsAdd(this.goodsForm).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框并重置
              this.cancel();
              //重新获取列表
              this.getGoodsListAction();
              //重新调取下总数（当你添加成功，分页也要跟着变化，只有总数变化之后，分页才能跟着变化）
              this.getCountAction();
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
      // console.log(id,"zzzzid");
      //调取查询接口
      getGoodsInfo({ id })
      .then((res) => {
        // console.log(res, "查询商品一条数据结果");
        if (res.data.code === 200) {
          this.goodsForm = res.data.list;
          this.goodsForm.id = id;
          this.fileList = this.goodsForm.img ? [{ url: this.$imgUrl + this.goodsForm.img }] : [];
          // this.goodsForm.specsattr = this.goodsForm.specsattr ? this.goodsForm.specsattr.join(",") : "";
          
           this.goodsForm.specsattr = this.goodsForm.specsattr.split(',')
          
          if(this.editor.txt){
            this.editor.txt.html(this.goodsForm.description)
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //封装一个修改事件
    update(formName) {
      //当前密码如果修改就是重新赋值即可，如果为空就是上一次的密码
      //修改方法执行，触发validate验证器
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.goodsForm.img = this.imgUrl ? this.imgUrl : this.goodsForm.img;
          this.goodsForm.description = this.editor.txt.html();
          this.goodsForm.specsattr = this.goodsForm.specsattr ? this.goodsForm.specsattr.join(",") : "";
          //调取修改接口
          getGoodsEdit(this.goodsForm).then((res) => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框并重置
              this.cancel();
              //重新获取列表
              this.getGoodsListAction();
              //重新调取下总数（当你添加成功，分页也要跟着变化，只有总数变化之后，分页才能跟着变化）
              this.getCountAction();
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
  },
};
</script>

<style lang="" scoped></style>
