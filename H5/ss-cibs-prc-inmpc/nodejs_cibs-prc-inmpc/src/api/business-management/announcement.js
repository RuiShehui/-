/*
 * @Author: ZhangZhen
 * @Date: 2021-11-09 20:23:03
 * @LastEditTime: 2021-11-10 16:46:22
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\src\api\business-manage\announcement.js
 */
/** bank-announcement */
import http from '../http';

/**
 * get-announcement-list
 */
function getAnnouncementList(params) {
  return http.request({
    url: '/bank-notice/getListPage',
    data: {
      body: {
        ...params
      }
    },
  });
}

/** query-announcement */
function queryAnnouncement(params) {
  return http.request({
    url: '/bank-notice/queryBankNoticeList',
    data: {
      body: {
        ...params
      }
    }
  });
}

/** save announce */
function saveAnnounce(data) {
  return http.request({
    url: '/bank-notice/save',
    data: {
      body: {
        ...data
      }
    }
  });
}

/** delete-announce */
function deleteAnnounce(params) {
  return http.request({
    url: '/bank-notice/removeBankNotice',
    data: {
      body: {
        ...params
      }
    }
  });
}

export {
  getAnnouncementList,
  queryAnnouncement,
  saveAnnounce,
  deleteAnnounce
};
