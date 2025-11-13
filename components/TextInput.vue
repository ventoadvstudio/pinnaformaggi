<template>
  <div>
    <div v-if="typeInput === 'checkbox'" class="checkbox-input">
      <label>
        <div
          class="checkbox-input__text markdown"
          :class="{ 'text-red': !!error }"
          v-html="$sanitize(label)"
        ></div>
        <input
          v-model="value"
          type="checkbox"
          :name="name"
          :required="required"
          @change="$emit('change', id, value)"
        />
        <span class="checkmark"></span>
      </label>
      <span v-if="error" class="text-black text-12 block">
        {{ error }}
      </span>
    </div>
    <div v-else-if="typeInput === 'radio'" class="radio-input">
      <label>
        <div class="radio-input__text" v-html="$sanitize(label)"></div>
        <input
          v-model="value"
          type="radio"
          :name="name"
          :required="required"
          @change="$emit('change', id, value)"
        />
        <span class="checkmark"></span>
      </label>
      <span v-if="error" class="text-black text-12 block">
        {{ error }}
      </span>
    </div>
    <div v-else-if="typeInput === 'textarea'" class="text-input">
      <div class="relative">
        <textarea
          :id="id"
          v-model="value"
          :name="name"
          :type="typeInput"
          :placeholder="label"
          class="text-input__input text-14 bg-transparent w-full h-full px-18 py-12 text-primary focus:outline-none"
          :class="{ 'text-red': !!error }"
          :required="required"
          maxlength="300"
          rows="4"
          @input="$emit('change', id, value)"
        />
      </div>
      <span v-if="error" class="text-black text-12 block">
        {{ error }}
      </span>
    </div>
    <div v-else class="text-input">
      <div class="relative">
        <input
          :id="id"
          v-model="value"
          :name="name"
          :type="typeInput"
          :placeholder="label"
          class="text-input__input bg-transparent text-14 w-full h-full px-18 pt-12 pb-12 focus:outline-none text-primary"
          :class="{ 'text-red': !!error }"
          :required="required"
          @focus="active = true"
          @blur="active = false"
          @input="$emit('change', id, value)"
        />
      </div>
      <span v-if="error" class="text-black text-12 block">
        {{ error }}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: undefined,
    },
    required: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
      validator: (type) => {
        const allowedHTMLTypes = [
          'text',
          'email',
          'radio',
          'tel',
          'checkbox',
          'name',
          'surname',
          'textarea',
          'company',
        ]
        return allowedHTMLTypes.includes(type)
      },
    },
  },
  data() {
    return {
      active: false,
      value: '',
    }
  },
  computed: {
    typeInput() {
      if (this.type === 'email') return 'email'
      if (this.type === 'checkbox') return 'checkbox'
      if (this.type === 'textarea') return 'textarea'
      if (this.type === 'radio') return 'radio'
      return 'text'
    },
  },
}
</script>
<style>
.text-input {
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: theme('colors.primary');
  }
  input::-moz-placeholder,
  textarea::-moz-placeholder {
    color: theme('colors.primary');
    opacity: 1;
  }
  input::-ms-input-placeholder,
  textarea::-ms-input-placeholder {
    color: theme('colors.primary');
  }
  input::placeholder,
  textarea::placeholder {
    color: theme('colors.primary');
  }
  &__input {
    border-radius: 8px;
    border: solid 2px theme('colors.white');
    background-color: theme('colors.white');
    -webkit-appearance: none;
  }

  &__label {
    top: 50%;
    left: 18px;
    transform-origin: left top;
    transform: translateY(-50%);
    text-overflow: ellipsis;
    width: calc(100% - 36px);
  }

  textarea {
    max-height: 150px;
    min-height: 81px;
  }
}

.checkbox-input {
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    border-radius: 4px;
    background-color: theme('colors.white');
    border: 1px solid theme('colors.gray.400');
    &::after {
      content: '';
      position: absolute;
      display: none;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: 1px solid theme('colors.primary');
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  > label {
    display: block;
    position: relative;
    padding-left: 28px;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    input:checked ~ .checkmark::after {
      display: block;
    }
    a {
      text-decoration: underline;
    }
  }
}

.radio-input {
  > label {
    display: block;
    position: relative;
    padding-left: 26px;
    cursor: pointer;
    font-size: 14px;
    user-select: none;
    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }
    input:checked ~ .checkmark {
      background-color: theme('colors.white');
    }
    input:checked ~ .checkmark::after {
      display: block;
    }
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 16px;
    width: 16px;
    background-color: theme('colors.white');
    border-radius: 50%;
    &::after {
      content: '';
      position: absolute;
      display: none;
      top: 4px;
      left: 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: theme('colors.primary');
    }
  }
}
</style>
