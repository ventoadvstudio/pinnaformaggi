<template>
  <section
    class="slider"
    :class="{ 'pt-80 pb-140': !noPadding }"
    data-datocms-noindex
  >
    <div
      class="slider__heading-container container sm:grid sm:grid-cols-12 sm:gap-x-30 sm:gap-y-16"
    >
      <div
        v-if="title"
        class="slider__heading col-span-12 sm:col-start-3 lg:col-start-4 sm:col-span-8 lg:col-span-6"
      >
        <SectionHeading :heading="title" :description="description" />
        <div v-if="ctaLabel && ctaUrl" class="mt-16 text-center">
          <nuxt-link :to="ctaUrl" class="btn btn--primary">
            {{ ctaLabel }}
          </nuxt-link>
        </div>
      </div>
    </div>
    <div
      v-if="items.length > 1"
      v-swiper:swiper="options"
      class="slider__carousel relative mt-40"
    >
      <div class="swiper-wrapper">
        <div v-for="item in items" :key="item.title" class="swiper-slide">
          <div class="slider__item w-full flex flex-col items-center">
            <nuxt-link
              :to="item.ctaUrl ? item.ctaUrl : ''"
              class="block w-full h-full"
              :class="{
                'cursor-pointer': item.ctaUrl,
                'pointer-events-none': !item.ctaUrl,
              }"
            >
              <div
                class="slider__item-image-container relative w-full mb-40 md:md-34 overflow-hidden"
                :class="cover ? 'rounded-medium' : ''"
              >
                <datocms-image
                  :data="item.image.responsiveImage"
                  layout="fill"
                  :object-fit="cover ? 'cover' : 'contain'"
                  class="slider__item-image absolute top-0 right-0 bottom-0 left-0 w-full h-full"
                  :class="cover ? 'object-cover' : 'object-contain'"
                />
              </div>
              <div class="slider__item-text flex flex-col items-center">
                <h3
                  class="uppercase font-title font-medium text-primary text-center px-20 mb-24 md:mb-28 text-24 rounded-small"
                >
                  {{ item.title }}
                </h3>
                <span
                  v-if="item.ctaLabel && item.ctaUrl"
                  class="btn btn--small btn--outline"
                >
                  {{ item.ctaLabel }}
                </span>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div
        ref="pagination"
        class="swiper-pagination"
        :class="{ 'justify-center': !enoughSlides }"
      ></div>
      <div
        v-if="enoughSlides"
        ref="navigation"
        class="swiper-arrows absolute left-half transform -translate-x-1/2 flex justify-between items-center z-10 pointer-events-none"
      >
        <button class="slider__prev-btn focus:outline-none pointer-events-auto">
          <ArrowLeft class="w-12 h-12" />
        </button>
        <button class="slider__next-btn focus:outline-none pointer-events-auto">
          <ArrowRight class="w-12 h-12" />
        </button>
      </div>
    </div>
    <div
      v-else-if="items.length === 1"
      class="flex justify-center items-center px-20 mt-40"
    >
      <div
        class="slider__item slider__item--limited w-full flex flex-col items-center"
      >
        <nuxt-link
          :to="items[0].ctaUrl ? items[0].ctaUrl : ''"
          class="block w-full h-full"
          :class="{
            'cursor-pointer': items[0].ctaUrl,
            'pointer-events-none': !items[0].ctaUrl,
          }"
        >
          <div
            class="slider__item-image-container relative w-full mb-40 md:md-34 overflow-hidden"
            :class="cover ? 'rounded-medium' : ''"
          >
            <datocms-image
              :data="items[0].image.responsiveImage"
              layout="fill"
              :object-fit="cover ? 'cover' : 'contain'"
              class="slider__item-image absolute top-0 right-0 bottom-0 left-0 w-full h-full"
              :class="cover ? 'object-cover' : 'object-contain'"
            />
          </div>
          <div class="slider__item-text flex flex-col items-center select-none">
            <h4
              class="uppercase font-title font-medium text-primary text-center px-20 mb-24 md:mb-28 text-24 rounded-small"
            >
              {{ items[0].title }}
            </h4>
            <span
              v-if="items[0].ctaUrl"
              class="slider__item-btn btn btn--small btn--outline"
            >
              {{ items[0].ctaLabel }}
            </span>
          </div>
        </nuxt-link>
      </div>
    </div>
  </section>
</template>
<script>
import SectionHeading from '@/components/SectionHeading'
import ArrowLeft from '@/assets/icons/arrow-left.svg?inline'
import ArrowRight from '@/assets/icons/arrow-right.svg?inline'
import { directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { validateArrayOfObject } from '@/utils'
export default {
  components: {
    ArrowLeft,
    ArrowRight,
    SectionHeading,
  },
  directives: {
    swiper: directive,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    noPadding: {
      type: Boolean,
      default: false,
    },
    cover: {
      type: Boolean,
      default: false,
    },
    ctaLabel: {
      type: String,
      default: undefined,
    },
    ctaUrl: {
      type: String,
      default: undefined,
    },
    items: {
      type: Array,
      required: true,
      validator: (arr) => {
        const keys = ['title', 'image']
        return validateArrayOfObject(keys, arr)
      },
    },
    itemsPerGroup: {
      type: Number,
      default: 1,
    },
  },
  data() {
    const enoughSlides = this.items.length > 3
    return {
      enoughSlides,
      options: {
        centeredSlides: true,
        grabCursor: true,
        initialSlide: this.items.length === 3 ? 1 : 0,
        loop: enoughSlides,
        loopFillGroupWithBlank: false,
        slidesPerGroup: 1,
        slidesPerView: this.cover ? 1.2 : 1.5,
        spaceBetween: 0,
        pagination: {
          clickable: true,
          dynamicBullets: enoughSlides,
          el: '.swiper-pagination',
        },
        navigation: {
          nextEl: '.slider__next-btn',
          prevEl: '.slider__prev-btn',
        },
        breakpoints: {
          640: {
            loop: enoughSlides,
            loopFillGroupWithBlank: false,
            slidesPerGroup: 1,
            slidesPerView: 2.5,
            spaceBetween: 30,
          },
          954: {
            loop: enoughSlides,
            loopFillGroupWithBlank: false,
            slidesPerGroup: 1,
            slidesPerView: enoughSlides ? 3.5 : 2.5,
            spaceBetween: 30,
          },
          1140: {
            loop: enoughSlides,
            loopFillGroupWithBlank: enoughSlides,
            slidesPerGroup: 1,
            slidesPerView: 'auto',
            spaceBetween: 30,
          },
        },
      },
    }
  },
  mounted() {
    if (this.enoughSlides) {
      this.setNavigation()
      window.addEventListener('resize', this.setNavigation)
    }
  },
  beforeDestroy() {
    if (this.enoughSlides) {
      window.removeEventListener('resize', this.setNavigation)
    }
  },
  methods: {
    setNavigation() {
      const navigation = this.$refs.navigation
      const pagination = this.$refs.pagination
      const width = pagination.getBoundingClientRect().width
      navigation.style.bottom = window
        .getComputedStyle(pagination)
        .getPropertyValue('bottom')
      navigation.style.width = width + 60 + 'px'
      navigation.style.height = pagination.getBoundingClientRect().height + 'px'
    },
  },
}
</script>
<style>
.slider {
  /* Component styling */
  &__item {
    &--limited {
      max-width: 270px;
      @screen md {
        max-width: 350px;
      }
      @screen lg {
        max-width: 270px;
      }
      @screen xl {
        max-width: 350px;
      }
    }
  }
  &__item-image-container {
    &::before {
      content: '';
      padding-top: 100%;
      @apply block w-full;
    }
  }
  &__carousel {
    padding-bottom: 50px !important;
    @screen sm {
      padding-bottom: 58px !important;
    }
  }

  /* Swiper defaults styling */
  .swiper-slide {
    @screen xl {
      width: 350px;
    }
  }
  .swiper-pagination {
    display: flex;
    align-items: center;
  }
  .swiper-container-horizontal
    > .swiper-pagination-bullets
    .swiper-pagination-bullet {
    margin: 0 8px;
  }
  .swiper-container-horizontal .swiper-pagination-bullet {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
  .swiper-container-horizontal .swiper-pagination-bullet-active {
    width: 18px;
    height: 18px;
    background: theme('colors.primary');
  }

  /* Animations */
  .swiper-slide-active .slider__item-text {
    opacity: 1;
    transition: opacity 200ms 200ms;
  }
  .swiper-slide-prev .slider__item-text,
  .swiper-slide-next .slider__item-text {
    @screen xl {
      opacity: 1;
      transition: opacity 200ms 200ms;
    }
  }

  .swiper-slide:not(.swiper-slide-prev, .swiper-slide-active, .swiper-slide-next)
    .slider__item {
    @screen xl {
      pointer-events: none;
    }
  }

  .swiper-slide:not(.swiper-slide-prev, .swiper-slide-active, .swiper-slide-next)
    .slider__item-text {
    @screen xl {
      opacity: 0;
      transition: opacity 200ms;
    }
  }

  .swiper-slide:not(.swiper-slide-active) .slider__item-text {
    @media only screen and (max-width: 1140px) {
      opacity: 0;
      transition: opacity 200ms;
    }
  }

  .swiper-slide .slider__item-image-container {
    transition: top 300ms, transform 300ms;
    transform: scale(0.9);
    @screen sm {
      transform: scale(0.8);
    }
  }

  .swiper-slide-active .slider__item-image-container {
    transform: scale(1);
    transition: top 300ms, transform 300ms;
  }

  .swiper-slide-prev .slider__item-image-container,
  .swiper-slide-next .slider__item-image-container {
    @screen xl {
      transform: scale(1);
      transition: top 300ms, transform 300ms;
    }
  }
}
</style>
