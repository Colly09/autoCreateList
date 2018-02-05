<template>
  <div>
    <el-table
      :data="tableData"
      ref="multipleTable"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      size="mini"
      border 
      v-loading="loading">
      <el-table-column type="selection" width="55" v-if="selection" ></el-table-column>
      <el-table-column v-for="item in listConfig" :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" :sortable="item.sortable" >
        <template slot-scope="scope">
          <Column :config="item" :row="scope.row"/>
        </template>
      </el-table-column>

      <el-table-column label="操作" v-if="operate">
        <template slot-scope="scope">
          <Operate :operateList="operateList" :row="scope.row"/>
        </template>
      </el-table-column>
    </el-table>

    <!--<el-button @click="toggleSelection()">取消选择</el-button> -->
    <div style="margin-top: 20px" v-if="selection">
        <el-button round v-for="button in batchOperateList" :type="button.color" :key="button.action" :size="button.size" @click="handleBatchListClick(button)">{{button.label}}</el-button>
    </div>

   
    <div style="float:right; margin-top:10px">
      <el-pagination
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :current-page="nowPage"
        layout="total, prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Operate from './Operate'
import Column from './Column'

export default {
  name: 'List',
  data () {
    return {
      tableData: [],
      listConfig: [],
      operate: false,
      selection: false,
      operateList: [],
      multipleSelection: [],
      batchOperateList:[],
      pageSize: 20,
      total: 0,
      nowPage: 1,
      loading:true,
      sort:{
        prop:null,
        order:'asc'
      },
      search:{}
    }
  },
  components:{
    'Operate': Operate,
    'Column' : Column
  },
  watch: {
    'storeTableData': {
      handler: function (data) {
        this.loading = false;
        this.tableData = data;
      },
      deep: true
    },
    'storePageData': {
      handler: function (data) {
        this.pageSize = parseInt(data.pageSize);
        this.total = parseInt(data.total);
        this.nowPage = data.nowPage;
      },
      deep: true
    },
    'storeOperateData':{
      handler: function (data) {
        if(data.type == 'link'){
          this.goLink(data.link, data.data);
        } else if(data.type == 'operate'){
          this.handleListClick(data.button, data.data);
        }
      },
      deep: true
    },
    'storeSearchData':{
      handler: function (data) {
        this.nowPage = 1;
        this.search = data;
        console.log('storeSearchData change')
        this.getList();
      },
      deep: true
    }
  },
  methods: {
    sortChange(data){
      console.log(data)
      this.sort.prop = data.prop
      this.sort.order = data.prop ? data.order.replace('ending','') : null;
      this.nowPage = 1;
      this.getList();
      return;
    },
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    handleListClick(button, data){
      console.log(button, data);
      if(button.confirm){
        this.$confirm(button.confirm, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doAction(button, data)
        }).catch(() => {        
        });
      }else{
        this.doAction(button, data)
      }
    },
    handleBatchListClick(button){
      if(this.multipleSelection.length > 0){
        if(button.prop){
          let data = [];
          for(let i of this.multipleSelection){
            data.push(i[button.prop]);
          }
          this.handleListClick(button, data);
        }else{
          this.handleListClick(button, this.multipleSelection);
        }
      }else{
        this.$confirm('请选择需要操作的数据', '提示', {
          confirmButtonText: '确定',
          showCancelButton:false,
          type: 'error'
        }).catch(() => {        
        });
      }
    },
    doAction(button, data){
      if(button.type == 'ajax'){
        if(!this.$selfConfig.ajaxUri){
          this.$confirm('请配置操作请求地址[Config.ajaxUri]', '提示', {
            confirmButtonText: '确定',
            showCancelButton:false,
            type: 'error'
          }).catch(() => {        
          });
          return;
        }
        let post = {
          act: button.action,
          ajaxUri: this.$selfConfig.ajaxUri,
          data: JSON.stringify(data)
        }
        this.$store.dispatch('doAjax', post).then(body=>{
          this.handleBody(body);
        });
      }else{
        window.operate(button.action, data);
      }
    },
    goLink(link, data){
      if(data){
        let par=/\{([^\}]+)\}/g;
        let res = link.match(par);
        for(let i of res){
          let str = i.replace('{','').replace('}','');
          link = link.replace(i, data[str]);
        }
      }
      window.open(link)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleBody(body){
      if(body.code != 1000){
        this.$confirm(body.msg , '提示', {
          confirmButtonText: '确定',
          showCancelButton:false,
          type: 'error'
        }).catch(() => {        
        });
      }else{
        this.$confirm(body.msg , '提示', {
          confirmButtonText: '确定',
          showCancelButton:false,
          type: 'success'
        }).catch(() => {        
        });
      }
    },
    handleCurrentChange(val) {
      this.nowPage = val;
      this.getList();
    },
    getList() {
      this.loading = true;
      if(!this.$selfConfig.dataUri){
        this.$confirm('请配置数据接口请求地址[Config.dataUri]', '提示', {
          confirmButtonText: '确定',
          showCancelButton:false,
          type: 'error'
        }).catch(() => {        
        });
        return;
      }
      let data = {
            'nowPage': this.nowPage,
            'pageSize': this.pageSize,
            'order':this.sort,
            'search':this.search
          }
      this.$store.dispatch('getTableData', {
        ajaxUri: this.$selfConfig.dataUri, 
        data: JSON.stringify(data)
      })
    }
  },
  created(){
    this.listConfig = this.$selfConfig.listConfig.title;
    if(this.$selfConfig.listConfig.operate && this.$selfConfig.listConfig.operate.length > 0){
      this.operate = true;
      this.operateList = this.$selfConfig.listConfig.operate;
    }

    if(this.$selfConfig.listConfig.batchConfig && this.$selfConfig.listConfig.batchConfig.length > 0){
      this.batchOperateList = this.$selfConfig.listConfig.batchConfig;
      this.selection = true;
    }

    if(this.$selfConfig.listConfig.pageSize){
      this.pageSize = this.$selfConfig.listConfig.pageSize;
    }

    this.getList();
  },
  computed: {
    ...mapGetters({
      storeTableData: 'tableData',
      storePageData: 'pageData',
      storeOperateData: 'operateData',
      storeSearchData: 'searchData'
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
