<template>
  <footer class="footer bg-gray-900" data-datocms-noindex>
    <div
      v-show="$route.name && !$route.name.includes('contacts')"
      class="bg-primary pt-40 pb-60 lg:pt-60 lg:pb-80"
    >
      <div class="container flex flex-col items-center text-white">
        <h6 class="text-20 font-title uppercase mb-10 md:mb-15">
          {{ contactTitle }}
        </h6>
        <p class="text-14 mb-40 text-center">{{ contactParagraph }}</p>
        <nuxt-link
          class="btn btn--tiny bg-white text-primary"
          :to="contactsUrl"
        >
          {{ contactButtonLabel }}
        </nuxt-link>
      </div>
    </div>
    <div
      v-if="Array.isArray(socials) && socials.length > 0"
      class="footer__socials bg-gray-700 py-36 sm:py-40"
    >
      <div class="container flex justify-center items-center">
        <a
          v-for="(social, i) in socials"
          :key="`social-${i}`"
          :href="social.url"
          target="_blank"
          class="footer__social relative w-45 h-45 p-6 bg-gray-150 rounded-circle"
          :class="{ 'ml-22': i > 0 }"
        >
          <img
            :src="social.icon.url"
            :alt="social.icon.alt"
            class="absolute top-half left-half transform -translate-x-1/2 -translate-y-1/2"
          />
        </a>
      </div>
    </div>
    <div class="footer__content-container container pt-45 pb-100">
      <div class="flex flex-col items-center text-center">
        <img
          src="@/assets/images/logo-white.svg"
          alt="Pinna Logo"
          class="w-200"
          width="200"
          height="120"
        />
        <div
          class="footer__content markdown text-white opacity-50 mb-20"
          v-html="sanitizedContent"
        ></div>
        <span class="text-12 text-white">
          {{ legalText }}
        </span>
        <div class="flex items-center mt-6">
          <nuxt-link
            v-if="showTermsAndConditions"
            :to="termsAndConditionsUrl"
            class="text-12 uppercase text-white mr-6"
          >
            {{ termsAndConditionsLabel }}
          </nuxt-link>
          <nuxt-link
            v-if="showCookiePolicy"
            :to="cookiePolicyUrl"
            class="text-12 uppercase text-white mr-6"
          >
            {{ cookiePolicyLabel }}
          </nuxt-link>
          <nuxt-link
            :to="privacyPolicyUrl"
            class="text-12 uppercase text-white"
          >
            {{ privacyPolicyLabel }}
          </nuxt-link>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
import { validateArrayOfObject, handleSlug } from '@/utils'

export default {
  props: {
    content: {
      type: String,
      required: true,
    },
    contactTitle: {
      type: String,
      required: true,
    },
    contactParagraph: {
      type: String,
      required: true,
    },
    contactButtonLabel: {
      type: String,
      required: true,
    },
    legal: {
      type: String,
      required: true,
    },
    termsAndConditionsLabel: {
      type: String,
      required: true,
    },
    showTermsAndConditions: {
      type: Boolean,
      default: false,
    },
    cookiePolicyLabel: {
      type: String,
      required: true,
    },
    showCookiePolicy: {
      type: Boolean,
      default: false,
    },
    privacyPolicyLabel: {
      type: String,
      required: true,
    },
    socials: {
      type: Array,
      default: () => [],
      validator: (arr) => {
        const keys = ['icon', 'url']
        return validateArrayOfObject(keys, arr)
      },
    },
  },
  data() {
    return {
      currentYear: undefined,
    }
  },
  computed: {
    sanitizedContent() {
      return this.$sanitize(this.content)
    },
    legalText() {
      return this.legal.replace('{year}', this.currentYear)
    },
    contactsUrl() {
      return handleSlug(this.$i18n.locale, 'contacts')
    },
    privacyPolicyUrl() {
      return handleSlug(this.$i18n.locale, 'privacyPolicy')
    },
    termsAndConditionsUrl() {
      return handleSlug(this.$i18n.locale, 'termsAndConditions')
    },
    cookiePolicyUrl() {
      return handleSlug(this.$i18n.locale, 'cookiePolicy')
    },
  },
  mounted() {
    this.currentYear = new Date().getFullYear()
  },
}
</script>
<style>
.footer {
  &__content {
    max-width: 300px;
  }
}
</style>
