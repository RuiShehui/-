/*
 * @Author: 赵霖
 * @Date: 2021-10-25 17:45:28
 * @LastEditTime: 2022-01-20 16:51:24
 * @LastEditors: ZhangZhen
 * @Description:EPS商家维护路由配置
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\businessMangament\epsbusiness.js
 */
export default [{
		path: "epsbusiness",
		name: "epsbusiness",
		component: () => import("@/views/epsbusiness"),
		meta: {
			title: "EpsMaintain"
		}
	},
	{
		path: "epsbusiness/add",
		name: "epsbusinessAdd",
		component: () => import("@/views/epsbusiness/epsbusiness-operate"),
		meta: {
			title: "EpsMaintain" // EpsBusinessAdd
		},
		hidden: true
	},
	{
		path: "epsbusiness/edit",
		name: "epsbusinessEdit",
		component: () => import("@/views/epsbusiness/epsbusiness-operate"),
		meta: {
			title: "EpsMaintain" // EpsBusinessEdit
		},
		hidden: true
	},
	{
		path: "epsbusiness/detail",
		name: "epsbusinessDetail",
		component: () => import("@/views/epsbusiness/epsbusiness-operate"),
		meta: {
			title: "EpsMaintain", // EpsBusinessDetail
			readonly: true
		},
		hidden: true
	}
]