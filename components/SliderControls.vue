<template>
  <div class="slider-controls flex justify-center items-center">
    <button
      class="slider-controls__btn relative slider-controls__btn--prev w-24 h-24 focus:outline-none flex-shrink-0 cursor-pointer mr-16"
      @click="prev"
    >
      <ArrowLeft
        class="absolute top-half left-half transform -translate-x-1/2 -translate-y-1/2 w-12"
      />
    </button>
    <div class="slider-controls__dots flex-shrink-0 flex items-center">
      <span
        v-for="i in slides"
        :key="i - 1"
        class="slider-controls__dot w-8 h-8 rounded-circle cursor-pointer transform scale-1 transition duration-500 select-none"
        :class="{
          'bg-gray-250': currentSlide !== i - 1,
          'w-12 h-12 bg-cream-250 scale-150': currentSlide === i - 1,
          'mr-16': i < slides,
        }"
        @click="$emit('dotClicked', i - 1)"
      >
        &nbsp;
      </span>
    </div>
    <button
      class="slider-controls__btn relative slider-controls__btn--next w-24 h-24 focus:outline-none flex-shrink-0 cursor-pointer ml-16"
      @click="next"
    >
      <ArrowRight
        class="absolute top-half left-half transform -translate-x-1/2 -translate-y-1/2 w-12"
      />
    </button>
  </div>
</template>
<script>
import ArrowLeft from '@/assets/icons/arrow-left.svg?inline'
import ArrowRight from '@/assets/icons/arrow-right.svg?inline'
export default {
  components: {
    ArrowLeft,
    ArrowRight,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: {
    slides: {
      type: Number,
      required: true,
    },
    currentSlide: {
      type: Number,
      required: true,
    },
    prev: {
      type: Function,
      required: true,
    },
    next: {
      type: Function,
      required: true,
    },
  },
}
</script>
<style>
.slider-controls {
  /* a */
}
</style>
