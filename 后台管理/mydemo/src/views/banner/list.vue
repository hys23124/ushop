<template>
  <div>
    <el-table :data="getBannerList" border style="width: 100%">
      <el-table-column prop="id" label="编号" width="180">
      </el-table-column>
      <el-table-column prop="title" label="轮播图标题" width="180">
      </el-table-column>
      
       <el-table-column label="图片">
        <template slot-scope="item">
          <div v-if="item.row.id == 0">
            <img src="" alt="">
          </div>
          <div v-else>
            <img class="img" :src="item.row.img?$imgUrl+item.row.img:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2090981361,2770470095&fm=15&gp=0.jpg'" alt="">
          </div>
        </template>
      </el-table-column>



      <el-table-column label="状态">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
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
import {mapGetters,mapActions} from "vuex";
//引入封装好的接口模块
import { getBannerDelete } from "../../util/axios";
export default {
  data() {
    return {};
  },
  mounted() {
    //组件一加载触发这个获取用户列表的行动
    this.getBannerListAction();
    //触发总条数行动
    // this.getCountAction()
  },
  computed: {
    //store模块添加了命名空间，所以要修改名字
    ...mapGetters({
      getBannerList: "banner/getBannerList",
      // getBannerSize:'banner/getBannerSize',
      // getCountNum:'manger/getCountNum'
    })
  },
  methods: {
    ...mapActions({
      getBannerListAction: "banner/getBannerListAction",
      // getCountAction:'banner/getCountAction',
      // changePageAction:'banner/changePageAction'
    }),
    //切换页码触发的事件
    // changePage(n){
    //   console.log(n,'当前页码数');
    //   this.changePageAction(n)
    // },
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
          getBannerDelete({
            id
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              //删除之后要重新调取列表
              this.getBannerListAction();
              //重新调取总条数
              // this.getCountAction()
            } else {
              this.$message.error(res.data.msg);
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

<style lang="" scoped>
.img{
  width: 120px;
  height: 120px;
}
</style>
