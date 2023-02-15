/*
 * @Author: ZhangZhen
 * @Date: 2021-11-08 11:48:15
 * @LastEditTime: 2022-01-13 14:14:15
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\utils\stategies.js
 */
import regExpTools from '@/utils/regExpTools';
import dateTools from '@/utils/dateTools';
import {
  isType,
  transToHighCamel
} from './tools';

const {
  validateIDCard,
  validateEmail,
  // validateMoney
} = regExpTools;

const {
  dateStrToNum,
  formatDate
} = dateTools;

/**
 * 校验规则集合
 * @param {Vue} ctx vue-component-context (for international)
 */
export default (ctx) => {
  /**
   * STR_NOT_EMPTY - 属性对应的字符串值不得为空
   * @param { string } label 需要校验的字段
   */
  const STR_NOT_EMPTY = (label, trigger = 'blur') => ([{
    required: true,
    // message: `请输入${label}!`,
    message: ctx.$t('COMMON.PLEASE_INPUT_SOMETHING', {
      label
    }),
    trigger,
  }]);
  /**
   * NUM_OVER_ZERO - 属性对应的数字值要大于0
   * @param { string } label 需要校验的字段
   */
  const NUM_OVER_ZERO = (label) => ({
    required: true,
    // message: `请选择${label}`,
    message: ctx.$t('COMMON.PLEASE_SELECT', {
      label
    }),
    type: 'number',
    min: 0
  });
  /**
   * ID_VALIDATOR - 校验身份证
   * @param { string } label 需要校验的字段
   */
  const ID_VALIDTOR = (label) => ({
    required: true,
    validator: (r, val, cb) => {
      if (!val.length) {
        cb(new Error(ctx.$t('COMMON.PLEASE_SELECT', {
          label
        })));
        return;
      }

      if (!validateIDCard(val)) {
        cb(new Error(ctx.$t('COMMON.SOMETHING_INVALID'), {
          content: `${label}`
        }));
        return;
      }

      cb();
    }
  });

  /**
   * EMAIL_VALIDATOR - 邮箱验证器
   * @param { string } label 需要校验的邮箱字段
   */
  const EMAIL_VALIDATOR = (label) => ({
    required: true,
    validator: (r, val, cb) => {
      if (!val.length) {
        cb(new Error(ctx.$t('COMMON.PLEASE_INPUT_SOMETHING', {
          label,
        })));
        return;
      }
      if (!validateEmail(val)) {
        cb(new Error(ctx.$t('COMMON.SOMETHING_INVALID'), {
          content: `${label}`
        }));
        return;
      }
      cb();
    }
  });

  /**
   * 校验金额是否合法
   */
  const IS_VALID_MONEY = (label) => ({
    required: true,
    validator: (r, val, cb) => {
      if (!val || !val.length) {
        cb(new Error(ctx.$t('COMMON.PLEASE_INPUT_SOMETHING', {
          label,
        })));
        return;
      }
      // if (!validateMoney(val)) {
      //   cb(new Error(`您输入的${label}不合法`));
      //   return;
      // }
      cb();
    }
  });

  /**
   * check-start-and-end 验证开始时间和结束时间
   * @param {} label 需要校验的字段
   * @param {{ startTime: string; endTime: string }} timespan 时间范围
   */
  const CHECK_START_AND_END = ({
    startTime,
    endTime
  }) => {
    const _startTime = dateStrToNum(startTime),
      _endTime = dateStrToNum(endTime);
    if (_startTime <= _endTime) {
      return false;
    }
    return true;
  }

  /**
   * start-in-two-year 开始时间是否在两年以内
   * @param {string} start
   */
  const START_IN_ONE_YEAR = (start) => {
    if (!start.toString().length) {
      return true;
    }
    const year =2 * 1000 * 3600 * 24 * 365;
    const startToNow = new Date().getTime() - new Date(start).getTime();
    if (startToNow <= year) {
      return true;
    }
    return false;
  }
  /**
   * timespan-in-90-day 时间范围是否在90天以内
   * @param {string} start 开始时间
   * @param {string} end 结束时间
   */
  const TIMESPAN_IN_90_DAY = (start, end) => {
    if (!start.toString().length && !end.toString().length) {
      return true;
    }
    const day = 1000 * 3600 * 24;
    const startToEnd = new Date(end).getTime() - new Date(start).getTime();

    if (startToEnd <= day * 90) {
      return true;
    }

    return false;
  }

  /**
   * check-is-exist-empty-time
   */
  const CHECK_TIME_SPAN = () => {
    return {
      required: true,
      validator: (r, val = ['', ''], cb) => {
        if (!val || !val.length || val.some(time => !time.length)) {
          // '开始时间或结束时间不得为空'
          cb(new Error(ctx.$t('COMMON.SHOULD_NOT_EMPTY', {
            content: ctx.$t(`COMMON.TIMESPAN`)
          })));
          return;
        }
        cb();
      }
    }
  }

  /**
   * 验证表单的时间范围
   * @description 1.判断时间范围是否存在 2.开始时间要选择在两年以内 3.时间范围要在90天以内
   */
  const TIMESPAN_VALIDATOR = () => {
    return {
      required: true,
      validator: (r, val, cb) => {
        if (!val) {
          cb(new Error(ctx.$t('PLEASE_SELECT', {
            label: ctx.$t('COMMON.TIMESPAN')
          })));
          return;
        }
        const [start, end] = val;
        if (!start || !start.toString().length) {
          cb(new Error(ctx.$t('PLEASE_SELECT', {
            label: ctx.$t('COMMON.START_TIME')
          })));
          return;
        }
        if (!end || !end.toString().length) {
          cb(new Error(ctx.$t('PLEASE_SELECT', {
            label: ctx.$t('COMMON.END_TIME')
          })));
          return;
        }
        if (!START_IN_ONE_YEAR(start)) {
          cb(new Error(ctx.$t('COMMON.START_TIME_IN_TWO_YEAR')));
          return;
        }
        if (!TIMESPAN_IN_90_DAY(start, end)) {
          cb(new Error(ctx.$t('COMMON.START_TIME_IN_90_DAYS')));
          return;
        }

        cb();
      }
    };
  }

  /**
   * check-discount-standard
   * @example CHECK_DISCOUNT_STANDARD()
   * @param {} 需要显示的label
   */
  const CHECK_DISCOUNT_STANDARD = (label) => {
    return {
      required: true,
      validator: (r, val, cb) => {
        const isNumberRule = /^[0-9]*(\.[0-9]{1,2})?$/;
        if (!val || !val.length) {
          cb(new Error(ctx.$t('COMMON.PLEASE_INPUT')));
          return;
        }
        if (!isNumberRule.test(val)) {
          cb(new Error(ctx.$t('BUSINES_MANAGE.DISCOUNT_MUST_BE_NUMBER_AND_LESS_THAN_TWO')));
          return;
        }
        if (Number(val) > 100) {
          cb(new Error(ctx.$t('BUSINESS_MANAGEMENT.DISCOUNT_MUST_IN_100')));
          return;
        }
        cb();
      }
    };
  }

  const CHECK_COMM_EPS_MERCHANT_BILLS = () => {
    const validator = (r, val, cb) => {
      /**
       * 判断是否为数字
       */
      const _checkIsNumber = (val, prop, cb) => {
        const testNumber = /\d/;
        if (val.find(item => !testNumber.test(item[prop]))) {
          cb(new Error(
            ctx.$t('COMMON.SHOULD_BE_NUMBER', {
              content: ctx.$t(`BUSINESS_MANAGEMENT.${transToHighCamel(prop)}`)
            })
          ));
        }
      }
      /**
       * 判断字段是否为空
       */
      const _checkChildIsEmpty = (val, prop, cb) => {
        if (
          val.find(item => !item[prop] || !item[prop].toString().length)
        ) {
          
          const errIdx = val.findIndex(item => !item[prop] || !item[prop].toString().length);
          cb(new Error(
            ctx.$t('COMMON.SHOULD_NOT_EMPTY', {
              content: `${
              ctx.$t(
                'COMMON.WHTCH_ORDER',
                { order: errIdx + 1 }
              )}${
                ctx.$t(`BUSINESS_MANAGEMENT.${transToHighCamel(prop)}`)}`
            }))); // `${errIdx || 0} NOT_EMPTY`
        }
      }
      /**
       * 判断日期是否为空
       */
      const _checkChildDate = (val, prop, cb) => {
        if((val[0].billEffectiveTime==''||val[0].billEffectiveTime==null) && (val[0].billFailureTime=='' ||val[0].billFailureTime==null)){
          return false
        }
        val.find((item, index) => {
          const dateVal = item[prop];
          if (!dateVal || !dateVal.toString().length) {
            cb(new Error(
              ctx.$t('COMMON.SHOULD_NOT_EMPTY', {
                content: `${
                ctx.$t(
                  'COMMON.WHTCH_ORDER',
                  { order: index + 1 }
                )}${
                  ctx.$t(`BUSINESS_MANAGEMENT.${transToHighCamel(prop)}`)}`
              })));
          }
        });
      }
      /**
       * 失效时间必须大于有效时间
       */
      const _checkEffectSpan = (timespan = ['billEffectiveTime', 'billFailureTime'], val, cb) => {
        if((val[0].billEffectiveTime==''||val[0].billEffectiveTime==null) && (val[0].billFailureTime=='' ||val[0].billFailureTime==null)){
          return false
        }
        const formatToDate = (origin) => {
          if (isType(origin, 'String')) {
            return origin;
          }
          if (isType(origin, 'Date')) {
            return formatDate(origin).split('-').join('');
          }
          return '';
        }

        val.find((item, index) => {
          const [startProp, endProp] = timespan;
          const start = Number(formatToDate(item[startProp]));
          const end = Number(formatToDate(item[endProp]));
          // console.log(start, end);
          if (end <= start) {
            cb(new Error(`${ctx.$t(
              'COMMON.WHTCH_ORDER',
              { order: index + 1 }
            )}${ctx.$t('BUSINESS_MANAGEMENT.EFFECTIVE_TIME_SPAN_INVALID')}`));
          }
        });
      }
      // 校验金额大小
      const _checkMiumAmount=((account=['minmiumAmount','maxmiumAmount'],val,cb)=>{
        console.log('val:',val);
        // console.log('minmiumAmount:',minmiumAmount);
        val.find((item,index)=>{
          const [minmiumAmount,maxmiumAmount]=account
          _checkIsNumber(val,'minmiumAmount', cb)
          _checkIsNumber(val,'maxmiumAmount', cb)
          const min=Number(item.minmiumAmount)
          const max=Number(item.maxmiumAmount)
          if(min<0){
            cb('最小必須大於0')
          }
          if(min<0){
            cb('最大必須大於0')
          }
          if(min>=max){
            cb('最小金額必須小於最大金額')
          }

        })

      })

      _checkChildIsEmpty(val, 'billNumberInfo', cb);
      _checkChildIsEmpty(val, 'billNumberInfoZht', cb);
      _checkChildIsEmpty(val, 'billNumberInfoEn', cb);
      _checkChildIsEmpty(val, 'billNumLimit', cb);
      _checkChildIsEmpty(val, 'minmiumAmount', cb);
      _checkChildIsEmpty(val, 'maxmiumAmount', cb);
      _checkIsNumber(val, 'billNumLimit', cb);
      _checkMiumAmount(['minmiumAmount','maxmiumAmount'],val,cb)
      
      _checkChildDate(val, 'billEffectiveTime', cb);
      _checkChildDate(val, 'billFailureTime', cb);
      _checkEffectSpan(['billEffectiveTime', 'billFailureTime'], val, cb);
      // _checkChildIsEmpty(val, 'chargingType', cb);
      // _checkChildIsEmpty(val, 'cardStanded', cb);
      cb();
    }

    return ['blur', 'change'].map(trigger => ({
      required: true,
      trigger,
      validator
    }));
  }

  return {
    STR_NOT_EMPTY,
    NUM_OVER_ZERO,
    ID_VALIDTOR,
    EMAIL_VALIDATOR,
    CHECK_START_AND_END,
    START_IN_ONE_YEAR,
    TIMESPAN_IN_90_DAY,
    CHECK_TIME_SPAN,
    TIMESPAN_VALIDATOR,
    IS_VALID_MONEY,
    CHECK_DISCOUNT_STANDARD,
    CHECK_COMM_EPS_MERCHANT_BILLS,
  };
};