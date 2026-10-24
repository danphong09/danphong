const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const heroPlay = document.getElementById("heroPlay");
const disc = document.getElementById("disc");
const discPhoto = document.getElementById("discPhoto");
const seek = document.getElementById("seek");
const volume = document.getElementById("volume");
const current = document.getElementById("current");
const duration = document.getElementById("duration");
const title = document.getElementById("trackTitle");
const status = document.getElementById("trackStatus");
const tracks = [...document.querySelectorAll(".track")];

const playlist = [
  { title: "Phong", src: "assets/phong.mp3", cover: "assets/cover-phong.jpg" },
  { title: "Nhạc của Phong", src: "assets/nhacuaphong.mp3", cover: "assets/cover-nhacuaphong.jpg" },
  { title: "Chấp Niệm Trong Em", src: "assets/chap-niem-trong-em.mp3", cover: "assets/cover-chap-niem.jpg" },
  { title: "Bài hát mới", src: "assets/new-song.mp3", cover: "assets/memory-family-hoalu.jpg" },
  { title: "Bài hát mới 2", src: "assets/snaptik-766312.mp3", cover: "assets/memory-child-suit.jpg" },
  { title: "Bài hát mới 3", src: "assets/snaptik-763928.mp3", cover: "assets/memory-child-united.jpg" },
  { title: "Bài hát mới 4", src: "assets/snaptik-755276.m4a", cover: "assets/memory-hoalu-lake.jpg" },
  { title: "Nhạc bạn gửi 1", src: "assets/dp-upload-track-1.mp3", cover: "assets/cover-phong.jpg" },
  { title: "Nhạc bạn gửi 2", src: "assets/dp-upload-track-2.mp3", cover: "assets/cover-nhacuaphong.jpg" },
  { title: "Nhạc bạn gửi 3", src: "assets/dp-upload-track-3.mp3", cover: "assets/cover-chap-niem.jpg" },
  { title: "Nhạc bạn gửi 4", src: "assets/dp-upload-track-4.mp3", cover: "assets/memory-family-hoalu.jpg" },
  { title: "Nhạc mới bạn gửi", src: "assets/nhac-moi-ban-gui.mp3", cover: "assets/cover-phong.jpg" }
];
let index = 0;
audio.volume = Number(volume.value || 0.8);
audio.muted = false;
audio.preload = "none"; // Tải bài hát khi người xem bấm phát, giảm dữ liệu ban đầu trên điện thoại.

function fmt(sec){
  if(!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec/60);
  const s = Math.floor(sec%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}
function loadTrack(i, autoplay=false){
  index = (i + playlist.length) % playlist.length;
  audio.src = playlist[index].src;
  title.textContent = playlist[index].title;
  if(discPhoto){ discPhoto.src = playlist[index].cover; discPhoto.alt = "Ảnh bìa: " + playlist[index].title; }
  status.textContent = "Sẵn sàng phát nhạc";
  tracks.forEach((t,n)=>t.classList.toggle("active", n===index));
  audio.load();
  if(autoplay) playCurrent();
}
function setPlaying(on){
  playBtn.textContent = on ? "Ⅱ" : "▶";
  heroPlay.textContent = on ? "Ⅱ Đang phát" : "▶ Phát nhạc";
  disc.classList.toggle("playing", on);
  status.textContent = on ? "Đang phát" : "Đã tạm dừng";
}
function playCurrent(){
  audio.muted = false;
  audio.play().then(()=>setPlaying(true)).catch(err=>{
    setPlaying(false);
    if(err && err.name === "NotAllowedError") {
      status.textContent = "Trình duyệt chặn phát nhạc tự động — hãy nhấn Phát nhạc.";
    } else {
      status.textContent = "Chưa phát được bài này. Hãy thử bài khác hoặc kiểm tra tệp nhạc trong assets.";
    }
  });
}
function togglePlay(){
  if(audio.paused) playCurrent();
  else {audio.pause(); setPlaying(false);}
}
playBtn.addEventListener("click", togglePlay);
heroPlay.addEventListener("click", togglePlay);

document.getElementById("prev").addEventListener("click", ()=>{
  loadTrack(index-1, true);
});
document.getElementById("next").addEventListener("click", ()=>{
  loadTrack(index+1, true);
});
tracks.forEach(t => t.addEventListener("click", e=>{
  if(t.hasAttribute("data-index")){
    loadTrack(Number(t.dataset.index), true);
  }
}));
document.getElementById("mute").addEventListener("click", e=>{
  audio.muted = !audio.muted;
  e.currentTarget.textContent = audio.muted ? "🔇" : "🔊";
});
volume.addEventListener("input", ()=>audio.volume = Number(volume.value));
audio.addEventListener("error", ()=>{
  status.textContent = "Không tải được tệp nhạc — hãy thử bài khác. Kiểm tra định dạng/tệp trong assets nếu lỗi tiếp diễn.";
  setPlaying(false);
});
audio.addEventListener("loadedmetadata", ()=>duration.textContent = fmt(audio.duration));
audio.addEventListener("timeupdate", ()=>{
  current.textContent = fmt(audio.currentTime);
  if(audio.duration) seek.value = (audio.currentTime/audio.duration)*100;
});
seek.addEventListener("input", ()=>{
  if(audio.duration) audio.currentTime = (Number(seek.value)/100)*audio.duration;
});
audio.addEventListener("play", ()=>setPlaying(true));
audio.addEventListener("pause", ()=>setPlaying(false));
audio.addEventListener("ended", ()=>loadTrack(index+1, true));

loadTrack(0);

// Blossom effects are created by the personal-settings controller below.
// Cursor glow
const glow=document.getElementById("cursorGlow");
if(!window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)").matches){
  window.addEventListener("pointermove", e=>{
    glow.style.left=e.clientX+"px";
    glow.style.top=e.clientY+"px";
  }, {passive:true});
}

// 3D hover on the avatar
const avatarWrap=document.getElementById("avatarWrap");
avatarWrap.addEventListener("pointermove", e=>{
  const r=avatarWrap.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5;
  const y=(e.clientY-r.top)/r.height-.5;
  avatarWrap.style.transform=`perspective(800px) rotateY(${x*12}deg) rotateX(${-y*12}deg) scale(1.02)`;
});
avatarWrap.addEventListener("pointerleave", ()=>{
  avatarWrap.style.transform="";
});

// 3D hover on cards
document.querySelectorAll(".tilt").forEach(card=>{
  card.addEventListener("pointermove", e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(700px) rotateY(${x*5}deg) rotateX(${-y*5}deg) translateY(-3px)`;
  });
  card.addEventListener("pointerleave", ()=>card.style.transform="");
});

// Reveal on scroll
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add("show"); });
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

// Mobile menu
document.querySelector(".menu-btn").addEventListener("click", ()=>{
  const nav=document.querySelector("nav");
  nav.classList.toggle('nav-open');
});
const siteNav = document.querySelector('.topbar nav');
const navLinks = [...document.querySelectorAll('.topbar nav a')];
navLinks.forEach(link=>link.addEventListener('click',()=>{
  siteNav.classList.remove('nav-open');
  const target = document.querySelector(link.getAttribute('href'));
  if(target){
    target.classList.remove('section-slide-in');
    // Restart a lightweight transform/opacity animation without layout-heavy effects.
    void target.offsetWidth;
    target.classList.add('section-slide-in');
    window.setTimeout(()=>target.classList.remove('section-slide-in'),420);
  }
}));
// Keep the current section highlighted as the visitor scrolls.
const navTargets = navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window){
  const activeObserver = new IntersectionObserver(entries=>{
    const visible = entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    navLinks.forEach(link=>{
      const active=link.getAttribute('href')==='#'+visible.target.id;
      link.classList.toggle('is-active',active);
      if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
  },{rootMargin:'-18% 0px -62% 0px',threshold:[0,.1,.25,.5]});
  navTargets.forEach(target=>activeObserver.observe(target));
}


// Personal settings add-on. Settings are local to each visitor's browser.
(function personalSettings(){
  const $ = id => document.getElementById(id);
  const backdrop=$('settingsBackdrop');
  if(!backdrop) return;
  const video=document.querySelector('.bg-video');
  const source=video ? video.querySelector('source') : null;
  const videoOptions={
    zen:'https://moewalls.com/wp-content/uploads/preview/2026/zen-palace-japanese-red-maple-preview.webm',
    meadow:'https://moewalls.com/wp-content/uploads/preview/2026/lone-tree-meadow-preview.webm',
    cars:'https://moewalls.com/wp-content/uploads/preview/2026/nissan-gtr-r35-x-mclaren-720s-spider-preview.webm',
    knight:'https://moewalls.com/wp-content/uploads/preview/2026/knight-red-cloak-preview.webm',
    rainyPetals:'https://moewalls.com/wp-content/uploads/preview/2026/rainy-petals-neverness-to-everness-nte-preview.webm',
    none:''
  };
  const isMobilePerf=window.matchMedia("(max-width: 700px), (prefers-reduced-motion: reduce)").matches;
  const defaults={background:'zen',theme:'red',effect:'sakura',glow:!isMobilePerf,tilt:!isMobilePerf};
  let settings={...defaults};
  try{const saved=JSON.parse(localStorage.getItem('dp-personal-settings')||'{}');settings={...defaults,...saved};if(isMobilePerf && !localStorage.getItem('dp-video-mobile-fix-v1')){if(settings.background==='none')settings.background='zen';localStorage.setItem('dp-video-mobile-fix-v1','1');}if(isMobilePerf && !Object.prototype.hasOwnProperty.call(saved,'background'))settings.background='zen';if(isMobilePerf && !Object.prototype.hasOwnProperty.call(saved,'glow'))settings.glow=false;if(isMobilePerf && !Object.prototype.hasOwnProperty.call(saved,'tilt'))settings.tilt=false;}catch(e){}
  let lyricSets={};
  const lyricContent=$('lyricsContent');
  const lyricsTrackName=$('lyricsTrackName');
  const lrcStatus=$('lrcStatus');
  const lyricStorageKey='dp-local-lyrics-v1';
  try{lyricSets=JSON.parse(localStorage.getItem(lyricStorageKey)||'{}')}catch(e){}
  function applySettings(){
    document.body.dataset.theme=settings.theme;
    document.body.classList.toggle('glow-off',!settings.glow);
    document.body.classList.toggle('tilt-off',!settings.tilt);
    document.body.classList.toggle('effects-off',settings.effect==='none');
    $('backgroundChoice').value=settings.background;
    $('themeChoice').value=settings.theme;
    $('effectChoice').value=settings.effect;
    $('glowChoice').checked=!!settings.glow;
    $('tiltChoice').checked=!!settings.tilt;
    if(video && source){
      const url=videoOptions[settings.background]||videoOptions.zen;
      video.classList.toggle('is-hidden',!url);
      if(url && source.getAttribute('src')!==url){source.setAttribute('src',url);video.preload='metadata';video.load();}
      if(url){video.muted=true;const tryPlay=()=>video.play().catch(()=>{});if(video.readyState>=2)tryPlay();else video.addEventListener('loadeddata',tryPlay,{once:true});}
      if(!url) video.pause();
    }
    makeEffects(settings.effect);
    try{localStorage.setItem('dp-personal-settings',JSON.stringify(settings))}catch(e){}
    renderLyrics();
  }
  function makeEffects(type){
    const layer=$('petals'); if(!layer)return;
    layer.innerHTML=''; layer.classList.remove('effect-sweep');
    if(type==='none')return;
    // Enough particles to feel immersive, but capped to keep mobile scrolling smooth.
    const symbols={hearts:'♥',stars:'✦',sakura:'🌸'};
    // Sakura blossoms fall gently across the screen.
    const count=type==='sakura'?(isMobilePerf?7:14):type==='snow'?(isMobilePerf?18:38):(isMobilePerf?15:32);
    const fragment=document.createDocumentFragment();
    for(let i=0;i<count;i++){
      const p=document.createElement('span');p.className='petal';
      if(type==='sakura'){p.classList.add('effect-sakura');p.textContent='🌸';}
      else if(type==='hearts'||type==='stars'){p.classList.add(type==='hearts'?'effect-heart':'effect-stars');p.textContent=symbols[type];}
      else if(type==='maple')p.classList.add('effect-maple');
      else if(type==='snow')p.classList.add('effect-snow');
      else if(type==='embers')p.classList.add('effect-embers');
      p.style.left=Math.random()*96+'%';
      p.style.top='-30px';
      p.style.animationDuration=(type==='sakura'?(isMobilePerf?8:7):(isMobilePerf?10:8))+Math.random()*(type==='sakura'?(isMobilePerf?6:7):(isMobilePerf?9:10))+'s';
      p.style.animationDelay=(-Math.random()*14)+'s';
      p.style.transform=`scale(${.65+Math.random()*.75})`;p.style.opacity=.35+Math.random()*.55;
      if(type==='hearts'||type==='stars')p.style.fontSize=(12+Math.random()*16)+'px';
      if(type==='sakura')p.style.fontSize=(18+Math.random()*(isMobilePerf?8:14))+'px';
      fragment.appendChild(p);
    }
    layer.appendChild(fragment);
    // A single lightweight sweep communicates the change without animating the whole page.
    void layer.offsetWidth;
    layer.classList.add('effect-sweep');
    window.setTimeout(()=>layer.classList.remove('effect-sweep'),760);
  }
  function parseLrc(text){
    const lines=[];for(const row of text.split(/\r?\n/)){
      const matches=[...row.matchAll(/\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g)];
      const lyric=row.replace(/\[[^\]]+\]/g,'').trim(); if(!lyric)continue;
      matches.forEach(m=>{const fraction=m[3]?Number('0.'+m[3]):0;lines.push({time:Number(m[1])*60+Number(m[2])+fraction,text:lyric})});
    }
    return lines.sort((a,b)=>a.time-b.time);
  }
  function renderLyrics(){
    const trackName=(typeof index!=='undefined' && playlist[index])?playlist[index].title:'Phong';
    if(lyricsTrackName)lyricsTrackName.textContent=trackName;
    const lines=lyricSets[trackName]||[];
    if(!lines.length){lyricContent.innerHTML='Chưa có lời đồng bộ cho bài này.<br><small>Mở Cài đặt để nạp tệp lời bài hát .LRC của bạn.</small>';return;}
    const now=(typeof audio!=='undefined' && Number.isFinite(audio.currentTime))?audio.currentTime:0;
    let active=-1;for(let i=0;i<lines.length;i++){if(lines[i].time<=now)active=i;else break;}
    const from=Math.max(0,active-1),to=Math.min(lines.length,active+3);
    lyricContent.innerHTML='';
    for(let i=from;i<to;i++){const line=document.createElement('span');line.className='lyric-line'+(i===active?' active':'');line.textContent=lines[i].text;lyricContent.appendChild(line);}
    if(active<0)lyricContent.textContent=lines[0].text;
  }
  $('openSettings').addEventListener('click',()=>{backdrop.classList.add('open');backdrop.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';});
  function closeSettings(){backdrop.classList.remove('open');backdrop.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  $('closeSettings').addEventListener('click',closeSettings);
  backdrop.addEventListener('click',e=>{if(e.target===backdrop)closeSettings()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSettings()});
  $('backgroundChoice').addEventListener('change',e=>{settings.background=e.target.value;applySettings()});
  $('themeChoice').addEventListener('change',e=>{settings.theme=e.target.value;applySettings()});
  $('effectChoice').addEventListener('change',e=>{settings.effect=e.target.value;applySettings()});
  $('glowChoice').addEventListener('change',e=>{settings.glow=e.target.checked;applySettings()});
  $('tiltChoice').addEventListener('change',e=>{settings.tilt=e.target.checked;applySettings()});
  $('resetSettings').addEventListener('click',()=>{settings={...defaults};applySettings()});
  $('lrcUpload').addEventListener('change',async e=>{
    const file=e.target.files&&e.target.files[0];if(!file)return;
    try{const parsed=parseLrc(await file.text());if(!parsed.length){lrcStatus.textContent='Không tìm thấy mốc thời gian trong tệp LRC.';return;}
      const currentTrack=(typeof index!=='undefined'&&playlist[index])?playlist[index].title:'Phong';lyricSets[currentTrack]=parsed;
      try{localStorage.setItem(lyricStorageKey,JSON.stringify(lyricSets));lrcStatus.textContent=`Đã nạp ${parsed.length} dòng lời cho “${currentTrack}”.`;}
      catch(err){lrcStatus.textContent='Đã nạp trong phiên này; trình duyệt không cho phép lưu lâu dài.';}
      renderLyrics();
    }catch(err){lrcStatus.textContent='Không đọc được tệp lời bài hát.';}
  });
  if(typeof audio!=='undefined')audio.addEventListener('timeupdate',renderLyrics);
  if(typeof audio!=='undefined')audio.addEventListener('loadedmetadata',renderLyrics);
  document.querySelectorAll('.track').forEach(t=>t.addEventListener('click',()=>setTimeout(renderLyrics,0)));
  applySettings();
})();


// Added interactive sections: gallery lightbox, editable countdown, local guestbook, secret note.
(function addedFeatures(){
  const $=id=>document.getElementById(id);
  // Album sách: mỗi lần lật hiện một trang đôi, có chuyển cảnh nhẹ.
  const albumGrid=$('memories')?.querySelector('.memory-grid');
  if(albumGrid){
    const albumCards=[...albumGrid.querySelectorAll('.memory-card')];
    const prev=$('albumPrev'),next=$('albumNext'),count=$('albumPageCount'),cover=$('albumCover'),closeBook=$('albumCloseBook');
    const book=$('memories')?.querySelector('.memory-book');
    const controls=$('memories')?.querySelector('.album-controls');
    const perPage=2; let albumPage=0; const pageTotal=Math.max(1,Math.ceil(albumCards.length/perPage));
    function openAlbum(){
      if(!book||book.classList.contains('is-open'))return;
      book.classList.remove('is-closing'); book.classList.add('is-open'); cover?.setAttribute('aria-expanded','true');
      cover?.setAttribute('aria-label','Quyển album đã mở');
      if(controls)controls.setAttribute('aria-hidden','false');
      if(closeBook)closeBook.hidden=false;
    }
    function closeAlbum(){
      if(!book||!book.classList.contains('is-open'))return;
      book.classList.add('is-closing'); cover?.setAttribute('aria-expanded','false');
      cover?.setAttribute('aria-label','Mở quyển album kỷ niệm');
      if(controls)controls.setAttribute('aria-hidden','true');
      window.setTimeout(()=>{book.classList.remove('is-open','is-closing'); if(closeBook)closeBook.hidden=true;},1400);
    }
    cover?.addEventListener('click',openAlbum); closeBook?.addEventListener('click',closeAlbum);
    if(closeBook)closeBook.hidden=true;
    function renderAlbum(direction=''){
      // Capture the page being left and animate it as a physical sheet rotating around the book spine.
      albumGrid.querySelectorAll('.album-flip-sheet').forEach(node=>node.remove());
      const oldCards=albumCards.filter((card)=>!card.hidden);
      if(direction && book && oldCards.length){
        // A real-looking single page turns around the center fold; do not rotate the whole spread.
        const turningCard = direction==='prev' ? oldCards[0] : (oldCards[1] || oldCards[0]);
        const sheet=document.createElement('div');
        sheet.className='album-flip-sheet'+(direction==='prev'?' flip-back':'');
        const clone=turningCard.cloneNode(true); clone.hidden=false; clone.classList.remove('reveal'); clone.removeAttribute('id');
        sheet.appendChild(clone);
        book.appendChild(sheet);
        sheet.addEventListener('animationend',()=>sheet.remove(),{once:true});
        window.setTimeout(()=>sheet.remove(),1500);
      }
      albumCards.forEach((card,i)=>{card.hidden=Math.floor(i/perPage)!==albumPage;});
      if(count)count.textContent=`Trang ${albumPage+1} / ${pageTotal}`;
      if(prev)prev.disabled=albumPage===0;if(next)next.disabled=albumPage>=pageTotal-1;
    }
    prev?.addEventListener('click',()=>{if(albumPage>0){albumPage--;renderAlbum('prev');}});
    next?.addEventListener('click',()=>{if(albumPage<pageTotal-1){albumPage++;renderAlbum('next');}});
    renderAlbum();
  }
  // Gallery lightbox
  const lightbox=$('memoryLightbox'), lightImg=$('lightboxImage'), lightCaption=$('lightboxCaption');
  document.querySelectorAll('.memory-card').forEach(card=>card.addEventListener('click',()=>{lightImg.src=card.dataset.full;lightCaption.textContent=card.dataset.caption||'';lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}));
  function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  $('closeMemory').addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox()});
  // Countdown date is adjustable and saved locally per browser.
  const dateInput=$('examDate');try{dateInput.value='2027-06-11'}catch(e){}
  function tickCountdown(){const target=new Date(dateInput.value+'T07:30:00+07:00');if(!dateInput.value||Number.isNaN(target.getTime()))return;let ms=target.getTime()-Date.now();if(ms<=0){$('daysLeft').textContent='0';$('hoursLeft').textContent='00';$('minsLeft').textContent='00';$('secsLeft').textContent='00';$('countdownMessage').textContent='Ngày mục tiêu đã đến — bạn đã cố gắng hết mình!';return;}const d=Math.floor(ms/86400000);ms%=86400000;const h=Math.floor(ms/3600000);ms%=3600000;const m=Math.floor(ms/60000);const s=Math.floor((ms%60000)/1000);$('daysLeft').textContent=d;$('hoursLeft').textContent=String(h).padStart(2,'0');$('minsLeft').textContent=String(m).padStart(2,'0');$('secsLeft').textContent=String(s).padStart(2,'0');$('countdownMessage').textContent='Ngày thi: 11/06/2027 lúc 07:30 · Mục tiêu: Đỗ Nguyện vọng 1';}
  dateInput.addEventListener('change',()=>{try{localStorage.setItem('dp-exam-date',dateInput.value)}catch(e){}tickCountdown()});tickCountdown();setInterval(tickCountdown,1000);
  // Guestbook stays local to this browser; escape user text via textContent.
  const key='dp-guestbook-v1';let messages=[];try{messages=JSON.parse(localStorage.getItem(key)||'[]')}catch(e){}
  const list=$('guestbookList');function drawMessages(){list.innerHTML='';messages.slice().reverse().forEach(m=>{const article=document.createElement('article');article.className='guest-message';const name=document.createElement('b');name.textContent=m.name;const body=document.createElement('p');body.textContent=m.message;const time=document.createElement('time');time.textContent=m.date;article.append(name,body,time);list.appendChild(article)});}
  drawMessages();const guestForm=$('guestbookForm'),sentAnimation=$('letterSentAnimation');let sentAnimationTimer;guestForm.addEventListener('submit',e=>{e.preventDefault();const name=$('guestName').value.trim(),message=$('guestMessage').value.trim();if(!name||!message)return;messages.push({name,message,date:new Date().toLocaleDateString('vi-VN')});messages=messages.slice(-30);try{localStorage.setItem(key,JSON.stringify(messages))}catch(e){}drawMessages();e.target.reset();if(sentAnimation){clearTimeout(sentAnimationTimer);sentAnimation.classList.remove('play');sentAnimation.setAttribute('aria-hidden','false');void sentAnimation.offsetWidth;sentAnimation.classList.add('play');sentAnimationTimer=setTimeout(()=>{sentAnimation.classList.remove('play');sentAnimation.setAttribute('aria-hidden','true')},3300);}});
  // Secret room: choose one of three letters to reveal a small personal message.
  const modal=$('secretModal'),secretMessage=$('secretMessage');
  const secretNotes=[
    'Dành cho hôm nay: Bạn không cần làm mọi thứ thật hoàn hảo. Chỉ cần bắt đầu, rồi tiến thêm một bước nhỏ là đã đáng tự hào rồi. ✨',
    'Dành cho ngày mai: Mong bạn gặp một điều tử tế bất ngờ, cười thật nhiều và nhớ rằng luôn có những ngày tốt đẹp đang chờ phía trước. 🌷',
    'Dành cho Phong của tương lai: Cảm ơn bạn vì đã không bỏ cuộc. Hãy nhìn lại quãng đường đã đi và tự hào về chính mình nhé. 💌'
  ];
  function openSecret(){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
  function closeSecret(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
  $('secretButton').addEventListener('click',openSecret);$('closeSecret').addEventListener('click',closeSecret);$('secretOkay').addEventListener('click',closeSecret);
  document.querySelectorAll('.secret-envelope-choice').forEach((button)=>button.addEventListener('click',()=>{document.querySelectorAll('.secret-envelope-choice').forEach(b=>b.classList.remove('selected'));button.classList.add('selected');secretMessage.hidden=false;secretMessage.classList.remove('message-reveal');secretMessage.textContent=secretNotes[Number(button.dataset.secret)]||secretNotes[0];void secretMessage.offsetWidth;secretMessage.classList.add('message-reveal');}));
  modal.addEventListener('click',e=>{if(e.target===modal)closeSecret()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeLightbox();closeSecret()}});
})();


// Interactive upgrades: visualizer, Pomodoro, future letter, secret quest.
(function nextUpgrades(){
  const $=id=>document.getElementById(id);
  // Decorative visualizer deliberately avoids Web Audio routing so it cannot silence playback on mobile browsers.
  const canvas=$('audioVisualizer'), visualState=$('visualizerState');
  if(canvas){const ctx=canvas.getContext('2d');let phase=0;
    function sizeCanvas(){const dpr=window.devicePixelRatio||1;canvas.width=Math.max(300,canvas.clientWidth)*dpr;canvas.height=Math.max(60,canvas.clientHeight)*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
    sizeCanvas();window.addEventListener('resize',sizeCanvas);
    function draw(){if(document.hidden){requestAnimationFrame(draw);return;}const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);const bars=48,gap=3,bw=(w-gap*(bars-1))/bars;phase+=audio.paused?0.018:0.11;for(let i=0;i<bars;i++){const wave=(Math.sin(i*.48+phase)+1)/2;const pulse=(Math.sin(i*.17-phase*.7)+1)/2;const v=audio.paused?0.12+wave*.12:0.18+wave*.55+pulse*.18;const bh=Math.max(3,Math.min(h-8,v*(h-8)));ctx.fillStyle=`rgba(220,45,65,${.45+v*.5})`;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(i*(bw+gap),h-bh,bw,bh,3);else ctx.rect(i*(bw+gap),h-bh,bw,bh);ctx.fill()}requestAnimationFrame(draw)}
    draw();audio.addEventListener('play',()=>{visualState.textContent='Đang phát nhạc'});audio.addEventListener('pause',()=>{visualState.textContent='Đã tạm dừng'});audio.addEventListener('ended',()=>{visualState.textContent='Bài hát kết thúc'});
  }
  // Pomodoro timer with pause/resume and editable durations.
  let breakMode=false,running=false,remaining=25*60,timer=null;
  const display=$('pomodoroDisplay'),start=$('pomodoroStart'),mode=$('pomodoroMode');
  function durationForMode(){const n=Number($(breakMode?'breakMinutes':'studyMinutes').value);return Math.max(1,Math.min(breakMode?60:120,Number.isFinite(n)?n:(breakMode?5:25)))*60}
  function showTime(){display.textContent=String(Math.floor(remaining/60)).padStart(2,'0')+':'+String(remaining%60).padStart(2,'0')}
  function stopTimer(){running=false;clearInterval(timer);timer=null;start.textContent='▶ Bắt đầu'}
  function beginTimer(){if(running){stopTimer();return}if(remaining<=0)remaining=durationForMode();running=true;start.textContent='Ⅱ Tạm dừng';timer=setInterval(()=>{remaining--;showTime();if(remaining<=0){stopTimer();$('focusQuote').textContent=breakMode?'Hết giờ nghỉ — sẵn sàng học tiếp nhé!':'Hoàn thành một phiên tập trung! Hãy nghỉ một chút nhé.';try{if('Notification'in window&&Notification.permission==='granted')new Notification('Pomodoro',{body:breakMode?'Hết giờ nghỉ!':'Bạn đã hoàn thành phiên học!'})}catch(e){}remaining=durationForMode();showTime()}},1000)}
  start.addEventListener('click',beginTimer);$('pomodoroReset').addEventListener('click',()=>{stopTimer();remaining=durationForMode();showTime()});$('pomodoroModeBtn').addEventListener('click',()=>{stopTimer();breakMode=!breakMode;mode.textContent=breakMode?'Thời gian nghỉ':'Thời gian tập trung';$('pomodoroModeBtn').textContent=breakMode?'Chuyển sang học':'Chuyển sang nghỉ';remaining=durationForMode();showTime()});['studyMinutes','breakMinutes'].forEach(id=>$(id).addEventListener('change',()=>{if(!running){remaining=durationForMode();showTime()}}));showTime();
  // Future letter is private to this browser and hidden until its chosen date.
  const letterForm=$('futureLetterForm'), date=$('letterDate'), text=$('letterText'), status=$('letterStatus'), reveal=$('letterReveal');
  const letterKey='dp-future-letter-v1';let saved=null;try{saved=JSON.parse(localStorage.getItem(letterKey)||'null')}catch(e){}
  function refreshLetter(){if(!saved){status.textContent='Lá thư được lưu riêng trên trình duyệt này.';return}date.value=saved.date;text.value=saved.text;const now=new Date();now.setHours(0,0,0,0);const target=new Date(saved.date+'T00:00:00');if(now>=target){reveal.hidden=false;reveal.textContent='Lá thư của bạn, viết ngày '+new Date(saved.savedAt).toLocaleDateString('vi-VN')+':\n\n'+saved.text;status.textContent='Đã đến ngày mở thư.'}else{reveal.hidden=true;status.textContent='Lá thư đã được khóa đến '+new Date(saved.date+'T00:00:00').toLocaleDateString('vi-VN')+'.'}}
  if(saved)refreshLetter();else{const tomorrow=new Date();tomorrow.setDate(tomorrow.getDate()+1);date.value=tomorrow.toISOString().slice(0,10)}
  letterForm.addEventListener('submit',e=>{e.preventDefault();if(!date.value||!text.value.trim())return;if(new Date(date.value+'T00:00:00')<new Date(new Date().toDateString())){status.textContent='Hãy chọn ngày hôm nay hoặc một ngày trong tương lai.';return}saved={date:date.value,text:text.value.trim(),savedAt:new Date().toISOString()};try{localStorage.setItem(letterKey,JSON.stringify(saved));refreshLetter()}catch(err){status.textContent='Trình duyệt không cho phép lưu lá thư.'}});
  // Little Secret Quest: collect three map marks to unlock a cinematic keepsake.
  const missionKey='dp-secret-mission-v2';let found=[];try{found=JSON.parse(sessionStorage.getItem(missionKey)||'[]')}catch(e){}
  const stars=[...document.querySelectorAll('.mission-star')], missionStatus=$('missionStatus'), reward=$('missionReward'), count=$('missionCount'), fill=$('questProgressFill'), lock=$('questLock');
  const clues=['Dấu ấn đầu tiên: đôi khi điều nhỏ bé nhất cũng dẫn đến một điều đáng nhớ.','Bạn đã tìm thấy dấu ấn thứ hai — bí mật này đang dần hé mở.','Dấu ấn cuối cùng đã được tìm thấy. Chiếc hộp kỷ niệm đang mở ra…'];
  function updateMission(){stars.forEach((b,i)=>{b.classList.toggle('found',found.includes(i));b.disabled=found.includes(i)});if(count)count.textContent=`${found.length} / 3 FOUND`;if(fill)fill.style.width=`${found.length/3*100}%`;if(found.length===3){reward.hidden=false;lock?.classList.add('unlocked');missionStatus.textContent='Đủ ba dấu ấn. Bí mật đã được mở khóa.';}else{reward.hidden=true;missionStatus.textContent=found.length?clues[found.length-1]: 'Chạm vào những ánh sao ẩn trên bản đồ để lần theo manh mối.';}}
  stars.forEach((b,i)=>b.addEventListener('click',()=>{if(found.includes(i))return;found.push(i);try{sessionStorage.setItem(missionKey,JSON.stringify(found))}catch(e){}updateMission();if(found.length===3){lock?.classList.remove('unlocking');void lock?.offsetWidth;lock?.classList.add('unlocking');}}));
  $('questReplay')?.addEventListener('click',()=>{found=[];try{sessionStorage.removeItem(missionKey)}catch(e){}lock?.classList.remove('unlocked','unlocking');updateMission()});updateMission();
})();
