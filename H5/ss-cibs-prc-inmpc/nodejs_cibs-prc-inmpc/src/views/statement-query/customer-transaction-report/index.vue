<!--
 * @Author: zhutao
 * @Date: 2022-06-17 17:00:11
 * @LastEditTime: 2022-09-24 18:27:16
 * @LastEditors: Please set LastEditors
 * @Description: 客户交易日志报表
 * @FilePath: \ss-cibs-prc-inmpc\nodejs_cibs-prc-inmpc\src\views\statement-query\customer-transaction-report\index.vue
-->
<template>
  <div class="waitAuth">
    <!-- 查询区 -->
    <el-form
      ref="mySubmitFormRef"
      :model="mySubmitForm"
      label-width="110px"
      class="transverse-form"
      label-suffix=":"
      label-position="right"
    >
      <el-form-item label="個人網銀客戶號" prop="merchantCode">
        <el-input class="f-w-270" v-model="mySubmitForm.merchantCode" placeholder="請輸入"></el-input>
      </el-form-item>

      <el-form-item label="交易類型" prop="menuCode">
        <el-cascader
          class="f-w-270"
          placeholder="全部"
          v-model="mySubmitForm.menuCode"
          :options="options"
          :props="{expandTrigger: 'hover'}"
          separator="-"
        ></el-cascader>
        <!-- <el-select class="f-w-270" v-model="mySubmitForm.businessCode" placeholder="全部">
          <el-option
            v-for="(item,index) in authStatusList"
            :key="index"
            :label="item.businessCode"
            :value="item.value"
          ></el-option>
        </el-select>-->
      </el-form-item>

      <el-form-item label="交易日期" prop="subDate">
        <el-date-picker
          class="f-w-270"
          v-model="mySubmitForm.submitDate"
          type="daterange"
          value-format="yyyy-MM-dd"
          start-placeholder="開始日期"
          end-placeholder="結束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="渠道" prop="transChannel">
        <el-select class="f-w-270" v-model="mySubmitForm.transChannel" placeholder="全部">
          <el-option
            v-for="(item,index) in channelList"
            :key="index"
            :label="item.transChannel"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <span slot="label">{{ }}</span>
        <div style="width:196px;">
          <Form-Button
            style="float:right;width:196px"
            :show-add="false"
            @submit="query"
            @handleReset="handleReset"
          ></Form-Button>
        </div>
      </el-form-item>
    </el-form>
    <!-- 下载 -->
    <el-button @click="downLoad">{{$t('STATEMENT_QUERY.DOWN_LOAD')}}</el-button>
    <!-- 列表数据区 -->
    <el-table
      :data="mySubData"
      style="width: 100%"
      class="m-t-20"
      height="550px"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column prop="submitDate" label="提交日期" width="120px"></el-table-column>
      <el-table-column prop="submitTime" label="提交時間" width="120px"></el-table-column>
      <el-table-column prop="merchantCode" label="個人網銀客戶號" width="150px"></el-table-column>
      <el-table-column prop="userCode" label="CRN" width="120px"></el-table-column>
      <el-table-column prop="flowNo" label="網銀流水號" width="150px"></el-table-column>
      <el-table-column prop="businessCode" label="交易編號" width="120px"></el-table-column>
      <el-table-column prop="menuNameTC" label="交易類型" width="120px"></el-table-column>
      <el-table-column prop="debitAcct" label="交易賬戶" width="120px"></el-table-column>
      <el-table-column prop="status" label="交易賬戶狀態" width="120px">
        <template v-slot="{row}">{{ statusFilter(row.status) }}</template>
      </el-table-column>
      <el-table-column prop="deductAcct" label="扣費賬戶" width="120px"></el-table-column>
      <el-table-column prop="currencyType" label="幣種" width="120px"></el-table-column>
      <el-table-column prop="amount" label="交易金額" width="120px"></el-table-column>
      <el-table-column prop="creditAcct" label="對方賬戶" width="120px"></el-table-column>
      <el-table-column prop="returnCode" label="錯誤代碼" width="120px"></el-table-column>
      <el-table-column prop="tfaStatus" label="2FA" width="100px">
        <template v-slot="{row}">{{ row.tfaStatus === '1' ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column prop="billNo" label="BILL NO" width="150px"></el-table-column>
      <el-table-column prop="payDate" label="FI EXE DATE" width="120px"></el-table-column>
      <el-table-column prop="transChannel" label="渠道" width="100px"></el-table-column>
      <div slot="empty">
        <img src="@/img/table-empty.png" alt />
        <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
      </div>
    </el-table>

    <!-- 分页区 -->
    <div class="g-bolck">
      <div class="total">
        <span>當前工作日總計：{{ dayilyTotal }}</span>
      </div>
      <el-pagination
        :background="true"
        :current-page="current"
        :page-size="size"
        :total="total"
        layout="prev,pager,next,sizes,jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-table
      :data="numData"
      height="550px"
      border
      style="width: 51%"
      stripe
      :header-cell-style="{background:'#f3f3f3',color:'#000',fontSize:'14px'}"
    >
      <el-table-column prop="businessCode" label="交易編號" min-width="100"></el-table-column>
      <el-table-column prop="menuNameTC" label="交易類型" min-width="100"></el-table-column>
      <el-table-column prop="ibCount" label="IB計數" min-width="100"></el-table-column>
      <el-table-column prop="mbCount" label="MB計數" min-width="100"></el-table-column>
      <el-table-column prop="total" label="總數" min-width="100"></el-table-column>
      <div slot="empty">
        <img src="@/img/table-empty.png" alt />
        <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
      </div>
    </el-table>
  </div>
</template>
<script>
import dateTools from '@/utils/dateTools';

import FormButton from '@/components/common/FormButton.vue';
import { downUrl } from '@/utils/downLoadTools';
import {
  queryCtsTransLog,
  queryAllCtsTransLog,
  downloadCtsTransLog
} from '@/api/statiscal-query/index.js';

const { getDateStr, getPreMonthDay, formatDate } = dateTools;
function monthDetal(initDate, n) {
  const dateArr = initDate.split('-');
  let yearNum = parseInt(dateArr[0]);
  let monthNum = parseInt(dateArr[1]);
  let dayNum = parseInt(dateArr[2]);
  let date = '';
  let dateNum = '';
  if (monthNum + n < 1) {
    monthNum = 12 + monthNum + n;
    --yearNum;
    dateNum = new Date(`${yearNum}-${monthNum}-${dayNum}`).getTime();
  } else {
    monthNum = monthNum + n;
    dateNum = new Date(`${yearNum}-${monthNum}-${dayNum}`).getTime();
    if (monthNum == 2) {
      if (n > 0 && dayNum > 29 && dayNum < 32) {
        dateNum = new Date(`${yearNum}-03-01`).getTime();
      }
      if (n < 0 && dayNum > 29 && dayNum < 32) {
        return new Date(`${yearNum}-03-01`);
      }
    }
  }
  date = new Date(dateNum - 24 * 3600 * 1000 * n);
  return date;
}
const transTimeEnd = getDateStr(new Date(), -1);
const transTimeStart = getDateStr(new Date(), -1);
// import { queryAuthsInManagment } from '@/api/authorizeCenter';
export default {
  name: 'CustomerTransactionReport',
  components: {
    FormButton
  },
  data() {
    return {
      mySubmitForm: {
        merchantCode: '',
        menuCode: '',
        submitDate: [transTimeStart, transTimeEnd],
        transChannel: '',
        transTimeEnd,
        transTimeStart,
        businessCode: ''
      },
      dayilyTotal: 0,
      min: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.min = minDate && minDate.getTime();
          if (maxDate) {
            this.min = '';
          }
        },
        //不能选择跨过1个月的
        disabledDate: time => {
          if (this.min) {
            return (
              time.getTime() >
                monthDetal(formatDate(new Date(this.min)), 1).getTime() ||
              time.getTime() <
                monthDetal(formatDate(new Date(this.min)), -1).getTime() ||
              time.getTime() > Date.now() - 24 * 60 * 60 * 1000
            );
          } else {
            return time.getTime() > Date.now() - 24 * 60 * 60 * 1000;
          }
        }
      },
      options: [
        {
          value: '1101',
          label: '登录'
        },

        {
          value: '1102',
          label: '登出'
        },
        {
          value: '1201',
          label: '忘记用户名'
        },
        {
          value: '1301',
          label: '忘记登录密码'
        },
        {
          value: '14',
          label: '个人设定',
          children: [
            {
              value: '1401',
              label: '修改密码'
            },
            {
              value: '1402',
              label: '我的用户名'
            }
          ]
        },
        // {
        //   value: '02',
        //   label: '账户管理',
        //   children: [
        //     {
        //       value: '0201',
        //       label: '账户概览'
        //     },
        //     {
        //       value: '0202',
        //       label: '交易明细查询'
        //     },
        //     {
        //       value: '0203',
        //       label: '电子结单'
        //     },
        //     {
        //       value: '0204',
        //       label: '电子通知书'
        //     }
        //   ]
        // },
        {
          value: '030101',
          label: '行内转账'
        },
        {
          value: '03010201',
          label: '转数快'
        },
        {
          value: '03010202',
          label: 'CHATS'
        },
        {
          value: '030103',
          label: '全球汇款'
        },
        // {
        //   value: '030106',
        //   label: '最近转账记录'
        // },
        {
          value: '030107',
          label: '登记第三者账户'
        },
        {
          value: '030104',
          label: '批量转账',
          children: [
            {
              value: '03010401',
              label: '批量转账录入'
            }
            // {
            //   value: '03010402',
            //   label: '批量转账查询'
            // }
          ]
        },
        {
          value: '030105',
          label: '批量发薪',
          children: [
            {
              value: '03010501',
              label: '批量发薪录入'
            }
            // {
            //   value: '03010502',
            //   label: '批量发薪查询'
            // }
          ]
        },
        {
          value: '0303',
          label: '预约交易管理'
        },
        {
          value: '10',
          label: '申请支票簿'
        },
        {
          value: '04',
          label: '定期存款',
          children: [
            {
              value: '0402',
              label: '开立定期存款'
            },
            // {
            //   value: '0401',
            //   label: '定期存款概览'
            // },
            {
              value: '0403',
              label: '更改到期指示'
            }
          ]
        },
        {
          value: '0501',
          label: '外汇',
          children: [
            {
              value: '050102',
              label: '货币兑换'
            }
            // {
            //   value: '050101',
            //   label: '外币牌价'
            // }
          ]
        },
        {
          value: '0502',
          label: '基金',
          children: [
            {
              value: '050201',
              label: '基金认购'
            },
            {
              value: '050202',
              label: '我的基金'
            }
            // {
            //   value: '050203',
            //   label: '基金月报'
            // }
          ]
        },
        // {
        //   value: '0503',
        //   label: '投资交易记录'
        // },
        {
          value: '0601',
          label: '缴付账单',
          children: [
            {
              value: '060101',
              label: '缴付账单'
            },
            {
              value: '060102',
              label: '我的商户清单'
            },
            {
              value: '060103',
              label: '预约缴付管理'
            }
          ]
        },
        // {
        //   value: '07',
        //   label: '授权中心',
        //   children: [
        //     {
        //       value: '0701',
        //       label: '待我授权'
        //     },
        //     {
        //       value: '0702',
        //       label: '我提交的'
        //     }
        //   ]
        // },
        // {
        //   value: '08',
        //   label: '查询服务',
        //   children: [
        //     {
        //       value: '0801',
        //       label: '外币牌价'
        //     },
        //     {
        //       value: '0802',
        //       label: '网银交易记录'
        //     },
        //     {
        //       value: '0803',
        //       label: '服务中心'
        //     },
        //     {
        //       value: '0804',
        //       label: 'APP下载'
        //     }
        //   ]
        // },
        // {
        //   value: '0805',
        //   label: '存款利率',
        //   children: [
        //     {
        //       value: '080501',
        //       label: '储蓄存款利率'
        //     },
        //     {
        //       value: '080502',
        //       label: '定期存款利率'
        //     }
        //   ]
        // },
        {
          value: '09',
          label: '网银管理',
          children: [
            {
              value: '0901',
              label: '用户管理'
            },
            {
              value: '0902',
              label: '账户管理'
            },
            {
              value: '090301',
              label: '授权模板维护'
            },
            {
              value: '090302',
              label: '交易授权设置'
            },
            {
              value: '090401',
              label: '服务限额设置'
            },
            {
              value: '090402',
              label: 'FPS账户绑定'
            },
            {
              value: '090403',
              label: '设定小额转账'
            },
            {
              value: '090404',
              label: '设定EDDA'
            },
            {
              value: '090405',
              label: '设定电子结单'
            },
            {
              value: '090406',
              label: '设定交易提示'
            }
            // {
            //   value: '090501',
            //   label: '我提交的'
            // },
            // {
            //   value: '090502',
            //   label: '待我授权'
            // }
          ]
        }
      ],
      channelList: [
        {
          transChannel: '全部',
          value: ''
        },
        {
          transChannel: 'IB',
          value: 'WEB'
        },
        {
          transChannel: 'MB',
          value: 'APP'
        }
      ],
      mySubData: [],
      numData: [],
      // 分页
      current: 1,
      size: 10,
      total: 0
    };
  },
  watch: {
    'mySubmitForm.submitDate': {
      handler(newVal) {
        const [startTime = '', endTime = ''] = newVal;
        console.log(startTime, endTime);
        this.mySubmitForm.transTimeEnd = endTime;
        this.mySubmitForm.transTimeStart = startTime;
      }
    },
    'mySubmitForm.menuCode': {
      handler(value) {
        this.mySubmitForm.businessCode = value[value.length - 1];
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    statusFilter(val) {
      switch (val) {
        case 'ACTIVE':
          return '正常';
        default:
          return val;
      }
    },
    async getAllList() {
      const result = await queryAllCtsTransLog(this.mySubmitForm);
      if (result && result.body) {
        this.numData = result.body.transCountInfoList;
        this.numData.push({
          menuNameTC: '總計',
          ibCount: result.body.ibCountTotal,
          mbCount: result.body.mbCountTotal,
          total: result.body.totalCount
        });
      }
    },
    query() {
      this.current = 1;
      this.getList();
    },
    async getList() {
      let params = {
        ...this.mySubmitForm,
        current: this.current,
        size: this.size
      };
      const result = await queryCtsTransLog(params);
      if (result && result.body) {
        this.mySubData = result.body.logInfoIPage.records;
        this.total = result.body.logInfoIPage.total;
        this.dayilyTotal = result.body.dayilyTotal;
      }
      this.getAllList();
    },
    handleReset() {
      this.$refs['mySubmitFormRef'].resetFields();
      this.mySubmitForm.submitDate = [transTimeStart, transTimeEnd];
      this.mySubmitForm.businessCode = '';
    },
    handleSizeChange(val) {
      this.size = val;
      this.current = 1;
      this.getList();
    },
    handleCurrentChange(val) {
      this.current = val;
      this.getList();
    },
    async downLoad() {
      const result = await downloadCtsTransLog(this.mySubmitForm);
      if (result) {
        console.log(result);
        downUrl(result.body.url);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.waitAuth {
  background: #fff;
  min-width: 600px;
  padding: 32px 20px;
  min-height: 100%;
  box-sizing: border-box;
  position: relative;
  .f-w-270 {
    width: 270px;
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
  .m-t-20 {
    margin-top: 20px;
  }
  .el-table {
    margin-top: 20px;
  }
  .flexc {
    // float: right;
    // justify-content: normal;
    margin-top: 2px;
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
.g-w-270 {
  width: 270px;
}
.g-bolck {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  padding: 0 20px;
  .total {
    span:not(:nth-of-type(1)) {
      margin-left: 20px;
    }
  }
}
</style>