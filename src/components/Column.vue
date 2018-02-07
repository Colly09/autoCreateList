<template>
   <div :style="style">
    {{value}}
    <div v-for="item in multiple" :style="item.style">{{item.val}}</div>
   </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Column',
  data () {
    return {
      style: '',
      value: '',
      id:'',
      multiple: [],
      timeObj: null,
    }
  },
  props:[ 'config', 'row'],
  watch: {
    'row': {
      handler: function (data) {
        this.multiple = [];
        this.checkShow(data);
      },
      deep: true
    },
  },
  methods: {
    checkShow(data){
      //this.id = "column_" + data.id + '_' + data[this.config.prop];
      if(this.config.color){
        this.style += "color:"+this.config.color+';';
      }
      let _data = Object.assign({}, data);
      switch(this.config.format){
        case 'diy':
          this.diy(_data, this.config.prop);
        break;
        case 'interval':
          this.interval(_data, this.config.prop);
        break;
        case 'switch':
          this.switch(_data, this.config.prop);
        break;
        case 'multiple':  
          let num = 0;
          for(let i of this.config.props){
            if(i.indexOf(',') > 0){
              let ar = i.split(',');
              if(ar[2]){
                this.multiple.push({});
                this[ar[2]](_data, ar[0], num, ar);
              }else{
                this.multiple.push({val: _data[ar[0]], style:'color:'+ar[1]+';'});
              }
            }else{
              this.multiple.push({val: _data[i]})
            }
            num ++;
          }
        break;
        default:
          this.value = _data[this.config.prop];
        break;
      }
    },
    diy(_data, prop, mult = false, multInfo = null){
      let val = this.$format(prop, _data);
      this.formatVal(val, mult, multInfo);
    },
    switch(_data, prop, mult = false, multInfo = null){
      let val = this.config.case[_data[prop]];
      this.formatVal(val, mult, multInfo);
    },
    interval(_data, prop, mult = false, multInfo = null){
      if(this.timeObj){
        clearInterval(this.timeObj);
      }
      let remain_timer = _data[prop];
      this.timeObj = setInterval(()=>{
        let val = '';
        if (remain_timer > 86400) {
          let tmp_day = parseInt(remain_timer / 86400);
          let hour = parseInt((remain_timer - tmp_day * 86400) / 3600);
          val = tmp_day + '天' + hour + '小时';
        } else {
          let hour = parseInt(remain_timer / 3600);
          let minute = parseInt((remain_timer - hour * 3600) / 60);
          let seconds = remain_timer - hour * 3600 - minute * 60;
          if(!hour){
            val = minute + '分' + seconds + '秒';
          }else{
            val = hour + '小时' + minute + '分' + seconds + '秒';
          }
        }
        this.formatVal(val, mult, multInfo);
        remain_timer -= 1;
        if (remain_timer <= 0) {
          clearInterval(this.timeObj);
        }
      }, 1000);
    },
    formatVal(val, mult, multInfo){
      if(mult === false){
        this.value = val;
      }else{
        let style = '';
        if(multInfo[1]){
          style = 'color:'+multInfo[1]+';';
        }
        this.multiple.splice(mult, 1, {val: val, style: style});
      }
    }
  },
  created(){
    this.checkShow(this.row)
  },
  computed: {
    ...mapGetters({

    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
