// 高德地图获取地理位置 获取城市adcode
function getAdCode() {
	$.ajax({
		url: "https://restapi.amap.com/v3/ip",
		type: "POST",
		data: "key=e17802d541158928bbe8cce0b35a5133",
		dataType: "JSON",
		async: false,
		success: function (json) {
			if (json.info == "OK") {
				adcode = json.adcode;
			} else {
				adcode = 330300; // 默认温州
				console.log("获取城市失败！");
			}
		},
		error: function (xhr) {
			console.log("产生错误" + xhr);
		},
	});
	return adcode;
};
var adcode = getAdCode();
// 显示时间天气
function showTime() {
	var NewAdcode = adcode; // 城市adcode
	var time = new Date();
	var year = time.getFullYear();    //获取完整的年份(4位,1970-????)
	var month = time.getMonth();       //获取当前月份(0-11,0代表1月)
	month = (month + 1 + "").padStart(2, "0"); // 前置补0
	var date = time.getDate();        //获取当前日(1-31)
	date = (date + "").padStart(2, "0");
	var hours = time.getHours();
	hours = (hours + "").padStart(2, "0");
	var minutes = time.getMinutes();
	minutes = (minutes + "").padStart(2, "0");
	var seconds = time.getSeconds();
	seconds = (seconds + "").padStart(2, "0");
	end = year + "年" + month + "月" + date + "日 " + hours + ":" + minutes + ":" + seconds;
	
	// 根据城市获取天气
	$.ajax({
		type: "POST",
		async: true, // 是否异步请求
		url: 'https://restapi.amap.com/v3/weather/weatherInfo',
		data: "key=e17802d541158928bbe8cce0b35a5133&city=" + NewAdcode,
		success: function (data) {
			var weather = "";
			var lives = data.lives[0];
			if (lives != null && lives.length != 0) {
				weather = `${lives.city + lives.temperature}°C${lives.weather}`;
			}
			$('.title .item').text(end + " " + weather);
		},
		error: function () {
			console.log("error");
		}
	});
	
}
showTime();
// setInterval(showTime, 1000);


// 获取数据
function getDate() {
	$.ajax({
		url: ' 	',
		data: {
			// name: 'disease_h5'
		},
		type: 'POST',
		// dataType: 'jsonp',
		// jsonp: 'callback',
		// jsonpCallback: 'callback_success',
		success: function (res) {
			var data = res.data.diseaseh5Shelf;
			$('#confirm').text(data.chinaTotal.confirm);
			$('#heal').text(data.chinaTotal.heal);
			$('#dead').text(data.chinaTotal.dead);
			$('#nowConfirm').text(data.chinaTotal.nowConfirm);
			$('#noInfect').text(data.chinaTotal.noInfect);
			$('#import').text(data.chinaTotal.importedCase);
			center2(data);
			right1(data);
			right2(data);
		}
	});
}
// setInterval(getDate(), 1000 * 60 * 2);

// 获取数据
function getDate1() {
	$.ajax({
		type: 'POST',
		url: 'https://api.inews.qq.com/newsqa/v1/query/inner/publish/modules/list',
		data: {
			modules: 'chinaDayList,chinaDayAddList,cityStatis,nowConfirmStatis,provinceCompare'
		},
		dataType:'json',	
		success: function (res) {
			const data = res.data;
			left1(data);
			left2(data);
		}
	});
}
// setInterval(getDate1(), 1000 * 60 * 2);

// 中2地图
function center2(data) {
	var myChart = echarts.init(document.getElementById("center2"), 'dark');
	const option = {
		title : { text : '' , left : 'center' , top : 'center' , } ,
		tooltip : { trigger : 'item' } ,
		// 左侧小导航图标
		visualMap : {
			show : true , x : 'left' , y : 'bottom' , textStyle : { fontSize : 8 , color : '#0ff' } ,
			splitList : [
				{ start : 1 , end : 9 } ,
				{ start : 10 , end : 99 } ,
				{ start : 100 , end : 999 } ,
				{ start : 1000 , end : 9999 } ,
				{ start : 10000 }
			] ,
			color : [ '#8A3310' , '#C64918' , '#E55B25' , '#F2AD92' , '#F9DCD1' ]
		} ,
		series : [
			{
				name : '累计确诊人数' , type : 'map' , mapType : 'china' , roam : false , // 禁用拖动和缩放
				// 图形样式
				itemStyle : {
					normal : {
						borderWidth : .5 , // 区域边框宽度
						borderColor : '#fff' , // 区域边框颜色
						areaColor : '#bff' , // 区域颜色
					} ,
					emphasis : { // 鼠标滑过地图高亮的相关设置
						borderWidth : .5 , borderColor : '#bfc' , areaColor : '#bff' ,
					} ,
				} ,
				// 图形上的文本标签
				label : {
					normal : {
						show : true , // 省份名称
						fontSize : 20 ,
					} ,
					emphasis : { show : true , fontSize : 20 , }
				} ,
				// [{'name': '上海', 'value': 11},{'name': '北京', 'value': 12},]
				data : []
			}
		]
	};
	const provinces = data.areaTree[ 0 ].children;
	for (var province of provinces) {
		option.series[0].data.push({
			'name': province.name,
			'value': province.total.confirm
		});
	}
	myChart.setOption(option);
}

// 右1柱状图
function right1(data) {
	var myChart = echarts.init(document.getElementById("right1"), 'dark');
	var option = {
		title: {
			text: '全国确诊省市TOP8',
			left: 'left',
			top: 'top',
		},
		xAxis: {
			type: 'category',
			data: [],
			axisLabel: {
				inside: false,
				color: '#0f0'
			},
			axisTick: {
				show: true
			},
			axisLine: {
				show: true
			},
			z: 10
		},
		yAxis: {
			type: 'value',
			data: ['10k', '20k', '30k', '40k', '50k', '60k', '70k'],
			axisLabel: {
				show: true,
				color: 'green',
				fontSize: 12,
				formatter: function (value) {
					if (value >= 1000) {
						value = value / 1000 + 'k';
					}
					return value;
				}
			},
			axisLine: {
				show: true
			},
			axisTick: {
				show: true
			},
		},
		series: [
			{
				data: [],
				type: 'bar'
			}
		]
	};
	var provinces = data.areaTree[0].children;
	var topData = [];
	for (var province of provinces) {
		topData.push({
			'name': province.name,
			'value': province.total.confirm
		});
	};
	// 降序排序
	topData.sort(
		function (a, b) {
			return b.value - a.value;
		}
	);
	// 保留前10项
	topData.length = 8;
	// 构造省份和数值
	for (var province of topData) {
		option.xAxis.data.push(province.name);
		option.series[0].data.push(province.value);
	}
	myChart.setOption(option);
}
// 右2饼图
function right2(data) {
	var myChart = echarts.init(document.getElementById("right2"), 'dark');
	var option = {
		title: {
			text: '境外输入省市TOP5',
			left: 'center',
		},
		tooltip: {
			trigger: 'item'
		},
		legend: {
			orient: 'vertical',
			left: 'left'
		},
		series: [
			{
				name: '境外输入',
				type: 'pie',
				radius: '50%',
				data: [],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};

	var provinces = data.areaTree[0].children; // 中国所有的省
	var topData = [];
	for (var province of provinces) {
		for (var item of province.children) {
			if (item.name === '境外输入') {
				topData.push({
					'name': province.name,
					'value': item.total.confirm
				});
				break;
			}
		}

	};
	// 降序排序
	topData.sort(
		function (a, b) {
			return b.value - a.value;
		}
	);
	// 保留前5项
	topData.length = 5;
	// 构造省份和数值
	for (var province of topData) {
		var json = { "value": province.value, "name": province.name }
		option.series[0].data.push(json);
	}
	myChart.setOption(option);
}

// 左1图
function left1(data) {
	var myChart = echarts.init(document.getElementById("left1"), 'dark');
	var option = {
		title: {
			text: '全国累计趋势',
			left: 'left',
		},
		tooltip: {
			trigger: 'axis'
		  },
		// 图例项
		legend: {
			// orient: 'vertical',
			left: 'right',
			data: ['累计治愈', '累计死亡', "累计确诊"]
		},
		xAxis: {
			type: 'category',
			data: [],
			axisLabel: {
				color: 'rgb(255, 0, 0)'
			}
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				show: true,
				color: 'pink',
				fontSize: 12,
				formatter: function (value) {
					if (value >= 1000) {
						value = value / 1000 + 'k';
					}
					return value;
				}
			},
		},
		series: [
			{
				name: '累计治愈',
				data: [],
				type: 'bar'
			},
			{
				name: '累计死亡',
				data: [],
				type: 'line'
			},
			{
				name: '累计确诊',
				data: [],
				type: 'line'
			},
		]
	};
	var chinaDataList = data.chinaDayList;
	for (var i of chinaDataList) {
		option.xAxis.data.push(i.date);
		option.series[0].data.push(i.heal);
		option.series[1].data.push(i.dead);
		option.series[2].data.push(i.confirm);
	}
	myChart.setOption(option);
}
// 左2图
function left2(data) {
	var myChart = echarts.init(document.getElementById("left2"), 'dark');
	var option = {
		title: {
			text: '全国新增趋势',
			left: 'left',
		},
		tooltip: {
			trigger: 'axis'
		  },
		// 图例项
		legend: {
			// orient: 'vertical',
			left: 'right',
			data: ['新增确诊', '新增疑似', "新增境外输入"]
		},
		xAxis: {
			type: 'category',
			data: []
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				show: true,
				color: 'white',
				fontSize: 12,
				formatter: function (value) {
					if (value >= 1000) {
						value = value / 1000 + 'k';
					}
					return value;
				}
			},
		},
		series: [
			{
				name: '新增确诊',
				data: [],
				type: 'line',
				smooth: true
			},
			{
				name: '新增疑似',
				data: [],
				type: 'line',
				smooth: true
			},
			{
				name: '新增境外输入',
				data: [],
				type: 'line',
				smooth: true
			},
		]
	};
	var chinaDataList = data.chinaDayAddList;
	for (var key of chinaDataList) {
		option.xAxis.data.push(key.date);
		option.series[0].data.push(key.confirm);
		option.series[1].data.push(key.suspect);
		option.series[2].data.push(key.importedCase);
	}
	myChart.setOption(option);
}
