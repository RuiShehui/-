/*
 * @Author: zhangcheng
 * @Date: 2021-11-08 10:22:58
 * @LastEditTime: 2022-01-25 17:30:48
 * @LastEditors: ZhangZhen
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\customerManagement\registerThird.js
 */
export default [{
    path: "registerThird",
    name: "RegisterThird",
    component: () => import("@/views/customerManagement/registerThird/index.vue"),
    meta: {
      title: "RegisterThirdQuery"
    },
    hidden: true
  },
  {
    path: "registerThird/add-inside-transfer",
    name: "AddLocalThirdRegister",
    component: () => import("@/views/customerManagement/registerThird/pages/inside-transfer/operate"),
    meta: {
      title: "RegisterThirdQuery", // AddLocalThirdRegister
      type: 'add'
    },
    hidden: true,
  },
  {
    path: "registerThird/edit-inside-transfer",
    name: "EditLocalThirdRegister",
    component: () => import("@/views/customerManagement/registerThird/pages/inside-transfer/operate"),
    meta: {
      title: "RegisterThirdQuery", // EditLocalThirdRegister
      type: 'edit'
    },
    hidden: true,
  },
  {
    path: "registerThird/add-fast-transfer",
    name: "AddFastTransfer",
    component: () => import("@/views/customerManagement/registerThird/pages/local-transfer/pages/trans-fast/operate"),
    meta: {
      title: "RegisterThirdQuery", // AddFastTransfer
      type: 'add'
    },
    hidden: true
  },
  {
    path: "registerThird/edit-fast-transfer",
    name: "EditFastTransfer",
    component: () => import("@/views/customerManagement/registerThird/pages/local-transfer/pages/trans-fast/operate"),
    meta: {
      title: "RegisterThirdQuery", // EditFastTransfer
      type: 'edit'
    },
    hidden: true
  },
  {
    path: "registerThird/add-local-fast",
    name: "AddLocalFast",
    component: () => import("@/views/customerManagement/registerThird/pages/local-transfer/pages/local-fast/operate"),
    meta: {
      title: "RegisterThirdQuery", // AddLocalFast
      type: 'add'
    },
    hidden: true
  },
  {
    path: "registerThird/edit-local-fast",
    name: "EditLocalFast",
    component: () => import("@/views/customerManagement/registerThird/pages/local-transfer/pages/local-fast/operate"),
    meta: {
      title: "RegisterThirdQuery", // EditLocalFast
      type: 'edit'
    },
    hidden: true
  },
  {
    path: "registerThird/add-elec-transfer",
    name: "AddElecTransfer",
    component: () => import("@/views/customerManagement/registerThird/pages/elec-transfer/operate"),
    meta: {
      title: "RegisterThirdQuery", // AddElecTransfer
      type: 'add'
    },
    hidden: true
  },
  {
    path: "registerThird/edit-elec-transfer",
    name: "EditElecTransfer",
    component: () => import("@/views/customerManagement/registerThird/pages/elec-transfer/operate"),
    meta: {
      title: "RegisterThirdQuery", // EditElecTransfer
      type: 'edit'
    },
    hidden: true
  },
];