<template>
  <main class="contacts-page overflow-hidden">
    <div v-if="!success">
      <div class="relative pb-100 pt-110 md:pb-140 lg:pt-180 lg:pb-420">
        <datocms-image
          class="absolute inset-0 object-cover w-full h-full"
          :data="heroBackground.responsiveImage"
          :alt="heroBackground.alt"
          layout="fill"
          object-fit="cover"
        />
        <div
          class="relative z-20 container flex flex-col items-center justify-center text-center text-white"
        >
          <h1 class="uppercase text-50 lg:text-80 font-heading">
            {{ title }}
          </h1>
        </div>
      </div>
      <div class="relative">
        <div class="flex flex-col lg:flex-row container">
          <div class="lg:flex-1">
            <img
              class="object-cover lg:h-420 lg:w-1/2 left-0 absolute w-full h-240 md:h-300"
              :srcSet="contactsImage.responsiveImage.srcSet"
              :src="contactsImage.responsiveImage.src"
              :alt="contactsImage.alt"
            />
            <div
              class="lg:h-420 lg:mt-420 mt-240 h-300 md:mt-300 flex items-center"
            >
              <div
                class="lg:h-420 lg:w-1/2 h-300 absolute left-0 w-full bg-gray-700"
              ></div>
              <div class="relative z-20 text-white">
                <h3 class="text-20 mb-20 font-title uppercase">
                  {{ contactsTitle }}
                </h3>
                <div
                  v-for="(info, index) of contactInfo"
                  :key="index.toString()"
                  class="mb-15 text-14 markdown"
                  v-html="$sanitize(info.content)"
                ></div>
              </div>
            </div>
          </div>
          <div
            class="lg:flex-1 flex justify-center items-center relative lg:static"
          >
            <div
              class="lg:h-840 lg:right-0 lg:left-auto lg:w-1/2 left-half transform lg:transform-none -translate-x-1/2 w-screen h-full absolute bg-primary"
            ></div>
            <div
              class="md:grid md:grid-cols-8 md:gap-30 text-white relative z-20 py-50 lg:py-0"
            >
              <div class="col-start-2 lg:col-start-3 col-span-6">
                <h2 class="text-20 font-title uppercase text-center mb-20">
                  {{ formTitle }}
                </h2>
                <p class="text-14">
                  {{ formDescription }}
                </p>
                <form
                  data-netlify="true"
                  method="post"
                  name="contact"
                  class="mt-35"
                  novalidate
                  @submit.prevent="handleSubmit"
                >
                  <input type="hidden" name="form-name" value="contact" />
                  <div class="mb-15">
                    <TextInput
                      id="name"
                      name="name"
                      :error="errors.name"
                      :label="nameLabel"
                      @change="onChange"
                    />
                  </div>
                  <div class="mb-15">
                    <TextInput
                      id="email"
                      type="email"
                      name="email"
                      required
                      :error="errors.email"
                      :label="emailLabel"
                      @change="onChange"
                    />
                  </div>
                  <div class="mb-15">
                    <TextInput
                      id="phone"
                      type="tel"
                      name="phone"
                      :error="errors.phone"
                      :label="telephoneLabel"
                      @change="onChange"
                    />
                  </div>
                  <div class="mb-25">
                    <TextInput
                      id="message"
                      type="textarea"
                      name="message"
                      required
                      :error="errors.message"
                      :label="messageLabel"
                      @change="onChange"
                    />
                  </div>
                  <div class="mb-25 flex">
                    <TextInput
                      id="private"
                      type="radio"
                      name="typology"
                      required
                      :error="errors.typology"
                      :label="privateLabel"
                      @change="
                        models.typology = 'private'
                        errors.typology = null
                      "
                    />
                    <div class="ml-50">
                      <TextInput
                        id="business"
                        type="radio"
                        name="typology"
                        required
                        :label="companyLabel"
                        @change="
                          models.typology = 'business'
                          errors.typology = null
                        "
                      />
                    </div>
                  </div>
                  <div class="mb-25">
                    <TextInput
                      id="privacy"
                      type="checkbox"
                      name="privacy"
                      required
                      :error="errors.privacy"
                      :label="privacyPolicyLabel"
                      @change="onChange"
                    />
                  </div>
                  <div class="text-center">
                    <button
                      type="submit"
                      class="btn btn--small bg-white text-primary"
                    >
                      {{ submitLabel }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <datocms-image
        :data="bottomImage.responsiveImage"
        class="object-contain w-full"
        layout="intrinsic"
      />
    </div>
    <div v-else class="pb-200 pt-110 lg:pt-180 bg-cream">
      <div class="container lg:grid grid-cols-12 gap-30">
        <div
          class="text-center lg:col-start-3 lg:col-span-8 xl:col-start-4 xl:col-span-6 relative"
        >
          <img
            :src="thankYouImage.responsiveImage.src"
            :srcset="thankYouImage.responsiveImage.srcset"
            :alt="thankYouImage.alt"
            class="mx-auto w-300 object-cover"
          />
          <h3 class="text-50 font-heading mb-13 sm:mb-20 text-primary">
            {{ thankYouTitle }}
          </h3>
          <p class="text-14 mb-40 sm:mb-60 text-gray-500">
            {{ thankYouParagraph }}
          </p>
          <button
            type="button"
            class="btn btn--primary btn--small text-cream"
            :class="{ 'opacity-60': loading }"
            :disabled="loading"
            @click="$router.push('/')"
          >
            {{ thankYouButtonLabel }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import ApiService from '@/services/api.service'
import TextInput from '@/components/TextInput'
import { validateForm, handleAltText } from '@/utils'
import BasePage from '@/components/BasePage'

export default {
  components: {
    TextInput,
  },
  extends: BasePage,
  async asyncData({ app }) {
    const locale = app.i18n.locale
    const { contactsPage } = await ApiService.getContactsPage(locale)
    return {
      ...contactsPage,
      contactsImage: handleAltText(contactsPage.contactsImage),
      bottomImage: handleAltText(contactsPage.bottomImage),
      heroBackground: handleAltText(contactsPage.heroBackground),
      thankYouImage: handleAltText(contactsPage.thankYouImage),
    }
  },
  data() {
    return {
      contactsImage: {
        responsiveImage: {},
      },
      bottomImage: {
        responsiveImage: {},
      },
      heroBackground: {
        responsiveImage: {},
      },
      contactInfo: [],
      contactsTitle: '',
      title: '',
      formDescription: '',
      formTitle: '',
      emailLabel: '',
      nameLabel: '',
      telephoneLabel: '',
      messageLabel: '',
      companyLabel: '',
      privateLabel: '',
      privacyPolicyLabel: '',
      submitLabel: '',
      requiredLabel: '',
      invalidEmailLabel: '',
      thankYouTitle: '',
      thankYouParagraph: '',
      thankYouButtonLabel: '',
      thankYouImage: {
        responsiveImage: {},
      },
      inputs: [
        {
          id: 'name',
          type: 'text',
          required: false,
        },
        {
          id: 'email',
          type: 'email',
          required: true,
        },
        {
          id: 'typology',
          type: 'radio',
          required: true,
        },
        {
          id: 'phone',
          type: 'tel',
          required: false,
        },
        {
          id: 'message',
          type: 'text',
          required: true,
        },
        {
          id: 'privacy',
          type: 'checkbox',
          required: true,
        },
      ],
      models: {
        name: '',
        email: '',
        typology: '',
        phone: '',
        message: '',
        privacy: '',
      },
      loading: false,
      success: false,
      errors: {},
    }
  },
  methods: {
    encode(data) {
      return Object.keys(data)
        .map(
          (key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join('&')
    },
    async handleSubmit() {
      const errors = validateForm(
        this.inputs,
        this.models,
        this.requiredLabel,
        this.invalidEmailLabel
      )
      if (Object.keys(errors).length > 0) {
        this.errors = {
          ...this.errors,
          ...errors,
        }
        return
      }
      this.loading = true
      const axiosConfig = {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
      const data = {
        'form-name': 'contact',
      }
      this.inputs.forEach((el) => {
        data[el.id] = this.models[el.id]
      })
      try {
        await this.$axios.post('/', this.encode(data), axiosConfig)
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'Compilazione form contatti',
            typology: data.typology,
          })
        }
        this.success = true
        window.scrollTo({ top: 0 })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    onChange(id, value) {
      this.models[id] = value
      this.errors[id] = null
    },
  },
  nuxtI18n: {
    paths: {
      it: '/contatti/',
      en: '/contacts/',
    },
  },
}
</script>
