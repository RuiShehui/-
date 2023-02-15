<!--
 * @Author: ZhangZhen
 * @Date: 2021-12-31 10:42:29
 * @LastEditTime: 2022-06-09 09:35:25
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\quota\add.vue
-->
<template>
  <div class="contain">
    <level-page
      :table-data="showClazzList"
      :prop="customerClazzCode"
      @setSubmitData="handleUpdateClazzList"
    />
    <footer class="g-bottom">
      <el-button @click.native="handleBack">{{ $t('COMMON.CANCEL') }}</el-button>
      <el-button type="primary" @click.native="handleSubmit">{{ $t('COMMON.SUBMIT') }}</el-button>
    </footer>
  </div>
</template>

<script>
import LevelPage from './components/level-page';

import { addLimitItem } from '@/api/business-management';
import { formatTreeData } from '@/utils/tools';
import _ from 'lodash';

export default {
  name: 'QuotaAdd',
  components: {
    LevelPage
  },
  data() {
    return {
      customerClazz: '0',
      // 上一个级别的数据
      lastClazzList: [],
      // 本次级别的数据
      clazzList: []
    };
  },
  computed: {
    routeParams() {
      const { params = {} } = this.$route;
      return params;
    },
    customerClazzCode() {
      return String.fromCharCode(Number(this.customerClazz) + 65);
    },
    /** 显示的树形数据 */
    showClazzList() {
      if (this.clazzList.length) {
        return formatTreeData(this.clazzList, 'tradeTypeSmall', 'tradeType');
      }
      return [];
    }
  },
  watch: {},
  mounted() {
    this.setCrtData();
  },
  methods: {
    setCrtData() {
      const isValid = Object.keys(this.routeParams).length > 0;
      if (!isValid) {
        this.$router.push({
          name: 'qouta'
        });
      }
      const {
        updateCustomerClazz = '0',
        lastClazzList = '[]'
      } = this.routeParams;

      this.customerClazz = String(Number(updateCustomerClazz) + 1);
      /* 缓存上次级别的数据 */
      this.lastClazzList = [];
      this.lastClazzList.push(...JSON.parse(lastClazzList));
      /* 第一次级别的数据作为初始数据 */
      this.clazzList = [];
      this.clazzList.push(...JSON.parse(lastClazzList));
    },
    handleUpdateClazzList({ levelTypeData = {} }) {
      if (levelTypeData.bankLimitCode) {
        const targetIdx = this.clazzList.findIndex(
          item => item.bankLimitCode === levelTypeData.bankLimitCode
        );
        if (targetIdx > -1) {
          this.$set(
            this.clazzList[targetIdx],
            'limitDaily',
            levelTypeData.limitDaily || ''
          );
          if (this.clazzList[targetIdx].limitSingleStart) {
            this.clazzList[targetIdx].limitSingleStart =
              levelTypeData.limitSingleStart || '';
          }
          if (this.clazzList[targetIdx].limitSingleEnd) {
            this.clazzList[targetIdx].limitSingleEnd =
              levelTypeData.limitSingleEnd || '';
          }
        }
      }
    },
    handleSubmit() {
      const list = _.cloneDeep(this.clazzList).map(item => {
        // delete item.bankLimitCode;
        // delete item.children;

        return item;
      });
      if (this.handleValidate(list)) {
        this.$showBox({
          content: `${this.$t('MENU_PAGE_ITEMS.ADD_BANK_QUOTA')}?`,
          confirm: () =>
            this.confirmSubmit({
              list,
              customerClazz: this.customerClazz
            })
        });
      }
    },
    async confirmSubmit(submitData) {
      const result = await addLimitItem(submitData);

      if (result.body && result.body === true) {
        this.$showMsg({
          type: 'success',
          message: this.$t('COMMON.ADD_SUCCESS')
        });
      }
      setTimeout(() => {
        this.$store.commit(
          'tabs/DELETE_TABS',
          '/businessMangament/addBankQuota'
        );

        this.$router.push({
          name: 'qouta'
        });
      }, 3000);
    },
    handleValidate(targetList) {
      const inputList = targetList.filter(
        item => item.tradeType && Number(item.tradeType) !== 0
      );
      // const lastItem = inputList[inputList.length - 1];
      const lastItem = inputList.find(item => item.tradeTypeSmall === '0301');

      /* 每日交易限额均不得为空 */
      if (inputList.some(item => !item.limitDaily || !item.limitDaily.length)) {
        this.$showMsg({
          message: this.$t('BUSINESS_MANAGEMENT.QUOTA_NOT_ALLOW_EMPTY'),
          type: 'error'
        });
        return false;
      }
      /* 最后一项的单笔交易限额不得为空 */
      if (!lastItem.limitSingleStart || !lastItem.limitSingleStart.length) {
        this.$showMsg({
          message: this.$t('BUSINESS_MANAGEMENT.QUOTA_NOT_ALLOW_EMPTY'),
          type: 'error'
        });
        return false;
      }
      /* 最后一项的单笔交易限额不得为空 */
      if (!lastItem.limitSingleEnd || !lastItem.limitSingleEnd.length) {
        this.$showMsg({
          message: this.$t('BUSINESS_MANAGEMENT.QUOTA_NOT_ALLOW_EMPTY'),
          type: 'error'
        });
        return false;
      }
      /** 交易限额范围合法性 */
      if (Number(lastItem.limitSingleEnd) < Number(lastItem.limitSingleStart)) {
        this.$showMsg({
          message: this.$t('BUSINESS_MANAGEMENT.END_TIME_AND_START_TIME'),
          type: 'error'
        });
        return false;
      }
      /** 当前的限额要比之前的限额大 */
      // if (this.lastClazzList.some((item, index) => item.limitDaily < targetList[index])) {}
      return true;
    },
    handleBack() {
      this.$router.push({
        name: 'qouta'
      });
    }
  }
};
</script>

<style scoped lang="scss">
.contain {
  background: #fff;
  padding: 32px 24px;
  min-height: 100%;
  min-width: 600px;
  .g-bottom {
    margin: 40px;
    text-align: center;
    button {
      width: 210px;
      height: 40px;
      border-radius: 4px;
      font-size: 18px;
      border-color: #f06b00;
    }
    .f-cancel {
      color: #f06b00;
    }
  }
}
</style>