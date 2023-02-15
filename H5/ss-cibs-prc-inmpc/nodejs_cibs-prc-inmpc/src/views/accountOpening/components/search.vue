<!-- 查询 -->
<template>
  <div>
    <!-- 查询表单 -->
    <el-form class="transverse-form" :model="formData" :rules="rules" label-width="auto" ref="ruleForm">
      <el-form-item :label="$t('RAO_CHECK.REF_NO_SYMBOL')" prop="referenceNum">
        <el-input
          class="g-w-270"
          v-model.trim="formData.referenceNum"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.TIEM_TYPE_SYMBOL')" prop="idType" v-if="checkType === '2'">
        <el-select
          class="g-w-270"
          v-model="formData.queryByDateType"
          :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
          ">
          <el-option
            v-for="(item, key) in timeTypeList"
            :key="key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="dateLabel" prop="applictionData">
        <el-date-picker
          class="g-w-270"
          v-model="formData.applictionData"
          type="daterange"
          align="right"
          unlink-panels
          :clearable="false"
          :range-separator="$t('COMMON.DATESPAN_TO')"
          :start-placeholder="$t('COMMON.START_DATE')"
          :end-placeholder="$t('COMMON.END_DATE')"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="selectDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.ENG_SEX_SYMBOL')" prop="engLastName">
        <el-input
          class="g-w-270"
          v-model="formData.engLastName"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.ENG_NAME_SYMBOL')" prop="engFirstName">
        <el-input
          class="g-w-270"
          v-model="formData.engFirstName"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
          maxlength="20"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.CARD_TYPE_SYMBOL')" prop="idType">
        <el-select
          class="g-w-270"
          v-model="formData.idType"
          clearable
          multiple
          :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
          ">
          <el-option
            v-for="(item, key) in cardTypeList"
            :key="key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 归档状态 -->
      <el-form-item :label="$t('RAO_CHECK.PGEONHOLE_STATUS')" prop="dmsStatus">
        <el-select
          class="g-w-270"
          v-model="formData.dmsStatus"
          clearable
          multiple
          :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
          ">
          <el-option
            v-for="(item, key) in dmsStatusList"
            :key="key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.CARD_NO_SYMBOL')" prop="idNum">
        <el-input
          class="g-w-270"
          v-model="formData.idNum"
          maxlength="18"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.CONTACT_NUMBER_SYMBOL')" prop="mobileNum">
        <el-input
          class="g-w-270"
          v-model.trim="formData.mobileNum"
          maxlength="11"
          :placeholder="$t('COMMON.PLEASE_INPUT')"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('RAO_CHECK.STATUS_SYMBOL')" prop="status">
        <el-select
          class="g-w-270"
          v-model="formData.status"
          multiple
          clearable
          :placeholder="$t('RAO_CHECK.PLEASE_SELECT')
          ">
          <el-option
            v-for="(item, key) in statusList"
            :key="key"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=" " style="margin-left: -30px">
        <div style="width:302px;">
          <div style="float:right;">
            <el-button class="reset" @click="handleReset('ruleForm')">{{ $t('COMMON.RESET') }}</el-button>
            <el-button class="export" v-if="exportBoolean" @click="exportExcel">{{ $t('RAO_CHECK.EXPORT') }}</el-button>
            <el-button class="query" type="primary" @click="search('ruleForm')">{{ $t('COMMON.SEARCH') }}</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <!-- 数据列表 -->
    <el-table
      class="g-table"
      stripe
      :data="tableData"
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column width="60" type="index" :label="$t(`COMMON.SERIAL_NUMBER`)"></el-table-column>
      <el-table-column prop="referenceNumber" :label="$t('RAO_CHECK.REF_NO')" width="170">
        <template slot-scope="scope">
          <div class="f-btnColor" @click="clickDetail(scope.row)">{{ scope.row.referenceNumber }}</div>
        </template>
      </el-table-column>
      <template v-if="checkType === '1' || checkType === '2'">
        <el-table-column prop="creationTime" :label="$t('RAO_CHECK.CREATE_DATE')" width="130"></el-table-column>
        <el-table-column prop="submitTime" :label="$t('RAO_CHECK.APPLICATION_DATA')" width="130"></el-table-column>
      </template>
      <template v-else>
        <el-table-column prop="creationTime" :label="$t('RAO_CHECK.APPLICATION_DATA')" width="130"></el-table-column>
      </template>
      <el-table-column prop="cif" :label="$t('RAO_CHECK.CIF')" width="90"></el-table-column>
      <el-table-column prop="engLastName" :label="$t('RAO_CHECK.ENG_SEX')" width="120"></el-table-column>
      <el-table-column prop="engFirstName" :label="$t('RAO_CHECK.ENG_NAME')" width="130"></el-table-column>
      <el-table-column prop="chineseName" :label="$t('RAO_CHECK.CHS_NAME')" width="110"></el-table-column>
      <el-table-column prop="idType" :label="$t('RAO_CHECK.CARD_TYPE')" width="145">
        <template slot-scope="scope">
          <div>{{ cardTypeObj[scope.row.idType] }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="idNumber" :label="$t('RAO_CHECK.CARD_NO')" width="140"></el-table-column>
      <el-table-column prop="mobileNumber" :label="$t('RAO_CHECK.CONTACT_NUMBER')" width="150">
        <template slot-scope="scope">
          <div>{{ scope.row.mobileCountryCode }}-{{ scope.row.mobileNumber }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="email" :label="$t('RAO_CHECK.MAIL')" width="130"></el-table-column>
      <!-- 归档状态 -->
      <el-table-column prop="dmsStatus" :label="$t('RAO_CHECK.PGEONHOLE_STATUS')" width="130">
        <template slot-scope="scope">
          <div>{{ scope.row.dmsStatus }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('RAO_CHECK.STATUS')" width="180" v-if="checkType === '1' || checkType === '3'">
        <template slot-scope="scope">
          <div>{{ scope.row.status }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="status" fixed="right" :label="$t('RAO_CHECK.STATUS')" width="180" v-if="checkType === '2' || checkType === '4'">
        <template slot-scope="scope">
          <p class="flex-box">
            <span class="light-box" :class="getOverTime(scope.row)"></span>
            <span>{{ scope.row.status }}</span>
          </p>
        </template>
      </el-table-column>
      <!-- :width="checkShow(scope) || recheckShow(scope) || confirmShowMaker(scope) || confirmShowChecker(scope) || confirmShowAmender(scope) ?  '110' : '0'" -->
      <el-table-column :label="$t(`COMMON.OPERATION`)" width="110" fixed="right" v-if="(checkType === '1' || checkType === '3') && showOperate">
        <template slot-scope="scope">
          <div class="f-span-btns">
            <p class="flex-box">
              <span class="light-box" :class="getOverTime(scope.row)"></span>
              <span @click="check(scope.row, scope.$index)" v-if="checkShow(scope)">{{ $t('RAO_CHECK.CHECK') }}</span>
              <span @click="recheck(scope.row, scope.$index)" v-if="recheckShow(scope)">{{ checkType === '1' ? $t('RAO_CHECK.RECHECK') : $t('RAO_CHECK.PCSD_RECHECK') }}</span>
              <span @click="confirmAcc(scope.row, scope.$index, 'MCIS Maker')" v-if="confirmShowMaker(scope)">{{ 'MCIS maker Confirm' }}</span>
              <span @click="confirmAcc(scope.row, scope.$index, 'MCIS Checker')" v-if="confirmShowChecker(scope)">{{ 'MCIS checker Confirm' }}</span>
              <span @click="confirmAcc(scope.row, scope.$index, 'Amender')" v-if="confirmShowAmender(scope)">{{ 'amender Confirm' }}</span>
            </p>
          </div>
        </template>
      </el-table-column>
      <div slot="empty" class="g-empty">
        <img src="@/img/table-empty.png" alt />
        <span>{{$t('RAO_CHECK.QUERY_NO_RECORDS')}}</span>
      </div>
    </el-table>
    <div class="g-bolck">
      <el-pagination
        :background="true"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 30, 40, 50]"
        layout="sizes,total,prev,pager,next,jumper"
        @size-change="handleSizeChange($event)"
        @current-change="handleCurrentChange($event)"
      />
    </div>
  </div>
</template>

<script>
import dateTools from '@/utils/dateTools';
import {
  downloadFile
} from '@/utils/tools';
import {
  queryAccountOpenList,
  downloadReport
} from '@/api/accountOpening/accountOpeningCheck'
import {
  queryEiaoList,
  eiaoDownloadReport
} from '@/api/accountOpening/investmentAccountOpeningCheck'
import {
  getRoleDetail
} from '@/utils/user';
import CONSTANTS from '@/utils/constant';
const {
  CARD_TYPE_LIST,
} = CONSTANTS;

export default {
  name: 'Search',
  components: {
  },
  props: {
    exportBoolean: {
      type: Boolean,
      default: false
    },
    checkType: {
      type: String,
      default: ''
    }, // 审核类型 1 普通開戶审核 2 普通開戶查詢 3 eiao審核 4 eiao查詢
  },
  data() {
    var validateNumber = (rule, value, callback) => {
      if (value) {
        if (/^\d/g.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t('RAO_CHECK.DATA_NO_SURE')));
        }
      } else {
        callback();
      }
    }
    var validateEng = (rule, value, callback) => {
      if (value) {
        if (/[^a-zA-Z ]/g.test(value)) {
          callback(new Error(this.$t('RAO_CHECK.DATA_NO_SURE')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    var validateIdNum = (rule, value, callback) => {
      if (value) {
        if (/[^\da-zA-Z]/g.test(value)) {
          callback(new Error(this.$t('RAO_CHECK.DATA_NO_SURE')));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    const endTime = dateTools.formatDate(new Date()),
      startTime = dateTools.getDateStr(endTime, -30);
    return {
      formData: {
        referenceNum: '', // 参考编号
        queryByDateType: 'creation', // 时间类型
        applictionData: [startTime, endTime], // 申请日期
        createTimeFrom: '', // 日期 开始
        createTimeTo: '', // 日期 结束
        engLastName: '', // 英文姓氏
        engFirstName: '', // 英文名字
        idType: [], // 证件类型
        idNum: '', // 证件号码
        mobileNum: '', // 联系电话
        status: [], // 状态
        orderByRule: '', // 排序
      },
      cardTypeList: CARD_TYPE_LIST, // 证件类型列表
      dmsStatusList: [
        {
          label: 'Submitted',
          value: 'Submitted'
        },
        {
          label: 'Reopen',
          value: 'Reopen'
        },
        {
          label: 'Success',
          value: 'Success'
        },
        {
          label: 'Not archived',
          value: 'Not archived'
        },
        {
          label: 'Not need archived',
          value: 'Not need archived'
        },
        {
          label: 'Manual',
          value: 'Manual'
        },
        {
          label: 'System failure',
          value: 'System failure'
        },
      ],
      timeTypeList: [
        {
          label: this.$t('RAO_CHECK.APPLICATION_DATA'),
          value: 'submission'
        },
        {
          label: this.$t('RAO_CHECK.CREATE_DATE'),
          value: 'creation'
        },
      ], // 时间类型
      cardTypeObj: {}, // 证件类型键值对
      statusList: [], // 审核状态列表
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 90 * 24 * 3600 * 1000;
          let threeMonth = curDate - three;
          return (
            time.getTime() > Date.now() - 8.64e6 || time.getTime() < threeMonth
          );
        }
      },
      rules: {
        referenceNum: [
          { validator: validateNumber, trigger: 'blur' }
        ],
        engFirstName: [
          { validator: validateEng, trigger: 'blur' }
        ],
        engLastName: [
          { validator: validateEng, trigger: 'blur' }
        ],
        idNum: [
          { validator: validateIdNum, trigger: 'blur' }
        ],
        mobileNum: [
          { validator: validateNumber, trigger: 'blur' }
        ],
      },
      tableData: [], // table数据
      currentPage: 1,
      pageSize: 10,
      total: 1,
    };
  },
  computed: {
    // 日期 label
    dateLabel() {
      return this.checkType === '2' ? this.$t('RAO_CHECK.DATE') : this.$t('RAO_CHECK.APPLICATION_DATA_SYMBOL')
    },
    // 是否显示操作
    showOperate() {
      let listItem = this.tableData.find(item =>{
        let scope = {row:item}
        return this.checkShow(scope) || this.recheckShow(scope) || this.confirmShowMaker(scope) || this.confirmShowChecker(scope) || this.confirmShowAmender(scope)
      })

      return Boolean(listItem)
    }
  },

  created() {
    CARD_TYPE_LIST.forEach(item => {
      this.cardTypeObj[item.value] = item.label
    })
    this.roleName = getRoleDetail().roleName
    // status默认值 statusList 状态列表
    // Draft-草稿
    // Submitted-提交
    // Name check-Name check处理中
    // Manual handle-人工处理
    // In progress-处理中
    // Pending for info maker-
    // Pending for info checker-
    // Approved-审核成功
    // Rejected-审核拒绝
    // Partly completed-部分成功
    // Confirm completed-确认成功
    // Completed-完成
    // System Failure-失败
    switch (this.checkType) {
      case '1':
        if(this.roleName === '分行 Maker') {
          this.statusList = [
            {
              label: 'Pending for info maker',
              value: 'Pending for info maker'
            }
          ]
        }
        if(this.roleName === '中台 Maker') {
          this.statusList = [
            {
              label: 'Pending for info maker',
              value: 'Pending for info maker'
            }
          ]
        }
        if(this.roleName === '分行 Checker') {
          this.statusList = [
            {
              label: 'Pending for info checker',
              value: 'Pending for info checker'
            }
          ]
        }
        if(this.roleName === '中台 Checker') {
          this.statusList = [
            {
              label: 'Pending for info checker',
              value: 'Pending for info checker'
            }
          ]
        }
        if (this.roleName === 'MCIS Maker') {
          this.statusList = [
            {
              label: 'Pending for MCIS maker',
              value: 'Pending for MCIS maker'
            },
            {
              label: 'Partly completed',
              value: 'Partly completed'
            },
            {
              label: 'Confirm completed',
              value: 'Confirm completed'
            },
          ]
        }
        if (this.roleName === 'MCIS Checker') {
          this.statusList = [
            {
              label: 'Pending for MCIS checker',
              value: 'Pending for MCIS checker'
            }
          ]
        }
        if (this.roleName === 'Amender') {
          this.statusList = [
            {
              label: 'Pending for amender',
              value: 'Pending for amender'
            }
          ]
        }
        if (this.roleName !== 'MCIS Maker' && this.statusList[0] && this.statusList[0].value) {
          this.formData.status = [this.statusList[0].value]
        }
        // if (['分行 Checker', '中台 Checker'].includes(getRoleDetail().roleName)) {
        //   this.formData.status = ['Pending for info checker']
        // }
        // if (['分行 Maker', '中台 Maker'].includes(getRoleDetail().roleName)) {
        //   this.formData.status = ['Pending for info maker']
        // }
        break;
      case '2':
        this.statusList = [
          {
            label: 'Draft',
            value: 'Draft'
          },
          {
            label: 'Submitted',
            value: 'Submitted'
          },
          {
            label: 'Name check',
            value: 'Name check'
          },
          {
            label: 'In progress',
            value: 'In progress'
          },
          {
            label: 'Pending for info maker',
            value: 'Pending for info maker'
          },
          {
            label: 'Pending for info checker',
            value: 'Pending for info checker'
          },
          {
            label: 'Partly completed',
            value: 'Partly completed'
          },
          {
            label: 'Confirm completed',
            value: 'Confirm completed'
          },
          {
            label: 'Pending for MCIS maker',
            value: 'Pending for MCIS maker'
          },
          {
            label: 'Pending for MCIS checker',
            value: 'Pending for MCIS checker'
          },
          {
            label: 'Pending for amender',
            value: 'Pending for amender'
          },
          {
            label: 'Approved',
            value: 'Approved'
          },
          {
            label: 'Rejected',
            value: 'Rejected'
          },
          {
            label: 'Manual handle',
            value: 'Manual handle'
          },
          {
            label: 'System failure',
            value: 'System failure'
          },
          {
            label: 'Completed',
            value: 'Completed'
          },
        ]
        // this.formData.status = ['Pending for info checker']
        break;
      case '3':
        this.statusList = [
          {
            label: 'Pending for PCSD',
            value: 'Pending for PCSD'
          }
        ]
        this.formData.status = ['Pending for PCSD']
        break;
      case '4':
        this.statusList = [
          {
            label: 'Submitted',
            value: 'Submitted'
          },
          {
            label: 'Pending for PCSD',
            value: 'Pending for PCSD'
          },
          {
            label: 'Completed',
            value: 'Completed'
          },
          {
            label: 'System failure',
            value: 'System failure'
          },
        ]
        break;
      default:
        break;
    }
    this.queryTableData();
  },
  activated() {
    this.queryTableData();
  },

  mounted() {
  },

  methods: {
    //  获取审核超时状态
    getOverTime(scope) {
      if (['Draft', 'Completed', 'Submitted'].includes(scope.status)) {
        return {}
      }
      // 3, 5, 7

      let getWordDay = (first, last) =>{
        first = first.getTime()
        last = last.getTime()
        let count = 0
        for (let i = first; i < last; i+= 1000 * 60 * 60 * 24){
          const d = new Date(i)
          if (d.getDay() >=1 && d.getDay()<=5) {
            count++
          }
        }
        return count
      }

      let day = getWordDay(new Date(scope.submitTime), new Date())

      if (scope.invReadyTime) {
        day = getWordDay(new Date(scope.invReadyTime), new Date())
      }

      return {
        bgSafe: day <=3,
        bgWarn: day >3,
        // bgWarn: day >3 && day <=5,
        // bgError: day >5
      }
    },
    // 查詢
    search() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.currentPage = 1
          this.queryTableData()
        } else {
          return false
        }
      });
    },
    // 查询列表数据
    async queryTableData() {
      let params = {
        ...this.formData,
        current: this.currentPage,
        size: this.pageSize,
        orderByField: '', // 排序字段
        isQueryAll: ['2', '4'].includes(this.checkType) ? 'Y' : '' // 是否需要查询全部信息 Y 需要 不传为不需要
      };
      let list = []
      if (params.status.length === 0) {
        this.statusList.map(item => {
          list.push(item.value)
        })
        params.status = JSON.parse(JSON.stringify(list))
      }
      params.createTimeFrom = params.applictionData[0] || '';
      params.createTimeTo = params.applictionData[1] || '';
      delete params.applictionData;
      // queryByDateType参数处理
      if (this.checkType === '1') {
        params.queryByDateType = 'submission';
      } else if (['3', '4'].includes(this.checkType)) {
        delete params.queryByDateType;
      } else {
      }
      let result = ['1', '2'].includes(this.checkType) 
                    ? await queryAccountOpenList(params)
                    : await queryEiaoList(params)
      if (result.head.returnCode !== '000000') {
        this.$showMsg({
          message: result.head.returnMessage,
          type: 'error'
        });
      } else {
        this.tableData = result.body.applicationsVOList || [];
        this.total = result.body.total;
      }
    },
    // 重置
    handleReset(formName) {
      this.$refs[formName].resetFields();
      // this.search();
    },
    // 详情
    clickDetail(row) {
      this.$emit('clickDetail', row);
    },
    // 审核
    check(row) {
      this.$emit('check', row);
    },
    // 复核
    recheck(row) {
      this.$emit('recheck', row);
    },
    // 确认
    confirmAcc(row, index, role) {
      this.$emit('confirmAcc', row, role);
    },
    // 导出excel
    async exportExcel() {
      let params = {
        ...this.formData,
        current: this.currentPage,
        size: this.pageSize,
        orderByField: '', // 排序字段
        isQueryAll: ['2', '4'].includes(this.checkType) ? 'Y' : '' // 是否需要查询全部信息 Y 需要 不传为不需要
      };
      params.createTimeFrom = params.applictionData[0] || '';
      params.createTimeTo = params.applictionData[1] || '';
      delete params.applictionData;
      if (this.checkType === '4') {
        delete params.queryByDateType;
      }
      let result = this.checkType === '2'
                     ? await downloadReport(params)
                     : await eiaoDownloadReport(params)
      if (result.type !== 'application/octet-stream') {
        this.$showMsg({
          message: this.$t('RAO_CHECK.EXPORT_ERROR'),
          type: 'error'
        });
      } else {
        downloadFile(
          result,
          this.checkType === '2' ? `${this.$t('RAO_CHECK.ACCT_TABLE')}.csv` : `${this.$t('RAO_CHECK.EIAO_ACCT_TABLE')}.csv`,
          'text/csv'
        );
      }
    },
    // 审核操作显示
    checkShow(scope) {
      return this.checkType === '1' 
        ? scope.row.status === 'Pending for info maker' && ['中台 Maker', '分行 Maker'].includes(this.roleName)
        : scope.row.status === 'Pending for PCSD' && this.roleName === 'PCSD'
    },
    // 复核操作显示
    recheckShow(scope) {
      return this.checkType === '1' 
        ? scope.row.status === 'Pending for info checker' && ['中台 Checker', '分行 Checker'].includes(this.roleName)
        : scope.row.status === 'Approved' && this.roleName === 'PCSD'
    },
    // 确认信息操作显示
    confirmShow(scope) {
      return this.checkType === '1' && ['Partly completed', 'Confirm completed'].includes(scope.row.status) && ['中台 Maker', '中台 Checker'].includes(this.roleName)
    },
    // 确认MCIS Maker
    confirmShowMaker(scope) {
      return this.checkType === '1' && ['Partly completed', 'Confirm completed','Pending for MCIS maker'].includes(scope.row.status) && ['MCIS Maker'].includes(this.roleName)
    },
    // 确认MCIS Checker
    confirmShowChecker(scope) {
      return this.checkType === '1' && ['Pending for MCIS checker'].includes(scope.row.status) && ['MCIS Checker'].includes(this.roleName)
    },
    // 确认 补充资料Amender
    confirmShowAmender(scope) {
      return this.checkType === '1' && ['Pending for amender'].includes(scope.row.status) && ['Amender'].includes(this.roleName)
    },

    //选择时间
    selectDate([startTime, endTime]) {
      console.log('applictionData', this.formData)
      //判断时间段是否超过90天
      const { getGapDay } = dateTools;
      let days = getGapDay(startTime, endTime);
      if (days > 90) {
        this.resetTimespan(startTime);
        this.$showBox({
          content: this.$t('COMMON.QUERY_INTERVAL')
        });
      }
    },
    //时间段超过90天，以开始时间为准，结束时间为开始时间之后90天
    resetTimespan(startTime) {
      const { getDateStr } = dateTools;
      const endTime = getDateStr(startTime, 90);
      this.$set(this.formData, 'applictionData', [startTime, endTime]);
    },
    // pageSize 改变是触发
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.queryTableData();
    },
    // currentPage 改变是触发
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryTableData();
    },
  }
};
</script>

<style lang="scss" scoped>
.transverse-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 20px;
    ::v-deep .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: relative;
    left: -20%;
  }
}
.g-bolck {
  text-align: right;
  padding: 24px;
}
.g-w-270 {
  width: 270px;
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
}
.export {
  margin-left: 16px;
  border-color: #f06b00;
  color: #f06b00;
}
.f-span-btns {
  width: 100%;
  color: #e34141;
  display: flex;
  align-items: center;
  span {
    display: inline-block;
    cursor: pointer;
  }
  span:nth-of-type(1) {
    color: #f06b00;
    // margin-left: 10px;
  }
}
.light-box {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 8px;
  flex-shrink: 0;
  background: transparent;
  &.bgSafe {
    background: #0CC71A;
  }
  &.bgWarn {
    background: #FEAF03;
  }
  &.bgError {
    background: #F23F47;
  }
}
.flex-box {
  display: flex;
  align-items: center;
}
</style>
