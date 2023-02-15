<!-- 登记第三者账户 - 电汇账户 列表 -->
<template>
  <div class="g-telegraphAccount-container" v-loading="requestLoading">
    <div v-if="showListFlag">
      <!-- el-form start -->
      <el-form ref="queryForm" :model="formData" class="m-query-form" label-suffix=": ">
        <el-row class="fix">
          <!-- 登记编号 -->
          <el-form-item
            :label="$t('PAYMENT.REGISTER_CODE')"
            prop="registerCode"
            label-width="80px"
            class="inline-form-item"
          >
            <el-input
              class="form-component"
              v-model="formData.registerCode"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {
                  input: $t('PAYMENT.REGISTER_CODE')
                })
              "
            />
          </el-form-item>
          <!-- 收款银行国家/地区 -->
          <el-form-item
            :label="$t('PAYMENT.PAYEE_COUNTRY_CODE')"
            prop="countryCode"
            label-width="130px"
            style="margin-left:20px;"
            class="inline-form-item"
          >
            <el-select
              class="form-component"
              v-model="formData.countryCode"
              :filterable="true"
              @change="changeCountry"
            >
              <el-option
                v-for="item in countryInfoList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <!-- SWIFT Code -->
          <el-form-item
            label="SWIFT Code"
            prop="swiftCode"
            label-width="108px"
            v-show="showMoreField ? true : false"
            class="inline-form-item"
          >
            <el-input
              class="form-component"
              v-model="formData.swiftCode"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', { input: 'SWIFT Code' })
              "
            />
          </el-form-item>
          <!-- 银行名称 -->
          <el-form-item
            v-show="showMoreField ? true : false"
            :label="$t('PAYMENT.BANK_NAME')"
            prop="bankName"
            label-width="80px"
            class="inline-form-item"
          >
            <el-input
              class="form-component"
              v-model="formData.bankName"
              :placeholder="
                $t('COMMON.PLEASE_INPUT_SOMETHING', {input: $t('PAYMENT.BANK_NAME') })
              "
            />
          </el-form-item>
          <el-row class="flexc fr mr16 mb24">
            <v-button
              style="margin-right: 8px;"
              size="w70"
              @click="handlerReset"
              class="mr16"
            >{{ $t('COMMON.RESET') }}</v-button>
            <v-button
              style="margin-right: 8px;"
              size="w75"
              @click="handleQuery"
              type="primary"
            >{{ $t('COMMON.SEARCH') }}</v-button>
            <v-button class size="w120" @click="handleAdd">+ {{ $t('COMMON.ADD') }}</v-button>
            <span @click="showMoreField = !showMoreField" class="u-expandBtn">
              {{
              showMoreField
              ? $t('PAYMENT.FOLD_MENU')
              : $t('PAYMENT.UNFOLD_MENU')
              }}
              <i
                :class="[showMoreField ? 'el-icon-put-away' : 'el-icon-expand']"
              ></i>
            </span>
          </el-row>
        </el-row>
      </el-form>
      <!-- el-form end -->
      <!-- table start -->
      <el-table :data="tableData" stripe style="width:100%;" height="398px" class="mb16">
        <el-table-column :label="$t('COMMON.SERIAL_NUMBER')" type="index" :width="lang === 'en' ? '110' : '80'"></el-table-column>
        <el-table-column prop="registerCode" :label="$t('PAYMENT.REGISTER_CODE')" :width="lang === 'en' ? '195' : '165'"></el-table-column>
        <el-table-column prop="payeeName" :label="$t('PAYMENT.ACCT_NAME')" width="165"></el-table-column>
        <el-table-column
          prop="payeeAddress"
          :label="
            `${$t('PAYMENT.RECEIVER_ADDRESS')} (${$t(
              'PAYMENT.BANK_AND_ADDRESS'
            )})`
          "
           :width="lang === 'en' ? '275' : '250'"
        >
          <template v-slot="{ row }">
            {{
            `${getCountryName(row.payeeCountryCode)} ${payeeAddressFilter(row)}`
            }}
          </template>
        </el-table-column>
        <el-table-column prop="accountNo" :label="$t('PAYMENT.ACCT_NO_OR_IBAN')" :width="lang === 'en' ? '205' : '165'"></el-table-column>
        <el-table-column prop="swiftCode" label="SWIFT Code" width="165"></el-table-column>
        <el-table-column prop="countryCode" :label="$t('PAYMENT.PAYEE_COUNTRY_CODE')" :width="lang === 'en' ? '265' : '250'">
          <template v-slot="{ row }">{{ getCountryName(row.countryCode) }}</template>
        </el-table-column>
        <el-table-column prop="bankName" :label="$t('PAYMENT.BANK_NAME')" width="320"></el-table-column>
        <el-table-column prop="bankAddress" :label="$t('PAYMENT.BANK_ADDRESS')" width="320"></el-table-column>
        <el-table-column
          :label="$t('COMMON.OPERATION')"
          align="left"
          fixed="right"
          class="flexsb"
          :width="lang === 'en' ? '230' : '180'"
        >
          <template slot-scope="scope">
            <span
              size="w70"
              @click="handleUpdate(scope.row)"
              type="text"
              class="u-tableBtn"
            >{{ $t('COMMON.UPDATE') }}</span>
            <span style="font-size:12px; color:#CCCCCC; margin: 0 5px;">|</span>
            <span
              size="w75"
              @click="handleTransfer(scope.row)"
              type="text"
              class="left-line u-tableBtn"
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
      </el-table>
      <el-pagination
        @size-change="changePageInfo($event, 'size')"
        @current-change="changePageInfo($event, 'current')"
        :current-page="pageInfo.current"
        :page-sizes="[10, 20, 30, 50]"
        layout="prev, pager, next, sizes, jumper"
        :total="pageInfo.total"
      ></el-pagination>
      <!-- table end -->
    </div>
    <div v-else>
      <AddAndUpdate
        :changeType="changeType"
        :changeData="changeData"
        @returnBack="
          showListFlag = true;
          $emit('clickBack');
        "
      />
    </div>
  </div>
</template>

<script>
import AddAndUpdate from './AddAndUpdate';
import { bankInfos, countryInfos } from '@/mixins';
import { filterParams } from '@/utils/tools';
import {
  findGlobalRemittanceRegPageList,
  findGlobalRemittanceRegDetail,
  removeGlobalRemittanceReg
} from '@/api/paymentRemittance';
import { payeeAddressFilter } from '@bank-transfer/utils/filters';
import { transToCreditAcct } from '@bank-transfer/utils/function';
import filter from '@/filters/public';
import { mapState, mapMutations } from 'vuex';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
import { sendEmail } from '@/api/sendMsg';
export default {
  name: 'GlobalAccountIndexPage',
  components: {
    AddAndUpdate
  },
  mixins: [bankInfos, countryInfos],
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  data() {
    return {
      formData: {
        registerCode: '', //登记编号
        swiftCode: '', //SWIFT code
        countryCode: '', //国家/地区
        bankName: '' //收款银行/机构
      },
      changeType: 'add', // 跳转修改/新增类型标识
      changeData: {}, // 详情/编辑时需要的数据
      showMoreField: false, // 表单展开标识
      showListFlag: true,
      tableData: [],
      pageInfo: {
        current: 1,
        size: 10,
        total: 20
      }
    };
  },
  computed: {
    ...mapState('app', ['requestLoading', 'lang']),
    queryData() {
      const { current, size } = this.pageInfo;
      return filterParams({
        current,
        size,
        ...this.formData
      });
    }
  },
  filters:{
    tradeStateFilter:filter.tradeStateFilter
  },
  watch: {
    showListFlag(newVal) {
      if (newVal === true) {
        this.getTableData();
      }
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    payeeAddressFilter,
    ...mapMutations('app', ['setSliderMenusAct']),

    async getTableData(queryData = this.queryData) {
      const result = await findGlobalRemittanceRegPageList(queryData);
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
      if (Array.isArray(records)) {
        this.$set(this, 'tableData', records);
      }
    },
    getCountryName(countryCode) {
      if (this.countryInfoList && this.countryInfoList.length) {
        const target = this.countryInfoList.find(
          item => item.value === countryCode
        );
        if (target) {
          return target.label;
        }
      }

      return '';
    },
    // 重置
    handlerReset() {
      this.$refs.queryForm.resetFields();
      this.resetPageInfo();
    },
    resetPageInfo() {
      this.$set(this, 'pageInfo', {
        current: 1,
        size: 10,
        total: 0
      });
    },
    // 查询
    handleQuery() {
      this.resetPageInfo();
      this.getTableData();
    },
    // 新增
    handleAdd() {
      this.showListFlag = false;
      this.changeType = 'add';
      this.$emit('clickChange');
    },
    // 修改
    async handleUpdate(row) {
      const result = await findGlobalRemittanceRegDetail({
        ...row
      });
      if (result && Object.getOwnPropertyNames(result).length) {
        this.showListFlag = false;
        this.changeType = 'update';
        this.changeData = {
          ...row,
          ...result
        };
        this.$emit('clickChange');
      }
    },
    // 转账
    async handleTransfer(row) {
      const result = await findGlobalRemittanceRegDetail({
        ...row
      });
      if (result && Object.getOwnPropertyNames(result).length) {
        console.log(result);
        this.setSliderMenusAct('030103');
        const transferParams = transToCreditAcct({
          ...row,
          ...result
        });
        this.$router.push({
          path: '/bankTransfer/paymentSettlement/remittance',
          query: {
            params: JSON.stringify({
              ...transferParams,
              creditBankRegion:transferParams.countryCode,
              isShowRegisted: true,
              isSwiftCode: !!transferParams.swiftCode
            })
          }
        });
      }
    },
    changePageInfo(value, prop) {
      this.$set(this.pageInfo, prop, value);
      this.getTableData();
    },
    // 删除
    handleDelete(crtItem) {
      this.$confirm({
        title: '',
        isIcon: true,
        type: 'warn',
        message: this.$t('COMMON.CONFIRM_DELETE_SOMETHING', {
          content: this.$t('PAYMENT.REMITTANCE_ACCOUNT')
        }),
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.CONFIRM')
        },
        isCancle: true
      })
        .then(() => {
          this.confirmDelete(crtItem);
        })
        .catch(() => {});
    },
    async confirmDelete(params) {
      let custNo = sessionStorage.getItem('custNo');
      const entType = localStorage.getItem('entType');
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      removeGlobalRemittanceReg(params).then(({ body = {}, head = {} }) => {
        const tradeInfo = JSON.stringify({ ...params, otpType: '0301033' });
        if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1') {
          choosesWay({
            checkWay: '',
            tradeInfo: tradeInfo,
            flag: '1'
            // status: status
          }).then(() => {
            this.confirmDelete(params);
          });
        } else if (head.returnCode == 'OTP000107' && entType == '1') {
          softToken({
            softTokenCode: '',
            otpType: '0301033',
            tradeInfo: tradeInfo,
            flag: '3'
            // randomNum:''
          }).then(() => {
            this.confirmDelete(params);
            // this.comfirm();
          });
        }
        if (body) {
          const { authResultInfo } = body;
          if (authResultInfo && authResultInfo.authResultState !== '91') {
            this.$message({
              type: 'success',
              message: `${this.$t('COMMON.SOMETHING_SUCCESS', {
                op: this.$t('COMMON.OPERATION')
              })} ${this.$options.filters['tradeStateFilter'](authResultInfo.authResultState)}`,
              duration: 3000
            });
          } else {
            this.$message({
              type: 'fail',
              message: this.$t('COMMON.SOMETHING_FAIL', {
                op: this.$t('COMMON.DELETE')
              }),
              duration: 3000
            });
          }
        }
      });

      this.getTableData();
    },
    changeCountry() {},
    changeBank() {}
  }
};
</script>

<style lang="scss" scoped>
@import '../common.scss';
.g-telegraphAccount-container {
  .m-query-form {
    .inline-form-item {
      display: inline-block;

      // .form-component {
      //   width: 320px;
      // }
    }
    ::v-deep .el-form .el-select > .el-input {
      width: 100%;
    }
  }
  .u-expandBtn {
    line-height: 2.3;
  }
  .u-tableBtn {
    cursor: pointer;
  }
}
</style>
