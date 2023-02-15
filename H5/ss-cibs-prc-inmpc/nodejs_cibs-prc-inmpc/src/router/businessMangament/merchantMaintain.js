/*
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2022-01-20 16:55:22
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\router\businessMangament\merchantMaintain.js
 */
export default [{
		path: 'merchantsMaintain',
		name: 'MerchantsMaintain',
		component: () => import('@/views/merchantsMaintain'),
		meta: {
			title: 'MerchantsMaintain'
		}
	},
	{
		path: 'merchantMaintain/add',
		name: 'MerchantsMaintainAdd',
		component: () => import('@/views/merchantsMaintain/merchantsMaintain-operate.vue'),
		meta: {
			title: 'MerchantsMaintain', // MerchantsMaintainAdd
			type: 'add'
		},
		hidden: true
	},
	{
		path: 'merchantMaintain/edit',
		name: 'MerchantsMaintainEdit',
		component: () => import('@/views/merchantsMaintain/merchantsMaintain-operate.vue'),
		meta: {
			title: 'MerchantsMaintain', // MerchantsMaintainEdit
			type: 'edit'
		},
		hidden: true
	},
	{
		path: 'merchantMaintain/detail',
		name: 'MerchantsMaintainDetail',
		component: () => import('@/views/merchantsMaintain/merchantsMaintain-operate.vue'),
		meta: {
			title: 'MerchantsMaintain', // MerchantsMaintainDetail
			type: 'detail'
		},
		hidden: true
	}
]