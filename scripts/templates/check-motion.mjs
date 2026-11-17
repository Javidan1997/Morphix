import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import puppeteer from 'puppeteer-core';
import { luxuryRoutes } from '../../shopify/demo/luxury.mjs';
const base=process.env.BASE || 'http://localhost:4173';
const evidence=process.env.EVIDENCE_DIR || '/tmp/configuro-luxury-qa';
mkdirSync(evidence,{recursive:true});
const browser=await puppeteer.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage']});
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const errors=[];
async function open(page,path){const response=await page.goto(`${base}/shopify-templates/${path}`,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,path);await page.evaluate(()=>document.fonts.ready);await wait(800);}
async function shot(page,name){await page.screenshot({path:`${evidence}/${name}.jpg`,type:'jpeg',quality:88});}
try{
 const page=await browser.newPage();await page.setViewport({width:1440,height:1000});
 page.on('pageerror',error=>errors.push(error.message));
 page.on('response',response=>{if(response.status()>=400&&response.url().startsWith(base))errors.push(response.status()+' '+response.url());});
 const routeResults=[];
 for(const route of ['forma','edito',...luxuryRoutes]){
  await open(page,route);
  assert.equal(await page.$$('h1').then(a=>a.length),1,`one h1: ${route}`);
  assert((await page.title()).includes('Configuro concept store'));
  const brokenLinks=await page.evaluate(()=>[...document.querySelectorAll('a[href]')].map(a=>a.getAttribute('href')).filter(h=>/^\/(collections|pages|blogs)\//.test(h)));
  assert.deepEqual(brokenLinks,[],`Links stay in demo: ${route}`);
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));await wait(250);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`desktop overflow: ${route}`);
  routeResults.push(route);
 }
 for(const brand of ['forma','edito']){
  await page.evaluate(()=>sessionStorage.clear());
  await open(page,brand);
  await page.waitForFunction(()=>document.querySelector('.lx-hero img').complete);
  await shot(page,`${brand}-home-desktop`);
  const height=await page.$eval('.lx-hero',el=>el.offsetHeight);
  await page.mouse.wheel({deltaY:450});await wait(1000);
  assert.equal(await page.$eval('.lx-hero',el=>el.offsetHeight),height,'Hero height remains stable while scrolling');
  const transform=await page.$eval('[data-lx-parallax]',el=>el.style.transform);
  assert(transform.includes('translate3d'),'Transform-only scroll effect');
  await page.$eval('.lx-intro',el=>el.scrollIntoView({behavior:'instant'}));await wait(1300);await shot(page,`${brand}-intro`);
  await page.$eval('.lx-chapters',el=>{const y=el.getBoundingClientRect().top+scrollY;scrollTo({top:y+(el.offsetHeight-innerHeight)*.65,behavior:'instant'});});await wait(1300);
  const clip=await page.$eval('[data-lx-chapter]:nth-child(2)',el=>el.style.clipPath);
  assert(clip.includes('inset'),'Pinned chapter has a scroll-linked curtain reveal');await shot(page,`${brand}-chapter`);
  await page.$eval('[data-lx-motion]',el=>el.click());assert.equal(await page.$eval('[data-lx-motion]',el=>el.getAttribute('aria-pressed')),'true');
  assert.equal(await page.$eval('.lx-chapters__stage',el=>getComputedStyle(el).position),'relative');
  await open(page,`${brand}/collection`);assert.equal(await page.$$('.lx-card').then(a=>a.length),6);
  await page.click('[data-lx-filter="'+(brand==='forma'?'Tables':'Tailoring')+'"]');assert.equal(await page.$$('.lx-card:not([hidden])').then(a=>a.length),brand==='forma'?2:3);
  await page.click('[data-lx-filter="all"]');await page.select('[data-lx-sort]','price-asc');
  const prices=await page.$$eval('.lx-card',nodes=>nodes.map(n=>Number(n.dataset.price)));assert.deepEqual(prices,[...prices].sort((a,b)=>a-b));await shot(page,`${brand}-collection`);
  const handle=brand==='forma'?'arc-chair':'tailored-jacket';
  await open(page,`${brand}/products/${handle}`);await page.waitForFunction(()=>document.querySelector('.lx-pdp__main img').complete);await shot(page,`${brand}-product`);
  await page.click('[data-lx-photo="campaign"]');assert.equal(await page.$eval('[data-lx-main-image]',el=>el.hidden),true);
  await page.click('[data-lx-photo="product"]');
  if(brand==='edito'){
   await page.click('[data-lx-size-open]');assert(await page.$eval('#LuxurySize',el=>el.open));await page.keyboard.press('Escape');
   await page.select('#LuxuryVariant',await page.$eval('#LuxuryVariant',el=>el.options[2].value));
  }
  await page.click('[data-lx-quantity="1"]');await page.click('cfg-product-form button[type="submit"]');await page.waitForSelector('#CartDrawer[open]');
  assert((await page.$eval('[data-cart-lines]',el=>el.textContent)).includes(brand==='forma'?'Arc lounge chair':'The tailored jacket'));
  if(brand==='edito')assert((await page.$eval('[data-cart-lines]',el=>el.textContent)).includes('M'));
  assert.equal(await page.$eval('[data-cart-count-badge]',el=>el.textContent),'2');await page.keyboard.press('Escape');
  await open(page,`${brand}/journal`);await page.click('.lx-bag');await page.waitForSelector('#CartDrawer[open]');assert((await page.$eval('[data-cart-lines]',el=>el.textContent)).includes(brand==='forma'?'Arc lounge chair':'The tailored jacket'));await page.keyboard.press('Escape');
  await page.click('.lx-journal__image');await wait(1000);assert(await page.$('.lx-article__body'));await shot(page,`${brand}-article`);
  await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
  await open(page,brand);await page.waitForFunction(()=>{const img=document.querySelector('.lx-hero img');return img.complete&&img.naturalWidth>0;});await shot(page,`${brand}-home-mobile`);
  await page.click('[data-lx-menu]');assert(await page.$eval('#LuxuryMenu',el=>el.open));await page.click('#LuxuryMenu a[href$="/collection"]');await wait(1000);
  assert((await page.url()).includes('/collection'));assert.equal(await page.$$('.lx-card').then(a=>a.length),6);await shot(page,`${brand}-collection-mobile`);
  for(const route of [`${brand}/collection`,`${brand}/products/${handle}`,`${brand}/studio`,`${brand}/journal`]){await open(page,route);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`mobile overflow: ${route}`);}
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await open(page,brand);assert.equal(await page.evaluate(()=>document.documentElement.classList.contains('lx-animated')),false);assert.equal(await page.$eval('.lx-chapters__stage',el=>getComputedStyle(el).position),'relative');
  await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);await page.setViewport({width:1440,height:1000});
 }
 for(const slug of ['vela','shadeline','northgate','linkcore','aurel']){await open(page,slug);assert(await page.$('[data-demo-checkout]'),'Legacy checkout stays demo-only');}
 assert.deepEqual(errors,[],'No runtime or local asset errors');
 const result={passed:true,routes:routeResults.length,routeResults,checks:['stable hero height','scroll parallax','pinned curtain transitions','pause and reduced motion','filter and sort','PDP gallery','size guide','quantity and size in bag','bag persistence across pages','mobile menu and overflow','legacy demo checkout'],errors,evidence};
 writeFileSync(`${evidence}/results.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await browser.close();}
