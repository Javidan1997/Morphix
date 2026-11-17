import { img, product } from './helpers.mjs';

const descriptions = {
  forma: [
    ['arc-chair','Arc lounge chair',89000,'Seating','A sculptural solid-walnut silhouette, shaped for unhurried afternoons.','Solid walnut · sculpted seat','W 68 × D 72 × H 74 cm'],
    ['low-table','Low table',64000,'Tables','Quiet geometry meets the natural character of travertine.','Natural travertine · honed finish','W 110 × D 65 × H 32 cm'],
    ['cloud-sofa','Cloud sofa',240000,'Seating','Generous curves and a low, easy silhouette. A softer centre of the room.','Textured upholstery · timber frame','W 220 × D 100 × H 72 cm'],
    ['gather-table','Gather dining table',168000,'Tables','A place for long dinners and everyday conversations.','Solid walnut · natural oil finish','W 180 × D 95 × H 74 cm'],
    ['form-chair','Form dining chair',42000,'Seating','Soft upholstery balanced by warm oak and an architectural stance.','Oak frame · woven upholstery','W 52 × D 56 × H 78 cm'],
    ['stone-lamp','Stone table lamp',28000,'Lighting','A gentle pool of light, held in a simple sculptural form.','Stone-effect ceramic · warm LED','Ø 32 × H 38 cm']
  ],
  edito: [
    ['tailored-jacket','The tailored jacket',32000,'Tailoring','A relaxed shoulder. A precise line. Tailoring that moves with you.','Wool-blend suiting · fully lined','Relaxed fit. Model wears size S.'],
    ['column-dress','The column dress',24000,'Dresses','A single, fluid line from morning to evening.','Fluid crepe · concealed back fastening','Straight silhouette. Model wears size S.'],
    ['wide-leg-trouser','The wide-leg trouser',19000,'Tailoring','Volume, balance and a beautifully considered drape.','Wool-blend suiting · side pockets','High rise. Full length. Model wears size S.'],
    ['noir-jacket','The noir jacket',35000,'Tailoring','A confident layer with an effortless, borrowed-from-him proportion.','Structured suiting · soft shoulder','Oversized fit. Model wears size S.'],
    ['ribbed-knit','The ribbed knit',14000,'Knitwear','Tactile, easy and quietly expressive. The layer you return to.','Fine rib knit · soft-touch yarn','Close fit. Model wears size S.'],
    ['trench-coat','The fluid trench',42000,'Outerwear','A familiar shape, reimagined in movement.','Fluid cotton blend · detachable belt','Relaxed fit. Model wears size S.']
  ]
};

const journal = {
  forma: [
    {handle:'material-matters',title:'The beauty of an honest material.',category:'Materials',image:'forma-detail',intro:'Grain, texture and the small variations that make a piece its own.',body:[['Character, not uniformity.','Timber grain follows the life of a tree. Stone holds the traces of its formation. These variations give natural materials a presence that a perfectly repeated surface cannot offer.'],['Let the room breathe.','Pair a warm timber with a quiet textile. Leave a little space around a sculptural piece. A room feels more personal when each object has room to be noticed.'],['Living with your pieces.','Use a soft cloth for everyday care. Protect surfaces from standing water and direct heat. Always follow the care guidance supplied with the specific material and finish.']]},
    {handle:'a-room-to-return-to',title:'A room to return to.',category:'Spaces',image:'forma-campaign',intro:'A study in warm light, soft edges and a little less noise.',body:[['Begin with how you live.','A room starts with a ritual: the morning coffee, a book in the afternoon, friends around the table. Give that moment a place before filling the rest of the room.'],['Build a conversation.','The warm tone of a table can echo a chair frame without matching it. Soft upholstery gives stone a warmer neighbour. It is the relationship between objects that makes a room.'],['Leave something open.','A quiet corner and a clear view can be as valuable as another piece. A considered room has space for life to happen.']]}
  ],
  edito: [
    {handle:'the-art-of-getting-dressed',title:'The art of getting dressed.',category:'The wardrobe',image:'edito-campaign',intro:'Less about the occasion. More about how you want to feel.',body:[['Start with a silhouette.','A strong shoulder, a flowing trouser, an uninterrupted line. Choose the shape that feels like you and build the rest around it.'],['A wardrobe in conversation.','Ivory beside black. A soft knit against structured tailoring. Familiar pieces find new energy in a different pairing.'],['Make it personal.','Wear the jacket open, turn back a sleeve, soften a precise line. Clothes become yours in the way you live in them.']]},
    {handle:'between-moments',title:'Somewhere between moments.',category:'Campaign',image:'edito-scene',intro:'An afternoon without an agenda. A collection made for moving through it.',body:[['An unhurried rhythm.','Light changes. The city softens. A familiar street becomes somewhere new when you give yourself time to notice it.'],['Form in movement.','The quiet drama of a long coat, the ease of a wide leg, a jacket that holds its line. Each silhouette finds its character in motion.'],['Your own point of view.','There is no single way to wear a collection. These photographs are a beginning, an invitation to make the next chapter your own.']]}
  ]
};

export function luxuryFixture(brand, path='') {
  const rows=descriptions[brand];
  const list=rows.map(([handle,title,price,category,description,material,dimensions],i)=>product({handle,title,description,category,material,dimensions,url:`/shopify-templates/${brand}/products/${handle}`,options:[brand==='edito'?'Size':'Finish'],variants:(brand==='edito'?['XS','S','M','L']:['Signature finish']).map((option1,v)=>({id:(brand==='forma'?71000000000:72000000000)+i*100+v,option1,price})),featured_image:img(`${brand}-product-${i+1}`,800,brand==='edito'?1600:1000,title,[480,800]),asset:`${brand}-product-${i+1}`}));
  const products=Object.fromEntries(list.map(p=>[p.handle,p]));
  const articles=journal[brand].map(a=>({...a,image:img(a.image,1600,900,a.title,[480,800,1200,1600]),url:`/shopify-templates/${brand}/journal/${a.handle}`}));
  const name=brand==='forma'?'Forma':'Édito';
  const context={blogs:{journal:{title:'The journal',articles}},page:{title:'',content:''}};
  let template=`index.${brand}`,title=name,description=brand==='forma'?'Considered furniture for a slower way of living.':'A considered wardrobe. An individual point of view.';
  if(path==='collection'){template=`collection.${brand}`;title=brand==='forma'?'The considered collection':'The everyday, elevated';context.collection={title,products:list};}
  else if(path==='studio'){template=`page.${brand}-studio`;title=brand==='forma'?'Good design is felt. Every day.':'Not for a moment. For a way of being.';context.page={title,content:brand==='forma'?'<p>Forma is a concept furniture house built around a simple idea: the things we live with should make the everyday feel a little better.</p><p>Soft silhouettes, honest materials and a sense of proportion. Our collection brings together pieces that feel individual, but live beautifully together.</p>':'<p>Édito is a concept label for a wardrobe with a point of view. Considered silhouettes that leave room for the person wearing them.</p><p>Tailoring with ease. Familiar forms with a different energy. Clothes that move through your day without asking you to become someone else.</p>'};}
  else if(path==='journal'){template=`blog.${brand}`;title='The journal';context.blog={title,articles};}
  else if(path.startsWith('journal/')){const a=articles.find(a=>a.handle===path.slice(8));if(!a)return null;template=`article.${brand}`;title=a.title;context.article=a;description=a.intro;}
  else if(path.startsWith('products/')){const p=products[path.slice(9)];if(!p)return null;template=`product.${brand}`;title=p.title;description=p.description;context.product=p;}
  else if(path)return null;
  return {template,products,collections:{luxury:{products:list}},context,title:`${title} | ${name} — Configuro concept store`,description};
}
export const luxuryRoutes=Object.keys(descriptions).flatMap(brand=>['collection','studio','journal',...journal[brand].map(a=>'journal/'+a.handle),...descriptions[brand].map(p=>'products/'+p[0])].map(path=>`${brand}/${path}`));
