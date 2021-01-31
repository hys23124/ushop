import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const indexRoutes=[
  {
    path:"/role",
    component:()=>import ('@/views/role/role'),
    name:"角色管理"
  },
  {
    path:"/menu",
    component:()=>import ('@/views/menu/menu'),
    name:"菜单管理"
  },
  {
    path:"/manger",
    component:()=>import ('@/views/manger/manger'),
    name:"管理员管理"
  },
  {
    path:"/sort",
    component:()=>import ('@/views/sort/sort'),
    name:"商品分类"
  },
  {
    path:"/goods",
    component:()=>import ('@/views/goods/goods'),
    name:"商品管理"
  },
  {
    path:"/banner",
    component:()=>import ('@/views/banner/banner'),
    name:"轮播图管理"
  },
  {
    path:"/specs",
    component:()=>import ('@/views/specs/specs'),
    name:"商品规格"
  },
  {
    path:"/seck",
    component:()=>import ('@/views/seck/seck'),
    name:"秒杀管理"
  },
  {
    path:"/member",
    component:()=>import ('@/views/member/member'),
    name:"会员管理"
  }
];

const router = new Router({
  routes: [
    {
      path:"/login",
      component:()=>import ('@/pages/login')
    },
    {
      path:"/index",
      component:()=>import ('@/pages/index'),
      children:[
        {
          path:"/home",
          component:()=>import ('@/views/home'),
          name:"首页"
        },
        ...indexRoutes,
        {
          path:"",
          redirect:'/home'
        }
      ]
    },
    {
      path:"*",
      redirect:"/login"
    }
  ]
})

//全局导航守卫之登录拦截
router.beforeEach((to,from,next)=>{
  //登录拦截的三个逻辑
  //有登录状态就next,,没有就跳转回登录页面
  
  if(to.path==='/login'){
    next()
    return
  }
  if(sessionStorage.getItem('loginInfo')){
    next()
    return
  }else{
    next('/login')
  }
})

export default router
