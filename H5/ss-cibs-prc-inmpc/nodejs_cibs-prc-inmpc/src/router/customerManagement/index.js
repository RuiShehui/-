/*
 * @Author: zhangcheng
 * @Date: 2021-10-26 15:47:27
 * @LastEditTime: 2022-11-02 11:30:10
 * @LastEditors: Please set LastEditors
 * @Description: 用户维护路由
 * @FilePath: \workplace\nodejs_cibs-prc-inmpc\src\router\customerManagement\index.js
 */
import Layout from '@/layout'
import CustomerInfoMaintain from './customerInfoMaintain'
import customerAccountOpen from './customerAccountOpen'
import UserMaintain from './userMaintain'
import CustomerInfoView from './customerInfoView'
import AuthTemplateMaintain from './authTemplateMaintain'
import DespositReservation from './despositReservation'
import BillMainrenace from './billMainrenace'
import RegisterThird from './registerThird'
import TrsAuSettings from "./trsAuSettings.js"
import PasswordReset from "./passwordReset.js"
import Query from "./query.js"
import specialInstruaction from "./specialInstruaction"
export default {
	path: "/customerManagement",
	component: Layout,
	redirect: 'customerManagement',
	meta: {
		title: "CustomerManagement",
		icon: require('@/img/menu-icon/customer-managenent.png'),
		backIcon: require('@/img/menu-icon/customer-managenent-back.png'),
	},
	children: [
		...customerAccountOpen,
		{
			path: "customerAccountDel",
			name: "CustomerAccountDel",
			component: () => import("@/views/customerManagement/customer/customerAccount-del.vue"),
			meta: {
				title: "CustomerAccountDelete"
			},
			hidden: true
		},
		...CustomerInfoMaintain,
		...UserMaintain, // 用户管理
		...CustomerInfoView, // 客户信息概览
		...AuthTemplateMaintain, // 授权模板维护
		{
			path: "customerEnvelopePrint",
			name: "CustomerEnvelopePrint",
			component: () => import("@/views/customerManagement/customer/customerEnvelopePrint.vue"),
			meta: {
				title: "CustomerEnvelopePrint"
			},
			hidden: true
		},
		...DespositReservation,
		...BillMainrenace,
		...RegisterThird,
		...TrsAuSettings,
		...Query,
		...PasswordReset,
		...specialInstruaction
	]
}