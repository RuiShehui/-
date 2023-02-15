/*
 * @Author: ZhangZhen
 * @Date: 2021-11-27 17:11:48
 * @LastEditTime: 2022-01-21 17:37:25
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\authorizationCenter\mySubmit.js
 */
export default [{
        path: "mySubmit",
        name: "mySubmit",
        component: () => import("@/views/mySubmit/index.vue"),
        meta: {
            title: 'MySubmit'
        }
    },
    {
        path: "/mySubmit/ditail",
        name: 'mySubmitDitail',
        component: () => import("@/views/mySubmit/mySubmit-ditail.vue"),
        meta: {
            title: "MySubmit" // mySubmitDitail
        },
        hidden: true
    },

]