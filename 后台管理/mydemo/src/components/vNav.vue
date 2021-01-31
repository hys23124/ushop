<template>
  <div>
    <el-col :span="12">
      <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
      
        router
      >
        <el-menu-item index="/home">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>
         
        <el-submenu v-for="item in navList" :key="item.id" :index="item.id.toString()">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item v-for="list in item.children" :key="list.id" :index="list.url">{{list.title}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>

      </el-menu>
    </el-col>
  </div>
</template>

<script>
export default {
  data() {
    return {
      defaultActive: "/home",
      navList:[]
    };
  },
  mounted() {
    this.defaultActive = this.$route.path;
    if(sessionStorage.getItem('loginInfo')){
      this.navList = JSON.parse(sessionStorage.getItem('loginInfo')).menus
    }
  },
  methods: {
    
  },
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl';

.el-header, .el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  color: #333;
  text-align: center;
  height: 100vh;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside, .el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-menu-vertical-demo {
  width: 200px;
  height: 100vh;
  background-color: $secondBgColor;
}
</style>

