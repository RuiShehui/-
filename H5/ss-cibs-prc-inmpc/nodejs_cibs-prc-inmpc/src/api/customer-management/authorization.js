/*
 * @Author: zhangcheng
 * @Date: 2021-11-16 15:06:30
 * @LastEditTime: 2022-04-20 09:25:24
 * @LastEditors: zhangcheng
 * @Description: authorization template api
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\api\customer-management\authorization.js
 */
import http from '../http';

// 模板列表查询(分页)
export function queryListTemplatePage(data = {}) {
  return http.request({
    url: '/auth-temp/queryListTemplatePage',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 模板交易种类查询
export function queryMenuBy(data = {}) {
  return http.request({
    url: '/open-account-manage/queryMenuBy',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 模板列表查询(不分页)
export function queryListTemplate(data = {}) {
  return http.request({
    url: '/auth-temp/queryListTemplate',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 模板新增
export function saveTemplate(data = {}) {
  return http.request({
    url: '/auth-temp/saveTemplate',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 模板修改
export function updateTemplate(data = {}) {
  return http.request({
    url: '/auth-temp/updateTemplate',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 模板详情
export function queryAuthTradeDetail(data = {}) {
  return http.request({
    url: '/auth-trade/queryAuthTradeDetail',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 模板删除
export function deleteTemplate(data = {}) {
  return http.request({
    url: '/auth-temp/deleteTemplate',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 授权列表查询
export function queryListSetting(data = {}) {
  return http.request({
    url: '/auth-trade/queryListSetting',
    data: {
      body: {
        ...data
      }
    }
  });
}
// 授权列表查询(信息概览)
export function queryListAllSetting(data = {}) {
  return http.request({
    url: '/auth-trade/queryListAllSetting',
    data: {
      body: {
        ...data
      }
    }
  });
}

// 授权列表修改
export function updateSetting(data = {}) {
  return http.request({
    url: '/auth-trade/updateSetting',
    data: {
      body: {
        ...data
      }
    }
  });
}