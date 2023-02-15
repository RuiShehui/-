/*
 * @Author: zhangcheng
 * @Date: 2021-11-22 16:56:21
 * @LastEditTime: 2022-09-19 09:44:28
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\customer-management\user.js
 */
import http from '../http';

// 个人用户分页查询
export function queryOperatorPage(data = {}) {
  return http.request({
    url: '/merchant-operator-manage/queryOperatorPage',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人用户详情查询
export function queryOperatorDetail(data = {}) {
  return http.request({
    url: '/merchant-operator-manage/queryOperatorDetail',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人用户密码重置
export function resetPassword(data = {}) {
  return http.request({
    url: '/merchant-operator-manage/resetPassword',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人用户重设密码
export function resetLoginCount(data = {}) {
  return http.request({
    url: 'merchant-operator-manage/resetLoginCount',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人用户修改
export function operatorUpdate(data = {}) {
  return http.request({
    url: '/merchant-operator-manage/operatorUpdate',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人用户新增
export function operatorSave(data = {}) {
  return http.request({
    url: '/merchant-operator-manage/operatorSave',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人用户删除
export function operatorDel(data = {}) {
  return http.request({
    url: '/merchant-operator-manage/operatorDel',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 个人用户名重复性判断
export function repeatLoginName(data = {}) {
  return http.request({
    url: '/merchant-operator-manage/repeatLoginName',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 批量待打印用户信息分页查询----批次处理
export function queryPrintBatchPage(data = {}) {
  return http.request({
    url: '/envelope-print-manage/queryPrintBatchPage',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 批量待打印用户信息详情列表查询----批次处理/以及所有数据正常查询。若从批次点击进去，需要传入批次号
export function queryPrintBatchDetailPage(data = {}) {
  return http.request({
    url: '/envelope-print-manage/queryPrintBatchDetailPage',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 打印密码信函测试----传空就可以
export function printPINMailTest(data = {}) {
  return http.request({
    url: '/envelope-print-manage/printPINMailTest',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 批量打印密码信函----打印，若打印批次单选只需要传批次号/批次详细多选传入list和批次号。所有数据传入list
export function batchPrintPINMail(data = {}) {
  return http.request({
    url: '/envelope-print-manage/batchPrintPINMail',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 个人欢迎信打印
export function queryMerchantWclmPage(data = {}) {
  return http.request({
    url: '/envelope-print-manage/queryMerchantWclmPage',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 个人欢迎信打印
export function queryWclmPrintBatchPage(data = {}) {
  return http.request({
    url: '/envelope-print-manage/queryWclmPrintBatchPage',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 获取SoftToken信息---流动保安认证服务
export function softTokenGet(data = {}) {
  return http.request({
    url: '/softtoken/manage/getInfo',
    data: {
      body: {
        ...data
      }
    }
  });
}

// Soft_Token激活状态修改接口---流动保安认证服务
export function softTokenUpdate(data = {}) {
  return http.request({
    url: '/softtoken/manage/statusUpdate',
    data: {
      body: {
        ...data
      }
    }
  });
}

//预览用户欢迎信pdf
export function batchDownloadFile(data = {}) {
  return http.request({
    url: '/envelope-print-manage/batchDownloadFile',
    data: {
      body: {
        ...data
      }
    }
  });
}

//预览个人欢迎信pdf
export function batchDownloadMerchantFile(data = {}) {
  return http.request({
    url: '/envelope-print-manage/batchDownloadMerchantFile',
    data: {
      body: {
        ...data
      }
    }
  });
}