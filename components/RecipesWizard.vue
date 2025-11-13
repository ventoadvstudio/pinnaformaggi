<template>
  <div
    class="recipes-wizard bg-orange pt-120 sm:pt-152 pb-70 min-h-screen overflow-hidden bg-center bg-no-repeat"
  >
    <div class="container lg:grid grid-cols-12 gap-30">
      <div
        class="text-white text-center lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6 relative"
      >
        <div v-show="!currentStep" class="relative z-2">
          <div class="w-180 h-130 mx-auto relative z-2">
            <datocms-image
              :data="{ ...imageHead.responsiveImage, alt: imageHead.alt }"
              class="absolute max-w-none w-230 top-half left-half transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <h1 class="text-46 md:text-60 font-heading leading-none mb-16 px-16">
            {{ title }}
          </h1>
          <p class="text-18 mb-32 sm:md-36 px-16">{{ paragraph }}</p>
          <button
            type="button"
            class="btn btn--primary btn--small"
            @click="currentStep = 1"
          >
            {{ startLabel }}
          </button>
          <datocms-image
            :data="{ ...imageFooter.responsiveImage, alt: imageFooter.alt }"
            class="mt-38 w-300 max-w-full mx-auto"
          />
        </div>
        <div v-show="currentStep" class="relative z-2">
          <div class="recipes-wizard__steps-top relative">
            <div class="w-180 h-130 mx-auto relative z-2">
              <datocms-image
                :data="{ ...imageHead.responsiveImage, alt: imageHead.alt }"
                class="absolute max-w-none w-230 top-half left-half transform -translate-x-1/2 -translate-y-1/2"
              />
            </div>
            <div
              class="recipes-wizard__steps flex items-center justify-center flex-row relative"
            >
              <button
                v-if="currentStep > 1"
                type="button"
                class="uppercase absolute text-12 left-0 top-half transform -translate-y-1/2 font-bold flex items-center focus:outline-none"
                @click="onBack(currentStep)"
              >
                <ChevronLeft class="mr-4" />
                {{ backLabel }}
              </button>
              <div
                v-for="(step, index) of steps"
                :key="index.toString()"
                class="w-24 h-24 sm:w-32 sm:h-32 rounded-circle bg-white flex items-center justify-center select-none"
                :class="{
                  'mr-24 sm:mr-32': index !== steps.length - 1,
                  'bg-white text-primary': currentStep <= index,
                  'bg-primary text-white': currentStep > index,
                }"
              >
                <p class="text-14 sm:text-18 font-bold">
                  {{ index + 1 }}
                </p>
              </div>
            </div>
          </div>
          <div
            v-for="(step, index) of steps"
            v-show="currentStep === index + 1"
            :key="index.toString()"
          >
            <h4
              class="uppercase font-title font-medium text-32 mt-35 mb-24 sm:my-50"
            >
              {{ step.title }}
            </h4>
            <div
              class="recipes-wizard__buttons-container flex justify-center items-center flex-wrap"
            >
              <div
                v-for="(choice, indexofChoices) of step.choices"
                :key="indexofChoices.toString()"
                class="recipes-wizard__btn-container flex-shrink-0 mt-16 mr-30"
              >
                <button
                  type="button"
                  class="recipes-wizard__btn inline-block w-full text-14 sm:text-16 p-12 rounded focus:outline-none select-none transition-colors duration-300"
                  :class="{
                    'text-gray-400 bg-white hover:bg-primary hover:text-cream':
                      selectedSteps[index + 1] !== choice.value,
                    'bg-primary text-cream':
                      selectedSteps[index + 1] === choice.value,
                  }"
                  @click="onChoice(index + 1, choice.value)"
                >
                  {{ choice.label }}
                </button>
              </div>
            </div>
            <button
              v-if="showSearch"
              type="button"
              class="btn btn--primary btn--large mt-82 sm:mt-76"
              @click="$emit('submit', selectedSteps)"
            >
              {{ findLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChevronLeft from '@/assets/icons/chevron-white-left.svg?inline'
export default {
  components: {
    ChevronLeft,
  },
  props: {
    imageHead: {
      type: Object,
      default: () => ({}),
    },
    imageFooter: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '',
    },
    paragraph: {
      type: String,
      default: '',
    },
    startLabel: {
      type: String,
      default: '',
    },
    backLabel: {
      type: String,
      default: 'back',
    },
    findLabel: {
      type: String,
      default: '',
    },
    steps: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const selectedSteps = {}
    this.steps.forEach((el, index) => {
      selectedSteps[index + 1] = undefined
    })
    return {
      currentStep: undefined,
      selectedSteps,
    }
  },
  computed: {
    showSearch() {
      return (
        this.currentStep === this.steps.length &&
        Object.values(this.selectedSteps).findIndex(
          (el) => el === undefined
        ) === -1
      )
    },
  },
  mounted() {
    if (this.$route.query.open) {
      this.currentStep = 1
    }
  },
  methods: {
    onChoice(step, value) {
      this.selectedSteps[step] = value
      if (step !== this.steps.length) {
        this.currentStep++
      }
    },
    onBack(step) {
      if (step > 1) {
        this.selectedSteps[step] = undefined
        this.selectedSteps[step - 1] = undefined
        this.currentStep--
      }
    },
  },
}
</script>
<style>
.recipes-wizard {
  background-image: url('/images/background_wizard_mobile.jpg');
  background-size: 100%;
  background-position: top center;
  @screen sm {
    background-image: url('/images/background_wizard_desktop.jpg');
    background-size: auto 100%;
  }
  &__buttons-container {
    margin-top: -16px;
    margin-right: -30px;
  }
  &__btn-container {
    flex-basis: 170px;
    @screen sm {
      flex-basis: 250px;
    }
  }
}
</style>
