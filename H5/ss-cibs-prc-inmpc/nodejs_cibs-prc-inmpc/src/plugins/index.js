/*
 * @Author: ZhangZhen
 * @Date: 2021-11-10 20:04:04
 * @LastEditTime: 2022-06-10 17:18:34
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\plugins\index.js
 */
import ShowMessage from './src/show-message';
import ShowMessageBox from './src/show-message-box';
import ShowModal, { Modal } from './src/show-modal';

import MoneyInput from '@/components/money-input';
import RowTableColumn from '@/components/row-table-column';
import CustomerQuery from '@/components/customer-query';

import {
  changeSize
} from '@/directives';

const zzPlugins = {};

const pools = [
  RowTableColumn,
  MoneyInput,
  CustomerQuery,
  Modal,
];

/**
 * install-fn
 * @param {import('vue').VueConstructor} Vue VueConstrctor
 * @param {{}} opts plugin-config-options
 */
zzPlugins.install = function (Vue, opts = {}) {
  /** event-bus */
  Vue.prototype.$eventBus = new Vue();
  /** show-components */
  Vue.prototype.$showMsg = ShowMessage;
  Vue.prototype.$showBox = ShowMessageBox;
  Vue.prototype.$modal = ShowModal;

  Vue.directive('changeSize', changeSize);

  Array.prototype.isRepeat = function () {
    var _arr = this;

    var strArr = _arr.map(item => JSON.stringify(item)),
      _isRepeat = strArr.some((item1, index1) => {
        return strArr.some((item2, index2) => {
          if (index1 !== index2) {
            if (item1 === item2) {
              return true;
            }
          }
          return false;
        })
      });

    return _isRepeat;
  }

  pools.forEach(component => {
    Vue.component(component.name, component);
  });
}

export {
  ShowMessage,
  ShowMessageBox,
  ShowModal,
};

export default zzPlugins;