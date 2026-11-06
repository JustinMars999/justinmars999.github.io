'use strict';
const videos = [
  {id:'a2-gas-sensing',title:'Adaptive Quadruped Gas Sensing · A2',period:'2026 · DOCTORAL RESEARCH',group:'research',duration:'1:08',portrait:false,description:'Unitree A2 hardware demonstration in an indoor obstacle area, recorded in 2026. Part of my ongoing gas-source localisation research, connecting quadruped hardware, environmental sensing and adaptive measurement.'},
  {id:'robot-dog-2025',title:'Go2 sensing platform · outdoor footage',period:'2025 · PHD RESEARCH',group:'research',duration:'0:12',portrait:true,description:'Unitree Go2 carrying a mounted sensing enclosure outdoors. An earlier stage of my quadruped gas-sensing research, showing the hardware platform and outdoor movement.'},
  {id:'hydroponics-fyp',title:'Hydroponics plant-growth time-lapse',period:'2022 · UTAR FINAL-YEAR PROJECT',group:'fyp',duration:'0:58',portrait:false,description:'Plant-growth time-lapse from my UTAR final-year project, with day labels through day 7. The wider project, supervised by Dr Tee Yee Kai, connected hydroponics sensors and plant-growth images to a Node-RED monitoring dashboard.'},
  {id:'epson-scara',title:'Epson SCARA robot demonstration',period:'2021 · ROBOT-ARM WORK',group:'arms',duration:'2:05',portrait:false,description:'Original footage from my robot-arm work in 2021, showing an Epson SCARA robot in the laboratory.'},
  {id:'omron-01',title:'Omron robot arm · demonstration 1',period:'2021 · ROBOT-ARM WORK',group:'arms',duration:'0:49',portrait:true,description:'Original 2021 footage of my work with an Omron robot arm.'},
  {id:'omron-02',title:'Omron robot arm · demonstration 2',period:'2021 · ROBOT-ARM WORK',group:'arms',duration:'0:12',portrait:true,description:'A second view of my Omron robot-arm work in 2021.'},
  {id:'omron-03',title:'Omron robot arm · demonstration 3',period:'2021 · ROBOT-ARM WORK',group:'arms',duration:'0:49',portrait:true,description:'Omron robot-arm footage recorded in 2021.'},
  {id:'omron-04',title:'Omron robot arm · demonstration 4',period:'2021 · ROBOT-ARM WORK',group:'arms',duration:'0:06',portrait:true,description:'A short clip from my 2021 Omron robot-arm work.'},
  {id:'bluetooth-car',title:'My first Bluetooth robot car',period:'AGE 16 · EARLY PROJECT',group:'early',duration:'0:09',portrait:false,description:'A simple Bluetooth robot car I built when I was 16. One of my early practical projects in robotics.'}
];
const grid = document.getElementById('video-grid');
videos.forEach(item => {
  const button = document.createElement('button');
  button.className = 'video-card'; button.dataset.video = item.id; button.dataset.group = item.group;
  button.setAttribute('aria-label',`Play ${item.title}`);
  const thumb = document.createElement('div'); thumb.className = 'video-thumbnail';
  const poster = document.createElement('img'); poster.src = `assets/videos/${item.id}.jpg`; poster.alt = ''; poster.loading = 'lazy';
  if (item.portrait) poster.className = 'portrait-video';
  const play = document.createElement('span'); play.className = 'play-icon'; play.textContent = '▶'; play.setAttribute('aria-hidden','true');
  thumb.append(poster,play);
  if (item.duration) {const duration=document.createElement('span');duration.className='video-duration';duration.textContent=item.duration;thumb.append(duration);}
  const meta = document.createElement('span'); meta.className='video-card-meta'; meta.textContent=item.period;
  const title = document.createElement('span'); title.className='video-card-title'; title.textContent=item.title;
  button.append(thumb,meta,title); grid.append(button);
});
const count = document.getElementById('video-count');
count.textContent = `${videos.length} original project videos · Select a video to play`;
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click',() => {
  const selected=button.dataset.filter; let visible=0;
  document.querySelectorAll('[data-filter]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
  grid.querySelectorAll('.video-card').forEach(card=>{card.hidden=selected!=='all'&&card.dataset.group!==selected;if(!card.hidden)visible++;});
  count.textContent=`${visible} ${visible===1?'video':'videos'} · ${button.textContent}`;
}));
const dialog=document.getElementById('media-dialog');
const dialogContent=document.getElementById('dialog-content');
let opener;
function openMedia(title,description,element,trigger){
  opener=trigger;document.getElementById('dialog-title').textContent=title;
  document.getElementById('dialog-description').textContent=description;dialogContent.replaceChildren(element);dialog.showModal();
}
document.addEventListener('click',event=>{
  const videoButton=event.target.closest('[data-video]');
  if(videoButton){
    const item=videos.find(v=>v.id===videoButton.dataset.video);if(!item)return;
    const player=document.createElement('video');player.controls=true;player.playsInline=true;player.preload='metadata';player.poster=`assets/videos/${item.id}.jpg`;player.setAttribute('aria-label',item.title);
    const source=document.createElement('source');source.src=`assets/videos/${item.id}.mp4`;source.type='video/mp4';player.append(source);
    const fallback=document.createElement('p');fallback.textContent='Your browser does not support embedded video. ';const link=document.createElement('a');link.href=source.src;link.textContent='Open the video';fallback.append(link);player.append(fallback);
    player.addEventListener('error',()=>{document.getElementById('dialog-description').textContent=`This browser could not play the clip. Open the MP4 directly using the link below.`;const download=document.createElement('a');download.href=source.src;download.textContent='Open MP4 video ↗';download.className='text-link';dialogContent.append(download);},{once:true});
    openMedia(item.title,item.description,player,videoButton);
    player.play().catch(()=>{});
  }
  const photoButton=event.target.closest('[data-photo]');
  if(photoButton){const img=document.createElement('img');img.src=photoButton.dataset.photo;img.alt=photoButton.dataset.caption;openMedia(photoButton.dataset.caption,'',img,photoButton);}
});
document.getElementById('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{const player=dialogContent.querySelector('video');if(player){player.pause();player.removeAttribute('src');player.querySelectorAll('source').forEach(source=>source.remove());player.load();}dialogContent.replaceChildren();opener?.focus();});
const menu=document.querySelector('.menu-toggle');
const nav=document.getElementById('site-nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}));
document.getElementById('copy-email').addEventListener('click',async()=>{const status=document.getElementById('copy-status');try{await navigator.clipboard.writeText('marssoonhongwei@gmail.com');status.textContent='Email address copied.';}catch{status.textContent='Email: marssoonhongwei@gmail.com';}});
if('IntersectionObserver' in window){const sections=document.querySelectorAll('section[id]');const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(link=>{if(link.getAttribute('href')===`#${entry.target.id}`)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -60% 0px'});sections.forEach(section=>observer.observe(section));}
