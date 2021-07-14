<template>
  <div class="province">
     <van-cell clickable key="全国"   @click="remover()">
     	   <van-checkbox v-model="checkedm">全国</van-checkbox>
     </van-cell>
       <van-index-bar>
         <van-cell-group v-for="(titem, index) in ptype">
          <van-index-anchor :index="`${titem}`" style="text-align: left; background-color: #D3D3D3;" />
         <van-checkbox-group v-model="result">
           <van-cell-group>
             <van-cell
				v-if="item.AreaChar == titem"
               v-for="(item, index) in contentdata"
               clickable
               :key="index"

               @click="toggle(index,item.AreaName)"
             >
                 <van-checkbox :name="item" ref="checkboxes">{{item.AreaName}}</van-checkbox>
             </van-cell>
           </van-cell-group>
         </van-checkbox-group>
         </van-cell-group>
       </van-index-bar>

  </div>
</template>

<script>
import { baseURL } from '../util/config'  
  export default {
      data(){
         return {
              list: ['a', 'b'],
              result: [],
			  presult:[],
              contentdata:[],
              ptype:[],
              checked: true,
			  checkedm:false,
            };
      },
      methods:{
        getprovince:function(){
          let that = this;
          that.$axios.post(baseURL +'api/Area/GetArea', {
            })
            .then(function (response) {
               that.contentdata=JSON.parse(response.data);
               JSON.parse(response.data).forEach((item,index)=>{
                 that.ptype.push(item.AreaChar);
               })
              that.ptype= Array.from(new Set(that.ptype))
            })
            .catch(function (error) {
              console.log(error);
            });
        },

        toggle(index,item) {
            this.checkedm=false;
            if(this.presult.indexOf("全国")==0){
              this.presult.shift();
            }

           this.$refs.checkboxes[index].toggle();
           this.presult.push(item);
        },
        remover(){
          this.checked=false;
          this.result=[];
          this.presult=[];
          this.presult.push("全国");
        },
      },

      created() {
        this.getprovince()
      }
  }
</script>

<style scoped>
  .province{
    height: 100%;
    width: 100%;
    margin: 0 auto;
    margin-top: 0.5rem;
  }
  .van-index-anchor{
    font-size: 25px;
   text-align:left !important;
    background-color: whitesmoke !important;
  }
  .van-cell{
    text-align: left;
  }
</style>
