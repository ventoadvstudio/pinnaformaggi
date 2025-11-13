<template>
  <div class="section-heading text-center">
    <div class="section-heading__content">
      <h2
        class="font-heading text-50 mb-14 md:mb-12 leading-none"
        :class="special ? 'md:text-80 text-white mb-16' : 'text-primary'"
      >
        {{ heading }}
      </h2>
      <p
        v-if="description"
        class="font-content text-16 md:text-18"
        :class="
          special ? 'text-white md:text-22 leading-snug' : 'text-gray-500'
        "
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      required: true,
      type: String,
    },
    description: {
      default: '',
      type: String,
    },
    special: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
