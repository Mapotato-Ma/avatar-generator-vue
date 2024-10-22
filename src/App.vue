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
    <div class="view">
      <div class="bg"></div>
      <div :class="[key]" v-for="{ key } in parts" v-html="getPart(key)"></div>
    </div>
    <div class="resources">
      <div
        class="icon"
        :class="{ active: selectedParts.get(currentPart) === '' }"
        @click="selectedParts.set(currentPart, '')"
      ></div>
      <div
        class="icon"
        :class="{ active: selectedParts.get(currentPart) === iconName }"
        v-for="[iconName, iconSvg] in Object.entries(currentLibrary)"
        :key="iconName"
        v-html="iconSvg"
        @click="selectedParts.set(currentPart, iconName)"
      ></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { iconMap } from './assets/icons';

const parts = [
  { key: 'face', label: '脸' },
  { key: 'eyes', label: '眼睛' },
  { key: 'hair', label: '头发' },
  { key: 'decoration', label: '配饰' },
  { key: 'mouth', label: '嘴巴' },
  { key: 'clothes', label: '着装' },
  { key: 'mask', label: '遮罩' },
];

const currentPart = ref('hair');

const currentLibrary = computed(() => {
  return iconMap[currentPart.value] ?? {};
});

const selectedParts = ref<Map<string, string | undefined>>(
  new Map([
    ['bg', undefined],
    ['decoration', undefined],
    ['hair', undefined],
    ['mouth', undefined],
    ['eyes', undefined],
    ['clothes', undefined],
    ['face', undefined],
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
  background-color: #7d8c8cbd;
  display: grid;
  align-items: center;
  grid-template-columns: fit-content(300px) 1fr fit-content(300px);
  gap: 2em;
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
  width: 250px;
  aspect-ratio: 1;
  border-radius: 100%;
  overflow: hidden;

  > div {
    position: absolute;
    z-index: 1;
  }

  .bg {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 200, 255, 0.38);
  }
  .face {
    top: 140px;
    left: 120px;
  }
  .hair {
    top: 100px;
    left: 130px;
  }
  .eyes {
    top: 95px;
    left: 170px;
  }
  .mouth {
    top: 140px;
    left: 153px;
  }
  .clothes {
    top: 242px;
    left: 138px;
  }
  .decoration {
    top: 144px;
    left: 141px;
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
    cursor: pointer;
    width: 100%;
    aspect-ratio: 1.1;
    border-radius: 1rem;
    border: 2.5px solid #ffc400;
    transition: background-color 0.2s;
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

.view > div:not(.bg) {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
