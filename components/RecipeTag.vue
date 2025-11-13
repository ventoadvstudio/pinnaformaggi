<template>
  <nuxt-link
    v-if="backUrl && backLabel"
    :to="backUrl"
    class="px-16 py-8 uppercase border border-solid rounded-large border-gray-300 text-gray-300 font-bold text-12 flex flex-no-wrap justify-center items-center"
  >
    <p data-datocms-noindex>{{ backLabel }}</p>
  </nuxt-link>
  <div
    v-else-if="backLabel"
    class="px-16 py-8 uppercase border border-solid rounded-large border-gray-300 text-gray-300 font-bold text-12 flex flex-no-wrap justify-center items-center"
  >
    <p data-datocms-noindex>{{ backLabel }}</p>
  </div>
</template>
<script>
export default {
  props: {
    backLabel: {
      type: String,
      default: '',
    },
    backUrl: {
      type: String,
      default: '/',
    },
  },
}
</script>
