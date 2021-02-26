console.log(wx);
let corpid = 'wwce6bed30204e09a9'
let agentid = 1000011
import axios from "axios"
let configJsApiList = ['openEnterpriseChat', 'selectEnterpriseContact']
let agentConfigJsApiList = ['selectExternalContact','startMeeting']
let meetingButton = document.querySelector('.meeting')
let liveButton = document.querySelector('.live')

function init(){
    liveButton.addEventListener('click',createLive)
    meetingButton.addEventListener('click',selectUser(startMeeting))
} 

function createLive(){
    wx.invoke('startLiving', {
        "liveType": 1,
        "theme": "新同学培训",
    }, function(res) {
        if (res.err_msg == "startLiving:ok") {
            livingId = res.livingId;
            console.log('livingId',livingId);
        }
    });
}

function startMeeting(userIdList) {
    wx.invoke('startMeeting', {
        "meetingType" : 1,
        "theme" : "员工大会",
        "attendees": userIdList,
        "externalAttendees": [],
        "deviceSns" : [],
    }, function(res) {
        if (res.err_msg == "startMeeting:ok") {
            meetingId = res.meetingId;
        }
    });
}
function selectUser(callback) {
    wx.invoke("selectEnterpriseContact", {
        "fromDepartmentId": -1,// 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
        "mode": "multi",// 必填，选择模式，single表示单选，multi表示多选
        "type": ["user"],// 必填，选择限制类型，指定department、user中的一个或者多个
        "selectedDepartmentIds": [],// 非必填，已选部门ID列表。用于多次选人时可重入，single模式下请勿填入多个id
        "selectedUserIds": []// 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
    }, function (res) {
        if (res.err_msg == "selectEnterpriseContact:ok") {
            if (typeof res.result == 'string') {
                res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
            }
            var selectedDepartmentList = res.result.departmentList;// 已选的部门列表
            for (var i = 0; i < selectedDepartmentList.length; i++) {
                var department = selectedDepartmentList[i];
                var departmentId = department.id;// 已选的单个部门ID
                var departemntName = department.name;// 已选的单个部门名称
            }
            var selectedUserList = res.result.userList; // 已选的成员列表
            let userIdList = []
           
            for (var i = 0; i < selectedUserList.length; i++) {
                var user = selectedUserList[i];
                var userId = user.id; // 已选的单个成员ID
                var userName = user.name;// 已选的单个成员名称
                var userAvatar = user.avatar;// 已选的单个成员头像
                userIdList.push(userId)
            }
            callback(userIdList)
            console.log('userList',userIdList);
           
        }
    }
    );
}


async function main() {

    let url = window.location.href
    console.log('url', url);
    let ConfigSignRes = await axios.get("https://ds.donviewcloud.net/wechat-h5-backend/getConfigSign", { params: { url: url } })
    let config = ConfigSignRes.data
    let signature = config.signature
    let timestamp = config.timestamp
    let noncestr = config.noncestr
    let corpid = config.corpid
    console.log('getConfigSign', config);
    wx.config({
        beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: corpid, // 必填，企业微信的corpID
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: noncestr, // 必填，生成签名的随机串
        signature: signature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
        jsApiList: configJsApiList // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    });
    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log('wx.error', res);
    });

    wx.ready(async function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        console.log('ready', url);
        let agentConfigRes = await axios.get('https://ds.donviewcloud.net/wechat-h5-backend/getAgentConfigSign', { params: { url: url } })
        let agentConfig = agentConfigRes.data
        signature = agentConfig.signature
        timestamp = agentConfig.timestamp
        noncestr = agentConfig.noncestr
        corpid = agentConfig.corpid
        console.log('agentConfig', agentConfig);
        console.log('agentid', agentid);
        wx.agentConfig({
            corpid: corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid: agentid, // 必填，企业微信的应用id （e.g. 1000247）
            timestamp: timestamp, // 必填，生成签名的时间戳
            nonceStr: noncestr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名，见附录-JS-SDK使用权限签名算法
            jsApiList: agentConfigJsApiList, //必填
            success: function (res) {
                // 回调
                console.log('agentConfig success', res);
                init()
                
            },
            fail: function (res) {
                if (res.errMsg.indexOf('function not exist') > -1) {
                    alert('版本过低请升级')
                }
            }
        });
    });

}
main()



