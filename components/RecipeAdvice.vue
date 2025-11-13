<template>
  <div class="container p-0 border-solid border-b border-t border-cream-600">
    <div
      v-if="
        sanitizedRecipeAdviceDescription &&
        sanitizedRecipeAdviceDescription.length > 0
      "
      class="recipe__description my-32"
    >
      <h2 class="font-title font-medium text-24 uppercase mb-16 text-primary">
        {{ title }}
      </h2>
      <div
        class="text-cream-700 markdown"
        v-html="sanitizedRecipeAdviceDescription"
      />
    </div>
    <div
      v-if="author"
      class="mt-32 mb-32 md:mt-50 justify-center items-center text-center lg:text-center"
    >
      <p class="text-14 font-medium text-primary">{{ author }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    author: {
      type: String,
      default: '',
    },
  },
  computed: {
    sanitizedRecipeAdviceDescription() {
      return this.$sanitize(this.description)
    },
  },
}
</script>
