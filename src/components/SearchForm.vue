<template>
  <el-form :inline="true" :model="form" ref="myForm" class="demo-form-inline left" style="padding-top:10px;" @submit.native.prevent>

    <el-form-item v-for="field in formField" :key="field.prop"  v-if="field.type == 'select'" :label="field.label" size="mini" :required="field.required">
      <el-select :placeholder="field.placeholder" v-model="form[field.inputNum]" @change="selectChange(field)" >
        <el-option
            v-for="item in options[field.inputNum]"
            :label="item.label"
            :key="item.value"
            :value="item.value">
          </el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-for="field in formField" :key="field.prop" v-if="field.type == 'input'" :label="field.label" size="mini" :required="field.required">
      <el-input v-model="form[field.inputNum]" :placeholder="field.placeholder" ></el-input>
    </el-form-item>

    <el-form-item v-for="field in formField" :key="field.prop" v-if="field.type == 'datetime'" :label="field.label" size="mini" :required="field.required">
      <el-date-picker
        v-model="form[field.inputNum]"
        type="datetime"
        :format="field.format"
        :placeholder="field.placeholder">
      </el-date-picker>
    </el-form-item>

    <el-form-item v-for="field in formField" :key="field.prop" v-if="field.type == 'datetimerange'" :label="field.label" size="mini" :required="field.required">
      <el-date-picker
        size="mini"
        v-model="form[field.inputNum]"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        :format="field.format"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>

    <el-form-item v-for="field in formField" :key="field.prop" v-if="field.type == 'date'" :label="field.label" size="mini" :required="field.required" >
      <el-date-picker
        size="mini"
        v-model="form[field.inputNum]"
        :format="field.format"
        type="date"
        :placeholder="field.placeholder">
      </el-date-picker>
    </el-form-item>

    <el-form-item v-for="field in formField" :key="field.prop" v-if="field.type == 'daterange'" :label="field.label" size="mini" :required="field.required"  >
      <el-date-picker
        size="mini"
        v-model="form[field.inputNum]"
        :format="field.format"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </el-form-item>

    <el-form-item v-for="field in formField" :key="field.prop" v-if="field.type == 'checkbox'"  size="mini" >
      <el-checkbox v-model="form[field.inputNum]" :label="field.label" border></el-checkbox>
    </el-form-item>



  <div style="clear:both;"></div>
  <div style="float:left;">
    <el-button v-for="button in operateList" round v-if="button.type == 'search'" @click="search()" :type="button.color" :key="button.action" :size="button.size" >{{button.label}}</el-button>
    <el-button v-for="button in operateList" round v-if="button.type == 'script' || button.type == 'ajax'" @click="handleListClick(button)" :type="button.color" :key="button.action" :size="button.size">{{button.label}}</el-button>
    <el-button v-for="button in operateList" round v-if="button.type == 'link'" @click="goLink(button.link)" :type="button.color" :key="button.action" :size="button.size" >{{button.label}}</el-button>
  </div>

  </el-form>
</template>

<script>
import { handleListClick } from '../common/action.js'
export default {
  name: 'SearchForm',
  data () {
    return {
      form:{
        1:null,2:null,3:null,4:null,5:null,6:null,7:null,8:null,9:null,10:null,11:null,12:null,13:null,14:null,15:null,16:null,17:null,18:null,19:null,20:null,
      },
      required:[],
      options:{
        1:null,2:null,3:null,4:null,5:null,6:null,7:null,8:null,9:null,10:null,11:null,12:null,13:null,14:null,15:null,16:null,17:null,18:null,19:null,20:null,
      },
      formField:[],
      operateList:[],
      selectParent:{
      }
    }
  },
  methods: {
    search(){
      let data = {};
      for(let field of this.formField){
        if(Object.prototype.toString.call(this.form[field.inputNum]) == '[object Array]'){
          data[field.prop] = this.form[field.inputNum].slice(0);
        }else{
          data[field.prop] = this.form[field.inputNum];
        }
        // 将时间转换为时间戳
        if(field.type == "datetimerange" || field.type == "daterange"){
          if(data[field.prop][0]){
            data[field.prop][0] = Math.floor(data[field.prop][0].getTime()/1000);
          }
          if(data[field.prop][1]){
            data[field.prop][1] = Math.floor(data[field.prop][1].getTime()/1000);
          }
        }
        if((field.type == "datetime" || field.type == "date") && data[field.prop] ){
          data[field.prop] = Math.floor(data[field.prop].getTime()/1000);
        }
        //判断必填
        if(this.required.indexOf(field.prop) >= 0){
          if(!data[field.prop]){
            let msg = field.label + '不能为空';
            this.$confirm(msg , '提示', {
              confirmButtonText: '确定',
              showCancelButton:false,
              type: 'error'
            }).catch(() => {        
            });
          }
        }
      }
      this.$store.commit('SET_SEARCH_DATA', data)
    },
    goLink(link){
      this.$store.commit('SET_OPERATE_DATA', {
        type: 'link',
        link: link,
        data: null
      })
    },
    handleListClick(button){
      this.$store.commit('SET_OPERATE_DATA', {
        type: 'operate',
        button: button,
        data: null
      })
    },
    getData(field){
      if(!field.uri){
        return;
      }
      let post = {
        ajaxUri: field.uri
      }
      this.$store.dispatch('doAjax', post).then(body=>{
        this.options[field.inputNum] = body.data;
      });
    },
    selectChange(field){
      if(this.selectParent[field.prop]){
        let val = this.form[field.inputNum];
        if(!val) return;
        for(let info of this.selectParent[field.prop]){
          let _info = Object.assign({}, info);
          _info.uri = info.uri + val;
          this.getData(_info);
        }
      }
    }
  },
  created(){
    if(this.$selfConfig.formConfig.operate && this.$selfConfig.formConfig.operate.length > 0){
      this.operateList = this.$selfConfig.formConfig.operate;
    }
    if(this.$selfConfig.formConfig.form){
      this.formField = this.$selfConfig.formConfig.form;
      let inputNum = 1;
      for(let i in this.formField){
        let field = this.formField[i];
        this.formField[i].inputNum = inputNum;
        field.inputNum = inputNum;
        if(field.type == "datetimerange" || field.type == "daterange"){
          if(field.value[0]){
            field.value[0] = new Date(field.value[0]);
          }
          if(field.value[1]){
            field.value[1] = new Date(field.value[1]);
          }
        }
        if((field.type == "datetime" || field.type == "date") && field.value ){
          field.value = new Date(field.value);
        }
        if(field.value){
          this.form[inputNum] = field.value;
        }
        if(field.type == "select"){
          this.options[inputNum] = field.options || [];
          if(field.parent){
            //组装级联选择器
            if(this.selectParent[field.parent]){
              this.selectParent[field.parent].push(field);
            }else{
              this.selectParent[field.parent] = [field];
            }
          } else if (field.uri){
            this.getData(field);
          }
          if(field.value){
            //如果有值 默认执行一次
            setTimeout(()=>{
               this.selectChange(field);
            },300)
          }
        }
        if(field.required){
          this.required.push(field.prop);
        }
        inputNum ++;
      }
    }
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
