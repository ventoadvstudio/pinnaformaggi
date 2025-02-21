<template>
  <main class="pb-100 pt-110 terms-and-conditions">
    <div class="container">
      <h1 class="text-center font-heading text-50 mb-40">
        {{ title }}
      </h1>
      <div v-if="body" class="markdown" v-html="$sanitize(body)"></div>
    </div>
  </main>
</template>
<script>
import ApiService from '@/services/api.service'
import BasePage from '@/components/BasePage'

export default {
  extends: BasePage,
  async asyncData({ app }) {
    const locale = app.i18n.locale
    const { cookiePolicyPage } = await ApiService.getCookiePolicyPage(locale)
    return cookiePolicyPage
  },
  data() {
    return {
      body: '',
      title: '',
      scriptCookieBot: '',
    }
  },
  mounted() {
    if (this.scriptCookieBot) {
      if (document.getElementById('CookieDeclaration')) return
      const script = document.createElement('script')
      script.src = unescape(this.scriptCookieBot)
      script.type = 'text/javascript'
      script.async = true
      script.setAttribute('defer', 'defer')
      script.setAttribute('data-culture', this.$i18n.locale)
      const container = document.querySelector(
        '.terms-and-conditions .container'
      )
      if (container) {
        container.appendChild(script)
      }
    }
  },
  nuxtI18n: {
    paths: {
      it: '/cookie-policy/',
      en: '/cookie-policy/',
    },
  },
}
</script>
<style>
.terms-and-conditions {
  ul {
    list-style: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    padding-inline-start: 40px;
  }
  h1 {
    @apply text-52 font-bold mb-32;
  }
  h2 {
    @apply text-32 font-bold mb-24;
  }
  h3 {
    @apply text-24 font-bold mb-16;
  }
  h4 {
    @apply text-20 font-bold mb-16;
  }
  h5 {
    @apply text-16 font-bold mb-16;
  }
  h6 {
    @apply text-14 font-bold mb-8;
  }
}
</style>
