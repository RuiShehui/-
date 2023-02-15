<template>
  <el-container class="container">
    <div class="banner-box">
      <el-carousel :interval="4000" class="carousel" :autoplay="true">
        <el-carousel-item v-for="(item,index) of carouselList" :key="index">
          <img class="banner" @click="toOthers(item.url)" :src="item.img" :alt="item" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <el-container class="cash-flow">
      <el-card class="assets">
        <div class="img_div" style="padding-top:20px">
          <span class="title">{{ $t('HOME.ASSET_VIEW') }}</span>
          <img
            style=" position: absolute;width: 20px; z-index:999"
            :src="isEye ? eyeOn : eyeOff"
            @click="eyeClick"
          />
        </div>
        <div v-loading="chartsLoading" class="chart" id="chart" v-if="isEye ? eyeOn : eyeOff"></div>
        <el-tooltip placement="top">
          <div slot="content">
            {{ $t('HOME.INVESTMENT') }}
            <br />
            {{ $t('HOME.STOCK_ACCOUNT') }}
          </div>
          <div class="questionIcon">
            <img
              src="@/images/home/homeQ.png"
              style="width:14px;position: absolute;top: -15px;left: -5px; "
            />
          </div>
        </el-tooltip>
      </el-card>
      <!-- 最近转账记录列表 -->
      <recent-card-list :transferList="transferList" />
    </el-container>

    <el-container class="second-row">
      <!-- 底部信息表格 -->
      <el-card class="info-table">
        <el-tabs v-model="activeName" @tab-click="handleClick" :class="lang=='en'?'u-tabs':''">
          <el-tab-pane
            :label="
              `${$t('HOME.UPCOMING_TASKS')}(${todoTotal ? todoTotal : 0}${this.$t('HOME.TOTAL_NUMBER')})`
            "
            name="todoList"
          >
            <todo-list v-if="activeName === 'todoList'" :table-data="todoList" />
          </el-tab-pane>

          <el-tab-pane
            :label="
              `${$t('HOME.DRAFT_TRANSACTION')}(${
                newListLengthTotal ? newListLengthTotal : 0
              }${this.$t('HOME.TOTAL_NUMBER')})`
            "
            name="draftTransaction"
          >
            <DraftTransaction v-if="activeName === 'draftTransaction'" :table-data="draftList" />
          </el-tab-pane>
          <el-tab-pane
            :label="
              `${$t('HOME.MESSAGE_NOTIFICATION')}(${msgTotal ? msgTotal : 0}${this.$t('HOME.TOTAL_NUMBER')})`
            "
            name="transactionReminder"
          >
            <transaction-reminer
              class="transaction-box"
              v-if="activeName === 'transactionReminder'"
              :table-data="transactionList"
            />
          </el-tab-pane>
        </el-tabs>
        <div
          class="more"
          @click="moreData"
          v-if="activeName !== 'draftTransaction'"
        >{{ $t('HOME.MORE') }}</div>
      </el-card>

      <card-layout class="notification" type="notification" :list="notificationList" />
    </el-container>
  </el-container>
</template>

<script>
import * as echarts from 'echarts';
import { changePasswordDialog } from '@/components/messageBox/index.js';
import {
  CardLayout,
  TodoList,
  Announcement,
  DraftTransaction,
  TransactionReminer,
  RecentCardList
} from './';
import { getActiveClickArr } from '@/utils';
import tool from '@/dataTools/tools/moneyTools.js';
import {
  findBankNoticeInfoList,
  TransactionDraftPageList,
  MsgNotificationList,
  findAssetsViewDetail, // 资产视图接口
  searchByAuthorizer // 待办任务
} from '@/api/home';
import { recentTransferListQuery } from '@/api/paymentRemittance';
import combineUtils from '@/dataTools/tools';
import { createNamespacedHelpers } from 'vuex';
import _ from 'lodash';
import { safeGetLocalStorage } from '@/utils';
const { mapMutations, mapGetters, mapState } = createNamespacedHelpers('app');
// const lang = localStorage.getItem('lang');

const { getYMD, getNearDay } = combineUtils;

export default {
  name: 'HomeMain',
  components: {
    // Announcement,
    // 待办任务
    TodoList,
    // 交易草稿
    DraftTransaction,
    // 消息提醒
    TransactionReminer,
    // 最近转账记录
    RecentCardList,
    // 公告通知
    CardLayout
  },
  data() {
    return {
      carouselList: [
        {
          img:require('@/images/home/home_banner1.png'),
          url:"12"
        },
        {
          img:require('@/images/home/home_banner.jpg'),
          url:"123"
        }
      ],
      eyeOff: require('../../images/accountManage/biyan.png'),
      eyeOn: require('../../images/accountManage/kaiyan.png'),
      isEye: true,
      // 下方表格tabs栏选择框
      activeName: 'todoList',
      statues: false,
      chart: null,
      // 图表option
      investmentTotalAmount: '', //投资
      fixedDepositTotalAmount: '', //定期存款
      casaTotalAmount: '', //CASA存款
      assetsAll: '*****',

      // 最近转账列表
      transferList: [],
      // 公告通知列表
      notificationList: [],

      // 待办任务+总数
      todoList: [],
      todoTotal: '',

      // 交易草稿+总数
      draftList: [],
      msgTotal: '',

      // 消息提醒
      transactionList: [],
      newListLengthTotal: '',

      chartsLoading: false,
      isShow: false
    };
  },
  computed: {
    ...mapState(['lang']),
    ...mapGetters(['getSliderMenusAct', 'getActiveClickArr'])
  },
  watch: {
    // 切换语言
    lang(n, o) {
      if (n) {
        this.NoticeInfoList();
        this.getMsg();
        if (this.isEye) {
          this.yeinItChart();
        } else {
          this.initChart();
        }
      }
    }
  },
  methods: {
    ...mapMutations(['setSliderMenus', 'setSliderMenusAct', 'setBreadcrumb']),
    // 显示/隐藏资产视图金额
    async getAssetsViewDetail() {
      this.chartsLoading = true;
      await findAssetsViewDetail()
        .then(res => {
          this.casaTotalAmount = res.casaTotalAmount;
          this.fixedDepositTotalAmount = res.fixedDepositTotalAmount;
          this.investmentTotalAmount = res.investmentTotalAmount;
          this.eyeClick();
        })
        .catch(err => {
          this.assetsAll = '0';
          this.isEye = false;
          this.changeZero();
          this.chartsLoading = false;
        });
    },
    eyeClick: _.throttle(function() {
      this.chartsLoading = true;
      this.assetsAll =
        this.casaTotalAmount +
        this.fixedDepositTotalAmount +
        this.investmentTotalAmount;
      var assetsAll = this.assetsAll.toString();
      this.assetsAll = this.moneyCheck(assetsAll);
      console.log(this.assetsAll, 'this.assetsAll');
      // this.chartsLoading = true;
      this.isEye = !this.isEye;
      if (this.isEye) {
        // 判断是否有值
        if (this.assetsAll !== 0) {
          console.log(2);
          this.yeinItChart();
          this.chartsLoading = false;
        } else {
          console.log(1);
          this.yeinItChart();
          this.chartsLoading = false;
        }
      } else {
        // 闭眼展示
        this.chartsLoading = true;
        this.assetsAll =
          this.casaTotalAmount +
          this.fixedDepositTotalAmount +
          this.investmentTotalAmount;
        if (this.assetsAll == 0) {
          this.assetsAll = '*****';
          this.changeZero();
          this.chartsLoading = false;
        } else {
          this.assetsAll = '*****';
          this.initChart();
          this.chartsLoading = false;
        }
      }
    }, 500),

    // 资产为0echarts
    changeZero() {
      this.chart = echarts.init(document.getElementById('chart'));
      var option = {
        color: ['#c0c0c0'],
        legend: {
          top: 10,
          right: 20,
          // left: 'right',
          icon: 'circle',
          itemWidth: 10,
          itemGap: 20,
          orient: 'vertical'
        },
        title: {
          text: this.$t('HOME.TOTAL_ASSETS'),
          subtext: this.assetsAll,
          left: '45%',
          // top: 'center',
          top: '50%',
          textStyle: {
            color: '#666666',
            fontSize: 12,
            fontWeight: 400,
            textalign: 'center'
          },
          subtextStyle: {
            fontSize: 10,
            color: '#333333',
            fontWeight: 700,
            textalign: 'center'
          }
        },
        series: [
          {
            name: this.$t('HOME.TOTAL_ASSETS'),
            type: 'pie',
            radius: ['38%', '50%'],
            center: ['50%', '55%'],
            startAngle: 20,
            selectedMode: 'single',
            clockwise: false,
            avoidLabelOverlap: false,
            itemStyle: {
              shadowOffsetY: 10,
              shadowBlur: 16
            },
            label: {
              show: false,
              formatter: function(p) {
                return `${formatterNum(p.value)}\n${p.name}(${p.percent}%)\n\n`;
              },
              align: 'center',
              position: 'outside',
              lineHeight: 18,
              rich: {
                value: {
                  fontSize: 14,
                  // align: 'left',
                  fontWeight: 700,
                  fontFamily: 'DINAlternate-Bold',
                  color: '#333333'
                  // lineHeight: 24,
                },
                name: {
                  fontSize: 12,
                  color: '#696969',
                  fontWeight: 400
                }
              }
            },
            labelLine: {
              show: true,
              length2: 40,
              maxSurfaceAngle: 80,
              showAbove: true
            },
            data: [
              {
                // value: '350.00',
                value: 0,
                name: this.$t('HOME.INVSET'),
                itemStyle: {
                  shadowColor: 'rgba(93, 08, 233, 0.31)',
                  color: {
                    type: 'linear',
                    colorStops: [
                      { offset: 0, color: '#7367f0' },
                      { offset: 1, color: '#bf7eff' }
                    ]
                  }
                }
              },
              {
                // value: '650.00',
                value: 0,
                name: this.$t('HOME.DEPOSIT'),
                // selected: true,
                itemStyle: {
                  shadowColor: 'rgba(69, 97, 250, .38)',
                  color: {
                    type: 'linear',
                    colorStops: [
                      { offset: 0, color: '#60a8f8' },
                      { offset: 1, color: '#3e58fb' }
                    ]
                  }
                }
              },
              {
                // value: '450.00',
                value: 0,
                name: this.$t('HOME.CASA_DEPOSIT'),
                itemStyle: {
                  shadowColor: 'rgba(249, 139, 250, .4)',
                  color: {
                    type: 'linear',
                    colorStops: [
                      { offset: 0, color: '#f57e00' },
                      { offset: 1, color: '#f4a101' }
                    ]
                  }
                }
              }
            ]
          }
        ]
      };
      var opt = option.series[0];
      lineHide(opt);
      function lineHide(opt) {
        console.log(opt.data, 'data');
        opt.data.forEach(item => {
          if (item.value == 0) {
            item.name = '';
          }
        });
      }
      function formatterNum(str) {
        console.log(str, 'str');
        if (str.length <= 3) {
          return str;
        }
        if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(str)) {
          return str;
        }
        var a = RegExp.$1,
          b = RegExp.$2,
          c = RegExp.$3;
        var re = new RegExp();
        re.compile('(\\d)(\\d{3})(,|$)');
        while (re.test(b)) {
          b = b.replace(re, '$1,$2$3');
        }
        return a + '' + b + '' + c;
      }
      this.chart.setOption(option);
    },
    // 睁眼echarts
    yeinItChart() {
      this.chart = echarts.init(document.getElementById('chart'));
      var option = {
        color: ['#4861fb', '#fb962e', '#f78610'],
        legend: {
          top: 5,
          right: 15,
          // left: 'right',
          icon: 'circle',
          itemWidth: 10,
          itemGap: 20,
          orient: 'vertical'
        },
        title: {
          text: this.$t('HOME.TOTAL_ASSETS'),
          subtext: '$' + this.assetsAll,
          left: 'center',
          // top: 'center',
          top: '55%',
          textStyle: {
            color: '#666666',
            fontSize: 12,
            fontWeight: 400,
            textAlign: 'center'
          },
          subtextStyle: {
            fontSize: 10,
            color: '#333333',
            fontWeight: 700,
            textAlign: 'center'
          }
        },
        series: [
          {
            name: this.$t('HOME.TOTAL_ASSETS'),
            type: 'pie',
            radius: ['38%', '50%'],
            center: ['50%', '60%'],
            startAngle: 20,
            selectedMode: 'single',
            clockwise: false,
            avoidLabelOverlap: false,
            itemStyle: {
              shadowOffsetY: 10,
              shadowBlur: 16
            },
            label: {
              show: true,
              formatter:
                // '{value|{' + 'c}}\n{name|{b} ({d}%)}\n\n',
                function(p) {
                  return `${tool.currencyFormat(p.value)}\n${p.name}(${
                    p.percent
                  }%)\n\n`;
                },
              align: 'left',
              position: 'outside',
              lineHeight: 14,
              rich: {
                value: {
                  fontSize: 14,
                  // align: 'left',
                  fontWeight: 700,
                  fontFamily: 'DINAlternate-Bold',
                  color: '#333333'
                  // lineHeight: 24,
                },
                name: {
                  fontSize: 12,
                  color: '#696969',
                  fontWeight: 400
                }
              }
            },
            labelLine: {
              show: true,
              length2: 20,
              maxSurfaceAngle: 80,
              showAbove: true
            },
            data: [
              {
                // value: '350.00',
                value: this.investmentTotalAmount
                  ? this.investmentTotalAmount
                  : null,
                name: this.$t('HOME.INVSET'),
                itemStyle: {
                  shadowColor: 'rgba(93, 08, 233, 0.31)',
                  color: {
                    type: 'linear',
                    colorStops: [
                      { offset: 0, color: '#7367f0' },
                      { offset: 1, color: '#bf7eff' }
                    ]
                  }
                }
              },
              {
                // value: '650.00',
                value: this.fixedDepositTotalAmount
                  ? this.fixedDepositTotalAmount
                  : null,
                name: this.$t('HOME.DEPOSIT'),
                // selected: true,
                itemStyle: {
                  shadowColor: 'rgba(69, 97, 250, .38)',
                  color: {
                    type: 'linear',
                    colorStops: [
                      { offset: 0, color: '#60a8f8' },
                      { offset: 1, color: '#3e58fb' }
                    ]
                  }
                }
              },
              {
                // value: '450.00',
                value: this.casaTotalAmount ? this.casaTotalAmount : null,
                name: this.$t('HOME.CASA_DEPOSIT'),
                itemStyle: {
                  shadowColor: 'rgba(249, 139, 250, .4)',
                  color: {
                    type: 'linear',
                    colorStops: [
                      { offset: 0, color: '#f57e00' },
                      { offset: 1, color: '#f4a101' }
                    ]
                  }
                }
              }
            ]
          }
        ]
      };
      var opt = option.series[0];
      lineHide(opt);
      function lineHide(opt) {
        console.log(opt.data, 'data');
        opt.data.forEach(item => {
          if (item.value == null) {
            item.name = '';
          }
        });
      }
      function formatterNum(str) {
        console.log(str, 'str');
        if (str.length <= 3) {
          return str;
        }
        if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(str)) {
          return str;
        }
        var a = RegExp.$1,
          b = RegExp.$2,
          c = RegExp.$3;
        var re = new RegExp();
        re.compile('(\\d)(\\d{3})(,|$)');
        while (re.test(b)) {
          b = b.replace(re, '$1,$2$3');
        }
        return a + '' + b + '' + c;
      }
      this.chart.setOption(option);
    },
    // 闭眼echarts
    initChart() {
      this.chartsLoading = true;
      this.chart = echarts.init(document.getElementById('chart'));
      var option = {
        color: ['#4861fb', '#fb962e', '#f78610'],
        legend: {
          top: 5,
          right: 15,
          // left: 'right',
          icon: 'circle',
          itemWidth: 10,
          itemGap: 20,
          orient: 'vertical'
        },
        title: {
          text: this.$t('HOME.TOTAL_ASSETS'),
          subtext: '$' + this.assetsAll,
          left: 'center',
          // top: 'center',
          top: '55%',
          textStyle: {
            color: '#666666',
            fontSize: 12,
            fontWeight: 400,
            textAlign: 'center'
          },
          subtextStyle: {
            fontSize: 10,
            color: '#333333',
            fontWeight: 700,
            textAlign: 'center',
            left: '20%'
          }
        },

        series: [
          {
            name: this.$t('HOME.TOTAL_ASSETS'),
            type: 'pie',
            radius: ['38%', '50%'],
            center: ['50%', '60%'],
            startAngle: 20,
            // minAngle:10,
            selectedMode: 'single',
            clockwise: false,
            avoidLabelOverlap: false,
            itemStyle: {
              shadowOffsetY: 10,
              shadowBlur: 16
            },
            label: {
              show: true,
              formatter: '{value|*****}\n{name|{b} (**%)}\n\n',
              align: 'left',
              position: 'outside',
              lineHeight: 18,
              rich: {
                value: {
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: 'DINAlternate-Bold',
                  color: '#333333'
                },
                name: {
                  fontSize: 12,
                  color: '#696969',
                  fontWeight: 400
                }
              }
            },
            labelLine: {
              show: true,
              length2: 20,
              maxSurfaceAngle: 80,
              showAbove: true
            },
            data: [
              {
                value: this.investmentTotalAmount
                  ? this.investmentTotalAmount
                  : null,
                // value: 200,
                name: this.$t('HOME.INVSET'),
                itemStyle: {
                  shadowColor: 'rgba(93, 08, 233, 0.31)',
                  color: {
                    // type: 'linear',
                    colorStops: [
                      { offset: 0, color: '#7367f0' },
                      { offset: 1, color: '#bf7eff' }
                    ]
                  }
                },
                label: {
                  show: function() {
                    if (
                      !this.investmentTotalAmount ||
                      this.investmentTotalAmount == 0
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  }
                }
              },
              {
                value: this.fixedDepositTotalAmount
                  ? this.fixedDepositTotalAmount
                  : null,
                // value: 7000,
                name: this.$t('HOME.DEPOSIT'),
                itemStyle: {
                  shadowColor: 'rgba(69, 97, 250, .38)',
                  color: {
                    type: 'linear',
                    colorStops: [
                      { offset: 0, color: '#60a8f8' },
                      { offset: 1, color: '#3e58fb' }
                    ]
                  }
                },
                label: {
                  show: function() {
                    if (
                      !this.fixedDepositTotalAmount ||
                      this.fixedDepositTotalAmount == 0
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  }
                }
              },
              {
                value: this.casaTotalAmount ? this.casaTotalAmount : null,
                name: this.$t('HOME.CASA_DEPOSIT'),
                itemStyle: {
                  shadowColor: 'rgba(249, 139, 250, .4)',
                  color: {
                    type: 'linear',
                    colorStops: [
                      { offset: 0, color: '#f57e00' },
                      { offset: 1, color: '#f4a101' }
                    ]
                  }
                },
                label: {
                  show: function() {
                    if (!this.casaTotalAmount || this.casaTotalAmount == 0) {
                      return false;
                    } else {
                      return true;
                    }
                  }
                }
              }
            ]
          }
        ]
      };
      var opt = option.series[0];
      lineHide(opt);
      function lineHide(opt) {
        opt.data.forEach(item => {
          if (item.value == null) {
            item.name = '';
          }
        });
      }
      this.chart.setOption(option);
      this.chartsLoading = false;
    },
    handleClick(tab, event) {},
    // 更多
    moreData() {
      if (this.activeName == 'todoList') {
        let menu = JSON.parse(localStorage.getItem('userMenus'));
        let menuItem = menu.filter(item => {
          return item.id === '07';
        });
        this.$nextTick(() => {
          const breadcrumbList = getActiveClickArr('0701');
          this.setBreadcrumb(breadcrumbList);
          this.setSliderMenusAct(breadcrumbList[breadcrumbList.length - 1].id);
        });
        this.setSliderMenus(...menuItem);
        this.$router.push('/authorizeCenter/waitAuth');
      } else if (this.activeName == 'transactionReminder') {
        this.$router.push('/homePage/tips');
      }
    },

    // 公告提醒
    async NoticeInfoList() {
      let params = {
        current: 1,
        size: 10,
        title: ''
      };
      let list = await findBankNoticeInfoList(params);
      if (list.records) {
        list.records.forEach(item => {
          // 根据三语言取不同的值
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
      }

      this.notificationList = list.records ? list.records : [];
      if (this.notificationList.length < 3) {
        this.notificationList.length = this.notificationList.length;
      } else {
        this.notificationList.length = 3;
      }
    },
    // 交易草稿
    async getList() {
      let params = {
        current: 0,
        size: 0
      };
      let newList = [];
      const res = await TransactionDraftPageList(params);
      if (res && res.records) {
        newList = res.records;
        this.newListLengthTotal = res.total;
        this.draftList = newList;
      } else {
        this.draftList = [];
        this.newListLengthTotal = 0;
      }
    },
    // 消息提醒
    async getMsg() {
      let params = {
        size: '',
        current: '',
        readMark: 0
        // language: lang
      };
      const res = await MsgNotificationList(params);
      console.log(res, 'resres');
      if (res && res.records) {
        res.records.forEach(item => {
          // 根据三语言取不同的值
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
      }
      if (res && res.records) {
        this.transactionList = res.records;

        this.msgTotal = res.total;
        if (this.msgTotal > '99') {
          this.msgTotal = '99+';
        }
        this.transactionList.length = 5;
      } else {
        this.transactionList = [];
        this.msgTotal = 0;
      }
    },

    // 最近转账记录
    async findTransferList() {
      const endDate = getYMD(),
        startDate = getNearDay(endDate, -30);
      let params = {
        current: 1,
        size: 10,
        endDate,
        startDate
      };
      const { records = [] } = await recentTransferListQuery(params);
      if (records) {
        this.transferList = records
          .map(item => {
            const { detail = '{}' } = item;
            return {
              ...JSON.parse(detail),
              ...item
            };
          })
          .slice(0, 3);
      }
    },
    //待办任务
    async gettodotasksList() {
      let params = {
        current: 0,
        tcAuthQueue: {
          businessCode: '',
          userCode: ''
        },
        size: 20
      };
      const res = await searchByAuthorizer(params);
      console.log(this.todoList, 'todoList');
      if (res && res.records) {
        this.todoList = res.records;
        if (this.todoList.length > 5) {
          this.todoList.length = 5;
        }
        this.todoTotal = res.total;
      } else {
        this.todoList = [];
        this.todoTotal = 0;
      }
    },

    //  金币格式化
    moneyCheck(val) {
      let value = val
        .replace(/[^\d.]/g, '')
        .replace(/^0\d+|^\./g, '')
        .replace(/\.{2,}/g, '.')
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
        .replace(/^(\d+)\.(\d\d).*$/, '$1.$2')
        .replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
      return value;
    },
    // 轮播图跳转
    toOthers(url){
      console.log(url,'url')
    }
  },

  mounted() {
    let needPwdModify = sessionStorage.getItem('needPwdModify');
    // 判断是否是90天未修改密码
    if (needPwdModify == 'true') {
      changePasswordDialog({
        title: this.$t('COMMON.TIPS'),
        type: 'warn',
        message: this.$t('HOME.PASSWORD_IMMEDIATELY'),
        btnText: {
          cancleText: this.$t('COMMON.CONFIRM'),
          confirmText: this.$t('HOME.CHANGE_NOW')
        },
        isCancle: false,
        overLoad: false,
        tipsMe: false
      }).then(() => {
        let idArr = {
          parent: '14',
          children: ['1401', '1402', '1403']
        };
        // 获取菜单
        let mentArr = safeGetLocalStorage('userMenusAll');
        let parentArr = [];
        let childrenArr = [];
        parentArr = mentArr.filter(x => x.menuCode === idArr.parent);
        childrenArr = mentArr.filter(x => idArr.children.includes(x.menuCode));
        parentArr[0].children = childrenArr;
        this.setSliderMenusAct(parentArr[0].children[0].menuCode);
        this.$nextTick(() => {
          // 获取面包屑
          const breadcrumbList = [parentArr[0], parentArr[0].children[0]];
          this.setBreadcrumb(breadcrumbList);
        });
        this.setSliderMenus(parentArr[0].children);
        this.$router.push({
          path: '/user/resetPassword'
        });
        sessionStorage.setItem('needPwdModify', 'false');
      });
    }
    this.getList();
    this.getAssetsViewDetail();
    this.NoticeInfoList();
    this.getMsg();
    this.findTransferList();
    this.gettodotasksList();
  }
};
</script>

<style lang="scss" scoped>
$gap: 24px;
.el-container {
  display: block;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-direction: row;
  -webkit-box-flex: 1;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;
}

.container {
  .banner-box {
    width: 1108px;
    margin-bottom: 12px;
    border-radius: 6px;
    overflow: hidden;
  }

  .carousel img {
    width: 100%;
    height: 170px;
  }
  .questionIcon {
    position: absolute;
    top: 200px;
    left: 56.5%;
    color: #f4a101;
  }
  .cash-flow {
    width: 100%;
    display: flex;

    .assets {
      // flex: 0 0 490px;
      width: 632px;
      min-height: 373px;
      margin-right: 12px;
      background: #fff;
      position: relative;
      .img_div {
        font-size: 18px;
        position: absolute;
        padding-left: 20px;
        img {
          cursor: pointer;
        }
      }
      .chart {
        height: 100%;
      }

      p {
        position: absolute;
        top: 24px;
        left: 20px;
      }

      ::v-deep .el-card__body {
        padding: 0;
        height: 100%;
      }
    }

    .transfer {
      width: 462px;
      height: 316px;
    }
  }

  .title {
    font-size: 18px;
    color: #333333;
    // text-align: justify;
    font-weight: bold;
  }

  .active {
    box-shadow: 0 13px 16px 0 #ebeef2;
  }

  /****************** second */

  .second-row {
    display: flex;
    width: 100%;
    // justify-content: space-between;
    margin-top: 12px;
  }

  .info-table {
    position: relative;
    display: flex;
    // width: 100%;
    width: 690px;
    // height: 352px;
    margin-right: 12px;
    ::v-deep {
      .el-table::before {
        display: none;
      }
      .el-tabs__item.is-active {
        // color: #f06b00 !important;
        color: rgba($color: #000000, $alpha: 0.85);
      }
      .el-tabs__item:hover {
        color: #f06b00 !important;
      }
      .el-tabs__header {
        margin-bottom: 0;
        border-bottom: 1px solid #f6f6f6;
        // text-align: center;
      }

      .el-tabs__nav-wrap::after {
        content: none;
      }

      .el-card__body {
        padding: 0;
        width: 100%;
      }

      .el-tabs__active-bar {
        height: 3px;
        background-color: #f06b00 !important;
        border-radius: 3px;
      }

      .el-tabs__nav-scroll {
        padding-left: 20px;
      }

      .el-tabs__item {
        height: 60px;
        line-height: 60px;
      }

      .el-tabs__item.is-active {
        font-weight: 500;
      }
    }
  }
  .more {
    position: absolute;
    top: 25px;
    right: 24px;
    font-size: 14px;
    color: #999999;
    cursor: pointer;
    // font-weight: lighter;
  }
  .more:hover {
    color: #999999;
  }
  ::v-deep .el-carousel__arrow--right {
    right: 16px !important;
  }
}
.u-tabs {
  ::v-deep .el-tabs__nav-scroll {
    max-width: 480px;
    padding-left: 0px !important;
  }
  ::v-deep .el-tabs__nav-prev {
    line-height: 70px !important;
  }
  ::v-deep .el-tabs__nav-next {
    line-height: 70px !important;
  }
}
</style>
<style lang="scss">
.container {
  .banner-box {
    .el-carousel__container {
      height: 170px !important;
    }

    .is-active .el-carousel__button {
      background-color: #ff710e;
    }
    .el-carousel__button {
      width: 12px;
      height: 4px;
      border-radius: 4px;
    }
    // ::v-deep .el-carousel__arrow--right{
    //   right: 35px !important;
    // }
  }
  .transaction-box {
    thead {
      .el-table__cell {
        text-align: center;
      }
    }
  }
}
</style>
