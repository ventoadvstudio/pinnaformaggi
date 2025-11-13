<template>
  <div
    class="scroll-indicator absolute left-half bottom-0 transform -translate-x-1/2 select-none cursor-pointer"
    :class="{ 'w-90 h-45': !large, 'w-125 h-54': large }"
    @click="$emit('click')"
  >
    <div
      class="scroll-indicator__text absolute top-0 left-half transform -translate-x-1/2 z-10 flex items-center"
    >
      <div
        v-for="(char, i) in label.split('')"
        :key="`char-${i}`"
        class="scroll-indicator__char-container absolute top-0 left-half"
        :class="{ 'h-45': !large, 'h-62': large }"
        :style="`transform: translateX(-50%) rotate(${
          (120 / (label.length - 1)) * i - 60
        }deg)`"
      >
        <span
          class="scroll-indicator__char block text-10 text-white font-title uppercase"
          :class="{
            'scroll-indicator__char--large': large,
          }"
        >
          {{ char }}
        </span>
      </div>
    </div>
    <div
      class="scroll-indicator__background relative overflow-hidden w-full h-full"
    >
      <div
        class="scroll-indicator__semicircle absolute top-0 left-half transform -translate-x-1/2 rounded-circle"
        :class="[semicircleColor, semicircleSize]"
      >
        &nbsp;
      </div>
      <TickGreen
        v-if="theme === 'secondary'"
        class="scroll-indicator__tick absolute top-half left-half transform -translate-x-1/2 -translate-y-1/2 z-1"
      />
      <Tick
        v-else
        class="scroll-indicator__tick absolute top-half left-half transform -translate-x-1/2 -translate-y-1/2 z-1"
      />
    </div>
  </div>
</template>
<script>
import Tick from '@/assets/icons/tick.svg?inline'
import TickGreen from '@/assets/icons/tick-green.svg?inline'
export default {
  components: {
    Tick,
    TickGreen,
  },
  props: {
    theme: {
      type: String,
      required: true,
      validator: (str) => {
        const allowedThemes = ['primary', 'secondary', 'orange', 'transparent']
        return allowedThemes.includes(str)
      },
    },
    label: {
      type: String,
      required: true,
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    semicircleColor() {
      return {
        'bg-olive-400': this.theme === 'primary',
        'bg-cream-400': this.theme === 'secondary',
        'bg-orange': this.theme === 'orange',
        'bg-transparent border border-white': this.theme === 'transparent',
      }
    },
    semicircleSize() {
      return {
        'w-90 h-90': !this.large,
        'w-125 h-125': this.large,
      }
    },
  },
}
</script>
<style>
.scroll-indicator {
  &__char-container {
    transform-origin: bottom center;
  }
  &__char {
    transform: translateY(-100%) translateY(-4px);
    &--large {
      transform: translateY(-100%) translateY(-6px);
    }
  }
}
</style>
