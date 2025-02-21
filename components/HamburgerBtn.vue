<template>
  <button
    class="hamburger-btn relative w-24 h-24 focus:outline-none"
    :class="{ 'hamburger-btn--active': active }"
    @click="onClick"
  >
    &nbsp;
  </button>
</template>
<script>
export default {
  props: {
    active: {
      type: Boolean,
      required: true,
    },
    onClick: {
      type: Function,
      required: true,
    },
  },
}
</script>
<style>
.hamburger-btn {
  &::before,
  &::after {
    content: '';
    transition: top 150ms 150ms, transform 150ms;
    transform: translateX(-50%);
    @apply absolute left-half rounded-small w-20 h-2 bg-primary;
  }
  &::before {
    top: 6px;
  }
  &::after {
    top: calc(100% - 8px);
  }

  &--active {
    &::before,
    &::after {
      top: 50%;
      transition: top 150ms, transform 150ms 150ms;
    }
    &::before {
      transform: translateX(-50%) rotate(45deg);
    }
    &::after {
      transform: translateX(-50%) rotate(-45deg);
    }
  }
}
</style>
