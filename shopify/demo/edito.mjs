import { img, product } from "./helpers.mjs";

const products = {};
products["tailored-jacket"] = product({ ...{"handle": "tailored-jacket", "title": "The tailored jacket", "options": ["Size"], "variants": [{"option1": "XS", "price": 32000}, {"option1": "S", "price": 32000}, {"option1": "M", "price": 32000}, {"option1": "L", "price": 32000}]}, featured_image: img("edito-product-1", 800, 1000, "The tailored jacket", [480,800]) });
products["column-dress"] = product({ ...{"handle": "column-dress", "title": "The column dress", "options": ["Size"], "variants": [{"option1": "XS", "price": 24000}, {"option1": "S", "price": 24000}, {"option1": "M", "price": 24000}, {"option1": "L", "price": 24000}]}, featured_image: img("edito-product-2", 800, 1000, "The column dress", [480,800]) });
products["wide-leg-trouser"] = product({ ...{"handle": "wide-leg-trouser", "title": "The wide-leg trouser", "options": ["Size"], "variants": [{"option1": "XS", "price": 19000}, {"option1": "S", "price": 19000}, {"option1": "M", "price": 19000}, {"option1": "L", "price": 19000}]}, featured_image: img("edito-product-3", 800, 1000, "The wide-leg trouser", [480,800]) });

export default { template: "index.edito", products };
