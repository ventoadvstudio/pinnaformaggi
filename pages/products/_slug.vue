<template>
  <main class="product-page pt-40 md:pt-75 pb-16 md:pb-30">
    <ProductPresentation
      :title="presentation.title"
      :images="presentation.images"
      :tags="presentation.tags"
      :anchors="presentation.anchors"
      :back-url="presentation.backUrl"
    />
    <div
      class="product-page__content-container container lg:grid lg:grid-cols-12 lg:gap-30 mt-40"
    >
      <div
        class="product-page__content lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6"
      >
        <div
          class="text-gray-500 markdown"
          v-html="sanitizedProductDescription"
        ></div>
        <div>
          <div id="ingredients" class="product-page__anchor relative"></div>
          <ProductIngredients
            :title="ingredients.title"
            :content="sanitizedProductIngredients"
            class="mx-auto mt-35 md:mt-67 markdown"
          />
        </div>
        <div
          class="product-page__extra-info mx-auto mt-34 pb-24 border-b border-solid border-gray-50 text-gray-500 text-center"
          v-html="ingredients.extraInfo"
        ></div>
      </div>
    </div>
    <Slider
      v-if="packaging.items && packaging.items.length > 0"
      :title="packaging.title"
      :items="packaging.items"
      no-padding
      class="pt-32 pb-76 md:pb-80"
    />
    <div>
      <div id="nutrition-facts" class="product-page__anchor relative"></div>
      <NutritionFacts
        v-if="
          nutritionFacts.title ||
          nutritionFacts.description ||
          nutritionFacts.items.length > 0
        "
        :title="nutritionFacts.title"
        :description="nutritionFacts.description"
        :items="nutritionFacts.items"
      />
    </div>
    <div v-if="questionsAndAnswers.items.length > 0">
      <QuestionsAndAnswers
        :title="questionsAndAnswers.title"
        :items="questionsAndAnswers.items"
      />
    </div>
    <RecipePicture
      v-if="
        (recipes && recipes.length > 0 && recipePicture.title) ||
        recipePicture.picture
      "
      :title="recipePicture.title"
      :picture="recipePicture.picture"
      class="md:mt-80"
    />
    <div
      v-if="recipes && recipes.length > 0"
      class="container px-0 md:px-20 mt-40"
    >
      <RecipeGrid :items="recipes" title-h3 />
    </div>
  </main>
</template>
<script>
import ProductPresentation from '@/components/ProductPresentation'
import ProductIngredients from '@/components/ProductIngredients'
import Slider from '@/components/Slider'
import NutritionFacts from '@/components/NutritionFacts'
import RecipePicture from '@/components/RecipePicture'
import RecipeGrid from '@/components/RecipeGrid'
import QuestionsAndAnswers from '@/components/QuestionsAndAnswers'
import ApiService from '@/services/api.service'
import { handleSlug, handleAltText, handleSlugLocales } from '@/utils'
import BasePage from '@/components/BasePage'

const mapNutritionFacts = (items) => {
  const table = []
  const row = []
  items.forEach((item) => {
    if (item._modelApiKey === 'divisor') {
      table.push(row.splice(0, row.length))
      return
    }
    row.push({
      label: item.label,
      value: item.value,
    })
  })
  return table
}
export default {
  name: 'ProductPage',
  components: {
    ProductPresentation,
    ProductIngredients,
    Slider,
    NutritionFacts,
    RecipePicture,
    RecipeGrid,
    QuestionsAndAnswers,
  },
  extends: BasePage,
  async asyncData({ app, from, params, store }) {
    const locale = app.i18n.locale
    const common = store.state.common[locale]
    const { product } = await ApiService.getProduct(locale, params.slug)
    const slugLocales = product._allSlugLocales
    if (slugLocales && slugLocales.length > 0) {
      await store.dispatch(
        'i18n/setRouteParams',
        handleSlugLocales(slugLocales)
      )
    }
    const { allRecipes } = await ApiService.getRecipesByProduct(
      locale,
      product.id
    )
    let recipePictureImage = ''
    if (product.featuredRecipesImage) {
      recipePictureImage = handleAltText(product.featuredRecipesImage)
    } else if (allRecipes && allRecipes.length > 0) {
      const index = Math.floor(Math.random() * allRecipes.length)
      if (allRecipes[index].picture) {
        recipePictureImage = handleAltText(allRecipes[index].picture)
      }
    }
    const anchors = [
      {
        id: 'ingredients',
        label: common.ingredientsLabel,
      },
      {
        id: 'nutrition-facts',
        label: common.nutritionFactsLabel,
      },
    ]
    if (product.questionsAndAnswers && product.questionsAndAnswers.length > 0) {
      anchors.push({
        id: 'question-and-answers',
        label: product.questionAndAnswersTitle,
      })
    }
    return {
      presentation: {
        title: product.name,
        images: product.pictures.map((picture) => handleAltText(picture.image)),
        description: product.description,
        tags: product.tags.map((tag) => tag.label),
        anchors,
        backUrl: from ? '' : handleSlug(locale, 'products'),
      },
      ingredients: {
        title: common.ingredientsLabel,
        content: product.ingredients,
        extraInfo: product.extraInfo,
      },
      packaging: {
        title: product.packagingCarouselTitle,
        items: product.packagingCarousel.map((packaging) => ({
          title: packaging.title,
          image: packaging.image ? handleAltText(packaging.image) : '',
        })),
      },
      nutritionFacts: {
        title: product.nutritionFactsTitle,
        description: product.nutritionFactsDescription,
        items: mapNutritionFacts(product.nutritionFactsTable),
      },
      recipePicture: {
        title: product.featuredRecipesTitle,
        picture: recipePictureImage,
      },
      questionsAndAnswers: {
        title: product.questionAndAnswersTitle,
        items: product.questionsAndAnswers,
      },
      recipes:
        allRecipes && allRecipes.length > 0
          ? allRecipes.map((recipe) => ({
              img: recipe.picture ? handleAltText(recipe.picture) : '',
              title: recipe.name,
              time: recipe.duration + ` ${common.minutesLabel}`,
              ctaLabel: common.visitRecipeLabel,
              ctaUrl: handleSlug(locale, 'recipe', recipe.slug),
            }))
          : [],
      seo: product.seo,
    }
  },
  data() {
    return {
      presentation: {},
      ingredients: {},
      nutritionFacts: {},
      recipePicture: {},
      recipes: [],
    }
  },
  computed: {
    sanitizedProductDescription() {
      return this.$sanitize(this.presentation.description)
    },
    sanitizedProductIngredients() {
      return this.$sanitize(this.ingredients.content)
    },
  },
  nuxtI18n: {
    paths: {
      it: '/prodotti/:slug/',
      en: '/products/:slug/',
    },
  },
}
</script>
<style>
.product-page {
  &__extra-info {
    max-width: 375px;
  }
  &__anchor {
    bottom: 100px;
    @screen md {
      bottom: 150px;
    }
  }
  &__content {
    & a {
      @apply text-primary underline;
    }
  }
}
</style>
