<!-- 首页最近转账记录和公告通知  -->
<template>
  <el-card class="card-layout">
    <div class="card-title">
      {{ isTransfer ? $t('HOME.RECENT_TRANSFER') : $t('HOME.ANNOUNCEMENT_NOTICE')}}
      <div class="more" @click="moreData(isTransfer)">{{$t('HOME.MORE')}}</div>
    </div>

    <div class="records">
      <div
        class="record"
        v-for="(item, key) of list"
        :key="key"
        @click="transferDetails(item, key+1)"
      >
        <div class="content">
          <div class="order" v-if="isTransfer">{{ `0${key + 1}` }}</div>
          <img
            v-show="!isTransfer"
            src="@/images/bankloda/noticeThree.png"
            :alt="isTransfer ? 'bank logo' : 'logo'"
            :class="
            ['img',isTransfer ? 'transferImg' : 'notiImg']
        "
          />
          <div class="info-wrapper">
            <div class="notiInfo">
              <p class="title">{{ item.commonTitle }}</p>
              <span class="sub-title" style="line-height:25px">{{ item.createTime }}</span>
            </div>
          </div>
        </div>

        <!-- 转账显示金额，通知显示箭头 -->
        <div
          v-if="isTransfer"
          :class="{ money: true, negative: item.class === 'negative' }"
        >{{ item.successfulTransactionAmount }}</div>
        <i v-else class="el-icon-arrow-right"></i>
      </div>
    </div>
    <PopUp
      ref="dialog"
      width="960px"
      @confirm="confirm"
      :options="false"
      :confirmField="confirmField"
    >
      <div class="u-dialogP">
        <span>{{$t(`NOTICE.ANNOUNCEMENT_DETAILS`)}}</span>
      </div>
      <div class="u-content">
        <p class="u-title">{{detailObj.commonTitle}}</p>
        <p class="u-date">{{detailObj.createTime}}</p>
      </div>
      <div class="u-contents">{{detailObj.commonContent}}</div>
    </PopUp>
  </el-card>
</template>

<script>
import { getActiveClickArr } from '@/utils';
import { createNamespacedHelpers } from 'vuex';

const { mapMutations, mapGetters } = createNamespacedHelpers('app');
let lang = localStorage.getItem('lang');
export default {
  name: 'CardLayout',
  props: {
    type: {
      type: String
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      deitailPopupFlag: false,

      detailObj: {},
    };
  },
  watch: {},
  computed: {
    ...mapGetters(['getSliderMenusAct', 'getActiveClickArr', 'getUserMenus']),
    isTransfer({ type }) {
      return type === 'transfer';
    },
    confirmField(){
      return this.$t('NOTICE.KNOW_IT')
    }
  },
  mounted() {
    console.log(this.list, 'list');
  },
  methods: {
    ...mapMutations(['setSliderMenus', 'setSliderMenusAct', 'setBreadcrumb']),

    //更多跳转
    moreData(isTransfer) {
      let self = this;
      let id = '030106';
      if (isTransfer) {
        let menuItem = this.getUserMenus.filter(item => {
          return item.id === '03';
        });
        self.$nextTick(() => {
          const breadcrumbList = getActiveClickArr(id, menuItem);
          self.setBreadcrumb(breadcrumbList);
          self.setSliderMenusAct(id);
        });
        self.setSliderMenus(menuItem);

        self.$router.push({
          path: '/bankTransfer/transferRecord/index'
          // query: { menutList: self.menuItem }
        });
      } else {
        //公告列表
        self.$router.push('/homePage/notice');
      }
    },
    //详细界面跳转
    transferDetails(transferObject, index) {
      transferObject.showDetail = true;
      console.log('transferObject', transferObject);
      if (transferObject.desc) {
        this.deitailPopupFlag = true;
      }

      if (!this.isTransfer) {
        this.detailObj = transferObject;
        this.$refs['dialog'].showDialog();
      } else {
        console.log(transferObject, 'item');
        this.moreData(this.isTransfer);
        this.$router.push({
          path: '/bankTransfer/transferRecord/index',
          query: {
            params: transferObject
          }
        });
      }
    },
    determine() {
      this.deitailPopupFlag = false;
    },

    confirm() {
      this.$refs['dialog'].closeHandle();
    }
    // async showDialog(refName, row) {
    //   this.detailObj = row;

    // }
  }
};
</script>

<style lang="scss" scoped>
.card-layout {
  display: flex;
  background-color: #fff;
  width: 406px;

  ::v-deep .el-card__body {
    padding: 20px;
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  .card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    font-weight: bold;
    font-size: 18px;
    .more {
      font-size: 14px;
      color: #999999;
      font-weight: lighter;
      font-weight: 400;
      cursor: pointer;
    }
    .more:hover {
      color: #999999;
      font-weight: 500;
    }
    .el-icon-more {
      color: #d8d8d8;
      font-size: 21px;
      cursor: pointer;
    }
  }

  .records {
    display: flex;
    flex-direction: column;
    flex: 1;
    // justify-content: space-between;
    overflow-y: auto;
  }

  .record {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    // padding: 14px 16px 0;
    margin-bottom: 14px;
    border-bottom: 1px solid #f6f6f6;

    .content {
      display: flex;
      align-items: center;
      // justify-content: space-between;
    }

    .order {
      margin-right: 25px;
      font-size: 25px;
      color: #ccc;
      font-weight: 700;
      background: #ffffff;
      border: 1px solid rgba(237, 237, 237, 0.71);
      width: 34px;
      height: 34px;
      line-height: 35px;
      box-shadow: 0 5px 10px 0 rgba(167, 167, 167, 0.12);
      border-radius: 8px;
      text-align: center;
    }

    .transferInfo {
      width: 152px;
    }
    .notiInfo {
      width: 210px;
    }

    .title {
      font-size: 14px;
      color: #333333;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .sub-title {
      font-size: 12px;
      color: rgba($color: #000000, $alpha: 0.65);
    }

    &:hover {
      box-shadow: 0 13px 16px 0 rgba(0, 0, 0, 0.06);
      background: #ffffff;
      border-radius: 8px;
      cursor: pointer;
    }
  }
  .record:hover {
    box-shadow: 0 13px 16px 0 rgba(0, 0, 0, 0.06);
    background: #ffffff;
    border-radius: 8px;
    cursor: pointer;
  }


  .transferImg {
    width: 40px;
    height: 40px;
    margin-right: 15px;
  }

  .notiImg {
    width: 44px;
    height: 44px;
    margin-right: 12px;
  }

  .negative {
    // color: #00cf95;
    color: #4181fa;
  }
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
  padding: 22px 32px 0 32px;
}
::v-deep .el-dialog__headerbtn .el-dialog__close {
  display: none;
}

.title_time {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  font-weight: 400;
  text-align: right;
}
.detail_conten {
  width: 916px;
  height: 502px;
  margin-top: 20px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  text-align: justify;
  line-height: 22px;
  font-weight: 400;
  overflow-y: auto;
}
.button_div {
  padding: 24px 0;
  text-align: center;
}
.button_deter {
  width: 210px;
  height: 36px;
  border-radius: 4px;

  background-image: linear-gradient(
    -45deg,
    #f06b00 0%,
    #feaf03 100%,
    #feaf03 100%
  );
  color: #ffffff;
  font-size: 16px;
  text-align: center;
  font-weight: 400;
  line-height: 0;
}
.u-dialogP {
  text-align: left;
  height: 46px;
  line-height: 46px;
  width: 960px;
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
  width: 960px;
  .u-title {
    padding-left: 24px;
    padding-right: 24px;
    margin-top: 22px;

    text-align: left;
    color: rgba($color: #000000, $alpha: 0.85);
    font-weight: 500;
    font-size: 18px;
  }
  .u-date {
    margin-top: 22px;
    font-size: 14px;
    // width: 340px;
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
  max-width: 960px;
  max-height: 440px;
  overflow-x:hidden;
}
::v-deep .el-dialog--center .el-dialog__body {
  padding: 0 !important;
}
</style>