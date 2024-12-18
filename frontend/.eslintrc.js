module.exports = {
	'env': {
		'browser': true,
		'es6': true,
		'es2017': true,
	},
	'extends': [
		'airbnb',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
		'plugin:@typescript-eslint/recommended-requiring-type-checking'
	],
	'overrides': [
		{
			files: ['**/*.test.jsx'],
			rules: {
				'react/react-in-jsx-scope': 'off',
				'react/display-name': 'off',
				'react/jsx-key': 'off'
			},
		},
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		project: 'tsconfig.json',
		tsconfigRootDir: __dirname,
    	sourceType: 'module',
	},
	'plugins': [
		'react',
		'jest',
		'@typescript-eslint'
	],
	settings: {
		react: {
		  version: 'detect'
		},
	},
	'rules': {
		'react/prop-types': 'off',
		"react/jsx-indent": ["error", "tab"],
		"react/jsx-indent-props": ["error", "tab"],
		'semi': [
			'error',
			'always'
		],
		'jest/no-disabled-tests': 'warn',
		'jest/no-focused-tests': 'error',
		'jest/no-identical-title': 'error',
		'jest/prefer-to-have-length': 'warn',
		'jest/valid-expect': 'error',
		"import/extensions": [
			"error",
			"ignorePackages",
			{
			  "js": "never",
			  "jsx": "never",
			  "ts": "never",
			  "tsx": "never"
			}
		],
		"indent": ["error", "tab"],
        "no-tabs": 0,
		'react/jsx-filename-extension': [2, { 'extensions': ['.js', '.jsx', '.ts', '.tsx'] }],
		"comma-dangle": 0,
		'react/button-has-type': 'off',
		"react/function-component-definition": [2, { "namedComponents": "arrow-function" }],
		"no-shadow": "off",
    	"@typescript-eslint/no-shadow": "warn",
		'no-underscore-dangle': 'off',
		'no-param-reassign': ['error', { props: false }]
	}
};
