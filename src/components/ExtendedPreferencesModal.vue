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

// ============== CONTSANTS ==============

const defaultFieldSchema = {
  type: 'text',
  label: 'Default Value',
  placeholder: 'Type a default...',
  floating: false,
  columns: 2,
  messages: {
    required: 'Default value must be provided'
  },
  rules: 'required',
  conditions: [
    [
      ['extendedPreferences.*.showOnPage', false],
      ['extendedPreferences.*.userCanEdit', false],
      ['extendedPreferences.*.hasDefault', true],
    ]
  ],
}

const types = Object.keys($vueform.value.extendedPreferences).reduce((prev, curr) => ({
  ...prev,
  [curr]: $vueform.value.extendedPreferences[curr].label,
}), {})

// =============== HELPERS ===============

// Quick fix for distinct rule not being revalidated for
// the other field if one is changed to a different.
const revalidateDuplicates = (el$) => {
  el$.form$.elements$.extendedPreferences.children$Array.forEach((el$) => {
    el$.children$.type.validate()
  })
}

// ================ DATA =================

const form$ = ref(null)

const data = computed(() => {
  return form$.value?.data?.extendedPreferences || []
})

const form = ref({
  endpoint: false,
  displayErrors: false,
  size: 'sm',
  replaceClasses: {
    ListElement: {
      handle: {
        'top-0': 'top-[1.375rem]',
        'left-0': 'left-0.5'
      }
    },
  },
  addClasses: {
    TagsElement: {
      select: {
        tag: 'max-w-[90%]'
      }
    }
  },
  schema: {
    extendedPreferences: {
      type: 'list',
      initial: 0,
      sort: true,
      addText: '+ Add preference',
      onChange(newValue, oldValue, el$) {
        if (newValue.length === oldValue.length -1) {
          revalidateDuplicates(el$)
        }
      },
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
              revalidateDuplicates(el$)

              // Define available element types
              const siblings$ = el$.form$.siblings$(el$.path)
              const element$ = siblings$.element

              const extendedPreferenceDescriptor = $vueform.value.extendedPreferences[newValue]
              const options = extendedPreferenceDescriptor.options || []
              const optionsCount = Object.keys(options)?.length

              // Resolve the options of the Type selector
              element$.input.resolveOptions((newOptions) => {
                console.log(element$.value)
                if (Object.keys(newOptions).indexOf(element$.value) === -1) {
                  element$.reset()
                }
              })

              // If the Type has related options refresh the Default Value select/multiselect items.
              if (optionsCount > 1) {
                // If the Default Value has a value that is not amongst the options of the new Type clear it.

                // Clearing in case of a select type.
                siblings$.default_select.input.resolveOptions((newOptions) => {
                  if (Object.values(newOptions).indexOf(siblings$.default_select.value) === -1) {
                    siblings$.default_select.clear()

                    nextTick(() => {
                      siblings$.default_select.resetValidators()
                    })
                  }
                })

                // Clearing in case of a multiselect type.
                siblings$.default_multiselect.input.resolveOptions((newOptions) => {
                  if (!siblings$.default_multiselect.value.every(v => Object.values(newOptions).indexOf(v) !== -1)) {
                    siblings$.default_multiselect.clear()

                    nextTick(() => {
                      siblings$.default_multiselect.resetValidators()
                    })
                  }
                })
              }
            },
          },
          element: {
            type: 'select',
            search: true,
            canDeselect: false,
            canClear: false,
            label: 'Type',
            default: 'text',
            items: async (query, input$) => {
              await nextTick()

              const el$ = input$.$parent.el$
              const siblings$ = el$.form$.siblings$(el$.path)
              const type$ = siblings$.type

              const extendedPreferenceDescriptor = $vueform.value.extendedPreferences[type$.value]
              const options = extendedPreferenceDescriptor.options || []
              const optionsCount = Object.keys(options)?.length

              return optionsCount > 1 ? {
                text: 'Free Text',
                select: 'Single Select',
                multiselect: 'Multi Select',
              } : {
                text: 'Free Text',
              }
            },
            columns: 2,
            rules: 'required',
            messages: {
              required: 'Please select a type',
            },
            onChange(newValue, oldValue, el$) {
            }
          },
          showOnPage: {
            type: 'radiogroup',
            label: 'Show on Page',
            view: 'tabs',
            default: 1,
            items: [
              { value: 1, label: 'On' },
              { value: 0, label: 'Off' },
            ],
            columns: 1,
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
              { value: 1, label: 'On' },
              { value: 0, label: 'Off' },
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
              { value: 1, label: 'On' },
              { value: 0, label: 'Off' },
            ],
            columns: 1,
            conditions: [
              ['extendedPreferences.*.userCanEdit', true],
              ['extendedPreferences.*.showOnPage', true],
            ],
          },
          default_text: {
            ...defaultFieldSchema,
            conditions: [
              ...defaultFieldSchema.conditions,
              ['extendedPreferences.*.element', 'text'],
            ],
          },
          default_select: {
            ...defaultFieldSchema,
            type: 'select',
            allowAbsent: true,
            items: async (query, input$) => {
              await nextTick()

              const el$ = input$.$parent.el$
              const siblings$ = el$.form$.siblings$(el$.path)
              const type$ = siblings$.type

              return $vueform.value.extendedPreferences[type$.value]?.options || []
            },
            search: true,
            conditions: [
              ...defaultFieldSchema.conditions,
              ['extendedPreferences.*.element', 'select'],
            ],
          },
          default_multiselect: {
            ...defaultFieldSchema,
            type: 'multiselect',
            items: async (query, input$) => {
              await nextTick()
              
              const el$ = input$.$parent.el$
              const siblings$ = el$.form$.siblings$(el$.path)
              const type$ = siblings$.type

              return $vueform.value.extendedPreferences[type$.value]?.options || []
            },
            allowAbsent: true,
            search: true,
            closeOnSelect: false,
            hideSelected: false,
            conditions: [
              ...defaultFieldSchema.conditions,
              ['extendedPreferences.*.element', 'multiselect'],
            ],
          },
        }
      }
    },
  },
})

// =============== METHODS ===============

const transformSaveData = (data) => {
  return data.map((line) => {
    const clone = { ...line }

    switch (clone.element) {
      case 'select':
        clone.default = clone.default_select
        break

      case 'multiselect':
        clone.default = clone.default_multiselect
        break

      case 'text':
        clone.default = clone.default_text
        break
    }

    delete clone.default_text
    delete clone.default_select
    delete clone.default_multiselect

    return clone
  })
}

const transformLoadData = (data) => {
  return data.map((line) => {
    const clone = { ...line }

    switch (clone.element) {
      case 'select':
        clone.default_select = clone.default
        break

      case 'multiselect':
        clone.default_multiselect = clone.default
        break

      case 'text':
        clone.default_text = clone.default
        break
    }

    delete clone.default

    return clone
  })
}

const handleAdd = () => {
  form$.value.el$('extendedPreferences').add(undefined, true)
}

const handleSave = async () => {
  await form$.value.validate()

  if (form$.value.invalid) {
    return
  }

  builder$.updateBuilder('schema', {
    extendedPreferences: transformSaveData(data.value),
  }, {
    path: builder$.selectedElement
  })

  builder$.refreshConfigPanel(builder$.schema)

  emit('close')

  // Clear to form so we don't get into a position where string values are 
  // loaded to elements like tags that expect an array and throw an error.
  builder$.preview$.form$.clear()

  await nextTick()
  await nextTick()
  
  builder$.preview$.form$.reset()
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
  form$.value.update({
    extendedPreferences: transformLoadData(builder$.selectedElementSchema.extendedPreferences || [])
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