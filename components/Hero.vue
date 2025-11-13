<template>
  <section class="hero relative flex justify-center items-center">
    <div
      class="hero__content relative z-1 container flex flex-col items-center text-white text-center"
    >
      <div class="hero__title relative">
        <h1
          class="relative font-heading font-bold flex flex-col items-center z-1"
        >
          <span class="text-56 leading-none">
            {{ titleSmall }}
          </span>
          <span class="text-80 leading-none">
            {{ titleLarge }}
          </span>
        </h1>
        <!--        <img-->
        <!--          src="@/assets/images/hero-shadow.png"-->
        <!--          class="absolute top-half left-half transform -translate-x-1/2 -translate-y-1/2"-->
        <!--        />-->
      </div>
      <h2
        class="hero__subtitle font-title font-medium uppercase text-18 md:text-22 mt-20 md:mt-27"
      >
        {{ subTitle }}
      </h2>
      <hr class="hero__separator w-215 h-2 border-white my-24 md:my-16" />
      <p class="hero__description md:text-22">
        {{ description }}
      </p>
      <div class="hero__buttons flex items-center mt-26 md:mt-60">
        <nuxt-link
          :to="buttons[0].to"
          class="hero__btn relative hero__btn--cheese"
        >
          <datocms-image
            :data="buttons[0].background.responsiveImage"
            class="hero__btn-img relative z-1 w-full h-full object-contain"
          />
          <span
            class="hero__btn-label absolute z-2 left-half transform -translate-x-1/2 max-w-full truncate font-title uppercase"
          >
            {{ buttons[0].label }}
          </span>
        </nuxt-link>
        <nuxt-link
          :to="buttons[1].to"
          class="hero__btn relative hero__btn--scoop"
        >
          <datocms-image
            :data="buttons[1].background.responsiveImage"
            class="hero__btn-img relative z-1 w-full h-full object-contain"
          />
          <span
            class="hero__btn-label absolute z-2 left-half transform -translate-x-1/2 max-w-full truncate font-title uppercase"
          >
            {{ buttons[1].label }}
          </span>
        </nuxt-link>
      </div>
    </div>
    <div class="hero__backgrounds absolute top-0 right-0 bottom-0 left-0">
      <datocms-image
        v-for="(image, i) in images"
        :key="`background-image-${i}`"
        :data="image.responsiveImage"
        layout="fill"
        object-fit="cover"
        object-position="center"
        class="hero__background absolute top-0 right-0 bottom-0 left-0 w-full h-full object-cover object-center transition-opacity duration-1000"
        :class="{
          'opacity-100': currentImage === i,
          'opacity-0': currentImage !== i,
        }"
      />
    </div>
    <ScrollIndicator
      theme="secondary"
      :label="discoverMore"
      class="lg:hidden"
      @click="onClick"
    />
    <ScrollIndicator
      theme="transparent"
      :label="discoverMore"
      large
      class="hidden lg:block"
      @click="onClick"
    />
  </section>
</template>
<script>
import ScrollIndicator from '@/components/ScrollIndicator'
export default {
  components: {
    ScrollIndicator,
  },
  props: {
    titleSmall: {
      type: String,
      required: true,
    },
    titleLarge: {
      type: String,
      required: true,
    },
    subTitle: {
      type: String,
      required: true,
    },
    discoverMore: {
      type: String,
      required: true,
    },
    nextSectionId: {
      type: String,
      default: undefined,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    imagesTimeout: {
      type: Number,
      default: 5000,
    },
    buttons: {
      type: Array,
      required: true,
      validator: (arr) =>
        arr.length === 2 &&
        arr.filter(
          (el) =>
            typeof el.label === 'string' &&
            typeof el.to === 'string' &&
            typeof el.background === 'object'
        ).length === arr.length,
    },
  },
  data() {
    return {
      currentImage: 0,
      intervalHandler: null,
    }
  },
  mounted() {
    if (this.images.length > 0) {
      this.intervalHandler = setInterval(() => {
        if (this.currentImage !== this.images.length - 1) this.currentImage++
        else this.currentImage = 0
      }, this.imagesTimeout)
    }
  },
  beforeDestroy() {
    clearInterval(this.intervalHandler)
  },
  methods: {
    onClick() {
      if (this.nextSectionId) {
        const element = document.getElementById(this.nextSectionId)
        if (element) {
          window.scroll({
            behavior: 'smooth',
            left: 0,
            top: element.offsetTop,
          })
        }
      }
    },
  },
}
</script>
<style>
.hero {
  height: 100vh;
  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }

  min-height: 600px;
  max-height: 1080px;
  @screen md {
    min-height: 700px;
  }
  &__btn {
    flex-basis: 171px;
    &:hover {
      &::after {
        @apply opacity-100 visible;
      }
    }
    &::after {
      content: '';
      height: 65%;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
      @apply block w-full absolute left-0 right-0 bottom-0 rounded-circle opacity-0 invisible transition-opacity duration-300;
    }

    &:not(:last-child) {
      margin-right: 15px;
      @media only screen and (min-width: 375px) {
        margin-right: 30px;
      }
    }
  }
  &__content {
    max-width: 730px;
  }
  &__btn-label {
    bottom: 4px;
    @media only screen and (min-width: 340px) {
      bottom: 8px;
    }
    @media only screen and (min-width: 375px) {
      font-size: 20px;
    }
  }
}
</style>
