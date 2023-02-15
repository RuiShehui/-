<template>
  <div class="authorization-select" v-loading="isLoading">
    <divider :title="$t('PAYMENT.AUTHORIZATION_REMINDER')" class="mb20 pt8">
      <span class="f12 gray3">{{ $t('PAYMENT.SYSTEM_TO_REMINDED') }}</span>
    </divider>
    <el-form>
      <LevelsSelectorFormItem
        ref="levelsSelector"
        v-model="remindNameList"
        :origin="reminderInfos"
        :formatFn="val => `${val}${$t('RIGHTS_TEMPLATE.APPROVED_PERSON')}`"
      />
      <AuthorsSelectorFormItem
        ref="selectA"
        v-model="AlevelList"
        :limit="limit.A"
        :clearable="clearable"
        :isRender="checkIsSelectA"
        :origin="aLevelOptions"
        :levelLabel="$t('PAYMENT.CLASS_A')"
      />
      <AuthorsSelectorFormItem
        ref="selectB"
        v-model="BlevelList"
        :limit="limit.B"
        :clearable="clearable"
        :isRender="checkIsSelectB"
        :origin="bLevelOptions"
        :levelLabel="$t('PAYMENT.CLASS_B')"
      />
      <AuthorsSelectorFormItem
        ref="selectC"
        v-model="ClevelList"
        :limit="limit.C"
        :clearable="clearable"
        :isRender="checkIsSelectC"
        :origin="cLevelOptions"
        :levelLabel="$t('PAYMENT.CLASS_C')"
      />
    </el-form>
  </div>
</template>

<script>
import LevelsSelectorFormItem from './levels-selector.vue';
import AuthorsSelectorFormItem from './authors-selector.vue';

// import { getAuthReminders } from '@/api/paymentRemittance';
import { queryReminder } from '@/api/authModeManagement';
import { useLocalStorage } from '@/utils/hooks';

const selectInfos = 'SYSTEM_AUTH_SELECTOR_INFOS';
const ALevelListKey = 'A_LEVEL_LIST';
const BLevelListKey = 'B_LEVEL_LIST';
const CLevelListKey = 'C_LEVEL_LIST';

const [getSelectInfos, setSelectInfos] = useLocalStorage(selectInfos, '{}');
const [getALevelList, setALevelList] = useLocalStorage(ALevelListKey);
const [getBLevelList, setBLevelList] = useLocalStorage(BLevelListKey);
const [getCLevelList, setCLevelList] = useLocalStorage(CLevelListKey);

/**
 * 选择授权提醒人组件
 */
export default {
  name: 'SystemAuthSelector',
  components: {
    LevelsSelectorFormItem,
    AuthorsSelectorFormItem
  },
  props: {
    /** 是否可清除 */
    clearable: {
      type: Boolean,
      default: true
    },
    book: {
      type: Boolean,
      default: false
    },
    /** 初始授权信息 */
    authInfo: {
      type: Object
      // default: {}
    },
    /** 针对有金额交易传过来的值 */
    amount: {
      type: [String, Number],
      default: ''
    },
    /** 交易类型 */
    tradeType: {
      type: String,
      required: true
    },
    /** 是否为有金额交易 */
    isMoney: {
      type: Boolean,
      default: true
    },
    /** 是否为批量交易 */
    isSelectDeal: {
      type: Boolean,
      default: false
    },
    /** 账户，设计交易必传，默认为0 */
    acctNo: {
      type: String,
      default: '0'
    }
  },

  data() {
    return {
      isSelect: false,
      levels: ['A', 'B', 'C'],
      /** 选择的授权提醒级别 */
      remindNameList: [],
      /**
       * 各级授权人的数据
       */
      origin: {
        // A: [],
        // B: [],
        // C: [],
      },
      /**
       * 各级授权人数限制
       * @example { A: 1, B: 2, C: 0 }
       */
      limit: { A: 0, B: 0, C: 0 },
      /** select-datas */
      AlevelList: [],
      BlevelList: [],
      ClevelList: [],

      isLoading: false
    };
  },
  computed: {
    /** 授权提醒人信息 */
    reminderInfos() {
      return this.levels.map(levelType => ({
        value: levelType,
        label: `${this.$t(`PAYMENT.CLASS_${levelType}`)}:`,
        reminders: this[`${levelType}levelList`].length
      }));
    },
    /** 授權A選擇列表 */
    aLevelOptions() {
      if ('A' in this.origin) {
        return this.origin.A;
      }
      return [];
    },
    /** 授權B選擇列表 */
    bLevelOptions() {
      if ('B' in this.origin) {
        return this.origin.B;
      }
      return [];
    },
    /** 授權C選擇列表 */
    cLevelOptions() {
      if ('C' in this.origin) {
        return this.origin.C;
      }
      return [];
    },
    /**
     * 是否选择了A级别授权人
     */
    checkIsSelectA() {
      return !!this.remindNameList.find(item => item.includes('A'));
    },
    /**
     * 是否选择了B级别授权人
     */
    checkIsSelectB() {
      return !!this.remindNameList.find(item => item.includes('B'));
    },
    /**
     * 是否选择了C级别授权人
     */
    checkIsSelectC() {
      return !!this.remindNameList.find(item => item.includes('C'));
    },
    /**
     * 传到外面的authInfo
     */
    levelInfo() {
      const { AlevelList, BlevelList, ClevelList } = this;
      return {
        AlevelList,
        BlevelList,
        ClevelList
      };
    }
  },
  watch: {
    levelInfo(newVal) {
      this.$emit('checkClick', newVal);
    },
    origin(newVal) {
      setSelectInfos(newVal);
    },
    AlevelList(newVal) {
      setALevelList(newVal);
    },
    BlevelList(newVal) {
      setBLevelList(newVal);
    },
    ClevelList(newVal) {
      setCLevelList(newVal);
    },
    authInfo(newVal) {
      if (newVal) {
        if (Object.keys(newVal).length > 0) {
          this.initLevelLists();
        }
      }
    },
    remindNameList(val) {
      if (val.length > 0) {
        this.isSelect = true;
        this.getLevelLimit();
      } else {
        this.isSelect = false;
      }
    },
    '$route.path': {
      immediate: true,
      deep: true,
      handler() {
        this.reset();
      }
    }
  },
  mounted() {
    this.initLevelLists();
    this.setLevelLists();

    if (!this.isMoney) {
      this.getLevelLimit();
    }
  },
  methods: {
    /**
     * @public reset
     * 重置组件内的全部信息
     * - 1. 重置选择级别集合(A, B, C)
     * - 2. 重置选择级别列表(AList, BList, CList)
     */
    reset() {
      this.resetCurrentList();
      this.resetCurrentLevels();

      this.resetChildren();
    },
    resetCurrentList() {
      this.remindNameList = [];
      this.AlevelList = [];
      this.BlevelList = [];
      this.ClevelList = [];
    },
    resetCurrentLevels() {
      if (this.$refs['levelsSelector']) {
        this.$refs['levelsSelector'].checkedList = [];
      }
    },
    resetChildren() {
      this.levels.forEach(l => {
        const component = this.$refs[`select${l}`];
        if (component && component.clearShowData) {
          component.clearShowData();
        }
      });
    },
    async getLevelLimit() {
      const { tradeType, amount, acctNo } = this;
      if (this.isMoney && !amount) {
        this.$set(this, 'limit', { A: 0, B: 0, C: 0 });
      }
      if (!tradeType) {
        return;
      }
      if (
        ((tradeType === '03010401' || tradeType === '03010501') &&
          this.isSelect &&
          this.isSelectDeal) ||
        !this.isSelectDeal
      ) {
        const result = await queryReminder({ tradeType, amount, acctNo });
        if (result) {
          const { authTemplateAmountUserNumRsp, listMap } = result;
          if (authTemplateAmountUserNumRsp) {
            const {
              levelANumber,
              levelBNumber,
              levelCNumber
            } = authTemplateAmountUserNumRsp;
            this.$set(this.limit, 'A', Number(levelANumber || '0'));
            this.$set(this.limit, 'B', Number(levelBNumber || '0'));
            this.$set(this.limit, 'C', Number(levelCNumber || '0'));
          }
          if (Object.keys(listMap).length) {
            const { A = [], B = [], C = [] } = listMap;
            this.$set(this, 'origin', { A, B, C });
          }
        }
      }
    },
    getFilterList(list = []) {
      return list
        .map(item =>
          typeof item === 'string' ? item || '' : item.userEglsName
        )
        .filter(item => item !== '');
    },
    /**
     * 初始化(A?, B?, C?)
     */
    initLevelLists() {
      // this.book && this.remindNameList.push('A');
      if (this.authInfo && JSON.stringify(this.authInfo) !== '{}') {
        const { AlevelList, BlevelList, ClevelList } = this.authInfo;
        const filterAList = this.getFilterList(AlevelList),
          filterBList = this.getFilterList(BlevelList),
          filterCList = this.getFilterList(ClevelList);
        if (this.$refs['selectA']) {
          this.$refs['selectA'].checkedValue = filterAList;
        }
        this.$refs['selectB'] &&
          (this.$refs['selectB'].checkedValue = filterBList);
        this.$refs['selectC'] &&
          (this.$refs['selectC'].checkedValue = filterCList);

        if (filterAList.length > 0) {
          this.remindNameList.push('A');
        }
        if (filterBList.length > 0) {
          this.remindNameList.push('B');
        }
        if (filterCList.length > 0) {
          this.remindNameList.push('C');
        }
      } else {
        this.AlevelList = [];
        this.BlevelList = [];
        this.ClevelList = [];
      }
    },
    /**
     * 将接口/缓存中的AList, BList, CList设置到data
     */
    setLevelLists() {
      this.AlevelList = getALevelList();
      this.BlevelList = getBLevelList();
      this.ClevelList = getCLevelList();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  width: 650px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 16px;
  .el-checkbox-group {
    ::v-deep .el-checkbox {
      color: rgba(0, 0, 0, 0.85);
      white-space: inherit;
      padding-top: 0;
      padding-left: 12px;
      margin-right: 20px;
      .el-checkbox__label {
        max-width: 266px;
        word-break: break-all;
        padding: 9px 0 8px 8px;
        vertical-align: top;
      }
      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: rgba(0, 0, 0, 0.85);
      }
    }
  }
}
.i.el-select__caret {
  margin-top: 0;
  margin-right: 0;
}
::v-deep .el-select .el-tag__close.el-icon-close {
  color: #8c8c8c;
  background-color: transparent;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover,
.el-select-dropdown__item:hover {
  background-color: rgba(240, 107, 0, 0.06);
}
.pt8 {
  padding-top: 8px;
}
</style>
