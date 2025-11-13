<template>
  <div
    class="product-ingredients w-full relative text-center bg-olive-350 text-white px-44 py-30 my-32"
  >
    <img
      :src="require('@/assets/elements/green-border-top.svg')"
      class="product-ingredients__box-border absolute w-full left-0 top-0 transform -translate-y-1/2"
    />
    <h2 class="mb-22 font-bold text-24">
      {{ title }}
    </h2>
    <!-- TODO change -->
    <div v-html="content"></div>
    <img
      :src="require('@/assets/elements/green-border-bottom.svg')"
      class="product-ingredients__box-border absolute w-full left-0 bottom-0 transform translate-y-1/2"
    />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
.product-ingredients {
  max-width: 540px;
}
</style>
