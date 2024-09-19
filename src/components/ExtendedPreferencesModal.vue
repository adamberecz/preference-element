<template>
  <BuilderModal
    title="Extended Preferences"
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
            onChange(newValue, oldValue, el$) {
              // Quick fix for distinct rule not being revalidated for
              // the other field if one is changed to a different.
              el$.form$.elements$.extendedPreferences.children$Array.forEach((el$) => {
                el$.children$.type.validate()
              })
            }
          }
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