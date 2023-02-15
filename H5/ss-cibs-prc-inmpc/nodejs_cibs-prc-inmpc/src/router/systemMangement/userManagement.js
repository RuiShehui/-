/*
 * @Autor: 朱涛
 * @Date: 2021-10-25 17:51:15
 * @LastEditors: zhangcheng
 * @LastEditTime: 2022-01-25 16:42:07
 * @Description: 
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\systemMangement\userManagement.js
 * @symbol_custom_string_obkorol: 可以输入预定版本的版权声明、个性签名、空行等
 */
export default [{
		path: "userManagement",
		name: "userManagement",
		// component: () => import("@/views/userManagement/index.vue"),
		component: () => import("@/views/system-manage/userManage.vue"),
		meta: {
			title: 'UserManagement'
		}
	},
	{
		path: "/userManagement/ditail",
		name: 'userManagementDitail',
		component: () =>
			import("@/views/userManagement/userManagement-ditail.vue"),
		meta: {
			title: "userManagementDitail"
		},
		hidden: true
	},
	{
		path: "/userManagement/add",
		name: "userManagementAdd",
		component: () =>
			import("@/views/userManagement/userManagement-add.vue"),
		meta: {
			title: "userManagementAdd"
		},
		hidden: true
	},
	{
		path: "/userManagement/edit",
		name: "userManagementEdit",
		component: () =>
			import("@/views/userManagement/userManagement-edit.vue"),
		meta: {
			title: "userManagementEdit"
		},
		hidden: true
	},
	// {
	//     path: "/userManagement/submit",
	//     name: "userManagementSubmit",
	//     component: () => import("@/views/userManagement/userManagement-submit.vue"),
	//     meta: {
	//         title: "确认"
	//     },
	//     hidden: true
	// }

]