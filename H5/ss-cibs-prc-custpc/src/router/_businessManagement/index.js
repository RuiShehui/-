import Entry from '@/views/_businessManagement'
export default [
  /* 操作员管理 */
  {
    path: '/_businessManagement/operatorMaintain',
    name: 'operator-maintain',
    component: Entry,
    meta: {
      title: '操作员管理'
    },
    children: [{
      path: '/_businessManagement/operatorMaintain',
      name: 'operatorMaintains',
      // component: recom,
      component: () =>
        import(`@/views/_businessManagement/operatorMaintain`),
      meta: {
        title: '操作员管理'
      },
      children: [{
        path: '/_businessManagement/operatorMaintain',
        name: 'operatorMaintain',
        component: () =>
          import(`@/views/_businessManagement/operatorMaintain`),
        meta: {
          title: '操作员维护'
        }
      },
        // {
        //     path: '/_businessManagement/operatorMaintain/newOperator',
        //     name: 'newOperator',
        //     component: () =>
        //         import ('@/views/_businessManagement/operatorMaintain/newOperator'),
        //     meta: {
        //         title: '新增操作员'
        //     }
        // },
        // {
        //     path: '/_businessManagement/operatorMaintain/modifyInfo',
        //     name: 'modifyInfo',
        //     component: () =>
        //         import ('@/views/_businessManagement/operatorMaintain/modifyInfo'),
        //     meta: {
        //         title: '修改信息'
        //     }
        // }
      ]
    },
    {
      path: '/_businessManagement/operatorMaintain/newOperator',
      name: 'newOperator',
      component: () =>
        import('@/views/_businessManagement/operatorMaintain/newOperator'),
      meta: {
        title: '新增操作员'
      }
    },
    {
      path: '/_businessManagement/operatorMaintain/modifyInfo',
      name: 'modifyInfo',
      component: () =>
        import('@/views/_businessManagement/operatorMaintain/modifyInfo'),
      meta: {
        title: '修改信息'
      }
    },
    {
      path: '/_businessManagement/operatorMaintain/updateOperator',
      name: 'updateOperator',
      component: () =>
        import('@/views/_businessManagement/operatorMaintain/updateOperator'),
      meta: {
        title: '编辑信息'
      }
    },
    {
      path: '/_businessManagement/operatorMaintain/seeUser',
      name: 'seeUser',
      component: () =>
        import('@/views/_businessManagement/operatorMaintain/seeUser'),
      meta: {
        title: '查看信息'
      }
    },
    {
      path: '/_businessManagement/operatorMaintain/userResult',
      name: 'userResult',
      component: () =>
        import('@/views/_businessManagement/operatorMaintain/userResult'),
      meta: {
        title: '结果页'
      }
    },
    {
      path: '/_businessManagement/accountMaintenance',
      name: 'accountMaintenance',
      // component: recom,
      component: () =>
        import(`@/views/_businessManagement/accountMaintenance`),
      meta: {
        title: '账户管理'
      },
      children: [{
        path: '/_businessManagement/accountMaintenance',
        name: 'account-maintenance',
        component: () =>
          import(`@/views/_businessManagement/accountMaintenance`),
        meta: {
          title: '账户管理'
        }
      },
        // {
        //     path: '/_businessManagement/result',
        //     name: 'account-result',
        //     component: () =>
        //         import (`@/views/_businessManagement/accountMaintenance/result.vue`),
        //     meta: {
        //         title: '结果页'
        //     }
        // },
      ]
    },
    {
      path: '/_businessManagement/result',
      name: 'account-result',
      component: () =>
        import(`@/views/_businessManagement/accountMaintenance/result.vue`),
      meta: {
        title: '结果页'
      }
    },
    {
      path: '/_businessManagement/authManagement/rightsTemplate',
      name: 'authManagement',
      // component: recom,
      component: () =>
        import(`@/views/_businessManagement/authManagement/rightsTemplate`),
      meta: {
        title: '授权模板维护'
      },
      children: [{
        path: '/_businessManagement/authManagement/rightsTemplate',
        name: 'rights-template',
        component: () =>
          import(`@/views/_businessManagement/authManagement/rightsTemplate`),
        meta: {
          title: '授权模板维护'
        }
      },
        // {
        //     path: '/_businessManagement/authManagement/dealMandate',
        //     name: 'dealMandate',
        //     component: () =>
        //         import (`@/views/_businessManagement/authManagement/dealMandate`),
        //     meta: {
        //         title: '交易授权设置'
        //     }
        // },
        // {
        //     path: '/_businessManagement/authManagement/detail',
        //     name: 'details',
        //     component: () =>
        //         import (`@/views/_businessManagement/authManagement/detail`),
        //     meta: {
        //         title: '详情'
        //     }
        // },
        // {
        //     path: '/_businessManagement/authManagement/addTemplate',
        //     name: 'addTemplate',
        //     component: () =>
        //         import (`@/views/_businessManagement/authManagement/addTemplate`),
        //     meta: {
        //         title: '新增'
        //     }
        // }
      ]
    },
    {
      path: '/_businessManagement/authManagement/dealMandate',
      name: 'dealMandate',
      component: () =>
        import(`@/views/_businessManagement/authManagement/dealMandate`),
      meta: {
        title: '交易授权设置'
      }
    },
    {
      path: '/_businessManagement/authManagement/detail',
      name: 'details',
      component: () =>
        import(`@/views/_businessManagement/authManagement/detail`),
      meta: {
        title: '详情'
      }
    },
    {
      path: '/_businessManagement/authManagement/tranDetail',
      name: 'tranDetails',
      component: () =>
        import(`@/views/_businessManagement/authManagement/tranDetail`),
      meta: {
        title: '交易详情'
      }
    },
    {
      path: '/_businessManagement/authManagement/resultTemplate',
      name: 'resultTemplate',
      component: () =>
        import(`@/views/_businessManagement/authManagement/resultTemplate`),
      meta: {
        title: '模板结果页'

      }
    },
    {
      path: '/_businessManagement/authManagement/dealMandate/result',
      name: 'dealMandateResultTemplate',
      component: () =>
        import(`@/views/_businessManagement/authManagement/dealMandate/result.vue`),
      meta: {
        title: '模板结果页'

      }
    },
    {
      path: '/_businessManagement/authManagement/addTemplate',
      name: 'addTemplate',
      component: () =>
        import(`@/views/_businessManagement/authManagement/addTemplate`),
      meta: {
        title: '新增'
      }
    },
    {
      path: '/_businessManagement/serviceSetting/enterpriseQuota',
      name: 'serviceSetting',
      // component: recom,
      component: () =>
        import(`@/views/_businessManagement/serviceSetting/enterpriseQuota`),
      meta: {
        title: '服务设定'
      },
      children: [{
        path: '/_businessManagement/serviceSetting/enterpriseQuota',
        name: 'enterprise-quota',
        component: () =>
          import(`@/views/_businessManagement/serviceSetting/enterpriseQuota`),
        meta: {
          title: '服务限额设定'
        }
      },

      ]
    },
    {
      path: '/_businessManagement/serviceSetting/bindingAccount',
      name: 'bindingAccount',
      component: () =>
        import(`@/views/_businessManagement/serviceSetting/bindingAccount`),
      meta: {
        title: 'FPS账户绑定'
      }
    },
    {
      path: '/_businessManagement/serviceSetting/bindingAccount/contact',
      name: 'contact',
      component: () =>
        import(`@/views/_businessManagement/serviceSetting/bindingAccount/contact`),
      meta: {
        title: 'FPS账户绑定'
      }
    },
    {
      path: '/_businessManagement/serviceSetting/bindingAccount/uncontact',
      name: 'uncontact',
      component: () =>
        import(`@/views/_businessManagement/serviceSetting/bindingAccount/uncontact`),
      meta: {
        title: 'FPS账户绑定'
      }
    },
    {
      path: '/_businessManagement/serviceSetting/bindingAccount/modify',
      name: 'bindingAccountModify',
      component: () =>
        import(`@/views/_businessManagement/serviceSetting/bindingAccount/modify`),
      meta: {
        title: 'FPS账户绑定'
      }
    },

    {
      path: '/_businessManagement/serviceSetting/smallTransfer',
      name: 'smallTransfer',
      component: () =>
        import(`@/views/_businessManagement/serviceSetting/smallTransfer`),
      meta: {
        title: '设定小额转账'
      }
    },
    // {
    //     path: '/_businessManagement/serviceSetting/smallTransfer/result',
    //     name: 'smallTransfer-result',
    //     component: () =>
    //         import (`@/views/_businessManagement/serviceSetting/smallTransfer/result`),
    //     meta: {
    //         title: '设定小额转账'
    //     }
    // },
    {
      path: '/_businessManagement/serviceSetting/edda',
      name: 'edda',
      component: () =>
        import(`@/views/_businessManagement/serviceSetting/edda`),
      meta: {
        title: '设定EDDA'
      },
      children: [
        {
          path: '/_businessManagement/serviceSetting/edda',
          name: 'elePayment',
          component: () =>
            import(`@/views/_businessManagement/serviceSetting/edda/elePayment`),
          meta: {
            title: '电子直接付款授权服务'
          }
        },
        {
          path: '/_businessManagement/serviceSetting/edda/elePayment/detail',
          name: 'elePayment-detail',
          component: () =>
            import(`@/views/_businessManagement/serviceSetting/edda/elePayment/detail`),
          meta: {
            title: '详情'
          }
        },
        {
          path: '/_businessManagement/serviceSetting/edda/elePayment/modify',
          name: 'elePayment-modify',
          component: () =>
            import(`@/views/_businessManagement/serviceSetting/edda/elePayment/modify`),
          meta: {
            title: '修改'
          }
        },
        {
          path: '/_businessManagement/serviceSetting/edda/elePayment/eddaResult',
          name: 'elePayment-eddaResult',
          component: () =>
            import(`@/views/_businessManagement/serviceSetting/edda/elePayment/eddaResult`),
          meta: {
            title: '设定EDDA结果页'
          }
        },
      ]
    },

    {
      path: '/_businessManagement/serviceSetting/eleStatements',
      name: 'eleStatements',
      component: () =>
        import(`@/views/_businessManagement/serviceSetting/eleStatements`),
      meta: {
        title: '设定电子结单'
      }
    },
    {
      path: '/_businessManagement/serviceSetting/tradingTips',
      name: 'tradingTips',
      component: () =>
        import(`@/views/_businessManagement/serviceSetting/tradingTips`),
      meta: {
        title: '设定交易提示'
      }
    },
    {
      path: '/_businessManagement/serviceSetting/tradingTips/result',
      name: 'tradingTips-result',
      component: () =>
        import(`@/views/_businessManagement/serviceSetting/tradingTips/result`),
      meta: {
        title: '设定交易提示'
      }
    },
    {
      path: '/_businessManagement/authorizeCenter/mySubmit',
      name: 'authorizeCenter',
      // component: recom,
      component: () =>
        import(`@/views/_businessManagement/authorizeCenter/mySubmit`),
      meta: {
        title: '授权中心'
      },
      children: [{
        path: '/_businessManagement/authorizeCenter/mySubmit',
        name: 'mySubmits',
        component: () =>
          import(`@/views/_businessManagement/authorizeCenter/mySubmit`),
        meta: {
          title: '我提交的'
        }
      },
      ]
    },
    {
      path: '/_businessManagement/authorizeCenter/waitAuth',
      name: 'waitAuths',
      component: () =>
        import(`@/views/_businessManagement/authorizeCenter/waitAuth`),
      meta: {
        title: '待我授权的'
      }
    },
    {
      path: '/_businessManagement/authorizeCenter/detail',
      name: 'authorizeCenterDetail',
      component: () =>
        import(`@/views/_businessManagement/authorizeCenter/detail`),
      meta: {
        title: '详情'
      }
    },
    {
      path: '/_businessManagement/authorizeCenter/mySubmit/result',
      name: 'authorizeCenter-detail-mySubmit-result',
      component: () =>
        import(`@/views/_businessManagement/authorizeCenter/mySubmit/result.vue`),
      meta: {
        title: '待我授权结果页'
      }
    },
    {
      path: '/_businessManagement/operatorLog',
      name: 'operatorLogs',
      // component: recom,
      component: () =>
        import(`@/views/_businessManagement/operatorLog`),
      meta: {
        title: '待我授权的'
      }
    },
    {
      path: '/_businessManagement/authorizeCenter/detail',
      name: 'authorizeCenter-detail',
      component: () =>
        import(`@/views/_businessManagement/authorizeCenter/detail`),
      meta: {
        title: '详情'
      }
    }
    ]
  },
  /* 操作员日志 */
  {
    path: '/_businessManagement/operatorLog',
    name: 'operatorLog',
    component: Entry,
    meta: {
      title: '操作员日志'
    },
    children: [{
      path: '/_businessManagement/operatorLog',
      name: 'operator-log',
      component: () =>
        import(`@/views/_businessManagement/operatorLog`),
      meta: {
        title: '操作员日志'
      }
    }]
  }
];