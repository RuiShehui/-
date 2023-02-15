/*
 * @Author: zhangcheng
 * @Date: 2021-12-01 11:23:59
 * @LastEditTime: 2022-11-02 11:22:19
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\customerManagement\query.js
 */

export default [{
  path: "passwordReset",
  name: "PasswordReset",
  component: () => import("@/views/customerManagement/passwordReset/index.vue"),
  meta: {
    title: "PasswordReset",
  }
  
},
];