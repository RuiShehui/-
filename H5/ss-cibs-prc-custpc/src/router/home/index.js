/*
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:43
 * @LastEditTime: 2022-06-09 11:16:59
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\router\home\index.js
 */
export default [{
  //账户总览
  path: "/home",
  name: "Home",
  redirect: '/home/homePage',
  component: () => import(`@/views/home/index.vue`),
  meta: {
    title: "首页"
  },
  children: [{
      path: "homePage",
      name: "homePage",
      component: () => import(`@/views/home/homePage.vue`),
      redirect: '/home/homePage',
      children: [
        // 默认显示
        {
          path: "",
          name: "HomeMain",
          component: () => import(`@/components/home/HomeMain.vue`)
        },
      ]
    },
    {
      path: "/homePage/tips",
      name: "tips",
      component: () => import(`@/views/home/messageTips.vue`)
    },
    {
      path: "/homePage/notice",
      name: "notice",
      component: () => import(`@/views/home/notice.vue`)
    }
  ]
}]