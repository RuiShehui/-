/*
 * @Author: ZhangZhen
 * @Date: 2022-03-24 10:09:35
 * @LastEditTime: 2022-05-12 09:04:51
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\components\accountList\utils\tools.js
 */
/** 转账弹窗需要的工具函数 */
import i18n from '@/i18n';
/** apis */
import {
  findInnerBankRegPageList,
  findInterBankTransferRegPageList,
  findGlobalRemittanceRegPageList
} from '@/api/paymentRemittance';
import {
  REGISTER_TRANSFER_MAP,
  IDENTIFY_WAY_MAP,
  INTRA_ACCT_TYPES
} from '@bank-transfer/utils/constant';

export {
  getRegisteredList,
  initQueryData,
  getSearchBarData,
  setCurrentComponent,
  setPropLabel,
  setTableColumn,
  setPropWidth,
  setOptionList,
  initTableColumns,
  transToCreditAcct,
};

/**
 * 获取已登记账户请求列表
 */
function getRegisteredList(payType) {
  const fn = getRequestFn(payType);
  const transferWay = getTransferWay(payType);

  /* console.log(fn.name); */

  return function (params = {}) {
    const _params = {
      ...params
    };
    if (transferWay) {
      _params.transferWay = transferWay;
    }

    return fn(_params);
  }

  function getRequestFn(payType) {
    switch (payType) {
      case 'fast':
        return findInterBankTransferRegPageList;
      case 'localtransfer':
        return findInterBankTransferRegPageList;
      case 'remittance':
        return findGlobalRemittanceRegPageList;
      default:
        return findInnerBankRegPageList;
    }
  }

  function getTransferWay(payType) {
    switch (payType) {
      case 'fast':
        return INTRA_ACCT_TYPES.FAST;
      case 'localtransfer':
        return INTRA_ACCT_TYPES.CHATS;
      default:
        return '';
    }
  }
}

/**
 * 获取查询菜单的数据
 * @param {string} payType (1-行内转账,2-fps转账,3-外币转账,4-tt转账)
 * @param {number|string} accountType 账户类型 (2-已登记账户,3-未登记账户(最近收款人))
 */
function initQueryData(payType, accountType) {
  const _payType = payType || 'fast';

  if (Number(accountType) === 3) {
    return getFormRecentData(payType);
  }
  return getFormRegisteredData(_payType);
  /** 已登记账户-查询参数对象 */
  function getFormRegisteredData(payType) {
    switch (payType) {
      case 'fast':
        return {
          payeeName: '', // 收款户名
          payeeBankCode: '', // 收款银行/机构
          payeeIdentifyMethod: '' // 收款人识别方式
        };
      case 'localtransfer':
        return {
          payeeName: '', // 收款户名
          payeeBankCode: '', // 收款银行/机构
        };
      case 'remittance':
        return {
          swiftCode: '', // SWIFT Code
          bankName:'',//银行名称
          payeeName: '', // 收款户名
          countryCode: '', // 收款银行-国家地区
        };
      default:
        return {
          payeeName: '',
        };
    }
  }
  function getFormRecentData(payType) {
    switch (payType) {
      case 'fast':
        return {
          creditAcctName: '', // 收款户名
          creditAcctIdentificationType: '', // 收款人识别方式
          payeeBankCode: '', // 收款银行/机构
        };
      case 'localtransfer':
        return {
          creditAcctName: '', // 收款户名
          creditBankCode: '', // 收款银行/机构
        };
      case 'remittance':
        return {
          swiftCode: '', // SWIFT Code
          // bankName:'',//银行名称
          creditBankName:'',//银行名称
          creditAcctName: '', // 收款户名
          creditBankRegion: '', // 收款银行-国家地区
        };
      default:
        return {
          creditAcctName: '', // 收款户名
        };
    }
  }
}

/**
 * 初始化表头信息
 */
function initTableColumns(payType, creditType = 2) {
  const propList = [];
  if (Number(creditType) === 2) {
    initRegistered(propList, payType);
  } else {
    initRecented(propList, payType);
  }

  const tableColumns = propList.map(prop => setTableColumn(prop, payType));

  return tableColumns;

  function initRegistered(propList, payType) {
    switch (payType) {
      case 'fast':
        propList.push(
          'registerCode',
          'payeeIdentifyMethod',
          'payeeBankCode',
          'payeeName',
          'acctName'
        );
        break;
      case 'localtransfer':
        propList.push(
          'registerCode',
          'payeeBankCode',
          'payeeName',
          'payeeAccount'
        );
        break;
      case 'remittance':
        propList.push(
          'registerCode',
          'payeeName',
          'payeeAddress',
          'accountNo',
          'swiftCode',
          'countryCode',
          'bankName'
        );
        break;
      default: // 默认是行内转账
        propList.push(
          'registerCode',
          'payeeBank',
          'payeeName',
          'payeeAccount',
        );
        break;
    }
  }
  function initRecented(propList, payType) {
    switch (payType) {
      case 'fast':
        propList.push(
          'creditAcctIdentificationType',
          'creditBankCode',
          'creditAcctName',
          'creditAcct',
        );
        break;
      case 'localtransfer':
        propList.push(
          'creditBankCode',
          'creditAcctName',
          'creditAcct'
        );
        break;
      case 'remittance':
        propList.push(
          'creditAcctName',
          // 'creditAddress',
          'creditAcct',
          'swiftCode',
          'creditBankRegion',
          'creditBankName',
        );
        break;
      default:
        propList.push(
          'creditBankCode',
          'creditAcctName',
          'creditAcct',
        );
    }
  }
}

/**
 * 根据属性获取tableColumn配置
 */
function setTableColumn(prop, payType) {
  return {
    prop,
    label: setPropLabel(prop, payType),
    width: setPropWidth(prop)
  };
}

/**
 * 获取SearchBar中的渲染配置
 */
function getSearchBarData(queryData = {}, payType) {
  const searchBarData =
    Object.getOwnPropertyNames(queryData)
      .map(prop => {
        const config = createSearchBarComponent(queryData[prop], prop);
        return config;
      });

  return searchBarData.filter(item => item.label.length > 0);

  function createSearchBarComponent(value = '', prop) {
    const component = setCurrentComponent(prop);
    const label = setPropLabel(prop, payType);

    return {
      label,
      prop,
      value,
      component,
    };
  }
}
/**
 * 根据属性设置组件
 */
function setCurrentComponent(prop) {
  switch (prop) {
    case 'creditBankCode':
      return 'select';
    case 'payeeBankCode':
      return 'select';
    case 'creditBankRegion':
      return 'select';
    case 'bankCountry':
      return 'select';
    case 'countryCode':
      return 'select';
    case 'payeeCountryCode':
      return 'select';
    case 'creditRegion':
      return 'select';
    case 'creditAcctIdentificationType':
      return 'select';
    case 'payeeIdentifyMethod':
      return 'select';
    default:
      return 'input';
  }
}
/**
 * 根据属性设置当前的中文标签
 */
function setPropLabel(prop, payType) {
  switch (prop) {
    /** 收款户名 */
    case 'creditAcctName':
      return i18n.t('PAYMENT.PAYEE_NAME');
    case 'payeeName':
      return i18n.t('PAYMENT.PAYEE_NAME');
    /**收款账户 */
    case 'creditAcct':
      return (
        payType === 'fast' || payType == 2
        ?
        i18n.t('PAYMENT.PAY_ACCT_NAME')
        :
        payType === 'remittance' || payType == 4
        ?
        i18n.t('PAYMENT.ACCT_NO_OR_IBAN')
        :
        i18n.t('PAYMENT.RECEIVE_ACCOUNT')
      );
    case 'payeeAccount':
      return i18n.t('PAYMENT.RECEIVE_ACCOUNT');
    /** 收款人地址 */
    case 'creditAddress':
      return i18n.t('PAYMENT.RECEIVER_ADDRESS');
    case 'payeeAddress':
      return i18n.t('PAYMENT.RECEIVER_ADDRESS');
    /** 收款人银行机构 */
    case 'payeeBank':
      return i18n.t('PAYMENT.RECEIVE_BANK');
    case 'creditBankCode':
      return i18n.t('PAYMENT.RECEIVE_BANK');
    case 'payeeBankCode':
      return i18n.t('PAYMENT.RECEIVE_BANK');
    /** 收款人识别方式 */
    case 'creditAcctIdentificationType':
      return i18n.t('PAYMENT.PAYEE_IDENTIFY_WAY');
    case 'payeeIdentifyMethod':
      return i18n.t('PAYMENT.PAYEE_IDENTIFY_WAY');
    /** 登记编号 */
    case 'registerCode':
      return i18n.t('PAYMENT.REGISTER_CODE');
    case 'acctName':
      return i18n.t('PAYMENT.PAY_ACCT_NAME');
    /** 账户号码 */
    case 'creditRegion':
      return i18n.t('PAYMENT.ACCT_ADDRESS');
    case 'countryCode':
      return i18n.t('PAYMENT.PAYEE_COUNTRY_CODE');
    case 'creditBankRegion':
      return i18n.t('PAYMENT.PAYEE_COUNTRY_CODE');
    case 'bankCountry':
      return i18n.t('PAYMENT.PAYEE_COUNTRY_CODE');
    case 'swiftCode':
      return 'SWIFT Code';
    case 'payeeCountryCode':
      return i18n.t('PAYMENT.PAYEE_COUNTRY_CODE');
    case 'accountNo':
      return i18n.t('PAYMENT.ACCT_NO_OR_IBAN');
    case 'bankName':
      return i18n.t('PAYMENT.BANK_NAME');
    case 'creditBankName':
      return i18n.t('PAYMENT.BANK_NAME');
    default:
      return '';
  }
}
/**
 * 根据属性获取表头长度
 */
function setPropWidth(prop) {
  if (!prop && !prop.length) {
    return '200px';
  }

  switch (prop) {
    default:
      return 'auto';
  }
}

/**
 * 设置成渲染的optionList
 */
function setOptionList(list = []) {
  if (!Array.isArray(list) || !list) {
    return [];
  } else {
    return list.map(item => {
      const label = item.label || item.bankName,
        value = item.value;
      return {
        ...item,
        label,
        value
      };
    });
  }
}

/**
 * 将账户信息过滤为收款人信息
 */
function transToCreditAcct(origin = {}) {
  const target = {};
  for (let k in origin) {
    if (REGISTER_TRANSFER_MAP.hasOwnProperty(k)) {
      const tarKey = REGISTER_TRANSFER_MAP[k];
      target[tarKey] = origin[k];
    }
  }
  if (origin.payeeCcy || origin.payeeType) {
    target.creditCcy = origin.payeeCcy;
    target.creditAcctType = origin.payeeType
  }
  if (!target.creditAcct) {
    target.creditAcct = getValueByPayeeIdentifyMethod(origin) || origin['payeeAccount'];
  }
  if (!target.creditAcctName) {
    target.creditAcctName = origin['payeeName'];
  }
  return target;

  function getValueByPayeeIdentifyMethod(origin) {
    const {
      payeeIdentifyMethod
    } = origin;
    switch (payeeIdentifyMethod) {
      case IDENTIFY_WAY_MAP.payeeAccount:
        return origin.payeeAccount;
      case IDENTIFY_WAY_MAP.mobilePhone:
        return origin.mobilePhone;
      case IDENTIFY_WAY_MAP.emailAddress:
        return origin.emailAddress;
      case IDENTIFY_WAY_MAP.fpsId:
        return origin.fpsId;
      default:
        return '';
    }
  }
}