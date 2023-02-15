<template>
  <div class="g-tipsMain">
    <div class="g-contant">
      <el-form :model="formData" class="u-from">
        <!-- 公告标题-->
        <el-form-item :label="$t(`NOTICE.ANNOUNCEMENT_TITLE`)" prop="title">
          <el-input v-model="formData.title" :placeholder="$t(`NOTICE.PLEASE_ENTER`)"></el-input>
        </el-form-item>
        <!-- 发布日期 -->
        <el-form-item :label="$t(`NOTICE.RELEASE_DATE`)" prop="transTime" class="m-timePick">
          <el-date-picker
            v-model="formData.transTime.startDate"
            style="width:140px;"
            :clearable="false"
            range-separator
            :placeholder="$t('ACCOUNT_MANAGEMENT.STRAT_MONTH')"
            :picker-options="pickerOptions"
          ></el-date-picker>
          <span class="line">-</span>
          <el-date-picker
            v-model="formData.transTime.endingDate"
            style="width:140px;"
            :clearable="false"
            range-separator
            :placeholder="$t('ACCOUNT_MANAGEMENT.END_MONTH')"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <!-- 重置 -->
        <VButton
          size="w70"
          @click="reset"
          style="margin-left:32px;letter-spacing: none;"
        >{{$t(`NOTICE.RESET`)}}</VButton>
        <!-- 查询 -->
        <VButton :style="{ overflow: 'hidden' }"
          size="wMin70" type="primary" class="u-search" @click="search">{{$t(`NOTICE.ENQUIRY`)}}</VButton>
        <!-- <div class="u-btn">
          
        </div>-->
      </el-form>

      <div class="u-table">
        <el-table :data="tableData">
          <!--  编号-->
          <el-table-column :label="$t(`NOTICE.NUMBERING`)" prop="announcementCode" width="260px"></el-table-column>
          <!-- 标题 -->
          <el-table-column
            :label="$t(`NOTICE.TITLE`)"
            prop="commonTitle"
            width="440px"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <!-- 发布时间 -->
          <el-table-column :label="$t(`NOTICE.RELEASE_TIME`)" width="260px" prop="createTime"></el-table-column>
          <!-- 操作 -->
          <el-table-column :label="$t(`NOTICE.OPERATE`)" align="center">
            <template slot-scope="scope">
              <!-- 详情 -->
              <el-button
                type="text"
                @click="showDialog('dialog',scope.row)"
              >{{$t(`NOTICE.DETAILS`)}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="u-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pagesize"
            layout="prev,pager,next,jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <PopUp
      ref="dialog"
      width="960px"
      :options="false"
      @confirm="confirm('dialog')"
      :confirmField="confirmField"
    >
      <div class="u-dialogP">
        <span>{{$t(`NOTICE.ANNOUNCEMENT_DETAILS`)}}</span>
      </div>
      <div class="u-content">
        <p class="u-title">{{detailObj.commonTitle}}</p>
        <p class="u-date">{{detailObj.createTime}}</p>
      </div>
      <div class="u-contents" style="margin-left:18px;margin-right:18px;">{{detailObj.commonContent}}</div>
    </PopUp>
  </div>
</template>

<script>
import { findBankNoticeInfoList, findBankNoticeDetail } from '@/api/home.js';
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapState, mapMutations } = createNamespacedHelpers('app');
import tools from '@/dataTools/tools';
const { getYMD, getYM } = tools;
const startDate = getYMD(new Date().getTime() - 2505600000);
const endingDate = getYMD(new Date().getTime());
export default {
  data() {
    return {
      formData: {
        title: '',
        transTime: { startDate, endingDate },
      },
      tableData: [],
      dialogForm: {
        cnAnnouncementTitle: '',
        cnAnnouncementContent: '',
        createTime: ''
      },
      currentPage: 1,
      pagesize: 10,
      total: 0,
      dialogVisible: false,
      detailObj: {}, // 详情数据
      pickerOptions: {
        disabledDate(time) {
          /**
           * 两种情况下·禁止选中
           * 1.大于当前日期
           * 2.七年之外
           */
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const selectMonth = new Date(time).getMonth();
          const selectYear = new Date(time).getFullYear();
          if (currentYear < selectYear || currentYear - selectYear > 7) {
            return true;
          }
          if (currentYear === selectYear) {
            return currentMonth < selectMonth;
          }
          if (currentYear - selectYear === 7) {
            return currentMonth >= selectMonth;
          }
          return false;
        }
      }
    };
  },
  computed: {
    ...mapState(['lang']),
    confirmField(){
      return this.$t('NOTICE.KNOW_IT')
    }
  },
  watch: {
    lang(n, o) {
      if (n) {
        this.findList();
      }
    },
    'formData.transTime': {
      handler(newVal) {
        const startDate = this.formData.transTime.startDate;
        const endingDate = this.formData.transTime.endingDate;
        this.formData.transTime.startDate = getYMD(new Date(startDate).getTime());
        this.formData.transTime.endingDate = getYMD(new Date(endingDate).getTime());
      },
      deep: true
    }
  },
  created() {
    this.findList();
  },
  mounted() {},
  methods: {
    // ...mapActions(['NOTICEINFOLIST']),
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.findList();
    },
    handleSizeChange(size) {
      this.pagesize = size;
      this.findList();
    },
    async showDialog(refName, row) {
      console.log('refName, row',refName, row);
      this.detailObj = row;
      this.$refs[refName].showDialog();
    },
    async findList() {
      let params = {
        current: this.currentPage,
        size: this.pagesize,
        title: this.formData.title,
        startTime: this.formData.transTime.startDate,
        endTime: this.formData.transTime.endingDate
      };
      // this.NOTICEINFOLIST(params)

      const notice = await findBankNoticeInfoList(params);
      this.tableData = notice.records;
      this.tableData.forEach(item => {
        switch (this.lang) {
          case 'zh-CN':
            this.$set(item, 'commonTitle', item.cnAnnouncementTitle);
            this.$set(item, 'commonContent', item.cnAnnouncementContent);
            return;
          case 'zh-HK':
            this.$set(item, 'commonTitle', item.tcAnnouncementTitle);
            this.$set(item, 'commonContent', item.tcAnnouncementContent);
            return;
          case 'en':
            this.$set(item, 'commonTitle', item.enAnnouncementTitle);
            this.$set(item, 'commonContent', item.enAnnouncementContent);
            break;
        }
      });
      this.total = notice.total;
    },
    search() {
      this.findList();
    },
    reset() {
      this.formData.title = '';
      this.formData.date = [];
      this.findList();
    },
    confirm(refName) {
      this.$refs[refName].closeHandle();
    }
  }
};
</script>

<style lang="scss" scoped>
.g-tipsMain {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-basis: 100%;
  min-height: 100vh;

  .g-contant {
    // background: #fafbfc;
    width: 1340px;
    min-width: 1340px;
    flex-grow: 1;
    // padding: 30px 20px;
    margin: 0 auto;
    height: calc(100vh - 176px);
    width: 1340px;
    // height: 100%;
    overflow: auto;
    background: #fff;
  }
  .u-from {
    display: flex;
    margin-top: 36px;
    // margin-left: 3%;
    .el-form-item {
      display: flex;
      margin-left: 24px;
    }
    ::v-deep .el-input__inner {
      width: 230px;
      height: 36px;
    }
    ::v-deep .el-date-editor.el-input {
      width: 230px;
    }
  }

  .u-search {
    margin-left: 16px;
    letter-spacing: none;
  }
  .u-table {
    margin-top: 12px;
    margin-left: 24px;
    margin-right: 24px;
  }
  .u-pagination {
    margin-right: 24px;
    margin-top: 16px;
  }
}
.u-dialogP {
  text-align: left;
  // height: 46px;
  line-height: 46px;
  width: 100%;
  background: rgba($color: #feaf03, $alpha: 0.1);
  color: rgba($color: #000000, $alpha: 0.85);
  font-weight: 500;
 
  span {
    padding-left: 24px;
  }
}
.u-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  // margin: 0 24px;
  .u-title {
    padding-left: 24px;
    padding-right: 24px;
    padding-top:24px;
    // margin-top: 22px;
    text-align: left;
    color: rgba($color: #000000, $alpha: 0.85);
    font-weight: 500;
    font-size: 18px;
  }
  .u-date {
    width: 250px;
    text-align: right;
    margin-top: 22px;
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.45);
    font-weight: 400;
    line-height: 22px;
    padding-right: 24px;
  }
}
.u-contents {
  text-indent: 2em;
  margin: 24px 15px;
  // height: 502px;
  max-width: 960px;
  // width:930px;
  max-height: 440px;
  overflow-x:hidden;
}
::v-deep .el-dialog__header {
  padding: 0;
  margin: 0;
  background: rgba(254, 175, 3, 0.1);
  color: #333333;
  text-align: left;
  line-height: 46px;
  padding-left: 32px;
}
::v-deep .el-dialog__title {
  font-size: 14px;
  font-weight: 500;
}
::v-deep .el-dialog--center .el-dialog__body {
  padding: 0;
}
::v-deep .el-dialog__headerbtn .el-dialog__close {
  display: none;
}
::v-deep .el-table th.el-table__cell > .cell {
  padding: 0 24px !important;
}

::v-deep .el-table .el-table__cell {
  padding: 0 !important;
}
::v-deep .el-table td.el-table__cell div {
  padding: 0 24px !important;
}
.m-timePick {
  margin-left: 40px;
  ::v-deep .el-form-item__content {
    display: flex;
  }
  ::v-deep.el-input__inner {
    width: 140px !important;
    // margin-bottom: 16px;
  }
  .line {
    margin: 10px 10px;
  }
}
</style>