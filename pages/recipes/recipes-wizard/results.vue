<template>
  <main class="wizard-page">
    <RecipesWizardResults
      v-if="results"
      :results-label="search.resultsLabel"
      :quantity-label="search.quantityLabel"
      :decorative-image="search.imageHead"
      :items="results"
    />
    <div
      class="bg-orange flex justify-center py-60 lg:py-100"
      :class="{ 'mt-16 md:mt-30': results && results.length === 0 }"
    >
      <nuxt-link
        :to="{ path: wizardRoute, query: { open: true } }"
        class="btn btn--primary btn--large"
      >
        {{ search.ctaLabelNewSearch }}
      </nuxt-link>
    </div>
  </main>
</template>
<script>
import RecipesWizardResults from '@/components/RecipesWizardResults'
import BasePage from '@/components/BasePage'
import { handleSlug, handleAltText } from '@/utils'
export default {
  components: {
    RecipesWizardResults,
  },
  extends: BasePage,
  computed: {
    wizardRoute() {
      const locale = this.$i18n.locale
      return handleSlug(locale, 'recipeWizard')
    },
    results() {
      return this.$store.state.wizard.results
    },
    search() {
      const locale = this.$i18n.locale
      const search = this.$store.state.wizard.search[locale]
      return {
        imageHead: handleAltText(search.topImage),
        title: search.title,
        paragraph: search.description,
        startLabel: search.startLabel,
        backLabel: search.backLabel,
        findLabel: search.submitLabel,
        resultsLabel: search.resultsLabel,
        quantityLabel: search.quantityLabel,
        ctaLabelNewSearch: search.ctaLabelNewSearch,
        imageFooter: handleAltText(search.bottomImage),
      }
    },
    seo() {
      const locale = this.$i18n.locale
      return this.$store.state.wizard.search[locale].seo
    },
  },
  created() {
    if (!this.results) {
      this.$router.push({
        path: handleSlug(this.$i18n.locale, 'recipeWizard'),
      })
    }
  },
  nuxtI18n: {
    paths: {
      it: '/ricette/ricerca-guidata/risultati/',
      en: '/recipes/recipes-wizard/results/',
    },
  },
}
</script>
