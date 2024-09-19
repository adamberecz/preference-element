<template>
  <div class="flex justify-between items-start bg-gray-50 border border-gray-200 px-3 py-2 rounded-md dark:bg-dark-700 dark:border-dark-700">
    <div class="mt-0.5">
      <template v-if="extendedPreferences.length">
        <div v-for="extendedPreference in extendedPreferences">
          {{ extendedPreference }}
        </div>
      </template>
      <div v-else>
        No extended preferences
      </div>
    </div>
    <div class="vfb-btn-primary vfb-btn-xs" @click="handleEdit">
      Edit
    </div>
  </div>
</template>

<script>
import { toRefs, inject, computed } from 'vue'

export default {
  name: 'ExtendedPreferences',
  setup(props, context)
  {
    const { el$ } = toRefs(props)

    // =============== INJECT ================

    const $vueform = inject('$vueform')

    // ============== COMPUTED ===============

    const extendedPreferenceList = computed(() => {
      return $vueform.value.extendedPreferences
    })

    const extendedPreferences = computed(() => {
      return Object.values(el$.value.attrs.extendedPreferences || []).map((p) => extendedPreferenceList.value[p.type].label) || []
    })

    // =============== METHODS ===============

    const handleEdit = () => {
      el$.value.handleEvent('open-modal', 'extended-preferences')
    }

    return {
      handleEdit,
      extendedPreferences,
    }
  }
}
</script>