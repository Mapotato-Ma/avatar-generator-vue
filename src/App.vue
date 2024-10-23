<template>
  <div class="home">
    <div class="slide">
      <div
        class="part"
        :class="{ active: item.key === currentPart }"
        @click="switchPart(item.key)"
        v-for="item in [{ key: 'bg', label: '背景' }, ...parts]"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="view" :style="{ backgroundColor: bgColor }">
      <div :class="[key]" v-for="{ key } in parts" v-html="getPart(key)"></div>
    </div>
    <div class="resources">
      <div
        class="icon"
        :class="{ active: selectedParts.get(currentPart) === '' }"
        @click="selectedParts.set(currentPart, '')"
      ></div>
      <div class="icon" :style="{ backgroundColor: bgColor }" v-if="currentPart === 'bg'">
        <input type="color" name="bg" id="bg" v-model="bgColor" />
      </div>
      <div class="icons" :style="{ backgroundColor: bgColor }" v-if="currentPart === 'bg'">
        <div
          class="icon"
          :class="{ active: bgColor === color }"
          v-for="color in BG_COLORS"
          :key="color"
          :style="{ backgroundColor: color }"
          @click="bgColor = color"
        ></div>
      </div>
      <div
        class="icon"
        :class="{ active: selectedParts.get(currentPart) === iconName }"
        v-for="[iconName, iconSvg] in Object.entries(currentLibrary)"
        :key="iconName"
        v-html="iconSvg"
        :title="'>>>>>>>>>>' + iconName"
        @click="selectedParts.set(currentPart, iconName)"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { iconMap } from './assets/icons';
import { BG_COLORS } from './common/const';

const parts = [
  { key: 'face', label: '脸' },
  { key: 'eyes', label: '眼睛' },
  { key: 'decoration', label: '配饰' },
  { key: 'mouth', label: '嘴巴' },
  { key: 'clothes', label: '着装' },
  { key: 'hair', label: '头发' },
  { key: 'mask', label: '遮罩' },
];

const currentPart = ref('face');

const currentLibrary = computed(() => {
  return iconMap[currentPart.value] ?? {};
});

const bgColor = ref('#fff');

const selectedParts = ref<Map<string, string | undefined>>(
  new Map([
    ['decoration', '眼镜'],
    ['hair', '15'],
    ['mouth', '露牙齿'],
    ['eyes', '悲伤'],
    ['clothes', '时尚夹克'],
    ['face', '白皙肤色'],
    ['mask', undefined],
  ])
);

const getPart = (part: string) => {
  return iconMap[part]?.[selectedParts.value.get(part) ?? ''] ?? '';
};

const switchPart = (part: string) => {
  currentPart.value = part;
};
</script>

<style scoped>
.home {
  padding: 2rem;
  border-radius: 2rem;
  max-width: 800px;
  min-width: 500px;
  height: 30rem;
  border: 25px solid #ffc400;
  display: grid;
  align-items: center;
  grid-template-columns: fit-content(300px) 1fr fit-content(300px);
  gap: 2em;
  background: #636363;
}

.slide {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
  border-radius: 1rem;
  justify-content: center;

  .part {
    color: #fff;
    cursor: pointer;
    border-radius: 0.2rem;
    padding: 0.2rem 0.5rem;
    outline: 2.5px solid #ffc400;
    transition: background-color 0.2s;
    &:hover {
      background-color: #ffc400a9;
    }
    &.active {
      background-color: #ff8800;
    }
  }
}

.view {
  position: relative;
  width: 300px;
  aspect-ratio: 1;
  border-radius: 100%;
  outline: 3px dashed rgba(255, 196, 0, 0.5);
  overflow: hidden;

  > div {
    position: absolute;
    z-index: 1;
  }
  .face {
    top: 56px;
    left: 43px;
  }
  .hair {
    top: 36px;
    left: 26px;
  }
  .eyes {
    top: 106px;
    left: 144px;
  }
  .mouth {
    top: 169px;
    left: 160px;
  }
  .clothes {
    top: 187px;
    left: 14px;
  }
  .decoration {
    top: 119px;
    left: 90px;
  }
}

.resources {
  height: 100%;
  border-radius: 1rem;
  overflow: auto;
  padding: 1rem;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(2, 3rem);
  align-content: flex-start;
  align-items: stretch;
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3px;
    cursor: pointer;
    width: 100%;
    aspect-ratio: 1.1;
    border-radius: 1rem;
    border: 2.5px solid #ffc400;
    transition: background-color 0.2s;
    &:has(input) {
      padding: 0;
    }
    input {
      opacity: 0;
    }
    &:hover {
      background-color: #ffc400a9;
    }
    &.active {
      background-color: #ff8800;
    }
  }
}
</style>

<style>
.resources svg {
  width: 100%;
  height: 100%;
}
</style>
