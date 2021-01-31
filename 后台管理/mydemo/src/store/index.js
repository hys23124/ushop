import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


//引入menu模块
import menu from './module/menu'
//引入角色模块
import  role  from  './module/role'
//引入管理员模块
import  manger from './module/manger'
//引入分类模块
import cate from './module/sort'
//引入商品规格模块
import specs from './module/specs'
//引入商品模块
import goods from './module/goods'
import banner from './module/banner'
import member from './module/member'
import seck from './module/seck'


// console.log(role,'角色模块')
export default new Vuex.Store({
    state:{
        loginInfo:sessionStorage.getItem('loginInfo')? JSON.parse(sessionStorage.getItem('loginInfo')): null  //个人信息
    },
    getters:{
        getUserInfo(state){
            return state.loginInfo
        }
    },
    mutations:{
        CHANGE_USER(state,payload){
            state.loginInfo = payload
            if(payload){
                //设置本地存储
                sessionStorage.setItem('loginInfo',JSON.stringify(payload))
            }else{
                sessionStorage.removeItem('loginInfo')
            }
        }
    },
    //actionsstate
    actions:{
        changeUserInfoAction(contxt,payload){
            contxt.commit('CHANGE_USER',payload)
        }
    },
    modules:{
        menu,
        role,
        manger,
        cate,
        specs,
        goods,
        banner,
        member,
        seck
    }
})