console.log(wx);
let corpid = 'wwce6bed30204e09a9'
let agentid = '1000009'
import axios from "axios"



async function start() {

    let url = window.location.href
    console.log('url',url);
    let ConfigSignRes = await axios.get("http://wechatdemo.vaiwan.com/getConfigSign", { params: { url:url } })
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
        jsApiList: [] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    });
    wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log('wx.error', res);
    });
   
    wx.ready(async function () {
        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        console.log('ready',url);
        let agentConfigRes = await axios.get('http://wechatdemo.vaiwan.com/getAgentConfigSign', { params: {url:url} })
        let agentConfig = agentConfigRes.data
        signature = agentConfig.signature
        timestamp = agentConfig.timestamp
        noncestr = agentConfig.noncestr
        corpid = agentConfig.corpid
        console.log('agentConfig',agentConfig);
        wx.agentConfig({
            corpid: corpid, // 必填，企业微信的corpid，必须与当前登录的企业一致
            agentid: agentid, // 必填，企业微信的应用id （e.g. 1000247）
            timestamp:timestamp , // 必填，生成签名的时间戳
            nonceStr:noncestr, // 必填，生成签名的随机串
            signature: signature,// 必填，签名，见附录-JS-SDK使用权限签名算法
            jsApiList: ['selectExternalContact'], //必填
            success: function (res) {
                // 回调
                console.log('agentConfig success',res);
            },
            fail: function (res) {
                if (res.errMsg.indexOf('function not exist') > -1) {
                    alert('版本过低请升级')
                }
            }
        });
    });

}
start()



