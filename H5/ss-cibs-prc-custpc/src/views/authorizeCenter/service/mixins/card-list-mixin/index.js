/*
 * @Author: zhangcheng
 * @Date: 2022-05-20 11:08:53
 * @LastEditTime: 2022-05-20 11:15:17
 * @LastEditors: zhangcheng
 * @Description: Do not Edit
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\service\mixins\card-list-mixin\index.js
 */

import CardListLeft from '@auth/components/cardList/CardListLeft.vue';

export default {
  props: {
    item: {
      type: Object,
      default () {
        return {};
      }
    }
  },
  components: {
    CardListLeft
  },
  data() {
    return {
      cardData: {}
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (JSON.stringify(this.item) !== '{}') {
        if (this.item.transactionType === '0303') {
          this.cardData = this.item.transactionDescribe.transDetail;          
        }else {
          this.cardData = this.item.transactionDescribe;          
        }
      }
    }
  }
};