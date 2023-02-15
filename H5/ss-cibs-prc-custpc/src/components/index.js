/*
 * @Author: ZhangZhen
 * @Date: 2022-02-10 10:01:42
 * @LastEditTime: 2022-09-16 15:13:31
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\index.js
 */

import Steps from './common/steps';
import MoneyInput from './common/moneyInput';
import AuthTips from './common/authorizationTips';
import DetailItem from './common/DetailItem';
import Result from './common/operateResult';
import PopUp from './common/PopUp';
import Divider from './common/divider';
import PhoneInput from './common/phone-input';
import VButton from './common/VButton';
import TitleBar from './common/titleBar';
import PageNation from './common/pageNation';
import MsgInline from './common/MsgInline';
import Prompt from './common/Prompt';
import LangSwitch from './common/LangSwitch';
import OperateResult from './common/operateResult';
import AuthSelect from './common/auth-select';

export default {
  install: (Vue, opts) => {
    Vue.component('Steps', Steps);
    Vue.component('Result', Result);
    Vue.component('MoneyInput', MoneyInput);
    // Vue.component('AuthTips', AuthTips);
    Vue.component('DetailItem', DetailItem);
    Vue.component('PopUp', PopUp);
    Vue.component('Divider', Divider);
    Vue.component('PhoneInput', PhoneInput);
    Vue.component('VButton', VButton);
    Vue.component('TitleBar', TitleBar);
    Vue.component('PageNation', PageNation);
    Vue.component('MsgInline', MsgInline);
    Vue.component('Prompt', Prompt);
    Vue.component('LangSwitch', LangSwitch);
    Vue.component('OperateResult', OperateResult);
    Vue.component('AuthSelect', AuthSelect);
  }
};
