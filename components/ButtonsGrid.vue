<template>
  <div
    class="buttons-grid grid gap-10 md:gap-x-30 justify-center"
    :class="{ 'buttons-grid--large': large }"
  >
    <div
      v-for="(item, index) of items"
      :key="index.toString()"
      class="text-center rounded bg-opacity-90"
      :class="theme === 'orange' ? 'bg-orange-200' : 'bg-olive-400'"
    >
      <nuxt-link
        :to="item.url"
        class="flex justify-center items-end w-full h-full relative text-center p-8"
      >
        <img
          :src="item.image.url"
          :alt="item.label"
          class="buttons-grid__image absolute top-0 left-half transform -translate-x-1/2"
        />
        <span class="text-white text-14 md:text-18 relative z-1">
          {{ item.label }}
        </span>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { validateArrayOfObject } from '@/utils'
export default {
  props: {
    theme: {
      type: String,
      default: 'primary',
    },
    items: {
      type: Array,
      default: () => [],
      validator: (data) => {
        const keys = ['image', 'label', 'url']
        return validateArrayOfObject(keys, data)
      },
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style>
.buttons-grid {
  grid-template-columns: repeat(2, 140px);
  grid-auto-rows: 104px;
  @media only screen and (max-height: 640px) and (orientation: portrait) {
    grid-template-columns: repeat(2, 128px);
    grid-auto-rows: 96px;
  }
  @media only screen and (min-width: 414px) {
    grid-template-columns: repeat(2, 160px);
    grid-auto-rows: 120px;
  }
  &:not(.buttons-grid--large) {
    @screen md {
      grid-template-columns: repeat(2, 212px);
      grid-auto-rows: 160px;
    }
  }
  &--large {
    @screen md {
      grid-template-columns: repeat(auto-fit, 212px);
      grid-template-rows: repeat(2, 160px);
      grid-auto-rows: auto;
      grid-auto-flow: column;
    }
  }
  &__image {
    max-width: 90%;
    @media only screen and (min-width: 375px) {
      max-width: 100%;
    }
  }
}
</style>
