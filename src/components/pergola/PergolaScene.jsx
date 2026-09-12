import { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { FINISHES } from '../../data/pergolaPackages';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const easeInOut = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const IDLE_ORBIT_DELAY = 4200;

function disposeGroup(group) {
  const materials = new Set();
  const textures = new Set();
  group.traverse(n => { if (n.isMesh) { n.geometry.dispose(); (Array.isArray(n.material) ? n.material : [n.material]).forEach(m => materials.add(m)); } });
  materials.forEach(m => {Object.values(m).forEach(value=>{if(value?.isTexture)textures.add(value);});m.dispose();});
  textures.forEach(texture=>texture.dispose());
}

// Independent demonstration geometry based on the two source projects' product
// anatomy and interactions. No vendor analytics, cart APIs or external assets.
//
// The structure is built once per set of *structural* dimensions. Everything a
// visitor drags — louver angle, glass opening, screen drop, finish colour — is
// applied in place by applyDynamic() instead, so sliders animate at frame rate
// rather than rebuilding two hundred meshes per input event.
export function makePergola(c) {
  const group = new THREE.Group();
  const frame = new THREE.MeshPhysicalMaterial({ color: FINISHES[c.finish], roughness: .48, metalness: .45, clearcoat:.2,clearcoatRoughness:.5 });
  const blade = new THREE.MeshStandardMaterial({ color: FINISHES[c.finish], roughness: .52, metalness: .35 });
  const stone = new THREE.MeshStandardMaterial({ color: '#c7c5be', roughness:.92 });
  const seam = new THREE.MeshStandardMaterial({ color: '#aba9a3', roughness:1 });
  const glass = new THREE.MeshPhysicalMaterial({ color:'#bdd9de', transparent:true, opacity:.22, roughness:.08, metalness:.12, side:THREE.DoubleSide, depthWrite:false });
  const fabric = new THREE.MeshStandardMaterial({ color: '#8a8c87', roughness:1, side:THREE.DoubleSide, transparent:true, opacity:.87 });
  const light = new THREE.MeshStandardMaterial({color:'#fff2c4',emissive:'#ffda81',emissiveIntensity:2.8});
  const box = (name, x,y,z, px,py,pz, mat=frame, parent=group) => {
    const geometry=mat===frame||mat===blade?new RoundedBoxGeometry(x,y,z,2,Math.min(x,y,z,.028)*.16):new THREE.BoxGeometry(x,y,z);
    const mesh = new THREE.Mesh(geometry,mat);
    mesh.name=name; mesh.position.set(px,py,pz); mesh.castShadow=mat!==glass; mesh.receiveShadow=true; parent.add(mesh); return mesh;
  };
  const {width:w,depth:d,height:h} = c;
  const parts = { frame, blade, louvers: [], glassPanels: [], dims: { w, d, h } };

  if(c.environment==='studio'){
    box('terrace', w+.75,.13,d+.75,0,-.065,0,stone);
    for(let x=-w/2; x<w/2+.3; x+=.65) box('tile-joint',.005,.001,d+.7,x,.001,0,seam);
    for(let z=-d/2; z<d/2+.3; z+=.65) box('tile-joint',w+.7,.001,.005,0,.001,z,seam);
  }else if(!c.attached)stone.dispose();
  for(const x of [-w/2,w/2]) for(const z of [-d/2,d/2]) {
    if(c.attached && z<0) continue;
    box('column',.14,h,.14,x,h/2,z);
    box('footplate',.23,.025,.23,x,.013,z);
    // Narrow vertical channels give the aluminum profiles a readable section.
    box('column-channel',.008,h-.08,.004,x+.048,h/2,z+.071,seam);
  }
  for(const z of [-d/2,d/2]) box('cross-beam',w+.14,.22,.16,0,h-.11,z);
  for(const x of [-w/2,w/2]) box('side-beam',.16,.22,d,x,h-.11,0);
  const count=Math.ceil(d/.19), spacing=(d-.19)/count;
  for(let i=0;i<count;i++) {
    const mesh=box('louver',w-.15,.036,spacing*.96,0,h-.11,-d/2+.1+spacing*(i+.5),blade);
    mesh.rotation.x=THREE.MathUtils.degToRad(c.roof);
    parts.louvers.push(mesh);
  }
  if(c.attached) {
    const wall=new THREE.MeshStandardMaterial({color:'#e7e6e0',roughness:1});
    box('building-wall',w+1.2,h+.5,.18,0,(h+.5)/2,-d/2-.18,wall);
    box('wall-cap',w+1.25,.035,.23,0,h+.52,-d/2-.18,stone);
  }

  // Sliding glass, ZIP screen and LED are always built, then shown or hidden.
  // Keeping them resident is what lets a toggle read as instant.
  const panelW=(w-.16)/4;
  const glassGroup=new THREE.Group(); glassGroup.name='glass-system'; group.add(glassGroup);
  parts.glassGroup=glassGroup; parts.panelW=panelW;
  box('glass-track',w-.12,.045,.15,0,.025,d/2,frame,glassGroup);
  for(let i=0;i<4;i++) {
    const panel=new THREE.Group();
    panel.position.z=d/2-.035+i*.024;
    glassGroup.add(panel);
    box('glass-panel',panelW-.025,h-.27,.012,0,(h-.27)/2+.045,0,glass,panel);
    for(const side of [-1,1]) box('glass-stile',.018,h-.25,.025,side*(panelW/2-.01),(h-.25)/2+.035,0,frame,panel);
    box('glass-bottom',panelW,.023,.025,0,.045,0,frame,panel);
    box('glass-handle',.018,.13,.045,panelW/2-.055,1.12,.025,frame,panel);
    parts.glassPanels.push(panel);
  }

  const screenGroup=new THREE.Group(); screenGroup.name='screen-system'; group.add(screenGroup);
  parts.screenGroup=screenGroup;
  box('screen-housing',.14,.12,d-.12,w/2,h-.27,0,frame,screenGroup);
  for(const z of [-d/2+.085,d/2-.085]) box('screen-track',.065,h-.3,.035,w/2,h/2-.15,z,frame,screenGroup);
  parts.screenHeight=h-.25;
  parts.screenFabric=box('screen-fabric',.012,parts.screenHeight,d-.2,w/2,0,0,fabric,screenGroup);
  parts.screenBottom=box('screen-bottom',.05,.04,d-.17,w/2,0,0,frame,screenGroup);

  const ledGroup=new THREE.Group(); ledGroup.name='led-system'; group.add(ledGroup);
  parts.ledGroup=ledGroup;
  for(const x of [-w/2+.085,w/2-.085]) box('led-strip',.025,.025,d-.22,x,h-.22,0,light,ledGroup);
  for(const z of [-d/2+.085,d/2-.085]) box('led-strip',w-.22,.025,.025,0,h-.22,z,light,ledGroup);
  parts.ledLight=new THREE.PointLight('#ffd899',12,6,2);
  parts.ledLight.position.set(0,h-.3,0);
  ledGroup.add(parts.ledLight);

  group.userData.parts=parts;
  applyDynamic(group,c);
  return group;
}

// Applies every continuously-variable option to an existing structure.
export function applyDynamic(group, c) {
  const p = group.userData.parts;
  if (!p) return;
  const { w, h } = p.dims;

  p.frame.color.set(FINISHES[c.finish]);
  p.blade.color.set(FINISHES[c.finish]);

  const angle = THREE.MathUtils.degToRad(c.roof);
  p.louvers.forEach(mesh => { mesh.rotation.x = angle; });

  p.glassGroup.visible = !!c.glass;
  if (c.glass) {
    const opening = c.glassOpen / 100;
    p.glassPanels.forEach((panel, i) => {
      const open = -w / 2 + .08 + p.panelW / 2;
      const shut = -w / 2 + .08 + p.panelW * (i + .5);
      panel.position.x = shut * (1 - opening) + open * opening;
    });
  }

  p.screenGroup.visible = !!c.screen;
  if (c.screen) {
    const drop = (h - .25) * (1 - c.screenOpen / 100);
    const visible = drop > .015;
    p.screenFabric.visible = visible;
    p.screenBottom.visible = visible;
    if (visible) {
      p.screenFabric.scale.y = drop / p.screenHeight;
      p.screenFabric.position.y = h - .31 - drop / 2;
      p.screenBottom.position.y = h - .31 - drop;
    }
  }

  p.ledGroup.visible = !!c.led;
  group.userData.configuration = { ...c };
}

const structuralNames=new Set(['column','column-channel','footplate','cross-beam','side-beam','louver']);
function sourceKey(c,id){return id==='custom'||c.attached?null:c.width>3.5?'13x16':c.depth>3.5?'10x13':'10x10';}
function updateSource(r,c){
  if(!r.sourceModel)return;
  r.sourceMaterial.color.set(FINISHES[c.finish]);
  r.sourceLouvers.forEach(({node,z})=>{node.rotation.z=z+THREE.MathUtils.degToRad(c.roof);});
  r.product.traverse(node=>{if(structuralNames.has(node.name))node.visible=false;});
}

export default function PergolaScene({ configuration, packageId, view, resetKey, text, onSnapshot }) {
  const host=useRef(null), runtime=useRef(null), latest=useRef(configuration);
  latest.current=configuration;
  const [status,setStatus]=useState('loading'), [retry,setRetry]=useState(0);
  const [environmentStatus,setEnvironmentStatus]=useState('ready');
  const [progress,setProgress]=useState(1);
  const [vrSupport,setVrSupport]=useState('checking'),[vrActive,setVrActive]=useState(false),[vrError,setVrError]=useState(false);
  const [autoOrbit,setAutoOrbit]=useState(true);
  const [immersed,setImmersed]=useState(false);
  const xrSession=useRef(null);

  useEffect(()=>{
    let cancelled=false;
    if(!window.isSecureContext || !navigator.xr){setVrSupport('unsupported');return;}
    navigator.xr.isSessionSupported('immersive-vr').then(supported=>{if(!cancelled)setVrSupport(supported?'supported':'unsupported');}).catch(()=>{if(!cancelled)setVrSupport('unsupported');});
    return()=>{cancelled=true;};
  },[]);

  // Fullscreen is requested on the stage wrapper so the overlay controls and
  // the camera bar come with it.
  useEffect(()=>{
    const onChange=()=>setImmersed(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange',onChange);
    return()=>document.removeEventListener('fullscreenchange',onChange);
  },[]);
  const toggleFullscreen=useCallback(()=>{
    const stage=host.current?.parentElement;
    if(!stage)return;
    if(document.fullscreenElement)document.exitFullscreen?.().catch(()=>{});
    else stage.requestFullscreen?.().catch(()=>{});
  },[]);

  // Renders one frame and reads it back before the buffer is cleared, so the
  // renderer does not have to carry preserveDrawingBuffer all session.
  const snapshot=useCallback(()=>{
    const r=runtime.current;if(!r)return;
    r.renderer.render(r.scene,r.camera);
    r.renderer.domElement.toBlob(blob=>{
      if(!blob)return;
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;a.download=`configuro-design-${Date.now()}.png`;
      // Firefox and Safari only honour a download click on an attached anchor.
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
      onSnapshot?.();
    },'image/png');
  },[onSnapshot]);

  async function startVR(){
    const r=runtime.current;if(!r || vrSupport!=='supported')return;
    setVrError(false);
    if(xrSession.current){await xrSession.current.end().catch(()=>setVrError(true));return;}
    const previous=r.camera.position.clone();
    try{
      const session=await navigator.xr.requestSession('immersive-vr',{optionalFeatures:['local-floor','bounded-floor']});
      if(runtime.current!==r){await session.end();return;}
      xrSession.current=session;r.controls.enabled=false;r.rig.position.set(0,.14,latest.current.depth/2+1.2);r.camera.position.set(0,0,0);
      session.addEventListener('end',()=>{
        xrSession.current=null;
        if(runtime.current!==r)return;
        r.renderer.setAnimationLoop(null);r.rig.position.set(0,0,0);r.camera.position.copy(previous);r.controls.enabled=true;r.controls.update();setVrActive(false);r.draw();
      },{once:true});
      await r.renderer.xr.setSession(session);
      r.renderer.setAnimationLoop(()=>r.renderer.render(r.scene,r.camera));setVrActive(true);
    }catch{
      if(xrSession.current)await xrSession.current.end().catch(()=>{});
      xrSession.current=null;
      r.rig.position.set(0,0,0);r.camera.position.copy(previous);r.controls.enabled=true;r.controls.update();setVrError(true);setVrActive(false);r.draw();
    }
  }

  useEffect(() => {
    const mount=host.current;
    let renderer, controls, observer, environment, room, pmrem;
    let frame=0, loop=0, disposed=false;
    const scene=new THREE.Scene();
    const onContextLost=e=>{e.preventDefault();setStatus('error');};
    try {
      renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});
      renderer.xr.enabled=true;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.8));
      renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
      renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.95;
      scene.background=new THREE.Color('#e8eaec');
      const camera=new THREE.PerspectiveCamera(37,1,.05,500);
      const rig=new THREE.Group();rig.add(camera);scene.add(rig);
      camera.position.set(7,5.3,8);
      controls=new OrbitControls(camera,renderer.domElement);
      controls.target.set(0,1.15,0);controls.enableDamping=false;controls.enablePan=false;
      controls.minDistance=5;controls.maxDistance=20;controls.maxPolarAngle=Math.PI/2-.035;
      renderer.domElement.setAttribute('aria-label',text.live);
      renderer.domElement.setAttribute('role','img');
      renderer.domElement.addEventListener('webglcontextlost',onContextLost);
      mount.appendChild(renderer.domElement);
      const hemi=new THREE.HemisphereLight('#ffffff','#bec2c8',1.2);scene.add(hemi);
      const sun=new THREE.DirectionalLight('#fffaf0',3);sun.position.set(-3,8,5);sun.castShadow=true;
      sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:.5,far:25});sun.shadow.normalBias=.025;
      scene.add(sun);
      room=new RoomEnvironment();pmrem=new THREE.PMREMGenerator(renderer);environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;scene.environmentIntensity=.55;
      room.dispose();room=null;pmrem.dispose();pmrem=null;
      const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#e8eaec',roughness:1}));
      floor.rotation.x=-Math.PI/2;floor.position.y=-.135;floor.receiveShadow=true;scene.add(floor);
      const product=makePergola(latest.current);scene.add(product);

      const draw=()=>{ if(disposed||renderer.xr.isPresenting)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{if(!disposed&&!renderer.xr.isPresenting)renderer.render(scene,camera);}); };

      // One rAF loop drives camera tweens, option tweens and the idle orbit,
      // and shuts itself off as soon as nothing is moving.
      const r={scene,camera,rig,controls,renderer,product,draw,hemi,sun,floor,
        tween:null, shown:{roof:latest.current.roof,glassOpen:latest.current.glassOpen,screenOpen:latest.current.screenOpen},
        idleAt:performance.now()+IDLE_ORBIT_DELAY, orbit:!reduceMotion(), running:false, lastOrbit:performance.now()};

      const step=()=>{
        if(disposed||renderer.xr.isPresenting){r.running=false;return;}
        const now=performance.now();
        let busy=false;

        if(r.tween){
          const t=Math.min(1,(now-r.tween.start)/r.tween.duration);
          const e=easeInOut(t);
          camera.position.lerpVectors(r.tween.from,r.tween.to,e);
          controls.target.lerpVectors(r.tween.fromTarget,r.tween.toTarget,e);
          controls.update();
          if(t>=1)r.tween=null; else busy=true;
        }

        const target=latest.current;
        let moved=false;
        for(const key of ['roof','glassOpen','screenOpen']){
          const diff=target[key]-r.shown[key];
          if(Math.abs(diff)>.05){ r.shown[key]+=diff*.18; busy=true; moved=true; }
          else if(r.shown[key]!==target[key]){ r.shown[key]=target[key]; moved=true; }
        }
        if(moved){
          applyDynamic(r.product,{...target,...r.shown});
          if(r.sourceLouvers)r.sourceLouvers.forEach(({node,z})=>{node.rotation.z=z+THREE.MathUtils.degToRad(r.shown.roof);});
        }

        if(r.orbit&&!r.tween&&now>r.idleAt){
          const offset=camera.position.clone().sub(controls.target);
          offset.applyAxisAngle(new THREE.Vector3(0,1,0),.00022*Math.min(50,now-r.lastOrbit));
          camera.position.copy(controls.target).add(offset);
          controls.update();
          busy=true;
        }
        r.lastOrbit=now;

        renderer.render(scene,camera);
        if(busy)loop=requestAnimationFrame(step);
        else r.running=false;
      };
      r.wake=()=>{ if(disposed||r.running||renderer.xr.isPresenting)return; r.running=true; r.lastOrbit=performance.now(); loop=requestAnimationFrame(step); };
      r.nudge=()=>{ r.idleAt=performance.now()+IDLE_ORBIT_DELAY; r.wake(); };
      runtime.current=r;

      controls.addEventListener('change',draw);
      controls.addEventListener('start',()=>{ r.tween=null; r.idleAt=Infinity; });
      controls.addEventListener('end',()=>{ r.idleAt=performance.now()+IDLE_ORBIT_DELAY; r.wake(); });
      controls.update();
      observer=new ResizeObserver(()=>{const {width,height}=mount.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();draw();});
      observer.observe(mount);draw();setStatus('ready');
      if(!reduceMotion())r.wake();
    } catch(error) { console.error('Pergola viewer initialization failed',error);setStatus('error'); }
    return()=>{
      disposed=true;cancelAnimationFrame(frame);cancelAnimationFrame(loop);observer?.disconnect();controls?.dispose();
      renderer?.setAnimationLoop(null);xrSession.current?.end().catch(()=>{});xrSession.current=null;
      renderer?.domElement.removeEventListener('webglcontextlost',onContextLost);
      disposeGroup(scene);environment?.dispose();room?.dispose();pmrem?.dispose();renderer?.dispose();
      renderer?.domElement.remove();runtime.current=null;
    };
  },[retry]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    r.orbit=autoOrbit&&!reduceMotion();
    if(r.orbit)r.nudge();
  },[autoOrbit]);

  useEffect(()=>{
    const r=runtime.current;if(!r||configuration.environment==='studio')return;
    let cancelled=false,hdr,outdoor;
    new HDRLoader().load('/pergola-configurators/environments/morning.hdr',texture=>{
      hdr=texture;if(cancelled){texture.dispose();return;}
      texture.mapping=THREE.EquirectangularReflectionMapping;
      const generator=new THREE.PMREMGenerator(r.renderer);outdoor=generator.fromEquirectangular(texture);generator.dispose();
      r.outdoorTexture=texture;r.studioEnvironment=r.scene.environment;r.scene.environment=outdoor.texture;
      if(latest.current.time!=='night'){r.scene.background=texture;r.scene.backgroundBlurriness=.035;r.scene.backgroundIntensity=.7;}
      r.draw();
    },undefined,()=>{});
    return()=>{cancelled=true;if(r.outdoorTexture===hdr){r.outdoorTexture=null;r.scene.environment=r.studioEnvironment;r.scene.background=new THREE.Color(latest.current.time==='night'?'#151f36':'#e8eaec');}hdr?.dispose();outdoor?.dispose();r.draw();};
  },[configuration.environment==='studio',retry]);

  // Structural rebuild only. Louver angle, openings and finish are tweened by
  // the render loop instead, so dragging a slider never rebuilds geometry.
  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    r.scene.remove(r.product);disposeGroup(r.product);
    r.product=makePergola(latest.current);r.scene.add(r.product);
    r.shown={roof:latest.current.roof,glassOpen:latest.current.glassOpen,screenOpen:latest.current.screenOpen};
    if(r.sourceModel&&r.sourceKey===sourceKey(latest.current,packageId))updateSource(r,latest.current);
    r.draw();
  },[configuration.width,configuration.depth,configuration.height,configuration.attached,configuration.environment==='studio',retry]);

  // Cheap options: hand them to the loop so they animate to their new value.
  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    applyDynamic(r.product,{...latest.current,...r.shown});
    if(r.sourceModel)updateSource(r,latest.current);
    r.nudge?.();r.draw();
  },[configuration.roof,configuration.glass,configuration.glassOpen,configuration.screen,configuration.screenOpen,configuration.led,configuration.finish]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    const key=sourceKey(configuration,packageId);if(!key)return;
    let cancelled=false,model;
    setProgress(0);
    new GLTFLoader().load(`/pergola-configurators/models/${key}.glb`,gltf=>{
      model=gltf.scene;if(cancelled){disposeGroup(model);return;}
      const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
      model.scale.set(configuration.width/size.x,configuration.height/size.y,configuration.depth/size.z);
      model.position.set(-center.x*model.scale.x,-bounds.min.y*model.scale.y,-center.z*model.scale.z);
      const material=new THREE.MeshPhysicalMaterial({color:FINISHES[latest.current.finish],roughness:.48,metalness:.45,clearcoat:.2,clearcoatRoughness:.5});
      const previousMaterials=new Set(),louvers=[];
      model.traverse(node=>{
        if(!node.isMesh)return;
        (Array.isArray(node.material)?node.material:[node.material]).forEach(m=>previousMaterials.add(m));node.material=material;node.castShadow=true;node.receiveShadow=true;
        if(/^(Geom3D_Component#26_|3DGeom-[1-5](_\d+)?$)/.test(node.name))louvers.push({node,z:node.rotation.z});
      });
      const textures=new Set();previousMaterials.forEach(m=>{Object.values(m).forEach(v=>{if(v?.isTexture)textures.add(v);});m.dispose();});textures.forEach(t=>t.dispose());
      r.sourceModel=model;r.sourceKey=key;r.sourceMaterial=material;r.sourceLouvers=louvers;r.scene.add(model);updateSource(r,latest.current);setProgress(1);r.draw();
    },event=>{if(!cancelled&&event.total)setProgress(event.loaded/event.total);},()=>{if(!cancelled)setProgress(1);});
    return()=>{cancelled=true;setProgress(1);if(model){r.scene.remove(model);disposeGroup(model);if(r.sourceModel===model){r.sourceModel=null;r.sourceLouvers=[];r.product.traverse(node=>{if(structuralNames.has(node.name))node.visible=true;});}r.draw();}};
  },[packageId,configuration.width,configuration.depth,configuration.height,configuration.attached,retry]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    const night=configuration.time==='night';
    r.scene.background=!night&&r.outdoorTexture?r.outdoorTexture:new THREE.Color(night?'#151f36':configuration.environment==='studio'?'#e8eaec':'#b7cee1');
    r.floor.material.color.set(night?'#303747':configuration.environment==='studio'?'#e8eaec':'#c4c9bb');
    r.floor.visible=configuration.environment==='studio';
    r.hemi.color.set(night?'#8baddc':'#ffffff');r.hemi.groundColor.set(night?'#293551':'#bec2c8');r.hemi.intensity=night?.65:1.2;
    r.sun.color.set(night?'#91b5ee':'#fff0d5');r.sun.intensity=night?.65:2.5;r.sun.position.set(night?-5:-3,night?7:5,5);
    r.scene.environmentIntensity=night?.16:.55;r.renderer.toneMappingExposure=night?.95:.95;r.draw();
  },[configuration.time,configuration.environment,retry]);

  useEffect(()=>{
    const r=runtime.current;if(!r)return;
    let cancelled=false, model;
    const id=configuration.environment;
    if(id==='studio'){setEnvironmentStatus('ready');return;}
    setEnvironmentStatus('loading');
    const names={patio:'Patio',pool:'Pool',deck:'Deck',rooftop:'Rooftop'};
    new GLTFLoader().load(`/pergola-configurators/environments/${names[id]}.glb`,gltf=>{
      model=gltf.scene;
      if(cancelled){disposeGroup(model);return;}
      // Preserve src/main.js source placements. The source product has its front
      // at z=0 and floor at y=-2; this demo centers its product at ground level.
      const placements={patio:{z:-.48,rotation:Math.PI*1.5,scale:1},pool:{z:1.5,rotation:Math.PI/2,scale:.9},deck:{z:1.35,rotation:Math.PI/2,scale:1},rooftop:{z:2,rotation:Math.PI/2,scale:1.5}};
      const placement=placements[id];
      model.rotation.y=placement.rotation;
      model.scale.setScalar(placement.scale);
      model.position.set(0,0,placement.z+latest.current.depth/2);
      model.userData.sourceZ=placement.z;
      model.traverse(node=>{if(node.isMesh){node.castShadow=true;node.receiveShadow=true;}});
      r.environmentModel=model;r.scene.add(model);r.draw();setEnvironmentStatus('ready');
    },undefined,()=>{if(!cancelled){r.floor.visible=true;setEnvironmentStatus('error');r.draw();}});
    return()=>{cancelled=true;if(model){r.scene.remove(model);if(r.environmentModel===model)r.environmentModel=null;disposeGroup(model);r.draw();}};
  },[configuration.environment,retry]);

  useEffect(()=>{const r=runtime.current;if(r?.environmentModel){r.environmentModel.position.z=r.environmentModel.userData.sourceZ+configuration.depth/2;r.draw();}},[configuration.depth]);

  // Camera moves are tweened rather than snapped, which is most of what makes
  // switching views read as a product rather than a viewer.
  useEffect(()=>{
    const r=runtime.current;if(!r||r.renderer.xr.isPresenting)return;
    const size=Math.max(latest.current.width,latest.current.depth);
    const outside=configuration.environment!=='studio';
    const distance=Math.max(outside?9.5:7.4,size*2.35);
    const to=new THREE.Vector3(), toTarget=new THREE.Vector3(0,view==='inside'?1.6:1.15,0);
    if(view==='top')to.set(0,distance+.8,.01);
    else if(view==='front')to.set(0,2.8,distance);
    else if(view==='inside'){to.set(0,1.6,latest.current.depth/2-.2);toTarget.set(0,1.6,-latest.current.depth/2);}
    else to.set(distance*.68,distance*.45,distance*.78);
    r.controls.minDistance=view==='inside'?.1:5;
    if(reduceMotion()){
      r.camera.position.copy(to);r.controls.target.copy(toTarget);r.controls.update();r.draw();return;
    }
    r.tween={from:r.camera.position.clone(),to,fromTarget:r.controls.target.clone(),toTarget,start:performance.now(),duration:820};
    r.idleAt=performance.now()+IDLE_ORBIT_DELAY+820;
    r.wake();
  },[view,resetKey,retry,configuration.width,configuration.depth,configuration.environment]);

  const loading=progress<1;
  return <><div className="pcg-scene" ref={host} data-state={status} data-environment-state={environmentStatus}/>
    {status!=='ready' && <div className="pcg-viewer-status" role="status"><p>{status==='error'?text.error:text.loading}</p>{status==='error' && <button type="button" onClick={()=>{setStatus('loading');setRetry(n=>n+1);}}>{text.retry}</button>}</div>}
    {status==='ready' && loading && <div className="pcg-progress" role="status" aria-label={text.loading}><span style={{transform:`scaleX(${Math.max(.04,progress)})`}}/></div>}
    {status==='ready' && <div className="pcg-stage-tools">
      <button type="button" className="pcg-tool" aria-pressed={autoOrbit} onClick={()=>setAutoOrbit(v=>!v)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M12 3a9 9 0 1 1-8.5 6"/><path d="M3 3v5h5"/></svg>
        <span className="pcg-tool-label">{text.autoOrbit}</span></button>
      <button type="button" className="pcg-tool" onClick={snapshot}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M3 8h3l2-2h8l2 2h3v11H3z"/><circle cx="12" cy="13" r="3.4"/></svg>
        <span className="pcg-tool-label">{text.snapshot}</span></button>
      <button type="button" className="pcg-tool" aria-pressed={immersed} onClick={toggleFullscreen}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{immersed?<path d="M9 4v5H4m11 11v-5h5M9 20v-5H4m11-11v5h5"/>:<path d="M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5"/>}</svg>
        <span className="pcg-tool-label">{immersed?text.exitFullscreen:text.fullscreen}</span></button>
    </div>}
    {status==='ready' && <div className="pcg-vr"><button type="button" disabled={vrSupport!=='supported'} onClick={startVR} title={vrSupport==='unsupported'?text.vrUnsupported:undefined}>{vrActive?text.exitVR:text.enterVR}</button><span>{vrSupport==='checking'?text.vrChecking:vrSupport==='unsupported'?text.vrUnsupported:vrError?text.vrError:''}</span></div>}
    {environmentStatus!=='ready'&&<div className="pcg-environment-status" role="status">{environmentStatus==='loading'?text.sceneLoading:text.sceneError}</div>}
  </>;
}
