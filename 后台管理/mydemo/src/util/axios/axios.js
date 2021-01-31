import axios from 'axios'
// 引入路由配置
import router from '../../router'

let http = axios.create({
    baseURL:"/api"//axiox中localhost3001转化成的/api
})

//axios拦截器
//请求拦截
http.interceptors.request.use(req=>{
    console.log(req,'请求拦截');
    // 从存储中取出token
    let token = sessionStorage.getItem("loginInfo") ? JSON.parse(sessionStorage.getItem("loginInfo")).token : ''
    // 需求:在请求头中添加token令牌
    req.headers.authorization = token
    // 设置请求拦截之后,要返回值这个配置
    return req
})

//响应拦截  一般用于全局拦截错误
http.interceptors.response.use(res=>{
    // console.log(res,"111");
    if(res.data.code===500){
        alert(res.data.msg)
        router.push('/login')
    }else if(res.data.code ===403){
        //token验证过期,重新登录
        alert(res.data.msg)
        router.push('/login')
    }else{
        // 针对返回内容进行拆分
        // return res.data
        return res
    }
})

export default http