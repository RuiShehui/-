<!--
 * @Author: ZhangZhen
 * @Date: 2022-03-11 15:41:45
 * @LastEditTime: 2022-09-23 15:55:12
 * @LastEditors: Please set LastEditors
 * @Description: Zz's design
 * @FilePath: \ss-cibs-prc-custpc\src\views\bankTransfer\registerThirdAccount\localBankAccount\fast\fast-confirm.vue
-->
<style scoped lang="scss">
.fast-operate-confirm {
  padding: 0 5%;

  .confirm-detail-item {
    display: inline-block;
    width: 50%;
    padding: 8px 0 16px 0;
    text-align: center;
  }
}
</style>

<template>
  <div :class="['fast-operate-confirm', 'pt12']">
    <div class="m-detail-content mb20" v-if="propList.length > 0">
    
      <detail-item
        class="confirm-detail-item"
        v-for="(item, index) of propList"
        :key="`${index + 1} ${item.prop}`"
        :title="item.title"
        :content="item.content"
      />
     
    </div>
    <el-row class="flexc">
      <v-button size="w160" @click="handleLastStep" class="mr16">
        {{
        $t('COMMON.PREVIOUS_STEP')
        }}
      </v-button>
      <v-button type="primary" size="w160" @click="handleConfirm">
        {{
        $t('COMMON.CONFIRM')
        }}
      </v-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'FastAcctOperateConfirm',
  props: {
    propList: {
      type: Array,
      default() {
        return [];
      }
    },
    authInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  inject: ['entType'],
  mounted() {
    console.log(this.propList, 'propList');
  },
  methods: {
    handleLastStep(...args) {
      this.$emit('handleLastStep', ...args);
    },
    handleConfirm(...args) {
      this.$emit('handleConfirm', ...args);
    }
  }
};
</script>
