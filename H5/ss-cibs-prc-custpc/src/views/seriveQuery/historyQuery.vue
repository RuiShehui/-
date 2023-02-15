<template>
  <div>
    <div class="g-table-wrapper" v-loading="requestLoading">
      <el-form :model="formData" ref="formData" :inline="true">
        <el-form-item :label="$t('COMMON.TRADE_TYPE')+ '：'" prop="type">
          <el-cascader
            class="cascader"
            v-model="formData.type"
            :options="options"
            :props="{expandTrigger: 'hover'}"
            separator="-"
          ></el-cascader>
        </el-form-item>
        <el-form-item :label="$t('COMMON.TRADE_STATUS')+ '：'" prop="tradeType">
          <el-select v-model="formData.tradeType" :placeholder="$t('COMMON.PLEASE_SELECT')">
            <el-option
              v-for="(item,index) in tradeTypeList"
              :key="index"
              :label="item.tradeType"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('FUND.TRS_DATE')+ '：'" prop="creatTime">
          <el-date-picker
            v-model="formData.creatTime[0]"
            :placeholder="$t('ACCOUNT_MANAGEMENT.START_DATE')"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            :clearable="false"
            @change="dateChange1()"
            range-separator
          ></el-date-picker>-
          <el-date-picker
            v-model="formData.creatTime[1]"
            :placeholder="$t('ACCOUNT_MANAGEMENT.END_DATE')"
            value-format="yyyy/MM/dd"
            format="yyyy/MM/dd"
            :clearable="false"
            @change="dateChange2()"
            range-separator
          ></el-date-picker>
        </el-form-item>

        <div class="g-btns">
          <v-button class="m-reset" size="w70" @click="reset">{{$t('COMMON.RESET')}}</v-button>
          <v-button size="w96" @click="query" type="primary">{{$t('COMMON.SEARCH')}}</v-button>
        </div>
      </el-form>
      <div class="g-table">
        <history-table :tableData="tableData" @detail="detail" @copy="copy"></history-table>
        <el-pagination
          class="m-pagination"
          v-if="total*1>=10"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          layout="prev, pager, next, sizes, jumper"
          :total="Number(total)"
          :current-page="Number(currentPage)"
          :page-size="Number(pageSize)"
          :page-sizes="[10, 20, 30, 50]"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import historyTable from './components/historyTable';
import { findCommFlowList, querySingleTradeDetail } from '@/api/serveQuery.js';
import tool from '@/dataTools/tools/index.js';
import CONSTANTS from '@/utils/contants';
import mathTools from '@/utils/mathTools.js';
import metemixins from '@/views/applyCheckbook/components/metemixins.js';
import { mapState } from 'vuex';
export default {
  components: {
    historyTable
  },
  mixins: [metemixins],
  data() {
    return {
      options: [],
      entType: '',
      lang: '',
      timeone: [new Date(), new Date()],
      formData: {
        type: '',
        creatTime: [new Date(), new Date()],
        tradeType: ''
      },
      tradeTypeList: [
        {
          tradeType: this.$t('AUTHORIZE.ALL'),
          value: ''
        },
        {
          tradeType: this.$t('INTERESTRATEQUERY.TRANSACTION_SUCCESSFUL'),
          value: '90'
        },
        {
          tradeType: this.$t('INTERESTRATEQUERY.PARTIALLY_SUCCESSFUL'),
          value: '95'
        },
        {
          tradeType: this.$t('INTERESTRATEQUERY.PARTIALLY_FAILED'),
          value: '91'
        },
        {
          tradeType: this.$t('INTERESTRATEQUERY.PROCESSING'),
          value: '01'
        }
      ],
      tableData: [],
      flowNo: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      startTime: '',
      endTime: '',
      exel: '',
      datack: {},
      businessCode: '',
      scene: '1'
    };
  },
  mounted() {
    this.entType = localStorage.getItem('entType');
  },
  created() {
    this.lang = localStorage.getItem('lang');
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 88);

    this.endTime = tool.date2Str(end, 'YYYYMMDD');
    this.startTime = tool.date2Str(start, 'YYYYMMDD');
    this.timeone = [start, end];
    this.formData.creatTime = this.timeone;
    if (this.$route.query.type == '1') {
      this.currentPage = this.$route.query.currentPage.current;
      this.endTime = this.$route.query.currentPage.endDate;
      this.startTime = this.$route.query.currentPage.startDate;
      this.formData.tradeType = this.$route.query.currentPage.stt;
      this.pageSize = this.$route.query.currentPage.size;
      this.businessCode = this.$route.query.currentPage.businessCode;
      this.formData.type = this.$route.query.currentPage.businessCode;
      let fmt = this.startTime;
      fmt = fmt.slice(0, 4) + '/' + fmt.slice(4, 6) + '/' + fmt.slice(6, 8);
      let fmtone = this.endTime;
      fmtone =
        fmtone.slice(0, 4) +
        '/' +
        fmtone.slice(4, 6) +
        '/' +
        fmtone.slice(6, 8);
      this.formData.creatTime = [fmt, fmtone];
    }
    this.Datalist();
  },
  computed: {
    ...mapState('app', ['requestLoading'])
  },
  watch: {
    lang() {
      this.options = this.i18nDate();
    }
  },
  methods: {
    async Datalist() {
      console.log('this.formData.type',this.formData.type)
      if (this.formData.type instanceof Array) {
        var arr = this.formData.type[0];
        console.log(arr,'arr')
        if (arr == '10' || arr == '030106' || arr == '0303'||arr =='16') {
          arr = this.formData.type[0];
          this.businessCode = arr;
        } else {
          arr = this.formData.type[1];
          this.businessCode = arr;
        }
      }
      console.log( this.businessCode,'arrssssss')
      let params = {
        businessCode: this.businessCode,
        current: this.currentPage,
        endDate: this.endTime,
        size: this.pageSize,
        startDate: this.startTime,
        stt: this.formData.tradeType
      };
      this.datack = params;
      const res = await findCommFlowList(params);
      console.log(res.records, 'recordsrecordsrecords');
      this.tableData = res.records;
      for (let i = 0; i < this.tableData.length; i++) {
        let fmt = this.tableData[i].createTime;
        this.tableData[i].createTime =
          fmt.slice(0, 4) +
          '-' +
          fmt.slice(4, 6) +
          '-' +
          fmt.slice(6, 8) +
          '   ' +
          fmt.slice(8, 10) +
          ':' +
          fmt.slice(10, 12) +
          ':' +
          fmt.slice(12, 14);

        if (this.tableData[i].amount == null || this.tableData[i].amount == 0) {
          this.tableData[i].amount = 0;
          this.tableData[i].amount = String(this.tableData[i].amount).toMoney();
        } else {
          if (this.tableData[i].ccy == 'JPY') {
            let arr = this.tableData[i].amount;
            let brr = arr.toString();
            this.tableData[i].amount = mathTools.moneyCheck(brr);
          } else {
            this.tableData[i].amount = String(
              this.tableData[i].amount
            ).toMoney();
            let arr = this.tableData[i].amount;
            let brr = arr.toString();
            this.tableData[i].amount = mathTools.moneyCheck(brr);
          }
          if (this.tableData[i].businessCode === '050102') {
            this.tableData[i].amount =
              this.tableData[i].ccy + ' ' + this.tableData[i].amount;
          } else {
            this.tableData[i].amount =
              this.tableData[i].ccy + ' ' + this.tableData[i].amount;
          }
        }
      }
      this.total = res.total;
    },
    reset() {
      this.formData.type = '';
      this.formData.tradeType = '';
      this.businessCode = '';
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 88);
      this.endTime = tool.date2Str(end, 'YYYYMMDD');
      this.startTime = tool.date2Str(start, 'YYYYMMDD');
      this.timeone = [start, end];
      this.formData.creatTime = this.timeone;
    },
    query() {
      this.Datalist();
    },
    dateChange1(value) {
      this.startTime = this.formData.creatTime[0].split('/').join('');
    },
    dateChange2(value) {
      this.endTime = this.formData.creatTime[1].split('/').join('');
    },
    async detail(item) {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      console.log(userInfo, 'userInfo');
      let params = {
        tcTransactionAbstract: {
          flowNo: item.flowNo
        }
      };
      const res = await querySingleTradeDetail(params);
      if (this.entType == '1' || userInfo.cuSoleAuthorizerInd === '1') {
        this.scene = '0';
      }
      if (item.businessCode == '030110') {
        this.$router.push({
          path: '/seriveQuery/historyQueryDetail',
          query: {
            type: '1',
            res: res.tcTransactionAbstract
            // authState
          }
        });
      } else {
        this.$router.push({
          path: '/authorizeCenter/detail',
          query: {
            isProcess: '0',
            flowNo: item.flowNo,
            stt: item.stt,
            scene: '1',
            jump030103: 'Y',
            res: res.tcTransactionAbstract,
            currentPage: this.datack
            // authState
          }
        });
      }
    },
    async copy(item) {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      let params = {
        tcTransactionAbstract: {
          flowNo: item.flowNo
        }
      };
      const res = await querySingleTradeDetail(params);
      console.log('item', item);
      if (this.entType == '1' || userInfo.cuSoleAuthorizerInd === '1') {
        this.scene = '0';
      }
      //TODO 将参数带向之前添加的页面
      if (item.businessCode == '030110') {
        this.$router.push({
          path: '/seriveQuery/historyQueryDetail',
          query: {
            type: '1',
            res: res.tcTransactionAbstract
            // authState
          }
        });
      } else {
        this.$router.push({
          path: '/authorizeCenter/detail',
          query: {
            isProcess: '0',
            flowNo: item.flowNo,
            stt: item.stt,
            scene: '1',
            jump030103: 'Y',
            res: res.tcTransactionAbstract,
            currentPage: this.datack
          }
        });
      }
    },
    goList() {
      this.showDetail = false;
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.Datalist();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.Datalist();
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-date-editor {
  width: 230px;
  height: 36px;
}
.g-btns {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}
.m-reset {
  margin-right: 24px;
}
/deep/.el-cascader .el-input__suffix .el-icon-arrow-down {
  width: 18px;
  height: 18px;
  // background-image: url(img/arrow-down.png) !important;
  background-size: cover;
  background-repeat: no-repeat;
  margin-top: 10px;
}
::v-deep.el-cascader-node.in-active-path,
.el-cascader-node.is-active,
.el-cascader-node.is-selectable.in-checked-path {
  font-weight: 500;
  color: #595959;
  // background-color: #f06b00;
  background: rgba(245, 126, 0, 0.06);
}
/deep/.el-cascader .el-input__suffix .el-icon-arrow-down {
  background: url('~@/images/common/xuanzekuang.png') no-repeat center
    transparent !important;

  content: '' !important;
  -webkit-appearance: none;
  background-size: 18px 18px !important;
  z-index: 10;
  margin-top: 11px;
  margin-right: 5px;
  transform: rotateZ(180deg);
  position: absolute;
  right: 1px;
}
/deep/.el-cascader .el-input__suffix {
  height: 38px;
  right: 1px;
  margin-top: 1px;
  width: 40px;
  background-color: #f6f6f6;
  background: antiquewhite;
  display: contents;
}
/deep/.el-cascader .el-input .el-icon-arrow-down.is-reverse {
  transform: rotateZ(0deg);
}
.m-tips-wrapper {
  margin-top: 36px;
}
.head {
  margin: 16px 0;
}
.u-tips-content {
  font-size: 14px;
  p {
    line-height: 22px;
    color: rgba(0, 0, 0, 0.45);
  }
}
.el-date-editor {
  width: 140px;
}
</style>