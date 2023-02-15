<!--
 * @Author: zhangcheng
 * @Date: 2022-04-09 18:19:21
 * @LastEditTime: 2022-08-22 19:26:52
 * @LastEditors: Please set LastEditors
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardDetail\cardDetail0303.vue
-->
<template>
  <div>
    <template v-if="renderComponent.length && Object.keys(tableData).length">
      <component
        :is="renderComponent"
        :tableData="combineTableData"
        :type="type"
        :creditType="creditType"
        :transactionType="transactionType"
        is-appointmant
        :authState="authState"
        @appointmant="appointmant"
        :scene="scene"
        :isProcess="isProcess"
      />
    </template>
  </div>
</template>

<script>
import CardDetail030101 from './cardDetail030101.vue';
import CardDetail03010201 from './cardDetail03010201.vue';
import CardDetail03010202 from './cardDetail03010202.vue';
import CardDetail030103 from './cardDetail030103.vue';
import CardDetail03010401 from './cardDetail03010401.vue';
import CardDetail03010501 from './cardDetail03010501.vue';
import { updateScheduleDateAuth } from '@/api/reservationTransaction';
export default {
  name: 'CardDetail0303',
  components: {
    CardDetail030101,
    CardDetail03010201,
    CardDetail03010202,
    CardDetail030103,
    CardDetail03010401,
    CardDetail03010501
  },
  props: {
    tableData: {
      type: Object,
      default() {
        return {};
      }
    },
    authState: {
      type: String,
      default: ''
    },
    type: {
      type: Number,
      default: 0
    },
    scene: {
      type: String,
      default: '0'
    },
    res: {
      type: Object,
      default() {
        return {};
      }
    },
    stt: {
      type: String,
      default: ''
    },
    creditType: {
      type: String,
      default: '3'
    },
    isProcess: {
      type: Boolean,
      default: false
    },
    transactionType: {
      type: String,
      deault: ''
    }
  },
  computed: {
    combineTableData() {
      const { transactionDescribe = {} } = this.tableData,
        { transDetail = '{}' } = transactionDescribe;
      return {
        ...this.tableData,
        transactionDescribe: {
          ...JSON.parse(transDetail),
          ...transactionDescribe
        }
      };
    },
    bsnCode() {
      const { transactionDescribe } = this.tableData;
      if (
        transactionDescribe &&
        transactionDescribe.hasOwnProperty('bsnCode')
      ) {
        return transactionDescribe.bsnCode;
      }
      return '';
    },
    renderComponent() {
      if (this.bsnCode && this.bsnCode.length > 0) {
        return `cardDetail${this.bsnCode}`;
      }
      return '';
    }
  },
  mounted() {
    console.log('是否会先过这里，在进入详情页二面');
    this.tableData.transactionDescribe = this.stt
      ? JSON.parse(this.res.transactionDescribe)
      : this.tableData.transactionDescribe;
    console.log(this.transactionType, 'this.tableData');
  },
  methods: {
    async appointmant(data) {
      const result = await updateScheduleDateAuth(data);
      console.log('result', result);
      if (result.head.returnCode === '000000') {
        this.$router.replace({
          path: '/authorizeCenter/result',
          query: { resultList: [result.body.authResultInfo] }
        });
      }
    }
  }
};
</script>

<style>
</style>