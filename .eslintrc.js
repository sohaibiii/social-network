module.exports = {
  root: true,
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "@react-native-community",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // uses typescript-specific linting rules
    "plugin:react/recommended", // uses react-specific linting rules
    "prettier/react", // disables react-specific linting rules that conflict with prettier
    "plugin:prettier/recommended" // uses react-specific linting rules
  ],
  plugins: [
    "react",
    "react-native",
    "import", // eslint-plugin-import for custom configure
    "detox"
  ],
  overrides: [
    {
      files: ["*.e2e.js"],
      env: {
        "detox/detox": true,
        jest: true,
        "jest/globals": true
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    project: "tsconfig.json",
    tsconfigRootDir: "./"
  },
  rules: {
    // import plugins
    "import/no-unresolved": "error",
    "import/named": "error",
    "import/namespace": "error",
    "import/default": "error",
    "import/export": "error",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "parent", "sibling", "index"],
        pathGroups: [
          {
            pattern: "react+(|-native)",
            group: "external",
            position: "before"
          },
          {
            pattern: "~/redux/store",
            group: "internal",
            position: "before"
          }
        ],
        pathGroupsExcludedImportTypes: ["react"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true
        }
      }
    ],
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-namespace": "off"
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true
      }
    }
  }
};
