<template>
  <div class="app">
    <TopHeader @toggleShade="toggleShade" />
    <router-view></router-view>
  </div>
  <div :class="isShadeVisible > 0 ? 'shade' : 'hide'">
    <div class="notion">
      <h2>关于:</h2>
      <p>这个应用可以用来追踪你选择城市的当前天气</p>
      <h2>如何使用:</h2>
      <p>
        1.点击搜索框输入你希望追踪的城市<br>
        2.在搜索结果中选中一个城市，你将获取当地最新的天气<br>
        3.点击右侧的＋号可以将追踪城市的天气情况保存在首页
      </p>
      <h2>移除城市:</h2>
      <p> 如果你不想在首页关注某个城市,可以通过底部的按钮删<br>除它 </p>
      <button @click="toggleShade">关闭</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TopHeader from '@/components/TopHeader.vue'
const isShadeVisible = ref(false)
function toggleShade() {
  isShadeVisible.value = !isShadeVisible.value
}
</script>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100%;
  padding-bottom: 2%;
  position: relative;
}

.shade,
.hide {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  justify-content: center;
  align-items: flex-start;
  z-index: 20;
  transition: opacity 0.7s ease-in-out, visibility 0.7s;

  .notion {
    position: relative;
    padding: 1rem;
    max-width: 768px;
    background-color: white;
    margin-top: 8rem;

    h2 {
      font-size: 16px;
      color: #000000;
      font-weight: 400;
    }

    p {
      font-size: 0.75rem;
      line-height: 1rem;
      margin-bottom: 1rem;
    }

    button {
      font-size: 0.75rem;
      line-height: 1rem;
      padding: 0.5rem 1.5rem;
      color: white;
      border: none;
      background-color: rgb(0, 102, 138);
      margin-top: 1rem;
      cursor: pointer;
    }
  }
}

.shade {
  opacity: 1;
}

.hide {
  visibility: hidden;
  opacity: 0;
}
</style>