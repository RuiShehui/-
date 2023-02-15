/*
 * @Author: 朱涛
 * @Date: 2021-10-25 18:44:12
 * @LastEditTime: 2021-12-09 10:04:39
 * @LastEditors: zhangcheng
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\src\router\customerManagement\trsAuSettings.js
 */
export default [{
		path: 'trsAuSettings',
		name: 'TrsAuSettings',
		component: () => import('@/views/customerManagement/trsAuSettings/index.vue'),
		meta: {
			title: 'TrsAuSettings'
		},
		hidden: true
	},
	{
		path: 'trsAuSettings/detail',
		name: 'TrsAuSettingsDetail',
		component: () => import('@/views/customerManagement/trsAuSettings/details.vue'),
		meta: {
			title: 'TrsAuSettingsDetail'
		},
		hidden: true,
	}
]