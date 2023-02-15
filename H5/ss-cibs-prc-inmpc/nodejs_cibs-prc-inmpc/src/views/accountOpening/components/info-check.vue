<!-- 信息检查 -->
<template>
  <div class="transverse-table">
    <div class="row">
      <div id="title">{{ $t('RAO_CHECK.INFO_CHECK') }}</div>
    </div>
    <div class="row" v-for="(item, index) in infoCheckList" :key="index">
      <div class="w-60 bgc-fff">{{ item.label }}</div>
      <div>{{ item.result }}</div>
      <div class="bgc-fff">
        <el-radio-group v-model="scoreResult[item.expressionName]" v-if="!checkboxDisabeld">
          <el-radio :label="'Y'">{{ $t('RAO_CHECK.PASS') }}</el-radio>
          <el-radio :label="'N'">{{ $t('RAO_CHECK.REFUSE') }}</el-radio>
        </el-radio-group>
        <span v-else>{{ scoreResult[item.expressionName] === 'Y' ? $t('RAO_CHECK.PASS') : scoreResult[item.expressionName] === 'N' ? $t('RAO_CHECK.REFUSE') : '' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getRoleDetail } from '@/utils/user';

export default {
  name: 'InfoCheck',
  components: {
  },
  props: {
    operateType: {
      type: String,
      default: () => ''
    }, // 操作类型
    custInfoScoreResultVos: {
      type: Array,
      default: () => []
    },
    scoreResult: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      infoCheckList: [
        {
          expressionName: "OCR_UPDATE_CHECK",
          label: this.$t('RAO_CHECK.INFO_CHECK_ITEM1'),
          result: '',
          disabled: false
        },
        {
          expressionName: "EKYC_CHECK",
          label: this.$t('RAO_CHECK.INFO_CHECK_ITEM7'),
          value: false,
          result: '',
          disabled: false
        },
        {
          expressionName: "NAME_CHECK",
          label: this.$t('RAO_CHECK.INFO_CHECK_ITEM2'),
          result: '',
          disabled: false
        },
        {
          expressionName: "DOC_TYPE_CHECK",
          label: this.$t('RAO_CHECK.INFO_CHECK_ITEM3'),
          result: '',
          disabled: false
        },
        {
          expressionName: "CUSTOMER_TYPE_CHECK",
          label: this.$t('RAO_CHECK.INFO_CHECK_ITEM4'),
          result: '',
          disabled: false
        },
        {
          expressionName: "E_CARA_CHECK",
          label: this.$t('RAO_CHECK.INFO_CHECK_ITEM6'),
          result: '',
          disabled: false
        },
        {
          expressionName: "IS_STAFF_CHECK",
          label: this.$t('RAO_CHECK.INFO_CHECK_ITEM5'),
          result: '',
          disabled: false
        },
        {
          expressionName: "SELECT_OTHERS_CHECK",
          label: this.$t('RAO_CHECK.INFO_CHECK_ITEM8'),
          result: '',
          disabled: false
        },
      ], // 信息检查列表
      checkboxVal: true
    };
  },
  watch: {
    custInfoScoreResultVos(news, olds) {
      news.forEach((item, index) => {
        this.infoCheckList.forEach((checkItem, j) => {
          if(item.expressionName == checkItem.expressionName) {
            this.infoCheckList[j].result = item.result
          }
        })
      });
    }
  },
  computed: {
    checkboxDisabeld() {
      if (this.operateType === 'view') {
        return true
      }

      let roleName = getRoleDetail().roleName

      if (['分行 Maker', '中台 Maker', '分行 Checker', '中台 Checker'].includes(roleName)) {
        return false
      }
      return true
    }
  },
  created() {
  },

  mounted() {
  },

  methods: {
  }
};
</script>

<style lang="scss" scoped>
.f-w-340 {
  width: 340px;
}
.bgc-fff {
  background-color: #fff !important;
}
.w-60{
  width: 60% !important;
}
</style>
