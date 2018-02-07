import axios from 'axios'

export const commonAjaxGet = (url) => {
  return axios.get(url).catch(err => {
    console.log(err);
  });

}

export const commonAjaxPost = (url, data) => {
  return axios.post(url, constructQueryString(data)).then(res=>{
    return res.data;
  }).catch(err => {
    console.log(err);
  });
 
}

// 把一个数据对象转成 query string
export const constructQueryString = (data) => {
  let res = ''
  for (let name in data) {
    data[name] = data[name] || ''
    res += (name + '=' + data[name] + '&')
  }
  return res.substr(0, res.length - 1)
}

function Unauth (link) {
  console.log('unauth url: ' + link)
}
