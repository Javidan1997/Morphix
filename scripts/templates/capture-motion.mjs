import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { templates } from '../../src/data/templateGallery.js';
const base=process.env.BASE || 'http://localhost:4173';
const browser=await puppeteer.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox','--disable-dev-shm-usage']});
try {
 for (const slug of ['forma','edito']) {
  const page=await browser.newPage();await page.setViewport({width:1440,height:900});
  await page.goto(`${base}/shopify-templates/${slug}`,{waitUntil:'domcontentloaded'});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector('.lx-hero img').complete && document.querySelector('.lx-hero img').naturalWidth > 0);
  await page.addStyleTag({content:'.cfg-demo-bar{display:none!important}'});
  const buffer=await page.screenshot();
  mkdirSync('public/shopify-templates/covers',{recursive:true});mkdirSync('public/shopify-templates/og',{recursive:true});
  for(const width of [800,1200])await sharp(buffer).resize(width,Math.round(width*.625)).webp({quality:84}).toFile(`public/shopify-templates/covers/${slug}-${width}.webp`);
  const og=await sharp(buffer).resize(1200,630,{fit:'cover',position:'bottom'}).jpeg({quality:86}).toBuffer();
  writeFileSync(`public/shopify-templates/og/${slug}.jpg`,og);writeFileSync(`shopify/theme/assets/${slug}-og.jpg`,og);
  await page.close();
 }
 const gallery=await browser.newPage();
 await gallery.setViewport({width:1200,height:630});
 await gallery.goto(`${base}/robots.txt`);
 const tiles=templates.map(t=>`<div><img src="${base}/shopify-templates/assets/${t.slug}-hero-${['shadeline'].includes(t.slug)?'1280':'1200'}.webp"><span>${t.name}</span></div>`).join('');
 await gallery.setContent(`<!doctype html><html><head><style>@font-face{font-family:G;src:url(${base}/shopify-templates/assets/font-space-grotesk.woff2)}*{box-sizing:border-box;margin:0}body{background:#0b0c0f;color:#f3f5fa;font-family:G,sans-serif;padding:55px 50px}p{font-size:18px;color:#aeb6c5}h1{font-size:58px;line-height:1.05;max-width:1000px;margin:20px 0 40px}.grid{display:grid;grid-template-columns:repeat(${templates.length},1fr);gap:12px}.grid img{width:100%;height:220px;object-fit:cover}.grid span{display:block;margin-top:12px;font-size:15px}</style></head><body><p>Configuro · Shopify templates</p><h1>${templates.length} concept stores.<br>Real theme code. Distinct identities.</h1><div class="grid">${tiles}</div></body></html>`);
 await gallery.evaluate(()=>Promise.all([document.fonts.ready,...[...document.images].map(img=>img.decode())]));
 await gallery.screenshot({path:'public/shopify-templates/og/shopify-templates.jpg',type:'jpeg',quality:86});
 await gallery.close();
} finally {await browser.close();}
