import superagent from 'superagent'
import { Message } from 'element-ui'

export const commonAjaxGet = (url) => {
  return new Promise((resolve, reject) => {
    superagent.get(url).set('X-Requested-With', 'XMLHttpRequest').withCredentials().end(function (err, res) {
      commonAjaxCallback(resolve, reject, err, res)
    })
  })
}

export const commonAjaxPost = (url, data) => {
  return new Promise((resolve, reject) => {
    superagent.post(url).set('X-Requested-With', 'XMLHttpRequest').type('form').send(data).withCredentials().end(function (err, res) {
      commonAjaxCallback(resolve, reject, err, res)
    })
  })
}

// commonAjaxCallback process the ajax callback before biz logic
let commonAjaxCallback = (resolve, reject, err, res) => {
  if (err) {
    console.log('网络异常! ', err)
    reject('网络异常')
  } else {
    resolve(JSON.parse(res.text));
  }
}

// 把一个数据对象转成 query string
export const constructQueryString = (data) => {
  let res = '?'
  for (let name in data) {
    data[name] = data[name] || ''
    res += (name + '=' + data[name] + '&')
  }
  return res.substr(0, res.length - 1)
}

function Unauth (link) {
  console.log('unauth url: ' + link)
}
