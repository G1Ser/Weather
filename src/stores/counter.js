import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { all } from 'axios'

export const useWeatherStore = defineStore('weather', () => {
  const key = ref('66a865570fd1e4a0c42f5a173ec8d7d9')
  const cityInfo = ref({
    adcode: '',
    city: '',
    temperature: ''
  })
  const LocalWeather = ref({
    weather: '',
    temperature: '',
    winddirection: '',
    windpower: ''
  })
  const Address = ref({
    adcode: [],
    province: [],
    city: [],
    district: []
  })
  const Weather = ref({
    weather: '',
    temperature: '',
    winddirection: '',
    windpower: ''
  })
  const WeatherInfo = ref({
    date: [],
    daytemp: [],
    nighttemp: []
  })
  const WeatherLists = ref(null)
  const getLocallocation = async (key) => {
    const res = await axios.get(`https://restapi.amap.com/v3/ip?key=${key}`)
    return { 'city': res.data.city, 'adcode': res.data.adcode }
  }
  const getAdecode = async (address, key) => {
    try {
      const res = await axios.get(`https://restapi.amap.com/v3/geocode/geo?address=${address}&key=${key}`)
      if (res.data.status === '1') {
        Address.value = {
          adcode: res.data.geocodes[0].adcode,
          province: res.data.geocodes[0].province,
          city: res.data.geocodes[0].city,
          district: res.data.geocodes[0].district
        }
      }
      else {
        Address.value = {
          adcode: [],
          province: [],
          city: [],
          district: []
        }
      }
    }catch(error){
      return "对不起网络似乎出了点问题 请稍后再查询"
    }
  }
  const getLocalWeather = async (city, key, extensions) => {
    const res = await axios.get(`https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=${key}&extensions=${extensions}`)
    if (extensions === 'base') {
      LocalWeather.value = {
        weather: res.data.lives[0].weather,
        temperature: res.data.lives[0].temperature,
        winddirection: res.data.lives[0].winddirection,
        windpower: res.data.lives[0].windpower
      }
    }
  }
  const getWeather = async (city, key, extensions) => {
    const res = await axios.get(`https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=${key}&extensions=${extensions}`)
    if (extensions === 'base') {
      Weather.value = {
        weather: res.data.lives[0].weather,
        temperature: res.data.lives[0].temperature,
        winddirection: res.data.lives[0].winddirection,
        windpower: res.data.lives[0].windpower
      }
    }
    if (extensions === 'all') {
      const forecasts = res.data.forecasts[0].casts
      WeatherLists.value = formatcasts(forecasts)
      getChartData(forecasts)
    }
  }
  function formatcasts(casts) {
    const today = new Date();
    const tomorrow = new Date();
    const currentHour = today.getHours()
    tomorrow.setDate(today.getDate() + 1);
    const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    casts.forEach(cast => {
      //格式化week
      const castDate = new Date(cast.date);
      if (castDate.toDateString() === today.toDateString()) {
        cast.week = "今天";
      } else if (castDate.toDateString() === tomorrow.toDateString()) {
        cast.week = "明天";
      } else {
        cast.week = weekDays[castDate.getDay()];
      }
      //格式化date
      const date = cast.date.split('-');
      cast.date = date[1] + '-' + date[2];
      //格式化weather和power
      if (currentHour >= 8 && currentHour < 18) {
        cast.weather = cast.dayweather;
        cast.power = cast.daypower;
      } else {
        cast.weather = cast.nightweather;
        cast.power = cast.nightpower;
      }
    })
    return casts
  }
  function getChartData(casts) {
    WeatherInfo.value.date = [];
    WeatherInfo.value.daytemp = [];
    WeatherInfo.value.nighttemp = [];
    casts.forEach(cast => {
      WeatherInfo.value.date.push(cast.date)
      WeatherInfo.value.daytemp.push(cast.daytemp)
      WeatherInfo.value.nighttemp.push(cast.nighttemp)
    })
  }
  function getSearchInfo(adcode, city, temperature) {
    cityInfo.value = {
      adcode: adcode,
      city: city,
      temperature: temperature
    }
  }
  const DataList = ref(loadData());
  function loadData() {
    const localData = localStorage.getItem('localdata');
    return localData ? JSON.parse(localData) : [];
  }
  function saveData() {
    localStorage.setItem('localdata', JSON.stringify(DataList.value))
  }
  function addData(cityInfo) {
    const citydata = {
      adcode: cityInfo.adcode,
      city: cityInfo.city,
      temperature: cityInfo.temperature
    }
    DataList.value.push(citydata)
    saveData()
  }
  function deldata(id) {
    DataList.value = DataList.value.filter(data => data.adcode !== id);
    saveData()
  }
  function checkdata(id) {
    return DataList.value.some(data => data.adcode === id);
  }
  return {
    key,
    LocalWeather,
    Address,
    Weather,
    WeatherInfo,
    WeatherLists,
    cityInfo,
    DataList,
    loadData,
    getLocallocation,
    getAdecode,
    getLocalWeather,
    getWeather,
    getSearchInfo,
    addData,
    deldata,
    checkdata
  }
})
