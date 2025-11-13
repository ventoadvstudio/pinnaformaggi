<template>
  <div
    class="product-features relative"
    :class="{ 'product-features--first': first }"
  >
    <div
      class="product-features__content z-1 p-20 max-w-full"
      :class="{
        'product-features__content--first': first,
        'relative mx-auto md:absolute md:left-half md:transform md:-translate-x-1/2': first,
        'absolute left-half transform -translate-x-1/2': !first,
      }"
    >
      <client-only>
        <Carousel ref="carousel" v-bind="options" @beforeChange="beforeChange">
          <div
            v-for="item in items"
            :key="item.title"
            class="product-features__test text-cream-250 text-center"
          >
            <h2 class="font-title font-medium text-24 uppercase">
              {{ item.title }}
            </h2>
            <p class="md:text-18 mt-12">
              {{ item.description }}
            </p>
          </div>
        </Carousel>
      </client-only>
      <SliderControls
        :slides="items.length"
        :current-slide="currentSlideIndex"
        :prev="slideBack"
        :next="slideForward"
        class="mt-32"
        @dotClicked="changeSlide"
      />
    </div>
    <datocms-image
      :data="{
        ...mobileBackgroundImage.responsiveImage,
        alt: mobileBackgroundImage.alt,
      }"
      layout="fill"
      class="absolute top-0 left-0 w-full"
      :class="{ 'h-full object-cover object-top': first }"
      picture-class="md:hidden"
    />
    <datocms-image
      :data="{
        ...desktopBackgroundImage.responsiveImage,
        alt: desktopBackgroundImage.alt,
      }"
      layout="fill"
      object-fit="cover"
      class="absolute top-0 right-0 bottom-0 left-0 w-full h-full object-cover"
      picture-class="hidden md:block"
    />
  </div>
</template>
<script>
import Carousel from 'vue-slick-carousel'
import SliderControls from '@/components/SliderControls'
import { validateArrayOfObject } from '@/utils'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

export default {
  components: {
    Carousel,
    SliderControls,
  },
  props: {
    items: {
      type: Array,
      required: true,
      validator: (arr) => {
        const keys = ['title', 'description']
        return validateArrayOfObject(keys, arr)
      },
    },
    mobileBackgroundImage: {
      type: Object,
      required: true,
    },
    desktopBackgroundImage: {
      type: Object,
      required: true,
    },
    first: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      options: {
        arrows: false,
        dots: false,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
      currentSlideIndex: 0,
    }
  },
  methods: {
    slideBack() {
      this.$refs.carousel.prev()
    },
    slideForward() {
      this.$refs.carousel.next()
    },
    changeSlide(index) {
      this.$refs.carousel.goTo(index)
    },
    beforeChange(oldSlideIndex, newSlideIndex) {
      this.currentSlideIndex = newSlideIndex
    },
  },
}
</script>
<style>
.product-features {
  &::before {
    padding-top: 100%;
    content: '';
    @apply block w-full;
  }
  &--first {
    &::before {
      content: none;
      @screen md {
        content: '';
      }
    }
  }
  &__content {
    width: 400px;
    bottom: 14%;
    &--first {
      padding-top: 50%;
      bottom: auto;
    }
    @screen md {
      top: 42%;
      padding-top: 0;
    }
    @screen xl {
      top: 50%;
    }
    *:focus {
      outline: none;
    }
  }
}
</style>
