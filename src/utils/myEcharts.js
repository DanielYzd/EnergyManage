/* eslint-disable no-tabs */
import echarts from 'echarts'

/**
 // eslint-disable-next-line no-tabs
 * 	var params = {
		domId : '',
		title : '',
		xAxis : [],
		data : [],
		width : '',
		height : '',
		chartType :''
	}
 */
export function loadLineChart(params) {
	var chartStyle = null
	if (params.width && params.height) {
		chartStyle = {
			width: params.width,
			height: params.height
		}
	}

	var meterType = params.meterType || 0
	var isArea = params.isArea
	var myChart = echarts.init(document.getElementById(params.domId), null, chartStyle)
	var colorArray = ['#00ae9d', '#4e72b8', '#f47920', '#00ae9d']

	var chartType = params.chartType ? params.chartType : 'line'
	var legend = params.legend ? { left: 'right', data: params.legend } : null
	let _series = params.data.map((item, index) => {
		var t = params.data.length > 1 ? index : meterType
		var color = colorArray[t]
		var areaStyle = isArea === false ? null : {
			color: {
				type: 'linear',
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [{
					offset: 0, color: color // 0% 处的颜色
				}, {
					offset: 1, color: 'white' // 100% 处的颜色
				}],
				globalCoord: false // 缺省为 false
			}
		}
		return {
			name: legend ? legend.data[index] : null,
			type: chartType,
			data: item,
			smooth: true, // 平滑曲线还是折线
			itemStyle: {
				normal: {
					color: color
				}
			},
			lineStyle: {
				normal: {
					color: color
				}
			},
			areaStyle: areaStyle
		}
	})
	var option = {
		title: {
			text: params.title,
			left: params.titlePostion || 'left',
			// padding :[5,0,0,5],
			textStyle: {
				color: '#909399'// color
			}
		},
		legend: legend,
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		xAxis: {
			data: params.xAxis
		},
		yAxis: [{
			name: params.yAxisUnit,
			type: 'value'
		}],
		series: _series
	}
	if (params.grid) {
		option.grid = {
			left: '4%',
			right: '4%',
			bottom: '15',
			top: '30',
			containLabel: true
		}
	}
	myChart.clear() // 清除图形缓存
	myChart.setOption(option)
}

export function mutilSeriesChart(params) {
	var chartStyle = null
	if (params.width && params.height) {
		chartStyle = {
			width: params.width,
			height: params.height
		}
	}
	var myChart = echarts.init(document.getElementById(params.domId), null, chartStyle)
	var chartType = params.chartType ? params.chartType : 'line'
	var color = '#00ae9d', name = '用电量 ( 万 kWh )'
	if (params.meterType === 1) {
		color = '#4e72b8', name = '用水量 ( 万 m³ )'
	} else if (params.meterType === 2) {
		color = '#f47920', name = '用气量 ( 万 m³ )'
	}
	var option = {
		title: {
			text: params.title,
			// padding :[15,0,0,15],
			textStyle: {
				color: '#909399'
			}
		},
		tooltip: {},
		legend: {
			data: ['用电量', '用水量', '用气量'],
			bottom: '10',
			selectedMode: 'single'
		},
		xAxis: {
			data: params.xAxis
		},
		yAxis: [{
			name: name,
			type: 'value'
		}],
		series: [{
			name: '用电量',
			type: chartType,
			itemStyle: {
				normal: {
					color: color
				}
			},
			data: params.data0
		}, {
			name: '用水量',
			type: chartType,
			data: params.data1
		}, {
			name: '用气量',
			type: chartType,
			// yAxisIndex:1,
			data: params.data2
		}]
	}
	myChart.setOption(option)
	myChart.on('legendselectchanged', function (obj) {
		var selected = obj.selected
		var legend = obj.name
		// 使用 legendToggleSelect Action 会重新触发 legendselectchanged Event，导致本函数重复运行
		// 使得 无 selected 对象
		var index = 0
		if (legend == '用电量') {
			color = '#00ae9d', name = '用电量(kWh)'
			index = 0
		}
		if (legend == '用水量') {
			color = '#4e72b8', name = '用水量(m³)'
			index = 1
			// triggerAction('legendSelect', selected);
		}
		if (legend == '用气量') {
			color = '#f47920', name = '用气量(m³)'
			index = 2
		}
		option.yAxis[0].name = name
		option.series[index].itemStyle = {
			normal: {
				color: color
			}
		}
		myChart.setOption(option)
	})
}

export function loadBarChart(params) {
	var myChart = echarts.init(document.getElementById(params.domId));
	var legend = params.legend ? { left: 'right', data: params.legend } : null
	var category = params.xAxis || []
	var data = params.yAxis || []
	var grid = params.grid ? {
		left: '4%',
		right: '4%',
		bottom: '15',
		top: '30',
		containLabel: true
	} : null
	var option = {
		grid: grid,
		title: {
			text: params.title,
			left: params.titlePostion || 'left'
			, textStyle: {
				color: "#909399"//color
			}
		},
		legend: legend,
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		xAxis: [{
			type: 'value'
		}],
		yAxis: [{
			type: 'category',
			axisTick: { show: false },
			data: category
		}],
		series: [{
			type: 'bar',
			label: {
				normal: {
					show: true,
					position: 'inside'
				}
			},
			data: data
		}]
	};
	myChart.clear() // 清除图形缓存
	myChart.setOption(option);

}

function setDefaultConfig(params) {
	return {
		legend: params.legend ? { left: 'right', data: params.legend } : null,
		category: params.xAxis || [],
		data: params.yAxis || [],
		grid: params.grid ? {
			left: '4%',
			right: '4%',
			bottom: '15',
			top: '30',
			width: '50%',
			containLabel: true
		} : null
	}
}
export function getColor(params) {
	var colorList = [
		'#17b3a3', '#FCCE10', '#E87C25', '#27727B',
		'#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
		'#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
	]
	return colorList[params.dataIndex]
}
export function creatBarOption(params) {
	let config = setDefaultConfig(params)
	return {
		grid: config.grid,
		title: {
			text: params.title,
			left: params.titlePostion || 'left',
			textStyle: {
				color: '#909399'
			}
		},
		legend: config.legend,
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'cross',
				label: {
					backgroundColor: '#6a7985'
				}
			}
		},
		xAxis: [{
			type: 'value'
		}],
		yAxis: [{
			type: 'category',
			axisTick: { show: false },
			data: config.data
		}],
		series: [{
			type: 'bar',
			label: {
				normal: {
					show: true,
					position: 'inside'
				}
			},
			data: config.data,
			itemStyle: {
				normal: {
					color: getColor,　　　　// 这里用函数控制柱子颜色，定义一个list，然后根据所以取得不同的值
					label: {
						show: true,
						position: 'top',
						formatter: '{b}\n{c}'
					}
				}
			}
		}]
	}
}
export function creatMutilSeriesChartOption(params) {
	return {
		tooltip: {
			trigger: 'axis'
		},
		legend: {
			data: params.series.map(item => { return item.name }) || [],
			left: 'left'
		},
		toolbox: {
			show: params.hideTools === true ? false : true,
			feature: {
				// dataZoom: {
				// 	yAxisIndex: 'none'
				// },
				// dataView: { readOnly: false },
				magicType: { type: ['line', 'bar'] },
				restore: {},
				saveAsImage: {}
			}
		},
		xAxis: {
			type: 'category',
			boundaryGap: params.startZero === true ? true : false,
			data: params.xAxis
		},
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: '{value} ' + params.yAxisUnit
			},
			max: params.max,
			min: params.min
		},
		series: params.series.map((item, index) => {
			return Object.assign(item, {
				markPoint: params.hideMarkPoint === true ? {} : {
					data: [
						{ type: 'max', name: '最大值' }
						//,{ type: 'min', name: '最小值' }
					]
				},
				markLine: params.hideMarkPoint === true ? {} : {
					data: [
						{ type: 'average', name: '平均值' }
					]
				},
				itemStyle: {
					normal: {
						color: getColor({ dataIndex: index })
					}
				}
			})
		})
	}
}
/**
 * 渲染echarts
 * @param {div id} domId 
 * @param {echarts option} option 
 */
export function renderEchart(domId, option) {
	var myChart = echarts.init(
		document.getElementById(domId)
	);
	myChart.clear(); // 清除图形缓存
	myChart.setOption(option);
}
/**
 * legend样式 ，右侧垂直显示
 */
export function legendStyle() {
	return {
		type: "scroll",
		orient: "vertical",
		right: 10,
		top: 20,
		bottom: 20,
		formatter: function (params) {
			return splitStr(params, 8, '\n')
		}
	};
}
function splitStr(str, targetLen, splitChar) {
	let source = str;
	let tmp = []
	while (true) {
		if (source.length < targetLen) {
			tmp.push(source)
			return tmp.join(splitChar);
		} else {
			tmp.push(source.substring(0, targetLen))
			source = source.substring(8)
		}
	}
}
/**
 * item 颜色
 */
export function itemStyle() {
	return {
		normal: {
			color: getColor
		},
		emphasis: {
			shadowBlur: 10,
			shadowOffsetX: 0,
			shadowColor: "rgba(0, 0, 0, 0.5)"
		}
	};
}