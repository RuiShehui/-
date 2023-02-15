/*
 * @Author: ZhangZhen
 * @Date: 2021-11-27 17:11:48
 * @LastEditTime: 2021-12-24 10:20:31
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \workplace\nodejs_cibs-prc-inmpc\src\router\authorizationCenter\index.js
 */
import Layout from '@/layout'
import SubjectAuthorization from "./subjectAuthorization.js"
import MySubmit from "./mySubmit.js"


export default 
    {
        path: "/authorizationCenter",
        component: Layout,
        redirect: 'AuthorizationCenter',
        meta: {
            title: "AuthCenter",
            icon: require('@/img/menu-icon/authorization-center.png'),
            backIcon: require('@/img/menu-icon/authorization-center-back.png')
        },
        children: [
          ...SubjectAuthorization,
          ...MySubmit
        ]
    }
