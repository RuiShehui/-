<template>
  <div>
      <transactionDetail :type="type" @golist="goList" :dataone="dataone" :flowNo="flowNo" :res="res"></transactionDetail>
  </div>
</template>

<script>
import transactionDetail from './components/transactionDetail';
export default {
    
    components: {
        transactionDetail
    },
    data() {
        return {
            type: "",
            dataone:{},
            flowNo:"",
            res:{}
        }
    },
    created() {
        console.log('状态类型',this.$route.query);
        this.dataone = this.$route.query
        this.type = this.$route.query.type
        this.res = this.$route.query.res
        console.log('this.type',this.type);
    },
    methods: {
        goList() {
            this.$router.go(-1)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>