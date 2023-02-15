/*
 * @Author: zhangcheng
 * @Date: 2021-11-12 11:05:37
 * @LastEditTime: 2022-10-25 17:06:06
 * @LastEditors: Please set LastEditors
 * @Description: costomer account open api
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\customer-management\customer.js
 */
import http from '../http';

// 个人客户开户
export function openAccount(data = {}) {
  return http.request({
    url: '/open-account-manage/openAccount',
    data: {
      body: {
        ...data
      }
    }
  });
}

// T24信息查询
export function queryMerchantData(data = {}) {
  return http.request({
    url: '/open-account-manage/queryMerchantByT24',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人客户开户确认
export function openAccountConfirm(data = {}) {
  return http.request({
    url: '/open-account-manage/openAccountConfirm',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 客户开户第一步
export function openAccountStempOne(data = {}) {
  return http.request({
    url: '/open-account-manage/openAccountStempOne',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 客户开户第二步
export function openAccountStempTwo(data = {}) {
  return http.request({
    url: '/open-account-manage/openAccountStempTwo',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 客户开户第三步
export function openAccountStempThree(data = {}) {
  return http.request({
    url: '/open-account-manage/openAccountStempThree',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 客户开户第四步
export function openAccountStempFour(data = {}) {
  return http.request({
    url: '/open-account-manage/openAccountStempFour',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 客户开户上一步
export function queryOpenStemp(data = {}) {
  return http.request({
    url: '/open-account-manage/queryOpenStemp',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 客户开户获取账户---T24客户号
export function queryUserAccounts(data = {}) {
  return http.request({
    url: '/open-account-manage/queryUserAccounts',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 客户开户获取账户---网银客户号
export function queryUserEbankAccNo(data = {}) {
  return http.request({
    url: '/account-manage/queryUserEbankAccNo',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 客户开户详情查询
export function queryOpenMerchantDetail(data = {}) {
  return http.request({
    url: '/open-account-manage/queryMerchantDetail',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 客户开户清除数据
export function clearAway(data = {}) {
  return http.request({
    url: '/open-account-manage/clearAway',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人客户查询（单个客户详细信息）
export function queryMerchant(data = {}) {
  return http.request({
    url: '/open-account-manage/queryMerchant',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人客户销户
export function closeUserMerchant(data = {}) {
  return http.request({
    url: '/merchant-manage/closeUserMerchant',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人客户详情查询
export function queryMerchantDetail(data = {}) {
  return http.request({
    url: '/merchant-manage/queryMerchantDetail',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人客户信息维护
export function merchantUpdate(data = {}) {
  return http.request({
    url: '/merchant-manage/merchantUpdate',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人交易限额
export function queryCustLimit(data = {}) {
  return http.request({
    url: '/busi-specialLimit/queryCustLimit',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人客户列表查询(一条或多条数据)
export function queryMerchantList(data = {}) {
  return http.request({
    // baseURL: '/kangxiongjian',
    url: '/merchant-manage/queryMerchantList',
    data: {
      body: {
        ...data
      }
    }
  });
}
//  判断销户个人是否有在途交易
export function checkCustomerInTransitTrans(data = {}) {
  return http.request({
    // baseURL: '/kangxiongjian',
    url: '/merchant-manage/checkCustomerInTransitTrans',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 单一批核者账号查询
export function getPaymentCommAccountList(data = {}) {
  return http.request({
    url: '/open-account-manage/getPaymentCommAccountList',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 开户账号查询
export function getCustAcctList(data = {}) {
  return http.request({
    url: '/open-account-manage/getCustAcctList',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 授权拒绝撤销重新编辑
export function queryOpenAcctAuthStatus(data = {}) {
  return http.request({
    url: '/open-account-manage/queryOpenAcctAuthStatus',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 查询个人网银菜单
export function queryCBMenu(data = {}) {
  return http.request({
    url: '/open-account-manage/queryCBMenu',
    data: {
      body: {
        ...data
      }
    }
  });
}