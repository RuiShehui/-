/*
 * @Author: ZhangZhen
 * @Date: 2021-11-29 14:42:47
 * @LastEditTime: 2022-07-12 10:05:56
 * @LastEditors: zhangcheng
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\customer-management\third-register.js
 */
import http from '../http';

const userInfos = JSON.parse(sessionStorage.getItem('roleDetail') || '{}');

const creator = userInfos.userName;

/**
 * 获取行内转账列表
 * @param {{ [key: string]: string | number | [] | {} }} params
 */
export function getInsideList(params = {}) {
  return http.request({
    // baseURL: '/kangxiongjian',
    url: '/inner-bank-transfer/queryListBankTransferPage',
    data: {
      body: {
        ...params,
      }
    }
  });
}
/**
 * 脱敏反显用户账号名称
 * @param {{ [key: string]: string | number | [] | {} }} params
 * @param {'0' | '1' | '2'} transType
 */
export function showPayeeName(params) {
  return http.request({
    url: '/inner-bank-transfer/findAccountName',
    data: {
      body: {
        ...params,
        transCode: '41346', // 目前需要手动添加
      },
    },
  });
}
/**
 * 新增行内转账内容
 * @param {{ [key: string]: string | number | [] | {} }} data
 */
export function addInsideItem(data = {}) {
  return http.request({
    // baseURL: '/kangxiongjian',
    url: '/inner-bank-transfer/saveBankTransfer',
    data: {
      body: {
        ...data,
        transType: '0',
        creator,
        transferWay: '030101',
      }
    }
  });
}

/**
 * 查询行内转账
 * @param {{ [key: string]: string | number | [] | {} }} params
 */
export function getInsideItem(params = {}) {
  return http.request({
    url: '/inner-bank-transfer/queryListBankTransferPage',
    data: {
      body: {
        ...params,
        transType: '0',
        transferWay: '030101',
      },
    },
  });
}

/**
 * 编辑行内转账内容
 * @param {{ [key: string]: string | number | [] | {} }} data
 */
export function editInsideItem(data = {}) {
  return http.request({
    // baseURL: '/kangxiongjian',
    url: '/inner-bank-transfer/updateBankTransfer',
    data: {
      body: {
        ...data,
        transType: '0',
        creator,
        transferWay: '030101',
      }
    }
  });
}
/**
 * 删除行内转账内容
 * @param {{ [key: string]: string | number | [] | {} }} params
 */
export function deleteInsideItem(params) {
  return http.request({
    // baseURL: '/kangxiongjian',
    url: '/inner-bank-transfer/deleteBankTransfer',
    data: {
      body: {
        ...params,
        transType: '0',
        creator,
        transferWay: '030101',
      }
    }
  });
}

/**
 * 转数快查询
 * @param {{ [key: string]: string | number | [] | {} }} params
 */
export function getTransCountFastList(params = {}) {
  return http.request({
    // baseURL: '/kangxiongjian',
    url: '/local-cross-call-transfer/queryListPageLocalTransfer',
    data: {
      body: {
        ...params,
        transType: '1',
        transferWay: '03010201',
      }
    }
  });
}

/**
 * 转数快新增
 * @param {{ [key: string]: string | number | [] | {} }} data
 */
export function addTransCountFast(data = {}) {
  return http.request({
    // baseURL: '/kangxiongjian',
    url: '/local-cross-call-transfer/saveLocalTransfer',
    data: {
      body: {
        ...data,
        transType: '1',
        creator,
        transferWay: '03010201',
      }
    }
  });
}

/**
 * 转数快编辑
 * @param {{ [key: string]: string | number | [] | {} }} data
 */
export function editTransCountFast(data = {}) {
  return http.request({
    // baseURL: '/kangxiongjian',
    url: '/local-cross-call-transfer/updateLocalTransfer',
    data: {
      body: {
        ...data,
        transType: '1',
        creator,
        transferWay: '03010201',
      }
    }
  });
}

/**
 * 转数快删除
 * @param {{ [key: string]: string | number | [] | {} }} params
 */
export function deleteTransCountFast(params = {}) {
  return http.request({
    // baseURL: '/kangxiongjian',
    url: '/local-cross-call-transfer/deleteLocalTransfer',
    data: {
      body: {
        ...params,
        transType: '1',
        creator,
        transferWay: '03010201',
      }
    }
  });
}

/**
 * 外币转账(EUR/USD)查询
 * @param {{ [key: string]: string | number | [] | {} }} params
 */
export function getLocalFastList(params = {}) {
  return http.request({
    // url: '/local-cross-call-transfer/queryListPageLocalExpressTransfer',
    url: '/local-cross-call-transfer/queryListPageLocalTransfer',
    data: {
      body: {
        ...params,
        transType: '2',
        transferWay: '03010202',
      }
    },
    // baseURL: '/kangxiongjian'
  });
}

/**
 * 外币转账(EUR/USD)新增
 * @param {{ [key: string]: string | number | [] | {} }} data
 */
export function addLocalFastItem(data = {}) {
  return http.request({
    // url: '/local-cross-call-transfer/saveLocalExpressTransfer',
    url: '/local-cross-call-transfer/saveLocalTransfer',
    data: {
      body: {
        ...data,
        transType: '2',
        creator,
        transferWay: '03010202',
      }
    },
    // baseURL: '/kangxiongjian'
  });
}

/**
 * 外币转账(EUR/USD)编辑
 * @param {{ [key: string]: string | number | [] | {} }} data
 */
export function editLocalFastItem(data = {}) {
  return http.request({
    // url: '/local-cross-call-transfer/updateLocalExpressTransfer',
    url: '/local-cross-call-transfer/updateLocalTransfer',
    data: {
      body: {
        ...data,
        transType: '2',
        creator,
        transferWay: '03010202',
      }
    },
    // baseURL: '/kangxiongjian'
  });
}

/**
 * 外币转账(EUR/USD)删除
 */
export function deleteLocalFastItem(params = {}) {
  return http.request({
    // url: '/local-cross-call-transfer/deleteLocalExpressTransfer',
    url: '/local-cross-call-transfer/deleteLocalTransfer',
    data: {
      body: {
        ...params,
        transType: '2',
        creator,
        transferWay: '03010202',
      }
    }
  });
}

/**
 * 查询电汇列表
 */
export function getElecList(params = {}) {
  return http.request({
    // baseURL: '/liukewei', // 目前先用这个 2021-12-01
    url: '/cust-ttAcount/getListPage',
    data: {
      body: {
        ...params,
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo'),
        transType: '3',
        transferWay: '030103',
      }
    }
  });
}

/**
 * 新增电汇记录
 */
export function addElecItem(data = {}) {
  return http.request({
    // baseURL: '/liukewei', // 目前先用这个 2021-12-01
    url: '/cust-ttAcount/save',
    data: {
      body: {
        ...data,
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo'),
        transType: '3',
        creator,
        transferWay: '030103',
      }
    }
  });
}

/**
 * 修改电汇记录
 */
export function editElecItem(data = {}) {
  return http.request({
    // baseURL: '/liukewei', // 目前先用这个 2021-12-01
    url: '/cust-ttAcount/update',
    data: {
      body: {
        ...data,
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo'),
        transType: '3',
        creator,
        transferWay: '030103',
      }
    }
  });
}

/**
 * 删除电汇记录
 */
export function deleteElecItem(params = {}) {
  return http.request({
    // baseURL: '/liukewei', // 目前先用这个 2021-12-01
    url: '/cust-ttAcount/delete',
    data: {
      body: {
        ...params,
        ebankCstmNo: sessionStorage.getItem('ebankCstmNo'),
        transType: '3',
        creator,
        transferWay: '030103',
      }
    }
  });
}

/**
 * judgeSwiftCode
 * @description 判断swiftCode是否存在
 * @description 有-返回列表数据 无-提示没有
 * @param {{ swiftCode: string; ebankCstmNo: string; }} data 提交数据
 * @return {Promise<{body: { list: [] }}>} 返回数据
 */
export function judgeSwiftCode(data = {}) {
  return http.request({
    url: '/cust-swift/swiftCodeDetail',
    data: {
      body: {
        ...data,
      }
    },
    // baseURL: '/liukewei',
  });
}

/**
 * 通过swiftCode获取国家地区 (TODO)
 */
export function getInfoBySwiftCode(params = {}) {
  return http.request({
    url: '/cust-swift',
    data: {
      body: {
        ...params
      }
    }
  });
}

/**
 * 根据国家地区和输入值查询银行列表
 */
export function getBankList(params = {}) {
  return http.request({
    // baseURL: '/liukewei',
    url: '/cust-swift/BankInfoList',
    data: {
      body: {
        ...params
      }
    }
  });
}

/**
 * 获取转数快账户的银行列表
 * @param {{ [key: string]: string | number | [] | {} }} params
 */
export function getFpsBanks(params = {}) {
  return http.request({
    url: '/cust-payee-bank/getBankList',
    data: {
      body: {
        ...params
      },
    },
  });
}

/**
 * 获取外币账户的银行列表
 */
export function queryChatsBanks(params = {}) {
  return http.request({
    url: '/local-cross-call-transfer/queryChatsBanks',
    data: {
      body: {
        ...params
      },
    },
  });

}
/**
 * 获取转数快账户
 */
export function innerFindFpsInfo(params = {}) {
  return http.request({
    url: '/local-cross-call-transfer/innerFindFpsInfo',
    data: {
      body: {
        ...params
      },
    },
  });
}