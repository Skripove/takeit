const path = require("path");

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["expo", "plugin:@typescript-eslint/recommended", "prettier"],
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", path.join(__dirname, "src")]],
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
      typescript: { project: path.join(__dirname, "tsconfig.json") },
      node: true,
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
    ],
  },
};
