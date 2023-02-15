/*
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:43
 * @LastEditTime: 2022-09-19 09:59:15
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\router\investementFinacing\index.js
 */
// console.log(Bus,'Bus')
// import {
//   judgeDepositAccount
// } from "@/api/openFixed.js"

export default [
  {
    path: "/investmentFinancing/fixedDeposit",
    component: () => import(`@/views/investementFinacing/fixedDeposit/index`),
    meta: {
      title: "定期存款概览"
    }
  },
  {
    path: "/investmentFinancing/fixedDeposit/details",
    component: () => import(`@/views/investementFinacing/fixedDeposit/components/details`),
    name:'depositDetails',
    meta: {
      title: "定期存款概览"
    }
  },
  {
    path: "/investmentFinancing/fixedDeposit/details/beforeDetails",
    component: () => import(`@/views/investementFinacing/fixedDeposit/components/before/beforeDetails.vue`),
    name: "beforeDetails",
    meta: {
      title: "未到期详情"
    }
  },
  // {
  //   path: "/investmentFinancing/fixedDeposit/details/expiredDetails",
  //   component: () => import(`@/views/investementFinacing/fixedDeposit/components/expired/expiredDetails.vue`),
  //   name: "expiredDetails",
  //   meta: {
  //     title: "已到期详情"
  //   }
  // },
  {
    path: "/investmentFinancing/openFixed",
    component: () => import(`@/views/investementFinacing/openFixed/index.vue`),
    meta: {
      title: "开立定期存款"
    },
    // beforeEnter: (to, from, next) => {
    //   if (to.path == "/investmentFinancing/openFixed") {
    //     judgeDepositAccount().then(res => {
    //       if (res == false) {
    //         Bus.$confirm({
    //           isIcon: true,
    //           type: 'warn',
    //           message: '您还未持有我行定期存款账户，请先前往分行开立定期存款账户',
    //           btnText: {
    //             cancleText: '取消',
    //             confirmText: '确定'
    //           }
    //         }).then((res) => {
    //           // console.log(res,'res')
    //           next({
    //             path: '/investmentFinancing/openFixed'
    //           })
    //         })
    //       }
    //     })
    //   }
    // }
  },
  {
    path: "/investmentFinancing/changeDueTip",
    component: () => import(`@/views/investementFinacing/changeDueTip/index.vue`),
    name:'changeDueTip',
    meta: {
      title: "更改到期提示"
    }
  },
  {
    path: "/investmentFinancing/changeDueTip/formInfo",
    component: () => import(`@/views/investementFinacing/changeDueTip/components/index.vue`),
    name:'changeDueTipInforMation',
    meta: {
      title: "更改到期提示填写信息"
    }
  }]