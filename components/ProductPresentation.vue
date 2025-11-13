<template>
  <div class="product-presentation overflow-hidden">
    <div
      class="product-presentation__slider relative mx-auto sm:px-24"
      data-datocms-noindex
    >
      <Carousel ref="carousel" v-bind="settings">
        <div
          v-for="(image, index) of images"
          :key="index.toString()"
          class="max-w-screen relative"
        >
          <datocms-image :data="image.responsiveImage" layout="responsive" />
        </div>
      </Carousel>
      <div
        class="product-presentation__slider-arrows absolute top-half left-0 right-0 transform -translate-y-1/2 flex justify-between items-center opacity-0 invisible transition-opacity duration-200"
      >
        <button class="focus:outline-none pointer-events-auto" @click="prev">
          <ArrowLeft class="w-12 h-12" />
        </button>
        <button class="focus:outline-none pointer-events-auto" @click="next">
          <ArrowRight class="w-12 h-12" />
        </button>
      </div>
    </div>
    <button
      class="mx-auto mt-36 uppercase w-90 border border-solid border-gray-200 text-gray-200 font-bold text-12 flex justify-center items-center focus:outline-none"
      @click="goBack"
    >
      <ChevronLeft class="w-8 mr-6" />
      <span class="py-4">Indietro</span>
    </button>
    <div class="flex flex-col justify-center items-center mt-6">
      <div class="px-20 max-w-full">
        <h1
          class="uppercase font-medium text-32 font-title text-primary text-center"
        >
          {{ title }}
        </h1>
      </div>
      <div class="text-14 leading-snug text-gray-500 mt-15">
        <span v-for="(tag, index) of tags" :key="index.toString()">
          {{ tag }}
          <span v-if="index < tags.length - 1" class="mx-8">|</span>
        </span>
      </div>
      <div>
        <div
          v-for="(items, index) of anchorsChunked"
          :key="index.toString()"
          class="w-full"
        >
          <div
            class="w-full flex justify-center items-center py-14 px-20"
            :class="{
              'border-t border-gray-50 border-solid mt-24': index === 0,
              'border-b border-solid border-gray-50':
                index === anchorsChunked.length - 1,
            }"
          >
            <div
              v-for="(anchor, index2) of items"
              :key="index2.toString()"
              :class="{ 'mr-32 sm:mr-110': index2 !== items.length - 1 }"
            >
              <a
                :href="`#${anchor.id}`"
                class="uppercase text-12 text-primary font-bold flex items-center flex-1 flex-shrink-0"
              >
                <ChevronDown class="w-8 h-5 mr-4" />
                {{ anchor.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Carousel from 'vue-slick-carousel'
import { validateArrayOfObject, chunk } from '@/utils'
import ChevronLeft from '@/assets/icons/chevron-gray-left.svg?inline'
import ChevronDown from '@/assets/icons/chevron-down.svg?inline'
import ArrowLeft from '@/assets/icons/arrow-left.svg?inline'
import ArrowRight from '@/assets/icons/arrow-right.svg?inline'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
export default {
  components: {
    ArrowLeft,
    ArrowRight,
    Carousel,
    ChevronLeft,
    ChevronDown,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    images: {
      type: Array,
      default: () => [],
    },
    tags: {
      type: Array,
      default: () => [],
    },
    anchors: {
      type: Array,
      default: () => [],
      validator: (data) => {
        const keys = ['id', 'label']
        return validateArrayOfObject(keys, data)
      },
    },
    backUrl: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      settings: {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    }
  },
  computed: {
    anchorsChunked() {
      return chunk(this.anchors, 2)
    },
  },
  methods: {
    prev() {
      this.$refs.carousel.prev()
    },
    next() {
      this.$refs.carousel.next()
    },
    goBack() {
      if (this.backUrl) {
        this.$router.push({
          path: this.backUrl,
        })
      } else {
        this.$router.go(-1)
      }
    },
  },
}
</script>
<style>
.product-presentation {
  &__slider {
    max-width: 588px;
    *:focus {
      outline: none;
    }
    @screen sm {
      &:hover .product-presentation__slider-arrows {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  .slick-dots {
    li {
      width: 16px;
      margin: 0 2px;
      button::before {
        font-size: 10px;
        color: theme('colors.gray.250');
      }
    }
    .slick-active {
      button::before {
        color: theme('colors.primary');
      }
    }
  }
}
</style>
