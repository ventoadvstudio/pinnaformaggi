<template>
  <main class="our-values-page">
    <CollapsibleHero
      :title="hero.title"
      :description="hero.description"
      :background-image="hero.backgroundImage"
      :items="hero.items"
      :open-label="hero.openLabel"
      :close-label="hero.closeLabel"
    />
    <CollapsibleBoxes :items="boxes" />
  </main>
</template>
<script>
import CollapsibleHero from '@/components/CollapsibleHero'
import CollapsibleBoxes from '@/components/CollapsibleBoxes'
import ApiService from '@/services/api.service'
import BasePage from '@/components/BasePage'
export default {
  name: 'OurValuesPage',
  components: {
    CollapsibleHero,
    CollapsibleBoxes,
  },
  extends: BasePage,
  async asyncData({ app }) {
    const locale = app.i18n.locale
    const { companyValuesPage } = await ApiService.getCompanyValuesPage(locale)
    return companyValuesPage
  },
  data() {
    return {
      hero: {},
      boxes: [],
    }
  },
  nuxtI18n: {
    paths: {
      it: '/azienda/i-nostri-valori/',
      en: '/company/our-values/',
    },
  },
}
</script>
