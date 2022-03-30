import axios from "axios"
import qs from "qs"
axios.defaults.timeout = 3000   //响应时间
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';        //配置请求头
axios.defaults.baseURL = process.env.NODE_HOST;   //配置接口地址
axios.defaults.withCredentials = true
console.log(process.env)
//POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    //在发送请求之前做某件事
    let token = sessionStorage.getItem('access_token') || ""  //获取token 
    console.log(token)
    if (token != "") {
        config.headers = {
            'access-token': token,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    if (config.method === 'post') {
        config.data = qs.stringify(config.data)//序列化post 参数
    }
    return config;
}, (error) => {
    console.log('错误的传参')

    return Promise.reject(error);
});
//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
    //对响应数据做些事
    if (!res.data.success) {
        let newToken = res.data.token    //成功后更新token 
        localStorage.setItem('access_token', newToken)

    }
    return res;
}, (error) => {
    if (error.response.data.status == '401') {    //如果token 过期 则跳转到登录页面
        this.$router.push('/login');
    }
    return Promise.reject(error);
});
//返回一个Promise(发送post请求)
function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params)
            .then(response => {
                resolve(response);
            }, err => {
                reject(err);
            })
            .catch((error) => {
                reject(error)
            })
    })
}
////返回一个Promise(发送get请求)
function get(url, param) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params: param })
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}
export default {
    get,
    post,
}