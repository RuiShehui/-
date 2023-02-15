<template>
  <div class="main">
    <div class="tabs">
      <div class="labels">
        <div
          v-for="(item, index) in labels"
          :key="index"
          :class="['static', item.className, labelsCurrentIdx === index ? 'active' : '']"
          @click="onTabClick(index)"
        >
          <div class="text">
            <img v-if="labelsCurrentIdx === index" :src="item.src" />
            <div>{{ item.label }}</div>
            <span class="label" v-if="labelsCurrentIdx !== index">
              <span class="tips">{{ item.infoNum }}</span>
            </span>
          </div>
          <div v-if="labelsCurrentIdx === index" class="hat"></div>
        </div>
      </div>
      <div class="more" @click="lookMore">{{ this.$t("MENU_PAGE_ITEMS.LOOK_MORE") }}</div>
    </div>
    <div class="show-table">
      <el-table
        :data="labelsCurrentIdx===0?missionList:mySubmittedList"
        :header-cell-style="{fontSize: 16+'px',color: 'rgba(0,0,0,0.25)'}"
      >
        <el-table-column width="100" :label="$t(`COMMON.SERIAL_NUMBER`)" type="index"></el-table-column>
        <el-table-column min-width="300" :label="$t(`CUSTOMER_MANAGEMENT.TRANSACTION_NAME`)">
          <template slot-scope="scope">{{ scope.row.bizType + '-' + scope.row.operType }}</template>
        </el-table-column>
        <el-table-column min-width="300" :label="$t(`HOME.SUBMITTER`)" prop="userRealName"></el-table-column>
        <el-table-column min-width="300" :label="$t(`HOME.SUBMIT_TIME`)" prop="submitTime"></el-table-column>
        <el-table-column min-width="120" v-if="labelsCurrentIdx!==0" label=" " prop="authOpinion">
          <template slot-scope="scope">
            <span
              v-if="scope.row.authStatus==='REJECT'"
              class="reject"
            >{{ $t('AUTHORIZATION_CENTER.REFUSE') }}</span>
          </template>
        </el-table-column>
        <el-table-column width="200" :label="$t(`COMMON.OPERATION`)" fixed="right">
          <template slot-scope="scope">
            <div class="fater">
              <div
                v-if="labelsCurrentIdx===0"
                class="operation"
                @click="authorization(scope.row)"
              >{{ $t('HOME.AUTHORZATION') }}</div>
              <div v-else class="operation" @click="details(scope.row)">{{ $t('HOME.DETAILS') }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="22" label=" "></el-table-column>
        <div slot="empty">
          <img src="@/img/table-empty.png" alt />
          <footer>{{ $t('CUSTOMER_MANAGEMENT.NO_DATA') }}</footer>
        </div>
      </el-table>
    </div>
  </div>
  <!-- <div class="m-mission">
      <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane label="AU">
          <el-badge slot="label" :value="missionList.length">
            <img class="u-imgIcon" :src="authorizationImg" />
            {{ $t(`HOME.SUBJECT_MY_AUTHORZATION`) }}
          </el-badge>
          <div class="m-conten" v-for="(item, index) in missionList" :value="item" :key="index">
            <div class="g-format-title">
              <header class="g-customer_management">
                <span>{{ item.bizType }}-</span>
                <span>{{ item.operType }}</span>
              </header>
              <div class="g-submitter">
                <span>{{ `${$t(`HOME.SUBMITTER`)} ${item.submitUserName}` }}</span>
                <span>{{ `${$t(`HOME.SUBMIT_TIME`)} ${item.submitTime}` }}</span>
              </div>
            </div>
            <div class="g-grant_but">
              <el-button class="u-but" @click="authorization(item)">
                {{
                $t(`HOME.AUTHORZATION`)
                }}
              </el-button>
            </div>
          </div>
          <div v-if="missionList.length === 0" class="g-empty">
            <img src="@/img/table-empty.png" alt />
            <span>{{ $t(`HOME.NO_AUTHORZATION`) }}</span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="MY">
          <el-badge slot="label" :value="mySubmittedList.length">
            <img class="u-imgIcon" :src="commitImg" />
            {{ $t(`HOME.ISUBMITTED`) }}
          </el-badge>
          <div class="m-conten" v-for="(item, index) in mySubmittedList" :value="item" :key="index">
            <div class="g-format-title">
              <div class="g-customer_management">
                <span>{{ item.bizType }}-</span>
                <span>{{ item.operType }}</span>
              </div>
              <div class="g-submitter">
                <span>{{ `${$t(`HOME.SUBMITTER`)} ${item.submitUserName}` }}</span>
              </div>
            </div>
            <div class="g-submit_time">
              <span>{{ `${$t(`HOME.SUBMIT_TIME`)} ${item.submitTime}` }}</span>
            </div>
            <div
              v-if="item.authStatus === $t('AUTHORIZATION_CENTER.REFUSE')"
              class="g-submit_reason"
            >
              <span>{{ $t(`HOME.REASON_FOR_REJECTION`) }}</span>
              <span style="word-break: break-all;white-space: normal">{{ item.authOpinion }}</span>
            </div>
            <div
              :class="
              item.authStatus === $t('AUTHORIZATION_CENTER.REFUSE') ? 'g-grant_but_reason' : 'g-grant_but'
            "
            >
              <el-button @click="details(item)" class="u-but">
                {{
                $t(`HOME.DETAILS`)
                }}
              </el-button>
            </div>
          </div>
          <div v-if="emptyFlag" class="g-empty">
            <img src="../../img/table-empty.png" alt />
            <span>{{ $t(`HOME.NO_AUTHORZATION`) }}</span>
          </div>
        </el-tab-pane>
      </el-tabs>
  </div>-->
</template>

<script>
import { getAuthDetail } from '@/api/home';
import { getAuthorizationDetail } from '@/api/authorization-center/index.js';
import { isType } from '@/utils/tools';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers('permission');

export default {
  name: 'MyMission',
  data() {
    return {
      // subjectAuthoriztionNumber: "15",
      // mySubmitNumber: '12',
      authorizationImg: require('@/img/home/shouye-test.png'), //待我授权图标
      commitImg: require('@/img/home/shouye-test.png'), //我提交的图标
      //待我授权数据数组
      missionList: [],
      //我提交的
      mySubmittedList: [],
      labelsCurrentIdx: 0
    };
  },
  computed: {
    ...mapGetters(['whiteList']),
    labels() {
      // <template> currentType.label === $t('HOME.SUBJECT_MY_AUTHORZATION') ? missionList : mySubmittedList </template>
      const labelList = [
        {
          className: 'static-left',
          src: require('@/img/indexPage/wait-auth1.png'),
          label: this.$t('HOME.SUBJECT_MY_AUTHORZATION'),
          infoNum: this.missionList.length,
          path: '/authorizationCenter/subjectAuthorization'
        },
        {
          className: 'static-right',
          src: require('@/img/indexPage/submit1.png'),
          label: this.$t('HOME.ISUBMITTED'),
          infoNum: this.mySubmittedList.length,
          path: '/authorizationCenter/mySubmit'
        }
      ].filter(item => this.whiteList.some(path => item.path === path));

      return labelList;
    },
    currentType() {
      return this.labels[this.labelsCurrentIdx];
    },
    showList() {
      if (this.currentType.label === this.$t('HOME.SUBJECT_MY_AUTHORZATION')) {
        return this.missionList;
      } else {
        return this.mySubmittedList;
      }
    }
  },
  watch: {
    labelsCurrentIdx(newVal) {
      const type = newVal === 1 ? 'MY' : 'AU';
      this.handleClick(type);
    },
    whiteList() {
      this.labelsCurrentIdx = 0;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    onTabClick(crtIdx) {
      this.labelsCurrentIdx = crtIdx;
    },
    lookMore() {
      this.$router.push(this.currentType.path);
    },
    init() {
      let self = this;
      // self.subjectAuthoriztionNumber = self
      self.getMission();
      self.missionList = [];
      self.mySubmittedList = [];

      this.$eventBus.$on('changeRole', data => {
        self.getMission();
        self.missionList = [];
        self.mySubmittedList = [];
      });
    },
    //tabs标签页切换
    handleClick(tab) {
      // console.log('打印tab：', tab.label, event);
      getAuthDetail({ authType: tab }).then(({ body }) => {
        if (body && isType(body, 'Array')) {
          if (tab === 'AU') {
            this.missionList = body;
          }
          if (tab === 'MY') {
            this.mySubmittedList = body;
          }
        }
      });
    },
    //进入页面加载数据
    getMission() {
      let self = this;
      getAuthDetail({ authType: 'AU' }).then(resp => {
        const { body = [] } = resp;
        if (Array.isArray(body) && body.length) {
          // body.forEach(auItem => {
          //   CONSTANTS.BIZ_CODE_TYPE_LIST.forEach(item => {
          //     if (auItem.bizTypeCode === item.value) {
          //       // auItem.bizType = item.label;
          //     }
          //   });
          // });
          self.missionList = resp.body;
          console.log(self.missionList);
        }
      });
      getAuthDetail({ authType: 'MY' }).then(resp => {
        const { body = [] } = resp;
        if (Array.isArray(body) && body.length) {
          // body.forEach(auItem => {
          //   CONSTANTS.BIZ_CODE_TYPE_LIST.forEach(item => {
          //     if (auItem.bizTypeCode === item.value) {
          //       // auItem.bizType = item.label;
          //     }
          //   });
          // });
          self.mySubmittedList = resp.body;
        }
      });
    },

    //待授权——授权
    authorization(item) {
      getAuthorizationDetail({ flowNum: item.flowNum }).then(resp => {
        console.log('打印resp：', resp);
        if (resp.body) {
          resp.body.homePage = 'homePage';
          this.$router.push({
            path: '/authorizationCenter/subjectAuthorization/ditail',
            query: resp.body
          });
        }
      });
    },
    //我提交的——详情
    details(item) {
      getAuthorizationDetail({ flowNum: item.flowNum }).then(resp => {
        console.log('打印resp：', resp);
        if (resp.body) {
          resp.body.homePage = 'homePage';
          this.$router.push({
            path: '/mySubmit/ditail',
            query: resp.body
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.tabs {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .labels {
    cursor: pointer;
    height: 47px;
    display: flex;
    align-items: flex-end;
    background: #fff;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    > div {
      padding: 0 64px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .static {
      background: #eaeaea;
      text-align: center;
      white-space: nowrap;
      height: 47px;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.45);
      position: relative;
      > .text {
        min-width: 114px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
      > img {
        width: 34px;
        height: 34px;
        margin-right: 8px;
      }
      .hat {
        width: 100%;
        height: 8px;
        background-color: #f06b00;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        position: absolute;
        top: -8px;
        left: 0;
      }
      &.static-left {
        border-top-left-radius: 10px;
        border-bottom-right-radius: 20px;
      }
      &.static-right {
        border-top-right-radius: 10px;
        border-bottom-left-radius: 20px;
      }
      &.active {
        font-size: 20px;
        font-weight: 500;
        color: #f06b00;
        height: 52px;
        background: #fff;
      }
      .label {
        width: 0px;
        height: 0px;
        display: inline-block;
        position: relative;
        .tips {
          position: absolute;
          display: inline-block;
          left: 4px;
          top: -14px;
          height: 16px;
          background-color: #e01f1f;
          padding: 1px 6px;
          box-sizing: border-box;
          font-size: 12px;
          color: #fff;
          border-radius: 4px;
          border-bottom-left-radius: 0px;
        }
      }
    }
  }
  .more {
    font-size: 16px;
    color: #999;
    margin-right: 32px;
    position: relative;
    cursor: pointer;
  }
  .more::after {
    content: '';
    display: block;
    width: 7.2px;
    height: 1.2px;
    background: #999;
    transform: rotate(45deg);
    position: absolute;
    right: -13px;
    top: 9.2px;
  }
  .more::before {
    content: '';
    display: block;
    width: 7.2px;
    height: 1.2px;
    background: #999;
    transform: rotate(-45deg);
    position: absolute;
    right: -13px;
    top: 14.2px;
  }
}
.show-table {
  padding: 0 44px;
  box-sizing: border-box;
  background: white;
  width: 100%;
  ::v-deep .el-table__cell {
    padding: 24px 0px;
  }
}

.operation {
  padding: 0 24px;
  box-sizing: border-box;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 16px;
  border: #f06b00 1px solid;
  color: #f06b00;
  cursor: pointer;
}
.operation:hover {
  background-color: #fef0e6;
}
.fater {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.reject {
  font-size: 14px;
  padding: 0 12px;
  line-height: 28px;
  height: 28px;
  color: #e01f1f;
  display: inline-block;
  background-color: #feecec;
  border-radius: 4px;
}
</style>
