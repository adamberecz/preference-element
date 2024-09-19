import {
  SubtitleField,
  ThemeRadiusField,
  ThemeShadowField,
  ThemeSingleSizeField,
  ThemeSizeField,
  ThemeThemeField,
  ThemeSelectField,
  ThemeBorderField,
  BaseThemeField,
} from '@vueform/builder';

const ThemeToolsField = class extends BaseThemeField {
  name = 'ThemeToolsField';

  requestData = false;

  get schema() {
    return {
      size: {
        type: 'hidden',
        meta: true,
        default: 'md',
      },
    };
  }
};

const ThemeColorField = class extends BaseThemeField {
  name = 'ThemeColorField';

  requestData = false;

  get schema() {
    return {
      [this.fieldName]: {
        type: 'text',
        label: this.options.label,
        info: this.options.info,
        inputType: 'search',
        autocomplete: 'off',
        columns: { label: 7 },
        attrs: { 'data-coloris': true },
        addons: {
          after: (el$) =>
            `<div class="vfb-util-color-preview" style="background-color: ${el$.value}"></div>`,
        },
        presets: ['colorpicker'],
      },
    };
  }

  load(data) {
    let load = '';
    let value = data[this.fieldName]?.toLowerCase();

    if (!value) {
      return;
    }

    if (value === 'transparent') {
      load = '#00000000';
    } else if (value === 'white') {
      load = '#ffffff';
    } else if (value === 'black') {
      load = '#000000';
    } else if (value.match(/^var\(--vf-([^)]+)\)$/)) {
      load = data[value.match(/^var\(--vf-([^)]+)\)$/)[1]];
    } else {
      load = value;
    }

    return {
      [this.fieldName]: load,
    };
  }
};

const ThemeSingleBorderField = class extends BaseThemeField {
  name = 'ThemeBorderSingleField';

  requestData = false;

  get schema() {
    return {
      [this.fieldName]: {
        type: 'text',
        inputType: 'number',
        addons: {
          after: 'px',
        },
        attrs: {
          min: this.options.min || 0,
          min: 0,
          max: 999,
          step: this.options.step || 1,
        },
        columns: {
          label: 8,
        },
        label: this.options.label,
        info: this.options.info,
        presets: ['number'],
      },
    };
  }

  save(value, name, el$) {
    let updates = {};

    updates[`${this.fieldName}-t`] = `${value}px`;
    updates[`${this.fieldName}-r`] = `${value}px`;
    updates[`${this.fieldName}-b`] = `${value}px`;
    updates[`${this.fieldName}-l`] = `${value}px`;

    this.update(updates);
  }

  load(data) {
    let load = '';

    let values = {
      t: data[`${this.fieldName}-t`],
      r: data[`${this.fieldName}-r`],
      b: data[`${this.fieldName}-b`],
      l: data[`${this.fieldName}-l`],
    };

    let value = values.t;
    let resolved = false;

    while (!resolved) {
      if (value.match(/^\d*\.?\d*px$/)) {
        load = parseFloat(value.replace('px', ''));
        resolved = true;
      } else if (value.match(/^\d*\.?\d*rem$/)) {
        load = parseFloat(value.replace('rem', '')) * 16;
        resolved = true;
      } else if (value.match(/^var\(--vf-/)) {
        let variable = value.match(/^var\(--vf-([^)]*)\)$/)[1];

        value = data[variable];
      } else {
        console.error(
          `Could not load variable for ${this.fieldName}-${side}: ${value}`
        );
      }
    }

    return {
      [this.fieldName]: load,
    };
  }
};

export default {
  sections: {
    theme: {
      name: 'theme',
      label: 'section_theme',
      collapsible: false,
      addClass: 'relative',
      fields: {
        theme: { type: ThemeThemeField },
      },
    },
    tools: {
      name: 'tools',
      collapsible: false,
      addClass: '!-mb-4',
      fields: {
        tools: { type: ThemeToolsField },
      },
    },
    colors: {
      name: 'colors',
      label: 'section_colors',
      fields: {
        primary: {
          type: ThemeColorField,
          name: 'primary',
          label: 'colors_primary_label',
        },
        'primary-darker': {
          type: ThemeColorField,
          name: 'primary-darker',
          label: 'colors_primary_darker_label',
          info: 'colors_primary_darker_info',
        },
        'color-on-primary': {
          type: ThemeColorField,
          name: 'color-on-primary',
          label: 'colors_color_on_primary_label',
          info: 'colors_color_on_primary_info',
        },
        danger: {
          type: ThemeColorField,
          name: 'danger',
          label: 'colors_danger_label',
        },
        'danger-lighter': {
          type: ThemeColorField,
          name: 'danger-lighter',
          label: 'colors_danger_lighter_label',
          info: 'colors_danger_lighter_info',
        },
        success: {
          type: ThemeColorField,
          name: 'success',
          label: 'colors_success_label',
        },
        'success-lighter': {
          type: ThemeColorField,
          name: 'success-lighter',
          label: 'colors_success_lighter_label',
          info: 'colors_success_lighter_info',
        },
      },
    },
    fonts: {
      name: 'fonts',
      label: 'section_fonts',
      fields: {
        'font-size': {
          type: ThemeSizeField,
          name: 'font-size',
          label: 'fonts_font_size_label',
        },
        'line-height': {
          type: ThemeSizeField,
          name: 'line-height',
          label: 'fonts_line_height_label',
        },
        'letter-spacing': {
          type: ThemeSizeField,
          name: 'letter-spacing',
          label: 'fonts_letter_spacing_label',
        },
        'font-size-small': {
          type: ThemeSizeField,
          name: 'font-size-small',
          label: 'fonts_font_size_small_label',
          info: 'fonts_font_size_small_info',
        },
        'line-height-small': {
          type: ThemeSizeField,
          name: 'line-height-small',
          label: 'fonts_line_height_small_label',
        },
        'letter-spacing-small': {
          type: ThemeSizeField,
          name: 'letter-spacing-small',
          label: 'fonts_letter_spacing_small_label',
        },

        'font-size-h1': {
          type: ThemeSizeField,
          name: 'font-size-h1',
          label: 'fonts_font_size_h1_label',
        },
        'font-size-h1-mobile': {
          type: ThemeSizeField,
          name: 'font-size-h1-mobile',
          label: 'fonts_font_size_h1_mobile_label',
        },

        'font-size-h2': {
          type: ThemeSizeField,
          name: 'font-size-h2',
          label: 'fonts_font_size_h2_label',
        },
        'font-size-h2-mobile': {
          type: ThemeSizeField,
          name: 'font-size-h2-mobile',
          label: 'fonts_font_size_h2_mobile_label',
        },

        'font-size-h3': {
          type: ThemeSizeField,
          name: 'font-size-h3',
          label: 'fonts_font_size_h3_label',
        },
        'font-size-h3-mobile': {
          type: ThemeSizeField,
          name: 'font-size-h3-mobile',
          label: 'fonts_font_size_h3_mobile_label',
        },

        'font-size-h4': {
          type: ThemeSizeField,
          name: 'font-size-h4',
          label: 'fonts_font_size_h4_label',
        },
        'font-size-h4-mobile': {
          type: ThemeSizeField,
          name: 'font-size-h4-mobile',
          label: 'fonts_font_size_h4_mobile_label',
        },

        'line-height-headings': {
          type: ThemeSizeField,
          name: 'line-height-headings',
          label: 'fonts_line_height_headings_label',
          suffix: false,
        },
        'letter-spacing-headings': {
          type: ThemeSizeField,
          name: 'letter-spacing-headings',
          label: 'fonts_letter_spacing_headings_label',
        },
      },
    },
    spaces: {
      name: 'spaces',
      label: 'section_spaces',
      fields: {
        gutter: {
          type: ThemeSizeField,
          name: 'gutter',
          label: 'spaces_gutter_label',
        },
        'link-color': {
          type: ThemeColorField,
          name: 'link-color',
          label: 'spaces_link_color_label',
        },
        'link-decoration': {
          type: ThemeSelectField,
          name: 'link-decoration',
          label: 'spaces_link_decoration_label',
          items: ['none', 'underline', 'inherit'],
        },
        'color-muted': {
          type: ThemeColorField,
          name: 'color-muted',
          label: 'spaces_color_muted_label',
          info: 'spaces_color_muted_info',
        },
        'color-passive': {
          type: ThemeColorField,
          name: 'color-passive',
          label: 'spaces_color_passive_label',
          info: 'spaces_color_passive_info',
        },
        'bg-selected': {
          type: ThemeColorField,
          name: 'bg-selected',
          label: 'spaces_bg_selected_label',
          info: 'spaces_bg_selected_info',
        },
        'radius-small': {
          type: ThemeRadiusField,
          name: 'radius-small',
          label: 'spaces_radius_small_label',
          info: 'spaces_radius_small_info',
        },
        'shadow-handles': {
          type: ThemeShadowField,
          name: 'shadow-handles',
          label: 'spaces_shadow_handles_label',
          info: 'spaces_shadow_handles_info',
        },
        'shadow-handles-hover': {
          type: ThemeShadowField,
          name: 'shadow-handles-hover',
          label: 'spaces_shadow_handles_hover_label',
        },
        'shadow-handles-focus': {
          type: ThemeShadowField,
          name: 'shadow-handles-focus',
          label: 'spaces_shadow_handles_focus_label',
        },
      },
    },
    inputs: {
      name: 'inputs',
      label: 'section_inputs',
      fields: {
        'min-height-input': {
          type: ThemeSizeField,
          name: 'min-height-input',
          label: 'inputs_min_height_input_label',
        },
        'ring-width': {
          type: ThemeSingleSizeField,
          name: 'ring-width',
          label: 'inputs_ring_width_label',
          info: 'inputs_ring_width_info',
        },
        'ring-color': {
          type: ThemeColorField,
          name: 'ring-color',
          label: 'inputs_ring_color_label',
        },
        'py-input': {
          type: ThemeSizeField,
          name: 'py-input',
          label: 'inputs_py_input_label',
        },
        'px-input': {
          type: ThemeSizeField,
          name: 'px-input',
          label: 'inputs_px_input_label',
        },
        'border-width-input': {
          type: ThemeSingleBorderField,
          name: 'border-width-input',
          label: 'inputs_border_width_input_label',
        },
        'radius-input': {
          type: ThemeSizeField,
          name: 'radius-input',
          label: 'inputs_radius_input_label',
        },
        'radius-large': {
          type: ThemeSizeField,
          name: 'radius-large',
          label: 'inputs_radius_large_label',
          info: 'inputs_radius_large_info',
        },
        'border-color-input': {
          type: ThemeColorField,
          name: 'border-color-input',
          label: 'inputs_border_color_input_label',
        },
        'color-input': {
          type: ThemeColorField,
          name: 'color-input',
          label: 'inputs_color_input_label',
        },
        'bg-icon': {
          type: ThemeColorField,
          name: 'bg-icon',
          label: 'inputs_bg_icon_label',
        },
        'color-floating': {
          type: ThemeColorField,
          name: 'color-floating',
          label: 'inputs_color_floating_label',
        },
        'bg-input': {
          type: ThemeColorField,
          name: 'bg-input',
          label: 'inputs_bg_input_label',
        },
        'shadow-input': {
          type: ThemeShadowField,
          name: 'shadow-input',
          label: 'inputs_shadow_input_label',
        },
        hover: { type: SubtitleField, label: 'inputs_hover_label' },
        'color-input-hover': {
          type: ThemeColorField,
          name: 'color-input-hover',
          label: 'inputs_color_input_hover_label',
        },
        'bg-input-hover': {
          type: ThemeColorField,
          name: 'bg-input-hover',
          label: 'inputs_bg_input_hover_label',
        },
        'border-color-input-hover': {
          type: ThemeColorField,
          name: 'border-color-input-hover',
          label: 'inputs_border_color_input_hover_label',
        },
        'shadow-input-hover': {
          type: ThemeShadowField,
          name: 'shadow-input-hover',
          label: 'inputs_shadow_input_hover_label',
        },
        focus: { type: SubtitleField, label: 'inputs_focus_label' },
        'color-input-focus': {
          type: ThemeColorField,
          name: 'color-input-focus',
          label: 'inputs_color_input_focus_label',
        },
        'color-floating-focus': {
          type: ThemeColorField,
          name: 'color-floating-focus',
          label: 'inputs_color_floating_focus_label',
        },
        'bg-input-focus': {
          type: ThemeColorField,
          name: 'bg-input-focus',
          label: 'inputs_bg_input_focus_label',
        },
        'border-color-input-focus': {
          type: ThemeColorField,
          name: 'border-color-input-focus',
          label: 'inputs_border_color_input_focus_label',
        },
        'shadow-input-focus': {
          type: ThemeShadowField,
          name: 'shadow-input-focus',
          label: 'inputs_shadow_input_focus_label',
        },
        danger: { type: SubtitleField, label: 'inputs_danger_label' },
        'color-input-danger': {
          type: ThemeColorField,
          name: 'color-input-danger',
          label: 'inputs_color_input_danger_label',
        },
        'color-floating-danger': {
          type: ThemeColorField,
          name: 'color-floating-danger',
          label: 'inputs_color_floating_danger_label',
        },
        'bg-input-danger': {
          type: ThemeColorField,
          name: 'bg-input-danger',
          label: 'inputs_bg_input_danger_label',
        },
        'border-color-input-danger': {
          type: ThemeColorField,
          name: 'border-color-input-danger',
          label: 'inputs_border_color_input_danger_label',
        },
        success: { type: SubtitleField, label: 'inputs_success_label' },
        'color-input-success': {
          type: ThemeColorField,
          name: 'color-input-success',
          label: 'inputs_color_input_success_label',
        },
        'color-floating-success': {
          type: ThemeColorField,
          name: 'color-floating-success',
          label: 'inputs_color_floating_success_label',
        },
        'bg-input-success': {
          type: ThemeColorField,
          name: 'bg-input-success',
          label: 'inputs_bg_input_success_label',
        },
        'border-color-input-success': {
          type: ThemeColorField,
          name: 'border-color-input-success',
          label: 'inputs_border_color_input_success_label',
        },
        disabled: { type: SubtitleField, label: 'inputs_disabled_label' },
        'color-disabled': {
          type: ThemeColorField,
          name: 'color-disabled',
          label: 'inputs_color_disabled_label',
        },
        'bg-disabled': {
          type: ThemeColorField,
          name: 'bg-disabled',
          label: 'inputs_bg_disabled_label',
        },
        'floating-top': {
          type: ThemeSizeField,
          name: 'floating-top',
          label: 'inputs_floating_top_label',
          info: 'inputs_floating_top_info',
        },
        'space-addon': {
          type: ThemeSizeField,
          name: 'space-addon',
          label: 'inputs_space_addon_label',
          info: 'inputs_space_addon_info',
        },
        'bg-addon': {
          type: ThemeColorField,
          name: 'bg-addon',
          label: 'inputs_bg_addon_label',
        },
        'color-addon': {
          type: ThemeColorField,
          name: 'color-addon',
          label: 'inputs_color_addon_label',
        },
      },
    },
    checkboxes: {
      name: 'checkboxes',
      label: 'section_checkboxes',
      fields: {
        'checkbox-size': {
          type: ThemeSizeField,
          name: 'checkbox-size',
          label: 'checkboxes_checkbox_size_label',
        },
        'space-checkbox': {
          type: ThemeSizeField,
          name: 'space-checkbox',
          label: 'checkboxes_space_checkbox_label',
          info: 'checkboxes_space_checkbox_info',
        },

        radio: { type: SubtitleField, label: 'checkboxes_radio_label' },
        'border-width-radio': {
          type: ThemeBorderField,
          name: 'border-width-radio',
          label: 'checkboxes_border_width_radio_label',
        },
        checkbox: { type: SubtitleField, label: 'checkboxes_checkbox_label' },
        'border-width-checkbox': {
          type: ThemeBorderField,
          name: 'border-width-checkbox',
          label: 'checkboxes_border_width_checkbox_label',
        },
        'radius-checkbox': {
          type: ThemeRadiusField,
          name: 'radius-checkbox',
          label: 'checkboxes_radius_checkbox_label',
        },

        tabs: { type: SubtitleField, label: 'checkboxes_tabs_label' },
        'py-group-tabs': {
          type: ThemeSizeField,
          name: 'py-group-tabs',
          label: 'checkboxes_py_group_tabs_label',
        },
        'px-group-tabs': {
          type: ThemeSizeField,
          name: 'px-group-tabs',
          label: 'checkboxes_px_group_tabs_label',
        },

        blocks: { type: SubtitleField, label: 'checkboxes_blocks_label' },
        'py-group-blocks': {
          type: ThemeSizeField,
          name: 'py-group-blocks',
          label: 'checkboxes_py_group_blocks_label',
        },
        'px-group-blocks': {
          type: ThemeSizeField,
          name: 'px-group-blocks',
          label: 'checkboxes_px_group_blocks_label',
        },

        colors: { type: SubtitleField, label: 'checkboxes_colors_label' },
        'bg-checkbox': {
          type: ThemeColorField,
          name: 'bg-checkbox',
          label: 'checkboxes_bg_checkbox_label',
        },
        'border-color-checkbox': {
          type: ThemeColorField,
          name: 'border-color-checkbox',
          label: 'checkboxes_border_color_checkbox_label',
        },

        hover: { type: SubtitleField, label: 'checkboxes_hover_label' },
        'bg-checkbox-hover': {
          type: ThemeColorField,
          name: 'bg-checkbox-hover',
          label: 'checkboxes_bg_checkbox_hover_label',
        },
        'border-color-checkbox-hover': {
          type: ThemeColorField,
          name: 'border-color-checkbox-hover',
          label: 'checkboxes_border_color_checkbox_hover_label',
        },

        focus: { type: SubtitleField, label: 'checkboxes_focus_label' },
        'bg-checkbox-focus': {
          type: ThemeColorField,
          name: 'bg-checkbox-focus',
          label: 'checkboxes_bg_checkbox_focus_label',
        },
        'border-color-checkbox-focus': {
          type: ThemeColorField,
          name: 'border-color-checkbox-focus',
          label: 'checkboxes_border_color_checkbox_focus_label',
        },

        danger: { type: SubtitleField, label: 'checkboxes_danger_label' },
        'bg-checkbox-danger': {
          type: ThemeColorField,
          name: 'bg-checkbox-danger',
          label: 'checkboxes_bg_checkbox_danger_label',
        },
        'border-color-checkbox-danger': {
          type: ThemeColorField,
          name: 'border-color-checkbox-danger',
          label: 'checkboxes_border_color_checkbox_danger_label',
        },

        success: { type: SubtitleField, label: 'checkboxes_success_label' },
        'bg-checkbox-success': {
          type: ThemeColorField,
          name: 'bg-checkbox-success',
          label: 'checkboxes_bg_checkbox_success_label',
        },
        'border-color-checkbox-success': {
          type: ThemeColorField,
          name: 'border-color-checkbox-success',
          label: 'checkboxes_border_color_checkbox_success_label',
        },

        checked: { type: SubtitleField, label: 'checkboxes_checked_label' },
        'border-color-checked': {
          type: ThemeColorField,
          name: 'border-color-checked',
          label: 'checkboxes_border_color_checked_label',
        },
      },
    },
    toggle: {
      name: 'toggle',
      label: 'section_toggle',
      fields: {
        'toggle-width': {
          type: ThemeSizeField,
          name: 'toggle-width',
          label: 'toggle_toggle_width_label',
        },
        'toggle-height': {
          type: ThemeSizeField,
          name: 'toggle-height',
          label: 'toggle_toggle_height_label',
        },
        'border-width-toggle': {
          type: ThemeBorderField,
          name: 'border-width-toggle',
          label: 'toggle_border_width_toggle_label',
        },
        handle: { type: SubtitleField, label: 'toggle_handle_label' },
        'bg-toggle-handle': {
          type: ThemeColorField,
          name: 'bg-toggle-handle',
          label: 'toggle_bg_toggle_handle_label',
        },
        background: { type: SubtitleField, label: 'Background' },
        'bg-passive': {
          type: ThemeColorField,
          name: 'bg-passive',
          label: 'spaces_bg_passive_label',
          info: 'spaces_bg_passive_info',
        },
        'border-color-passive': {
          type: ThemeColorField,
          name: 'border-color-passive',
          label: 'spaces_border_color_passive_label',
          info: 'spaces_border_color_passive_info',
        },
      },
    },
    buttons: {
      name: 'buttons',
      label: 'section_buttons',
      fields: {
        'py-btn': {
          type: ThemeSizeField,
          name: 'py-btn',
          label: 'buttons_py_btn_label',
        },
        'px-btn': {
          type: ThemeSizeField,
          name: 'px-btn',
          label: 'buttons_px_btn_label',
        },
        'small-buttons': {
          type: SubtitleField,
          label: 'buttons_small_buttons_label',
        },
        'py-btn-small': {
          type: ThemeSizeField,
          name: 'py-btn-small',
          label: 'buttons_py_btn_small_label',
        },
        'px-btn-small': {
          type: ThemeSizeField,
          name: 'px-btn-small',
          label: 'buttons_px_btn_small_label',
        },

        'border-color-btn': {
          type: ThemeColorField,
          name: 'border-color-btn',
          label: 'buttons_border_color_btn_label',
        },
        'border-width-btn': {
          type: ThemeBorderField,
          name: 'border-width-btn',
          label: 'buttons_border_width_btn_label',
        },

        'radius-btn': {
          type: ThemeRadiusField,
          name: 'radius-btn',
          label: 'buttons_radius_btn_label',
        },

        'color-btn': {
          type: ThemeColorField,
          name: 'color-btn',
          label: 'buttons_color_btn_label',
        },

        'bg-btn': {
          type: ThemeColorField,
          name: 'bg-btn',
          label: 'buttons_bg_btn_label',
        },
        'shadow-btn': {
          type: ThemeShadowField,
          name: 'shadow-btn',
          label: 'buttons_shadow_btn_label',
        },

        secondary: { type: SubtitleField, label: 'buttons_secondary_label' },
        'color-btn-secondary': {
          type: ThemeColorField,
          name: 'color-btn-secondary',
          label: 'buttons_color_btn_secondary_label',
        },
        'bg-btn-secondary': {
          type: ThemeColorField,
          name: 'bg-btn-secondary',
          label: 'buttons_bg_btn_secondary_label',
        },
        'border-color-btn-secondary': {
          type: ThemeColorField,
          name: 'border-color-btn-secondary',
          label: 'buttons_border_color_btn_secondary_label',
        },

        danger: { type: SubtitleField, label: 'buttons_danger_label' },
        'color-btn-danger': {
          type: ThemeColorField,
          name: 'color-btn-danger',
          label: 'buttons_color_btn_danger_label',
        },
        'bg-btn-danger': {
          type: ThemeColorField,
          name: 'bg-btn-danger',
          label: 'buttons_bg_btn_danger_label',
        },
        'border-color-btn-danger': {
          type: ThemeColorField,
          name: 'border-color-btn-danger',
          label: 'buttons_border_color_btn_danger_label',
        },
      },
    },
    static: {
      name: 'static',
      label: 'section_static',
      fields: {
        spacing: { type: SubtitleField, label: 'static_spacing_label' },
        'space-static-tag-1': {
          type: ThemeSingleSizeField,
          name: 'space-static-tag-1',
          label: 'static_space_static_tag_1_label',
        },
        'space-static-tag-2': {
          type: ThemeSingleSizeField,
          name: 'space-static-tag-2',
          label: 'static_space_static_tag_2_label',
        },
        'space-static-tag-3': {
          type: ThemeSingleSizeField,
          name: 'space-static-tag-3',
          label: 'static_space_static_tag_3_label',
        },
        divider: { type: SubtitleField, label: 'static_divider_label' },
        'py-hr': {
          type: ThemeSingleSizeField,
          name: 'py-hr',
          label: 'static_py_hr_label',
        },
        'border-color-hr': {
          type: ThemeColorField,
          name: 'border-color-hr',
          label: 'static_border_color_hr_label',
        },
      },
    },
  },
  separators: {
    colors: [
      ['primary', 'primary-darker', 'color-on-primary'],
      ['danger', 'danger-lighter'],
      ['success', 'success-lighter'],
    ],
    fonts: [
      ['font-size', 'line-height', 'letter-spacing'],
      ['font-size-small', 'line-height-small', 'letter-spacing-small'],
      ['font-size-h1', 'font-size-h1-mobile'],
      ['font-size-h2', 'font-size-h2-mobile'],
      ['font-size-h3', 'font-size-h3-mobile'],
      ['font-size-h4', 'font-size-h4-mobile'],
      ['line-height-headings', 'letter-spacing-headings'],
    ],
    spaces: [
      ['gutter'],
      ['link-color', 'link-decoration'],
      ['color-muted', 'color-passive', 'bg-selected'],
      ['radius-small'],
      ['shadow-handles', 'shadow-handles-hover', 'shadow-handles-focus'],
    ],
    inputs: [
      ['min-height-input'],
      ['ring-width', 'ring-color'],
      ['py-input', 'px-input'],
      [
        'border-width-input',
        'radius-input',
        'radius-large',
        'border-color-input',
      ],
      ['color-input', 'bg-icon', 'color-floating', 'bg-input', 'shadow-input'],
      [
        'hover',
        'color-input-hover',
        'bg-input-hover',
        'border-color-input-hover',
        'shadow-input-hover',
      ],
      [
        'focus',
        'color-input-focus',
        'color-floating-focus',
        'bg-input-focus',
        'border-color-input-focus',
        'shadow-input-focus',
      ],
      [
        'danger',
        'color-input-danger',
        'color-floating-danger',
        'bg-input-danger',
        'border-color-input-danger',
      ],
      [
        'success',
        'color-input-success',
        'color-floating-success',
        'bg-input-success',
        'border-color-input-success',
      ],
      ['disabled', 'color-disabled', 'bg-disabled'],
      ['floating-top'],
      ['space-addon', 'bg-addon', 'color-addon'],
    ],
    checkboxes: [
      ['checkbox-size', 'space-checkbox'],
      ['radio', 'border-width-radio'],
      ['checkbox', 'border-width-checkbox', 'radius-checkbox'],
      ['tabs', 'py-group-tabs', 'px-group-tabs'],
      ['blocks', 'py-group-blocks', 'px-group-blocks'],
      ['colors', 'bg-checkbox', 'border-color-checkbox'],
      ['hover', 'bg-checkbox-hover', 'border-color-checkbox-hover'],
      ['focus', 'bg-checkbox-focus', 'border-color-checkbox-focus'],
      ['danger', 'bg-checkbox-danger', 'border-color-checkbox-danger'],
      ['success', 'bg-checkbox-success', 'border-color-checkbox-success'],
      ['checked', 'border-color-checked'],
    ],
    toggle: [
      ['toggle-width', 'toggle-height', 'border-width-toggle'],
      ['handle', 'bg-toggle-handle'],
      ['bg-passive', 'border-color-passive'],
    ],
    buttons: [
      ['py-btn', 'px-btn'],
      ['small-buttons', 'py-btn-small', 'px-btn-small'],
      ['border-color-btn', 'border-width-btn', 'radius-btn'],
      ['color-btn', 'bg-btn', 'shadow-btn'],
      [
        'secondary',
        'color-btn-secondary',
        'bg-btn-secondary',
        'border-color-btn-secondary',
      ],
      [
        'danger',
        'color-btn-danger',
        'bg-btn-danger',
        'border-color-btn-danger',
      ],
    ],
    static: [
      [
        'spacing',
        'space-static-tag-1',
        'space-static-tag-2',
        'space-static-tag-3',
      ],
      ['divider', 'py-hr'],
    ],
  },
};
