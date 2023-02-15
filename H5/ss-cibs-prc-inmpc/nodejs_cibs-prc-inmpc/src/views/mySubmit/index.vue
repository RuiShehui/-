<!-- 我提交的 -->

<template>
  <div class="contain">
    <el-form class="transverse-form" label-width="auto" ref="formRef">
      <el-form-item :label="$t('AUTHORIZATION_CENTER.BUSINESS_TYPE_SYMBOL')
        ">
        <el-select
          class="g-w-270"
          v-model="bizType"
          clearable
          :placeholder="$t('AUTHORIZATION_CENTER.PLEASE_SELECT')
          "
        >
          <el-option
            v-for="item in bizCodeList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('AUTHORIZATION_CENTER.AUTHORIZATION_STATUS_SYMBOL')
        ">
        <el-select
          class="g-w-270"
          v-model="authStatus"
          clearable
          :placeholder="$t('AUTHORIZATION_CENTER.PLEASE_SELECT')"
        >
          <el-option
            v-for="item in bizStatusList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('AUTHORIZATION_CENTER.SUBMISSION_DATE_SYMBOL')">
        <el-date-picker
          class="g-w-270"
          v-model="submitTime"
          type="daterange"
          align="right"
          unlink-panels
          :range-separator="$t('AUTHORIZATION_CENTER.TO')"
          :start-placeholder="
            $t('AUTHORIZATION_CENTER.START_DATE')
          "
          :end-placeholder="
            $t('AUTHORIZATION_CENTER.END_DATE')
          "
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          @change="selectDate"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label=" ">
        <div style="width:270px;">
          <div style="float:right">
            <el-button class="query" type="primary" @click="search">{{ $t('COMMON.SEARCH') }}</el-button>
            <el-button class="reset" @click="handleReset">{{ $t('COMMON.RESET') }}</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <el-table
      class="g-table"
      :data="tableData"
      stripe
      :header-cell-style="{
        background: '#f3f3f3',
        color: '#000',
        fontSize: '14px'
      }"
    >
      <el-table-column type="index" :label="$t('COMMON.SERIAL_NUMBER')" width="80"></el-table-column>
      <el-table-column prop="flowNum" :label="$t('AUTHORIZATION_CENTER.SERIAL_NUMBER')" width="290">
        <template slot-scope="scope">
          <div class="f-btnColor" @click="handleCell(scope.row)">{{ scope.row.flowNum }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="bizType" :label="$t('AUTHORIZATION_CENTER.BUSINESS_TYPE')" width="240"></el-table-column>
      <el-table-column
        prop="operType"
        :label="$t('AUTHORIZATION_CENTER.OPERATIOM_TYPE')"
        min-width="130"
      ></el-table-column>
      <el-table-column
        prop="submitTime"
        :label="$t('AUTHORIZATION_CENTER.SUBMITITME')"
        min-width="180"
      ></el-table-column>
      <el-table-column prop="authStatus" :label="$t('AUTHORIZATION_CENTER.STATUS')" width="120">
        <template v-slot="{ row }">
          <!-- {{ row.authStatus }} -->
          {{
          bizStatusList.find(item => item.value === row.authStatus) ? bizStatusList.find(item => item.value === row.authStatus).label : ''
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('COMMON.OPERATION')" width="140">
        <template slot-scope="scope">
          <div class="f-span-btns">
            <span
              v-if="scope.row.authStatus === 'WAIT_AUTH'"
              @click="revoke(scope.row)"
            >{{ $t('AUTHORIZATION_CENTER.REVOKE') }}</span>
            <span v-show="scope.row.updateFlag" @click="edit(scope.row, scope.$index)">重新編輯</span>
          </div>
        </template>
      </el-table-column>
      <div slot="empty" class="g-empty">
        <img src="../../img/table-empty.png" alt />
        <span>無授權內容</span>
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
// import FormButton from "@/components/common/FormButton.vue";
import { queryOpenAcctAuthStatus } from '@/api/customer-management/customer';
import {
  getAuthorizationList,
  undo,
  getAuthorizationDetail
} from '@/api/authorization-center';
import { format } from 'url';
import CONSTANTS from '@/utils/constant.js';
import dateTools from '@/utils/dateTools';

const { BIZ_STATUS_LIST } = CONSTANTS;

export default {
  name: 'MySubmitIndexPage',
  components: {},

  data() {
    const _self = this;
    return {
      tips: '', //弹框提示
      bizType: '', //业务类型
      authStatus: 'WAIT_AUTH', //授权状态
      submitTime: ['', ''], //提交时间
      bizCodeList: [], //业务类型数组
      bizStatusList: BIZ_STATUS_LIST,
      pickerOptions: {
        shortcuts: [
          {
            text: _self.$t('AUTHORIZATION_CENTER.NEARLY_ONE_WEEK'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: _self.$t('AUTHORIZATION_CENTER.NEARLY_ONE_MONTH'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: _self.$t('AUTHORIZATION_CENTER.NEARLY_THREE_MONTH'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ],
        disabledDate(time) {
          let curDate = new Date().getTime();
          let three = 3 * 365 * 24 * 3600 * 1000;
          let threeMonth = curDate - three;
          var thatDay = time.getTime();
          return (
            time.getTime() > Date.now() - 8.64e6 || time.getTime() < threeMonth
          );
        }
      },
      tableData: [
        //保存列表数组
        // {
        //   flowNum: '65009999611', //流水号
        //   bizType: '公告管理', //业务类型
        //   operType: _self.$t('COMMON.ADD'), //操作类型
        //   submitTime: '2021-10-30 12:31:32', //提交时间
        //   authStatus: _self.$t('AUTHORIZATION_CENTER_WAIT_AUTH') //状态
        // }
      ],
      currentPage: 1,
      pageSize: 10,
      total: 1,
      form: {
        payItemName: '6',
        channel: '2'
      },
      projectObject: {},
      visible: false
    };
  },

  mounted() {
    let self = this;
    // self.search();
    self.getDate();
    self.bizCodeList = CONSTANTS.BIZ_CODE_TYPE_LIST;
  },

  methods: {
    //查询
    search() {
      let self = this;
      if (!self.submitTime) {
        return this.$showMsg({
          type: 'error',
          message: this.$t('AUTHORIZATION_CENTER.PLEASE_SUBMIT_TIME')
        });
      }
      self.tableData = [];
      let params = {
        authType: 'MY',
        bizType: self.bizType, //业务类型
        authStatus: self.authStatus, //授权状态
        queryStartTime: self.submitTime[0], //开始时间
        queryStopTime: self.submitTime[1], //结束时间
        size: self.pageSize,
        current: self.currentPage
      };
      getAuthorizationList(params).then(res => {
        const { body } = res;
        self.total = parseInt(res.head.totalNum) || 0;
        if (body && Object.getOwnPropertyNames(body).length) {
          //   res.body.forEach(item => {
          //     item.authStatus = CONSTANTS.AUTHSTATUS[item.authStatus];
          //   });
          self.tableData = body;
          self.tableData.forEach(item => {
            item.updateFlag = false;
            if (item.bizTypeCode === '59427059') {
              if (
                item.authStatus === 'REJECT' ||
                item.authStatus === 'REVOCATION'
              ) {
                item.updateFlag = true;
              }
            }
          });
        } else {
          self.tableData = [];
        }
      });
    },

    //选择时间
    selectDate([startTime, endTime]) {
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
      this.$set(this, 'submitTime', [startTime, endTime]);
    },

    //获取默认时间——最近三个月
    getDate(reset) {
      let self = this;
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      let endDate = self.formatDate(end);
      let startDate = self.formatDate(start);
      self.submitTime = [startDate, endDate];
      if (!reset) {
        self.search();
      }
    },

    //处理默认获取最近三个月时间
    formatDate(date) {
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      if (month.toString().length < 2) {
        month = '0' + month;
      }
      let day = date.getDate();
      if (day.toString().length < 2) {
        day = '0' + day;
      }
      return year + '-' + month + '-' + day;
    },

    handleSizeChange(val) {
      console.log(val);
      let self = this;
      self.pageSize = val;
      self.currentPage = 1;
      self.search();
    },
    handleCurrentChange(val) {
      console.log(val);
      let self = this;
      self.currentPage = val;
      self.search();
    },

    //重置父级表单
    handleReset() {
      let self = this;
      self.bizType = '';
      self.authStatus = 'WAIT_AUTH';
      self.getDate(true);
    },

    //详情
    handleCell(row) {
      getAuthorizationDetail({ flowNum: row.flowNum }).then(res => {
        if (res.body) {
          this.$router.push({
            path: '/mySubmit/ditail',
            query: res.body
          });
        }
      });
    },
    //撤销
    revoke(row) {
      this.projectObject = row;
      this.$showBox({
        content: this.$t('AUTHORIZATION_CENTER.REVOKE_TIPS'),
        confirm: () => {
          this.confirm();
        }
      });
    },

    //确定撤销
    confirm() {
      undo({
        flowNum: this.projectObject.flowNum,
        authStatus: 'REVOCATION',
        authOpinion: ''
      }).then(res => {
        if (res.body) {
          // this.$showMsg.success('撤销交易成功');
          this.$showMsg({
            type: 'success',
            message: this.$t('AUTHORIZATION_CENTER.REVOKE_SUCCESS')
          });
        }
        this.search();
      });
    },

    //重新编辑——开户
    async edit(row) {
      console.log('row', row);
      const result = await queryOpenAcctAuthStatus({ flowNum: row.flowNum });
      console.log(result, 'result');
      if (result.body) {
        const { userMerchantSave } = result.body;
        this.$router.push({
          name: 'CustomerAccountOpen',
          params: { ebankCstmNo: userMerchantSave.ebankCstmNo }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.contain {
  padding: 32px 24px;
  box-sizing: border-box;
  min-height: 100%;
  background: #fff;
}
.reset {
  margin-left: 16px;
  border-color: #000000 45%;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0;
}
/deep/ .el-table__empty-block {
  text-align: center;
  @media screen and (max-width: 1919px) {
    text-align: initial;
  }
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
.g-empty {
  img {
    width: 261px;
    height: 277px;
  }
  span {
    position: absolute;
    bottom: 25%;
    left: 48%;
  }
}
.g-bolck {
  text-align: right;
  padding: 24px;
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
}
.g-w-270 {
  width: 270px;
}
.f-btnColor {
  cursor: pointer;
  color: #4181fa;
}
</style>
