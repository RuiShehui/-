<template>
  <div class="operatorLog" v-loading="requestLoading">
    <el-form
      ref="operatorLogRef"
      :model="operatorLogForm"
      label-width="auto"
      v-if="isopen"
      style="margin-left: 33px"
    >
      <div style="display:flex">
        <el-form-item
          :label="$t('OPERATORLOG.REFERENCE_NUMBER')"
          prop="serialNo"
          label-width="140px"
        >
          <el-input
            @change="serialNo"
            v-model="operatorLogForm.serialNo"
            :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
                input:$t('OPERATORLOG.REFERENCE_NUMBER')
              })"
            style="width: 230px"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('OPERATORLOG.OPERATION_TYPE')"
          prop="operatorNo"
          label-width="140px"
        >
          <el-select
            v-model="operatorLogForm.operatorNo"
            :placeholder="$t('RIGHTS_TEMPLATE.ALL')"
            @change="operator"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="(item,index) in operatorType"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div style="display:flex">
        <el-form-item :label="$t('COMMON.TRADE_TYPE')+ '：'" prop="userName" label-width="140px">
          <el-cascader
            :placeholder="$t('RIGHTS_TEMPLATE.ALL')"
            v-model="operatorLogForm.userName"
            :options="options"
            :props="{expandTrigger: 'hover'}"
            separator="-"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          :label="$t('OPERATORLOG.TRANSCATION_CHANNEL')"
          prop="tradeChannel"
          label-width="140px"
        >
          <el-select
            v-model="operatorLogForm.tradeChannel"
            :placeholder="$t('RIGHTS_TEMPLATE.ALL')"
            @change="channel"
            :popper-append-to-body="false"
          >
            <el-option
              v-for="(item,index) in tradeChannelList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </div>
      <div style="display:flex">
        <el-form-item :label="$t('COMMON.SUBMIT_TIME')" prop="tradeTime" label-width="140px">
          <el-date-picker
            v-model="operatorLogForm.tradeTime[0]"
            :placeholder="$t('ACCOUNT_MANAGEMENT.START_DATE')"
            value-format="yyyy-MM-dd"
            :clearable="false"
            @change="changeTime1()"
            :picker-options="pickerOptions"
            range-separator
          ></el-date-picker>
          <span class="line">-</span>
          <el-date-picker
            v-model="operatorLogForm.tradeTime[1]"
            :placeholder="$t('ACCOUNT_MANAGEMENT.END_DATE')"
            value-format="yyyy-MM-dd"
            :clearable="false"
            @change="changeTime2()"
            :picker-options="pickerOptions"
            range-separator
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="timeArea">
          <div style="display: flex; margin: 12px 0 0 30px">
            <el-radio-group v-model="operatorLogForm.timeArea" @change="changRedio">
              <el-radio v-model="operatorLogForm.timeArea" label="1">{{$t('OPERATORLOG.SEVEN_DAY')}}</el-radio>
              <el-radio
                v-model="operatorLogForm.timeArea"
                label="2"
              >{{$t('OPERATORLOG.FOURTEEN_DAY')}}</el-radio>
              <el-radio v-model="operatorLogForm.timeArea" label="3">{{$t('OPERATORLOG.A_MONTH')}}</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
      </div>

      <el-row>
        <el-col
          :span="8"
          :push="2"
          class="flexc"
          style="float: right;
            justify-content: left"
        >
          <v-button size="w70" @click="resetClick()" class="mr16">{{$t('COMMON.RESET')}}</v-button>
          <v-button size="w75" type="primary" @click="queryClick()">{{$t('COMMON.SEARCH')}}</v-button>
          <div class="icon" @click="isopen=false">
            <span>{{$t('OPERATORLOG.CLOSE')}}</span>
            <i class="el-icon-arrow-up"></i>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <el-form
      ref="operatorLogRef"
      :model="operatorLogForm"
      label-width="auto"
      v-else
      style="margin-left: 25px"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item :label="$t('OPERATORLOG.REFERENCE_NUMBER')" prop="serialNo">
            <el-input
              v-model="operatorLogForm.serialNo"
              :placeholder="$t('COMMON.PLEASE_INPUT_SOMETHING',{
              input:$t('OPERATORLOG.REFERENCE_NUMBER')
            })"
              style="width: 230px"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" :push="2">
          <el-form-item :label="$t('OPERATORLOG.OPERATION_TYPE')" prop="operatorNo">
            <el-select
              v-model="operatorLogForm.operatorNo"
              @change="operator"
              :placeholder="$t('RIGHTS_TEMPLATE.ALL')"
            >
              <el-option
                v-for="(item,index) in operatorType"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" :push="2" class="flexc">
          <v-button size="w70" @click="resetClick()" class="mr16">{{$t('COMMON.RESET')}}</v-button>
          <v-button size="w75" type="primary" @click="queryClick()">{{$t('COMMON.SEARCH')}}</v-button>
          <div class="icon" @click="isopen=true">
            <span>{{$t('OPERATORLOG.OPEN')}}</span>
            <i class="el-icon-arrow-down"></i>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!-- 数据列表区 -->
    <el-table :data="operatorData" style="width：100%" stripe>
      <el-table-column prop="serialNo" :label="$t('OPERATORLOG.REFERENCE_NUMBER')" min-width="20%">
        <template slot-scope="scope">
          <el-button
            type="text"
            class="u-btnColor"
            @click="detailBtn(scope.row)"
          >{{ scope.row.flowNo }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="operationType"
        :label="$t('OPERATORLOG.OPERATION_TYPE')"
        min-width="15%"
      ></el-table-column>
      <el-table-column
        prop="businessName"
        :label="$t('OPERATORLOG.TRANSCATION_TYPE')"
        min-width="15%"
      ></el-table-column>
      <el-table-column
        prop="transChannel"
        :label="$t('OPERATORLOG.TRANSCATION_CHANNEL')"
        min-width="15%"
      ></el-table-column>
      <el-table-column prop="userName" :label="$t('OPERATORLOG.USER_NAME')" min-width="15%"></el-table-column>
      <el-table-column prop="createTime" :label="$t('OPERATORLOG.SUBMIT_TIME')" min-width="20%"></el-table-column>
    </el-table>
    <!-- 分页区 -->
    <div class="page">
      <pageNation
        class="mt15"
        v-if="total"
        :total="total"
        :page_index="current"
        @sizeChange="sizeChange"
        @pageChange="pageChange"
      />
    </div>
    <div class="download">
      <v-button type="primary" size="w210" @click="download">{{$t('OPERATORLOG.DOWNLOAD')}}</v-button>
    </div>

    <el-dialog :title="$t('USER_MANAGERMENT.APPROVAL_DETA')" :visible.sync="dialogVisible" width="1116px" top="0vh" :show-close="false">
      <authorizetionProcess class="authBox" :flowNo="selectFlow"></authorizetionProcess>
      <span slot="footer">
        <v-button size="w210" @click="confirm">{{$t('COMMON.BACK')}}</v-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { searchAuthRecord, queryAuthRecord } from '@/api/authorizeCenter';
import { downloadListAll, queryListPage } from '@/api/operatorLog';
import { export_excel_file, downUrl } from './execl_file';
// import {downUrl } from './execl_file';
import { mapState } from 'vuex';
import authorizetionProcess from '@/views/authorizeCenter/components/authorizetionProcess';
export default {
  components: {
    authorizetionProcess
  },
  data() {
    return {
      isProcess:'0',
      itemKey: null,
      operatorLogForm: {
        serialNo: '',
        operatorNo: '',
        userName: '',
        tradeChannel: '',
        tradeTime: [],
        timeArea: '1'
      },
      defaultTime: ['2012-01-09', '2017-06-10'],
      min: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        //不能选择跨过30天的
        disabledDate: time => {
          let m = 30 * 24 * 60 * 60 * 1000;
          if (this.min) {
            return (
              time.getTime() > this.min + m ||
              time.getTime() < this.min - m ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      exel: '',
      //用户名
      userNameList: [
        {
          label: '用户名2',
          value: '1'
        },
        {
          label: '用户名3',
          value: '2'
        }
      ],
      //操作类型
      operatorType: [
        {
          label: this.$t('COMMON.ADD'),
          value: '1'
        },
        {
          label: this.$t('COMMON.DELETE'),
          value: '3'
        },
        {
          label: this.$t('COMMON.UPDATE'),
          value: '2'
        }
      ],
      //交易渠道
      tradeChannelList: [
        {
          label: this.$t('OPERATORLOG.TO_WEB'),
          value: 'WEB'
        },
        {
          label: this.$t('OPERATORLOG.TO_APP'),
          value: 'APP'
        }
      ],
      operatorData: [],
      currentPage: 0,
      dialogVisible: false,
      options: [
        {
          value: '1101',
          label: this.$t('OPERATORLOG.LOGON')
        },

        {
          value: '1102',
          label: this.$t('OPERATORLOG.LOGOUT')
        },
        {
          value: '1201',
          label: this.$t('OPERATORLOG.FORGOT_LOGON_ID')
        },
        {
          value: '1301',
          label: this.$t('OPERATORLOG.FORGOT_PASSWORD')
        },
        {
          value: '14',
          label: this.$t('OPERATORLOG.PERSONAL_SETTINGS'),
          children: [
            {
              value: '1401',
              label: this.$t('OPERATORLOG.CHANGE_PASSWORD')
            },
            {
              value: '1402',
              label: this.$t('OPERATORLOG.MY_LOGON_NAME')
            }
          ]
        },
        {
          value: '030101',
          label: this.$t('OPERATORLOG.TRANSFER_WITHIN_THE_BANK')
        },
        {
          value: '03010201',
          label: this.$t('OPERATORLOG.FASTER_PAYMENT_SYSTEM')
        },
        {
          value: '03010202',
          label: this.$t('OPERATORLOG.FOREIGN_CURRENCY_TRANSFER')
        },
        {
          value: '030103',
          label: this.$t('OPERATORLOG.TELEGRAPHIC_TRANSFER')
        },
        {
          value: '030106',
          label: this.$t('OPERATORLOG.RECENT_TRANSFER_RECORD')
        },
        {
          value: '030107',
          label: this.$t('OPERATORLOG.REGISTER_THIRD_PARTY_ACCOUNTS')
        },
        {
          value: '030104',
          label: this.$t('OPERATORLOG.BULK_TRANSFER'),
          children: [
            {
              value: '03010401',
              label: this.$t('OPERATORLOG.BULK_TRANSACTION_ENTRY')
            }
          ]
        },
        {
          value: '030105',
          label: this.$t('OPERATORLOG.BULK_PAYROLL'),
          children: [
            {
              value: '03010501',
              label: this.$t('USER_MANAGERMENT.TRADE_TYPE_SMALL_0401')
            }
          ]
        },
        {
          value: '0303',
          label: this.$t('OPERATORLOG.SCHEDULED_TRANSACTION_MANAGEMENT')
        },
        {
          value: '10',
          label: this.$t('OPERATORLOG.REQUEST_FOR_CHEQUE_BOOK')
        },
        {
          value: '04',
          label: this.$t('OPERATORLOG.FIXED_DEPOSIT'),
          children: [
            {
              value: '0402',
              label: this.$t('OPERATORLOG.FIXED_DEPOSIT_PLACEMENT')
            },
            {
              value: '0403',
              label: this.$t('OPERATORLOG.AMEND_MATURITY_INSTRUCTION')
            }
          ]
        },
        {
          value: '0501',
          label: this.$t('OPERATORLOG.CURRENCY_EXCHANGE'),
          children: [
            {
              value: '050102',
              label: this.$t('OPERATORLOG.CURRENCY_EXCHANGE')
            }
          ]
        },
        {
          value: '0601',
          label: this.$t('OPERATORLOG.BILL_PAYMENT'),
          children: [
            {
              value: '060101',
              label: this.$t('OPERATORLOG.BILL_PAYMENT')
            },
            {
              value: '060102',
              label: this.$t('OPERATORLOG.MY_PAYEE_LIST')
            },
            {
              value: '060103',
              label: this.$t('OPERATORLOG.SCHEDULED_PAYMENT_MANAGEMENT')
            }
          ]
        },
        {
          value: '09',
          label: this.$t('OPERATORLOG.MANAGEMNET_CENTER'),
          children: [
            {
              value: '0901',
              label: this.$t('OPERATORLOG.USER_MANAGEMENT')
            },
            {
              value: '0902',
              label: this.$t('OPERATORLOG.ACCOUNT_MANAGEMENT')
            },
            {
              value: '090301',
              label: this.$t('OPERATORLOG.AUTHORISATION_TEMPLATE_MANAGEMENT')
            },
            {
              value: '090302',
              label: this.$t('OPERATORLOG.TRANSACTION_AUTHORISATION_SETTINGS')
            },
            {
              value: '090401',
              label: this.$t('OPERATORLOG.SERVICE_LIMIT_SETTING')
            },
            {
              value: '090402',
              label: this.$t('OPERATORLOG.FPS_ADDRESSING_SERVICE')
            },
            {
              value: '090403',
              label: this.$t('OPERATORLOG.FUND_TRANSFER_LIMIT')
            },
            {
              value: '090404',
              label: this.$t('OPERATORLOG.EDDA_SERVICE')
            },
            {
              value: '090405',
              label: this.$t('OPERATORLOG.SET_UP_E_STATEMENT')
            },
            {
              value: '090406',
              label: this.$t('OPERATORLOG.SET_UP_TRADING_ALERTS')
            }
          ]
        },
        {
          value:"16",
          label:this.$t('SPECIAL_INSTRUACTION.SPECIAL_ORDER_APPLICATION')
        }
      ],
      activeIndex: 1,
      isopen: false, // 展开/收起标识
      current: 1,
      flowNo: '',
      globalNo: '',
      merchantCode: '',
      operationType: '',
      size: 10,
      transChannel: '',
      transTimeEnd: '',
      transTimeStart: '',
      transType1: '',
      transType2: '',
      transType3: '',
      userCode: '',
      userName: '',
      total: 0,
      selectFlow: ''
    };
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  created() {
    this.initTime();
    this.queryListPageInit();
    //使用mock，返回的是new Promise()
  },
  mounted() {
    this.entType = localStorage.getItem('entType');
  },
  methods: {
    initTime() {
      this.itemKey = Math.random();
      let end = new Date();
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
      this.operatorLogForm.tradeTime = [start, end];
      this.transTimeStart = this.converTimeOfYMD(start);
      this.transTimeEnd = this.converTimeOfYMD(end);
      console.log('tradeTime', this.transTimeStart, this.transTimeEnd);
    },
    queryListPageInit() {
      console.log('this.operatorLogForm', this.operatorLogForm);
      let param = {
        current: this.current,
        flowNo: this.operatorLogForm.serialNo, //参考编号
        globalNo: '', //全局流水号
        merchantCode: '', //
        operationType: this.operationType, //操作类型，SAVE：新增 DELETE：删除 UPDATE：修改
        size: this.size,
        transChannel: this.operatorLogForm.tradeChannel, //交易渠道，WEB：个人网银 MBC：手机银行
        transTimeEnd: this.transTimeEnd, //交易时间结束
        transTimeStart: this.transTimeStart, //交易时间开始
        submitType: '', //一级交易类型
        businessCode: this.transType1,
        transType2: '', //二级交易类型
        transType3: this.transType3, //三级交易类型，1查询 10录入 100授权
        userCode: '', //
        userName: ''
      };
      console.log('param=====>', param);
      queryListPage(param).then(res => {
        console.log('res---------------------------res',res)
        this.operatorData = res.records;
        this.total = res.total;
        this.operatorData.map((item, index) => {
          if (item.operationType == '1') {
            item.operationType = this.$t('COMMON.ADD');
          } else if (item.operationType == '3') {
            item.operationType = this.$t('COMMON.DELETE');
          } else if (item.operationType == '2') {
            item.operationType = this.$t('COMMON.UPDATE');
          } else if (item.operationType || !item.operationType) {
            item.operationType = '--';
          }
          item.businessName = this.codeString(item);
          if (item.transChannel == 'WEB') {
            item.transChannel = this.$t('OPERATORLOG.TO_WEB');
          } else if (item.transChannel == 'APP') {
            item.transChannel = this.$t('OPERATORLOG.TO_APP');
          }

          if (item.flowNo == '') {
            item.flowNo = '--';
          }
        });
      });
    },
    codeString(item) {
      let businessCode = '';
      let submitType = '';
      switch (item.businessCode) {
        case '1101':
          businessCode = this.$t('OPERATORLOG.LOGON');
          break;
        case '1102':
          businessCode = this.$t('OPERATORLOG.LOGOUT');
          break;
        case '1201':
          businessCode = this.$t('OPERATORLOG.FORGOT_LOGON_ID');
          break;
        case '1301':
          businessCode = this.$t('OPERATORLOG.FORGOT_PASSWORD');
          break;
        case '14':
          businessCode = this.$t('OPERATORLOG.PERSONAL_SETTINGS');
          break;
        case '1401':
          businessCode = this.$t('OPERATORLOG.CHANGE_PASSWORD');
          break;
        case '1402':
          businessCode = this.$t('OPERATORLOG.MY_LOGON_NAME');
          break;
        case '1501':
          businessCode =this.$t('OPERATORLOG.MOBLIE_SECURITY');
          break;
        case '1502':
          businessCode = this.$t('OPERATORLOG.FIRST_MOBLIE_SECURITY');
          break;
        case '1503':
          businessCode = this.$t('OPERATORLOG.MOBLE_SECURITY_ACTIVATION');
          break;
        case '15023':
          businessCode = this.$t('OPERATORLOG.MOBLIE_SECURITY_PIN');
          break;
        case '1504':
          businessCode = this.$t('MOBILE_TOKEN.TERMINATION_OF_SERVICE');
          break;
        case '0201':
          businessCode = this.$t('OPERATORLOG.ACCOUNT_OVERVIEW');
          break;
        case '0202':
          businessCode = this.$t('OPERATORLOG.TRANSACTION_DETAILS_ENQUIRY');
          break;
        case '0203':
          businessCode = this.$t('OPERATORLOG.E_STATEMENT');
          break;
        case '0204':
          businessCode = this.$t('OPERATORLOG.E_ADVICE');
          break;
        case '030101':
          businessCode = this.$t('OPERATORLOG.TRANSFER_WITHIN_THE_BANK');
          break;
        case '03010201':
          businessCode = this.$t('OPERATORLOG.FASTER_PAYMENT_SYSTEM');
          break;
        case '03010202':
          businessCode = this.$t('OPERATORLOG.FOREIGN_CURRENCY_TRANSFER');
          break;
        case '030103':
          businessCode = this.$t('OPERATORLOG.TELEGRAPHIC_TRANSFER');
          break;
        case '030106':
          businessCode = this.$t('OPERATORLOG.RECENT_TRANSFER_RECORD');
          break;
        case '030107':
          businessCode = this.$t('OPERATORLOG.REGISTER_THIRD_PARTY_ACCOUNTS');
          break;
        case '03010401':
          businessCode = this.$t('OPERATORLOG.BULK_TRANSACTION_ENTRY');
          break;
        case '03010402':
          businessCode = this.$t('OPERATORLOG.BULK_TRANSACTION_ENQUIRY');
          break;
        case '03010501':
          businessCode = this.$t('OPERATORLOG.BULK_TRANSACTION_ENTRY');
          break;
        case '03010502':
          businessCode = this.$t('OPERATORLOG.BULK_TRANSACTION_ENQUIRY');
          break;
        case '0303':
          businessCode = this.$t(
            'OPERATORLOG.SCHEDULED_TRANSACTION_MANAGEMENT'
          );
          break;
        case '10':
          businessCode = this.$t('OPERATORLOG.REQUEST_FOR_CHEQUE_BOOK');
          break;
        case '0402':
          businessCode = this.$t('OPERATORLOG.FIXED_DEPOSIT');
          break;
        case '0401':
          businessCode = this.$t('OPERATORLOG.FIXED_DEPOSIT_OVERVIEW');
          break;
        case '0403':
          businessCode = this.$t('OPERATORLOG.AMEND_MATURITY_INSTRUCTION');
          break;
        case '050102':
          businessCode = this.$t('OPERATORLOG.FOREIGN_CURRENCY_EXCHANG');
          break;
        case '050101':
          businessCode = this.$t('OPERATORLOG.FOREIGN_EXCHANGE_RATES');
          break;
        case '050201':
          businessCode = this.$t('OPERATORLOG.FUND_SUBSCRIPTION');
          break;
        case '050202':
          businessCode = this.$t('OPERATORLOG.MY_FUND');
          break;
        case '050203':
          businessCode = this.$t('OPERATORLOG.FUND_MONTHLY_REPORT');
          break;
        case '0503':
          businessCode = this.$t('OPERATORLOG.INVESTMENT_TRANSACTION_RECORD');
          break;
        case '060101':
          businessCode = this.$t('OPERATORLOG.BILL_PAYMENT');
          break;
        case '1052':
          businessCode = this.$t('OPERATORLOG.MY_PAYEE_LIST');
          break;
        case '060102':
          businessCode = this.$t('OPERATORLOG.MY_PAYEE_LIST');
          break;
        case '060103':
          businessCode = this.$t('OPERATORLOG.SCHEDULED_PAYMENT_MANAGEMENT');
          break;
        case '0701':
          businessCode = this.$t('OPERATORLOG.PENDING_AUTHORISATION');
          break;
        case '0702':
          businessCode = this.$t('OPERATORLOG.MY_SUBMISSION');
          break;
        case '080501':
          businessCode = this.$t('OPERATORLOG.DEPOSIT_RATES'); // 储蓄利率
          break;
        case '080502':
          businessCode = this.$t('OPERATORLOG.DEPOSIT_RATES');
          break;
        case '0801':
          businessCode = this.$t('OPERATORLOG.FOREIGN_EXCHANGE_RATES');
          break;
        case '0803':
          businessCode = this.$t('OPERATORLOG.SERVICE_CENTRE');
          break;
        case '0804':
          businessCode = this.$t('OPERATORLOG.DOWNLOAD_APP');
          break;
        case '0802':
          businessCode = this.$t('OPERATORLOG.TRANSACTION_RECORD');
          break;
        case '0901':
          businessCode = this.$t('OPERATORLOG.USER_MANAGEMENT');
          break;
        case '0902':
          businessCode = this.$t('OPERATORLOG.ACCOUNT_MANAGEMENT');
          break;
        case '090301':
          businessCode = this.$t(
            'OPERATORLOG.AUTHORISATION_TEMPLATE_MANAGEMENT'
          );
          break;
        case '090302':
          businessCode = this.$t(
            'OPERATORLOG.TRANSACTION_AUTHORISATION_SETTINGS'
          );
          break;
        case '090401':
          businessCode = this.$t('OPERATORLOG.SERVICE_LIMIT_SETTING');
          break;
        case '090402':
          businessCode = this.$t('OPERATORLOG.FPS_ADDRESSING_SERVICE');
          break;
        case '090403':
          businessCode = this.$t('OPERATORLOG.FUND_TRANSFER_LIMIT');
          break;
        case '090404':
          businessCode = this.$t('OPERATORLOG.EDDA_SERVICE');
          break;
        case '090405':
          businessCode = this.$t('OPERATORLOG.SET_UP_E_STATEMENT');
          break;
        case '090406':
          businessCode = this.$t('OPERATORLOG.SET_UP_TRADING_ALERTS');
          break;
        case '090501':
          businessCode = this.$t('OPERATORLOG.MY_SUBMISSION');
          break;
        case '090502':
          businessCode = this.$t('OPERATORLOG.PENDING_AUTHORISATION');
          break;
        case '0906':
          businessCode = this.$t('OPERATORLOG.ACTION_LOG_ENQUIRY');
          break;
        case '16':  
          businessCode = this.$t('SPECIAL_INSTRUACTION.SPECIAL_ORDER_APPLICATION')
      }

      item.submitType == '1'
        ? (submitType = this.$t('COMMON.SEARCH'))
        : item.submitType == '10'
        ? (submitType = this.$t('OPERATORLOG.TO_ENTER'))
        : item.submitType == '100'
        ? (submitType = this.$t('OPERATORLOG.TO_AUTHORIZTION'))
        : (submitType = '');
      let transTypeName = '';
      if (submitType) {
        transTypeName = businessCode + '-' + submitType;
      } else {
        transTypeName = businessCode;
      }
      return transTypeName;
    },
    converTimeOfYMD(date) {
      return new Date(date).toISOString().slice(0, 10);
    },
    //提交时间
    changeTime1(item) {
      console.log('----time', item);
      this.transTimeStart = this.operatorLogForm.tradeTime[0];
    },
    changeTime2(item) {
      console.log('----time', item);
      this.transTimeEnd = this.operatorLogForm.tradeTime[1];
    },
    resetClick() {
      this.flowNo = '';
      this.globalNo = '';
      this.merchantCode = '';
      this.operationType = '';
      // size: 10,
      this.transChannel = '';
      this.initTime();
      this.transType1 = '';
      this.ransType2 = '';
      this.transType3 = '';
      this.$refs['operatorLogRef'].resetFields();
    },
    changRedio(value) {

      let end = new Date();
      let start = new Date();
      switch (value) {
        case '1':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
          this.$nextTick(() => {
            this.operatorLogForm.tradeTime = [start, end];
            this.itemKey = Math.random();
          });
          this.transTimeStart = this.converTimeOfYMD(start);
          this.transTimeEnd = this.converTimeOfYMD(end);

          break;
        case '2':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 13);
          this.$nextTick(() => {
            this.operatorLogForm.tradeTime = [start, end];
            this.itemKey = Math.random();
          });
          this.transTimeStart = this.converTimeOfYMD(start);
          this.transTimeEnd = this.converTimeOfYMD(end);

          break;
        case '3':
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
          this.operatorLogForm.tradeTime = [start, end];
          this.itemKey = Math.random();
          this.transTimeStart = this.converTimeOfYMD(start);
          this.transTimeEnd = this.converTimeOfYMD(end);

          break;
      }
    },
    channel(item) {

      if (item == 1) {
        this.transChannel = 'WEB';
      } else {
        this.transChannel = 'APP';
      }
    },
    handleChange(item) {
      this.transType1 = item[item.length - 1];

    },
    operator(index) {

      this.operationType = index;
    },
    serialNo(item) {
      this.flowNo = item;
      console.log('this.flowNo', this.flowNo);
    },
    //分页
    sizeChange(size) {
      this.size = size.page_limit;
      this.queryListPageInit();
      console.log('size---', this.size);
    },
    pageChange(page) {
      this.current = page.page_index;
      this.queryListPageInit();
      console.log('current---', this.current);
    },
    queryClick() {
      this.current = 1;
      this.queryListPageInit();
    },
    detailBtn(row) {
      console.log('row-------------1',row)
      let userInfo =JSON.parse(sessionStorage.getItem('userInfo'))
      if (this.entType == '1' ||userInfo.cuSoleAuthorizerInd==='1') {
        this.isProcess = '0';
      }
      if (row.flowNo != '--') {
        queryAuthRecord({ flowNo: row.flowNo }).then(resp => {
          console.log('resp', resp);
          let obj = {
            0: this.$t('AUTHORIZE.WAIT_AUTHOR'),
            1: this.$t('AUTHORIZE.AUTH_AGREE'),
            2: this.$t('AUTHORIZE.REFUSE'),
            3: this.$t('AUTHORIZE.AUTH_CANCLE'),
            4: this.$t('AUTHORIZE.OUT_DATE')
          };
          if (resp && resp.tcApprovalRecords) {
            row.userName = resp.userName;
            if (resp.tcApprovalRecords.length === 1) {
              row.authStateName = obj[resp.tcApprovalRecords[0].authState];
              row.authTime = resp.tcApprovalRecords[0].submitTimes;
              row.autherName = resp.tcApprovalRecords[0].userName;
              row.dealRen = resp.tcApprovalRecords[0].dealRen;
            } else if (resp.tcApprovalRecords.length > 1) {
              let authStateName = '';
              let authTime = '';
              let autherName = '';
              let dealRen = '';
              // let userName = ''
              resp.tcApprovalRecords.forEach(item => {
                if (authStateName) {
                  authStateName = authStateName + ';' + obj[item.authState];
                } else {
                  authStateName = obj[item.authState];
                }
                if (authTime) {
                  authTime = authTime + ';' + item.submitTimes;
                } else {
                  authTime = item.authTime;
                }
                if (autherName) {
                  autherName = autherName + ';' + item.userName;
                } else {
                  autherName = item.userName;
                }
                if (dealRen) {
                  dealRen = dealRen + ';' + item.dealRen;
                } else {
                  dealRen = item.dealRen;
                }
                row.authStateName = authStateName;
                row.authTime = authTime;
                row.autherName = autherName;
                row.dealRen = dealRen;
              });
            } else {
              if (resp.authState && resp.authState != '') {
                row.authStateName = obj[resp.authState];
              } else {
                row.authStateName = '';
              }
            }
          } else {
            if (resp.authState && resp.authState != '') {
              row.authStateName = obj[resp.authState];
            } else {
              row.authStateName = '';
            }
          }
          // row.businessName = this.codeString(row.businessCode);
          console.log('row.authStateName', row.authStateName);
          console.log('row', row);
          this.$router.push({
            path: '/authorizeCenter/detail',
            query: {
              // flowNo: row.flowNo,
              isProcess: '0',
              row: row,
              scene: '1',
              jump030103: 'Y',
              authState: 0
            }
          });
        });
      }
    },
    download() {
      let param = {
        current: this.current,
        flowNo: this.flowNo, //参考编号
        globalNo: '', //全局流水号
        merchantCode: '', //
        operationType: this.operationType, //操作类型，1：新增 3：删除 2：修改
        size: this.size,
        transChannel: this.transChannel, //交易渠道，WEB：个人网银 MBC：手机银行
        transTimeEnd: this.transTimeEnd, //交易时间结束
        transTimeStart: this.transTimeStart, //交易时间开始
        submitType: '', //一级交易类型
        businessCode: this.transType1,
        transType2: '', //二级交易类型
        userCode: '', //
        userName: ''
      };
      downloadListAll(param).then(res => {
        if (res.url) {
          if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            window.navigator.msSaveOrOpenBlob(res.url, this.$t('USER_MANAGERMENT.LOG_FILE'));
          } else {
            downUrl(res.url);
          }
        }
      });
    },
    confirm() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.scss';
</style>
