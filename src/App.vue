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
    <div class="view" id="view" :style="{ backgroundColor: bgColor }">
      <div
          :class="[key]"
          v-for="{ key, position: { x, y } } in parts"
          :id="key"
          v-html="getPart(key)"
          :style="{ left: `${x}px`, top: `${y}px` }"
      ></div>
      <video ref="selfie" width="300" height="300"></video>
      <img
          v-if="selectedParts.get('face')?.includes('data:image/png;base64')"
          :src="selectedParts.get('face')"
          width="300"
          height="300"
          alt="脸"/>
      <canvas ref="canvas" width="300" height="300"></canvas>
    </div>
    <div class="resources">
      <div class="icon icon-camera" v-show="currentPart === 'face'">
        <i class="icon-play" @click="recording">▶</i>
        <i class="icon-shot" @click="screenshot">✂</i>
        <i class="icon-stop" @click="stopRecording"></i>
      </div>
      <div
          class="icon"
          :class="{ active: selectedParts.get(currentPart) === '' }"
          @click="selectedParts.set(currentPart, '')"
          v-if="currentPart !== 'bg'"
      ></div>
      <div class="icon icon-bg-select" :style="{ backgroundColor: bgColor }" v-if="currentPart === 'bg'">
        <input type="color" name="bg" id="bg" v-model="bgColor"/>
      </div>
      <div
          class="icon icon-bg"
          :class="{ active: bgColor === color }"
          v-for="color in BG_COLORS"
          :key="color"
          :style="{ backgroundColor: color }"
          @click="bgColor = color"
          v-show="currentPart === 'bg'"
      ></div>
      <div
          class="icon"
          :class="{ active: selectedParts.get(currentPart) === iconName }"
          v-for="[iconName, iconSvg] in Object.entries(currentLibrary)"
          :key="iconName"
          v-html="iconSvg"
          @click="selectedParts.set(currentPart, iconName)"
      ></div>
      <div
          class="icon"
          :class="{ active: selectedParts.get(currentPart) === png }"
          v-for="png in storage"
          v-show="currentPart === 'face'"
          @click="selectedParts.set('face', png)"
      >
        <img :src="png" alt="" srcset=""/>
      </div>
    </div>
    <div class="btn" @click="exportAvatarWithPng"></div>
  </div>
</template>
<script setup lang="ts">
import {computed, onMounted, ref, useTemplateRef} from 'vue';
import {iconMap} from './assets/icons';
import {BG_COLORS} from './common/const';
import {useStorage} from '@vueuse/core';
import {Screenshot} from './common/screenshot.service';

const canvasEl = useTemplateRef('canvas');
const selfieEl = useTemplateRef('selfie');
const currentPart = ref('face');
const bgColor = ref('#FF7F50');
const playing = ref(false);
const storage = useStorage<string[]>('shots', []);
const screenShotInstance = ref<Screenshot>();

onMounted(() => {
  screenShotInstance.value = new Screenshot(selfieEl.value!);
});

const parts = [
  {key: 'face', label: '脸', position: {x: 43, y: 60}},
  {key: 'eyes', label: '眼睛', position: {x: 144, y: 110}},
  {key: 'mouth', label: '嘴巴', position: {x: 160, y: 173}},
  {key: 'clothes', label: '着装', position: {x: 14, y: 191}},
  {key: 'decoration', label: '配饰', position: {x: 90, y: 123}},
  {key: 'hair', label: '头发', position: {x: 26, y: 40}},
];
const currentLibrary = computed(() => {
  return iconMap[currentPart.value] ?? {};
});
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
const getPart = (part: string) => iconMap[part]?.[selectedParts.value.get(part) ?? ''] ?? '';
const switchPart = (part: string) => (currentPart.value = part);
const exportAvatarWithPng = async () => {
  // 背景
  const draw = canvasEl.value?.getContext('2d')!;
  draw.fillStyle = bgColor.value;
  draw.fillRect(0, 0, 300, 300);
  // 自拍
  const selfie = document.querySelector('#view')?.getElementsByTagName('img')[0];
  if (selfie) {
    draw.drawImage(selfie, 0, 0, 300, 300);
  }
  // 配件
  const svgElements = document.querySelector('#view')?.querySelectorAll('svg') ?? [];
  const promises: Promise<void>[] = [];
  for (const svgElement of svgElements) {
    const [top, left] = [svgElement.parentElement!.style.top, svgElement.parentElement!.style.left].map((v) =>
        parseInt(v)
    );
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    promises.push(
        new Promise<void>((resolve) => {
          img.onload = function () {
            draw.drawImage(img, left, top);
            resolve();
          };
        })
    );
    img.src = 'data:image/svg+xml,' + encodeURIComponent(svgString);
  }
  await Promise.allSettled(promises);
  download(canvasEl.value?.toDataURL('image/png')!);
  draw.clearRect(0, 0, 300, 300);
};
const download = (url: string) => {
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'avatar.png';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const recording = () => {
  if (playing.value) {
    return;
  }
  navigator.mediaDevices.getUserMedia({video: {width: 300, height: 300}, audio: false}).then(
      (stream) => {
        selfieEl.value!.srcObject = stream;
        selfieEl.value?.play();
        playing.value = true;
      },
      () => {
        alert('无法获取您的美照');
      }
  );
};

const stopRecording = () => {
  selfieEl.value?.pause();
  selfieEl.value!.srcObject = null;
  playing.value = false;
};

const screenshot = () => {
  if (!playing.value) {
    return;
  }
  const png = screenShotInstance.value?.computeFrame(selfieEl.value!);
  storage.value.unshift(png!);
};
</script>

<style scoped>
.home {
  position: relative;
  padding: 2rem;
  border-radius: 2rem;
  max-width: 800px;
  height: 26rem;
  outline: 100px solid #ffc400;
  display: grid;
  align-items: center;
  grid-template-columns: fit-content(300px) 1fr fit-content(300px);
  gap: 2em;
  background: #636363;
  min-width: max-content;
  box-shadow: 0 0 170px 145px #4a7bd0;

  .btn {
    cursor: pointer;
    position: absolute;
    bottom: -5px;
    left: 50%;
    width: 90px;
    transform: translate(-50%, 100%);
    aspect-ratio: 1;
    background: aliceblue;
    border-radius: 100%;
    background: linear-gradient(45deg, #825dfd, #2f2f2f);

    &::after {
      content: '';
      position: absolute;
      inset: 30px;
      background: #ffc400b8;
      border-radius: 3px;
      transition: box-shadow 0.2s;
    }

    &:active::after {
      box-shadow: 0 0 20px 1px #f9e298;
    }
  }
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
    outline: 3px solid #ffc400;
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
  border: 3px solid rgba(255, 196, 0, 0.7);
  overflow: hidden;

  canvas {
    display: none;
  }

  video,
  img {
    position: absolute;
    left: 0;
    object-fit: cover;
  }

  > div {
    position: absolute;
    z-index: 1;
  }
}

.resources {
  height: 100%;
  border-radius: 1rem;
  overflow: auto;
  border: 1rem solid transparent;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(2, 3rem);
  grid-auto-rows: minmax(3rem, auto);
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
    border: 3px solid #ffc400;
    transition: background-color 0.2s;
    overflow: hidden;

    &.icon-bg-select {
      position: sticky;
      top: 0;
      cursor: pointer;
      grid-column: span 2;
      aspect-ratio: 3;
      border-radius: 0.2rem;
    }

    &.icon-bg {
      border-radius: 0.2rem;
    }

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

    &:has(img) {
      padding: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &.icon-camera {
      position: sticky;
      top: 0;
      width: 100%;
      aspect-ratio: 3;
      display: flex;
      gap: 0.5em;
      grid-column: span 2;
      justify-content: space-between;
      border: none;
      backdrop-filter: blur(28px);

      &:hover {
        background-color: transparent;
      }

      i {
        width: 2rem;
        aspect-ratio: 1;
        border-radius: 0.2em;
        background-color: #ff8800;
        display: grid;
        place-content: center;

        &.icon-stop {
          background-color: #fff;
          border: 7px solid #ff8800;
        }

        &:hover {
          opacity: 0.6;
        }
      }
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
