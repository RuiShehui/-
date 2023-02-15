<template>
  <div class="g-tipsMain">
    <div class="g-contant">
      <el-tabs class="u-tabs" v-model="activeTabName">
        <el-tab-pane label="所有消息" name="all" style="color:#f06b00">
          <div class="u-btn" style="margin-top:36px;">
            <el-tabs
              type="card"
              class="m-tabs"
              v-model="activeTabNames"
              style="width:100%"
              @tab-click="handleClick"
            >
              <el-tab-pane :label="$t(`NOTIFICATION.ALL`)" name="alls">
                <el-empty :image-size="200" v-if="this.page.total==0"></el-empty>
                <el-card class="u-cardList" v-for="(item,index) in cardList" :key="index">
                  <div slot="header" class="u-cardListTop">
                    <div style="display:flex;">
                      <img src="@/images/home/new.png" v-if="item.readMark == 0" />
                      <span class="u-span">{{item.commonTitle}}</span>
                    </div>
                    <span class="u-spans">{{item.receivingTime}}</span>
                  </div>
                  <div class="u-content">{{item.commonContent}}</div>
                  <div class="u-btn">
                    <VButton
                      size="w120"
                      style="margin-right:24px;"
                      @click="msgDetail('dialog',item)"
                    >{{$t('COMMON.DETAIL')}}</VButton>
                    <VButton
                      size="w120"
                      @click="toDetail(item)"
                      type="primary"
                    >{{$t('NOTICE.GO_TO_CHECK')}}</VButton>
                  </div>
                </el-card>
                <el-pagination
                  class="f-pageination"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="page.currentPage"
                  :page-size="page.pagerSize"
                  :page-sizes="[10,20,30,50]"
                  layout="prev,pager,next,sizes,total,jumper"
                  :total="page.total"
                ></el-pagination>
              </el-tab-pane>
              <el-tab-pane :label="$t(`NOTIFICATION.UNREAD`)" name="remark">
                <el-empty :image-size="200" v-if="this.page.totals==0"></el-empty>
                <el-card class="u-cardList" v-for="(item,index) in newCardLists" :key="index">
                  <div slot="header" class="u-cardListTop">
                    <div style="display:flex;">
                      <img src="@/images/home/new.png" v-if="item.readMark == 0" />
                      <span class="u-span">{{item.commonTitle}}</span>
                    </div>
                    <span class="u-spans">{{item.receivingTime}}</span>
                  </div>
                  <div class="u-content">{{item.commonContent}}</div>
                  <div class="u-btn">
                    <VButton
                      size="w120"
                      style="margin-right:24px;"
                      @click="msgDetail('dialog',item)"
                    >{{$t('COMMON.DETAIL')}}</VButton>
                    <!-- <VButton size="w120" type="primary">去还款</VButton> -->
                  </div>
                </el-card>
                <el-pagination
                  class="f-pageination"
                  @size-change="handleSizeChanges"
                  @current-change="handleCurrentChanges"
                  :current-page="page.currentPages"
                  :page-size="page.pagerSizes"
                  :page-sizes="[10,20,30,50]"
                  layout="prev,pager,next,sizes,total,jumper"
                  :total="page.totals"
                ></el-pagination>
              </el-tab-pane>
            </el-tabs>
            <div class="u-edge">{{page.readmark}}</div>
            <span
              class="f-noread u-tableBtn"
              @click="changeStatus"
            >{{$t('NOTIFICATION.CLEAR_UNREAD')}}</span>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <PopUp
      ref="dialog"
      width="980px"
      :show-close="true"
      :options="false"
      @confirm="confirm('dialog')"
      :confirmField="confirmField"
    >
      <div class="u-dialogP">
        <span>{{$t('NOTICE.BUSINESS_MESSAGE')}}</span>
      </div>
      <div class="u-content">
        <p class="u-title">{{detailObj.commonTitle}}</p>
        <p class="u-date">{{detailObj.createTime}}</p>
      </div>
      <div class="u-contents">{{detailObj.commonContent}}</div>
    </PopUp>
  </div>
</template>

<script>
import {
  MsgNotificationList,
  updateOneMsgMark,
  updateMultipleMsgMark,
  findMsgCount
} from '@/api/home.js';
import { createNamespacedHelpers } from 'vuex';
import { searchBySubmitter } from '@/api/authorizeCenter.js';
import _ from 'lodash';

const { mapActions, mapState, mapMutations } = createNamespacedHelpers('app');
import { getActiveClickArr } from '@/utils/index';
export default {
  data() {
    return {
      activeTabName: 'all',
      activeTabNames: 'alls',
      cardList: [],
      reedCardList: [],
      remark: true,
      page: {
        pagerSize: 10,
        currentPage: 0,
        pagerSizes: 10,
        currentPages: 0,
        total: 0,
        totals: 0,
        readmark: 0
      },
      noread: '',
      detailObj: {},
      confirmField: this.$t('COMMON.DETERMINE'),
      newCardLists: [],
      readMark: ''
    };
  },
  computed: {
    ...mapState(['lang']),
  },
  watch: {
    lang(n, o) {
      if (n) {
        this.getMsg();
      }
    }
    // lang()
  },
  mounted() {
    this.getNoread();
    this.getMsg();
  },
  created() {
    this.SET_LANG();
  },
  methods: {
    ...mapActions(['SET_LANG']),
    ...mapMutations(['setSliderMenus', 'setSliderMenusAct', 'setBreadcrumb']),

    handleClick(tab, event) {
      // if (tab.name == 'remark') {
      //   // this.getNored()
      // }else if(tab.name =='alls'){
      // }
    },
    getNoread() {
      findMsgCount({
        // customerNo: '202112280001',
        readMark: 0
        // userCode: 'INM001'
      }).then(res => {
        console.log(res, '条数');
        this.page.readmark = res;
      });
    },
    //获取未读消息
    getNored() {
      let params = {
        size: this.page.pagerSizes,
        current: this.page.currentPages,
        readMark: '0',
        language: this.lang
      };
      MsgNotificationList(params).then(res => {
        console.log(res, '未读');
        this.newCardLists = res.records;
        this.page.totals = res.total;
      });
    },
    // 获取全部消息
    async getMsg() {
      let params = {
        size: this.page.pagerSize,
        current: this.page.currentPage,
        readMark: '',
        language: this.lang
      };
      const res = await MsgNotificationList(params);
      console.log(res, '已读');
      let cardList = res.records;
      let arr = [];
      for (let i = 0; i < cardList.length; i++) {
        if (cardList[i].readMark == 0) {
          arr.push(cardList[i]);
          this.newCardLists = arr;
        }
      }
      if (this.newCardLists.length !== 0) {
        this.page.totals = this.newCardLists.length;
      }
      console.log(this.lang,'lang')
      res.records.forEach(item => {
        switch (this.lang) {
          case 'zh-CN':
            this.$set(item, 'commonTitle', item.scMessageTitle);
            this.$set(item, 'commonContent', item.scMessageText);
            return;
          case 'zh-HK':
            this.$set(item, 'commonTitle', item.tcMessageTitle);
            this.$set(item, 'commonContent', item.tcMessageText);
            return;
          case 'en':
            this.$set(item, 'commonTitle', item.enMessageTitle);
            this.$set(item, 'commonContent', item.enMessageText);
            break;
        }
      });
      this.cardList = res.records;
      console.log(this.cardList, 'cardList');
      this.page.total = res.total;
    },
    // 分页
    handleCurrentChange(currentPage) {
      console.log(currentPage, 'currentPage');
      this.page.currentPage = currentPage;
      this.getMsg();
    },
    handleSizeChange(size) {
      console.log(size, 'size');
      this.page.currentPage = '1';
      this.page.pagerSize = size;
      this.getMsg();
    },
    // 未读分页
    handleCurrentChanges(currentPage) {
      this.page.currentPages = currentPage;
      this.getMsg();
    },
    handleSizeChanges(size) {
      this.page.pagerSizes = size;
      this.page.currentPages = '1';
      this.getMsg();
    },
    // 获取详情
    async msgDetail(refName, row) {
      console.log(row, 'row');
      const res = await updateOneMsgMark({ mnId: row.mnId, language: this.lang });
      // if (res) {
      this.detailObj = row;
      this.$refs[refName].showDialog();
      this.getMsg();
      this.getNoread();
    },
    // 改变未读状态
    changeStatus() {
      updateMultipleMsgMark({
        customerNo: '',
        userCode: ''
      }).then(res => {
        this.getMsg();
        this.getNoread();
      });
    },
    // 去查看详情跳转
    toDetail(row) {
      console.log(row, 'row');
      let categoryCode = [
        '0901',
        '0902',
        '090301',
        '090302',
        '090401',
        '090402',
        '090403',
        '090404',
        '090405',
        '090406',
        '090501',
        '090502',
        '0906'
      ];
      if (categoryCode.indexOf(row.categoryCode) > -1) {
        console.log('存在');
        let params = {
          current: 1, //分页参数
          // authState: '0', //标识是未授权
          endTime: '', //条件：结束时间
          tcTransactionAbstract: {
            transactionType: '' //条件：交易类型
          },
          flowNo: row.flowNum,
          size: 10, //分页参数
          startTime: '', //条件：开始时间
          transType: '9' //1普通交易9管理台交易
        };
        console.log('提交人未授权数据参数', params);
        searchBySubmitter(params).then(res => {
          if (res && res.records.length > 0) {
            this.jumpFun(row, 0, res.records[0]);
          }
        });
      } else {
        console.log('不存');
        this.jumpFun(row, 1, '');
      }
    },
    async jumpFun(row, num, data) {
      console.log('row, num, data',row, num, data)
      let idNum = ''
      let menuCodeNum = ''
      if (num === 0) {
        idNum = '09'
        menuCodeNum = '090501'
      }else {
        idNum = '07'
        menuCodeNum = '0701'
      }
      let entType = localStorage.getItem('entType');
      const res = await updateOneMsgMark({ mnId: row.mnId });
      let menu = JSON.parse(localStorage.getItem('userMenus'));
      let menuItem = menu.filter(item => {
        return item.id === idNum;
      });
      this.$nextTick(() => {
        const breadcrumbList = getActiveClickArr(menuCodeNum);
        this.setBreadcrumb(breadcrumbList);
        this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
      });
      this.setSliderMenus(...menuItem);
      console.log(row, 'row11');
      if (num === 0) {
        data.authorizationType = 'MY_SUBMIT';
        console.log('0')
        this.$router.push({
          path: '/_businessManagement/authorizeCenter/detail',
          query: data
        });

      } else {
        console.log('1')

        this.$router.push({
          path: '/authorizeCenter/detail',
          query: {
            scene: 1,
            flowNo: row.flowNum,
            authState: 1
          }
        });
      }
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
  .u-tabs {
    margin-left: 24px;
    margin-top: 38px;
    margin-right: 24px;
    ::v-deep .el-tabs__item.is-active {
      // background: #f06b00;
      // background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
      color: #f06b00;
    }
  }
  .u-btn {
    display: flex;

    .u-span {
      display: block;
      color: #f06b00;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
    }
    .u-spans {
      color: rgba($color: #000000, $alpha: 0.45);
      font-size: 14px;
      font-weight: 400;
      line-height: 48px;
      padding-right: 21px;
      // line-height: 22px;
    }
  }
  .f-pageination {
    margin-top: 24px;
  }
  .u-cardList {
    margin-top: 12px;
    height: 158px;
    // border: 1px solid #000;
    box-shadow: 0 2px 9px 0 rgba($color: #000000, $alpha: 0.08);
    border-radius: 2px;
    .u-content {
      font-size: 14px;
      margin-top: 16px;
      margin-left: 24px;
      color: rgba($color: #000000, $alpha: 0.65);
      font-weight: 400;
    }
    .u-btn {
      display: flex;
      justify-content: flex-end;
      margin-right: 24px;
      margin-top: 24px;
    }
  }
  .u-cardListTop {
    background: rgba($color: #feaf03, $alpha: 0.06);

    height: 48px;
    display: flex;
    justify-content: space-between;
    .u-span {
      // margin: 0 26px;

      font-size: 16px;
      color: rgba($color: #000000, $alpha: 0.85);
      font-weight: 500;
      line-height: 48px;
    }
    // .u-spans {
    //   margin-left: 620px;
    // }
  }
  ::v-deep .el-card__body {
    padding: 0 !important;
  }
  ::v-deep .el-card__header {
    padding: 0 !important;
  }
  .m-tabs {
    ::v-deep .el-tabs__item {
      color: #f06b00;
    }
    ::v-deep .el-tabs__item.is-active {
      background: #f06b00;
      // background-image: linear-gradient(-45deg, #f06b00 0%, #feaf03 100%);
      color: #fff;
    }
    .el-tabs__item.is-active {
      color: #f06b00;
    }
    ::v-deep .el-tabs__header {
      border-bottom: 0;
      .el-tabs__nav {
        border: 1px solid #f06b00;
      }
    }
    ::v-deep .el-tabs__item {
      border-bottom: 0;
    }
  }
  .u-edge {
    position: absolute;
    top: -10px;
    left: 145px;
    z-index: 99;
    background: #f23f47;
    width: 24px;
    height: 24px;
    border: 1px solid #f23f47;
    border-radius: 50%;
    color: #fff;
    font-size: 14px;
    text-align: center;
    line-height: 24px;
  }
}
.u-dialogP {
  text-align: left;
  height: 46px;
  line-height: 46px;
  width: 960px;
  background: rgba($color: #feaf03, $alpha: 0.1);
  color: rgba($color: #000000, $alpha: 0.85);
  font-weight: 500;
  // padding-left: 75px;
  // padding-right: 24px;
  span {
    padding-left: 24px;
  }
}
.u-dialogP {
  text-align: left;
  height: 46px;
  line-height: 46px;
  width: 100%;
  background: rgba($color: #feaf03, $alpha: 0.1);
  color: rgba($color: #000000, $alpha: 0.85);
  font-weight: 500;
  // padding-left: 75px;
  // padding-right: 24px;
  span {
    padding-left: 24px;
  }
}
.u-content {
  display: flex;
  justify-content: space-between;
  width: 960px;
  .u-title {
    padding-left: 24px;
    padding-right: 24px;
    margin-top: 12px;
    text-align: left;
    color: rgba($color: #000000, $alpha: 0.85);
    font-weight: 500;
    font-size: 18px;
  }
  .u-date {
    margin-top: 12px;
    font-size: 14px;
    color: rgba($color: #000000, $alpha: 0.45);
    font-weight: 400;
    line-height: 22px;
    padding-right: 22px;
  }
}
.u-contents {
  text-indent: 2em;
  margin: 24px 15px;
  // height: 502px;
}
::v-deep .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}
.f-noread {
  color: #f06b00;
  position: absolute;
  top: 10px;
  left: 185px;
  font-size: 14px;
  cursor: pointer;
}
.m-emptyPage {
  width: 100%;
  height: 400px;
  border-bottom: 1px solid #ccc;
  .u-emptyImg {
    display: block;
    width: 180px;
    height: 180px;
    padding-top: 60px;
    margin: 0 auto;
  }
  .u-tips {
    padding-left: 46%;
    padding-top: 24px;
    color: #ccc;
  }
}
</style>