/*
 * @Author: ZhangZhen
 * @Date: 2022-05-25 17:27:22
 * @LastEditTime: 2022-05-25 17:33:15
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\components\messageBox\libs\messageBox.mixin.js
 */
export default {
  data() {
    return {
      /** 是否展示messageBox */
      isShow: false,
      /** messageBox的配置 */
      text: {
        title: '',
        isIcon: true,
        type: 'warn',
        message: '内容',
        btnText: {
          cancleText: '取消',
          confirmText: '确定'
        },
        isCancle: false,
        overLoad: false
      }
    };
  },
  computed: {
    /** 提示框里面的图标 */
    showIcon() {
      if (this.text) {
        if (this.text.type === 'warn') {
          return 'warning';
        }
        if (this.text.type === 'loginOut') {
          return 'logonOut';
        }
        return this.text.type;
      }
      return 'warn';
    }
  },
  methods: {
    /**
     * 点击确认时的回调事件
     */
    onConfirm() {
      console.log('on confirm', this.$options.name);
    },
    /**
     * 点击取消时的回调事件
     */
     onCancel() {
      console.log('on cancel', this.$options.name);
    }
  }
};