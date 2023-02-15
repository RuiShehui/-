/*
 * @Author: your name
 * @Date: 2021-12-06 11:10:54
 * @LastEditTime: 2022-09-20 09:33:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\router\authorizeCenter\index.js
 */
export default [{
		path: '/authorizeCenter/waitAuth',
		name: 'waitAuth',
		component: () =>
			import('@/views/authorizeCenter/waitAuth.vue'),
		meta: {
			title: '待我授权'
		},
	},
	{
		path: '/authorizeCenter/mySubmit',
		name: 'mySubmit',
		component: () =>
			import('@/views/authorizeCenter/mySubmit.vue'),
		meta: {
			title: '我提交的'
		},
	},
	{
		path: '/authorizeCenter/result',
		name: 'mySubmitResult',
		component: () =>
			import('@/views/authorizeCenter/result.vue'),
		meta: {
			title: '我提交的'
		},
	},
	{
		path: '/authorizeCenter/detail',
		name: 'detail',
		component: () =>
			import('@/views/authorizeCenter/detail'),
		meta: {
			title: '详情'
		},
	}
] 