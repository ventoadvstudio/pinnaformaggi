<template>
  <section class="collapsible-box">
    <div
      class="collapsible-box__trigger w-full bg-center bg-no-repeat bg-cover"
      :style="{ backgroundImage: `url(${backgroundImage.url})` }"
    >
      <div class="collapsible-box__box">
        <div
          class="trigger-content transform -translate-x-1/2 -translate-y-1/3 flex flex-col justify-center items-center text-center"
        >
          <h3
            class="uppercase text-white text-50 lg:text-80 mb-50 lg:mb-25 font-heading"
          >
            {{ title }}
          </h3>
          <button
            type="button"
            class="btn btn--primary btn--small"
            @click="toggle"
          >
            <span v-if="isOpen">{{ closeLabel }}</span>
            <span v-if="!isOpen">{{ openLabel }}</span>
          </button>
        </div>
      </div>
    </div>
    <div
      class="collapsible-box__content overflow-hidden"
      :class="{
        'collapsible-box__content--open opacity-1 visible': isOpen,
        'collapsible-box__content--closed opacity-0 invisible': !isOpen,
        'transform md:-translate-x-1/2': isOdd,
      }"
    >
      <ModularSection :items="items" />
    </div>
  </section>
</template>
<script>
import ModularSection from '@/components/ModularSection'

export default {
  components: {
    ModularSection,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    backgroundImage: {
      type: Object,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    openLabel: {
      type: String,
      required: true,
    },
    closeLabel: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    isOdd: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    toggle() {
      this.$emit('toggle')
      this.$root.$emit('collapsibleBoxToggled')
    },
  },
}
</script>

<style>
.collapsible-box {
  &__box {
    position: relative;
    &::before {
      display: block;
      content: '';
      width: 100%;
      padding-top: 100%;
    }
    > .trigger-content {
      position: absolute;
      width: 100%;
      top: 50%;
      left: 50%;
    }
  }
  &__content {
    &--open {
      max-height: 10000px;
      transition: opacity 300ms 500ms, visibility 300ms 500ms, max-height 1s;
    }

    &--closed {
      max-height: 0;
      transition: opacity 300ms, visibility 300ms, max-height 1s 300ms;
    }

    @screen md {
      width: 200%;
    }
  }
}
</style>
