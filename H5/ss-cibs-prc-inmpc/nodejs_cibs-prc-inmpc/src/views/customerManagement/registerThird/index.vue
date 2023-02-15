<!--
 * @Author: ZhangZhen
 * @Date: 2021-11-22 09:35:32
 * @LastEditTime: 2022-05-16 14:34:31
 * @LastEditors: ZhangZhen
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\registerThird\index.vue
-->
<template>
  <div class="contain">
    <customer-query ref="cusQuery" v-show="stepIdx === 0" @showIndex="changeStepIdx" />
    <el-tabs v-if="stepIdx === 1" v-model="activeName" type="card">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.BANK_INSIDE_ACCOUNT')" name="1">
        <inside-transfer v-if="activeName === '1'" />
      </el-tab-pane>
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.OVER_BANK_ACCOUNT')" name="2">
        <local-transfer v-if="activeName === '2'" />
      </el-tab-pane>
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.ELEC_TRAN_ACCOUNT')" name="3">
        <elec-transfer v-if="activeName === '3'" />
      </el-tab-pane>
    </el-tabs>
    <footer v-show="stepIdx === 1" class="g-btn-group">
      <el-button class="m-op-btn back" @click="handleBack">{{ $t('COMMON.BACK') }}</el-button>
    </footer>
    <article class="article" v-show="stepIdx === 1">
      <p>
        <span class="note">{{$t('CUSTOMER_MANAGEMENT.NOTE')}}</span>
        {{$t('CUSTOMER_MANAGEMENT.REGISTER_THIRD_TIP')}}
      </p>
    </article>
  </div>
</template>

<script>
import InsideTransfer from './pages/inside-transfer';
import LocalTransfer from './pages/local-transfer';
import ElecTransfer from './pages/elec-transfer';

import { createNamespacedHelpers } from 'vuex';

const { mapState } = createNamespacedHelpers('tabs');

export default {
  name: 'RegisterThirdDetail',
  components: {
    InsideTransfer,
    LocalTransfer,
    ElecTransfer
  },
  data() {
    return {
      stepIdx: 0,
      activeName: '1'
    };
  },
  computed: {
    ...mapState(['openedTabs']),
    isAutoHref() {
      const inHomeTabs = this.openedTabs.some(item =>
          item.name.includes('RegisterThird')
        ),
        ebankCstmNo = sessionStorage.getItem('ebankCstmNo') || '';
      if (ebankCstmNo.length && inHomeTabs) {
        return true;
      } else {
        sessionStorage.removeItem('ebankCstmNo');
      }
      return false;
    }
  },
  created(){
    if (this.$route.query.activeName === '3') {
      this.activeName = '3'
    }else if (this.$route.query.activeName === '2'){
      this.activeName = '2'
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    changeStepIdx({ ebankCstmNo }) {
      sessionStorage.setItem('ebankCstmNo', ebankCstmNo);
      this.stepIdx = 1;
    },
    init() {
      this.initStep();
    },
    initStep() {
      if (this.isAutoHref) {
        this.stepIdx = 1;
      } else {
        this.stepIdx = 0;
        this.setCusQuery();
      }
    },
    handleBack() {
      this.stepIdx = 0;
      this.setCusQuery();
    },
    setCusQuery() {
      const { form } = this.$refs.cusQuery;
      if (form && form.hasOwnProperty('ebankCstmNo')) {
        form.ebankCstmNo = sessionStorage.getItem('ebankCstmNo');
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.contain {
  min-width: 600px;
  padding: 32px 24px;
  background: #fff;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
  .g-btn-group {
    width: 100%;
    text-align: center;
    margin: 40px 0;
    .m-op-btn {
      width: 210px;
      background-color: #f06b00;
      color: #fff;
    }
  }
}
.article {
  position: absolute;
  bottom: 12px;
  left: 24px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  .note {
    color: rgba(0, 0, 0, 0.85);
  }
}

::v-deep .el-tabs__header {
  margin-bottom: 40px;
}
</style>