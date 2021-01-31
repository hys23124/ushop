<template>
  <div class="login">
    <el-form :model="loginlist" label-width="100px" :rules="rules" ref="ruleForm">
      <el-form-item label="用户名" prop='username'>
        <el-input clearable v-model="loginlist.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop='password'>
        <el-input clearable show-password v-model="loginlist.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click='login("ruleForm")'>登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
//引入封装好的接口模块
import {userLogin} from '../util/axios'
export default {
  data() {
    return {
      loginlist: {
        username: "",
        password: "",
      },
      rules:{
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 15, message: '长度在 2 到 15 个字符', trigger: 'blur' }
          ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
          ],
      }
    };
  },
  methods: {
    //封装一个登录事件
    login(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //正常调取登录接口
            userLogin(this.loginlist)
            .then(res=>{
              if(res.data.code===200){
                this.$message.success(res.data.msg)
                //跳转到首页
                //跳转前把登录信息存储到sessionStorage中
                sessionStorage.setItem('loginInfo',JSON.stringify(res.data.list))
                // console.log(JSON.parse(sessionStorage.getItem('loginInfo')).menus,"看一下");
                this.$router.push('/home')
              }else{
                this.$message.error(res.data.msg)
              }
              // console.log(res);
            })
            console.log(this.loginlist,'表单对象');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
  },
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl';
.login
    width 100vw
    height 100vh
    background $thirdBgColor
    .el-form
        position absolute
        left 50%
        top 50%
        margin -150px 0 0 -200px
        width 400px
        height 250px
</style>
