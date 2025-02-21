<template>
  <main class="recipes-category-page pb-160 md:pb-80">
    <SectionCoverSwitch
      :title="sectionCoverSwitch.title"
      :description="sectionCoverSwitch.description"
      :img="sectionCoverSwitch.img"
      :links="sectionCoverSwitch.links"
      :margin-head="true"
    />
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

export default {
  name: 'RecipeCategoryPage',
  components: {
    SectionCoverSwitch,
    RecipeGrid,
  },
  extends: BasePage,
  async asyncData({ app, store, params }) {
    const locale = app.i18n.locale
    const { recipeCategory } = await ApiService.getRecipeCategoryPage(
      locale,
      params.slug
    )
    const slugLocales = recipeCategory._allSlugLocales
    if (slugLocales && slugLocales.length > 0) {
      await store.dispatch(
        'i18n/setRouteParams',
        handleSlugLocales(slugLocales)
      )
    }
    const { allRecipes } = await ApiService.getRecipesByCategory(
      locale,
      recipeCategory.id
    )
    const { allRecipeCategories } = await ApiService.getRecipeCategories(locale)
    return {
      sectionCoverSwitch: {
        title: recipeCategory.name,
        description: recipeCategory.shortDescription,
        img: handleAltText(recipeCategory.image),
        links: allRecipeCategories.map((category) => ({
          label: category.name,
          url: handleSlug(locale, 'recipeCategory', category.slug),
        })),
      },
      recipes: allRecipes.map((recipe) => ({
        img: recipe.picture ? handleAltText(recipe.picture) : '',
        title: recipe.name,
        time: `${recipe.duration} ${store.state.common[locale].minutesLabel}`,
        ctaLabel: store.state.common[locale].visitRecipeLabel,
        ctaUrl: handleSlug(locale, 'recipe', recipe.slug),
      })),
      seoText: recipeCategory.seoText,
      seo: recipeCategory.seo,
    }
  },

  data() {
    return {
      sectionCoverSwitch: {},
      recipes: [],
      seoText: '',
    }
  },
  computed: {
    sanitizedSeoText() {
      return this.$sanitize(this.seoText)
    },
  },
  nuxtI18n: {
    paths: {
      it: '/ricette/categorie/:slug/',
      en: '/recipes/categories/:slug/',
    },
  },
}
</script>
