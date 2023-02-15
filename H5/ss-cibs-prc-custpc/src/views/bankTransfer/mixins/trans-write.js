/*
 * @Author: ZhangZhen
 * @Date: 2022-02-25 16:00:44
 * @LastEditTime: 2022-06-07 15:28:55
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\mixins\trans-write.js
 */
/** 数学计算工具 */
import mathTools from '@/utils/mathTools';
/** 数据处理工具 */
import dataTools from '@/dataTools/tools';
/** 自定义工具 */
import { chineseInLimit, englishInLimit } from '@/utils/tools';

/** 银行信息混入 */
import { bankInfos } from '@/mixins';
/** 点击添加草稿的接口 */
import { addTransactionDraft } from '@/api/paymentRemittance';
/** 查询余额的接口 */
import { queryPayAccountBalance } from '@/api/public';
/** 手续费扣款账户金额计算，适用于外币转账/电汇 */
import { getChargeFeeOnline } from '@/api/paymentRemittance';
/** 获取命名空间的工具 */
import { createNamespacedHelpers } from 'vuex';
/** 转账模块常量 */
import { SELECT_BANK_TYPES } from '@bank-transfer/utils/constant';
/** 转账模块工具 */
import { formatAcctNo } from '@bank-transfer/utils/function';
/** 业务过滤器 */
import businessFilter from '@/filters/business';
/** lodash */
import _ from 'lodash';
import ccyTool from '@/filters/accountManagement';


/** 多语言工具 (不用vm.$t) */
import i18n from '@/i18n';

const { mapState } = createNamespacedHelpers('app');
const { getCurrentTimes } = dataTools;

export default {
  inject: [
    // 清除授权信息列表 (针对auth-select组件)
    'clearLevelLists',
    // 页面滚动到顶部的方法
    'scrollToTop',
    /** 个人账户类型 ( 1-非授权账户; 2-授权账户 ) */
    'entType',
  ],
  mixins: [bankInfos],
  props: {
    /** 初始化确认数据 */
    confirmData: {
      type: Object,
      default() {
        return {};
      }
    },
    // ** 是否结果页返回*/
    isResultTo: {
      type: Boolean,
      default: false
    }
  },
  /** sub-data */
  data() {
    return {
      //**是否跳转过来 */
      isJumpTo: false,
      /** 储存跳转过来的参数 */
      jumpData: {},
      /** 填写页面的表单数据(formsData写错了, 有空的话就改一下) */
      formsData: {},
      /** 付款人选择列表 */
      debitAcctList: [],
      /**
       * 手续费扣款账户列表 （2022-04-19新增）
       **/
      chargeAcctList: [],
      /**
       * 2022-04-26新增 选择付款账户的Index (Number|String)
       * 付款账户+币种+账户类型才能确认唯一的账号, 需要使用索引变化监听
       * 2022-06-02新增, 默认缺省时显示第一个付款账户
       */
      debitIndex: 0, // debitIndex: ''
      /**
       * 2022-05-16新增 付款账户状态
       * 判断当前付款账户是否被冻结
       * */
      debitStatus: 'ACTIVE',
      /**
       * 2022-06-01新增
       * 判断当前手续费扣款账户是否被冻结
       */
      chargeStatus: 'ACTIVE',
      /**
       * 2022-04-26新增 选择手续费账户的Index
       * 付款账户+币种+账户类型才能确认唯一的账号, 需要使用索引变化监听
       */
      dedutIndex: '',
      /**
       * 2022-04-26新增 选择收款账户的Index (目前没有用到)
       */
      creditIndex: 0,
      /**
       * 时间选择器区域选项
       * 选择时间要大于当前时间并且在一年之内, 否在 disable-date = true
       **/
      option: {
        // 时间选择器
        disabledDate(time) {
          let curDate = new Date().getTime();
          let thatDate = time.getTime();
          return (
            curDate + 180 * 24 * 3600 * 1000 < thatDate ||
            thatDate < Date.now() - 8.64e6
          );
        }
      },
    };
  },
  /** sub-filters */
  filters: {
    /** 输入框内的银行显示 */
    inputBankNameFilter(data = {}) {
      const {
        creditBankInstitution = '', designBank = SELECT_BANK_TYPES.OPT
      } = data;
      if (creditBankInstitution.length) {
        return creditBankInstitution;
      }
      if (designBank === SELECT_BANK_TYPES.PRE) {
        return i18n.t('PAYMENT.PRESET_PAYEE_BANK');
      }
      if (designBank === SELECT_BANK_TYPES.DEF) {
        return i18n.t('PAYMENT.CHUANGXING_BANK');
      }
      return '';
    }
  },
  /** memo-states */
  computed: {
    /**
     * 使用mapState获取当前是否正处于请求状态的变量
     */
    ...mapState(['lang', 'requestLoading']),
    /** 是否显示余额 */
    showNameFlag() {
      return this.formsData && this.formsData.debitAcct;
    },
    /** backending-lang */
    backendingLang() {
      switch (this.lang) {
        case 'zh-CN':
          return 'zh-CN';
        case 'zhXG':
          return 'zh-HK';
        case 'zh-HK':
          return 'zh-HK';
        default:
          return 'en';
      }
    },
    /**
     * 收款人选择列表 (从付款人选择列表中过滤出来)
     * 1. 账户和付款账户不相同
     * 2. 需要和付款账户同币种
     */
    creditAcctList() {
      const {
        debitAcct,
        debitCcy
      } = this.formsData;
      const filterList = (
        this.debitAcctList
          .filter(item => item.value !== debitAcct)
          .filter(item => item.cur === debitCcy)
      );
      return filterList;
    },
    /**
     * 是否显示透支
     * 付款账户为往来账户就要显示可能透支
     */
    isShowOverBalance() {
      const {
        debitAcct
      } = this.formsData,
        target = this.debitAcctList.find(item => item.acctNo === debitAcct);
      if (target && target.typeLabel) {
        if (target.typeLabel === 'CURRENT') {
          return true;
        }
      }
      return false;
    },
    /**
     * 交易对应的银行币种
     */
    bankCcy() {
      return this.formsData.debitCcy;
    },
    /**
     * 授权信息展示
     */
    authInfo() {
      return this.formsData.authInfo;
    }
  },
  /** sub-watchers */
  watch: {
    dedutIndex(newVal) {
      if (newVal !== '') {
        // this.selectPoundPayAcct(newVal);
      } else {
        this.$set(this.formsData, 'chargeAcct', '');
        this.$set(this.formsData, 'chargeAcctName', '');
        this.$set(this.formsData, 'deductAcctName', '');
        this.$set(this.formsData, 'chargeCcy', 'HKD');
      }
    },
    'formsData.currbal'(newVal) {
      console.log('formsData.currbal', newVal);
    },
    /** 当付款账户状态发生变化时进行校验 */
    'debitStatus'() {
      this.checkDebitStatus();
    },
    'chargeStatus'() {
      this.checkChargeStatus();
    },
    isResultTo(newVal, oldVal) {
      if (this.isResultTo) {
        this.$set(this, 'formsData', {});
        this.handleReset();
        this.$emit('onChangeisResultTo', oldVal);
      }
    }
  },
  mounted() {
    if (this.$route.query.params) {
      this.jumpData = JSON.parse(this.$route.query.params)
      this.isJumpTo = this.jumpData.isJumpTo
      this.jumpData.tdId = this.$route.query.tdId
    } else {
      console.log('混入-------------》1')
    }
    this.init();

  },
  methods: {
    // 保存交易草稿
    async saveCraft(params = {}) {
      /**
       * @interface IParams param传递进来的参数
       * language: 'zh-CN' | 'zh_HK' | 'en'; // 当前语言
       * tdId: number | string; // 当前序号
       * temporaryStorageTime: number // 暂存时间
       * transactionText: string // 暂存内容的json字符串
       * transactionType: '1' | '2' | '3' | '4'; // 交易类型：1-行内转账；2-转数快；3-CHATS；4-电汇
       * uploadMethod: '0'| '1' // 上载方式：0-手工录入；1-文件上载
       */
      const validList = ['1', '2', '3', '4'];
      const { transactionType } = params;
      /** transactionType必须在validList中 */
      if (!validList.includes(transactionType)) {
        this.$message({
          type: 'fail',
          message: 'Lack of transactionType',
          duration: 2000
        });
        return;
      }
      const { body } = await addTransactionDraft({
        language: params.language || this.backendingLang,
        tdId: params.tdId || '0',
        temporaryStorageTime: params.temporaryStorageTime || getCurrentTimes(),
        transactionText: params.transactionText || JSON.stringify(this.formsData).replace('/', () => ''),
        transactionType,
        uploadMethod: params.uploadMethod || '0',
      });
      if (body) {
        this.$message({
          type: 'success',
          message: i18n.t('PAYMENT.SAVE_DRAFT_SUCCESS'),
          delay: 3000
        });
      }
    },
    /**
     * 附言校验
     * 1. 中文28位以内
     * 2. 英文140位以内
     **/
    commentValidate(r, val, cb) {
      if (!chineseInLimit(val, 28)) {
        cb(new Error('chiniese over limit'));
        return;
      }
      if (!englishInLimit(val, 140)) {
        cb(new Error('english over limit'));
        return;
      }

      cb();
    },
    /**
     * 选择付款账户后触发的事件
     */
    async selectDebitAcct(crtIdx) {

      if ([null, undefined].includes(crtIdx)) {
        return;
      }
      this.debitIndex = crtIdx;
      const tarItem = this.debitAcctList[crtIdx];

      if (!tarItem) return;
      const {
        acctNo,
        cur
      } = tarItem,
        result = await queryPayAccountBalance({
          accountNo: acctNo,
          currencyType: cur,
        });
      /** 1. 设置选中的付款账户的信息 */

      this.$set(this.formsData, 'debitCcy', tarItem.cur);
      this.$set(this.formsData, 'debitAcctLabel', tarItem.typeLabel || '');
      this.$set(this.formsData, 'debitAcct', tarItem.acctNo);
      this.$set(this.formsData, 'debitAcctName', tarItem.acctName);
      this.$set(this.formsData, 'accountType', tarItem.typeLabel || '');
      this.$set(this.formsData, 'bankInstitution', tarItem.bankInstitution);

      /** 判断并设置余额信息 */
      if (result) {
        /** 切换付款货币类型 */
        this.$set(this.formsData, 'creditCcy', result.currencyType || cur);
        this.$set(this.formsData, 'ccy', result.currencyType || cur);

        const balance = result.avaliableBalance;
        if (balance) {
          this.$set(this.formsData, 'currbal', balance);
        } else {
          this.formsData.currbal = '-1';
        }
        /** 设置账户类型 */
        this.$set(this, 'debitStatus', result.status);
      }
      /** 电汇需要同时设置收款账户 */
      // if (
      //   [
      //     '/bankTransfer/paymentSettlement/remittance'
      //   ].includes(this.$route.path)
      // ) {
      //   this.$set(this.formsData, 'creditAcct', this.confirmInfo.creditAcct || '');
      // }
    },
    /** 重置付款账户信息 */
    resetDebitAcct() {
      this.$set(this.formsData, 'debitAcct', '');
      this.$set(this.formsData, 'debitAcctName', '');
      this.$set(this.formsData, 'debitAcctLabel', '');
      this.$set(this.formsData, 'debitCcy', 'HKD');
    },
    // 选择手续费账户后触发的事件
    async selectPoundPayAcct(crtIdx) {
      console.log('crtIdx', crtIdx)
      const tarItem = this.chargeAcctList[crtIdx];
      if (tarItem) {
        const {
          acctNo,
          cur,
          acctName,
          typeLabel
        } = tarItem;
        const result = await queryPayAccountBalance({
          accountNo: acctNo,
          currencyType: cur,
        });
        /** 1.先设置手续费账户信息 */
        this.formsData.chargeCcy = cur;
        this.formsData.chargeAcct = acctNo;
        this.formsData.deductAcct = acctNo;

        this.formsData.deductAcctName = acctName;
        this.formsData.deductAcctType = typeLabel;
        /** 2. 设置手续费账户余额信息 */
        if (result) {
          const balance = result.avaliableBalance || 0;
          this.$set(this, 'chargeStatus', result.status || 'ACTIVE');
          if (balance) {
            this.formsData.deductAcctMoney = balance;
          } else {
            this.formsData.deductAcctMoney = '0';
          }
          if (this.pageType === '030103' || this.pageType === '03010202') {
            this.getChargeFeeOnline(cur)
          }
          setTimeout(() => {
            this.$refs['submitForm'] &&
              this.$refs['submitForm'].clearValidate();
            this.$refs['transferForm'] &&
              this.$refs['transferForm'].clearValidate();
          }, 0);
          this.$forceUpdate();
        }
      }
    },
    // getChargeFeeOnline----查询电汇、外币转账所需手续费，于费用扣款账户余额作对比
    async getChargeFeeOnline(cur) {
      let type = this.pageType
      const result = await getChargeFeeOnline({
        bsnCode: type
      });
      if (this.pageType === '030103') {
        if (result && (Number(result[0].discountAmt) > Number(this.formsData.deductAcctMoney))) {
          this.payIsExcee = 1
          this.$message({
            type: 'warn',
            message: i18n.t('PAYMENT.LACK_OF_BALANCE'),
            duration: 3000
          });
          return false;
        } else {
          this.payIsExcee = 0
        }
      } else if (this.pageType === '03010202') {
        let list = result.filter(item => {
          if (item.chargeCcy === cur) {
            return item
          }
        })
        if (list && (Number(list[0].discountAmt) > Number(this.formsData.deductAcctMoney))) {
          this.payIsExcee = 1
          this.$message({
            type: 'warn',
            message: i18n.t('PAYMENT.LACK_OF_BALANCE'),
            duration: 3000
          });
          return false;
        } else {
          this.payIsExcee = 0
        }
      }
    },
    /** 2022-06-07新增 校验手续费账户是否可用 */
    checkChargeStatus() {
      if (this.chargeStatus !== 'ACTIVE') {
        this.$message({
          type: 'fail',
          message: this.$t(`PAYMENT.CHARGE_ACCT_${this.chargeStatus}`),
          duration: 3000
        });
        return false;
      }
      return true;
    },
    /** 2022-05-16新增 校验付款账户是否可用 */
    checkDebitStatus() {
      if (this.debitStatus !== 'ACTIVE') {
        this.$message({
          type: 'fail',
          message: this.$t(`PAYMENT.DEBIT_ACCT_${this.debitStatus}`),
          duration: 3000
        });
        return false;
      }
      if (!this.checkChargeStatus()) {
        return false;
      }
      return true;
    },
    /** 选择收款账户后触发的事件 */
    selectedCreditAcct(value = '') {
      const tarItem = this.creditAcctList.find(item => item.value === value);
      if (tarItem) {
        // console.log('当前选择的收款账户信息: ', tarItem);
        this.$set(this.formsData, 'creditAcctLabel', tarItem.typeLabel);
        this.$set(this.formsData, 'creditAcct', tarItem.acctNo);
        this.$set(this.formsData, 'creditAcctName', tarItem.acctName);
        this.$set(this.formsData, 'creditBankCode', tarItem.bankInstitution);
      }
    },

    /** 工具方法-金钱转化成千分位的工具 */
    formatMoney(val) {
      const invalidList = [null, undefined, NaN];
      if (!invalidList.includes(val)) {
        return mathTools.addDecollator(val).toMoney();
      }
      return '0';
    },
    /** 工具方法-金钱转化成千分位的工具 */
    formatMoneyNew(val) {
      const invalidList = [null, undefined, NaN];
      if (!invalidList.includes(val)) {
        let num = val
        let money
        let dot = String(num).includes('.')
        if (!dot) {
          money = this.moneyFormat(num) + '.00'
        } else {
          const numStr = String((Math.round(num * 100) / 100).toFixed(2))
          dot = numStr.indexOf('.')
          const decimal = numStr.substr(dot + 1, 2)
          money = this.moneyFormat(numStr.substr(0, dot)) + '.' + decimal
        }
        return money;
      }
      return '0';
    },
    moneyFormat(num) {
      return String(num).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    },
    /** 重置授权列表 */
    initAuthSelect() {
      const authSelect = this.$refs['authSelect'];
      const formRef = this.$refs['transferForm'];

      if (authSelect) {
        authSelect.reset && authSelect.reset();
        this.clearLevelLists();
        // 因为授权提醒不是必输，所以在这 无需调用getLevelLimit
        // authSelect.getLevelLimit && authSelect.getLevelLimit();
      }

      if (formRef && formRef.clearValidate) {
        // setTimeout(() => {
        //   formRef.clearValidate();
        // }, 0);
      }
    },
    /**
     * 通过账户和币种设置索引值-付款账户
     */
    initDebitAcct(Acct, Ccy) {
      let debitAcct = ''
      let debitCcy = ''
      if (!Acct && !Ccy) {
        debitAcct = Acct
        debitCcy = Ccy
      } else {
        debitAcct = this.confirmData.debitAcct || this.confirmInfo.debitAcct
        debitCcy = this.confirmData.debitCcy || this.confirmInfo.debitCcy
      }
      const debitIndex = this.debitAcctList.findIndex(
        item =>
          String(item.acctNo).trim() === String(debitAcct).trim() &&
          String(item.cur).trim() === String(debitCcy).trim()
      );
      if (debitIndex >= 0 && this.debitAcctList.length > 0) {
        this.$set(this, 'debitIndex', debitIndex);
      } else if (debitIndex == -1 && this.debitAcctList.length > 0) {
        this.$set(this, 'debitIndex', 0);
      } else {
        this.$set(this, 'debitIndex', '');
      }
    },
    /**
     * 通过账户和币种设置索引值-扣款账号
     */
    initDedutAcct(Acct, Ccy) {
      const confirmData =
        Object.getOwnPropertyNames({ ...this.confirmData }).length ?
          this.confirmData :
          this.confirmInfo;
      let deductAcct = ''
      let chargeAcct = ''
      let chargeCcy = ''
      if (!Acct && !Ccy) {
        chargeAcct = Acct
        chargeCcy = Ccy
      } else {
        chargeAcct = confirmData.chargeAcct
        chargeCcy = confirmData.chargeCcy
        deductAcct = confirmData.deductAcct
      }
      const dedutIndex = this.chargeAcctList.findIndex(
        item =>
          String(item.acctNo).trim() === String(chargeAcct || deductAcct).trim() &&
          String(item.cur).trim() === String(chargeCcy).trim()
      )
      if (dedutIndex >= 0) {
        this.$set(this, 'dedutIndex', dedutIndex);
      }
    },
    /**
     * 操作交易
     */
    handleTradeConfirm(callback = this.handleNextStep) {
      callback();
      return;
    },
    /**
     * 设置账户信息列表
     */
    setAcctList(origin, target) {
      const self = this;
      if (Array.isArray(origin) && origin.length) {
        self.$set(
          self,
          target,
          // reduceAcctList
          origin.map(item => ({
            ...item,
            value: item.acctNo,
            label: `${formatAcctNo(item.acctNo)} ${
              // item.typeLabel === 'MULTICURRENCY' ? '' : ccyTool.ccyFilter(item.cur)
               ccyTool.ccyFilter(item.cur)
              } ${businessFilter.processAccountType(item.typeLabel)}`,
            bankInstitution:
              item.bankInstitution || self.$t('PAYMENT.CHUANGXING_BANK')
          }))
        );
      }
    },
    /** 修改收款人类型 */
    changeCreditType(creditType) {
      if (!this.isJumpTo) {
        this.$nextTick(() => {
          this.formsData.creditAcctLabel = '';
          this.formsData.creditAcct = '';
          this.formsData.creditAcctName = '';
          this.formsData.isShowRegistered = false;
          setTimeout(() => {
            this.$refs['submitForm'].clearValidate();
          }, 0);
        });
      }

    },
    /**
     * @override 處理交易的方法
     */
    handleNextStep() { },
    /**
     *  收款账户脱标去除空格
     */
    acctBlurFun() {
      let str = this.formsData.creditAcct
      if (typeof str === 'string' && str !== '') {
        this.$set(this.formsData, 'creditAcct', str.split(' ').join(''));
      }
    },
  }
};
