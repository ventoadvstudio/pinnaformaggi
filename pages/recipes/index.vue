<template>
  <main class="recipes-page pb-152 pb-80">
    <SectionCoverCTA
      :title="title"
      :description="description"
      :img="coverImage"
      :headband="false"
      :margin-head="true"
      title-h1
    />
    <div class="container px-0 md:px-20 mt-40">
      <RecipeGrid :items="recipes" />
    </div>
    <div class="container lg:grid lg:grid-cols-12 lg:gap-30 mt-60 md:mt-180">
      <div
        class="recipes-page__text markdown text-14 md:text-16 text-gray-500 lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6"
        v-html="sanitizedSeoText"
      ></div>
    </div>
  </main>
</template>
<script>
import SectionCoverCTA from '@/components/SectionCoverCTA'
import RecipeGrid from '@/components/RecipeGrid'
import ApiService from '@/services/api.service'
import BasePage from '@/components/BasePage'
import { handleSlug, handleAltText } from '@/utils'

export default {
  components: {
    SectionCoverCTA,
    RecipeGrid,
  },
  extends: BasePage,
  async asyncData({ app, store }) {
    const locale = app.i18n.locale
    const { recipesPage } = await ApiService.getRecipesPage(locale)
    const { allRecipes } = await ApiService.getAllRecipes(locale)
    return {
      title: recipesPage.title,
      description: recipesPage.description,
      coverImage: handleAltText(recipesPage.coverImage),
      recipes: allRecipes.map((recipe) => ({
        img: recipe.picture ? handleAltText(recipe.picture) : '',
        title: recipe.name,
        time: `${recipe.duration} ${store.state.common[locale].minutesLabel}`,
        ctaLabel: store.state.common[locale].discoverMoreLabel,
        ctaUrl: handleSlug(locale, 'recipe', recipe.slug),
      })),
      seoText: recipesPage.seoText,
      seo: recipesPage.seo,
    }
  },
  data() {
    return {
      title: '',
      description: '',
      coverImage: '',
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
      it: '/ricette/',
      en: '/recipes/',
    },
  },
}
</script>
