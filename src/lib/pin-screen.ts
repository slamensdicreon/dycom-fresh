/**
 * The site PIN screen, as a self-contained HTML document the proxy returns for every locked page.
 * It is deliberately not a Next.js page: a page would carry the app's not-found tree (with the
 * site's navigation) in its payload. Everything here is inline except the fonts, logo and backdrop
 * photo in public/gate-assets/, which the gate leaves open.
 *
 * The background is a blurred impression of the site — photo, header bar, headline — never the
 * real page, so nothing behind the gate is sent before the PIN is right.
 */
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const CSS = `
@font-face{font-family:"Dycom Fjalla";src:url(/gate-assets/FjallaOne.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:"Dycom Geist";src:url(/gate-assets/Geist.woff2) format("woff2");font-weight:100 900;font-display:swap}
:root{--civic:#041054;--civic-2:#1b2a72;--green:#00b609;--ink:#354846;--rule:#c1c6c8;--display:"Dycom Fjalla","Fjalla One",Impact,sans-serif;--body:"Dycom Geist","Geist",Arial,sans-serif}
*,*::before,*::after{box-sizing:border-box;border-radius:0}
html,body{margin:0;height:100%;background:var(--civic)}
body{font-family:var(--body);color:var(--ink);overflow:hidden}
.bd{position:fixed;inset:-40px;filter:blur(18px) saturate(1.05);transform:scale(1.04)}
.bd-photo{position:absolute;inset:0;background:linear-gradient(100deg,rgba(4,16,84,.92),rgba(4,16,84,.55) 60%,rgba(4,16,84,.25)),url(/gate-assets/backdrop.webp) center/cover}
.bd-bar{position:absolute;top:40px;left:0;right:0;height:88px;background:#fff;display:flex;align-items:center;gap:28px;padding:0 calc(40px + 5vw)}
.bd-bar span{display:block;width:92px;height:12px;background:#c9cdd8}
.bd-bar .logo{width:150px;height:26px;background:var(--civic);margin-right:auto}
.bd-bar .cta{width:132px;height:46px;background:var(--civic);margin-left:24px}
.bd-hero{position:absolute;left:calc(40px + 5vw);top:34%;display:flex;flex-direction:column;gap:22px}
.bd-hero p{margin:0;font-family:var(--display);text-transform:uppercase;color:#fff;font-size:clamp(72px,11vw,180px);line-height:.9}
.bd-hero em{font-style:normal;color:var(--green)}
.bd-kick{display:block;width:220px;height:12px;background:var(--green)}
.bd-line{display:block;width:min(640px,60vw);height:14px;background:rgba(255,255,255,.7)}
.bd-line.short{width:min(420px,40vw)}
.scrim{position:fixed;inset:0;background:rgba(4,16,84,.38)}
.stage{position:fixed;inset:0;display:grid;place-items:center;padding:24px 16px;overflow-y:auto}
.panel{width:min(440px,100%);background:rgba(255,255,255,.97);border-top:6px solid var(--green);box-shadow:0 30px 80px rgba(3,11,58,.45);padding:clamp(28px,6vw,44px) clamp(22px,6vw,44px) clamp(26px,5vw,40px);display:flex;flex-direction:column;gap:14px;animation:in .42s cubic-bezier(.22,1,.36,1) both}
.panel img{display:block;width:132px;height:auto;margin-bottom:10px}
h1{margin:0;font-family:var(--display);font-weight:400;text-transform:uppercase;color:var(--civic);font-size:clamp(34px,6vw,42px);line-height:1}
.desc{margin:0;font-size:15.5px;line-height:1.5}
form{display:flex;flex-direction:column;gap:14px;margin:10px 0 0}
fieldset{border:0;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;min-width:0}
legend{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
fieldset input{width:100%;height:76px;border:2px solid var(--rule);background:#fff;text-align:center;font:400 40px/1 var(--display);color:var(--civic);caret-color:var(--green);transition:border-color .15s,box-shadow .15s;-webkit-text-security:disc;padding:0}
fieldset input.filled{border-color:var(--civic)}
fieldset input:focus{outline:none;border-color:var(--civic);box-shadow:0 0 0 3px var(--green)}
fieldset input[aria-invalid=true]{border-color:#a1001a}
fieldset:disabled input{background:#f4f5f7}
.shake{animation:shake .42s ease}
.status{margin:0;min-height:22px;font-size:14.5px;font-weight:500;color:var(--civic)}
.status.err{color:#a1001a;font-weight:600}
button{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:52px;border:2px solid var(--civic);background:var(--civic);color:#fff;font:600 16px var(--body);cursor:pointer}
button:hover:not(:disabled){background:var(--civic-2);border-color:var(--civic-2)}
button:focus-visible{outline:3px solid var(--green);outline-offset:2px}
button:disabled{opacity:.45;cursor:default}
@keyframes in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes shake{0%,100%{transform:none}20%{transform:translateX(-10px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(4px)}}
@media (max-width:420px){fieldset{gap:8px}fieldset input{height:64px;font-size:34px}}
@media (prefers-reduced-motion:reduce){.panel,.shake{animation:none}}
`;

/* Four boxes: typing advances, Backspace goes back, a pasted PIN fills all four, the fourth digit
   submits. Without script the boxes post as a plain form (d0–d3) and the server redirects. */
const SCRIPT = `
(function(){
  var form=document.getElementById('pin-form');if(!form)return;
  var fs=form.querySelector('fieldset'),boxes=[].slice.call(fs.querySelectorAll('input')),btn=form.querySelector('button'),st=document.getElementById('pin-status');
  var nextUrl=form.elements.next.value,busy=false;
  var MSG={checking:'Checking\\u2026',wrong:'That PIN didn\\u2019t work. Try again.',locked:'Too many attempts. Wait a minute, then try again.',ok:'Unlocked. Opening\\u2026',error:'Something went wrong. Try again.'};
  function say(k){st.textContent=k?MSG[k]:'';st.className='status'+(k==='wrong'||k==='locked'||k==='error'?' err':'');boxes.forEach(function(b){if(k==='wrong'||k==='locked')b.setAttribute('aria-invalid','true');else b.removeAttribute('aria-invalid')});}
  function val(){return boxes.map(function(b){return b.value}).join('')}
  function sync(){boxes.forEach(function(b){b.classList.toggle('filled',!!b.value)});btn.disabled=busy||val().length<4}
  function focus(i){var b=boxes[Math.max(0,Math.min(3,i))];b.focus();b.select()}
  function fill(text,from){var d=(text||'').replace(/\\D/g,'').slice(0,4-from).split('');if(!d.length)return;d.forEach(function(c,k){boxes[from+k].value=c});sync();focus(from+d.length);if(val().length===4)submit()}
  function reset(k){fs.classList.remove('shake');void fs.offsetWidth;fs.classList.add('shake');boxes.forEach(function(b){b.value=''});busy=false;fs.disabled=k==='locked';sync();say(k);if(k==='locked'){setTimeout(function(){fs.disabled=false;say('');focus(0)},60000)}else focus(0)}
  function submit(){var pin=val();if(busy||!/^\\d{4}$/.test(pin))return;busy=true;fs.disabled=true;sync();say('checking');
    fetch('/api/site-pin/',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pin:pin}),credentials:'same-origin'})
      .then(function(r){return r.json().catch(function(){return{}}).then(function(d){return{r:r,d:d}})})
      .then(function(x){if(x.r.ok&&x.d.ok){say('ok');var p=location.pathname;location.replace(p==='/gate/'||p==='/gate'?nextUrl:location.href);return}reset(x.d.error==='locked'?'locked':x.r.status===401?'wrong':'error')})
      .catch(function(){reset('error')});}
  boxes.forEach(function(b,i){
    b.addEventListener('input',function(){var v=b.value.replace(/\\D/g,'');if(v.length>1){b.value='';fill(v,i);return}b.value=v;sync();if(st.className.indexOf('err')>-1&&!fs.disabled)say('');if(v&&i<3)focus(i+1);if(val().length===4)submit()});
    b.addEventListener('keydown',function(e){if(e.key==='Backspace'&&!b.value&&i>0){e.preventDefault();boxes[i-1].value='';sync();focus(i-1)}else if(e.key==='ArrowLeft'){e.preventDefault();focus(i-1)}else if(e.key==='ArrowRight'){e.preventDefault();focus(i+1)}});
    b.addEventListener('paste',function(e){e.preventDefault();fill((e.clipboardData||window.clipboardData).getData('text'),0)});
    b.addEventListener('focus',function(){b.select()});
  });
  form.addEventListener('submit',function(e){e.preventDefault();submit()});
  sync();focus(0);
})();
`;

export function pinScreenHtml({ next, error, configured }: { next: string; error?: 'wrong' | 'locked'; configured: boolean }): string {
  const message = error === 'locked' ? 'Too many attempts. Wait a minute, then try again.' : error ? 'That PIN didn’t work. Try again.' : '';
  const box = (i: number) =>
    `<input name="d${i}" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="${i === 0 ? 4 : 1}" autocomplete="${i === 0 ? 'one-time-code' : 'off'}" aria-label="Digit ${i + 1} of 4"${error ? ' aria-invalid="true"' : ''}>`;
  const form = configured
    ? `<form id="pin-form" method="post" action="/api/site-pin/">
  <input type="hidden" name="next" value="${esc(next)}">
  <fieldset aria-describedby="pin-status"><legend>4-digit PIN</legend>${[0, 1, 2, 3].map(box).join('')}</fieldset>
  <p id="pin-status" class="status${error ? ' err' : ''}" role="status" aria-live="polite">${message}</p>
  <button type="submit">Unlock <span aria-hidden="true">→</span></button>
</form>`
    : `<p class="status err" role="alert">The site PIN is not set. Add SITE_PIN (four digits) to the project’s environment variables.</p>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#041054">
<title>Enter PIN · Dycom</title>
<link rel="icon" href="/icon.png">
<link rel="preload" href="/gate-assets/FjallaOne.woff2" as="font" type="font/woff2" crossorigin>
<style>${CSS}</style>
</head>
<body>
<div class="bd" aria-hidden="true">
  <div class="bd-photo"></div>
  <div class="bd-bar"><span class="logo"></span><span></span><span></span><span></span><span></span><span></span><span class="cta"></span></div>
  <div class="bd-hero"><span class="bd-kick"></span><p>Scale is <em>Local</em></p><span class="bd-line"></span><span class="bd-line short"></span></div>
</div>
<div class="scrim" aria-hidden="true"></div>
<main class="stage">
  <section class="panel" role="dialog" aria-modal="true" aria-labelledby="pin-title" aria-describedby="pin-desc">
    <img src="/gate-assets/logo.png" alt="Dycom" width="132" height="21">
    <h1 id="pin-title">Enter PIN</h1>
    <p id="pin-desc" class="desc">This preview of the new dycomind.com is private. Enter the 4-digit PIN to continue.</p>
    ${form}
  </section>
</main>
<script>${SCRIPT}</script>
</body>
</html>`;
}
