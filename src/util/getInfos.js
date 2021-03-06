import axios from 'axios'

export const userInfo = {

    getInfo: function () {
        function getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]); return null;
        }

        return new Promise((resolve, reject) => {
            if(getUrlParam('code') && (window.location.href.indexOf("iframe")<0 && window.location.href.indexOf("helpshare")<0 && window.location.href.indexOf("signone")<0)) {
                var userData = {};
                axios.get('https://activity.jshcsoft.com/survey/api/api/FixActivity/GetUserInfo', {
                params: {
                    appID: 'wx9cec35e64dce69fc',
                    code: getUrlParam('code')
                }
                })
                .then(function (res) {
                    console.log(res);
                    var result = JSON.parse(res)
                    userData.OpenID = result.openid;
                    userData.NickName = result.nickname;
                    userData.HeadImg = result.headimgurl;
                    sessionStorage.setItem('openID', result.openid)
                    sessionStorage.setItem('NickName', result.nickname)
                    sessionStorage.setItem('headimgurl', result.headimgurl)
                    sessionStorage.setItem('sex', result.sex)
                    sessionStorage.setItem('language', result.language)
                    sessionStorage.setItem('city', result.city)
                    sessionStorage.setItem('province', result.province)
                    sessionStorage.setItem('country', result.country)
                    sessionStorage.setItem('remark', result.remark)
                    sessionStorage.setItem('subscribe_time', result.subscribe_time)
                    sessionStorage.setItem('IsUpdate', result.IsUpdate)
                    sessionStorage.setItem('presubscribe_time', result.presubscribe_time)
                    resolve()
                })
            }
            else {
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9cec35e64dce69fc&redirect_uri=https://weixin.jshcsoft.com/biddingbook/mweb?AppID=wx9cec35e64dce69fc&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
            }
        })
    },

    // ??????????????????????????????????????????????????????
    isfirstvip: function () {
        return new Promise((resolve, reject) => {
          axios.get('https://weixin.jshcsoft.com/biddingbook/api/api/Users/IsSetUserKeyWord', {
        //   axios.get('http://211.149.250.2:20001/ZBBDTEST/api/Users/IsSetUserKeyWord', {
            params: {
                openid:sessionStorage.getItem("openID"),
            } 
            })
            .then(function (res) {

                if(JSON.parse(res).IsHaveKeyWord == "False"){
                    sessionStorage.setItem('UserIsVip',1);
                }else{
                    sessionStorage.setItem('UserIsVip',2);
                }
                resolve()
            })
        })
    },

    //????????????????????????
    haveKey: function () {
        return new Promise((resolve, reject) => {
            axios.post('https://weixin.jshcsoft.com/biddingbook/api/api/Users/GetUserALLKeyWords', {
            // axios.post('http://211.149.250.2:20001/ZBBDTEST/api/Users/GetUserALLKeyWords', {
                openid:sessionStorage.getItem("openID"),
                Source:1
            })
            .then(function (res) {
                // alert(res)
                if(JSON.parse(JSON.parse(res).Data).Rows.length == 0){
                    sessionStorage.setItem('UserIsVip',3);
                }
                resolve()
            })
        })
    },

    //????????????
    saveFoot:function(){
        return new Promise((resolve, reject) => {
            axios.post('https://weixin.jshcsoft.com/biddingbook/api/api/Users/SaveVisitRecord', {
            // axios.post('http://211.149.250.2:20001/ZBBDTEST/api/Users/SaveVisitRecord', {
                openid:sessionStorage.getItem("openID"),
                Origin:1
            })
            .then(function (res) {
                resolve()
            })
        })
    }
}

export const general = {
    // ?????????????????????
    get_uuid:function(){
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";  
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); 
      s[8] = s[13] = s[18] = s[23] = "-";

      var uuid = s.join("");
    return uuid;
  },


  //??????????????????????????????
  timeFormat:function (timestamp){
    //timestamp?????????????????????parseInt??????,??????????????????0?????????
      var time = new Date(timestamp);
      var year = time.getFullYear();
      var month = time.getMonth()+1
      var date = time.getDate();
      var hours = time.getHours();
      var minutes = time.getMinutes();
      var seconds = time.getSeconds();
      return year+'-'+(month<10?'0'+month:month)+'-'+(date<10?'0'+date:date)+' '+(hours<10?'0'+hours:hours)+':'+(minutes<10?'0'+minutes:minutes)+':'+(seconds<10?'0'+seconds:seconds);
  },

  //??????url?????????
  getUrlParam:function (name) {
    // console.log(name)
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.hash.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]); return null;
  }
}




