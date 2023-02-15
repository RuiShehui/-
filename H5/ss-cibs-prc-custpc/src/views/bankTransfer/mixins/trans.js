/*
 * @Author: ZhangZhen
 * @Date: 2022-03-08 14:02:39
 * @LastEditTime: 2022-06-01 09:29:08
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \webbank-pc\src\views\bankTransfer\mixins\trans.js
 */
import { mapState } from 'vuex';

/**
 * 单笔转账外层页面的公共逻辑
 */
export default {
  inject: [
    /** 清除授权选择的信息 (针对`auth-select`组件) */
    'clearLevelLists',
    /** 设置页面回到顶部 */
    'scrollToTop',
    /** MAM账户发送信息到授权提醒人邮箱的方法 */
    'sendEmail',
    /** 个人账户类型 ( 1-非授权账户; 2-授权账户 ) */
    'entType',
  ],
  data() {

    const ctx = this;

    return {
      /** 结果页面返回标识符*/ 
      isResultTo:false,
      /** 当前步骤 (0-填写; 1-确认; 2-结果) */
      activeIndex: 0,
      /** 转账所需要的数据 */
      transferInfo: {},
      /** 结果页需要展示的数据 */
      resultData: {},
      /** 顶部步骤提示列表 (0-填写; 1-确认; 2-结果) */
      stepsList: [
        {
          title: ctx.$t('PAYMENT.FILL_TRANSFER_INFO'),
          description: ''
        },
        {
          title: ctx.$t('PAYMENT.CONFIRM_TRANSFER_INFO'),
          description: ''
        },
        {
          title: ctx.$t('PAYMENT.SUBMIT_RESULT'),
          description: '',
          status: ''
        }
      ],
    };
  },
  computed: {
    /**
     * 使用mapState获取当前是否正处于请求状态的变量
     */
    ...mapState('app', ['requestLoading']),
    /**
     * 当前活跃路由的query字面量
     * @example this.$route.query || {}
     */
    routeQuery() {
      const { query } = this.$route;
      return query || {};
    },
    /**
     * 草稿数据 (用于获取保存草稿后的数据)
     * @example JSON.parse(this.$route)
     */
    draftFormData() {
      const { params, tdId = '' } = this.routeQuery;
      if (params) {
        return {
          ...JSON.parse(params),
          tdId,
        };
      }
      return {};
    },
    /**
     * pdf element (PDF实例对应的元素)
     * @return {HTMLDivElement} 元素节点
     */
    pdfContent() {
      return this.$refs['confirmInfo'].$refs['pdf'];
    }
  },
  watch: {
    /**
     * 公共逻辑-当页面发生切换时, 自动回到页面顶部
     */
    activeIndex() {
      this.scrollToTop();
    }
  },
  mounted() {
    /**
     * 当页面组件挂载时
     * 1. 回到页面顶部
     * 2. 清除之前选择的授权人信息
     * 3. 判断并设置但不仅限于草稿数据 (草稿数据; 最近转账-再转一笔; 授权取消后重新交易;)
     */
    this.scrollToTop();
    this.clearLevelLists();
    this.setDraftFormData();
  },
  activated() {
    /**
     * 当页面重新被激活时 (需要在KeepAliveComponents中设置, 目前没有用到)
     * 1. 回到页面顶部
     * 2. 清除之前选择的授权人信息
     */
    this.scrollToTop();
    this.clearLevelLists();
  },
  methods: {
    /** 设置草稿数据 */
    setDraftFormData() {
      this.$nextTick(() => {
        this.$set(this, 'transferInfo', this.draftFormData);
      });
    },
    /**
     * 根据pdfEl设置下载pdf
     * 1. 判断标题和pdfEl是否存在
     * 2. 使用`Vue.prototype.$pdf`下载或预览PDF
     **/
    downloadPDF(title) {
      console.log('this.pdfContent',(this.pdfContent))
      let pdfStr = this.pdfContent.innerHTML
      if(pdfStr.indexOf('http')> -1  || pdfStr.indexOf('HTTP')> -1 ){

        return
      }
      if (!title || !this.pdfContent) {
        return;
      }
      this.$pdf({ title }).download(
        this.pdfContent
      );
    },
    /**
     * 结果页跳回第一步
     * 1. 清空转账页面的信息
     * 2. 跳回并重新渲染第一步的页面
     */
     backToFirstStep() {
      this.$set(this, 'transferInfo', {});
      this.activeIndex = 0;
      this.isResultTo = true;
    }
  },
};