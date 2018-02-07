<template>
   <div>
    <div v-for="button of selfOperateList" style="float:left; margin-right:5px;">
      <el-button v-if="button.type == 'script' || button.type == 'ajax'" @click="handleListClick(button, row)" type="text" size="small">{{button.label}}</el-button>
      <a v-if="button.type == 'link'" :href="button.link" target="_blank" class="el-button el-button--text el-button--small" style=" text-decoration: none;">{{button.label}}</a>
    </div>
   </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'Operate',
  data () {
    return {
      selfOperateList:[]
    }
  },
  props:[ 'operateList', 'row'],
  watch: {
    'row': {
      handler: function (data) {
        this.checkCanShow(data);
      },
      deep: true
    },
  },
  methods: {
    handleListClick(button, data){
      this.$store.commit('SET_OPERATE_DATA', {
        type: 'operate',
        button: button,
        data: data
      })
    },
    checkCanShow(data){
      let newOperateList = [];
      let par=/\{([^\}]+)\}/g;

      for(let a of this.operateList){
        let ok = true;
        if(a.type == "link"){
          let res = a.link.match(par);
          if(res){
            for(let i of res){
              let str = i.replace('{','').replace('}','');
              a.link = a.link.replace(i, data[str]);
            }
          }
        }

        if(a.condition){
          for(let c of a.condition){
            let flag = false;
            switch(c[1]){
              case 'eq':
                if(data[c[0]] == c[2]){
                  flag = true;
                }
              break;
              case 'neq':
                if(data[c[0]] != c[2]){
                  flag = true;
                }
              break;
              case 'gt':
                if(data[c[0]] > c[2]){
                  flag = true;
                }
              break;
              case 'gte':
                if(data[c[0]] >= c[2]){
                  flag = true;
                }
              break;
              case 'lt':
                if(data[c[0]] < c[2]){
                  flag = true;
                }
              break;
              case 'lte':
                if(data[c[0]] <= c[2]){
                  flag = true;
                }
              break;
              case 'in':
                if(c[2].indexOf(data[c[0]]) >= 0 ){
                  flag = true;
                }
              break;
              case 'between':
                if(data[c[0]] >= c[2] && data[c[0]] <= c[3] ){
                  flag = true;
                }
              break;
            }
            if(flag){
              ok = true;
            }else{
              ok = false;
              break;
            }
          }
        }
        if(ok){
          newOperateList.push(a);
        }
      }
      this.selfOperateList = newOperateList;
    }
  },
  created(){
    this.checkCanShow(this.row)
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
