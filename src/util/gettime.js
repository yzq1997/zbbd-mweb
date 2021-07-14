
//将时间统计成秒形式
var EndTime = new Array();
var Date=new Date();
EndTime = (formatDate(Date,'yyyy-MM-dd HH:mm:ss')).split(/[-/s:]/);
var EndTime =(new Date(EndTime[0],EndTime[1]-1,EndTime[2],0,0,0)).valueOf();
alert("EndTime==="+EndTime);

export function GetRTime() {
	var NowTime = new Date();
	if(NowTime.getTime()<EndTime)
	{
		var nMS = EndTime - NowTime.getTime();
		var nD = Math.floor(nMS / (1000 * 60 * 60 * 24));
		var nH = Math.floor(nMS / (1000 * 60 * 60)) % 24;
		var nM = Math.floor(nMS / (1000 * 60)) % 60;
		var nS = Math.floor(nMS / 1000) % 60;
		document.getElementById("RemainD").innerHTML = nD;
		document.getElementById("RemainH").innerHTML = nH;
		document.getElementById("RemainM").innerHTML = nM;
		document.getElementById("RemainS").innerHTML = nS;
		setTimeout("GetRTime()", 1000);
	}
	else
	{
		$("#dateend").show();
		$("#datebegin").hide();
		$("#dealover").show();
		$("#dealbuy").hide();
	}
}

function formatDate(date, fmt) {
	 if (/(y+)/.test(fmt)) {
			 fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
		 }
		 let o = {
			 'M+': date.getMonth() + 1,
			 'd+': date.getDate(),
			 'h+': date.getHours(),
			 'm+': date.getMinutes(),
			 's+': date.getSeconds()
		 };
		 for (let k in o) {
			 if (new RegExp(`(${k})`).test(fmt)) {
				 let str = o[k] + '';
				 fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
			 }
		 }
		 return fmt;

};
