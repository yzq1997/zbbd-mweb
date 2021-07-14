<template>
  <div class="nav1">
    <van-form @submit="onSubmit">
      <div class="wraps">
           <div class="title">营业执照</div>
                 <div style="float:left;margin-left:0.5rem">
                     <div>
                         <div style="height:0.2rem;"></div>
                         <!-- <img src="https://webservice.jshcsoft.com//upload/UpLoadFile/uploadfiles/yyzz.jpg.png" class="images" alt=""> -->
                         <div v-for="(item,index) in imgTempList" :key="index" style="float:left;margin-right:0.2rem;position:relative;margin-left: 25%;">
                             <div v-if="true">
                                 <div class="deleteImg">
                                     <van-icon name="cross" size="12" @click="deleteImgs(index)"/>
                                 </div>
                                 <img :src="item.src" class="images" alt="">
                             </div>
                         </div>
                         <div class="fileBtn" v-if="imgTempList.length<1">
                             <input type="file" multiple accept="image/*" ref="files" @change="onChooseImage" id="files" />
                             <van-icon name="plus" size="20" />
                         </div>
                     </div>
                 </div>
      </div>
      <van-field
        v-model="firmname"
        name="firmname"
        label="公司名称"
        :rules="[{ required: true, message: '请填写公司名称' }]"
      />
      <van-field
        v-model="username"
        name="username"
        label="联系人"
        :rules="[{ required: true, message: '请填写联系人' }]"
      />
      <van-field
        v-model="tel"
        name="tel"
        label="手机号码"
        type="number"
        :rules="[{ pattern:/^1[3456789]\d{9}$/, message: '请输入正确手机号码' },{ required: true, message: '请填写手机号码' }]"
      />
      <van-field
        v-if="verification"
        v-model="code"
        name="code"
        clearable
        label="短信验证码"
        type="number"
        :rules="[{ required: true,pattern:/^[0-9]*$/, message: '请输入正确短信验证码' }]"
      >
        <template #button>
          <van-button size="small" :class="{disabled: !canClick}" type="primary" @click="getcode">
            <span class="van-button__text">{{yzinfo}}</span>
          </van-button>
        </template>
      </van-field>
      <!-- <span class="zhu">
        注：公司名称只能通过上传营业执照获取
      </span>-->
      <div style="margin: 1rem 16px">
        <van-button round block type="info" native-type="submit">完成</van-button>
      </div>
    </van-form>
    <!-- <van-overlay :show="show" >
      <div class="wrapper" @click.stop>
        <van-loading color="#1989fa" />图片上传中<van-loading type="spinner" color="#1989fa" />
      </div>
    </van-overlay> -->
  </div>
</template>

<script>
import { Toast,NavBar } from "vant";
import { formatDate } from "../../util/formatTen";
import Vue from "vue";
export default {
  data() {
    return {
      verification:false,  //是否出现验证验证码这一框
      firmname: "",
      username: "",
      code: "",
      tel: "",
      yzinfo: "发送验证码",
      totalTime: 60,
      canClick: true,
      value: "",
      fileList: [],
      load: false,
      imgTempList: [],
      route:false,
      yingyeimg:"",
      yingye:true
    };
  },
  methods: {
    onSubmit(values) {
      
      if (values.firmname.replace(/\s+/g, "").length == 0) {
        Toast.fail("公司名称为空!!!");
        return false;
      }
      if (values.username.replace(/\s+/g, "").length == 0) {
        Toast.fail("联系人为空!!!");
        return false;
      }

      if(this.verification){
      let that = this;
      let params = {};
      params.tele = this.tel;
      params.code = this.code;
      (params.type = "mqy"),
        that
          .$axios({
            method: "post",
            url: "https://webservice.jshcsoft.com/SSMSAPI/verifycode.ashx",
            data: that.qs.stringify(params)
          })
          .then(function(response) {
            if (response == true) {
                if(that.yingye === true){
                  that.UpdateMember(values);
                }else{
                  Toast.fail("当前上传营业执照模糊，请重新上传营业执照！");
                }
                // that.UpdateMember(values);
            } else {
              Toast.fail("验证码错误!!!");
            }
          });
      } else {
        if(this.yingye === true){
            this.UpdateMember(values);
        }else{
          Toast.fail("当前上传营业执照模糊，请重新上传营业执照！");
        }
          // this.UpdateMember(values);
      }
    },

    setTime() {
      if (!this.canClick) return; // 如果是false 直接return出去
      this.canClick = false;
      this.yzinfo = this.totalTime + "s后重新发送";
      let clock = window.setInterval(() => {
        this.totalTime--;
        this.yzinfo = this.totalTime + "s后重新发送";
        if (this.totalTime < 0) {
          window.clearInterval(clock);
          this.yzinfo = "重新发送验证码";
          this.totalTime = 60;
          this.canClick = true; // 这里重新开启
        }
      }, 1000);
    },

    //获取验证码
    getcode() {
      let that = this;
      if (this.tel.length == 11 && this.canClick == true) {
        let params = {};
        params.tele = this.tel;
        params.type = "mqy";
        that
          .$axios({
            method: "post",
            url: "https://webservice.jshcsoft.com/SSMSAPI/sendmessage.ashx",
            data: that.qs.stringify(params)
          })
          .then(function(response) {
            that.setTime();
          });
      }
    },

    UpdateMember(e) {
      let that = this;
      if(this.imgTempList.length == 0){
        Toast("请上传图片");
        return false
      }
      if (sessionStorage.getItem("subscribe_time") == null) {
        sessionStorage.setItem(
          "subscribe_time",
          formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
        );
      }
      that.$dataApi({
          url:"api/Users/UpdateMember",
          method: "POST",
          data: {
            openid: sessionStorage.getItem("openID"),
            sex: sessionStorage.getItem("sex"),
            language: sessionStorage.getItem("language"),
            city: sessionStorage.getItem("city"),
            province: sessionStorage.getItem("province"),
            country: sessionStorage.getItem("country"),
            headimgurl: sessionStorage.getItem("headimgurl"),
            subscribe_time: sessionStorage.getItem("subscribe_time"),
            remark: sessionStorage.getItem("remark"),
            IsUpdate: sessionStorage.getItem("IsUpdate"),
            nickname: sessionStorage.getItem("NickName"),
            presubscribe_time: sessionStorage.getItem("presubscribe_time"),
            Origin:1 ,
            EnterpriseName: e.firmname,
            LinkMan: e.username,
            LinkPhone: e.tel,
            licenseUrl: this.imgTempList[0].src,
            SourceJudgment: 1
          }
        })
        .then(function(response) {
          //如果是从首页导出数据进来这个页面的，就让他返回到导出数据页面
          if(that.route === true ){
                Toast.success("上传完成");
                that.$router.push({path:'/export'})
          }else{
            that.$router.push({path:'/index'})
            Toast.success("注册完成");
          }
          
        });
    },

    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file);
    },

    // 通过上传图片自动获取公司名称
    GetlicenseData(e) {
      let that = this;
      that
        .$dataApi({
          method: "POST",
          url:"api/Ocr/GetlicenseData",
          data: {
            Ocrurl: e[0].src
          }
        })
        .then(function(response) {
          if (response.ENTERPRISE_NAME_CH !== "") {
            that.firmname = response.ENTERPRISE_NAME_CH;
            that.yingye = true;
          } else if (response.ENTERPRISE_NAME_CH == "") {
            Toast.fail("当前上传营业执照模糊，请重新上传营业执照！");
            that.yingye = false
            return false;
          }
        });
    },

    deleteImgs: function(index) {
      this.imgTempList[index] = "";
      this.imgTempList = this.imgTempList.filter(item => {
        return item != "";
      });
    },
    randomString: function(len) {
      len = len || 32;
      var $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
      var maxPos = $chars.length;
      var pwd = "";
      for (var i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
    },
    //选择图片
    onChooseImage: function(event) {
      var that = this;
      let params = {};
      params.DoType = "UploadFiles";
      //判断图片数量是否已上限
      var currentImgTempArray = that.imgTempList;
      if (currentImgTempArray.length >= 1) {
        alert("最多上传1张图片");
        return false;
      }

      //使用FileReader对文件对象进行操作
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); //将读取到的文件编码成Data URL
      reader.onload = function() {
        //读取完成时
        var replaceSrc = reader.result; //文件输出的内容
        //调用图片压缩处理方法
        that.compressedImage({
          src: replaceSrc,
          quality: 0.8,
          success: function(src) {
            var names =
              that.COMMON.fileName(
                event.target.files[0].name,
                ["jpg", "jpeg", "png", "bmp"],
                false
              )
                .split("")
                .filter(item => {
                  return item != "-";
                })
                .join("") || that.randomString();
            params.OutputStream =
              names +
              "|" +
              src
                .replace("data:image/jpeg;base64,", "")
                .replace("data:image/bmp;base64,", "")
                .replace("data:image/png;base64,", "")
                .replace("data:image/jpg;base64,", "");
            that
              .$axios({
                url:
                  "https://webservice.jshcsoft.com/upload/UpLoadFile/UploadHandler.ashx",
                method: "POST",
                data: that.qs.stringify(params)
              })
              .then(res => {
                // 将压缩后的路径 追加到临时路径数组中
                var totalList = [];
                if (currentImgTempArray.length > 0) {
                  totalList = currentImgTempArray.concat([
                    { src: res, name: names }
                  ]);
                } else {
                  totalList[0] = {
                    src: res,
                    name: names
                  };
                }
                Toast.loading({
                  message: "公司名称自动获取中...",
                  forbidClick: true,
                  loadingType: "spinner",
                  
                });
                // console.log(totalList);
                
                that.imgTempList = totalList;
                // console.log(that.imgTempList);
                
                if(totalList !== null){
                  that.GetlicenseData(totalList)
                }
              });
          }
        });
      };
    },
    /**
     * 压缩图片处理
     * @src 需要压缩的图片base64路径
     * @quality 图片质量 0-1，默认1
     * @success()  成功后的回调
     * */
    compressedImage: function(params) {
      var that = this;
      var initParams = {
        src: params.src || "",
        quality: params.quality || 1
      };

      var image = new Image();
      image.src = initParams.src;
      image.onload = function() {
        //获取图片初始宽高
        var width = image.width;
        var height = image.height;
        //判断图片宽度，再按比例设置宽度和高度的值
        if (width > 1024) {
          width = 1024;
          height = Math.ceil(1024 * (image.height / image.width));
        }

        //将图片重新画入canvas中
        var canvas = document.getElementById("compressCanvas");
        if (!canvas) {
          //如果没有压缩用的canvas 就创建一个canvas画布
          var body = document.body;
          canvas = document.createElement("canvas"); //创建canvas标签
          canvas.id = "compressCanvas"; //给外层容器添加一个id
          canvas.style.position = "fixed";
          canvas.style.zIndex = "-1";
          canvas.style.opacity = "0";
          canvas.style.top = "-100%";
          canvas.style.left = "-100%";
          body.append(canvas);
        }

        var context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        context.beginPath();
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.fill();
        context.closePath();
        context.drawImage(image, 0, 0, width, height);
        var replaceSrc = canvas.toDataURL("image/jpeg", initParams.quality); //canvas转DataURL(base64格式)
        params.success && params.success(replaceSrc);
      };
    },

    /**
     * 将base64转换为文件
     * @dataUrl base64路径地址
     * @fileName 自定义文件名字
     * */
    dataURLtoFile: function(dataUrl, fileName) {
      var arr = dataUrl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    },
    returnPrev: function() {
      this.$router.go(-1);
    },
    returnHome: function() {
      this.$router.push({ path: "/" });
    },
    subFeedback: function() {
      let that = this;
      this.fileList = this.imgTempList;
      if (!this.load) {
        this.load = true;
        this.$dataApi({
          url: "/Mine_SP/AddFeedback",
          method: "POST",
          data: {
            F_Content: this.value,
            F_Img:
              this.fileList.length > 0 &&
              this.fileList
                .map(function(item) {
                  return item.src;
                })
                .join(";"),
            U_Code: sessionStorage.getItem("userCode")
          }
        }).then(res => {
          that.load = false;
          if (res.status == 200) {
            that.$toast.success("提交成功");
            that.value = "";
            that.fileList = [];
            that.$router.push({
              path: "/feedBack_result",
              query: { result: "提交成功" }
            });
          } else {
            that.$toast.error("提交失败");
            that.$router.push({
              path: "/feedBack_result",
              query: { result: "提交失败" }
            });
          }
        });
      }
    }
  },

  created() {
      this.COMMON.initRem();
      this.$dataApi({
        url:"api/Users/GetUserInformation",
        method:"POST",
        data:{
          OpenID: sessionStorage.getItem("openID")
        }
      })
      .then(res => {
        if( res.licenseUrl !== null){
          var i = {};
          i.src =res.licenseUrl;
          this.imgTempList.push(i)
        }else if(res.licenseUrl === null){
           this.imgTempList = [];
        }
        // console.log(this.imgTempList);
        
        this.firmname = res.EnterpriseName
        this.username = res.LinkMan
        this.tel =  res.LinkPhone
      });

      //获取用户信息
      this.$dataApi({
        url:"api/Users/GetUsers",
        method:"POST",
        data:{
          OpenID: sessionStorage.getItem("openID"),
          IsPage:1,
          Source:1
        }
      })
      .then(res => {
        // console.log(res);
        if(res.Rows[0].IsMember === 0){
          this.verification = true
        }
      });
  },
  beforeRouteEnter(to, from, next) {
      next(vm => {
          if(from.path === "/set"){
              this.$dataApi({
                url:"api/Users/GetUsers",
                method:"POST",
                data:{
                    OpenID: sessionStorage.getItem("openID"),
                    IsPage:1,
                    Source:1
                }
              }).then(res=>{
                if(res.Rows.length==0){
                    vm.verification = true
                }else if(res.Rows[0].IsMember === 0 && res.Rows[0].licenseUrl === null){
                    vm.verification = false
                }
              })
          }else if(from.path === "/"){
                vm.route = true
                if(vm.$route.query.from === 0){
                    vm.verification = true
                } else if(vm.$route.query.from === 1){
                    vm.verification = false
                    // console.log(vm.verification);
                }
          }
          // else{
          //   if(vm.$route.query.from === 0){
          //       vm.verification = true
          //   } else if(vm.$route.query.from === 1){
          //       vm.verification = false
          //       // console.log(vm.verification);
          //   }
          // }
      })
  },
};
</script>

<style scoped>
.nav1 {
  /* margin: 0 auto; */
  width: 100%;
  height: 100%;
  position: fixed;
}
.van-cell {
  text-align: left;
  padding: 0 16px !important;
  line-height: 0.8rem !important;
}
.van-field__button {
  background-color: #3385ff;
  color: #ffffff;
  padding-right: 8px;
}
.van-button--primary {
  color: #fff;
  background-color: #3385ff !important;
  border: 1px solid #3385ff !important;
}
.wraps {
  width:100%;
  height: 100%;
  margin: 0 auto;
  padding: 10px 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.title {
  color: #353535;
  /* font-weight: bold; */
  font-size: 14px !important;
  /* margin-top:0.4rem; */
  /* margin-bottom:0.3rem; */
  text-align: center;
  /* margin-bottom: 1rem; */
}

.feedContent {
  height: 6rem;
  width: 100%;
  display: block;
  border: 1px solid #eeeeee;
  padding: 0.3rem !important;
  align-items: flex-start !important;
}
.rightText {
  float: right;
  position: absolute;
  right: 0.3rem;
  top: -0.8rem;
  text-align: right;
  width: 1.4rem;
  height: 0.3rem;
  line-height: 0.3rem;
  color: #707070;
}

.subBtn {
  margin-top: 0.4rem;
  text-align: center;
  width: 100%;
  height: 0.88rem;
  line-height: 0.88rem;
  background-color: #27c881;
  color: white;
  border-radius: 6px;
  border: 1px solid #27c881;
}
.fileBtn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.08rem;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ebedf0;
  position: relative;
}
#files {
  position: absolute;
  z-index: 20;
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.images {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.08rem;
}
.deleteImg {
  border-radius: 50%;
  width: 0.3rem;
  height: 0.3rem;
  top: -0.15rem;
  right: -0.15rem;
  position: absolute;
  text-align: center;
  line-height: 0.4rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 12px;
}
.van-button--small {
  height: 28px !important;
  line-height: 28px !important;
}
.zhu {
  font-size: 0.23rem;
  color: red;
  display: block;
  float: left;
  padding-left: 16px;
  margin-top: 10px;
}
</style>
