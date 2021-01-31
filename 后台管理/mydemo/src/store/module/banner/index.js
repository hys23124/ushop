//引入接口模块
import {getBannerList,getBannerCount} from '../../../util/axios'
//封装模块的所有核心属性
const state={
    bannerList:[],
    size: 2,//条数
    page: 1,// 页码 
    countNum:0 //总条数
}
/* 
 分页的思路
 后端返回 5条数据。前端规定每一页显示两条 。一共就是3页
 但凡有分页，条数和页码一定是必传项！！！

 当用户按下一页的时候，改变的是页码数

size  page      剩余 3条
2       1 
2       2         1 
2       3          0 */


const getters = {
    //管理员列表
    getBannerList(state){
        return state.bannerList
    },
    //条数，当前页面渲染个数
    // getBannerSize(state){
    //     return state.size
    // },
    // //总条数
    // getCountNum(state){
    //     return state.countNum
    // }
}

const mutations = {
    REQ_BANNERLIST(state,payload){
        state.bannerList = payload
    },
    //总条数
    // REQ_COUNT(state,payload){
    //     state.countNum = payload
    // },
    // //修改页码
    // CHANGE_PAGE(state,payload){
    //     state.page = payload
    // }

}

const actions = {
    //封装一个获取分类列表的行动
    getBannerListAction({commit}){
        getBannerList()
        .then(res=>{
            console.log(res,'分类列表');
            if(res.data.code===200){
                //提交一个mutations
                commit('REQ_BANNERLIST',res.data.list)
            }
        })
    }
}

//导出这个模块

export default {
    state,
    getters,
    mutations,
    actions,
    //命名空间
    namespaced:true
}
