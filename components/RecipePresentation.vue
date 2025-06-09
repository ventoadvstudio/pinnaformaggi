<template>
  <div class="recipe-presentation">
    <div
      class="recipe-presentation__hero relative h-355 sm:h-auto bg-no-repeat bg-center"
      :style="`background-image: url(${img.url})`"
    />
    <div class="recipe-presentation__info md:mt-26 container mx-auto p-20">
      <RecipeInfo
        :difficulty="info.difficulty"
        :prep-time="info.prepTime"
        :cooking-time="info.cookTime"
        :total-time="info.totalTime"
        :notes="info.notes"
      />
    </div>
    <div class="container md:grid grid-cols-12 gap-30 mt-40">
      <div
        class="text-center md:col-start-2 md:col-span-10 lg:col-start-2 lg:col-span-10 flex flex-col justify-center items-center"
      >
        <h1
          class="uppercase leading-snug font-title font-medium text-primary text-32 md:text-40"
        >
          {{ title }}
        </h1>
        <div class="flex flex-row flex-wrap justify-center gap-8 mt-20">
          <RecipeTag
            v-for="(category, index) of categories"
            :key="index.toString()"
            :back-label="category.backLabel"
            :back-url="category.backUrl"
          />
        </div>

        <div v-if="cuisine && cuisine.length > 0" class="mt-20">
          <span class="text-14 leading-snug text-gray-500">
            Cucina: {{ cuisine }}
          </span></div>
        <!--        <div class="text-14 leading-snug text-gray-500 mt-15">-->
        <!--          <span v-for="(tag, index) of tags" :key="index.toString()">-->
        <!--            {{ tag }}-->
        <!--            <span v-if="index < tags.length - 1" class="mx-8">|</span>-->
        <!--          </span>-->
        <!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: '',
    },
    backLabel: {
      type: String,
      default: '',
    },
    backUrl: {
      type: String,
      default: '',
    },
    tags: {
      type: Array,
      default: () => [],
      validator: (data) => {
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i] !== 'string') {
            return false
          }
        }
        return true
      },
    },
    categories: {
      type: Array,
      default: () => [],
      validator: (data) => {
        for (let i = 0; i < data.length; i++) {
          if (typeof data[i] !== 'object') {
            if (
              typeof data[i].backUrl !== 'string' &&
              typeof data[i].backLabel !== 'string'
            )
              return false
          }
        }
        return true
      },
    },
    info: {
      difficulty: {
        type: String,
        default: '',
      },
      prepTime: {
        type: String,
        default: '',
      },
      cookingTime: {
        type: String,
        default: '',
      },
      totalTime: {
        type: String,
        default: '',
      },
      notes: {
        type: String,
        default: '',
      },
      
    },
    cuisine: {
        type: String,
        default: '',
      },
  },
}
</script>
<style>
.recipe-presentation {
  &__hero {
    background-size: auto 100%;
    @screen sm {
      background-size: cover;
      width: 100%;
      max-width: 1170px;
      margin: 0 auto;
      &::before {
        content: '';
        padding-top: calc((68 / 117) * 100%);
        @apply block w-full;
      }
    }
  }
  &__back {
    min-width: 138px;
  }
}
</style>
