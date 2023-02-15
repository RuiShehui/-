/*
 * @Author: your name
 * @Date: 2022-10-25 15:26:54
 * @LastEditTime: 2022-10-25 15:32:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\router\specialIntruction\index.js
 */
export default [
  {
    path: "/specialInstruction/applicationSpecial",
    name: "applicationSpecial",
    component: () =>
        import ("@/views/specialInstruction/index.vue"),
    meta: {
        title: "特殊指令递交申请",
    },
  }
]