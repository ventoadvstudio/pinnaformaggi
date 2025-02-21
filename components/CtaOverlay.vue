<template>
  <div
    class="cta-overlay sm:hidden fixed left-half bottom-0 mb-24 transform -translate-x-1/2 w-full px-24 flex items-center z-10 transition-opacity duration-300"
    :class="{
      'opacity-100 visible': active,
      'opacity-0 invisible pointer-events-none': !active,
    }"
  >
    <nuxt-link
      v-for="(button, i) in buttons"
      :key="button.to"
      :to="button.to"
      class="cta-overlay__btn flex-1 h-40 relative bg-olive rounded-tl-medium rounded-tr-medium"
      :class="{ 'cta-overlay__btn--margin': i < buttons.length - 1 }"
    >
      <span
        class="font-title text-20 text-white uppercase absolute top-half left-half transform -translate-x-1/2 -translate-y-1/2 whitespace-no-wrap"
      >
        {{ button.label }}
      </span>
    </nuxt-link>
  </div>
</template>
<script>
import { debounce, elementInViewport } from '@/utils'

export default {
  props: {
    buttons: {
      type: Array,
      required: true,
      validator: (arr) =>
        arr.filter(
          (el) => typeof el.label === 'string' && typeof el.to === 'string'
        ).length === arr.length,
    },
  },
  data() {
    return {
      active: false,
      debounceHandleScroll: debounce(this.handleScroll),
    }
  },
  mounted() {
    this.handleScroll()
  },
  beforeMount() {
    window.addEventListener('scroll', this.debounceHandleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.debounceHandleScroll)
  },
  methods: {
    handleScroll() {
      const hero = document.getElementById('hero')
      this.active = !hero ? false : !elementInViewport(hero)
    },
  },
}
</script>
<style>
.cta-overlay {
  &__btn {
    background: radial-gradient(
      circle at 50% -50%,
      theme('colors.olive.200') 0%,
      theme('colors.olive.200') 2%,
      theme('colors.olive.default') 100%
    );
    &--margin {
      margin-right: 10vw;
    }
  }
}
</style>
