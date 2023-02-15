/*
 * @Author: 赵霖
 * @Date: 2021-10-25 20:01:57
 * @LastEditTime: 2021-12-04 15:13:00
 * @LastEditors: ZhangZhen
 * @Description: 批量交易异常处理路由配置
 * @FilePath: \workplace\src\router\businessMangament\exception.js
 */
export default [
    {
        path: "exception",
        name: "Exception",
        component: () => import("@/views/exception/index.vue"),
        meta: {
            title: "Exception"
        }
    }
]