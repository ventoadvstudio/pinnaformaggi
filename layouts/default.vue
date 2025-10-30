<template>
  <div class="layout mx-auto">
    <Header :items="items" />
    <Nuxt />
    <VideoModal />
    <Footer
      :contact-title="footer.contactTitle"
      :contact-paragraph="footer.contactParagraph"
      :contact-button-label="footer.contactButtonLabel"
      :socials="footer.socials"
      :content="footer.content"
      :legal="footer.legal"
      :terms-and-conditions-label="footer.termsAndConditionsLabel"
      :privacy-policy-label="footer.privacyPolicyLabel"
      :cookie-policy-label="footer.cookiePolicyLabel"
      :show-cookie-policy="footer.showCookiePolicy"
      :show-terms-and-conditions="footer.showTermsAndConditions"
    />
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import VideoModal from '@/components/VideoModal'
import { handleSlug, handleAltText } from '@/utils'
import initDatoCMSSearch from '@/utils/datocms-search'

export default {
  components: {
    Header,
    Footer,
    VideoModal,
  },
  computed: {
    header() {
      const locale = this.$i18n.locale
      return this.$store.state.header[locale]
    },
    footerData() {
      const locale = this.$i18n.locale
      return this.$store.state.footer[locale]
    },
    items() {
      const locale = this.$i18n.locale
      const items = [
        // chi siamo
        {
          label: this.header.menu.companyLabel,
          // Dropdown AZIENDA con le tre voci richieste
          entries: [
            {
              label: locale === 'it' ? 'La nostra storia' : 'Our story',
              link: this.localePath(
                locale === 'it' ? '/azienda/storia/' : '/company/story/'
              ),
            },
            {
              label: locale === 'it' ? 'I nostri valori' : 'Our values',
              link: this.localePath(
                locale === 'it'
                  ? '/azienda/i-nostri-valori/'
                  : '/company/our-values/'
              ),
            },
          ],
        },

        // formaggi
        {
          label: this.header.menu.productsLabel,
          entries: this.header.menu.featuredLines.map((el) => ({
            label: el.label,
            link: handleSlug(locale, el.link._modelApiKey, el.link.slug),
          })),
        },

        // ricette
        {
          label: this.header.menu.recipesLabel,
          entries: this.header.menu.featuredCategories.map((el) => ({
            label: el.label,
            link: handleSlug(locale, el.link._modelApiKey, el.link.slug),
            special: el.button,
          })),
        },
      ]

      // Voce top-level: Sostenibilità / Sustainability
      items.splice(3, 0, {
        label:
          this.header.menu.sustainabilityLabel ||
          (locale === 'it' ? 'Sostenibilità' : 'Sustainability'),
        link: this.localePath(
          locale === 'it' ? '/azienda/sostenibilita' : '/company/sustainability'
        ),
      })

      // Voce top-level: Ricettari / Ricepe Books
      items.splice(3, 0, {
        label:
          this.header.menu.recipebooks ||
          (locale === 'it' ? 'Ricettari' : 'Ricepe Books'),
        link: this.localePath(
          locale === 'it' ? '/scarica-ricettari/' : '/scarica-ricettari/'
        ),
      })

      // Contatti
      items.push({
        label: this.header.menu.contactsLabel,
        link: handleSlug(locale, 'contacts'),
      })

      return items
    },
    footer() {
      return {
        content: this.footerData.content,
        legal: this.footerData.copyright,
        contactTitle: this.footerData.contactTitle,
        contactParagraph: this.footerData.contactParagraph,
        contactButtonLabel: this.footerData.contactButtonLabel,
        termsAndConditionsLabel: this.footerData.termsAndConditionsLabel,
        cookiePolicyLabel: this.footerData.cookiePolicyLabel,
        showCookiePolicy: this.footerData.showCookiePolicy,
        showTermsAndConditions: this.footerData.showTermsAndConditions,
        privacyPolicyLabel: this.footerData.privacyDisclaimerLabel,
        socials: this.footerData.socialNetworks.map((social) => ({
          icon: handleAltText(social.logo),
          url: social.url,
        })),
      }
    },
  },
  mounted() {
    initDatoCMSSearch()
  },
  head() {
    const i18nSeo = this.$nuxtI18nSeo()
    return {
      htmlAttrs: { ...i18nSeo.htmlAttrs },
      meta: [...i18nSeo.meta],
      link: i18nSeo.link
        .filter((link) => {
          if (link.rel === 'canonical') return true
          const allowedHrefLang = ['x-default', 'it', 'en']
          return allowedHrefLang.includes(link.hreflang)
        })
        .map((link) => {
          if (link.href.slice(-1) !== '/') {
            link.href = `${link.href}/`
          }
          return link
        }),
    }
  },
}
</script>

<style>
body {
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  line-height: 1.375;
}

/* markdown links */
p a {
  @apply text-primary underline;
}
.layout {
  max-width: 1920px;
}
</style>
