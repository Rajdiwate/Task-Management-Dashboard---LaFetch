/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['stylelint-scss', 'stylelint-order', 'stylelint-selector-bem-pattern'],
  rules: {
    'selector-class-pattern': [
      '^([a-z0-9\\-]+|Mui.*)$',
      {
        message: 'Expected class selector to be kebab-case or MUI-style (e.g., MuiButton-root)',
      },
    ],
    'plugin/selector-bem-pattern': {
      preset: 'bem',
      componentName: '[a-z]+(?:-[a-z]+)*',
      componentSelectors: {
        initial: '^\\.{component}(?:__[a-z]+(?:-[a-z]+)*)?(?:--[a-z]+(?:-[a-z]+)*)?$',
      },
      utilitySelectors: '^\\.u-[a-z]+',
    },
    'at-rule-no-unknown': null,
    'scss/operator-no-newline-after': null,
    'scss/at-rule-no-unknown': true,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global'],
      },
    ],
    'color-hex-length': 'long',
  },
};
