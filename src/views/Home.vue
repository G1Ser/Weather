<template>
    <main class="main center">
        <div class="search">
            <input type="text" placeholder="请输入城市名称" v-model="text" @input="MatchCity" />
            <div :class="[hide ? 'opacity-1' : 'opacity-0', isCursor ? 'cursor' : '']" @click="SearchWeather">{{ tip }}
            </div>
        </div>
        <div class="citylists" :class="!hide ? 'opacity-1' : 'opacity-0'">
            <div class="listcontent" v-for="localdata in localdataList" :key="localdata.adcode"
                @mouseenter="ShowOperate(localdata.adcode)" @mouseleave="CloseOperate" v-if="localdataList.length > 0">
                <div :class="isShow === localdata.adcode ? 'w-80' : 'content'">
                    <h3>{{ localdata.city }}</h3>
                    <span>{{ localdata.temperature }}度</span>
                </div>
                <div v-if="isShow === localdata.adcode" class="operate">
                    <button @click="ShowWeather(localdata.adcode, localdata.city)">查看</button>
                    <button @click="handledelete(localdata.adcode)">删除</button>
                </div>
            </div>
            <h2 v-else> 暂时没有保存过城市天气信息，请查询后点击右上角"+"号保存。</h2>
        </div>
        <h2 style="margin-top: 1.5rem;">近期天气</h2>
        <CommonChart :city="city" :adcode="adcode" />
    </main>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/counter'
import CommonChart from '@/components/CommonChart.vue';
const route = useRouter()
const WeatherStore = useWeatherStore()
const localdataList = ref(null)
let isShow = ref(null)
let hide = ref(false)
let isCursor = ref(false)
let tip = ref('')
let debounceTimer = null;
const text = ref('')
const key = ref('')
const city = ref('')
const adcode = ref('')
const _city = ref('')
const _adcode = ref('')
function ShowOperate(id) {
    isShow.value = id
}
function CloseOperate() {
    isShow.value = null
}
function debounce(func, delay = 500) {
    return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
async function SearchWeather() {
    if (tip.value !== '似乎没有找到你查找的城市') {
        route.push(`/weather/${_adcode.value}?search=${_city.value}`)
    } else {
    }
}
function ShowWeather(adcode, city) {
    route.push(`/weather/${adcode}?search=${city}`)
}
function handledelete(adcode) {
    WeatherStore.deldata(adcode)
}
const MatchCity = debounce(async () => {
    key.value = WeatherStore.key
    if (text.value !== '') {
        hide.value = true
        const errorMessage = await WeatherStore.getAdecode(text.value, key.value)
        if (errorMessage) {
            tip.value = errorMessage
        } else {
            if (WeatherStore.Address.district.length > 0) {
                tip.value = WeatherStore.Address.district;
                _city.value = WeatherStore.Address.district;
            } else if (WeatherStore.Address.city.length > 0) {
                tip.value = WeatherStore.Address.city;
                _city.value = WeatherStore.Address.city;
            } else if (WeatherStore.Address.province.length > 0) {
                tip.value = WeatherStore.Address.province;
                _city.value = WeatherStore.Address.province;
            }
            else {
                tip.value = '似乎没有找到你查找的城市'
            }
            _adcode.value = WeatherStore.Address.adcode;
        }
    } else {
        hide.value = false
        tip.value = ''
        _city.value = ''
        _adcode.value = ''
    }
});
onMounted(async () => {
    key.value = WeatherStore.key
    const res = await WeatherStore.getLocallocation(key.value)
    city.value = res.city
    adcode.value = res.adcode
})
watch([() => tip.value, () => WeatherStore.DataList], ([newtip, newList]) => {
    if (newtip !== '似乎没有找到你查找的城市' && newtip !== '对不起网络似乎出了点问题 请稍后再查询') {
        isCursor.value = true;
    } else {
        isCursor.value = false;
    }
    localdataList.value = newList;
}, { immediate: true });
</script>

<style lang="scss" scoped>
.main {
    padding: 0 1.5rem;

    .search {
        padding-top: 1rem;
        margin-bottom: 2rem;
        position: relative;

        div {
            position: absolute;
            top: 55px;
            width: 100%;
            --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);
            --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
            box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
            color: white;
            padding: 0.5rem 0.25rem;
            background-color: rgb(0 78 113);
        }

        input[type='text'] {
            width: 100%;
            font-size: 100%;
            color: white;
            padding: 0.5rem 0.25rem;
            background-color: transparent;
            border: none;
            outline: 2px solid transparent;
            outline-offset: 2px;
            border-bottom: 1px solid #e5e7eb;

            &:focus {
                border-color: rgb(0, 78, 113);
                --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);
                --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
                box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)
            }

            &::placeholder {
                opacity: 1;
                color: #9ca3af;
            }
        }
    }

    .citylists {
        margin-top: 2.5rem;
        max-height: 300px;
        overflow-y: auto;

        &::-webkit-scrollbar {
            width: 1%;
        }

        h2 {
            text-align: center;
            transition-duration: .2s;
        }

        .listcontent {
            display: flex;
            justify-content: space-between;

            .content,
            .w-80 {
                display: flex;
                justify-content: space-between;
                padding: 0.5rem 1rem;
                margin-bottom: 1rem;
                background-color: rgb(0, 78, 113);
                transition-duration: 0.5s;
                cursor: pointer;
            }

            .content {
                width: 100%;
            }

            .w-80 {
                width: 75%;
            }

            .operate {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;

                button {
                    width: 80px;
                    text-align: center;
                    background-color: rgb(234, 179, 8);
                    cursor: pointer;
                }
            }
        }
    }
}
</style>