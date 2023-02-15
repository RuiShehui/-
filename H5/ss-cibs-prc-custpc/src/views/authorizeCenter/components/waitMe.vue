<!--
 * @Author: your name
 * @Date: 2021-12-06 11:21:07
 * @LastEditTime: 2022-09-17 16:08:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\waitMe.vue
-->
<template>
  <div class="g-waitme-wrapper">
    <div class="m-select-content" style="margin-bottom: 4px;">
      <el-form :model="formData" ref="formData" :inline="true" label-position="right">
        <el-row>
          <el-col :span="lang === 'en' ? 10:8">
            <el-form-item :label="$t('COMMON.TRADE_TYPE')+ '：'" prop="tradeType">
              <el-cascader
                v-model="formData.tradeType"
                :options="options"
                :props="{expandTrigger: 'hover'}"
                separator="-"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="$t('COMMON.SUBMITTER')+ '：'"
              prop="submiter"
              style="margin-top: 1px;"
            >
              <el-select v-model="formData.submiter" @change="selectChange">
                <el-option
                  v-for="(item,index) in submiterList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="lang === 'en' ? 6:8">
            <el-form-item>
              <span class="g-btns">
                <v-button class="f-reset" size="w70" @click="reset">{{$t('COMMON.RESET')}}</v-button>
                <v-button size="w96" @click="query" type="primary">{{$t('COMMON.SEARCH')}}</v-button>
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="m-list-content">
      <!-- <cardList @checkbox="checkBox" :scene="'2'" :list="waitList" @detail="goDetail" v-if="len>0"></cardList> -->
      <el-empty :image-size="200" v-if="waitList.length==0"></el-empty>
      <cardList
        v-else
        @checkbox="checkBox"
        scene="2"
        :list="waitList"
        @detail="goDetail"
        ref="list"
      ></cardList>
    </div>
    <el-pagination
      v-if="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next, sizes, jumper"
      :total="Number(total)"
      :current-page="Number(currentPage)"
      :page-size="Number(pageSize)"
      :page-sizes="[10, 20, 30, 50]"
      class="pagination"
    ></el-pagination>
  </div>
</template>

<script>
import cardList from './cardList';
//queryAllMenu 交易类型查询 不接口，前端直接写死
import {
  searchSubmitterInToBeAuth,
  searchByAuthorizer,
  searchBySubmitter
} from '@/api/authorizeCenter';
import metemixins from "@/views/applyCheckbook/components/metemixins.js";
export default {
  mixins:[metemixins],
  components: {
    cardList
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      formData: {
        tradeType: '',
        submiter: ''
      },
      lang:'',
      submiterList: [
        // { label: '张三', value: 'zs' },
        // { label: '李四', value: 'ls' },
        // { label: '王五', value: 'ww' },
        // { label: '张二狗', value: 'zeg' }
      ],
      options: [],
      pickerOptions: {
        shortcuts: [
          {
            text:this.$t('AUTHORIZE.LAST_WEEK'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text:  this.$t('AUTHORIZE.LAST_MONTH'),
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: this.$t('AUTHORIZE.LAST_THREE_MONTH'),
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
          let year = new Date().getFullYear();
          let day = 365;
          if ((year % 4 === 0 && year % 100 !== 0) || year % 400 == 0) {
            day = 366; //闰年
          }
          let fullYear = day * 24 * 3600 * 1000;
          const oneYear = curDate - fullYear;
          return time.getTime() > Date.now() || time.getTime() < oneYear;
        }
      },
      queryFlag: true,
      waitList: [],
      businessCode: '', //交易类型
      userCode: '', //提交人

      //test 数据
      endTime: '', //结束时间
      current: '1', //分页参数
      transactionType: '', //交易类型
      size: '10', //分页参数
      startTime: '', //开始时间
      transType: '1', //1普通交易9管理台交易
      checkList: []
    };
  },
  created() {
    this.lang = localStorage.getItem('lang')
    //未授权提交人接口获取
    this.searchSubmitterInToBeAuthInit();
    //待我授权交易摘要列表查詢接口获取
    this.searchByAuthorizerInit();
    // this.checkList=this.$refs.cardList.checkList

    //test 接口
    // this.searchBySubmitterInit();
  },
  watch: {
    'formData.subTime'(time) {
      if (time) {
        let startTime = time[0];
        let endTime = time[1];
        startTime = new Date(startTime).getTime();
        endTime = new Date(endTime).getTime();
        this.queryFlag = true;
        if ((endTime - startTime) / 1000 / 3600 / 24 / 30 > 3) {
          this.queryFlag = false;
          this.$message.error(this.$t('AUTHORIZE.PLEASE_SELECT'));
        }
      }
    },
    lang(){
      // location.reload()
      this.options=this.i18nDate()
        
    
    }
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size;
      this.searchByAuthorizerInit();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.searchByAuthorizerInit();
    },
    async searchSubmitterInToBeAuthInit() {
      let params = {
        // body:'T24200011005'
      };
      const res = await searchSubmitterInToBeAuth();
      if (res && res.length > 0) {
        res.map((item, index) => {
          this.submiterList.push({
            label: item.userEglsName,
            value: item.userCode
          });
        });
      }
    },


    // 真实接口
    async searchByAuthorizerInit() {
      let params = {
        current: this.currentPage,
        tcAuthQueue: {
          businessCode: this.businessCode, //条件：交易类型
          userCode: this.userCode, //条件：提交人
          transType: '1'
        },
        size: this.pageSize
      };
      const result = await searchByAuthorizer(params);
      if (result) {
        this.waitList = result.records;
        this.total = result.total;
        this.waitList.forEach(item => {
          // console.log(item,'result')
          item.transactionDescribe = JSON.parse(item.transactionDescribe);
        });
        this.total = result.total;
      }
      this.$emit('allData', this.total);
    },
    handleChange(value) {
      this.businessCode = value[value.length - 1];
    },
    selectChange(value) {
      this.userCode = value;
    },
    reset() {
      this.businessCode = ''; //交易类型
      this.userCode = ''; //提交人
      this.searchByAuthorizerInit();
      this.$refs.formData.resetFields();
    },
    query() {
      // if (!this.queryFlag)
      //   return this.$message.error('最大选择范围为3个月，请重新选择！');
      this.searchByAuthorizerInit();
    },
    goDetail(item) {
      this.$emit('detail', item);
    },
    goList() {
      this.$emit('golist');
    },
    checkBox(data) {
      this.$emit('checkbox', data);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-btns {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}
::v-deep .oButton {
  margin-left: 24px;
}
::v-deep .el-form-item {
  margin: 0;
}
::v-deep .el-select {
  width: 230px;
  height: 36px;
}
::v-deep .el-input {
  width: 230px !important;
  height: 36px;
}
.table {
  margin-top: 24px;
}
.f-reset {
  margin-right: 24px;
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
/deep/ .el-pagination__jump {
  margin-left: 24px;
  font-weight: normal;
  margin-right: 30px !important;
  color: #666666;
}
/deep/ .pagination {
  .el-select {
    width: auto;
  }
  .el-input {
    width: auto !important;
  }
}
</style>