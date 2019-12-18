/**
 * 全局使用静态变量
 */
var globals = {}
globals.loopUsedTypeList = [
    { 'value': 1100, 'key': '照明插座用电 >> 母线照明总表' },
    { 'value': 1110, 'key': '照明插座用电 >> 房间计量表' },
    { 'value': 1111, 'key': '照明插座用电 >> 房间计量子表' }
    , { 'value': 1200, 'key': '照明插座用电 >> 公共区域总表' }
    , { 'value': 1210, 'key': '照明插座用电 >> 楼层公共表' }
    , { 'value': 2100, 'key': '空调用电 >> 空调总表' }
    , { 'value': 2110, 'key': '空调用电 >> 空调分表' }
    , { 'value': 3110, 'key': '动力设备用电 >> 电梯计量表' }
    , { 'value': 3100, 'key': '动力设备用电 >> 电梯总表' }
    , { 'value': 4100, 'key': '特殊用电 >> 信息机房总表' }
    , { 'value': 4110, 'key': '特殊用电 >> 信息机房分表' }
    , { 'value': 4200, 'key': '特殊用电 >> 消防总表' }
    , { 'value': 4210, 'key': '特殊用电 >> 消防分表' }
    , { 'value': 4300, 'key': '特殊用电 >> 安防总表' }
    , { 'value': 4310, 'key': '特殊用电 >> 安防分表' }
    , { 'value': 0, 'key': '园区(建筑)总用电>>一级总表' }]
globals.loopUsedTypeLevelList = [{
    value: 0,
    label: '园区(建筑)总用电',
    children: [{
        value: 1000,
        label: '照明插座用电',
        children: [{
            value: 1100,
            label: '母线照明总表',
            children: [{
                value: 1110,
                label: '房间计量表',
                children: [{
                    value: 1111,
                    label: '房间计量子表'
                }]
            }]
        }, {
            value: 1200,
            label: '公共区域照明总表',
            children: [{
                value: 1210,
                label: '楼层公共表'
            }]
        }]
    }, {
        value: 2000,
        label: '空调用电',
        children: [{
            value: 2100,
            label: '空调总表',
            children: [{
                value: 2110,
                label: '空调分表'
            }]
        }]
    }, {
        value: 3000,
        label: '动力设备用电',
        children: [{
            value: 3100,
            label: '电梯总表',
            children: [{
                value: 3110,
                label: '电梯分表'
            }]
        }]
    }, {
        value: 4000,
        label: '特殊用电',
        children: [{
            value: 4100,
            label: '信息机房总表',
            children: [{
                value: 4110,
                label: '信息机房表'
            }]
        }, {
            value: 4200,
            label: '消防总表',
            children: [{
                value: 4210,
                label: '消防分表'
            }]
        }, {
            value: 4300,
            label: '安防总表',
            children: [{
                value: 4310,
                label: '安防分表'
            }]
        }]
    }]
}];
globals.hasMainPoint = function (loopUsedType) {
    return loopUsedType == 1110 || loopUsedType == 1111 || loopUsedType == 1210 || loopUsedType == 2110
        || loopUsedType == 3110 || loopUsedType == 4110 || loopUsedType == 4210 || loopUsedType == 4310;
}
globals.mesureLocalType = function (loopUsedType) {
    if (loopUsedType == 1110 || loopUsedType == 1111) {
        return 16
    } else if (loopUsedType == 1210) {
        return 15
    } else if (loopUsedType == 3100 || loopUsedType == 3110) {
        return 20
    }
}

globals.quarterName = ["第1季度", "第2季度", "第3季度", "第4季度"];
globals.monthName = [
    "01月",
    "02月",
    "03月",
    "04月",
    "05月",
    "06月",
    "07月",
    "08月",
    "09月",
    "10月",
    "11月",
    "12月"
];
export default globals