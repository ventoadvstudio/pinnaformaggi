import ApiService from '@/services/api.service'

export async function startStore(commit) {
  const languages = ['it', 'en']
  const commonI18n = {}
  const headerI18n = {}
  const footerI18n = {}
  const recipeWizardI18n = {}
  for (const language of languages) {
    const { common, _site } = await ApiService.getCommon(language)
    common.globalSeo = _site.globalSeo
    commonI18n[language] = common
    headerI18n[language] = await ApiService.getHeader(language)
    footerI18n[language] = (await ApiService.getFooter(language)).footer
    recipeWizardI18n[language] = (
      await ApiService.getRecipeWizard(language)
    ).recipeWizard
  }
  await commit('setCommon', commonI18n)
  await commit('setHeader', headerI18n)
  await commit('setFooter', footerI18n)
  await commit('setWizardSearch', recipeWizardI18n)
  await commit('setStarted', true)
}
