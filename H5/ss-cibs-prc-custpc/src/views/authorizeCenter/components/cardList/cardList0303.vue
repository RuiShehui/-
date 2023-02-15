<!--
 * @Author: zhangcheng
 * @Date: 2022-04-09 17:55:33
 * @LastEditTime: 2022-09-13 11:23:53
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList0303.vue
-->
<template>
  <div>
    <!-- 最近转账记录 -->
    <template v-if="renderComponent.length > 0">
      <component :is="renderComponent" :item="detailData" />
    </template>
  </div>
</template>

<script>
/**
 * item
 */
import CardList030101 from './cardList030101.vue';
import CardList03010201 from './cardList03010201.vue';
import CardList03010202 from './cardList03010202.vue';
import CardList030103 from './cardList030103.vue';
import CardList03010401 from './cardList03010401.vue';
import CardList03010501 from './cardList03010501.vue';

export default {
  name: 'CardList0303',
  components: {
    CardList030101,
    CardList03010201,
    CardList03010202,
    CardList030103,
    CardList03010401,
    CardList03010501
  },
  props: {
    item: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    detailData() {
      const { transactionDescribe = {} } = this.item,
        { transDetail = '{}' } = transactionDescribe;
      return {
        ...this.item,
        transactionDescribe: {
          ...JSON.parse(transDetail),
          ...transactionDescribe
        }
      };
    },
    bsnCode() {
      const { transactionDescribe } = this.item;
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
        return `cardList${this.bsnCode}`;
      }
      return '';
    }
  },
  mounted() {
    console.log(this.detailData);
  }
};
</script>

<style scoped lang="scss">
@import './common.scss';

@include status();
</style>