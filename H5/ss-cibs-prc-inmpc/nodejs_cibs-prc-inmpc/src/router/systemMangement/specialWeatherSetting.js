/*
 * @Author: 朱涛
 * @Date: 2021-10-26 09:57:16
 * @LastEditTime: 2022-02-11 15:50:01
 * @LastEditors: zhangcheng
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\systemMangement\roleManagement.js
 */
export default [{
    path: "weatherSetting",
    name: "weatherSetting",
    component: () =>
        import("@/views/system-manage/weatherSetting.vue"),
    meta: {
        title: 'weatherSetting'
    },
    hidden: false,
}, ]