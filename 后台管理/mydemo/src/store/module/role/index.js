//引入接口模块
import {getRoleList} from '../../../util/axios'
//封装模块的所有核心属性
const state={
    roleList:[]
}

const getters = {
    getRoleList(state){
        return state.roleList
    }
}

const mutations = {
    REQ_ROLELIST(state,payload){
        state.roleList = payload
    }
}

const actions = {
    //封装一个获取角色列表的行动
    getRoleListAction({commit}){
        getRoleList()
        .then(res=>{
            // console.log(res,'角色列表');
            if(res.data.code===200){
                //提交一个mutation
                commit('REQ_ROLELIST',res.data.list)
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
