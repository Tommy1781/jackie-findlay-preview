const tracks = [
  {title:'Billy', file:'', duration:'4:06', buyUrl:'https://payhip.com/b/hmKOA'},
  {title:'Leaders & The Lead', file:'', duration:'3:28', buyUrl:'https://payhip.com/b/Fe73C'},
  {title:'Awakening', file:'', duration:'4:26', buyUrl:'https://payhip.com/b/Q3PfJ'},
  {title:'Incredible Story', file:'', duration:'4:00', buyUrl:'https://payhip.com/b/587BS'},
  {title:'Sweet Djembe', file:'', duration:'3:52', buyUrl:'https://payhip.com/b/9UyMX'},
  {title:'Wonder', file:'', duration:'4:03', buyUrl:'https://payhip.com/b/zdQ1Z'},
  {title:'Heart Song', file:'', duration:'4:36', buyUrl:'https://payhip.com/b/tRf21'},
  {title:'Saturday', file:'', duration:'3:11', buyUrl:'https://payhip.com/b/XKYwv'},
  {title:'Wings of Freedom', file:'', duration:'3:45', buyUrl:'https://payhip.com/b/HOSy4'},
  {title:'Home', file:'', duration:'4:09', buyUrl:'https://payhip.com/b/V7fyB'}
];

const audio = document.getElementById('audio');
const mainPlay = document.getElementById('mainPlay');
const seek = document.getElementById('seek');
const nowPlaying = document.getElementById('nowPlaying');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const trackList = document.getElementById('trackList');
let currentIndex = 0;

function fmt(s){ if(!Number.isFinite(s)) return '0:00'; const m=Math.floor(s/60), sec=Math.floor(s%60); return `${m}:${String(sec).padStart(2,'0')}`; }
function setTrack(index, autoplay=true){
  currentIndex = index;
  const t = tracks[index];
  if(t.file) audio.src = t.file; else audio.removeAttribute('src');
  nowPlaying.textContent = t.title;
  duration.textContent = t.duration;
  seek.value = 0;
  document.querySelectorAll('.track-row').forEach((r,i)=>r.classList.toggle('active',i===index));
  if(autoplay){ if(t.file){ audio.play().then(()=> mainPlay.textContent='Ⅱ').catch(()=>{}); } else { showToast('Music playback will be connected in the final version.'); } }
}
tracks.forEach((t,i)=>{
  const row=document.createElement('div'); row.className='track-row';
  row.innerHTML=`<span class="track-no">${String(i+1).padStart(2,'0')}</span><span class="track-title" title="${t.title}">${t.title}</span><span class="track-time">${t.duration}</span><button class="track-play" aria-label="Play ${t.title}">▶</button><a class="track-buy" href="${t.buyUrl}" target="_blank" rel="noopener" aria-label="Buy ${t.title} for CAD $1.99">CAD $1.99</a>`;
  row.querySelector('.track-play').addEventListener('click',()=>setTrack(i,true));
  trackList.appendChild(row);
});

mainPlay.addEventListener('click',()=>{
  const t=tracks[currentIndex];
  if(!t.file){ showToast('Music playback will be connected in the final version.'); return; }
  if(audio.paused){ audio.play(); mainPlay.textContent='Ⅱ'; }
  else { audio.pause(); mainPlay.textContent='▶'; }
});
audio.addEventListener('play',()=>mainPlay.textContent='Ⅱ');
audio.addEventListener('pause',()=>mainPlay.textContent='▶');
audio.addEventListener('timeupdate',()=>{
  if(audio.duration){ seek.value=(audio.currentTime/audio.duration)*100; currentTime.textContent=fmt(audio.currentTime); duration.textContent=fmt(audio.duration); }
});
audio.addEventListener('ended',()=>setTrack((currentIndex+1)%tracks.length,true));
seek.addEventListener('input',()=>{ if(audio.duration) audio.currentTime=(seek.value/100)*audio.duration; });
document.getElementById('listenAlbum').addEventListener('click',()=>setTrack(0,true));

const bioToggle=document.getElementById('bioToggle'), fullBio=document.getElementById('fullBio');
bioToggle.addEventListener('click',()=>{
  const opening=fullBio.hasAttribute('hidden');
  if(opening){ fullBio.removeAttribute('hidden'); bioToggle.textContent='Close Biography ↑'; }
  else { fullBio.setAttribute('hidden',''); bioToggle.textContent='Read Jackie’s Story →'; }
  bioToggle.setAttribute('aria-expanded', String(opening));
});

const menuToggle=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav');
menuToggle.addEventListener('click',()=>{ const open=nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded',open); menuToggle.textContent=open?'×':'☰'; });
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.textContent='☰';}));

const toast=document.getElementById('toast'); let toastTimer;
function showToast(msg){ clearTimeout(toastTimer); toast.textContent=msg; toast.classList.add('show'); toastTimer=setTimeout(()=>toast.classList.remove('show'),3200); }

const contactForm=document.querySelector('.contact-form');
const contactSubmit=document.getElementById('contactSubmit');
if(contactForm && contactSubmit){
  contactForm.addEventListener('submit',()=>{
    contactSubmit.disabled=true;
    contactSubmit.textContent='Sending…';
  });
}
