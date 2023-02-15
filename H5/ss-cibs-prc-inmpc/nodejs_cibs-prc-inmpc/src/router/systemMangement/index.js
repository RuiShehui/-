/*
 * @Author: 朱涛
 * @Date: 2021-10-25 17:17:25
 * @LastEditTime: 2022-01-28 14:46:29
 * @LastEditors: ZhangZhen
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\systemMangement\index.js
 */
import Layout from '@/layout'
import UserManagement from "./userManagement.js"
import Mechanism from "./mechanism.js"
// import MenuManagement from "./menuManagement.js"
import RoleManagement from "./roleManagement.js"
import SpecialWeatherSetting from "./specialWeatherSetting.js"
// import AuthorziationSettingReminder from "./authorziationSettingReminder,js"

export default {
    path: "/systemManagement",
    component: Layout,
    redirect: 'systemManagement',
    meta: {
        title: "SystemManagement",
        icon: require('@/img/menu-icon/system-management.png'),
        backIcon: require('@/img/menu-icon/system-management-back.png'),
    },
    children: [
        ...UserManagement,
        ...Mechanism,
        // ...MenuManagement,
        ...RoleManagement,
        ...SpecialWeatherSetting,
        // {
        //     path: "holidayVacations",
        //     name: "holidayVacations",
        //     component: () =>
        //         import ("@/views/holidayVacations/index.vue"),
        //     meta: {
        //         title: '节假日查询'
        //     },
        // },
    ]
}