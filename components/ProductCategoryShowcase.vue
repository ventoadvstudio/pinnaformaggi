<template>
  <div class="product-category-showcase">
    <SectionCoverCTA
      :title="title"
      :description="description"
      :img="img"
      :cta-label="ctaLabel"
      :cta-url="ctaUrl"
      :headband="headband"
    />
    <Slider v-if="items.length > 0" :items="items" no-padding />
  </div>
</template>
<script>
import SectionCoverCTA from '@/components/SectionCoverCTA'
import Slider from '@/components/Slider'
import { validateArrayOfObject } from '@/utils'
export default {
  components: {
    SectionCoverCTA,
    Slider,
  },
  props: {
    headband: {
      type: Boolean,
      default: true,
    },
    img: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: '',
    },
    description: {
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
    items: {
      type: Array,
      required: true,
      validator: (arr) => {
        const keys = ['title', 'image', 'ctaLabel', 'ctaUrl']
        return validateArrayOfObject(keys, arr)
      },
    },
  },
}
</script>
<style>
.product-category-showcase {
  /* a */
}
</style>
