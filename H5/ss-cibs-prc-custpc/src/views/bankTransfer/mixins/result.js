/*
 * @Author: ZhangZhen
 * @Date: 2022-02-23 14:55:21
 * @LastEditTime: 2022-06-20 11:54:32
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\mixins\result.js
 */
/** result-page mixin */
import OperateResult from '@/components/common/operateResult';

export default {
  component: {
    OperateResult
  },
  props: {
    resultInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    payType: String,
  },
  inject: ['entType'],
  computed: {
    isSuccess() {
      const {
        body,
        authResultInfo
      } = this.resultInfo;
      console.log('this.resultInfo----result------isSuccess',this.resultInfo)

      if (
        authResultInfo &&
        authResultInfo.hasOwnProperty('authResultState') &&
        ['90', '96', '60', '03'].includes(authResultInfo.authResultState)
      ) {
        /** 授权用户校验成功 */
        return true;
      }

      return false;
    },
    // 结果状态
    resultType() {
      if (this.isSuccess) {
        return 'success';
      }
      return 'fail';
    },
    // 结果提示标题
    resultTitle() {
      if (this.isSuccess) {
        return this.$t('COMMON.SUBMIT_SUCCESS');
      }
      return this.$t('COMMON.SUBMIT_FAIL');
    },
    // 结果返回显示的信息
    resultMessage() {
      const {
        authResultInfo
      } = this.resultInfo;
      if (authResultInfo) {
        const {
          returnMessage = '',
          hostMessage = '',
          authResultState = ''
        } = authResultInfo;
        return `${authResultState}`;
      }

      return 'Error';
    },
    // 交易结果描述
    resultDescribe() {
      if (this.isSuccess) {
        return `${this.$t('PAYMENT.WEBBANK_REF_NO')} :` + `${this.flowNum || 'null'}`;
      }

      return '';
    },
    // 交易流水号
    flowNum() {
      const {
        body,
        authResultInfo
      } = this.resultInfo;
      if (body && body.hasOwnProperty('flowNum')) {
        return body.flowNum;
      }
      if (authResultInfo && authResultInfo.hasOwnProperty('flowNo')) {
        return authResultInfo.flowNo;
      }

      return '';
    },
    // 交易结果
    authResultState() {
      const {
        authResultInfo
      } = this.resultInfo;
      if (
        authResultInfo &&
        authResultInfo.hasOwnProperty('authResultState')
      ) {
        return authResultInfo.authResultState;
      }

      return '';
    },
    order() {
      const {
        body,
        authResultInfo
      } = this.resultInfo;
      if (body && body.hasOwnProperty('authResultMessage')) {
        return body.authResultMessage;
      }
      if (authResultInfo && authResultInfo.hasOwnProperty('flowNo')) {
        return authResultInfo.authResultMessage;
      }

      return '';
    },
    // 是否为单式权限授权
    authorized() {
      // const { authResultInfo } = this.resultInfo;
      // if (Object.getOwnPropertyNames(authResultInfo).length) {
      //   return true;
      // }
      // return false;
      return this.entType === 1 ? false : true;
    }
  },
  methods: {
    // 完成
    handleFinish() {
      this.$emit('clickBack');
    },
    // 生成PDF (需要文件系统接口)
    downLoadPDF() { },
    // 返回
    handleBack() {
      this.$emit('clickBack');
    }
  }
};