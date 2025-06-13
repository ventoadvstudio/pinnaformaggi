<template>
  <main class="recipes-category-page pb-160 md:pb-80">
    <SectionCoverSwitch
      :title="sectionCoverSwitch.title"
      :description="sectionCoverSwitch.description"
      :img="sectionCoverSwitch.img"
      :links="sectionCoverSwitch.links"
      :margin-head="true"
    />
    <div class="flex flex-row flex-wrap justify-center gap-8 mt-20">
     <RecipeTag
        v-if="cateinterne.backLabel"
        :back-label="cateinterne.backLabel"
        :back-url="cateinterne.backUrl"
        class="mb-20 md:mb-0"
    />
        </div>
    <div class="container px-0 md:px-20 mt-40">
      <RecipeGrid :items="recipes" />
    </div>
    <div class="container lg:grid lg:grid-cols-12 lg:gap-30 mt-60 md:mt-180">
      <div
        class="products-page__text markdown text-14 md:text-16 text-gray-500 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6"
        v-html="sanitizedSeoText"
      ></div>
    </div>
  </main>
</template>
<script>
import SectionCoverSwitch from '@/components/SectionCoverSwitch'
import RecipeGrid from '@/components/RecipeGrid'
import ApiService from '@/services/api.service'
import { handleSlug, handleAltText, handleSlugLocales } from '@/utils'
import BasePage from '@/components/BasePage'
import RecipeTag from '../../../components/RecipeTag.vue'
import RecipePresentation from '../../../components/RecipePresentation.vue'

export default {
  name: 'RecipeDishPage',
  components: {
    SectionCoverSwitch,
    RecipeGrid,
    RecipeTag,
  },

  extends: BasePage,
  async asyncData({ app, store, params }) {
    const locale = app.i18n.locale
    const { recipeDish } = await ApiService.getRecipeDishPage(
      locale,
      params.slug
    )
    const slugLocales = recipeDish._allSlugLocales
    if (slugLocales && slugLocales.length > 0) {
      await store.dispatch(
        'i18n/setRouteParams',
        handleSlugLocales(slugLocales)
      )
    }
    const { allRecipes } = await ApiService.getRecipesByDish(
      locale,
      recipeDish.id
    )
    const { allRecipeDishes } = await ApiService.getRecipeDishes(locale)

    const catinterne = recipeDish.catinterne.map((cateinterne) => ({
      backUrl: cateinterne.slug
        ? handleSlug(locale, 'recipeCategory', cateinterne.slug)
        : '',
      backLabel: cateinterne.name,
    }))

    return {
      sectionCoverSwitch: {
        title: recipeDish.name,
        description: recipeDish.shortDescription,
        img: handleAltText(recipeDish.image),
        links: allRecipeDishes.map((category) => ({
          label: category.name,
          url: handleSlug(locale, 'recipeDish', category.slug),
        })),
      },
      catinterne,
      recipes: allRecipes.map((recipe) => ({
        img: recipe.picture ? handleAltText(recipe.picture) : '',
        title: recipe.name,
        time: `${recipe.duration} ${store.state.common[locale].minutesLabel}`,
        ctaLabel: store.state.common[locale].visitRecipeLabel,
        ctaUrl: handleSlug(locale, 'recipe', recipe.slug),
      })),
      seoText: recipeDish.seoText,
      seo: recipeDish.seo,
    }
  },
  data() {
    return {
      sectionCoverSwitch: {},
      recipes: [],
      seoText: '',
      catinterne:[],
    }
  },
  computed: {
    sanitizedSeoText() {
      return this.$sanitize(this.seoText)
    },
  },
  nuxtI18n: {
    paths: {
      it: '/ricette/pietanze/:slug/',
      en: '/recipes/dishes/:slug/',
    },
  },
}
</script>
