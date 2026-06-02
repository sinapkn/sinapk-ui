// ⬇️ کانفیگ‌های خود را اینجا قرار دهید ⬇️
const SUBSCRIPTION_CONFIGS = [
  "vmess://eyJ2IjoiMiIsInBzIjoiVGVzdCBTZXJ2ZXIgMSIsImFkZCI6ImV4YW1wbGUuY29tIiwicG9ydCI6IjQ0MyIsImlkIjoiYWJjZGVmZ2gtaWprbC1tbm9wLXFyc3QtdXZ3eHl6MTIzNDUiLCJhaWQiOiIwIiwic2N5IjoiYXV0byIsIm5ldCI6IndzIiwidHlwZSI6Im5vbmUiLCJob3N0IjoiIiwicGF0aCI6Ii8iLCJ0bHMiOiJ0bHMifQ==",
  "vless://test-uuid@example.com:443?security=tls&type=ws#Test%20Server%202"
];
// ⬆️ کانفیگ‌های خود را اینجا قرار دهید ⬆️

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // مسیر ساب
    if (path === '/sub' || path === '/sub.txt') {
      const content = SUBSCRIPTION_CONFIGS.join('\n');
      return new Response(content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }

    // مسیر اصلی - داشبورد
    return new Response(HTML_CONTENT, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>SINAPK Dashboard</title>
<style>
body{
  font-family:system-ui,-apple-system,sans-serif;
  background:#050d1f;
  color:#f0f9ff;
  padding:20px;
  margin:0;
}
.container{
  max-width:1200px;
  margin:0 auto;
}
.header{
  text-align:center;
  padding:40px 20px;
  background:rgba(56,189,248,.1);
  border-radius:20px;
  margin-bottom:20px;
}
.logo{
  font-size:48px;
  font-weight:900;
  background:linear-gradient(135deg,#7dd3fc,#22d3ee);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}
.stats{
  display:grid;
  grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
  gap:16px;
  margin-bottom:20px;
}
.stat{
  background:rgba(14,165,233,.1);
  padding:20px;
  border-radius:16px;
  text-align:center;
  border:1px solid rgba(125,211,252,.2);
}
.stat-num{
  font-size:32px;
  font-weight:900;
  color:#38bdf8;
}
.stat-label{
  font-size:12px;
  color:rgba(186,230,253,.7);
  margin-top:8px;
}
.cards{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:16px;
}
.card{
  background:rgba(14,165,233,.05);
  padding:20px;
  border-radius:16px;
  border:1px solid rgba(125,211,252,.15);
}
.card-title{
  font-size:18px;
  font-weight:700;
  margin-bottom:12px;
}
.card-info{
  display:flex;
  gap:12px;
  margin-bottom:16px;
  font-size:14px;
  color:rgba(186,230,253,.8);
}
.buttons{
  display:flex;
  gap:8px;
}
.btn{
  flex:1;
  padding:12px;
  border:none;
  border-radius:12px;
  cursor:pointer;
  font-weight:700;
  font-size:13px;
  transition:all .3s;
}
.btn-primary{
  background:linear-gradient(135deg,#38bdf8,#22d3ee);
  color:#050d1f;
}
.btn-secondary{
  background:rgba(14,165,233,.1);
  color:#f0f9ff;
  border:1px solid rgba(125,211,252,.2);
}
.btn:hover{
  transform:translateY(-2px);
}
.toast{
  position:fixed;
  bottom:20px;
  left:50%;
  transform:translateX(-50%);
  background:linear-gradient(135deg,#38bdf8,#22d3ee);
  color:#050d1f;
  padding:12px 24px;
  border-radius:100px;
  font-weight:700;
  opacity:0;
  pointer-events:none;
  transition:opacity .3s;
}
.toast.show{
  opacity:1;
}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="logo">SINAPK</div>
    <div style="margin-top:8px;color:rgba(186,230,253,.7)">Premium Dashboard</div>
  </div>
  
  <div class="stats">
    <div class="stat">
      <div class="stat-num" id="serverCount">0</div>
      <div class="stat-label">تعداد سرورها</div>
    </div>
    <div class="stat">
      <div class="stat-num" style="color:#22d3ee">آنلاین</div>
      <div class="stat-label">وضعیت</div>
    </div>
    <div class="stat">
      <div class="stat-num" id="lastUpdate" style="font-size:20px">--:--</div>
      <div class="stat-label">آخرین بروزرسانی</div>
    </div>
  </div>

  <div class="cards" id="cardsContainer">
    <div style="text-align:center;padding:40px;color:rgba(186,230,253,.5)">در حال بارگذاری...</div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
const SUB_URL = window.location.origin + '/sub';

function toast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2500);
}

function updateTime(){
  const now=new Date();
  document.getElementById('lastUpdate').textContent=
    String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
}
updateTime();
setInterval(updateTime,60000);

function loadServers(){
  fetch('/sub')
    .then(r=>r.text())
    .then(text=>{
      const lines=text.trim().split('\\n').filter(l=>l.trim());
      document.getElementById('serverCount').textContent=lines.length;
      
      if(!lines.length){
        document.getElementById('cardsContainer').innerHTML=
          '<div style="text-align:center;padding:40px;color:rgba(186,230,253,.5)">سروری یافت نشد</div>';
        return;
      }
      
      const html=lines.map((link,i)=>{
        let name='سرور '+(i+1);
        let protocol='نامشخص';
        let port='443';
        
        if(link.startsWith('vmess://')){
          try{
            const json=JSON.parse(atob(link.substring(8)));
            name=json.ps||name;
            protocol='VMess';
            port=json.port||port;
          }catch(e){}
        }else if(link.startsWith('vless://')){
          protocol='VLESS';
          const m=link.match(/#(.+)$/);
          if(m)name=decodeURIComponent(m[1]);
          const pm=link.match(/:(\\d+)\\?/);
          if(pm)port=pm[1];
        }else if(link.startsWith('trojan://')){
          protocol='Trojan';
          const m=link.match(/#(.+)$/);
          if(m)name=decodeURIComponent(m[1]);
        }else if(link.startsWith('ss://')){
          protocol='Shadowsocks';
          const m=link.match(/#(.+)$/);
          if(m)name=decodeURIComponent(m[1]);
        }
        
        return \`
          <div class="card">
            <div class="card-title">\${name}</div>
            <div class="card-info">
              <span>پروتکل: \${protocol}</span>
              <span>پورت: \${port}</span>
            </div>
            <div class="buttons">
              <button class="btn btn-primary" onclick="copyLink('\${btoa(link)}')">کپی لینک</button>
              <button class="btn btn-secondary" onclick="showQR('\${btoa(link)}')">QR کد</button>
            </div>
          </div>
        \`;
      }).join('');
      
      document.getElementById('cardsContainer').innerHTML=html;
    })
    .catch(err=>{
      console.error(err);
      document.getElementById('cardsContainer').innerHTML=
        '<div style="text-align:center;padding:40px;color:#ef4444">خطا در دریافت اطلاعات</div>';
    });
}

function copyLink(encoded){
  const link=atob(encoded);
  navigator.clipboard.writeText(link).then(()=>toast('لینک کپی شد'));
}

function showQR(encoded){
  const link=atob(encoded);
  const modal=document.createElement('div');
  modal.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;z-index:9999;';
  modal.innerHTML=\`
    <div style="background:white;padding:20px;border-radius:16px;text-align:center;">
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=\${encodeURIComponent(link)}" 
           style="display:block;margin-bottom:16px;">
      <button onclick="this.closest('div').parentElement.remove()" 
              style="padding:8px 16px;border:none;border-radius:8px;background:#38bdf8;color:#050d1f;cursor:pointer;">
        بستن
      </button>
    </div>
  \`;
  modal.onclick=e=>{if(e.target===modal)modal.remove()};
  document.body.appendChild(modal);
}

loadServers();
</script>
</body>
</html>`;
