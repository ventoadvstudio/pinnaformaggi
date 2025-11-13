<template>
  <main class="wizard-page">
    <RecipesWizard
      :title="recipeWizardData.title"
      :paragraph="recipeWizardData.paragraph"
      :steps="recipeWizardData.steps"
      :image-head="recipeWizardData.imageHead"
      :image-footer="recipeWizardData.imageFooter"
      :start-label="recipeWizardData.startLabel"
      :back-label="recipeWizardData.backLabel"
      :find-label="recipeWizardData.findLabel"
      @submit="searchRecipes"
    />
  </main>
</template>
<script>
import RecipesWizard from '@/components/RecipesWizard'
import ApiService from '@/services/api.service'
import { handleSlug, handleAltText } from '@/utils'
import BasePage from '@/components/BasePage'
export default {
  components: {
    RecipesWizard,
  },
  extends: BasePage,
  computed: {
    recipeWizardData() {
      const wizard = this.$store.state.wizard.search[this.$i18n.locale]
      return {
        imageHead: handleAltText(wizard.topImage),
        title: wizard.title,
        paragraph: wizard.description,
        startLabel: wizard.startLabel,
        backLabel: wizard.backLabel,
        findLabel: wizard.submitLabel,
        imageFooter: handleAltText(wizard.bottomImage),
        seo: wizard.seo,
        steps: [
          {
            title: wizard.typologyLabel,
            choices: wizard.typologies.map((typology) => ({
              label: typology.name,
              value: typology.id,
            })),
          },
          {
            title: wizard.difficultyLabel,
            choices: wizard.difficulties.map((difficulty) => ({
              label: difficulty.name,
              value: difficulty.id,
            })),
          },
          {
            title: wizard.durationLabel,
            choices: wizard.durationIntervals.map((interval) => ({
              label: interval.label,
              value: [interval.minimum, interval.maximum],
            })),
          },
        ],
      }
    },
  },
  methods: {
    async searchRecipes(filters) {
      const locale = this.$i18n.locale
      const { allRecipes } = await ApiService.getAllRecipesWizard(
        locale,
        filters[1],
        filters[2],
        filters[3]
      )
      let results
      if (allRecipes && allRecipes.length > 0)
        results = allRecipes.map((recipe) => ({
          img: recipe.picture ? handleAltText(recipe.picture) : '',
          title: recipe.name,
          time:
            recipe.duration +
            ` ${this.$store.state.common[locale].minutesLabel}`,
          ctaLabel: this.$store.state.common[locale].visitRecipeLabel,
          ctaUrl: handleSlug(locale, 'recipe', recipe.slug),
        }))
      else results = []
      this.$store.commit('setWizardResults', results)
      this.$router.push({
        path: handleSlug(locale, 'recipeWizardResults'),
      })
    },
  },
  nuxtI18n: {
    paths: {
      it: '/ricette/ricerca-guidata/',
      en: '/recipes/recipes-wizard/',
    },
  },
}
</script>
