/*
 * @Author: your name
 * @Date: 2022-05-24 17:50:52
 * @LastEditTime: 2022-07-12 16:20:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\router\user\index.js
 */
export default [
  // {
  //   path: '/user',
  //   name: 'User',
  //   component: () => import('@/views/user/retrieveUsername/retrieveUsername'),
  //   meta: {
  //     title: '用户'
  //   },
  //   children: []
  // },
  /* 修改密码 */
  {
    path: '/user/resetPassword',
    name: 'ResetPassword',
    component: () => import('@/views/user/forgotPassword/forgotPassword'),
    meta: {
      title: '修改密码'
    }
  },
  /* 我的用户名 */
  {
    path: '/user/myUserName',
    name: 'myUserName',
    component: () => import('@/views/user/retrieveUsername/retrieveUsername'),
    meta: {
      title: '我的用户名'
    }
  },
  /* 流动保安认证 */
  {
    path: '/user/safe',
    name: 'safe',
    component: () => import('@/views/user/safe'),
    meta: {
      title: '流动保安认证'
    },
    children:[
      // {
      //   path:'/user/safe',
      //   component:()=>import('@/views/user/safe/checkSoftToken.vue'),
      //   meta:{
      //     title:'校验账户是否开通流动保安认证'
      //   }
      // },
      {
        path:'/user/safe/setSfotToken',
        component:()=>import('@/views/user/safe/checkSoftToken.vue'),
        meta:{
          title:'设置流动保安'
        }
      },
      {
        path:'/user/safe/erweima',
        component:()=>import('@/views/user/safe/setSoftToken.vue'),
        meta:{
          title:'设置流动保安'
        }
      },
      {
        path:'/user/safe/softTokenMode',
        component:()=>import(`@/views/user/safe/SoftTokenMode.vue`),
        meta:{
          title:'查看流动保安'
        }
      },
      {
        path:'/user/safe/softTokenResult',
        component:()=>import(`@/views/user/safe/result.vue`),
        meta:{
          title:'终止服务'
        }
      }
    ]
  }
];