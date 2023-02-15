<!--登记第三者账号 -行内转账 -->
<template>
  <div class="g-intraAccount-container">
    <div v-if="showListFlag" v-loading="requestLoading">
      <!-- el-form start -->
      <el-form ref="queryForm" :model="queryForm" label-width="80px" label-suffix=":">
        <div class="flex">
          <el-row class="inline-block mr32">
            <el-form-item
              :label="$t('PAYMENT.REGISTER_CODE')"
              prop="registerCode"
               label-width="80px"
              class="inline-block mr40"
            >
              <el-input
                v-model="queryForm.registerCode"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: $t('PAYMENT.REGISTER_CODE')
                  })
                "
              />
            </el-form-item>
            <el-form-item  label-width="100px" :label="$t('PAYMENT.PAYEE_NAME')" prop="payeeName" class="inline-block">
              <el-input
                v-model="queryForm.payeeName"
                :placeholder="
                  $t('COMMON.PLEASE_INPUT_SOMETHING', {
                    input: $t('PAYMENT.PAYEE_NAME')
                  })
                "
              />
            </el-form-item>
          </el-row>
          <el-row class="inline-block mb24">
            <el-row class="flexc">
              <v-button
                style="margin-right: 8px;"
                size="w70"
                @click="handlerReset"
                class="mr16"
              >{{ $t('COMMON.RESET') }}</v-button>
              <v-button
                style="margin-right: 8px;"
                size="w75"
                @click="handlerQuery"
                type="primary"
              >{{ $t('COMMON.SEARCH') }}</v-button>
              <v-button class size="w120" @click="handlerToAdd">
                {{
                `+ ${$t('COMMON.ADD')}`
                }}
              </v-button>
            </el-row>
          </el-row>
        </div>
      </el-form>
      <!-- el-form end -->
      <!-- el-table start -->
      <el-table :data="recordList" stripe style="width:100%;" height="398px" class="mb16">
        <el-table-column :label="$t('COMMON.SERIAL_NUMBER')" type="index":width="lang === 'en' ? '110' : '80'"></el-table-column>
        <el-table-column prop="registerCode" :label="$t('PAYMENT.REGISTER_CODE')" width="200"></el-table-column>
        <el-table-column prop="payeeBank" :label="$t('PAYMENT.RECEIVE_BANK')" :width="lang === 'en' ? '265' : '185'">
          <template>{{ $t('PAYMENT.CHUANGXING_BANK_CPY') }}</template>
        </el-table-column>
        <el-table-column prop="payeeName" :label="$t('PAYMENT.PAYEE_NAME')" :width="lang === 'en' ? '265' : '185'"></el-table-column>
        <el-table-column prop="payeeAccount" :label="$t('PAYMENT.RECEIVE_ACCOUNT')" :width="lang === 'en' ? '230' : '180'">
          <template v-slot="{ row }">
            {{
            `${formatAcctNo(row.payeeAccount)} ${typeFilter(row.payeeType,row.payeeCcy)} ${filterAccountType(row.payeeType)}`
            }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('COMMON.OPERATION')"
          align="left"
          fixed="right"
          class="flexsb"
          :width="lang === 'en' ? '230' : '180'"
        >
          <template slot-scope="scope">
            <span @click="handlerToUpdate(scope.row)" class="u-table-btn">{{ $t('COMMON.UPDATE') }}</span>
            <span style="font-size:12px; color:#CCCCCC;margin: 0 5px;">|</span>
            <span
              @click="handlerToTransfer(scope.row)"
              class="u-table-btn"
            >{{ $t('PAYMENT.TRANS') }}</span>
            <span style="font-size:12px; color:#CCCCCC;margin: 0 5px;">|</span>
            <span @click="handlerDelete(scope.row)" class="s-fcolor">{{ $t('COMMON.DELETE') }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="changePageInfo($event, 'size')"
        @current-change="changePageInfo($event, 'current')"
        :current-page="pageInfo.current"
        :page-size="pageInfo.size"
        :total="pageInfo.total"
        :page-sizes="[10, 20, 30, 50]"
        layout="prev, pager, next, sizes, jumper"
      ></el-pagination>
      <!-- el-table end -->
    </div>

    <div v-else>
      <intra-bank-add-update
        :changeType="changeType"
        :changeData="changeData"
        @returnBack="
          showListFlag = true;
          returnBack();
        "
      ></intra-bank-add-update>
    </div>
  </div>
</template>

<script>
import intraBankAddUpdate from './intraBankAddUpdate';
import { filterParams } from '@/utils/tools';
import { createNamespacedHelpers, mapMutations } from 'vuex';
import {
  findInnerBankRegPageList,
  removeInnerBankReg
} from '@/api/paymentRemittance';
import filters from '@/filters/accountManagement';
import filter from '@/filters/public.js';
import { sendEmail } from '@/api/sendMsg';
import { formatAcctNo, transToCreditAcct } from '@bank-transfer/utils/function';
import { otpDialog, softToken, choosesWay } from '@/components/messageBox';
const { mapState } = createNamespacedHelpers('app');

export default {
  inject: ['scrollToTop', 'entType', 'sendEmail'],
  components: {
    intraBankAddUpdate
  },
  data() {
    return {
      tabIndex: 0,
      queryForm: {
        registerCode: '', //登记编号
        payeeName: '' //收款账户
      },
      recordList: [],
      showListFlag: true, //显示列表
      changeType: '',
      changeData: {},
      pageInfo: {
        total: 0,
        current: 1,
        size: 10
      }
    };
  },
  filters: {
    tradeStateFilter: filter.tradeStateFilter,
   filtersType:filter.filtersType
  },
  computed: {
    ...mapState(['lang', 'requestLoading']),
    // 总笔数
    totalTrans() {
      return `${this.$t('PAYMENT.TOTAL_TRANS')}：${
        this.pageInfo.total
      }${this.$t('PAYMENT.TRANS_NUM')}`;
    }
  },
  watch: {
    showListFlag: {
      immediate: true,
      handler(newVal) {
        if (newVal === true) {
          this.handleFilterQuery();
        }
      }
    }
  },
  methods: {
    ...mapMutations('app', ['setSliderMenusAct']),
    formatAcctNo,
    filterAccountType: filters.accountType,
    // search-data
    async getTableData(
      params = {
        current: this.pageInfo.current,
        size: this.pageInfo.size
      }
    ) {
      const result = await findInnerBankRegPageList(params);
      this.setPageInfo(result);
      this.setTableData(result);
    },
    setPageInfo({ current = 1, size = 10, total = 0 }) {
      this.pageInfo.current = current;
      this.pageInfo.size = size;
      this.pageInfo.total = total;
    },
    setTableData({ records = [] }) {
      this.recordList = [...records];
    },
    // 查询
    handlerQuery() {
      this.pageInfo = {
        current: 1,
        size: 10,
        total: 0
      };
      this.handleFilterQuery();
    },
    handleFilterQuery() {
      const queryParams = Object.assign(
        {},
        this.pageInfo,
        filterParams(this.queryForm)
      );
      this.getTableData(queryParams);
    },
    // 新增
    handlerToAdd() {
      this.showListFlag = false;
      this.changeType = 'add';
      this.changeData = {};
      this.$emit('clickChange');
    },
    //   修改
    handlerToUpdate(val) {
      this.showListFlag = false;
      this.changeType = 'update';
      this.$set(this, 'changeData', val);
      this.$emit('clickChange', this.changeData);
    },
    //   转账
    handlerToTransfer(row) {
      this.setSliderMenusAct('030101');
      const transferParams = transToCreditAcct({
        ...row
      });
      console.log(transferParams);
      this.$router.push({
        path: '/bankTransfer/paymentSettlement/intraBankTransfer',
        query: {
          params: JSON.stringify({
            ...transferParams,
            creditType: 2,
            isJumpTo: true,
            showNameFlag: true
          })
        }
      });
    },
    //   删除
    handlerDelete(crtItem) {
      this.$confirm({
        title: '',
        isIcon: true,
        type: 'warn',
        message: this.$t('PAYMENT.CONFIRM_REMOVE_REGISTERED_ACCOUNT'),
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

    async confirmDelete(crtItem) {
      const { registerCode, ...sub } = crtItem;
      const { adminEmpower, cuSoleAuthorizerInd } = JSON.parse(
        sessionStorage.getItem('userInfo')
      );
      removeInnerBankReg({ ...sub, registerCode }).then(
        ({ body = {}, head = {} }) => {
          const tradeInfo = JSON.stringify({
            ...sub,
            otpType: '0301013',
            operationStatus: '3'
          });
          const entType = localStorage.getItem('entType');
          if (head.returnCode == 'OTP000107' && cuSoleAuthorizerInd == '1') {
            choosesWay({
              checkWay: '',
              tradeInfo: tradeInfo,
              flag: '1'
              // status: status
            }).then(() => {
              this.confirmDelete(crtItem);
            });
          } else if (head.returnCode == 'OTP000107' && entType == '1') {
            // const tradeInfo = JSON.stringify(sub)
            softToken({
              softTokenCode: '',
              otpType: '0301013',
              tradeInfo: tradeInfo
              // flag:'3'
              // randomNum:''
            }).then(() => {
              // this.comfirm();
              this.confirmDelete(crtItem);
            });
          } else {
            if (body) {
              const { authResultInfo } = body;
              if (authResultInfo && authResultInfo.authResultState !== '91') {
                this.$message({
                  type: 'success',
                  message: `${this.$t('COMMON.SOMETHING_SUCCESS', {
                    op: this.$t('COMMON.OPERATION')
                  })} ${this.$options.filters['tradeStateFilter'](
                    authResultInfo.authResultState
                  )}`,
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
          }
        }
      );
      this.handleFilterQuery();
    },
    // 重置
    handlerReset() {
      if (this.$refs.queryForm) {
        this.$refs.queryForm.resetFields();
      }
    },
    // 返回
    returnBack() {
      this.$emit('clickBack');
    },
    changePageInfo(value, prop) {
      this.pageInfo[prop] = value;
      this.handleFilterQuery();
    },    
    typeFilter(val,cur){
      return filter.filtersType(val,cur)
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../common.scss';
.total-info {
  font-size: 14px;
  line-height: 22px;
  font-weight: 500;
}
</style>
