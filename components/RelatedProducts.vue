<template>
  <div class="related-products">
    <div class="related-products__banner bg-primary p-32 sm:p-60">
      <div class="container text-center">
        <h2
          class="font-heading font-bold text-40 sm:text-52 text-primary uppercase"
        >
          {{ title }}
        </h2>
        <p class="text-white mt-4">
          {{ description }}
        </p>
      </div>
    </div>
    <div
      class="related-products__products mt-16 md:mt-40 container lg:flex justify-center items-center"
    >
      <div class="related-products__items flex flex-col md:flex-row">
        <template v-if="products && products.length > 0">
          <div
            v-for="(product, i) in products"
            :key="product.title"
            class="related-products__item py-16 md:flex-1 border-b border-solid border-gray-50 md:border-none"
            :class="{ 'mr-26': products.length > 1 && i === 0 }"
          >
            <ProductEntry
              :title="product.title"
              :img="product.img"
              :tags="product.tags"
              :cta-label="product.ctaLabel"
              :cta-url="product.ctaUrl"
              :center="products.length === 1"
              title-h3
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import ProductEntry from '@/components/ProductEntry'
import { validateArrayOfObject } from '@/utils'

export default {
  components: {
    ProductEntry,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      required: true,
      validator: (data) => {
        if (data.length > 0) {
          const keys = ['img', 'title', 'tags', 'ctaLabel', 'ctaUrl']
          return validateArrayOfObject(keys, data)
        }
      },
    },
  },
}
</script>
