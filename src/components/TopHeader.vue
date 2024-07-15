<template>
    <header class="header shadow-lg">
        <nav class="container center">
            <router-link to="/">
                <div class="home">
                    <img src="@/assets/sun.svg">
                    <p>新中地天气</p>
                </div>
            </router-link>
            <div class="base">
                <h4>{{ city }}</h4>
                <span>实时天气：{{ WeatherStore.LocalWeather.weather }} {{ WeatherStore.LocalWeather.temperature }}℃</span>
                <span>{{ WeatherStore.LocalWeather.winddirection }}风{{ WeatherStore.LocalWeather.windpower }}级</span>
            </div>
            <div class="tip">
                <img src="@/assets/tip.svg" @click="showTip">
                <img src="@/assets/add.svg" v-if="isSearchRoute" @click="handlesave" :class="WeatherStore.checkdata(_adcode)?'fade-out':'opacity-1'">
            </div>
        </nav>
    </header>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useWeatherStore } from '@/stores/counter'
import { ref, defineEmits, onMounted, computed,watch} from 'vue';
const route = useRoute();
const key = ref('')
const city = ref('')
const adcode = ref('')
const emit = defineEmits(['toggleShade'])
const _adcode = ref('')
const WeatherStore = useWeatherStore()
function showTip() {
    emit('toggleShade')
}
function handlesave(){
    WeatherStore.addData(WeatherStore.cityInfo)
}
onMounted(async () => {
    key.value = WeatherStore.key
    const res = await WeatherStore.getLocallocation(key.value)
    city.value = res.city
    adcode.value = res.adcode
    await WeatherStore.getLocalWeather(adcode.value, key.value, 'base')
})
const isSearchRoute = computed(() => route.path.startsWith('/weather/'));
watch(() => WeatherStore.cityInfo.adcode, (newAdcode) => {
    _adcode.value = newAdcode
}, { immediate: true });
</script>

<style lang="scss" scoped>
.header {
    position: sticky;
    top: 0px;
    width: 100%;
    z-index: 10;
    background-color: rgb(0, 102, 138);

    .container {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        padding: 1.5rem;
    }

    .home {
        display: flex;
        gap: 0.75rem;

        p {
            font-size: 1.5rem;
            line-height: 2rem;
        }
    }

    .base {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .tip {
        display: flex;
        flex: 1 1 0%;
        justify-content: flex-end;
        gap: 0.75rem;
        cursor: pointer;
    }
}
</style>