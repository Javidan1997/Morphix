import { img, product } from "./helpers.mjs";

const products = {};
products["arc-chair"] = product({ ...{"handle": "arc-chair", "title": "Arc lounge chair", "options": ["Finish"], "variants": [{"option1": "Natural finish", "price": 89000}]}, featured_image: img("forma-product-1", 800, 1000, "Arc lounge chair", [480,800]) });
products["low-table"] = product({ ...{"handle": "low-table", "title": "Low table", "options": ["Finish"], "variants": [{"option1": "Natural finish", "price": 64000}]}, featured_image: img("forma-product-2", 800, 1000, "Low table", [480,800]) });
products["cloud-sofa"] = product({ ...{"handle": "cloud-sofa", "title": "Cloud sofa", "options": ["Finish"], "variants": [{"option1": "Natural finish", "price": 240000}]}, featured_image: img("forma-product-3", 800, 1000, "Cloud sofa", [480,800]) });

export default { template: "index.forma", products };
