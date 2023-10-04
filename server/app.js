// eslint-disable-next-line no-undef
var fs = require('fs') // 引入Node.js的文件系统模块，用于读取文件
// eslint-disable-next-line no-undef
var http = require('http') // 引入Node.js的HTTP模块，用于创建HTTP服务器
var server = http.createServer() // 创建一个新的HTTP服务器实例

// 让服务器开始监听3006端口。一旦服务器成功启动并开始监听，就会执行回调函数
server.listen(3006, () => {
  console.log('服务器启动成功，数据接口地址：', 'http://127.0.0.1:3006/') // 在控制台输出服务器启动成功的消息
})

// 当服务器收到客户端的请求时，会触发'request'事件，并执行此回调函数
server.on('request', (req, res) => {
  // 设置响应头，允许任何源进行跨域请求
  res.setHeader('Access-Control-Allow-Origin', '*')
  // 设置响应头，允许客户端使用POST, GET, 和OPTIONS方法
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  // 设置响应头，允许X-PINGOTHER和Content-Type这两种类型的请求头
  res.setHeader('Access-Control-Allow-Headers', 'X-PINGOTHER, Content-Type')

  // 检查请求的URL路径是否为'/point'
  if (req.url == '/') {
    fs.readFile('./data.json', 'utf-8', (err, datas) => {
      res.setHeader('Content-type', 'application/json; charset=utf-8')
      res.end(datas)
    })
  } else {
    // 如果请求的URL路径不是'/point'，则尝试根据URL路径读取相应的.json文件
    fs.readFile('./' + req.url + '.json', 'utf-8', (err, datas) => {
      // 如果读取文件时发生错误，设置响应头的Content-type为text/plain，并返回错误消息
      if (err) {
        res.setHeader('Content-type', 'text/plain;charset=utf-8')
        res.end('请求地址有误')
      } else {
        // 如果读取文件成功，设置响应头的Content-type为application/json，并返回文件内容
        res.setHeader('Content-type', 'application/json; charset=utf-8')
        res.end(datas)
      }
    })
  }
})
