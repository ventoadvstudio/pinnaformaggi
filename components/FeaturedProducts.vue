<template>
  <div class="featured-products md:flex bg-olive-400">
    <div
      v-for="(item, index) of items"
      :key="index.toString()"
      class="w-full pt-56 md:py-135 featured-products__item"
      :class="{ 'pb-56': index === items.length - 1 }"
    >
      <div
        class=""
        :class="{
          'xl:flex xl:justify-end md:border-r border-white border-solid':
            index === 0,
        }"
      >
        <div
          class="featured-product__text md:w-350 px-20 mx-auto flex flex-col items-center text-white text-center"
          :class="{ 'xl:mr-180': index === 0, 'xl:ml-180': index === 1 }"
        >
          <img :src="item.img.url" :alt="item.img.alt" />
          <h2 class="font-title font-medium uppercase text-24 mb-10">
            {{ item.title }}
          </h2>
          <p class="text-16 mb-15">
            {{ item.description }}
          </p>
          <nuxt-link :to="item.url" class="btn btn--small btn--secondary">
            {{ item.buttonLabel }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validateArrayOfObject } from '@/utils/index'
export default {
  props: {
    items: {
      type: Array,
      required: true,
      validator: (data) => {
        const keys = ['img', 'title', 'description', 'buttonLabel', 'url']
        return validateArrayOfObject(keys, data)
      },
    },
  },
}
</script>

<style scoped>
.featured-products {
  &__item {
    background: radial-gradient(
      circle,
      theme('colors.olive.200') 0%,
      theme('colors.olive.200') 22%,
      theme('colors.olive.400') 60%
    );
  }

  &__text {
    max-width: 380px;
  }
}
</style>
