<template>
<el-container>
  <el-header style="height:auto;text-align:left;">
    <SearchForm />
  </el-header>
  
  <el-main>
    <List />
  </el-main>
</el-container>
  
</template>

<script>
import SearchForm from './SearchForm'
import List from './List'


export default {
  name: 'Index',
  data () {
    return {
    }
  },
  created(){
  },
  components:{
    'SearchForm': SearchForm,
    'List': List
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
