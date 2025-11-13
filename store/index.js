import { startStore } from '~/utils/store'

export const state = () => ({
  started: false,
  common: {
    it: {},
    en: {},
  },
  header: {
    it: {},
    en: {},
  },
  footer: {
    it: {},
    en: {},
  },
  wizard: {
    search: {
      it: {},
      en: {},
    },
    results: {},
  },
  seo: {
    it: {},
    en: {},
  },
})

export const mutations = {
  setStarted(state, data) {
    state.started = data
  },
  setCommon(state, data) {
    state.common = data
  },
  setHeader(state, data) {
    state.header = data
  },
  setFooter(state, data) {
    state.footer = data
  },
  setWizardSearch(state, data) {
    state.wizard.search = data
  },
  setWizardResults(state, data) {
    state.wizard.results = data
  },
  setSeo(state, data) {
    state.seo = data
  },
}

export const actions = {
  async nuxtServerInit({ commit }) {
    await startStore(commit)
  },
}
