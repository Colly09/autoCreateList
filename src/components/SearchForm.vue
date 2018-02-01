<template>
  <el-form :inline="true" :model="form" ref="myForm" class="demo-form-inline left" style="padding-top:10px;" @submit.native.prevent>
  <div v-for="field in formField" style="float:left" >
    <el-form-item v-if="field.type == 'select'" :label="field.label" size="mini" :required="field.required">
      <el-select :placeholder="field.placeholder" v-model="form[field.inputNum]" >
        <el-option
            v-for="item in options[field.prop]"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
      </el-select>
    </el-form-item>

    <el-form-item v-if="field.type == 'input'" :label="field.label" size="mini" :required="field.required">
      <el-input v-model="form[field.inputNum]" :placeholder="field.placeholder" ></el-input>
    </el-form-item>

    <el-form-item v-if="field.type == 'datetime'" :label="field.label" size="mini" :required="field.required">
      <el-date-picker
        v-model="form[field.inputNum]"
        type="datetime"
        :format="field.format"
        :placeholder="field.placeholder">
      </el-date-picker>
    </el-form-item>

    <el-form-item v-if="field.type == 'datetimerange'" :label="field.label" size="mini" :required="field.required">
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

     <el-form-item v-if="field.type == 'date'" :label="field.label" size="mini" :required="field.required" >
      <el-date-picker
        size="mini"
        v-model="form[field.inputNum]"
        :format="field.format"
        type="date"
        :placeholder="field.placeholder">
      </el-date-picker>
    </el-form-item>

    <el-form-item v-if="field.type == 'daterange'" :label="field.label" size="mini" :required="field.required"  >
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

    <el-form-item v-if="field.type == 'checkbox'"  size="mini" >
      <el-checkbox v-model="form[field.inputNum]" :label="field.label" border></el-checkbox>
    </el-form-item>
  </div>
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
        1:null,
        2:null,
        3:null,
        4:null,
        5:null,
        6:null,
        7:null,
        8:null,
        9:null,
        10:null,
        11:null,
        12:null,
        13:null,
        14:null,
        15:null,
        16:null,
        17:null,
        18:null,
        19:null,
        20:null,
      },
      required:[],
      options:{},
      formField:[],
      operateList:[]
    }
  },
  methods: {
    search(){
      console.log(this.required);
      let data = {};
      for(let field of this.formField){
        data[field.prop] = this.form[field.inputNum];
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
      console.log(data);
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
        if(field.type == "datetimerange" || field.type == "daterange"){
          if(field.value[0]){
            field.value[0] = new Date(field.value[0]);
          }
          if(field.value[1]){
            field.value[1] = new Date(field.value[1]);
          }
        }
        if(field.type == "datetime" || field.type == "date"){
          if(field.value){
            field.value = new Date(field.value);
          }
        }
        if(field.value){
          this.form[inputNum] = field.value;
        }
        if(field.type == "select"){
          this.options[field.prop] = field.options;
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
