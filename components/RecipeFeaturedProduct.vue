<template>
  <div class="recipe-featured-product mx-auto flex items-center pb-32 md:pb-45">
    <div
      class="recipe-featured-product__image flex-4 md:flex-1 md:flex-shrink-0"
    >
      <datocms-image
        v-if="image"
        :data="{ ...image.responsiveImage, alt: image.alt }"
        class="w-full h-full object-contain"
      />
    </div>
    <div
      class="recipe-featured-product__text ml-10 md:ml-30 flex-5 md:flex-1 md:flex-shrink-0"
    >
      <h2 class="font-title font-medium text-20 md:text-22 text-primary">
        {{ title }}
      </h2>
      <div class="flex items-center mt-28">
        <nuxt-link
          :to="ctaUrl"
          class="mr-8 text-14 uppercase text-primary font-bold"
        >
          {{ ctaLabel }}
        </nuxt-link>
        <ChevronDown class="transform -rotate-90" />
      </div>
    </div>
    <div>
    <h2 class="uppercase font-medium text-24 text-primary">Consigli e conservazione</h2>
    <span class="text-right ml-16 font-bold flex-auto flex-shrink-0">
      {{ consigli }}
    </span>
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
    title: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
      default: () => {},
    },
    ctaLabel: {
      type: String,
      required: true,
    },
    ctaUrl: {
      type: String,
      required: true,
    },
    consigli: {
      type: String,
      default:'',
    },
  },
}
</script>
