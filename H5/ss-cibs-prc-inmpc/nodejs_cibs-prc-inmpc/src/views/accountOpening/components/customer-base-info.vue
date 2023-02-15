<!-- 客户基本信息 -->
<template>
  <div class="transverse-table">
    <section>
      <div class="row">
        <div id="title">{{ $t('RAO_CHECK.BASE_INFO') }}</div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.CIF') }}</div>
        <div>{{ customerInfo.cif }}</div>
        <div>{{ $t('RAO_CHECK.CHS_NAME') }}</div>
        <div>{{ customerInfo.chineseName }}</div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.ENG_SEX') }}</div>
        <div>
          {{ customerInfo.engLastName }}
        </div>
        <div>{{ $t('RAO_CHECK.ENG_NAME') }}</div>
        <div>
          {{ customerInfo.engFirstName }}
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.CARD_TYPE') }}</div>
        <div> {{ valueToLabel(cardTypeList, customerInfo.identityType) }}
        </div>
        <div>{{ $t('RAO_CHECK.CARD_NO') }}</div>
        <div>
          {{ customerInfo.identityNumber }}
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.CUSTOMER_TYPE') }}</div>
        <div>
          {{ customerTypeObj[customerInfo.customerType] }}
        </div>
        <div>{{ $t('RAO_CHECK.NATIONALITY') }}</div>
        <div>
          {{ valueToLabel(nationalList, customerInfo.nationality) }}
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.CONTACT_NUMBER') }}</div>
        <div>
          {{ customerInfo.mobileCountryCode }}-{{ customerInfo.mobileNumber }}
        </div>
        <div>{{ $t('RAO_CHECK.MAIL') }}</div>
        <div>
          {{ customerInfo.email }}
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.DATA_OF_BIRTH') }}</div>
        <div>{{ customerInfo.dateOfBirth | formatDataOfBirth }}</div>
        <div>{{ $t('RAO_CHECK.SEX') }}</div>
        <div>
          {{ gender[customerInfo.gender] }}
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.PLACE_OF_ISSUE') }}</div>
        <div>
          {{ valueToLabel(nationalList, customerInfo.placeOfSign) }}
        </div>
        <div>{{ $t('RAO_CHECK.DATA_OF_ISSUE') }}</div>
        <div>{{ customerInfo.identityIssueDate | formatData }}</div>
      </div>
      <template v-if="showAssistCardInfo">
        <div class="row">
          <div>{{ $t('RAO_CHECK.ASSIST_CARD_CUNTRY') }}</div>
          <div>
            <el-select
              v-model="applicationInfo.supportingSign"
              class="f-w-340"
              :placeholder="$t('RAO_CHECK.PLEASE_SELECT')"
              :disabled="isReadonly">
              <el-option
                v-for="(item, key) in nationalList"
                :key="key"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>{{ $t('RAO_CHECK.ASSIST_CARD_TYPE') }}</div>
          <div>{{ passportType[applicationInfo.supportingType] }}</div>
        </div>
        <div class="row">
          <div>{{ $t('RAO_CHECK.ASSIST_CARD_NUM') }}</div>
          <div>
            <el-input
              class="f-w-340"
              v-model="applicationInfo.supportingNum"
              :placeholder="$t('COMMON.PLEASE_INPUT')"
              :disabled="isReadonly"
              maxlength="20"
              onkeyup="value=value.replace(/[^\d\(\)a-zA-Z]/g, '')"
            ></el-input>
          </div>
          <div></div>
          <div></div>
        </div>
      </template>
    </section>
  </div>
</template>

<script>
import CONSTANTS from '@/utils/constant';
import {
  getRoleDetail
} from '@/utils/user';
const {
  CARD_TYPE_LIST,
  NATIONAL_LIST,
  GENDER
} = CONSTANTS;

export default {
  name: 'SubjectAuthDetail',
  components: {
  },
  props: {
    customerInfo: {
      type: Object,
      default: () => {}
    },
    applicationInfo: {
      type: Object,
      default: () => {}
    },
    operateType: {
      type: String,
      default: () => ''
    }, // 操作类型
    checkType: {
      type: String,
      default: ''
    }, // 审核类型 1 普通開戶审核 2 普通開戶查詢 3 eiao審核 4 eiao查詢
  },

  data() {
    return {
      cardTypeList: CARD_TYPE_LIST, // 证件类型列表
      customerTypeObj: {
        NEW: this.$t('RAO_CHECK.NEW_CUSTOMER'),
        PROSPECT: this.$t('RAO_CHECK.PROSPECT_CUSTOMER'),
        DEPOSIT: this.$t('RAO_CHECK.DEPOSIT_CUSTOMER'),
        NONDEP: this.$t('RAO_CHECK.NONDEP_CUSTOMER'),
      }, // 客户类型
      nationalList: NATIONAL_LIST, // 国籍列表
      gender: GENDER, // 性别
      passportType: {
        PP: this.$t('RAO_CHECK.PP'),
        HKMAC: this.$t('RAO_CHECK.HKMAC'),
      }, // 辅助证件类型
    };
  },
  filters: {
    // 格式化出生日期
    formatDataOfBirth(date) {
      return date ? date.slice(0, 10) : ''
    },
    // 格式化日期
    formatData(date) {
      return date ? date.replace(/(\S{4})(\S{2})(\S{2})/g, '$1-$2-$3') : ''
    },
  },
  computed: {
    // 输入框只读
    isReadonly() {
      return this.operateType !== 'check' || !(['分行 Maker', '中台 Maker'].includes(getRoleDetail().roleName)) && this.applicationInfo.status !== 'Pending for info maker'
    },
    // 辅助证件显示
    showAssistCardInfo() {
      return this.customerInfo.identityType !== 'HKPID' && ['1', '2'].includes(this.checkType)
    },
  },
  created() {
  },

  mounted() {
  },

  methods: {
    // 选择辅助证件国家
    // selectSupportingSign(val) {
    //   if (this.applicationInfo.supportingSign !== this.customerInfo.nationality) {
    //     this.$showBox({
    //       content: this.$t('RAO_CHECK.SUP_DOC_NOSAME_NATIONAL'),
    //       showCancelButton: false
    //     });
    //     this.applicationInfo.supportingSign = ''
    //   }
    // },
    // value转label
    valueToLabel(list, val) {
      let label = '';
      list.forEach(item => {
        if(item.value === val) {
          label = item.label
        }
      });
      return label
    },
    authStatusFilter(value) {
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 32px 24px;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;
}
.el-select {
  width: 100%;
}
.g-bottom {
  margin-top: 40px;
  text-align: center;
  button {
    width: 210px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
  .f-cancel {
    color: #f06b00;
    border-color: #f06b00;
  }
}
::v-deep .el-tabs__item {
  font-size: 16px;
  padding: 0 20px;
  box-sizing: inherit !important;
}
.transverse-table {
  margin-top: 25px;
}
.my-tabs {
  margin-top: 40px;
  display: flex;
  .my-radio {
    margin-top: 5px;
  }
}
.f-w-340 {
  width: 340px;
}
</style>
