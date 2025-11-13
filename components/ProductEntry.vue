<template>
  <div class="product-entry flex items-center" :class="{ 'mx-auto': center }">
    <div v-if="img" class="product-entry__image-container">
      <nuxt-link :to="ctaUrl">
        <datocms-image
          :data="{ ...img.responsiveImage, alt: img.alt }"
          object-fit="contain"
          class="product-entry__image w-full h-full object-contain object-center"
        />
      </nuxt-link>
    </div>
    <div class="product-entry__content flex-1 ml-10">
      <nuxt-link :to="ctaUrl" class="block mb-8">
        <h2 v-if="!titleH3" class="text-20 font-title text-primary font-medium">
          {{ title }}
        </h2>
        <h3 v-else class="text-20 font-title text-primary font-medium">
          {{ title }}
        </h3>
      </nuxt-link>
      <div class="text-12 md:text-14 leading-tight text-gray-300">
        <span v-for="(tag, index) of tags" :key="index.toString()">
          {{ tag }}
          <span v-if="index < tags.length - 1">|</span>
        </span>
      </div>
      <div class="flex items-center mt-28">
        <nuxt-link :to="ctaUrl" class="mr-8 uppercase text-primary font-bold">
          {{ ctaLabel }}
        </nuxt-link>
        <ChevronDown class="transform -rotate-90" />
      </div>
    </div>
  </div>
</template>

<script>
import ChevronDown from '@/assets/icons/chevron-down.svg?inline'
export default {
  components: {
    ChevronDown,
  },
  props: {
    img: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: '',
    },
    ctaLabel: {
      type: String,
      default: '',
    },
    ctaUrl: {
      type: String,
      default: '/',
    },
    center: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: Array,
      required: true,
      validator: (data) => {
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i] !== 'string') {
            return false
          }
        }
        return true
      },
    },
    titleH3: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.product-entry {
  @screen md {
    max-width: 356px;
  }
  &__image-container {
    width: 41vw;
    height: 38vw;
    max-width: 170px;
    max-height: 160px;
    @screen md {
      width: 153px;
      height: 144px;
      max-width: none;
      max-height: none;
    }
  }
}
</style>
