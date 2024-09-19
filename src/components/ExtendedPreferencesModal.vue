<template>
  <BuilderModal
    title="Extended Preferences"
    class="extended-preferences-modal"
    @close="handleClose"
  >
    <template #default>
      <div v-show="data.length">
        <Vueform v-bind="form" ref="form$" />
      </div>
      <div
        v-show="!data.length"
        class="vfb-extended-preferences-empty-wrapper"
      >
        <div class="vfb-extended-preferences-empty-icon">
          <builder-icon
            :icon="['fas', 'list']"
          />
        </div>

        <div class="vfb-extended-preferences-empty-title">No extended preferences</div>
        <div class="vfb-extended-preferences-empty-subtitle">The extended preference list is empty</div>

        <div
          @click.prevent="handleAdd"
          @keypress.enter.space="handleAdd"
          class="vfb-btn-primary"
        >Add preference</div>
      </div>
    </template>

    <template #footer>
      <div class="vfb-modal-buttons">
        <div class="vfb-modal-buttons-left">
          <div
            @click.prevent="handleSave"
            @keypress.enter.space="handleSave"
            class="vfb-btn-primary"
            tabindex="0"
            role="button"
          >Save</div>
          <div
            @click.prevent="handleReset"
            @keypress.enter.space="handleReset"
            class="vfb-btn-secondary"
            tabindex="0"
            role="button"
          >Reset</div>
        </div>
        <div
          @click.prevent="handleClose"
          @keypress.enter.space="handleClose"
          class="vfb-btn-transparent !outline-none"
          tabindex="0"
          role="button"
        >Cancel</div>
      </div>
    </template>
  </BuilderModal>
</template>

<script setup>
import { ref, inject, onMounted, nextTick, computed } from 'vue'

// ============= DEFINITIONS =============

const emit = defineEmits([
  'close'
])

const { builder$ } = defineProps({
  builder$: {
    type: Object,
    required: true,
  }
})

// =============== INJECT ================

const $vueform = inject('$vueform')

// ================ DATA =================

const form$ = ref(null)

const data = computed(() => {
  return form$.value?.data?.extendedPreferences || []
})

const types = Object.keys($vueform.value.extendedPreferences).reduce((prev, curr) => ({
  ...prev,
  [curr]: $vueform.value.extendedPreferences[curr].label,
}), {})

const form = ref({
  endpoint: false,
  displayErrors: false,
  size: 'sm',
  schema: {
    extendedPreferences: {
      type: 'list',
      initial: 0,
      addText: '+ Add preference',
      object: {
        schema: {
          type: {
            type: 'select',
            search: true,
            canDeselect: false,
            canClear: false,
            items: types,
            default: Object.keys(types)[0],
            rules: 'distinct',
            label: 'Extended Preference',
            columns: 3,
            messages: {
              distinct: 'This Preferences has already been used.',
            },
            onChange(newValue, oldValue, el$) {
              // Quick fix for distinct rule not being revalidated for
              // the other field if one is changed to a different.
              el$.form$.elements$.extendedPreferences.children$Array.forEach((el$) => {
                el$.children$.type.validate()
              })
            },
          },
          showOnPage: {
            type: 'radiogroup',
            label: 'Show on Page',
            view: 'tabs',
            default: 1,
            items: [
              { value: true, label: 'On' },
              { value: false, label: 'Off' },
            ],
            columns: 1,
          },
          element: {
            type: 'select',
            search: true,
            canDeselect: false,
            canClear: false,
            label: 'Type',
            default: 'select',
            items: {
              select: 'Single Select',
              multiselect: 'Multi Select',
              text: 'Free Text',
            },
            columns: 2,
            conditions: [
              ['extendedPreferences.*.showOnPage', true]
            ],
            rules: 'required',
            messages: {
              required: 'Please select a type',
            }
          },
          label: {
            type: 'text',
            label: 'Label',
            placeholder: 'Type a label...',
            floating: false,
            columns: 2,
            conditions: [
              ['extendedPreferences.*.showOnPage', true]
            ],
            rules: 'required',
            messages: {
              required: 'Please provide a label',
            }
          },
          userCanEdit: {
            type: 'radiogroup',
            label: 'Can Edit',
            view: 'tabs',
            default: 1,
            items: [
              { value: true, label: 'On' },
              { value: false, label: 'Off' },
            ],
            columns: 1,
            conditions: [
              ['extendedPreferences.*.showOnPage', true]
            ],
          },
          hasDefault: {
            type: 'radiogroup',
            view: 'tabs',
            label: 'Has Default',
            default: 1,
            items: [
              { value: true, label: 'On' },
              { value: false, label: 'Off' },
            ],
            columns: 1,
            conditions: [
              ['extendedPreferences.*.userCanEdit', true],
              ['extendedPreferences.*.showOnPage', true],
            ],
          },
          default: {
            type: 'text',
            label: 'Default Value',
            placeholder: 'Type a default...',
            floating: false,
            columns: 2,
            conditions: [
              [
                ['extendedPreferences.*.showOnPage', false],
                ['extendedPreferences.*.userCanEdit', false],
                ['extendedPreferences.*.hasDefault', true],
              ]
            ],
            messages: {
              required: 'Default value must be provided'
            },
            rules: 'required'
          },
        }
      }
    },
  },
})

// =============== METHODS ===============

const handleAdd = () => {
  form$.value.el$('extendedPreferences').add(undefined, true)
}

const handleSave = async () => {
  await form$.value.validate()

  if (form$.value.invalid) {
    return
  }

  builder$.updateBuilder('schema', {
    extendedPreferences: data.value,
  }, {
    path: builder$.selectedElement
  })

  builder$.refreshConfigPanel(builder$.schema)

  emit('close')
}

const handleReset = () => {
  form$.value.reset()

  nextTick(() => {
    form$.value.resetValidators()
  })
}

const handleClose = () => {
  emit('close')
}

// ================ HOOKS ================

onMounted(() => {
  form$.value.load({
    extendedPreferences: builder$.selectedElementSchema.extendedPreferences
  })
})

</script>

<style lang="scss">
.extended-preferences-modal {
  .vfb-modal {
    @apply max-w-[1200px] mx-auto;
  }
}

.vfb-extended-preferences-empty-wrapper {
  @apply mb-4 text-center;
}

.vfb-extended-preferences-empty-icon {
  @apply mx-auto w-16 h-16 text-2xl bg-primary-500 text-primary-500 bg-opacity-20 rounded-full flex items-center justify-center;
}

.vfb-extended-preferences-empty-title {
  @apply font-semibold text-lg mt-2;
}

.vfb-extended-preferences-empty-subtitle {
  @apply text-gray-500 leading-none mb-4 dark:text-dark-400;
}
</style>