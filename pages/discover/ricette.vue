<template>
  <main class="recipes">
    <HeroSecondary
      :title="hero.title"
      :description="hero.description"
      :sub-title="hero.subtitle"
      :background-image="hero.backgroundImage"
      :buttons="hero.categories"
      :discover-more="hero.discoverMore"
      theme="orange"
      large-grid
      next-section-id="recipesWizardHero"
      no-subtitle-mobile
    />
    <RecipesWizardHero
      id="recipesWizardHero"
      :image-head="recipesWizardHero.imageHead"
      :title="recipesWizardHero.title"
      :paragraph="recipesWizardHero.paragraph"
      :start-label="recipesWizardHero.startLabel"
      :image-footer="recipesWizardHero.imageFooter"
    />
  </main>
</template>
<script>
import HeroSecondary from '@/components/HeroSecondary'
import RecipesWizardHero from '@/components/RecipesWizardHero'
import ApiService from '@/services/api.service'
import { handleSlug, handleAltText } from '@/utils'
import BasePage from '@/components/BasePage'

const getRecipeUrl = (locale, category) => {
  switch (category.link._modelApiKey) {
    case 'recipe_category':
      return handleSlug(locale, 'recipeCategory', category.link.slug)
    case 'recipes_page':
      return handleSlug(locale, 'recipes')
  }
  return ''
}

export default {
  name: 'RecipesHomePage',
  components: {
    HeroSecondary,
    RecipesWizardHero,
  },
  extends: BasePage,
  async asyncData({ app }) {
    const locale = app.i18n.locale
    const { recipesHome } = await ApiService.getRecipesHome(locale)
    return {
      hero: {
        title: recipesHome.title,
        description: recipesHome.description,
        backgroundImage: handleAltText(recipesHome.heroImage),
        subtitle: recipesHome.subtitle,
        discoverMore: recipesHome.discoverMore,
        categories: recipesHome.categories.map((category) => ({
          label: category.label,
          image: handleAltText(category.image),
          url: getRecipeUrl(locale, category),
        })),
      },
      seo: recipesHome.seo,
    }
  },
  data() {
    const wizard = this.$store.state.wizard.search[this.$i18n.locale]
    return {
      recipesWizardHero: {
        imageHead: wizard.topImage,
        title: wizard.title,
        paragraph: wizard.description,
        startLabel: wizard.startLabel,
        backLabel: wizard.backLabel,
        findLabel: wizard.submitLabel,
        imageFooter: wizard.bottomImage,
      },
    }
  },
  nuxtI18n: {
    paths: {
      it: '/scopri/ricette/',
      en: '/discover/recipes/',
    },
  },
}
</script>
