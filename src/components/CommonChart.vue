<template>
    <div class="weatherInfo">
        <div class="forecasts">
            <div class="weather" v-for="list in WeatherStore.WeatherLists" :key="list.date">
                <span>{{ list.week }}</span>
                <span>{{ list.date }}</span>
                <span>{{ list.weather }}</span>
                <span>风力 {{ list.power }}级</span>
            </div>
        </div>
        <div class="chart">
            <v-chart :option="option"></v-chart>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useWeatherStore } from '@/stores/counter'
import { defineProps } from 'vue';
const props = defineProps({
    city: String,
    adcode: String
});
const key = ref('')
let city = ref('')
let adcode = ref('')
const option = ref({})
const WeatherStore = useWeatherStore()
function renderChart(data) {
    option.value = {
        xAxis: {
            type: 'category',
            data: data.date,
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value',
            interval: 0
        },
        grid: {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        },
        series: [
            {
                name: '白天温度',
                type: 'line',
                data: data.daytemp,
                smooth: true,
                label: {
                    show: true,
                    position: 'bottom', // 标签位置
                    formatter: function (params) {
                        return `白${params.value}℃`;
                    },
                    backgroundColor: 'transparent',
                    color: '#FFF',
                    offset: [-25, 2]
                }
            },
            {
                name: '夜间温度',
                type: 'line',
                data: data.nighttemp,
                smooth: true,
                label: {
                    show: true,
                    position: 'top', // 标签位置
                    formatter: function (params) {
                        return `晚${params.value}℃`;
                    },
                    backgroundColor: 'transparent',
                    color: '#FFF',
                    offset: [25, 2]
                }
            }
        ]
    }
}
watch(() => [props.city, props.adcode], async (newValues) => {
    const [newCity, newAdcode] = newValues;
    city.value = newCity;
    adcode.value = newAdcode;
    key.value = WeatherStore.key;
    await WeatherStore.getWeather(adcode.value,key.value,'all')
    renderChart(WeatherStore.WeatherInfo)
}, { immediate: true });
</script>

<style lang="scss" scoped>
.weatherInfo {
    padding-top: 2.5rem;
    padding-bottom: 1rem;
    padding-left: 3rem;
    padding-right: 3rem;
    background-color: rgb(0, 78, 113);
    border-radius: 0.25rem;
    margin-top: 0.5rem;

    .forecasts {
        display: flex;
        gap: 1.5rem;

        .weather {
            display: flex;
            flex-direction: column;
            text-align: center;
            gap: 1rem;
            flex: 1 1 0%;
        }
    }

    .chart {
        margin-top: 2.5rem;
        height: 10rem;
    }
}
</style>