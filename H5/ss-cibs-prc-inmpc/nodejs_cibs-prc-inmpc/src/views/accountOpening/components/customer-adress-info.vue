<!-- 地址信息 -->
<template>
  <div class="transverse-table">
    <div class="row">
      <div id="title">{{ $t('RAO_CHECK.ADRESS_INFO') }}</div>
    </div>
    <template v-if="checkType == '1' || checkType == '2'">
      <div class="row">
        <div class="w-100-bg-fff">{{ $t('RAO_CHECK.RESIDENTIAL_ADDRESS') }}</div>
      </div>
      <div class="row">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.COUNTRY') }}</div>
        <div>{{ valueToLabel(countryList, residenceAddress.country) }}</div>
      </div>
      <div class="row">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.ROOM_FLOOR_BLOCK') }}</div>
        <div>{{ residenceAddress.address1 }}
        </div>
      </div>
      <div class="row">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.BUILDING_ESTATE') }}</div>
        <div>{{ residenceAddress.address2 }}
        </div>
      </div>
      <div class="row">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.STREETNO_AND_STREETNAME') }}</div>
        <div>{{ residenceAddress.address3 }}
        </div>
      </div>
      <div class="row">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.DISTRICT') }}</div>
        <div>{{ residenceAddress.address4 }}
        </div>
      </div>
      <div class="row" v-if="residenceAddress.country === 'CN'">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.PROVINCE') }}</div>
        <div>{{ provinceObj[residenceAddress.address5] }}
        </div>
      </div>
      <div class="row">
        <div>{{ $t('RAO_CHECK.CORRESPOMDENCE_RESIDENTIAL_SAME') }}</div>
        <div>{{ addrSameAsCorrObj[addrSameAsCorr] }}</div>
      </div>
    </template>
    <template v-if="communicationAddressShow">
      <div class="row">
        <div class="w-100-bg-fff">{{ $t('RAO_CHECK.CORRESPOMDENCE_ADDRESS') }}</div>
        <!-- <div></div> -->
      </div>
      <div class="row">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.COUNTRY') }}</div>
        <div>{{ valueToLabel(countryList, communicationAddress.country) }}
        </div>
      </div>
      <div class="row">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.ROOM_FLOOR_BLOCK') }}</div>
        <div>{{ communicationAddress.address1 }}
        </div>
      </div>
      <div class="row">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.BUILDING_ESTATE') }}</div>
        <div>{{ communicationAddress.address2 }}
        </div>
      </div>
      <div class="row">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.STREETNO_AND_STREETNAME') }}</div>
        <div>{{ communicationAddress.address3 }}
        </div>
      </div>
      <div class="row">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.DISTRICT') }}</div>
        <div>{{ communicationAddress.address4 }}
        </div>
      </div>
      <div class="row" v-if="communicationAddress.country === 'CN'">
        <div>&nbsp;&nbsp;&nbsp;&nbsp;{{ $t('RAO_CHECK.PROVINCE') }}</div>
        <div>{{ provinceObj[communicationAddress.address5] }}
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import CONSTANTS from '@/utils/constant';
import dataDitionaryMixin from '@/mixins/dataDitionary-list'
const {
  NATIONAL_LIST
} = CONSTANTS;
export default {
  name: 'CustomerAdressInfo',
  components: {
  },
  mixins: [dataDitionaryMixin],
  props: {
    communicationAddress: {
      type: Object,
      default: () => {
        return {}
      }
    },
    residenceAddress: {
      type: Object,
      default: () => {
        return {}
      }
    },
    addrSameAsCorr: {
      type: String,
      default: ''
    },
    checkType: {
      type: String,
      default: ''
    }, // 审核类型 1 普通開戶审核 2 普通開戶查詢 3 eiao審核 4 eiao查詢
  },
  data() {
    return {
      countryList: NATIONAL_LIST, // 国家列表
      provinceObj: {}, // 省份
      addrSameAsCorrObj: {
        Y: this.$t('RAO_CHECK.SAME'),
        N: this.$t('RAO_CHECK.NO_SAME')
      },
    };
  },
  computed: {
    // 通讯地址显示
    communicationAddressShow() {
      return ['1', '2'].includes(this.checkType) ? this.addrSameAsCorr === 'N' : true
    }
  },
  created() {
    
  },

  async mounted() {
    // 省份
    this.provinceObj = await this.dataDitionaryListToObj('PROVINCE');
  },

  methods: {
    // value转label
    valueToLabel(list, val) {
      let label = '';
      list.forEach(item => {
        if(item.value === val) {
          label = item.label
        }
      });
      return label
    },
    // list to obj
    async dataDitionaryListToObj(otp) {      
      let list = await this.getDataDitionaryListMixin(otp)
      let obj = {};
      list.forEach(item => {
        obj[item.id] = item.value
      })
      return obj
    },
  }
};
</script>

<style lang="scss" scoped>
// .transverse-table {
//   margin-top: 25px;
// }
.f-w-340 {
  width: 340px;
}
.w-100-bg-fff{
  width: 100% !important;
  background-color: #fff !important;
}
</style>
