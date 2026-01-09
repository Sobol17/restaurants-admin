import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
	{
		files: ['**/*.{js,mjs,cjs,vue}'],
		plugins: { js },
		extends: ['js/recommended'],
	},
	{
		files: ['**/*.{js,mjs,cjs,vue}'],
		languageOptions: {
			globals: globals.browser,
		},
		rules: {
			'no-unused-vars': 'warn',
			'no-undef': 'error',
		},
	},
	pluginVue.configs['flat/essential'],
])
