<!--
 * @Author: zhangcheng
 * @Date: 2022-04-11 14:27:33
 * @LastEditTime: 2022-05-20 16:17:43
 * @LastEditors: zhangcheng
 * @Description: 我的商户清单
 * @FilePath: \ss-cibs-prc-custpc\src\views\authorizeCenter\components\cardList\cardList060102.vue
-->
<template>
  <!-- 我的商户清单 -->
  <card-list-left :title="$t('AUTHORIZE.MY_BILLS')" :state="item.authState">
    <template slot="first">
      <!-- 商户名称 -->
      <div>
        <span>{{$t('AUTHORIZE.merchantName')}}</span>
        <span>{{cardData.merchantName}}</span>
      </div>
      <!-- 账单类别 -->
      <div>
        <span>{{$t('AUTHORIZE.billTypeInfo')}}</span>
        <span>{{cardData.billTypeInfo}}</span>
      </div>
    </template>
    <template slot="second">
      <!-- 商户类别 -->
      <div>
        <span>{{$t('AUTHORIZE.merchantTypeInfo')}}</span>
        <span>{{cardData.merchantTypeInfo}}</span>
      </div>
    </template>
    <template slot="third">
      <!-- 提交时间 -->
      <div>
        <span>{{ $t('COMMON.SUBMIT_TIME') }}：</span>
        <span>{{ item.createTime }}</span>
      </div>
      <!-- 操作类型 -->
      <div>
        <span>{{$t('AUTHORIZE.operation')}}:</span>
        <span>{{item.operationType | operationTypeFilter}}</span>
      </div>
    </template>
  </card-list-left>
</template>

<script>
import { cardListMixin } from '@auth/service/mixins';
import filters from '@/filters/public';
export default {
  name: 'CardList060101',
  mixins: [cardListMixin],
  filters: {
    ...filters
  },
  created() {
    const lang = localStorage.getItem('lang');
    this.cardData.merchantTypeInfo =
      lang == 'zh-CN'
        ? this.cardData.merchantTypeInfo
        : lang == 'zh-HK'
        ? this.cardData.merchantTypeInfoZht
        : this.cardData.merchantTypeInfoEn;
    this.cardData.billTypeInfo =
      lang == 'zh-CN'
        ? this.cardData.billTypeInfo
        : lang == 'zh-HK'
        ? this.cardData.billTypeInfoZht
        : this.cardData.billTypeInfoEn;
    this.cardData.merchantName =
      lang == 'zh-CN'
        ? this.cardData.merchantName
        : lang == 'zh-HK'
        ? this.cardData.merchantNameZht
        : this.cardData.merchantNameEn;
  }
};
</script>