/*
 * @Author: 赵霖
 * @Date: 2021-10-25 16:47:08
 * @LastEditTime: 2022-01-20 16:03:10
 * @LastEditors: ZhangZhen
 * @Description: 银行收费折扣路由配置
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\businessMangament\discount.js
 */
export default [{
    path: "discount",
    name: "discount",
    component: () => import("@/views/discount/index.vue"),
    meta: {
      title: "BankDiscount"
    }
  },
  {
    path: "discount/add",
    name: "discountAdd",
    component: () => import("@/views/discount/discount-operate.vue"),
    meta: {
      title: "BankDiscount", // DiscountAdd
      type: 'add'
    },
    hidden: true
  },
  {
    path: "discount/edit",
    name: "discountEdit",
    component: () => import('@/views/discount/discount-operate.vue'),
    meta: {
      title: "BankDiscount", // discountEdit
      type: 'edit'
    },
    hidden: true
  },
  {
    path: "discount/detail",
    name: "discountDetail",
    component: () => import("@/views/discount/discount-ditail.vue"),
    meta: {
      title: "BankDiscount" // DiscountDetail
    },
    hidden: true
  },
];