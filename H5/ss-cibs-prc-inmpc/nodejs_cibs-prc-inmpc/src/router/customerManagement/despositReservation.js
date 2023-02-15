/*
 * @Author: zhangcheng
 * @Date: 2021-11-08 10:20:53
 * @LastEditTime: 2022-01-25 11:26:01
 * @LastEditors: ZhangZhen
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\customerManagement\despositReservation.js
 */
export default [{
    path: "despostiReservation",
    name: "DespostiReservation",
    component: () => import("@/views/customerManagement/despostiReservation"),
    meta: {
      title: "DespostiReservation" // 定期存款预约编号信息生成
    },
    hidden: true
  },
  {
    path: "despostiReservation/confirm",
    name: "DespostiReservationConfirm",
    component: () => import("@/views/customerManagement/despostiReservation/confirm"),
    meta: {
      title: "DespostiReservationConfirm"
    },
    hidden: true
  }
]