##### 这是一个基于 Vue 3 框架的项目，集成了高德地图 API，并使用 Echarts 技术，完成的一个城市天气预览应用。希望这个项目能为你提供帮助！

###### 项目配置
去高德地图申请一个Web服务密钥。
```
// index.html 11行 设置你Web端密钥对应的安全密钥
securityJsCode: '<Your SecurityJsCode>'
// index.html 15行 设置你Web端的密钥
src="https://webapi.amap.com/maps?v=2.0&key=<Your JsKey>&plugin=AMap.Driving">
// ./src/stores/GaoDe.js 11行 设置你Web服务的密钥
const key = ref('<Your Key>')
```

###### 项目运行
```
npm install

npm run dev
```

###### 线上地址
https://43.139.219.105/startsbucksmap/
