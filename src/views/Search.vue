<template>
    <div class="search">
        <div class="center" style="color: white; text-align: center;font-size: 16px;" v-if="!dataLoaded">天气信息加载中...</div>
        <div v-else>
            <div class="tip">
                你正在预览{{ city }}的天气信息<span style="font-size: 16px;"
                    v-if="!WeatherStore.checkdata(adcode)">，可以通过右上角的"+"号按钮保存起来</span>
            </div>
            <div class="info center">
                <h1>当日气温是：{{ WeatherStore.Weather.temperature }}摄氏度</h1>
                <h1>当日天气是：{{ WeatherStore.Weather.weather }}</h1>
                <h1>当日风向是：{{ WeatherStore.Weather.winddirection }}风</h1>
                <h1>当日风力是：{{ WeatherStore.Weather.windpower }}级</h1>
            </div>
            <hr>
            <CommonChart class="center" :city="city" :adcode="adcode" />
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useWeatherStore } from '@/stores/counter'
import CommonChart from '@/components/CommonChart.vue'
const dataLoaded = ref(false);
const route = useRoute()
const key = ref('')
const adcode = ref('')
const city = ref('')
const WeatherStore = useWeatherStore()
watch([() => route.params.adecode, () => route.query.search], async ([newAdcode, newCity]) => {
    dataLoaded.value = false;
    adcode.value = newAdcode;
    city.value = newCity;
    key.value = WeatherStore.key;
    await WeatherStore.getWeather(adcode.value, key.value, 'base');
    dataLoaded.value = true;
    WeatherStore.getSearchInfo(newAdcode, newCity, WeatherStore.Weather.temperature)
}, { immediate: true });
</script>

<style lang="scss" scoped>
.search {
    display: flex;
    flex-direction: column;

    .tip {
        padding: 0.5rem;
        font-size: 16px;
        line-height: 16px;
        color: white;
        text-align: center;
        background-color: rgb(0, 78, 113);
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-top: 1.5rem;
        text-align: center;
    }

    hr {
        border: 1px solid rgba(255, 255, 255, 0.1);
        margin-top: 1.5rem;
    }
}
</style>