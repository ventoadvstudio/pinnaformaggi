<template>
  <div class="product-grid container sm:grid grid-cols-12 gap-x-30">
    <div
      v-for="(item, index) of items"
      :key="index.toString()"
      class="product-grid__item py-16 md:pr-0 lg:py-45 sm:col-span-12 md:col-span-6 xl:col-span-4 border-b border-solid border-gray-50"
    >
      <ProductEntry
        :img="item.img"
        :title="item.title"
        :tags="item.tags"
        :cta-label="item.ctaLabel"
        :cta-url="item.ctaUrl"
      />
    </div>
  </div>
</template>

<script>
import { validateArrayOfObject } from '@/utils'
import ProductEntry from '../components/ProductEntry'
export default {
  components: {
    ProductEntry,
  },
  props: {
    items: {
      type: Array,
      required: true,
      validator: (data) => {
        const keys = ['img', 'title', 'tags', 'ctaLabel', 'ctaUrl']
        return validateArrayOfObject(keys, data)
      },
    },
  },
}
</script>
