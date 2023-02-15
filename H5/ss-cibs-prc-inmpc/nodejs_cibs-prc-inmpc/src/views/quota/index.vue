<!--
 * @Autor: 赵霖
 * @Date: 2021-10-22 10:33:23
 * @LastEditors: ZhangZhen
 * @LastEditTime: 2022-06-08 11:28:01
 * @Description: 银行限额设置--银行限额列表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\quota\index.vue
-->
<template>
  <div class="g-quota">
    <main class="u-tabs">
      <el-tabs v-model="customerClazz" @tab-click="handleSwitchTab">
        <el-tab-pane
          v-for="(value, prop, index) in tableDataMap"
          :key="prop"
          :label="$t(`BUSINESS_MANAGEMENT.${prop}_LEVEL`)"
          :name="String(index)"
          class="g-level-tab"
          @setSubmitData="setSubmitData"
        >
          <level-page :tableData="tableDataMap[prop]" :levelType="prop" />
        </el-tab-pane>
        <el-tab-pane name="add" label="add">
          <el-button slot="label" @click.native="handleAddQuota">+</el-button>
        </el-tab-pane>
      </el-tabs>
    </main>
    <div class="g-bottom" v-if="customerClazz !== 'add'">
      <el-button type="primary" @click="handleSubmit">{{ $t('COMMON.SUBMIT') }}</el-button>
    </div>
    <article class="article">
      <p>
        <span class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</span>
        {{$t('BUSINESS_MANAGEMENT.EPS_BUSINESS_TIP')}}
      </p>
    </article>
  </div>
</template>

<script>
import LevelPage from './components/level-page';
import {
  getLimitList as requestListFn,
  getLimitLevels,
  setLimitList
} from '@/api/business-management';
import { formatTreeData, deepClone, isType } from '@/utils/tools';
// import regExpTools from '@/utils/regExpTools';

// const { validateMoney } = regExpTools;

function sortClazzList(origin) {
  // 从小到大排序
  var target = [],
    item;

  for (var i = 0; i < origin.length; i++) {
    item = origin[i];
    if (!target.length) {
      target.push(item);
    } else {
      var lastItem = target[target.length - 1];
      if (Number(lastItem) <= Number(item)) {
        target.push(item);
      } else {
        var insertIndex = target.findIndex(cz => Number(cz) > Number(item));
        target.splice(insertIndex, 0, item);
      }
    }
  }

  return target;
}

export default {
  name: 'QuotaIndexPage',
  components: {
    LevelPage
  },
  data() {
    return {
      customerClazz: '0',
      originData: [],
      tableDataMap: {
        // A: [],
        // B: [],
        // C: [],
        // D: [],
        // E: [],
        // F: [],
        // G: [],
        // H: [],
      },
      loading: false
    };
  },
  computed: {
    submitData() {
      const _prev = [],
        _submitData = [];

      const currentLevel = _getLevels(this.customerClazz);

      Object.keys(this.tableDataMap).forEach(k => {
        // this.tableDataMap[k].forEach((item) => {
        //   _prev.push(item);
        // });
        k === currentLevel &&
          this.tableDataMap[k].forEach(item => {
            _prev.push(item);
          });
      });
      _formatSimplify(_prev);
      return _filterSubmitData(_submitData);

      function _formatSimplify(list = []) {
        list.forEach(item => {
          _submitData.push(item);
          if (item.children && item.children.length) {
            _formatSimplify(item.children);
          }
        });
      }
      function _filterSubmitData(submitData) {
        return submitData
          .filter(item => parseInt(item.viewFlag) > 0)
          .map(item => {
            return {
              ...item
            };
          });
      }
      function _getLevels(clazz) {
        return String.fromCharCode(Number(clazz) + 65);
      }
    }
  },
  watch: {
    // submitData(newVal) {
    //   console.log(newVal);
    // }
  },
  async mounted() {
    this.getLevels();
  },
  methods: {
    requestListFn,
    handleSwitchTab({ $vnode }) {
      const { customerClazz = '0' } = $vnode.context;
      this.getContentData({ customerClazz });
    },
    async getLevels() {
      const result = await getLimitLevels(),
        { body } = result;
      if (isType(body, 'Array') && body.length) {
        const filterClazzList = sortClazzList(
          body.map(item => item.customerClazz)
        );

        for (let customerClazz of filterClazzList) {
          const level = String.fromCharCode(Number(customerClazz) + 65);
          this.$set(this.tableDataMap, level, []);
        }
        this.getContentData();
      }
    },
    async getContentData(params = { customerClazz: '0' }) {
      // customerClazz: '0' | '1' | '2' // -> A | B | C
      this.loading = true;
      try {
        const result = await this.requestListFn(params),
          level = String.fromCharCode(Number(params.customerClazz) + 65);
        // console.log(level);
        if (result.hasOwnProperty('body') && result.body) {
          const list = result.body;
          list.map(item => {
            if (item.tradeTypeSmall === '010101') {
              item.tradeTypeSmallS = '0103';
              item.tradeTypeS = '01';
            } else if (item.tradeTypeSmall === '010201') {
              item.tradeTypeSmallS = '0104';
              item.tradeTypeS = '01';
            } else {
              item.tradeTypeSmallS = item.tradeTypeSmall;
              item.tradeTypeS = item.tradeType;
            }
          });
          let formatList = formatTreeData(
            list,
            'tradeTypeSmallS',
            'tradeTypeS'
          );
          this.originData = [...list];
          this.$set(this.tableDataMap, level, formatList);
        }
      } catch (err) {
        this.$showMsg({
          message: err,
          type: 'error'
        });
      }
      this.loading = false;
    },
    setSubmitData({ levelType, levelTypeData }) {
      this.$set(this.tableDataMap, levelType, levelTypeData);
    },
    handleValidate(submitData) {
      const inValid = submitData.some(item => {
        if (!item.limitDaily.length) {
          this.$showMsg({
            type: 'error',
            message: '您填寫的每日交易總限額不合法'
          });
          return true;
        }
        // if (!item.limitSingleStart.length) {
        //   this.$showMsg({
        //     type: 'error',
        //     message: '您填写的单笔交易限额不合法'
        //   });
        //   return true;
        // }
        if (parseInt(item.limitDaily) < parseInt(item.limitSingleStart)) {
          console.log(
            item.limitDaily,
            item.limitSingleStart,
            'item.limitSingleStart'
          );
          this.$showMsg({
            type: 'error',
            message: '單筆限額不得大於每日交易總限額'
          });
          return true;
        }
        if (Number(item.limitSingleStart) > Number(item.limitSingleEnd)) {
          this.$showMsg({
            type: 'error',
            message: '您填寫的單筆交易限額範圍不合法'
          });
          return true;
        }
        return false;
      });
      if (inValid) {
        return false;
      }
      return true;
    },
    handleSubmit() {
      const isEmpty = Object.getOwnPropertyNames(this.tableDataMap).some(
        k => this.tableDataMap[k] === ''
      );
      if (isEmpty) {
        this.$shsowMsg({
          message: this.$t('BUSINESS_MANAGEMENT.QUOTA_NOT_ALLOW_EMPTY'),
          type: 'error'
        });
        return;
      }
      // console.log(this.submitData, JSON.stringify(this.submitData));
      // , Object.prototype.toString.call(this.submitData)
      if (this.handleValidate(this.submitData)) {
        // console.log(this.submitData);
        this.$showBox({
          content: '確認保存修改?',
          confirm: () => {
            this.confirmSubmit(this.submitData);
          }
        });
      }
    },
    async confirmSubmit(submitData) {
      try {
        const result = await setLimitList({
          list: submitData,
          customerClazz: this.customerClazz
        });
        if (result.body) {
          this.$showMsg({
            message: '銀行限額設置提交成功',
            type: 'success'
          });
        }
      } catch (err) {
        this.$showMsg({
          message: `錯誤: ${err}`,
          type: 'error'
        });
      }
    },
    /**
     * 新增级别
     */
    async handleAddQuota() {
      const tableDataMap = deepClone(this.tableDataMap);
      const tableDataMapList = Object.getOwnPropertyNames(tableDataMap);

      const updateCustomerClazz = String(tableDataMapList.length - 1),
        lastCustomerClazz = String(tableDataMapList.length - 1),
        result = await this.requestListFn({ customerClazz: lastCustomerClazz }),
        { body } = result;

      if (body) {
        const lastClazzList = JSON.stringify(body || '[]');
        this.$router.push({
          name: 'AddBankQuota',
          params: {
            updateCustomerClazz,
            lastClazzList
          }
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.g-quota {
  padding: 32px 24px;
  box-sizing: border-box;
  background: #fff;
  min-height: 100%;
  position: relative;
}
.u-tabs {
  /deep/ .el-tabs__item {
    text-align: center;
    width: 138px;
    padding-left: 20px;
  }
  /deep/ .el-tabs__item.is-active,
  /deep/ .el-tabs__item:hover {
    color: #f06b00 !important;
  }
}
.g-bottom {
  margin: 40px 0 50px;
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
.article {
  position: absolute;
  bottom: 32px;
  left: 24px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  .note {
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>