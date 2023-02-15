<template>
  <div>
    <div class="g-payeeInform">
      <!-- 付款人信息 -->
      <Divider :title="$t('TRANSFR_INFO.PAYMESSAGE')"></Divider>
      <el-form label-width="160px" class="formBox">
        <el-form ref="formData" :model="formData" :rules="rules" label-width="160px">
          <!-- 付款账户: -->
          <el-form-item class="sel-account" :label="$t('TRANSFR_INFO.PAYACCOUNT') + ':'" prop="payAcctNo">
            <el-select
              v-model="formData.payAcctNo"
              :placeholder="$t('TRANSFR_INFO.SELECT')"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in payAcctList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
            <p class="f12 gray3" v-if="formData.payAcctNoMoney">
              <!-- 可用结余: -->
              {{$t('TRANSFR_INFO.PAYACCTNO_MONEY')}}:
              {{cur +' '+ formatMoneyNew(formData.payAcctNoMoney)}}
            </p>
            <div class="f12 gray4 u-company" v-if="formData.company">
              <!-- 账户名称: -->
              <span>{{$t('TRANSFR_INFO.COMPANY')}}{{ formData.company }}</span>
            </div>
            <el-tag v-if="isShowOverBalances" type="warning" class="tag">
              <span>{{ $t('PAYMENT.OVER_BALANCE_TIP') }}</span>
            </el-tag>
          </el-form-item>
          <!-- 手续费扣款账户: -->
          <el-form-item
            class="sel-account"
            :label="$t('TRANSFR_INFO.CHARG_ACCOUNT')"
            prop="cutPayAcctNo"
          >
            <el-select
              v-model="formData.cutPayAcctNo"
              :placeholder="$t('TRANSFR_INFO.SELECT')"
              @change="cutSelectPayAcctNo"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in cutPayAccttList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
            <p class="f12 gray3" v-if="formData.cutPayAcctNoMoney">
              <!-- 可用结余: -->
              {{$t('TRANSFR_INFO.PAYACCTNO_MONEY')}}:
              {{ cur +' '+ formatMoneyNew(formData.cutPayAcctNoMoney)}}
            </p>
            <div class="f12 gray2 u-company" v-if="formData.cutcompany">
              <!-- 账户名称: -->
              <span>{{$t('TRANSFR_INFO.COMPANY')}}{{ formData.cutcompany }}</span>
            </div>
            <el-tag v-if="isShowOverBalance1" type="warning" class="tag">
              <span>{{ $t('PAYMENT.OVER_BALANCE_TIP') }}</span>
            </el-tag>
          </el-form-item>
        </el-form>
        <!-- 预约处理: -->
        <el-form-item :label="$t('TRANSFR_INFO.CANCEN')">
          <el-checkbox v-model="formData.checked" @change="pickerChang"></el-checkbox>
        </el-form-item>
        <el-form ref="formDataDate" :model="formData" :rules="rulesDate" label-width="160px">
          <!-- 预约处理日期: -->
          <el-form-item
            prop="transOutDate"
            required
            v-if="formData.checked"
            class="sel-data"
            :label="$t('TRANSFR_INFO.SEL_DATA')"
          >
            <el-date-picker
              v-model="formData.transOutDate"
              type="date"
              :placeholder="$t('TRANSFR_INFO.SELECT')"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              @input="changeTime"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <!-- 重试扣账: -->
        <el-form-item
          :label="$t('TRANSFR_INFO.CHECK')"
          v-show="formData.checked ? true : false"
          prop="redebitChecked"
          class="checkboxStyle"
        >
          <el-checkbox
            v-model="formData.redebitChecked"
            @change="redebitCheckedFun"
          >{{$t('TRANSFR_INFO.REDEBIT_CHECKED')}}</el-checkbox>
        </el-form-item>
      </el-form>
      <!-- 收款人信息 -->
      <Divider :title="$t('TRANSFR_INFO.CUTMESSAGE')"></Divider>
      <div v-if="activeName === 'onlineEditing'">
        <div class="m-tips">
          <v-button
            size="wMin160"
            style="margin-top:20px;letter-spacing: 0;"
            @click="open"
          >{{$t('PAYMENT.REGISTRIED_ACCOUNT_QUERY')}}</v-button>
          <div class="u-tips">
            <!-- 最多添加50个收款信息，如需向更多人收款，请选择“ -->
            {{$t('TRANSFR_INFO.MORE_ADD')}}
            <!-- 文件上载  ”方式-->
            <span @click="uploadFile">{{$t('TRANSFR_INFO.FILE_UPLOAD')}}</span>
            {{$t('TRANSFR_INFO.FILE_WAY')}}
            <p class="u-account" style="margin-top: 11px">
              <!-- 总笔数: 总金额: -->
              {{$t('TRANSFR_INFO.ALL_PENS')}}{{
              formData.tableData.length
              }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{$t('TRANSFR_INFO.ALL_AMOUNT')}}{{ allMonth ? allMonth : 0}} {{cur}}
            </p>
          </div>
        </div>
        <el-form ref="formDataTable" :model="formData" class="m-table" :rules="rules">
          <el-table :data="formData.tableData" stripe class="u-table" style="width:1040px">
            <!-- 收款账户 -->
            <el-table-column :label="$t('TRANSFR_INFO.CUT_ACCOUNT')" width="210">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.authorNum'"
                  :rules="rules.authorNum"
                >
                  <el-tooltip effect="light" placement="top" :content="scope.row.authorNum">
                    <money-input
                      v-model.trim="scope.row.authorNum"
                      @onMoneyInput="authorBlur"
                      :isAllNum="true"
                      style="width:175px;"
                      :placeholder="$t('TRANSFR_INFO.IUT_PAYACCOUNT')"
                      maxlength="34"
                    />
                  </el-tooltip>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 收款户名 -->
            <el-table-column
              :label="$t('TRANSFR_INFO.ACCOUNT_NAME')"
              prop="paymentAccount"
              width="230"
            >
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.paymentAccount'"
                  :rules="rules.paymentAccount"
                >
                  <el-tooltip effect="light" placement="top" :content="scope.row.paymentAccount">
                    <!-- 请输入收款户名 -->
                    <el-input
                      v-model="scope.row.paymentAccount"
                      :placeholder="$t('TRANSFR_INFO.IPUT_OAYACCOUNT')"
                      maxlength="120"
                      @blur="trimName(scope.$index)"
                    ></el-input>
                  </el-tooltip>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 收款银行/机构 -->
            <el-table-column :label="$t('TRANSFR_INFO.PAYBANK')" prop="payBank" width="240">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'tableData.' + scope.$index + '.payBank'"
                  :rules="rules.payBank"
                >
                  <el-select
                    v-model="scope.row.payBank"
                    :filterable="true"
                    :placeholder="$t('TRANSFR_INFO.SELECT')"
                    class="u-sel"
                    @change="selectBank($event, scope.$index)"
                    transfer="true"
                  >
                    <el-option
                      v-for="item in payBank"
                      :label="item.clearingCode + ' ' +item.label"
                      :value="item.value"
                      :key="item.key"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 转账金额 -->
            <el-table-column :label="$t('TRANSFR_INFO.TRANS_AOOUMT')" prop="payee" width="240">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.payee'" :rules="rules.payee">
                  <!-- 请输入转账金额 -->
                  <MoneyInput
                    v-model.trim="scope.row.payee"
                    class="u-sel"
                    :placeholder="$t('TRANSFR_INFO.IPUT_AMOUNT')"
                    maxlength="17"
                    :isSaveDot="true"
                    @blur="authorizationSelectFun()"
                  ></MoneyInput>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('TRANSFR_INFO.TIPS')" prop="tips" width="210">
              <template slot-scope="scope">
                <el-form-item :prop="'tableData.' + scope.$index + '.tips'" :rules="rules.tips">
                  <!-- 请输入附言(致收款人) -->
                  <el-input
                    v-model="scope.row.tips"
                    @blur="tipsBlur(scope.row.tips, scope.$index)"
                    :placeholder="$t('TRANSFR_INFO.IPUT_TIPS')"
                    maxlength="50"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <!-- 操作 -->
            <el-table-column
              :label="$t('TRANSFR_INFO.PROLOT')"
              fixed="right"
              align="center"
              width="100"
            >
              <template slot-scope="scope">
                <!-- 删除 -->
                <el-button
                  @click="del(scope.row, scope.$index)"
                  type="text"
                >{{$t('TRANSFR_INFO.DELETE')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <div class="u-btn" v-show="showTable">
          <v-button
            size="wMin210"
            type="primary"
            class="mr16"
            @click="addTable"
          >{{$t('TRANSFR_INFO.ADD_CUTMESSAGE')}}</v-button>
        </div>
        <div v-show="showTables">
          <el-button class="u-adduser" @click="addTable">+ {{$t('TRANSFR_INFO.ADD_CUTMESSAGE')}}</el-button>
        </div>
      </div>
      <!-- 文件上传 -->
      <div class="m-tips-up" v-if="activeName === 'fileUpload'">
        <div class="m-form">
          <el-form ref="formDataUpFile" :model="formData1" :rules="rules1" label-width="160px">
            <!-- 批量文件: -->
            <el-form-item
              class="sel-account"
              :label="$t('TRANSFR_INFO.BATCH_FILE')"
              prop="uploadFile"
            >
              <!-- :action="uploadUrl" -->
              <div class="lodeFile">
                <div class="upload">
                  <el-upload
                    class="g-upload-btn"
                    ref="upload"
                    :action="uploadUrl"
                    :multiple="false"
                    :show-file-list="false"
                    :limit="1"
                    accept=".xlsx, .xls"
                    :before-upload="handleUploadFile"
                    :on-success="upSuccess"
                    :file-list="formData1.uploadFile"
                    :http-request="handleUploadFile2"
                  >
                    <el-button class="up-btn">
                      <img src="@/images/fixedOpen/upload.png" alt />
                      <!-- 上载文件 -->
                      <span>{{$t('TRANSFR_INFO.UPLOAD_FILE')}}</span>
                    </el-button>
                  </el-upload>
                  <!-- 仅支持*xls、*xlsx格式上传 -->
                  <p class="f14">{{$t('TRANSFR_INFO.XLS')}}</p>
                </div>
                <div class="template">
                  <!-- 下载模板 模板.xls -->
                  <a
                    href="template.xls"
                    target="_blank"
                    :download="$t('TRANSFR_INFO.MODE')"
                    class="file-download"
                  >{{$t('TRANSFR_INFO.DOWNLOAD_MODE')}}</a>
                </div>
              </div>
            </el-form-item>
            <div class="word" v-if="fileName" @click="deleteFile">
              <i class="el-icon-folder-opened" style="font-size:20px;color:#F06B00"></i>
              <span>{{ fileName }}</span>
              <i class="el-icon-delete" style="font-size:10px;color:rgba(0,0,0,0.45)"></i>
            </div>
            <!-- 总金额: -->
            <el-form-item
              class="sel-account"
              :label="$t('TRANSFR_INFO.ALL_MONENY')"
              prop="totalMoney"
            >
              <!-- 请输入总金额 -->
              <el-input
                :value="
                  formData1.totalMoney | formatMoney
                "
                :placeholder="$t('TRANSFR_INFO.INPUT_ALLMOUNT')"
                disabled
              ></el-input>
            </el-form-item>
            <!-- 总笔数: -->
            <el-form-item class="u-total" :label="$t('TRANSFR_INFO.ALL_PENS')" prop="allsum">
              <!-- 请输入总笔数 -->
              <el-input
                v-model="formData1.allsum"
                :placeholder="$t('TRANSFR_INFO.INPUT_ALLPENS')"
                disabled
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-form>
        <AuthSelect
          labelWidth="160px"
          @checkClick="getAuthInfo"
          :authInfo="formData.authInfo"
          ref="authorizationSelect"
          v-show="entType !== 1"
          :book="true"
          :amount="activeName === 'fileUpload'? formData1.totalMoney :allMonth "
          tradeType="03010501"
          :isSelectDeal="true"
        />
      </el-form>
      <el-row class="flexc mt36">
        <!-- 重置 -->
        <v-button type size="w160" @click="reset(1)">{{$t('TRANSFR_INFO.RESET')}}</v-button>
        <div class="mlr15">
          <!-- 保存交易草稿 -->
          <v-button
            type
            size="wMin160"
            @click="saveTransfer"
            v-show="activeName === 'onlineEditing'"
          >{{$t('TRANSFR_INFO.SAVE_TRANSFER')}}</v-button>
        </div>
        <!-- 下一步 -->
        <v-button type="primary" size="w160" @click="transConfirm">{{$t('TRANSFR_INFO.NEXT')}}</v-button>
      </el-row>
    </div>

    <!-- 查询区 -->
    <div class="has">
      <!-- 已登记账户 -->
      <el-dialog
        :title="$t('TRANSFR_INFO.HAS_ACCOUNT')"
        :visible.sync="openflag"
        width="75%"
        center
        :show-close="false"
        top="0vh"
      >
        <el-form ref="mySubmitFormRef" :model="mySubmitForm" label-width="auto">
          <el-row style="margin-left: 40px">
            <el-col :span="8">
              <!-- 收款户名: -->
              <el-form-item :label="$t('TRANSFR_INFO.CUT_NAME')" prop="name">
                <!-- 请输入收款户名 -->
                <el-input
                  v-model="mySubmitForm.name"
                  :placeholder="$t('TRANSFR_INFO.IPUT_OAYACCOUNT')"
                  @change="inputname"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :push="2">
              <div class="has_two">
                <!-- 收款银行/机构 -->
                <el-form-item :label="$t('TRANSFR_INFO.BANKNAME')" prop="bank">
                  <el-select
                    v-model="mySubmitForm.bank"
                    :placeholder="$t('TRANSFR_INFO.SELECT')"
                    @change="selectBank1"
                    :filterable="true"
                    :popper-append-to-body="false"
                  >
                    <el-option
                      v-for="(item, index) in payBank"
                      :key="index"
                      :label="item.clearingCode+' ' + item.label "
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="btn">
                <!-- 重置 -->
                <v-button
                  size="w70"
                  @click="resetClick('mySubmitFormRef')"
                  class="mr16"
                >{{$t('TRANSFR_INFO.RESET')}}</v-button>
                <!-- 查询 -->
                <v-button size="w96" type="primary" @click="queryClick">{{$t('TRANSFR_INFO.QUERY')}}</v-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          :data="dialogData"
          ref="multipleTable"
          style="width: 100%;"
          @selection-change="handleSelectonChange"
          :row-key="handGetRowKeys"
        >
          <el-table-column
            width="80"
            :label="$t('BILLPAYMENT.SELECT')"
            prop="selection"
            type="selection"
            :reserve-selection="true"
          ></el-table-column>
          <!-- 登记编号 -->
          <el-table-column prop="registerCode" :label="$t('TRANSFR_INFO.REGISTER_CODE')"></el-table-column>
          <!-- 收款人识别方式 -->
          <el-table-column
            prop="payeeIdentifyMethod"
            :label="$t('TRANSFR_INFO.PAYEEIDENTIFYMETHOD')"
            align="center"
          ></el-table-column>
          <!-- 收款银行/机构 -->
          <el-table-column :label="$t('TRANSFR_INFO.PAYBANK')">
            <template v-slot="{ row }">{{ filterBankInfo(row.bankCode) }}</template>
          </el-table-column>
          <!-- 收款户名 -->
          <el-table-column prop="paymentAccount" :label="$t('TRANSFR_INFO.ACCOUNT_NAME')"></el-table-column>
          <!-- 收款账户 -->
          <el-table-column prop="bankNameType" :label="$t('TRANSFR_INFO.BANKNAMETYPE')"></el-table-column>
        </el-table>
        <div class="bar mt16">
          <div class="u-pagenation">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="prev,pager,next,sizes,jumper"
              :page-sizes="[10,20,30,50]"
              :page-size="10"
              :total="total"
            ></el-pagination>
          </div>
        </div>
        <div class="dialog-btn">
          <!-- 取消 -->
          <v-button size="w160" @click="cancle" class="mr16">{{$t('TRANSFR_INFO.CANCLE')}}</v-button>
          <!-- 确定 -->
          <v-button size="w160" type="primary" @click="comformClick">{{$t('TRANSFR_INFO.COMFIRM')}}</v-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import fileTools from '@/dataTools/tools/fileTools.js';
import mathTools from '@/utils/mathTools.js';
import { safeSetLocalStorage } from '@/utils/index';
import { queryAccBalance } from '@/api/openFixed.js';
import { queryTranIsAuth } from '@/api/authorizeCenter';
import { queryPayAccountBalance } from '@/api/payService.js';
import {
  queryPayAccount,
  acctList,
  getPayeeBankOrOrgList,
  queryThirdPartyAccount,
  upload,
  valid,
  uploadFiles
} from '@/api/cashManage';
import CryptoJS from 'crypto-js';
import filters from '@/filters/business.js';
import pubfilters from '@/filters/public.js';
import excelUtils from '@/utils/transform-excel';
import dataTools from '@/dataTools/tools';
import { transWrite } from '@bank-transfer/mixins';
import {
  findTransactionDraftPageList,
  addTransactionDraft
} from '@/api/paymentRemittance';
import { bankInfos } from '@/mixins';
import {
  mapState
} from 'vuex';
import { authorNumValidator } from '@/utils/validator';
const { readXlsx } = excelUtils();
const { getCurrentTimes } = dataTools;

function ckeckTableDataItem(list = []) {
  let errMsg = '';
  const hasIlegal = list.find((item, index) => {
    if (!item.authorNum.length) {
      let num = index + 1
      errMsg = this.$t('TRANSFR_INFO.PAU_XIANACCOUNT', {num})
      return true;
    }
    return false;
  });
  if (hasIlegal) {
    return errMsg;
  }
  return '';
}

export default {
  mixins: [transWrite, bankInfos],
  inject: ['entType'],
  props: {
    activeName: {
      type: String,
      default: ''
    },
    isJumpIn: {
      type: String,
      default: ''
    },
    oldactiveName: {
      type: String,
      default: ''
    },
    formDataObj: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      //
      formData: this.formDataObj,
      language: 'zh-CN',
      payAcctList: [], //付款账户列表
      cutPayAccttList: [], //手续费扣款账户列表
      creditAcct: '',
      tableData: [], //储存收款人信息数组
      payBank: [],
      showTable: true,
      showTables: false,
      openflag: false,
      mySubmitForm: {
        name: '',
        bank: ''
      },
      dialogData: [], //已登记账户查询数组
      selectData: [], //每一次选中的数据
      size: 10, //弹出层每页条数
      current: 1, //弹出层页数
      total: 0,
      payeeName: '',
      bankCode: '', //银行机构码
      insArr: [], //存手动插入的收款人
      tablesdata: [], //用来存数据
      isShowOverBalances: false, //付款账户是否选择了往来账户
      isShowOverBalance1: false, //收款账户是否选择了往来账户
      uploadUrl: '/api',
      cur: '',
      pickerOptions: {
        // 时间选择器
        disabledDate(time) {
          let curDate = new Date().getTime();
          let thatDate = time.getTime();
          return (
            curDate + 180 * 24 * 3600 * 1000 < thatDate ||
            thatDate < Date.now() - 8.64e6
          );
        }
      },
      rules: {
        payAcctNo: [
          // '请选择付款账户'
          {
            required: true,
            message: this.$t('TRANSFR_INFO.SELECT_PAYACCOUNT'),
            trigger: 'blur'
          }
        ],
        cutPayAcctNo: [
          // '请选择扣款账户'
          {
            required: true,
            message: this.$t('TRANSFR_INFO.SELECT_CUTACCOUNT'),
            trigger: 'blur'
          }
        ],
        authorNum: [
          // '请输入收款账户'
          { required: true, message: this.$t('TRANSFR_INFO.INPUT_CUTACCOUNT') },
          { validator: authorNumValidator, trigger: 'blur' }
        ],
        paymentAccount: [
          // '请输入收款户名'
          {
            required: true,
            message: this.$t('TRANSFR_INFO.INPUT_CUTAOUNTNAME'),
            trigger: 'blur'
          }
        ],
        payBank: [
          // '请选择收款银行/机构'
          {
            required: true,
            message: this.$t('TRANSFR_INFO.SELECT_BANKCODE'),
            trigger: 'blur'
          }
        ],
        // '请输入转账金额'
        payee: [
          {
            required: true,
            message: this.$t('TRANSFR_INFO.INPUT_AMOUNT'),
            trigger: 'blur'
          }
        ],
        tableData: {
          required: true,
          validator: (rule, value, callback) => {
            const errorMessage = ckeckTableDataItem(value);
            !errorMessage.length
              ? callback()
              : callback(new Error(errorMessage));
          }
        }
      },
      rulesDate: {
        // '请选择预约处理日期'
        transOutDate: [
          {
            required: true,
            message: this.$t('TRANSFR_INFO.SELECT_DATE'),
            trigger: 'blur'
          }
        ]
      },
      rules1: {
        totalMoney: [
          {
            required: true,
            // '请输入总金额'
            message: this.$t('TRANSFR_INFO.INPUT_ALLMOUNT'),
            trigger: 'blur'
          }
        ],
        allsum: [
          {
            required: true,
            // '请输入总笔数'
            message: this.$t('TRANSFR_INFO.INPUT_ALLPENS'),
            trigger: 'blur'
          }
        ]
      },

      registerCode: '',
      bankObjec: {},
      formData1: {
        totalMoney: 0,
        allsum: 0
      },
      result: [], //文件上传的数组

      select: false,
      loading3: false,
      loading: false,
      fileName: '', //
      yesauthor: false //判断是否收取
    };
  },
  filters: {
    ...filters,
    ccyFilter:pubfilters.ccyFilter,
    formatBankNo:pubfilters.formatBankNo,
    accountType:pubfilters.accountType,
    formatMoney(val) {
      if (!val || val === '0') {
        return val;
      }
      const moneyVal = String(val).toMoney(),
        [num1, num2] = moneyVal.split('.');
      return `${num1}.${num2.slice(0, 2)}`;
    }
  },
  computed: {
    ...mapState('app', ['lang']),
    currentBankName() {
      switch (this.lang) {
        case 'zh-CN':
          return 'chsName';
        case 'zh-HK':
          return 'chtName';
        default:
          return 'engName';
      }
    },
    formatDate() {
      let date = this.formData.transOutDate;
      if (typeof date !== 'string') {
        if (this.formData.checked) {
          let y = date.getFullYear();
          let m = date.getMonth() + 1;
          m = m < 10 ? '0' + m : m;
          let d = date.getDate();
          d = d < 10 ? '0' + d : d;
          return y + '-' + m + '-' + d;
        }
        return '';
      } else {
        return date;
      }
    },
    allMonth: {
      get: function() {
        let n = 0;
        this.formData.tableData.map((item, index) => {
          n = n + Number(item.payee * 100);
        });
        return (n / 100).toFixed(2);
      },
      set: function(val) {
        return val;
      }
    }
  },
  async created() {
    await this.queryTranIsAuth(); //查询一个交易是否需要授权
    await this.acctListFun(); //批量查询付款账户、扣款账户
    await this.getPayeeBankOrOrgListFun(); //批量查询付款收款接口---查银行列表
    if (JSON.stringify(this.formData) !== '{}') {
      if (this.formData.cutObject) {
        this.formData.cutPayAcctNo = this.formData.cutObject.label;
        this.paySelect(this.formData.payObject.value);
        this.cutSelectPayAcctNo(this.formData.cutObject.value);
      }
    }
    console.log(this.formDataObj,'this.formDatasssssssss')
  },
  watch: {
    'formData.tableData'(val) {
      if (1 <= val.length && val.length < 50) {
        this.showTable = false;
        this.showTables = true;
      } else if (val.length == 50) {
        this.showTable = false;
        this.showTables = false;
      } else if (val.length == 0) {
        this.showTable = true;
        this.showTables = false;
      }
    },
    result(nav) {
      this.formData1.totalMoney = 0;
      let n = 0;
      nav.forEach(item => {
        n = n + Number(item.amount) * 100;
      });
      this.formData1.totalMoney = n / 100;
    },
    'formData.payAcctNo': {
      handler(newVal) {
        console.log('newVal', newVal);
        if (newVal !== '') {
          this.paySelect(newVal);
        }
      }
    },
    formData(n) {
      let curDate = new Date();
      n.checked
        ? this.$set(
            this.formData,
            'transOutDate',
            new Date(curDate.getTime() + 24 * 60 * 60 * 1000)
          )
        : this.$set(this.formData, 'transOutDate', '');
    },
    activeName(val) {
      if (
        this.activeName === 'fileUpload' &&
        this.oldactiveName === 'onlineEditing'
      ) {
        this.$refs['formDataTable'].resetFields();
      } else if (
        this.activeName === 'onlineEditing' &&
        this.oldactiveName === 'fileUpload'
      ) {
        this.$refs.upload.clearFiles();
      }
      this.reset(2);
    }
  },
  methods: {
    //账户号码格式化
    formatAccountNo(val) {
      return mathTools.formatBankNo(val);
    },
     getType(val){
      return pubfilters.ccyFilter(val)
    },
    accountformat(val){
      return pubfilters.formatBankNo(val)
    },
    getAccountType(val){
      return pubfilters.accountType(val)
    },
    // 引入了混入---解决（就不应该引入）
    init() {},
    // --------------------------->初始化开始
    queryTranIsAuth() {
      let param = {
        businessCode: '03010501' //交易码
      };
      queryTranIsAuth(param).then(res => {
        this.yesauthor = res;
      });
    },
    async acctListFun() {
      await acctList().then(res => {
        const data = res;
        let typeLabel = '';
        res &&
          res.forEach((item, index) => {
            this.payAcctList.push({
              value: index,
              label: `${this.accountformat(item.acctNo)} ${this.getType(item.cur)} ${this.getAccountType(item.typeLabel)}`,
              acctName: item.acctName,
              acctNo: item.acctNo,
              cur: item.cur,
              type: item.type,
              typeLabel: item.typeLabel
            });
          });
        if (this.isJumpIn === '1') {
          this.formData.payAcctNo = this.payAcctList[0].value;
        }
      });
    },
    // --------------------------->初始化结束

    // --------------------------->付款人信息开始
    paySelect(index) {
      let acctNo = this.payAcctList[index].acctNo;
      let currencyType = this.payAcctList[index].cur;
      this.creditAcct = this.payAcctList[index].acctNo;
      this.cur = this.payAcctList[index].cur;
      this.cutPayAccttList = this.payAcctList.filter(
        item => item.cur == currencyType
      );
      this.loading = true;
      let params = {
        accountNo: acctNo,
        currencyType: currencyType
      };
      this.queryPayAccountBalance(params, 1);
      console.log('xuanzhe', index, this.formData, this.cutPayAccttList);
      this.formData.company = this.payAcctList[index].acctName;
      this.formData.payString = this.payAcctList[index].label;
      this.formData.payObject = this.payAcctList[index];
      // // 往来账户
      console.log(
        'this.payAcctList[index].typeLabel',
        this.payAcctList[index].typeLabel
      );
      if (this.payAcctList[index].typeLabel == 'CURRENT') {
        this.isShowOverBalances = true;
      } else {
        this.isShowOverBalances = false;
      }
      if (
        this.formData.cutObject &&
        this.formData.cutObject.cur !== currencyType
      ) {
        this.formData.cutcompany = ''; //扣款账户名称
        this.formData.cutPayAcctNoMoney = '';
        this.formData.cutPayAcctNo = '';
        this.isShowOverBalance1 = false;
        this.$refs.formData.clearValidate('cutPayAcctNo');
      }
      this.$refs.formData.clearValidate('payAcctNo');
    },
    cutSelectPayAcctNo(index) {
      let acctNo = this.payAcctList[index].acctNo;
      let currencyType = this.payAcctList[index].cur;
      this.loading = true;
      let params = {
        accountNo: acctNo,
        currencyType: currencyType
      };
      this.queryPayAccountBalance(params, 2);
      this.formData.cutcompany = this.payAcctList[index].acctName;
      this.formData.cutString = this.payAcctList[index].label;
      this.formData.cutObject = this.payAcctList[index];
      if (this.payAcctList[index].typeLabel == 'CURRENT') {
        this.isShowOverBalance1 = true;
      } else {
        this.isShowOverBalance1 = false;
      }
      this.$refs.formData.clearValidate('cutPayAcctNo');
    },
    async queryPayAccountBalance(params, val) {
      const res = await queryPayAccountBalance(params, val);
      if (res && val === 1) {
        this.formData.payAcctNoMoney = res.avaliableBalance;
        this.formData.payAcctNoStatus = res.status; //付款账户状态
        if (res.status !== 'ACTIVE') {
          // '付款账户状态异常'
          this.$message({
            type: 'fail',
            message: this.$t(
              `PAYMENT.DEBIT_ACCT_${this.formData.payAcctNoStatus}`
            ),
            duration: 3000
          });
        }
        this.loading = false;
      } else if (res && val === 2) {
        this.formData.cutPayAcctNoMoney = res.avaliableBalance;
        this.formData.cutPayAcctNoStatus = res.status; //扣款账户状态
        if (res.status !== 'ACTIVE') {
          // '手续费扣款账户状态异常'
          this.$message({
            type: 'fail',
            message: this.$t(
              `PAYMENT.CHARGE_ACCT_${this.formData.cutPayAcctNoStatus}`
            ),
            duration: 3000
          });
        }
        this.loading = false;
      }
    },
    pickerChang(check) {
      if (!check) {
        this.$set(this.formData, 'transOutDate', '');
      } else {
        let curDate = new Date();
        this.$set(
          this.formData,
          'transOutDate',
          new Date(curDate.getTime() + 24 * 60 * 60 * 1000)
        );
      }
    },
    redebitCheckedFun(state) {
      console.log('state', state);
    },
    // 选择预约日期
    changeTime(val) {
      this.$forceUpdate();
    },
    // --------------------------->付款人信息结束
    // --------------------------->收款人信息开始
    uploadFile() {
      this.$emit('activeNames', this.activeName);
    },
    open() {
      this.openflag = true;
      this.selectData = [];
      this.current = 1;
      this.size = 10;
      this.total = 0;
      this.insArr = [];
      console.log('this--------.tableData', this.formData.tableData);
      this.formData.tableData.map(item => {
        if (item.addType === '1') {
          this.insArr.push(item);
        }
      });
      console.log('this.insArr', this.insArr);
      this.queryThirdPartyAccountInit();
    },
    getPayeeBankOrOrgListFun() {
      getPayeeBankOrOrgList().then(res => {
        //过滤重复的收款银行
        const filterArrObj = (arr, filterField) => {
          let newArr = arr.reduce(
            (pre, cur) =>
              pre.some(item => item[filterField] == cur[filterField])
                ? pre
                : [...pre, cur],
            []
          );
          return newArr;
        };
        let arr = filterArrObj(res, 'chtName');
        console.log('this.payBank', this.payBank);
        arr.map((item, index) => {
          this.payBank.push({
            value: index,
            label: item[this.currentBankName],
            chtName: item.chtName,
            clearingCode: item.clearingCode,
            cyy: item.cyy,
            engName: item.engName,
            serId: item.serId,
            typ: item.typ
          });
        });
      });
    },
    selectBank(nal, index) {
      console.log(nal,index)
      this.formData.tableData[index].bankObjec = this.payBank[nal];
    },
    // 弹出层部分-----开始
    //查询
    selectBank1(index) {
      this.bankCode = this.payBank[index].clearingCode;
    },
    inputname(value) {
      this.payeeName = value;
    },
    queryClick() {
      this.queryThirdPartyAccountInit();
    },
    resetClick(value) {
      console.log('点击了重置');
      this.payeeName = '';
      this.bankCode = '';
      this.queryThirdPartyAccountInit();
      this.$refs.multipleTable.clearSelection();
      this.$refs[value].resetFields();
    },
    handleSizeChange(size) {
      this.size = size;
      this.queryThirdPartyAccountInit();
    },
    handleCurrentChange(page) {
      this.current = page;
      this.queryThirdPartyAccountInit();
    },
    handGetRowKeys(row) {
      return row.authorNum;
    },
    handleSelectonChange(nal) {
      if (nal.length > 50) {
        return;
      }
      this.selectData = nal;
      let newt = JSON.parse(JSON.stringify(this.formData.tableData));
      let newt1 = JSON.parse(JSON.stringify(this.formData.tableData));
      let news = JSON.parse(JSON.stringify(this.selectData));
      let news1 = JSON.parse(JSON.stringify(this.selectData));
      let addData = [];
      let addData1 = [];
      if (this.formData.tableData.length > 0 && this.selectData.length < 0) {
        addData = this.jisuandel(newt, news);
        if (this.selectData.length > 0) {
          addData1 = this.jisuanxt(this.selectData, newt1);
          let add3 = addData1.concat(addData);
          this.tablesdata = add3.concat(this.insArr);
        } else {
          this.tablesdata = this.selectData.concat(this.insArr);
        }
      } else {
        this.tablesdata = this.selectData.concat(this.insArr);
      }
    },
    //保留相同方法
    jisuanxt(arr1, arr2) {
      let arr = [];
      for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i].authorNum === arr2[j].authorNum) {
            arr.push(arr2[j]);
          }
        }
        return arr;
      }
    },
    //去重复
    jisuandel(arr1, arr2) {
      for (let i = 0; i < arr1.length; i++) {
        for (let j = 0; j < arr2.length; j++) {
          if (arr1[i].authorNum === arr2[j].authorNum) {
            arr2.splice(j, 1);
            j--;
          }
        }
        return arr2;
      }
    },
    //查询已登记账户
    queryThirdPartyAccountInit() {
      let params = {
        bankCode: this.bankCode,
        current: this.current,
        language: this.language,
        payeeName: this.payeeName,
        registerCode: '',
        size: this.size
      };
      let dialogData = [];
      queryThirdPartyAccount(params).then(res => {
        console.log('queryThirdPartyAccount', res);
        this.dialogData = [];
        res.list.forEach((item, index) => {

          const BANK_INFOS =
            JSON.parse(localStorage.getItem('BANK_INFOS')) || [];
          let lang = localStorage.getItem('lang');
          let payeeBank = item.payeeBank;
          let arr = BANK_INFOS.filter(
            x => x.clearingCode === item.payeeBankCode
          );
          if (arr.length > 0) {
            console.log('arr', arr);
            lang === 'zh-CN'
              ? (payeeBank = arr[0].chsName)
              : lang === 'zh-HK'
              ? (payeeBank = arr[0].chtName)
              : (payeeBank = arr[0].engName);
          }

          dialogData.push({
            // select: 2,
            registerCode: item.registerCode, //登记编号
            payeeIdentifyMethod: this.$t('TRANSFR_INFO.BBAN'), //收款人识别方式
            authorNum: item.payeeAccount, //收款账户
            paymentAccount: item.payeeName, // 收款户名
            bankCode: item.payeeBankCode, // 付款银行/机构编号
            bankName:item.payeeBankCode? payeeBank: '', // 付款银行/机构
            payBank: item.payeeBankCode? (item.payeeBankCode + ' ' + payeeBank):'' , // 付款银行/机构
            payee: '', //付款金额
            tips: '', //附言
            payeeCcy: item.payeeCcy, //币种
            payeeType: item.payeeType, //账户类型
            bankNameType:
              item.payeeAccount +
              ' ' +
              item.payeeCcy +
              ' ' +
              filters.processAccountType(item.payeeType)
          });
        });
        this.dialogData = dialogData;
        this.total = res.total;
        console.log('初始化时候页面的tableData', this.formData.tableData);
        if (this.formData.tableData.length > 0) {
          this.$nextTick(() => {
            this.dialogData.map((item, i) => {
              this.formData.tableData.map((items, k) => {
                if (item.authorNum === items.authorNum) {
                  this.$refs.multipleTable.toggleRowSelection(item, true);
                }
              });
            });
          });
        } else {
          console.log('不走');
        }
      });
    },
    comformClick() {
      this.openflag = false;
      this.formData.tableData = this.tablesdata;
      if (this.formData.tableData.length > 50) {
        // '最近多添加50条'
        this.msgFun('warn', this.$t('TRANSFR_INFO.MORE_NUMBER'));
        this.formData.tableData = this.formData.tableData.slice(
          0,
          this.formData.tableData.length - this.selectData.length
        );
      }
      console.log('最近多添加50条--------1', this.formData.tableData);
      this.$refs.multipleTable.clearSelection();
      this.resetClick('mySubmitFormRef');
    },
    cancle() {
      this.$refs.multipleTable.clearSelection();
      this.openflag = false;
      this.resetClick('mySubmitFormRef');
    },
    // 弹出层部分-----结束
    del(row, index) {
      console.log('删除的行数', row, index);
      this.formData.tableData.splice(index, 1);
      this.$refs.formDataTable.validate();
    },
    addTable() {
      if (this.formData.tableData.length < 50) {
        let obj = {
          authorNum: '', //收款账户
          paymentAccount: '', // 收款户名
          payUser: '', // 付款户名
          payBank: '', // 付款银行/机构
          payee: '', //付款金额
          tips: '', //附言
          addType: '1' //
        };
        this.formData.tableData.push(obj);
        this.showTables = true;
        this.showTable = false;
      } else {
        // '最近多添加50条'
        this.msgFun('warn', this.$t('TRANSFR_INFO.MORE_NUMBER'));
      }
    },
    tipsBlur(row, index) {
      let test = row;
      if (test.indexOf(',') !== -1 && test.indexOf(':') !== -1) {
        this.formData.tableData[index].tips = test.replace(/,/g, ' ');
      }
    },
    // --------------------------->收款人信息结束

    /**
     * excel -> 二進制/base64 -> 掃描
     */
    async handleUploadFile(file) {
      let isLt2k = file.size / 1024 / 1024 < 5;
      if (!isLt2k) {
        // '文件大小不能超过5M'
        this.msgFun('warning', this.$t('TRANSFR_INFO.FILE_BIG'));
        return;
      }
      const acceptList = ['xlsx', 'xls'];
      if (file) {
        const fileName = file.name,
          fileType = fileName.split('.')[fileName.split('.').length - 1];
        this.fileName = fileName;
        if (acceptList.includes(fileType)) {
          const reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.onload = e => {
            const data = e.target.result;
            console.log('data------------->', data);
            const { header, result, messageErr } = readXlsx(data, 'uft-8');
            this.result = result;
            if (messageErr) {
              this.msgFun('error', messageErr);
            }
          };
        } else {
          // '上传文件格式错误'
          this.msgFun('warning', this.$t('TRANSFR_INFO.WARNING_WAY'));
        }
      }
      return false;
    },
    async handleUploadFile2(item) {
      return new Promise(async (resolve, reject) => {
        let formData = new FormData();
        let fileContent = await fileTools.fileToDataURL(item.file);
        let contentMD5 = CryptoJS.MD5(fileContent.split(',')[1]).toString();
        formData.filename = this.fileName;
        formData.md5 = contentMD5;
        formData.scenarioCode = 'BATCH_TRAN';
        formData.fileType = this.fileName.split('.')[
          this.fileName.split('.').length - 1
        ];
        formData.type = 'BATCH_TRANSFER'; // BATCH_PAYOFF
        formData.content = fileContent.split(',')[1];
        this.loading3 = true;
        uploadFiles(formData)
          .then(res => {
            this.formData.fileId = res.refNum;
            this.loading3 = false;
            if (res.refNum) {
              this.formData1.allsum = this.result.length;
              this.allMonth = this.formData1.totalMoney;
            }
            this.authorizationSelectFun();
          })
          .catch(err => {
            console.log(err);
            this.$refs.upload.clearFiles();
            this.fileName = '';
            this.formData.fileId = '';
            this.formData1.allsum = 0;
            this.formData1.totalMoney = 0;
          });
      });
    },

    //删除文件
    deleteFile() {
      this.$confirm({
        title: '',
        isIcon: true,
        type: 'warn',
        // '确定删除文件吗？'
        message: this.$t('TRANSFR_INFO.DELETE_FILE'),
        btnText: {
          cancleText: this.$t('COMMON.CANCEL'),
          confirmText: this.$t('COMMON.CONFIRM')
        },
        isCancle: true
      }).then(() => {
        this.$refs.upload.clearFiles();
        this.result = [];
        this.fileName = '';
        this.formData.fileId = '';
        this.formData1.allsum = 0;
        this.formData1.totalMoney = 0;
      });
    },
    reset(val) {
      if (val === 1) {
        this.formData = {
          payAcctNo: '', //付款账户
          cutcompany: '', //扣款账户名称
          checked: false,
          payAcctNoMoney: '',
          cutPayAcctNoMoney: '',
          company: '',
          transOutDate: '',
          redebitChecked: false,
          total: '',
          totalMoney: '',
          tableData: []
        };
      } else {
        this.formData.total = '';
        this.formData.totalMoney = '';
        this.formData.tableData = [];
      }
      this.isShowOverBalances = false;
      this.isShowOverBalance1 = false;
      this.insArr = [];
      //重置文件
      this.fileName = '';
      this.formData1.totalMoney = 0;
      this.formData1.allsum = 0;
      this.payeeName = '';
      this.bankCode = '';
      this.showTable = true;
      this.showTables = false;
      if (val === 1) {
        if (this.activeName === 'fileUpload') {
          this.$refs.upload.clearFiles();
          this.result = [];
        } else if (this.activeName === 'onlineEditing') {
          this.$refs['formData'].resetFields();
          this.$refs['formDataTable'].resetFields();
        }
      }
      // 授权提醒重置
      this.$refs['authorizationSelect'].reset();
    },
    // 保存交易草稿
    async saveTransfer(params = {}) {
      /**
       * @interface IParams
       * language: 'zh-CN' | 'zh-HK' | 'en'; // 当前语言
       * tdId: number | string; // 当前序号
       * temporaryStorageTime: number // 暂存时间
       * transactionText: string // 暂存内容的json字符串
       * transactionType: '1' | '2' | '3' | '4'; // 交易类型：1-行内转账；2-转数快；3-CHATS；4-电汇
       * uploadMethod: '0'| '1' // 上载方式：0-手工录入；1-文件上载
       */
      const { body } = await addTransactionDraft({
        language: params.language || 'zh-CN',
        tdId: params.tdId || '0',
        temporaryStorageTime: params.temporaryStorageTime || getCurrentTimes(),
        transactionText:
          params.transactionText ||
          JSON.stringify(this.formData).replace('/', () => ''),
        transactionType: '5', //交易类型：1-行内转账；2-转数快；3-CHATS；4-电汇；5-批量转账；6-批量发薪；7-自动转账收款
        uploadMethod: params.uploadMethod || '0'
      });
      if (body) {
        this.msgFun('success', this.$t('PAYMENT.SAVE_DRAFT_SUCCESS'));
      }
    },
    //授权提醒
    authorizationSelectFun() {
      this.$refs['authorizationSelect'].getLevelLimit();
    },
    //去掉两边空格
    trimName(index) {
      this.formData.tableData[index].paymentAccount = this.formData.tableData[
        index
      ].paymentAccount.replace(/^\s+|\s+$/g, '');
    },
    // 底部提交按钮部分
    transConfirm() {
      console.log('this.formData', this.formData);
      let formValidState = false;
      // 付款账户
      this.$refs.formData.validate(valid => {
        valid ? (formValidState = true) : (formValidState = false);
      });
      // 付款账户状态
      if (this.formData.payAcctNoStatus !== 'ACTIVE') {
        this.msgFun('warn', this.$t('TRANSFR_INFO.WARN_PAYACCOUNT'));
        return;
      }
      //扣款账户状态
      if (
        this.formData.cutPayAcctNoStatus !== 'ACTIVE' &&
        this.formData.cutPayAcctNoMoney
      ) {
        this.msgFun('warn', this.$t('TRANSFR_INFO.WARN_CUTACCOUNT'));
        return;
      }
      // 预约处理
      if (this.formData.checked) {
        this.$refs.formDataDate.validate(valid => {
          valid ? (formValidState = true) : (formValidState = false);
        });
      }
      // 在线编辑
      if (this.activeName === 'onlineEditing') {
        console.log('---------->下一步进入');
        if (!formValidState) {
          return;
        }
        this.$refs.formDataTable.validate(valid => {
          valid && this.formData.tableData.length !== 0
            ? (formValidState = true)
            : (formValidState = false);
          if (this.formData.tableData.length === 0) {
            return;
          }
        });
        //判断总金额是否为0
        if (formValidState && this.allMonth == 0) {
          formValidState = false;
          // '转账金额必须大于0!'
          this.msgFun('warn', this.$t('TRANSFR_INFO.MOREZEAR'));
          return;
        }
        //检查0<总金额<可用结余
        if (
          formValidState &&
          this.allMonth > Number(this.formData.payAcctNoMoney)
        ) {
          if (!this.formData.checked) {
            // '可用结余不足，请更换其他付款账户'
            this.msgFun('warn', this.$t('TRANSFR_INFO.CHECK_ACCOUNT'));
            return;
          }
        }
        //检查0<总金额<可用结余，勾选预约
        if (
          formValidState &&
          this.allMonth > Number(this.formData.payAcctNoMoney)
        ) {
          if (this.formData.checked) {
            // '可用结余不足，请在预约处理时间之前补足资金'
            this.msgFun('warn', this.$t('TRANSFR_INFO.ADD_MOUNT'));
          }
        }
        this.formData.allMonth = this.allMonth + '';
      }

      // 上传文件
      if (this.activeName === 'fileUpload') {
        if (!formValidState) {
          return;
        }
        //判断总金额是否为0
        if (formValidState && this.formData1.totalMoney == 0) {
          formValidState = false;
          // '转账金额必须大于0!'
          this.msgFun('warn', this.$t('TRANSFR_INFO.MOREZEAR'));
          return;
        }
        //检查0<总金额<可用结余
        if (
          formValidState &&
          this.formData1.totalMoney > Number(this.formData.payAcctNoMoney)
        ) {
          if (!this.formData.checked) {
            // '可用结余不足，请更换其他付款账户'
            this.msgFun('warn', this.$t('TRANSFR_INFO.CHECK_ACCOUNT'));
            return;
          }
        }
        //检查0<总金额<可用结余，勾选预约
        if (
          formValidState &&
          this.formData1.totalMoney > Number(this.formData.payAcctNoMoney)
        ) {
          if (this.formData.checked) {
            //  '可用结余不足，请在预约处理时间之前补足资金'
            this.msgFun('warn', this.$t('TRANSFR_INFO.ADD_MOUNT'));
          }
        }
        this.formData.allMonth = this.formData1.totalMoney;
        this.formData.tableData = this.result;
      }
      if (formValidState) {
        let bthDetailList = this.validParam();
        let params = {
          bthDetailList: bthDetailList,
          cur: this.formData.cutObject.cur,
          creditAcct: this.creditAcct, // 收/付款账户(批量转
          batchNo: '',
          creditAcctBalance: this.formData.payAcctNoMoney, //账户余额
          creditAcctName: this.formData.payObject.acctName, //收/付款账户名
          creditAcctType: this.formData.payObject.type, //收/付款账户名类别
          custNo: '', //网银客户号
          feeAcct: this.formData.cutObject.acctNo, //手续费扣款账户
          feeAcctBalance: this.formData.cutPayAcctNoMoney, //手续费扣款账户余额
          feeAcctName: this.formData.cutObject.acctName, //手续费扣款账户名
          feeAcctType: this.formData.cutObject.type, //手续费扣款账户类别
          feeCur: this.formData.cutObject.cur, //手续费扣款账户币种
          isRetry: this.formData.redebitChecked ? 'Y' : 'N', //重试扣款(Y:是,N:否)
          isSchedule: this.formData.checked ? 'Y' : 'N', //是否为预约交易(Y:是,N:否)
          scheduleDate: this.formatDate, //预约日期
          tradeAmount: this.formData.allMonth, //交易总金额
          tradeNumber: this.formData.tableData.length, //交易总笔数
          tradeType: '02' //交易类型,01:批量发薪,02:批量转账,03:自动转账收款s
        };
        //批量转账/发薪校验行内账户
        valid(params).then(res => {
          if (res.head.returnCode == '000000') {
            this.$emit('next', this.formData, formValidState);
          }
          console.log('validres', res);
        });
        console.log('valid入参', params);

        console.log('下一步的数据', this.formData, bthDetailList);
      }
    },
    validParam() {
      let _this = this;
      let t = _this.formData.tableData.map((item, index) => {
        if (_this.formData.fileId) {
          let s = (item.debitAcct + '').slice(3, 5);
          console.log('payeeType', s);
          return {
            bankName: item.bankName, //收款银行
            bankCode: item.bankCode, //
            debitAcctName: item.debitAcctName, //s户名
            amount: item.amount, //金额
            //多币种账户且为主账户多币种 80判断为主账户账户需要拼上币种
            debitAcct:
              item.payeeType == 'MULTICURRENCY' && s == '80'
                ? `${item.debitAcct}${_this.formData.cutObject.cur}`
                : item.debitAcct, //收款账户
            additionalComment: item.additionalComment //附言
          };
        } else {
          if (item.bankObjec) {
            let s = item.authorNum.slice(3, 5);
            console.log('payeeType', s);
            return {
              bankName: item.bankObjec.label,
              bankCode: item.bankObjec.clearingCode,
              debitAcctName: item.paymentAccount,
              amount: item.payee,
              debitAcct:
                item.payeeType == 'MULTICURRENCY' && s == '80'
                  ? `${item.authorNum}${_this.formData.cutObject.cur}`
                  : item.authorNum,
              additionalComment: item.tips //附言
            };
          } else {
            let s = item.authorNum.slice(3, 5);
            console.log('payeeType', s);
            return {
              bankName: item.bankName,
              bankCode: item.bankCode,
              debitAcctName: item.paymentAccount,
              amount: item.payee,
              debitAcct:
                item.payeeType == 'MULTICURRENCY' && s == '80'
                  ? `${item.authorNum}${_this.formData.cutObject.cur}`
                  : item.authorNum,
              tips: item.tips,
              additionalComment: item.tips //附言
            };
          }
        }
      });
      return t;
    },
    //
    upSuccess(response, file, fileList) {
      this.$refs.upload.clearFiles();
      console.log('response', response);
      if (response.status == 200) {
        this.msgFun('success', response.message);
      } else {
        this.msgFun('error', response.message);
      }
    },
    authorBlur(value) {},
    getAuthInfo(val) {
      this.formData.authInfo = val;
    },
    msgFun(type, msg) {
      this.$message({
        type: type,
        message: msg
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.g-payeeInform {
  // width: 1140px;
  margin: 20px auto 2px;
  ::v-deep .el-input__inner {
    width: 320px;
  }
  ::v-deep .el-input--suffix {
    width: 320px;
  }
  ::v-deep .el-form-item__error {
    left: 172px;
  }
  .gray3 {
    position: absolute;
    left: 500px;
    top: 10px;
  }
  .gray2 {
    left: 390px;
    top: 230px;
  }
  .formBox {
    width: 650px;
    margin: auto;
  }
  .checkboxStyle {
    /deep/ .el-form-item__content {
      margin-left: 160px !important;
    }
    /deep/ .el-checkbox__label {
      // display: -moz-inline-grid;
      display: inline-grid;
      white-space: pre-line;
      // color: #000;
      // margin-left: 160px;
    }
  }

  .u-company {
    margin: 4px 0 0 172px;
  }
  /deep/ .el-checkbox .el-checkbox__input.is-checked {
    color: #000;
  }
  .el-checkbox {
    padding-left: 15px;
  }
  .m-tips {
    margin-top: 40px;
    text-align: right;
    display: flex;
    justify-content: space-between;
  }
  .m-tips-up {
    margin-top: 20px;
    .m-form {
      margin-left: 200px;
      .lodeFile {
        display: flex;
        .upload {
          width: 130px;
        }
        .template {
          padding-top: 10px;
        }
      }
    }
    .f14 {
      text-align: left;
      margin-top: 18px;
      color: rgba(0, 0, 0, 0.45);
    }
    .word {
      width: 220px;
      height: 36px;
      border: 1px solid rgba(217, 217, 217, 1);
      text-align: center;
      line-height: 36px;
      border-radius: 4px;
      margin-left: 160px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      cursor: pointer;
      span {
        //  padding: 0 10px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .sel-account {
      font-size: 14px;
      line-height: 22px;
      font-weight: 400;
      .file-download {
        color: #4181fa;
        padding-top: 30px;
        cursor: pointer;
        margin-top: 20px;
      }
      .g-upload-btn {
        width: 120px;
        height: 36px;
      }
      .up-file-tips {
        margin-left: 160px;
        margin-top: -27px;
      }
    }
    .up-btn {
      width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 14px;
      }
      span {
        color: rgba(0, 0, 0, 0.85);
        font-size: 16px;
        margin-left: 6px;
      }
      &:hover {
        background-image: linear-gradient(90deg, #ffc32b 0%, #fc8f28 100%);
        border: none;
        span {
          color: #fff !important;
        }
      }
    }
  }
  .u-tips {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    line-height: 22px;
    font-weight: 400;
    padding-right: 30px;
    span {
      color: #f06b00;
    }
    span:hover {
      cursor: pointer;
    }
  }
  .u-account {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    font-weight: 500;
  }
  .sel-data {
    ::v-deep .el-input__inner {
      width: 320px;
    }
  }
  .m-table {
    margin-top: 12px;
    ::v-deep .el-input__inner {
      width: 180px;
      height: 28px;
    }
    ::v-deep .el-form-item__error {
      left: 12px;
    }
    .u-sel {
      ::v-deep .el-input {
        width: 180px;
        height: 28px;
      }
      .i.el-select__caret {
        margin-top: 10px;
        margin-right: -5px;
      }
    }
  }
  .u-btn {
    margin-left: 38%;
    margin-top: 36px;
  }
  .u-adduser {
    margin-top: 6px;
    width: 100%;
    border: 1px dashed #f06b00;
    color: #f06b00;
  }
}

::v-deep .el-table th.el-table__cell > .cell {
  padding: 0 24px !important;
}

::v-deep .el-table .el-table__cell {
  padding: 0 !important;
}
::v-deep .el-table td.el-table__cell div {
  padding: 1px 10px !important;
}
::v-deep .el-form-item__content {
  margin-left: 0px !important;
}
::v-deep .el-table td.el-table__cell div {
  padding: 2px 1px !important;
}
::v-deep .has .el-form-item__content {
  line-height: 40px;
  position: relative;
  font-size: 14px;
  display: flex;
}
::v-deep .el-popper {
  position: absolute !important;
  top: 0;
  left: 0;
}
.btn {
  display: flex;
}
.dialog-btn {
  display: flex;
  margin: 20px 0px;
  justify-content: center;
  // justify-content: center;
}
.has {
  .has_two {
    margin-left: 12px;
  }
  .btn {
    margin-left: 150px;
  }
}
::v-deep .el-dialog {
  height: 84vh;
  margin-top: 5vh !important;
  overflow: auto;
}
::v-deep .el-dialog__body {
  height: 76vh !important;
}
::v-deep .has .el-table .el-table-column--selection .cell {
  margin-left: 15px;
  width: 80px;
  padding: 0px;
}

::v-deep .el-pagination__editor.el-input {
  width: 50px;
}
::v-deep .bar .el-checkbox_inner {
  width: 14px;
  height: 14px;
  border-radius: 14px;
}
::v-deep .select-popper {
  position: relative;
  z-index: 10000;
}
.tag {
  margin-left: 160px;
  margin-top: 10px;
}
</style>
