<!--登记第三者账户- 本地跨行账户-->
<template>
  <div class="g-localAccount-container">
    <div v-if="showListFlag">
      <el-tabs v-model="transferType">
        <el-tab-pane :label="$t('PAYMENT.FAST_TRANSFER')" name="fast" />
        <el-tab-pane :label="$t('PAYMENT.LOCAL_TRANSFER')" name="local" />
      </el-tabs>
      <!-- form start -->
      <div class="page-wrapper" v-loading="requestLoading">
        <el-form class="search-form" :model="queryFormData" ref="queryForm" label-suffix=":">
          <el-row class="fix">
            <el-form-item
              :label="$t('PAYMENT.REGISTER_CODE')"
              prop="registerCode"
              label-width="110px"
              class="inline-block"
            >
              <el-input
                v-model="queryFormData.registerCode"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: $t('PAYMENT.REGISTER_CODE')
                  })
                "
              />
            </el-form-item>
            <el-form-item
              :label="$t('PAYMENT.PAYEE_NAME')"
              prop="payeeName"
              class="inline-block"
              label-width="120px"
            >
              <el-input
                v-model="queryFormData.payeeName"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: $t('PAYMENT.PAYEE_NAME')
                  })
                "
              />
            </el-form-item>

            <el-form-item class="inline-block menu-btns" v-show="showMoreField ? false : true">
              <v-button size="w70" @click="handleReset" class="mr16">{{ $t('COMMON.RESET') }}</v-button>
              <v-button size="w75" @click="handleQuery" type="primary">{{ $t('COMMON.SEARCH') }}</v-button>
              <v-button class size="w120" @click="handleToAdd">+ {{ $t('COMMON.ADD') }}</v-button>
              <span
                @click="showMoreField = true"
                class="u-expandBtn"
                v-show="showMoreField ? false : true"
              >
                <label>{{ $t('PAYMENT.UNFOLD_MENU') }}</label>
                <i class="el-icon-expand"></i>
              </span>
            </el-form-item>
          </el-row>
          <div class="flexsb" v-show="showMoreField ? true : false">
            <el-form-item
              :label="$t('PAYMENT.RECEIVE_BANK')"
              prop="payeeBankCode"
              class="inline-block"
              label-width="110px"
            >
              <el-select
                v-model="queryFormData.payeeBankCode"
                :placeholder="
                  $t('COMMON.PLEASE_SELECT_SOMETHING', {
                    select: $t('PAYMENT.RECEIVE_BANK')
                  })
                "
                :filterable="true"
              >
                <el-option
                  v-for="(item, index) of filterTransBank"
                  :key="`${index} ${item.value}`"
                  :value="item.value"
                  :label="item.bankName"
                />
              </el-select>
            </el-form-item>
            <el-row class="flexgrow">
              <el-form-item
                v-if="transferType == 'fast'"
                :label="$t('PAYMENT.PAYEE_IDENTIFY_WAY')"
                prop="payeeIdentifyMethod"
                class="inline-block"
                label-width="120px"
              >
                <el-select v-model="queryFormData.payeeIdentifyMethod">
                  <el-option
                    v-for="(item, index) in identifyWayList"
                    :label="item.value | FPStransTypeFilers"
                    :value="item.value"
                    :key="index"
                  />
                </el-select>
              </el-form-item>
            </el-row>
            <el-form-item class="inline-block menu-btns">
              <v-button size="w70" @click="handleReset" class="mr16">{{ $t('COMMON.RESET') }}</v-button>
              <v-button size="w75" @click="handleQuery" type="primary">{{ $t('COMMON.SEARCH') }}</v-button>
              <v-button size="w120" @click="handleToAdd">+ {{ $t('COMMON.ADD') }}</v-button>
              <span @click="showMoreField = false" class="u-expandBtn">
                <label>{{ $t('PAYMENT.FOLD_MENU') }}</label>
                <i class="el-icon-put-away"></i>
              </span>
            </el-form-item>
          </div>
        </el-form>
        <!-- form end -->
        <!-- table start -->
        <el-table
          v-if="transferType === 'fast'"
          :data="tableData"
          key="fast"
          style="width:100%;"
          height="398px"
          class="mb16"
        >
          <el-table-column :label="$t('COMMON.SERIAL_NUMBER')" type="index" :width="lang === 'en' ? '110' : '80'" />

          <el-table-column prop="registerCode" :label="$t('PAYMENT.REGISTER_CODE')" :width="lang === 'en' ? '195' : '165'" />
          <el-table-column
            prop="payeeIdentifyMethod"
            :label="$t('PAYMENT.PAYEE_IDENTIFY_WAY')"
            :width="lang === 'en' ? '240' : '165'"
          >
            <template v-slot="{ row }">
              {{row.payeeIdentifyMethod | FPStransTypeFilers}}
            </template>
          </el-table-column>
          <el-table-column prop="payeeBankCode" :label="$t('PAYMENT.RECEIVE_BANK')" :width="lang === 'en' ? '265' : '165'">
            <template v-slot="{ row }">
              {{ filterFpsBank(row) }}
            </template>
          </el-table-column>
          <el-table-column prop="payeeName" :label="$t('PAYMENT.PAYEE_NAME')" :width="lang === 'en' ? '245' : '135'" />
          <el-table-column prop="payeeAccount" :label="$t('PAYMENT.PAY_ACCT_NAME')" :width="lang === 'en' ? '285' : '135'">
            <template v-slot="{ row }">{{ payeeIdentifyMethodFilter(row) }}</template>
          </el-table-column>
          <template>
            <el-table-column
              :label="$t('COMMON.OPERATION')"
              align="left"
              fixed="right"
             :width="lang === 'en' ? '230' : '180'"
              class="flexsb"
            >
              <template slot-scope="scope">
                <span
                  size="w70"
                  @click="handleToUpdate(scope.row)"
                  type="text"
                  class="u-table-btn"
                >{{ $t('COMMON.UPDATE') }}</span>
                <span style="font-size:12px; color:#CCCCCC; margin: 0 5px;">|</span>
                <span
                  size="w70"
                  @click="handleToTransfer(scope.row)"
                  type="text"
                  class="left-line u-table-btn"
                >{{ $t('PAYMENT.TRANS') }}</span>
                <span style="font-size:12px; color:#CCCCCC; margin: 0 5px;">|</span>
                <span
                  size="w70"
                  @click="handleDelete(scope.row)"
                  type="text"
                  class="left-line s-fcolor"
                >{{ $t('COMMON.DELETE') }}</span>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <el-table v-if="transferType === 'local'" key="local" :data="tableData"  style="width:100%;" height="398px" class="mb16">
          <el-table-column :label="$t('COMMON.SERIAL_NUMBER')" type="index" :width="lang === 'en' ? '110' : '80'" />
          <el-table-column prop="registerCode" :label="$t('PAYMENT.REGISTER_CODE')" :width="lang === 'en' ? '195' : '165'" />
          <el-table-column prop="payeeBankCode" :label="$t('PAYMENT.RECEIVE_BANK')" :width="lang === 'en' ? '270' : '185'">
            <template v-slot="{ row }">{{ filterBankInfo(row.payeeBankCode) }}</template>
          </el-table-column>
          <el-table-column prop="payeeName" :label="$t('PAYMENT.PAYEE_NAME')" :width="lang === 'en' ? '260' : '185'" />
          <el-table-column
            prop="payeeAccount"
            :label="$t('PAYMENT.RECEIVE_ACCOUNT')"
            width="200"
          />
          <template>
            <el-table-column
              :label="$t('COMMON.OPERATION')"
              align="left"
              fixed="right"
              :width="lang === 'en' ? '230' : '180'"
              class="flexsb"
            >
              <template slot-scope="scope">
                <span
                  size="w70"
                  @click="handleToUpdate(scope.row)"
                  type="text"
                  class="u-table-btn"
                >{{ $t('COMMON.UPDATE') }}</span>
                <span style="font-size:12px; color:#CCCCCC; margin: 0 5px;">|</span>
                <span
                  size="w70"
                  @click="handleToTransfer(scope.row)"
                  type="text"
                  class="left-line u-table-btn"
                >{{ $t('PAYMENT.TRANS') }}</span>
                <span style="font-size:12px; color:#CCCCCC; margin: 0 5px;">|</span>
                <span
                  size="w70"
                  @click="handleDelete(scope.row)"
                  type="text"
                  class="left-line s-fcolor"
                >{{ $t('COMMON.DELETE') }}</span>
              </template>
            </el-table-column>
          </template>
        </el-table>
        <el-pagination
          :current-page="pageInfo.current"
          :total="pageInfo.total"
          :page-size="pageInfo.size"
          :page-sizes="[10, 20, 30, 50]"
          layout="prev, pager, next, sizes, jumper"
          @current-change="changePageInfo($event, 'current')"
          @size-change="changePageInfo($event, 'size')"
        />
      </div>
      <!-- table end -->
    </div>
    <div v-else>
      <fast-bank-add-update
        v-if="transferType == 'fast'"
        :changeType="changeType"
        :changeData="changeData"
        @returnBack="
          showListFlag = true;
          $emit('clickBack');
        "
      ></fast-bank-add-update>
      <local-bank-add-update
        v-if="transferType == 'local'"
        :changeType="changeType"
        :changeData="changeData"
        @returnBack="
          showListFlag = true;
          $emit('clickBack');
        "
      ></local-bank-add-update>
    </div>
  </div>
</template>

<script>
import FastBankAddUpdate from './fast'; //本地跨行-转数快
import LocalBankAddUpdate from './chats'; //本地跨行账户-本地特快

import {
  findInterBankTransferRegPageList,
  findInnerBankRegDetail,
  removeInterBankTransferReg,
  removeInterBankTransferChats
} from '@/api/paymentRemittance';
import {
  identifyWayList,
  IDENTIFY_WAY_MAP,
  INTRA_ACCT_TYPES
} from '@bank-transfer/utils/constant';
import {
  transToCreditAcct,
  payeeIdentifyMethodFilter
} from '@bank-transfer/utils/function';
import VueI18n from '@/i18n';
import { filterParams } from '@/utils/tools';
import filter from '@/filters/public';
import { bankInfos } from '@/mixins';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import { mapState, mapMutations } from 'vuex';
import { mixins as commonMixins } from '@v2-lib/vue.spa.plugin';
import { sendEmail } from '@/api/sendMsg';
import business from '@/filters/business.js';
export default {
  name: 'LocalBankAccountListPage',
  components: {
    FastBankAddUpdate,
    LocalBankAddUpdate
  },
  mixins: [commonMixins, bankInfos],
  inject: ['scrollToTop', 'entType', 'sendEmail', 'formatAcctNo'],
  data() {
    return {
      payType: 'fast', //此参数只为了解决混入
      transferType: 'fast',
      showListFlag: true,
      changeType: 'add',
      changeData: {},
      queryFormData: {
        registerCode: '', //登记编号
        payeeName: '', //收款户名
        payeeBankCode: '', //收款银行/机构
        payeeIdentifyMethod: '' //收款人识别方式
      },
      identifyWayList: identifyWayList.filter(
        item => item.value !== IDENTIFY_WAY_MAP.creditCard
      ),
      IDENTIFY_WAY_MAP,
      tableData: [],
      showMoreField: false, //表单展开
      pageInfo: {
        current: 1,
        size: 10,
        total: 20
      }
    };
  },
  computed: {
    ...mapState('app', ['requestLoading', 'lang']),
    /** 请求列表的类型 (转数快/外币转账) */
    transferWay() {
      if (this.transferType === 'fast') {
        this.payType = 'fast';
        return INTRA_ACCT_TYPES.FAST;
      } else {
        this.payType = 'localtransfer';
        return INTRA_ACCT_TYPES.CHATS;
      }
    },
    queryData() {
      const { current = 1, size = 10 } = this.pageInfo;

      return filterParams({
        current,
        size,
        ...this.queryFormData
      });
    },
    deleteFn() {
      switch (this.transferType) {
        case 'fast':
          return removeInterBankTransferReg;
        case 'local':
          return removeInterBankTransferChats;
        default:
          return () => {};
      }
    }
  },
  filters: {
    tradeStateFilter: filter.tradeStateFilter,
    FPStransTypeFilers:business.FPStransTypeFilers,
  },
  watch: {
    transferWay(newVal) {
      this.getTableData(this.queryData);
    },
    showListFlag(newVal) {
      if (newVal === true) {
        this.init();
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapMutations('app', ['setSliderMenusAct']),

    payeeIdentifyMethodFilter,
    init() {
      this.queryFormData = {
        registerCode: '',
        payeeName: '',
        payeeBankCode: '',
        payeeIdentifyMethod: ''
      };
      this.showMoreField = false;
      this.getTableData({
        current: this.pageInfo.current,
        size: this.pageInfo.size
      });
    },
    async getTableData(params = this.queryData) {
      const result = await findInterBankTransferRegPageList({
        ...params,
        transferWay: this.transferWay
      });
      if (result) {
        this.setPageInfo(result);
        this.setTableData(result);
      }
    },
    setPageInfo({ current = 1, size = 10, total = 0 }) {
      this.$set(this.pageInfo, 'current', current);
      this.$set(this.pageInfo, 'size', size);
      this.$set(this.pageInfo, 'total', total);
    },
    setTableData({ records = [] }) {
      this.$set(this, 'tableData', [...records]);
    },
    // 查询
    handleQuery() {
      this.pageInfo = {
        current: 1,
        size: 10,
        total: 0
      };
      this.getTableData();
    },
    // 新增
    handleToAdd() {
      this.showListFlag = false;
      this.changeType = 'add';
      this.$emit('clickChange');
    },
    // 修改
    handleToUpdate(crtItem) {
      this.showListFlag = false;
      this.changeType = 'update';
      this.$set(this, 'changeData', { ...crtItem });
      this.$emit('clickChange');
    },
    // 转账
    async handleToTransfer(crtItem) {
      const result = await findInnerBankRegDetail(crtItem);
      const self = this;
      if (result) {
        const targetPath =
          this.transferType == 'fast'
            ? '/bankTransfer/paymentSettlement/fast'
            : '/bankTransfer/paymentSettlement/localtransfer';
        const targetMenuCode =
          this.transferType === 'fast' ? '03010201' : '03010202';

        const draftData = {
          ...transToCreditAcct({
            ...result,
            ...crtItem
          }),
          creditAcctIdentificationType: crtItem.payeeIdentifyMethod
        };
        console.log(draftData);
        this.setSliderMenusAct(targetMenuCode);
        this.$router.push({
          path: targetPath,
          query: {
            params: JSON.stringify({
              ...draftData,
              type: this.transferType,
              isShowRegistered: true
            })
          }
        });
      }
    },
    //   删除
    handleDelete(crtItem) {
      let custNo = sessionStorage.getItem('custNo');
      const errMsg =
        this.transferType == 'fast'
          ? this.$t('PAYMENT.DEL_REG_FPS')
          : this.$t('PAYMENT.DEL_REG_CHATS');

      this.$confirm({
        title: '',
        isIcon: true,
        type: 'warn',
        message: errMsg,
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.CONFIRM')
        },
        isCancle: true
      }).then(() => {
        this.confirmRemoveItem(crtItem);
      });
      // .catch(() => {});
    },
    async confirmRemoveItem(params) {
      let custNo = sessionStorage.getItem('custNo');
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      const tradeInfo = JSON.stringify({
        ...params,
        otpType: this.transferType == 'fast' ? '030102013' : '030102023'
      });
      this.deleteFn({ ...params, transferWay: this.transferWay }).then(
        ({ body = {}, head = {} }) => {
          const entType = localStorage.getItem('entType');
          if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '1'
            }).then(() => {
              this.confirmRemoveItem(params);
            });
          }
          if (entType === '1' && head.returnCode == 'OTP000107') {
            softToken({
              softTokenCode: '',
              otpType: this.transferType == 'fast' ? '030102013' : '030102023',
              tradeInfo: tradeInfo
            }).then(() => {
              this.confirmRemoveItem(params);
            });
          }
          if (body) {
            const { authResultInfo } = body;
            if (authResultInfo && authResultInfo.authResultState !== '91') {
              this.$message({
                type: 'success',
                duration: 3000,
                message: `${this.$t('COMMON.SOMETHING_SUCCESS', {
                  op: this.$t('COMMON.OPERATION')
                })} ${this.$options.filters['tradeStateFilter'](
                  authResultInfo.authResultState
                )}`
              });
            } else {
              this.$message({
                type: 'fail',
                duration: 2000,
                message: this.$t('COMMON.SOMETHING_FAIL', {
                  op: this.$t('COMMON.DELETE')
                })
              });
            }
          }
        }
      );
      this.getTableData();
    },
    // 重置
    handleReset() {
      this.$refs['queryForm'].resetFields();
    },
    changePageInfo(value, prop) {
      this.$set(this.pageInfo, prop, value);
      this.getTableData();
    },
    filterFpsBank({ payeeBankCode, payeeIdentifyMethod, selectBankType }) {
      console.log(payeeIdentifyMethod, selectBankType, payeeBankCode);
      if (['MOBN', 'EMAL'].includes(payeeIdentifyMethod)) {
        if (selectBankType === 'PRE') {
          return this.$t('PAYMENT.PRESET_PAYEE_BANK');
        }
        if (selectBankType === 'DEF') {
          return this.$t('PAYMENT.CHUANGXING_BANK');
        }
      }
      const curBank = this.bankInfoList.find(
        item => item.value === payeeBankCode
      );
      if (curBank && curBank.bankName) {
        return curBank.bankName;
      }
      return '--';
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../common.scss';
.el-table__body-wrapper .is-scrolling-left {
  height: 100%;
}
::v-deep .el-tabs--top {
  .el-tabs__item {
    padding: 7px 16px;
    line-height: 26px;
    font-size: 18px;
    &.is-top:nth-child(2) {
      padding-left: 16px;
    }
    &.is-top:last-child {
      padding-right: 16px;
    }
    &.is-active {
      color: #f06b00;
    }
  }
  .el-tabs__header.is-top {
    margin: 0 0 24px;
  }
  .el-tabs__nav-wrap::after {
    height: 1px;
  }
}
::v-deep .el-tabs__active-bar {
  padding: 0 16px;
  left: -16px;
  height: 3px;
  background-color: #f06b00;
}
.g-localAccount-container {
  ::v-deep .inline-block {
    display: inline-block;
  }
  .page-wrapper {
    .search-form {
      .inline-block {
        padding-right: 8px;
        box-sizing: border-box;
      }
    }
    .menu-btns {
      .common-button {
        display: inline-block;
        margin-right: 8px;
      }
    }
  }
}
</style>
