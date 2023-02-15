/*
 * @Author: ZhangZhen
 * @Date: 2021-11-27 17:11:48
 * @LastEditTime: 2022-01-27 10:14:29
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\authorizationCenter\subjectAuthorization.js
 */
export default [
    {
        path: "subjectAuthorization",
        name: "subjectAuthorization",
        component: () => import("@/views/subjectAuthorization"),
        meta: {
            title: 'PrepearAuth'
        }
    },
    {
        path: "/authorizationCenter/subjectAuthorization/ditail",
        name: 'subjectAuthorizationDital',
        component: () => import("@/views/subjectAuthorization/subjectAuthorization-ditail.vue"),
        meta: {
            title: "PrepearAuth" // subjectAuthorizationDital
        },
        hidden: true
    },

]