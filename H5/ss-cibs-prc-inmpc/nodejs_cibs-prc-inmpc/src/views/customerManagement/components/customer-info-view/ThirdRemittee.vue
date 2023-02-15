<!--
 * @Author: zhangcheng
 * @Date: 2021-10-28 19:17:34
 * @LastEditTime: 2022-09-01 10:44:25
 * @LastEditors: zhangcheng
 * @Description: 第三方收款人
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\customerManagement\components\customer-info-view\ThirdRemittee.vue
-->
<template>
  <div>
    <el-tabs v-model="option" type="card" @tab-click="changeTab">
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.INNER_BANK')" name="innerOption">
        <el-form
          :model="innerAccount"
          class="transverse-form"
          label-width="auto"
          ref="innerAccount"
        >
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.REGISTER_CODE')+':'" prop="registerCode">
            <el-input
              v-model="innerAccount.registerCode"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
              class="f-w-270"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('CUSTOMER_MANAGEMENT.PAYEE_NAME')+':'"
            class="g-project"
            prop="payeeName"
          >
            <el-input
              v-model="innerAccount.payeeName"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
              class="f-w-270"
            ></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <div style="width: 270px;">
              <div class="f-button">
                <el-button
                  type="primary"
                  @click="queryData('innerOption')"
                >{{$t('CUSTOMER_MANAGEMENT.QUERY')}}</el-button>
                <el-button
                  class="reset"
                  @click="resetSearch('innerAccount')"
                >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.INTER_BANK')" name="localTransfer">
        <el-tabs v-model="optionSon" @tab-click="changeTabSon">
          <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.TRANS_FAST')" name="transFast">
            <el-form
              :model="transferFast"
              ref="transferFast"
              class="transverse-form"
              label-width="auto"
              label-position="right"
            >
              <el-form-item
                :label="$t('CUSTOMER_MANAGEMENT.REGISTER_CODE')+':'"
                prop="registerCode"
              >
                <el-input
                  v-model="transferFast.registerCode"
                  :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  class="f-w-270"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('CUSTOMER_MANAGEMENT.PAYEE_NAME')+':'" prop="payeeName">
                <el-input
                  v-model="transferFast.payeeName"
                  :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  class="f-w-270"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('CUSTOMER_MANAGEMENT.PAYEE_BANK_INS')+':'"
                prop="payeeBankCode"
              >
                <el-select
                  class="f-w-270"
                  filterable
                  v-model="transferFast.payeeBankCode"
                  :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
                >
                  <el-option
                    v-for="(item,key) of bankInfoList"
                    :key="`${key}2`"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                :label="$t('CUSTOMER_MANAGEMENT.PAYEE_IDENTIFY_METHOD')+':'"
                prop="payeeIdentifyMethod"
              >
                <el-select
                  class="f-w-270"
                  v-model="transferFast.payeeIdentifyMethod"
                  :placeholder="$t('CUSTOMER_MANAGEMENT.ALL')"
                >
                  <el-option
                    v-for="item of payeeIdentifyMethodList"
                    :key="`${item.value}-${item.label}`"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label=" ">
                <div style="width: 270px;">
                  <div class="f-button">
                    <el-button
                      type="primary"
                      @click="queryData('transFast')"
                    >{{$t('CUSTOMER_MANAGEMENT.QUERY')}}</el-button>
                    <el-button
                      class="reset"
                      @click="resetSearch('transferFast')"
                    >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.LOCAL_FAST')" name="localFast">
            <el-form :model="localFast" ref="localFast" class="transverse-form" label-width="auto">
              <el-form-item
                :label="$t('CUSTOMER_MANAGEMENT.REGISTER_CODE')+':'"
                prop="registerCode"
              >
                <el-input
                  v-model="localFast.registerCode"
                  :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  class="f-w-270"
                ></el-input>
              </el-form-item>
              <el-form-item :label="$t('CUSTOMER_MANAGEMENT.PAYEE_NAME')+':'" prop="payeeName">
                <el-input
                  v-model="localFast.payeeName"
                  :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
                  class="f-w-270"
                ></el-input>
              </el-form-item>
              <el-form-item
                :label="$t('CUSTOMER_MANAGEMENT.PAYEE_BANK_INS')+':'"
                prop="payeeBankCode"
              >
                <!-- v-if="option === 'localTransfer'" -->
                <el-select
                  class="f-w-270"
                  v-model="transferFast.payeeBankCode"
                  :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
                >
                  <el-option
                    v-for="(item,key) of bankInfoList"
                    :key="`${key}1`"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label=" ">
                <div style="width: 270px;">
                  <div class="f-button">
                    <el-button
                      type="primary"
                      @click="queryData('localFast')"
                    >{{$t('CUSTOMER_MANAGEMENT.QUERY')}}</el-button>
                    <el-button
                      class="reset"
                      @click="resetSearch('transferFast')"
                    >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
      <el-tab-pane :label="$t('CUSTOMER_MANAGEMENT.WIRE_TRANSFER')" name="wireTransfer">
        <el-form
          :model="wireTransfer"
          ref="wireTransfer"
          class="transverse-form"
          label-width="auto"
          label-position="right"
        >
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.REGISTER_CODE')+':'" prop="registerCode">
            <el-input
              v-model="wireTransfer.registerCode"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
              class="f-w-270"
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="$t('CUSTOMER_MANAGEMENT.PAYEE_COUNTRY_CODE')+':'"
            prop="countryCode"
          >
            <!-- @change="handleChangeCountry" -->
            <el-select
              class="f-w-270"
              v-model="wireTransfer.countryCode"
              :placeholder="$t('CUSTOMER_MANAGEMENT.SELECT')"
            >
              <el-option
                v-for="item of countryList"
                :key="item.countryId"
                :value="item.countryId"
                :label="item.countryShortName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="SWIFT Code" prop="swiftCode">
            <el-input
              v-model="wireTransfer.swiftCode"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
              class="f-w-270"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('CUSTOMER_MANAGEMENT.BANK_NAME')+':'" prop="bankName">
            <el-input
              v-model="wireTransfer.bankName"
              :placeholder="$t('CUSTOMER_MANAGEMENT.INPUT')"
              class="f-w-270"
            ></el-input>
          </el-form-item>
          <el-form-item label=" ">
            <div style="width:270px;">
              <div class="f-button">
                <el-button
                  type="primary"
                  @click="queryData('wireTransfer')"
                >{{$t('CUSTOMER_MANAGEMENT.QUERY')}}</el-button>
                <el-button
                  class="reset"
                  @click="resetSearch('wireTransfer')"
                >{{$t('CUSTOMER_MANAGEMENT.RESET')}}</el-button>
              </div>
            </div>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-table
      class="g-table"
      v-if="labName==='innerOption'||labName==='localFast'"
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column width="100px" type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column>
      <el-table-column prop="registerCode" :label="$t('CUSTOMER_MANAGEMENT.REGISTER_CODE')"></el-table-column>
      <el-table-column prop="payeeBankCode" :label="$t('CUSTOMER_MANAGEMENT.PAYEE_BANK_INS')">
        <template v-slot="{ row }">{{ bankFilter(row.payeeBankCode) }}</template>
      </el-table-column>

      <el-table-column prop="payeeName" :label="$t('CUSTOMER_MANAGEMENT.PAYEE_NAME')"></el-table-column>
      <el-table-column prop="payeeAccount" :label="$t('CUSTOMER_MANAGEMENT.PAYEE_ACCOUNT')">
        <template
          v-slot="{row}"
        >{{ row.payeeAccount }} {{ row.payeeCcy }} {{ row.payeeType | accountTypeFilter }}</template>
      </el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <el-table
      class="g-table"
      v-if="labName==='localTransfer' || labName==='transFast'"
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column width="100px" type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column>
      <el-table-column prop="registerCode" :label="$t('CUSTOMER_MANAGEMENT.REGISTER_CODE')"></el-table-column>
      <el-table-column
        prop="payeeIdentifyMethod"
        :label="$t('CUSTOMER_MANAGEMENT.PAYEE_IDENTIFY_METHOD')"
      >
        <template v-slot="{row}">{{ payeeIdentifyMethodFilter(row.payeeIdentifyMethod) }}</template>
      </el-table-column>
      <el-table-column prop="payeeBankCode" :label="$t('CUSTOMER_MANAGEMENT.PAYEE_BANK_INS')">
        <template v-slot="{ row }">
          <template v-if="['EMAL', 'MOBN'].includes(row.payeeIdentifyMethod)">
            <template v-if="row.selectBankType === 'PRE'">預設收款銀行</template>
            <template v-if="row.selectBankType === 'DEF'">演示銀行</template>
            <template v-if="row.selectBankType === 'OPT'">
              <!-- {{ row.payeeBankCode }} -->
              {{
              fpsBankList.find(item => item.value === row.payeeBankCode)
              ? fpsBankList.find(item => item.value === row.payeeBankCode)
              .label
              : row.payeeBankCode
              }}
            </template>
          </template>
          <template v-else>
            {{
            fpsBankList.find(item => item.value === row.payeeBankCode)
            ? fpsBankList.find(item => item.value === row.payeeBankCode)
            .label
            : row.payeeBankCode
            }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="payeeName" :label="$t('CUSTOMER_MANAGEMENT.PAYEE_NAME')"></el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.ACNO')">
        <template
          v-slot="{row}"
        >{{ row.emailAddress || row.fpsId || row.payeeAccount || row.mobilePhone }}</template>
      </el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <el-table
      class="g-table"
      v-if="labName==='wireTransfer'"
      :data="tableData"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column width="100px" type="index" :label="$t('CUSTOMER_MANAGEMENT.INDEX')"></el-table-column>
      <el-table-column prop="registerCode" :label="$t('CUSTOMER_MANAGEMENT.REGISTER_CODE')"></el-table-column>
      <el-table-column prop="payeeName" :label="$t('CUSTOMER_MANAGEMENT.PAYEE_NAME')"></el-table-column>
      <el-table-column prop="payeeAddress" :label="$t('CUSTOMER_MANAGEMENT.PAYEE_ADDRESS')">
        <template
          v-slot="{ row }"
        >{{ payeeCountryCodeFilter(row.payeeCountryCode) }} {{ row.payeeAddress }}</template>
      </el-table-column>
      <el-table-column prop="accountNo" :label="$t('CUSTOMER_MANAGEMENT.ACCOUNT_IBAN')"></el-table-column>
      <el-table-column prop="swiftCode" :label="$t('CUSTOMER_MANAGEMENT.SWIFT_CODE')"></el-table-column>
      <el-table-column prop="countryCode" :label="$t('CUSTOMER_MANAGEMENT.PAYEE_COUNTRY_CODE')">
        <template v-slot="{ row }">{{ payeeCountryCodeFilter(row.countryCode) }}</template>
      </el-table-column>
      <el-table-column prop="bankName" :label="$t('CUSTOMER_MANAGEMENT.BANK_NAME')">
        <template v-slot="{ row }">
          {{
          row.bankName
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('CUSTOMER_MANAGEMENT.BANK_ADDRESS')">
        <template
          v-slot="{ row }"
        >{{ row.bankAddress}}</template>
      </el-table-column>
      <el-empty
        slot="empty"
        :image="require('@/img/table-empty.png')"
        :description="$t('CUSTOMER_MANAGEMENT.NO_DATA')"
      ></el-empty>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  getElecList,
  getInsideList,
  getTransCountFastList,
  getLocalFastList
} from '@/api/customer-management/third-register';
import countires from '@/mixins/country-list';
import banks from '@/mixins/bank-infos';
import constant from '@/utils/constant';
import filters from '@/filters/business.js';
export default {
  name: 'thirdRemittee',
  mixins: [countires, banks],
  props: {
    ebankCstmNo: {
      type: String,
      default: ''
    }
  },
  data() {
    const { PAYEE_IDENTIFY_METHOD_LIST } = constant;
    return {
      option: 'innerOption',
      optionSon: 'transFast',
      total: 0,
      size: 10,
      current: 1,
      tableData: [],
      labName: 'innerOption',
      // 行内
      innerAccount: {
        registerCode: '',
        payeeName: ''
      },
      // 转数快
      transferFast: {
        registerCode: '',
        payeeName: '',
        payeeBankCode: '',
        payeeIdentifyMethod: ''
      },
      // 本地特快
      localFast: {
        registerCode: '',
        payeeName: '',
        payeeBankCode: ''
      },
      // 电汇
      wireTransfer: {
        registerCode: '',
        swiftCode: '',
        // payeeName: '',
        // payeeCountryCode: '',
        bankName: '',
        countryCode: ''
      },
      // 收款人识别方式列表
      payeeIdentifyMethodList: PAYEE_IDENTIFY_METHOD_LIST
    };
  },
  filters,
  methods: {
    changeTab(tab) {
      this.labName = tab.name;
      this.dealRequest();
    },
    // 銀行過濾
    bankFilter(val) {
      console.log(val);
      const result = this.bankInfoList.find(item => item.clearingCode === val);
      console.log(result);
      if (result) {
        return result.chtName;
      }
      return '';
    },
    changeTabSon(tab) {
      this.labName = tab.name;
      this.dealRequest(tab.name);
    },
    // 登記方式過濾
    payeeIdentifyMethodFilter(val) {
      const result = this.payeeIdentifyMethodList.find(
        item => item.value === val
      );
      if (result) {
        return result.label;
      }
      return '';
    },
    // 國家過濾
    payeeCountryCodeFilter(val) {
      console.log(this.countryList);
      console.log(val);
      const result = this.countryList.find(item => item.countryId === val);
      console.log(result);
      if (result) {
        return result.countryShortName;
      } else {
        return '';
      }
    },
    resetSearch(formName) {
      this.$refs[formName].resetFields();
    },
    async queryData(labName) {
      this.size = 10;
      this.current = 1;
      const result = await this.requestData(labName);
      if (result) {
        this.tableData = result.body.records;
        this.total = result.body.total;
      }
    },
    async requestData(labName) {
      let result = {};
      switch (labName) {
        // 行内
        case 'innerOption':
          result = await getInsideList({
            ebankCstmNo: this.ebankCstmNo,
            ...this.innerAccount,
            size: this.size,
            current: this.current
          });
          return result;
        // 转数快
        case 'localTransfer':
          result = await getTransCountFastList({
            ebankCstmNo: this.ebankCstmNo,
            ...this.transferFast,
            size: this.size,
            current: this.current
          });
          return result;
        // 转数快
        case 'transFast':
          result = await getTransCountFastList({
            ebankCstmNo: this.ebankCstmNo,
            ...this.transferFast,
            size: this.size,
            current: this.current
          });
          return result;
        // 本地特快
        case 'localFast':
          result = await getLocalFastList({
            ebankCstmNo: this.ebankCstmNo,
            ...this.localFast,
            size: this.size,
            current: this.current
          });
          return result;
        // 电汇
        case 'wireTransfer':
          result = await getElecList({
            ebankCstmNo: this.ebankCstmNo,
            ...this.wireTransfer,
            size: this.size,
            current: this.current
          });
          return result;
        default:
          return '';
      }
    },
    async dealRequest() {
      const result = await this.requestData(this.labName);
      if (result.body) {
        this.tableData = result.body.records;
        this.total = result.body.total;
      }
    },
    handleCurrentChange(val) {
      this.current = val;
      this.dealRequest();
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.dealRequest();
    }
  },
  created() {
    this.dealRequest();
  }
};
</script>

<style lang="scss" scoped>
.g-bolck {
  text-align: right;
  margin-top: 32px;
  padding: 0 20px;
}
.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 40px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
.f-w-270 {
  width: 270px;
}
.f-button {
  float: right;
  display: flex;
  button {
    width: 90px;
    height: 40px;
    border-radius: 4px;
    font-size: 18px;
  }
  .f-reset {
    color: rgba(0, 0, 0, 0.45);
    border-color: rgba(0, 0, 0, 0.45);
  }
}
</style>
