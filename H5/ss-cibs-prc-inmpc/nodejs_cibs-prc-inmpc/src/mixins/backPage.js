/*
 * @Author: ZhangZhen
 * @Date: 2021-11-05 09:18:14
 * @LastEditTime: 2021-11-27 15:53:03
 * @LastEditors: zhangcheng
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-inmpc\src\mixins\backPage.js
 */
import {
  MessageBox
} from 'element-ui';

/**
 * back-page: from confirm-page to origin-page
 * @description back-page: 主要解决从确认页面n秒后返回主页面的逻辑 (默认timeout为5)
 */
export default {
  data() {
    return {
      /** timeout: back-timeout-time, default-value: 5 */
      timeout: 5
    };
  },
  computed: {
    returnTag() {
      return `${this.isAddZero(this.timeout)}秒后自动返回`;
    }
  },
  methods: {
    /**
     * if success: timeout-back
     * @param {string} path back-path (path-route)
     * @param {number} timeout back-timeout (s)
     */
    handleSuccessBack(timeout = 5, path = '', query = {}) {
      this.timeout = timeout;

      const handleCancel = () => {
        if (this.handleCancel) {
          this.handleCancel();
        }
        clearInterval(handleBackInterval);
      }

      const handleBackInterval = setInterval(() => {
        if (this.timeout > 1) {
          MessageBox({
            title: '提示',
            message: `操作成功, ${this.returnTag}`,
            type: 'success',
            showClose: true,
            beforeClose: (action, instance, done) => {
              switch (action) {
                case 'confirm':
                  handleCancel();
                  break;
                case 'cancel':
                  handleCancel();
                  break;
                default:
                  break;
              }
              MessageBox.close();
              done();
            },
          });
          this.timeout--;
        } else {
          if (path.length) {
            this.$router.push({
              path,
              query
            });
          }
          MessageBox.close();
          handleCancel();
        }
      }, this.timeout * 250);
    },
    /**
     * if fail: handle-error-back
     */
    handleErrorBack(operateName) {
      MessageBox({
        title: '提示',
        message: `${operateName}失败`,
        type: 'error',
        beforeClose: (action, instance, done) => {

          done();
        }
      });
    },
    /**
     * number-is-add-zero
     */
    isAddZero(originNumber) {
      if (originNumber < 10) {
        return '0' + originNumber.toString();
      }
      return originNumber.toString();
    }
  }
}