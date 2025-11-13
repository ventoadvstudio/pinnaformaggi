<template>
  <div
    class="header-background absolute left-half rounded-circle"
    :class="{
      'header-background--primary bg-white': type === 'primary',
      'header-background--secondary': type === 'secondary',
    }"
  ></div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: (str) => {
        const allowedTypes = ['primary', 'secondary']
        return allowedTypes.includes(str)
      },
    },
  },
}
</script>
<style>
.header-background {
  top: calc(-0.27824561403509 * 100vw + 41px);
  width: 180vw;
  height: 31vw;
  transform: translateX(-50%) translateY(0);
  box-shadow: 0 2px 15px 3px rgba(0, 0, 0, 0.21);
  @screen lg {
    width: 2592px;
    height: 446px;
  }
  &::after {
    content: '';
    @apply absolute w-screen h-screen left-half bottom-half transform -translate-x-1/2;
  }
  &--primary {
    @screen lg {
      top: -359.674px;
    }
    &::after {
      @apply bg-white;
    }
  }
  &--secondary {
    @screen lg {
      top: -271.674px;
    }
    &,
    &::after {
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
