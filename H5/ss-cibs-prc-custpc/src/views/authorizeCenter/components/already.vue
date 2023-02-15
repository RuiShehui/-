<!--
 * @Author: your name
 * @Date: 2021-12-06 11:21:31
 * @LastEditTime: 2022-09-17 15:20:09
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\already.vue
-->
<template>
  <div class="g-end-wrapper">
    <div class="g-select-content">
      <el-form :model="formData" ref="formData" :inline="true" label-position="right">
        <el-row>
          <el-col :span="lang === 'en' ? 10:8">
            <el-form-item :label="$t('COMMON.TRADE_TYPE')+ '：'" prop="type">
              <el-cascader
                v-model="formData.type"
                :options="options"
                :props="{expandTrigger: 'hover'}"
                separator="-"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="lang === 'en' ? 10:8">
            <el-form-item
              :label="$t('COMMON.AUTHORIZATION_STATUS')+ '：'"
              prop="status"
              style="margin-top: 1px;"
            >
              <el-select v-model="formData.status" :placeholder="$t('AUTHORIZE.SELECT')" @change="statusChange">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item,index) in statusList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col  v-if="lang === 'en' ? false:true" :span="8">
            <el-form-item
              :label="$t('COMMON.SUBMITTER')+ '：'"
              prop="submitter"
              style="margin-top: 1px;"
            >
            <!-- 请选择 -->
              <el-select v-model="formData.submitter" :placeholder="$t('AUTHORIZE.SELECT')" @change="selectChange">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item,index) in submitterList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-top:12px;" v-if="lang === 'en' ? true:false">
          <el-col :span="8">
            <el-form-item
              :label="$t('COMMON.SUBMITTER')+ '：'"
              prop="submitter"
              style="margin-top: 1px;"
            >
            <!-- 请选择 -->
              <el-select v-model="formData.submitter" :placeholder="$t('AUTHORIZE.SELECT')" @change="selectChange">
                <el-option
                  :label="item.label"
                  :value="item.value"
                  v-for="(item,index) in submitterList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <span class="g-btns">
          <v-button class="f-reset" size="w70" @click="reset">{{$t('COMMON.RESET')}}</v-button>
          <v-button size="w96" type="primary" @click="query">{{$t('COMMON.SEARCH')}}</v-button>
        </span>
      </el-form>
    </div>
    <div class="g-list-content">
      <el-empty :image-size="200" v-if="waitList.length==0"></el-empty>
      <cardList v-else scene="3" :list="waitList" @reedit="reEdit"></cardList>
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
import {
  searchSubmitterInAuthorized,
  searchAuthorized,
  searchSubmitterInToBeAuth
} from '@/api/authorizeCenter';
import metemixins from "@/views/applyCheckbook/components/metemixins.js";
export default {
    mixins:[metemixins],
  components: {
    cardList
  },
  data() {
    return {
      formData: {
        type: '',
        submitter: '',
        status: ''
      },
      statusList: [
        // '授权同意'
        { label: this.$t('AUTHORIZE.ARGESS'), value: '1' },
        // '授权拒绝'
        { label: this.$t('AUTHORIZE.REFUSE'), value: '2' },
        { label: this.$t('AUTHORIZE.OVERDUE'), value: '3' }
      ],
      submitterList: [
        // {label: '李华', value: 'lihua'}
      ],
      lang:'',
      waitList: [],
      options:[],
      businessCode: '', //交易类型
      authState: '', //授权状态
      transType: '1', //1普通交易9管理员交易
      submitterCode: '', //提交人
      total: 0,
      pageSize: '10', //分页参数
      currentPage: '1' //分页参数
    };
  },
   watch: {
    lang(){
      this.options=this.i18nDate()
    }
  },
  created() {
    console.log('localStorage.getItem("lang")',localStorage.getItem('lang'))
    this.lang = localStorage.getItem('lang')
    //已授权提交人查询接口
    this.searchSubmitterInToBeAuthInit();
    //已授权数据接口
    this.searchAuthorizedInit();
  },
  methods: {
    handleSizeChange(size) {
      this.pageSize = size;
      this.searchAuthorizedInit();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.searchAuthorizedInit();
    },
    //已授权提交人查询
    searchSubmitterInToBeAuthInit() {
      // let params={}//传入参数
      searchSubmitterInToBeAuth().then(res => {
        let params = {
          // body:'T24200011005'
        };
        if (res && res.length > 0) {
          res.map((item, index) => {
            this.submitterList.push({
              label: item.userEglsName,
              value: item.userCode
            });
          });

          //  console.log('未授权提交人---',res)
        }
      });
      console.log('已授权提交人---', this.submitterList);
    },
    //已授权数据列表
    searchAuthorizedInit() {
      let params = {
        current: this.currentPage,
        tcApprovalRecord: {
          authState: this.authState, //条件：授权状态
          businessCode: this.businessCode //条件：交易类型
        },
        size: this.pageSize,
        submitterCode: this.submitterCode, //条件：提交人
        transType: '1' //1普通交易9管理员交易
      }; //传入参数
      searchAuthorized(params).then(res => {
        this.waitList = res.records;
        this.total = res.total;
        this.waitList.forEach(item => {
          item.transactionDescribe = JSON.parse(item.transactionDescribe);
        });
        this.total = res.total;
      });

    },
    handleChange(value) {
      this.businessCode = value[value.length - 1];

    },
    selectChange(value) {
      // this.authState = value;
      this.submitterCode = value;

    },
    statusChange(value) {
      // this.submitterCode = value;
      this.authState = value;
    },
    reset() {
      this.businessCode = ''; //交易类型
      this.authState = ''; //授权状态
      this.submitterCode = ''; //提交人
      this.$refs.formData.resetFields();
    },
    //查询
    query() {
      this.searchAuthorizedInit();
    },
    reEdit(item) {
      console.log('reEdit', item);
    }
  }
};
</script>

<style lang="scss" scoped>
.g-btns {
  display: flex;
  justify-content: center;
  margin: 15px 0px ;
}
.f-reset {
  margin-right: 24px;
}
::v-deep .el-form-item {
  margin: 0;
}
::v-deep .oButton {
  margin-left: 24px;
}
::v-deep .el-input,
.el-date-editor {
  width: 230px;
  height: 36px;
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
</style>