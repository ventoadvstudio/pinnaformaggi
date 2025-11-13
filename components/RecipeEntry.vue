<template>
  <div
    class="flex block bg-cream-150 cursor-pointer h-full"
    @click="$router.push(ctaUrl)"
  >
    <div class="w-2/5">
      <datocms-image
        v-if="img.responsiveImage"
        :data="{ ...img.responsiveImage, alt: img.alt }"
        object-fit="cover"
        class="w-full h-full object-cover"
      />
      <img
        v-else
        :src="img.responsiveImage ? img.responsiveImage.src : img.url"
        :alt="img.alt"
        class="w-full h-full object-cover"
      />
    </div>
    <div class="flex-1 p-16 flex flex-col justify-center">
      <h2
        v-if="!titleH3"
        class="font-title font-medium text-20 text-gray-800 mb-8"
      >
        {{ title }}
      </h2>
      <h3 v-else class="font-title font-medium text-20 text-gray-800 mb-8">
        {{ title }}
      </h3>
      <p class="text-12 mb-30 text-gray-300">{{ time }}</p>
      <span class="uppercase text-olive font-bold text-14 flex items-center">
        {{ ctaLabel }}
        <ChevronRight class="ml-8" />
      </span>
    </div>
  </div>
</template>

<script>
import ChevronRight from '../assets/icons/chevron-right.svg?inline'
export default {
  components: {
    ChevronRight,
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
    time: {
      type: String,
      default: '',
    },
    ctaLabel: {
      type: String,
      default: '',
    },
    ctaUrl: {
      type: String,
      default: '',
    },
    titleH3: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
