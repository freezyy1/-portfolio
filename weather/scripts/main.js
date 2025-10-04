const $ = sel => document.querySelector(sel);
const pad = n => n.toString().padStart(2,'0');
const LOCALES = { ru:'ru-RU', en:'en-US', es:'es-ES' };
const locale = () => (LOCALES[store.lang] || 'en-US');
const fmtTime = (s) => new Date(s).toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'});
const fmtDay = (s) => new Date(s).toLocaleDateString(locale(),{weekday:'short', day:'2-digit', month:'short'});
const store = {
    get k(){return JSON.parse(localStorage.getItem('wv-favs')||'[]')},
    set k(v){localStorage.setItem('wv-favs',JSON.stringify(v))},
    get unit(){return localStorage.getItem('wv-unit')||'C'},
    set unit(v){localStorage.setItem('wv-unit',v)},
    get theme(){return localStorage.getItem('wv-theme')||'dark'},
    set theme(v){localStorage.setItem('wv-theme',v)},
    get lang(){return localStorage.getItem('wv-lang')||'ru'},
    set lang(v){localStorage.setItem('wv-lang',v)},
}

// ======= I18N =======
const I18N = {
  ru: {
    brandSubtitle: 'Погода и качество воздуха',
    searchPlaceholder: 'Поиск города (например: Berlin, Москва)',
    btnGeo: 'Мое местоположение',
    btnTheme: 'Тема',
    btnSave: 'В избранное',
    btnLang: 'RU',
    aqiTitle: 'Качество воздуха',
    mapTitle: 'Карта',
    hourlyTitle: 'Почасовой прогноз',
    dailyTitle: 'На 7 дней',
    lblWind: 'Ветер',
    lblHumid: 'Влажн.',
    lblPress: 'Давление',
    lblSunrise: 'Восход',
    lblSunset: 'Закат',
    noFavs: 'Добавьте города в избранное для быстрого доступа',
    toastSaved: 'Добавлено в избранное',
    toastExists: 'Уже в избранном',
    geoNotSupported: 'Геолокация не поддерживается',
    updatedAt: 'Обновлено',
    feelsLike: 'Ощущается как',
    uvIndex: 'UV индекс',
    chartTemp: 'Темп., °',
    aqiGood: 'Хорошо', aqiModerate: 'Умеренно', aqiUnhealthy: 'Вредно'
  },
  en: {
    brandSubtitle: 'Weather and air quality',
    searchPlaceholder: 'Search a city (e.g., Berlin, London)',
    btnGeo: 'My location',
    btnTheme: 'Theme',
    btnSave: 'Save favorite',
    btnLang: 'EN',
    aqiTitle: 'Air Quality',
    mapTitle: 'Map',
    hourlyTitle: 'Hourly forecast',
    dailyTitle: 'Next 7 days',
    lblWind: 'Wind',
    lblHumid: 'Humid.',
    lblPress: 'Pressure',
    lblSunrise: 'Sunrise',
    lblSunset: 'Sunset',
    noFavs: 'Add cities to favorites for quick access',
    toastSaved: 'Added to favorites',
    toastExists: 'Already in favorites',
    geoNotSupported: 'Geolocation is not supported',
    updatedAt: 'Updated',
    feelsLike: 'Feels like',
    uvIndex: 'UV Index',
    chartTemp: 'Temp, °',
    aqiGood: 'Good', aqiModerate: 'Moderate', aqiUnhealthy: 'Unhealthy'
  }
};

function t(key){ return (I18N[store.lang]||I18N.ru)[key] || key }
// языки
const SUPPORTED_LANGS = ['ru','en','es'];
function nextLang(cur){ const i=SUPPORTED_LANGS.indexOf(cur); return SUPPORTED_LANGS[(i+1)%SUPPORTED_LANGS.length] || 'ru'; }

function applyLanguage(){
  const controls = document.querySelector('.controls');
  let langBtn = document.getElementById('lang');
  if(!langBtn && controls){
    langBtn = document.createElement('button');
    langBtn.id='lang'; langBtn.className='btn';
    const saveBtn = document.getElementById('save');
    if(saveBtn){ controls.insertBefore(langBtn, saveBtn); } else { controls.appendChild(langBtn) }
    langBtn.addEventListener('click',()=>{ store.lang = nextLang(store.lang); applyLanguage(); if(last){ renderAll(last) } });
  }
  // Controls
  const q=$('#q'); if(q) q.placeholder = t('searchPlaceholder');
  const geo=$('#geo'); if(geo) geo.textContent = t('btnGeo');
  const theme=$('#theme'); if(theme) theme.textContent = t('btnTheme');
  const save=$('#save'); if(save) save.textContent = t('btnSave');
  const unit=$('#unit'); if(unit) unit.textContent = '°'+store.unit;
  if(langBtn) langBtn.textContent = t('btnLang');
  const sub=$('#subtitle'); if(sub) sub.textContent = t('brandSubtitle');
  const setPrevLabel = (id, text) => { const el=$(id); if(el && el.previousElementSibling) el.previousElementSibling.textContent = text };
  setPrevLabel('#wind', t('lblWind'));
  setPrevLabel('#humid', t('lblHumid'));
  setPrevLabel('#press', t('lblPress'));
  setPrevLabel('#sunrise', t('lblSunrise'));
  setPrevLabel('#sunset', t('lblSunset'));
  // Titles
  const aqiTitleEl = document.querySelector('.current .card .section-title > div:first-child'); if(aqiTitleEl) aqiTitleEl.textContent = t('aqiTitle');
  const mapTitleEl = document.querySelector('aside.card .section-title > div:first-child'); if(mapTitleEl) mapTitleEl.textContent = t('mapTitle');
  const hourlyTitleEl = document.querySelector('#hourly')?.closest('section')?.querySelector('.section-title > div:first-child'); if(hourlyTitleEl) hourlyTitleEl.textContent = t('hourlyTitle');
  const dailyTitleEl = document.querySelector('#daily')?.closest('section')?.querySelector('.section-title > div:first-child'); if(dailyTitleEl) dailyTitleEl.textContent = t('dailyTitle');
}

const I18N_OVERRIDE = {
  ru: {
    brandSubtitle: 'Погода и качество воздуха',
    searchPlaceholder: 'Поиск города (например: Berlin, Москва)',
    btnGeo: 'Мое местоположение',
    btnTheme: 'Тема',
    btnSave: 'В избранное',
    footerLine1: 'Портфолио‑демо. Данные: Open‑Meteo (погода) и Open‑Meteo Air Quality (AQI). Без ключей API.',
    footerLine2: 'Проект: <strong>WeatherVista</strong>. Сделано для портфолио.'
  },
  en: {
    brandSubtitle: 'Weather and air quality',
    searchPlaceholder: 'Search a city (e.g., Berlin, London)',
    btnGeo: 'My location',
    btnTheme: 'Theme',
    btnSave: 'Save favorite',
    footerLine1: 'portfolio demo. Data: Open‑Meteo (weather) and Open‑Meteo Air Quality (AQI). No API keys.',
    footerLine2: 'Project: <strong>WeatherVista</strong>. Built for portfolio.'
  },
  es: {
    brandSubtitle: 'Tiempo y calidad del aire',
    searchPlaceholder: 'Buscar ciudad (p. ej., Berlin, Madrid)',
    btnGeo: 'Mi ubicación',
    btnTheme: 'Tema',
    btnSave: 'Guardar favorito',
    btnLang: 'ES',
    aqiTitle: 'Calidad del aire',
    mapTitle: 'Mapa',
    hourlyTitle: 'Pronóstico por hora',
    dailyTitle: 'Próximos 7 días',
    lblWind: 'Viento',
    lblHumid: 'Humed.',
    lblPress: 'Presión',
    lblSunrise: 'Amanecer',
    lblSunset: 'Atardecer',
    noFavs: 'Añade ciudades a favoritos para acceso rápido',
    toastSaved: 'Añadido a favoritos',
    toastExists: 'Ya en favoritos',
    geoNotSupported: 'La geolocalización no es compatible',
    updatedAt: 'Actualizado',
    feelsLike: 'Sensación',
    uvIndex: 'Índice UV',
    chartTemp: 'Temp, °',
    aqiGood: 'Bueno', aqiModerate: 'Moderado', aqiUnhealthy: 'Perjudicial',
    footerLine1: 'Demo de porfolio. Datos: Open‑Meteo (tiempo) y Open‑Meteo Air Quality (AQI). Sin claves API.',
    footerLine2: 'Proyecto: <strong>WeatherVista</strong>. Hecho para porfolio.'
  }
};
try {
  Object.assign(I18N.ru, I18N_OVERRIDE.ru);
  Object.assign(I18N.en, I18N_OVERRIDE.en);
  if(!I18N.es) I18N.es = {};
  Object.assign(I18N.es, I18N_OVERRIDE.es);
} catch(_) {}
try{
  I18N.ru.headerPortfolio = 'Портфолио‑демо';
  I18N.en.headerPortfolio = "portfolio demo";
  I18N.es.headerPortfolio = 'Demo de porfolio';
}catch(_){}

const __origApplyLanguage = applyLanguage;
applyLanguage = function(){
  try{ __origApplyLanguage(); }catch(_){ }
  const unit=$('#unit'); if(unit) unit.textContent = '°'+store.unit;
  const footer=document.querySelector('.footer');
  if(footer){
    const lines=footer.querySelectorAll('div');
    if(lines[0]) lines[0].innerHTML = t('footerLine1');
    if(lines[1]) lines[1].innerHTML = t('footerLine2');
  }
  try{ renderFavs(); }catch(_){ }
}

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.style.display='block'; setTimeout(()=>t.style.display='none',2200) }

// тема
function applyTheme(){ document.body.classList.toggle('light', store.theme==='light'); }
$('#theme').addEventListener('click',()=>{ store.theme = store.theme==='light'?'dark':'light'; applyTheme(); })
$('#unit').addEventListener('click',()=>{ store.unit = store.unit==='C'?'F':'C'; $('#unit').textContent='°'+store.unit; if(last){ renderAll(last) } })
applyTheme(); $('#unit').textContent='°'+store.unit;

// отображение карты
let map = L.map('map',{ zoomControl:false, attributionControl:false }).setView([52.52,13.405], 9);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(map);
let marker = L.marker([52.52,13.405]).addTo(map);

// предустановленные карты
function getPresetCities(lang){
  const L = (lang||'ru');
  if(L==='ru'){
    return [
      {name:'Москва, RU', label:'Москва', lat:55.7558, lon:37.6176},
      {name:'London, GB', label:'Лондон', lat:51.5074, lon:-0.1278},
      {name:'Berlin, DE', label:'Берлин', lat:52.52, lon:13.405},
    ];
  }
  if(L==='es'){
    return [
      {name:'Москва, RU', label:'Moscú', lat:55.7558, lon:37.6176},
      {name:'London, GB', label:'Londres', lat:51.5074, lon:-0.1278},
      {name:'Berlin, DE', label:'Berlín', lat:52.52, lon:13.405},
    ];
  }
  return [
    {name:'Москва, RU', label:'Moscow', lat:55.7558, lon:37.6176},
    {name:'London, GB', label:'London', lat:51.5074, lon:-0.1278},
    {name:'Berlin, DE', label:'Berlin', lat:52.52, lon:13.405},
  ];
}

try{
  const suggestEl = document.getElementById('suggest');
  const inputEl = document.getElementById('q');
  const searchWrap = document.querySelector('.search');
  if(searchWrap && suggestEl && inputEl){
    const renderPresets = ()=>{
      const lang = store?.lang || 'ru';
      const cities = getPresetCities(lang);
      suggestEl.innerHTML='';
      cities.forEach(c=>{
        const b=document.createElement('button');
        b.textContent=c.label;
        b.onclick=()=>{ selectPlace({name:c.name, lat:c.lat, lon:c.lon}); suggestEl.classList.remove('open'); inputEl.value=''; delete suggestEl.dataset.mode; };
        suggestEl.appendChild(b);
      });
      suggestEl.dataset.mode = 'preset';
      suggestEl.classList.add('open');
    };

    inputEl.addEventListener('click', ()=>{
      if(suggestEl.classList.contains('open') && suggestEl.dataset.mode==='preset'){
        suggestEl.classList.remove('open');
        delete suggestEl.dataset.mode;
      } else {
        renderPresets();
      }
    });
  }
}catch(_){ }


function iconHTML(code){
    const isSunny=[0];
    const isCloudy=[1,2,3,45,48];
    const isRain=[51,53,55,56,57,61,63,65,66,67,80,81,82];
    if(isSunny.includes(code)) return `<div class="sun"></div>`
    if(isCloudy.includes(code)) return `<div class="cloud"></div>`
    if(isRain.includes(code)) return `<div class="cloud"></div><div class="rain">${'<span class="drop"></span>'.repeat(3)}</div>`
    return `<div class="cloud"></div>`
}


function renderFavs(){
    const wrap=$('#favorites'); wrap.innerHTML='';
    store.k.forEach(f=>{ const b=document.createElement('button'); b.className='chip'; b.textContent=f.name; b.onclick=()=>selectPlace(f); wrap.appendChild(b)});
    if(store.k.length===0){ const hint=document.createElement('span'); hint.className='muted'; hint.textContent='Сохраните города для быстрого доступа'; wrap.appendChild(hint)}
}
$('#save').addEventListener('click',()=>{
    if(!last) return; const fav={name:last.name, lat:last.lat, lon:last.lon};
    const exists=store.k.some(f=>f.name===fav.name);
    if(!exists){ store.k=[...store.k,fav]; renderFavs(); toast('Добавлено в избранное'); }
    else{ toast('Уже в избранном'); }
})


const suggest=$('#suggest');
const input=$('#q');
let sTimer;
input.addEventListener('input',()=>{
    clearTimeout(sTimer);
    const q=input.value.trim();
    if(q.length<2){ suggest.classList.remove('open'); suggest.innerHTML=''; return }
    sTimer=setTimeout(async()=>{
    const url=`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=${store?.lang||'ru'}&format=json`;
    const res=await fetch(url); const j=await res.json();
    suggest.innerHTML='';
    (j.results||[]).forEach(r=>{
        const b=document.createElement('button'); b.textContent=`${r.name}, ${r.country_code}${r.admin1?(' · '+r.admin1):''}`;
        b.onclick=()=>{ selectPlace({name:b.textContent, lat:r.latitude, lon:r.longitude}); suggest.classList.remove('open'); input.value=''; }
        suggest.appendChild(b);
    });
    if(j.results&&j.results.length){ suggest.classList.add('open') } else { suggest.classList.remove('open') }
    }, 250)
})
document.addEventListener('click', (e)=>{
  if(!suggest.contains(e.target) && e.target!==input && e.target.id!=='searchBtn'){
    suggest.classList.remove('open')
  }
});

// гео
$('#geo').addEventListener('click',()=>{
    if(!navigator.geolocation){ toast('Геолокация недоступна'); return }
    navigator.geolocation.getCurrentPosition(async(pos)=>{
    const {latitude:lat, longitude:lon}=pos.coords;
    try{
        const rev=`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=ru&format=json`;
        const r=await (await fetch(rev)).json();
        const name=r && r.results && r.results[0] ? `${r.results[0].name}, ${r.results[0].country_code}` : 'Текущее местоположение';
        selectPlace({name, lat, lon});
    }catch{ selectPlace({name:'Моё местоположение', lat, lon}) }
    },()=> toast('Не удалось получить координаты'))
})


let last=null; 

async function selectPlace({name,lat,lon}){
    $('#city').textContent=name; $('#subtitle').textContent='Обновляю…';
    marker.setLatLng([lat,lon]); map.setView([lat,lon], 10);
    $('#coords').textContent = `${lat.toFixed(3)}, ${lon.toFixed(3)}`;

    const params = new URLSearchParams({
    latitude: lat, longitude: lon,
    current: ['temperature_2m','relative_humidity_2m','apparent_temperature','pressure_msl','wind_speed_10m','wind_direction_10m','weather_code'].join(','),
    hourly: ['temperature_2m','relative_humidity_2m','precipitation','cloud_cover','wind_speed_10m'].join(','),
    daily: ['weather_code','temperature_2m_max','temperature_2m_min','sunrise','sunset','uv_index_max'].join(','),
    timezone: 'auto'
    });
    const airParams=new URLSearchParams({
    latitude:lat, longitude:lon, hourly:['pm2_5','us_aqi'].join(','), timezone:'auto'
    });

    try{
    const [wRes, aRes] = await Promise.all([
        fetch('https://api.open-meteo.com/v1/forecast?'+params.toString()),
        fetch('https://air-quality-api.open-meteo.com/v1/air-quality?'+airParams.toString())
    ]);
    const [w, a] = [await wRes.json(), await aRes.json()];
    last={ name, lat, lon, w, a };
    renderAll(last);
    }catch(e){ console.error(e); $('#subtitle').textContent='Ошибка загрузки'; toast('Ошибка сети'); }
}

function cToF(c){ return c*9/5+32 }
function renderAll(data){
    const {w,a} = data;
    const cur=w.current;
    const unit=store.unit;
    const toUnit = (c)=> unit==='C' ? c : cToF(c);


    $('#subtitle').textContent = `Обновлено: ${new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'})}`;
    $('#icon').innerHTML = iconHTML(cur.weather_code);
    $('#temp').textContent = Math.round(toUnit(cur.temperature_2m)) + '°';
    $('#desc').textContent = codeToText(cur.weather_code);
    $('#wind').textContent = `${Math.round(cur.wind_speed_10m)} м/с`;
    $('#humid').textContent = `${Math.round(cur.relative_humidity_2m)}%`;
    $('#press').textContent = `${Math.round(cur.pressure_msl)} гПа`;
    $('#sunrise').textContent = fmtTime(w.daily.sunrise[0]);
    $('#sunset').textContent = fmtTime(w.daily.sunset[0]);
    $('#meta').innerHTML = `<span>Ощущается как <strong>${Math.round(toUnit(cur.apparent_temperature))}°</strong></span><span class="muted">•</span><span>UV макс: ${w.daily.uv_index_max[0]}</span>`;


    const hoursAQI = a.hourly?.us_aqi || [];
    const lastAQI = hoursAQI.length ? hoursAQI[hoursAQI.length-1] : null;
    const aqi = (lastAQI==null||isNaN(lastAQI)) ? null : Math.round(lastAQI);
    const meter = document.querySelector('.aqi .meter');
    const circumference = 2*Math.PI*46;
    let color='var(--ok)'; let label='—';
    if(aqi!=null){
    if(aqi<=50){ color='var(--ok)'; label='Хорошо'}
    else if(aqi<=100){ color='var(--warn)'; label='Средне'}
    else { color='var(--bad)'; label='Плохо'}
    const ratio=Math.min(aqi,150)/150; // scale
    meter.setAttribute('stroke', color);
    meter.setAttribute('stroke-dasharray', circumference);
    meter.setAttribute('stroke-dashoffset', (1-ratio)*circumference);
    $('#aqiValue').textContent=aqi; $('#aqiLabel').textContent=label;
    }else{ meter.setAttribute('stroke-dashoffset', circumference); $('#aqiValue').textContent='—'; $('#aqiLabel').textContent='нет данных' }

    const hTimes=w.hourly.time.map(t=>new Date(t));
    const now=Date.now();
    const next24 = hTimes.map((t,i)=>({t,i})).filter(o=> (o.t - now) <= 24*3600*1000 && (o.t - now) >= 0);
    const idx0 = next24.length? next24[0].i : 0;
    const idx1 = next24.length? next24[next24.length-1].i : 24;
    const hLabels=hTimes.slice(idx0, idx1+1).map(t=>t.toLocaleTimeString('ru-RU',{hour:'2-digit'}));
    const hTemps=w.hourly.temperature_2m.slice(idx0, idx1+1).map(toUnit);
    $('#hourRange').textContent = `${hLabels[0]}–${hLabels[hLabels.length-1]}`;
    drawHourly(hLabels, hTemps);

    const daily = w.daily.time.map((d,i)=>({
    day: fmtDay(d), code: w.daily.weather_code[i],
    tmax: Math.round(toUnit(w.daily.temperature_2m_max[i])),
    tmin: Math.round(toUnit(w.daily.temperature_2m_min[i]))
    }));
    const wrap=$('#daily'); wrap.innerHTML='';
    daily.forEach(d=>{
    const el=document.createElement('div'); el.className='pill';
    el.innerHTML=`<div style="margin-bottom:6px">${d.day}</div>
        <div style="display:flex; align-items:center; justify-content:center; gap:8px">
        <div class="wx" style="transform:scale(.6)">${iconHTML(d.code)}</div>
        <div><strong>${d.tmax}°</strong> <span class="muted">/${d.tmin}°</span></div>
        </div>`;
    wrap.appendChild(el);
    })

    applyDynamicAccent(cur.weather_code);
}

function drawHourly(labels, temps){
    const ctx=document.getElementById('hourly');
    if(window._chart){ window._chart.destroy() }
    window._chart = new Chart(ctx,{
    type:'line',
    data:{labels, datasets:[{ label:'Темп., °'+store.unit, data:temps, borderWidth:3, tension:.3, pointRadius:2 }] },
    options:{
        plugins:{ legend:{ display:false }, tooltip:{ intersect:false, mode:'index' } },
        scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(255,255,255,.08)' } } }
    }
    })
}

function codeToText(code){
    const map = {
    0:'Ясно',1:'Преим. ясно',2:'Переменная облачность',3:'Пасмурно',
    45:'Туман',48:'Иней туман',
    51:'Лёгкая морось',53:'Морось',55:'Сильная морось',
    56:'Ледяная морось',57:'Сильная ледяная морось',
    61:'Лёгкий дождь',63:'Дождь',65:'Ливень',
    66:'Ледяной дождь',67:'Сильный ледяной дождь',
    71:'Лёгкий снег',73:'Снег',75:'Сильный снег',77:'Снежные зёрна',
    80:'Кратковременные дожди',81:'Сильные кратковременные дожди',82:'Ливни',
    85:'Снегопады',86:'Сильные снегопады',95:'Гроза',96:'Гроза с градом',99:'Сильная гроза с градом'
    };
    return map[code]||'Погода';
}

function applyDynamicAccent(code){
    let a1='#8b5cf6', a2='#06b6d4';
    if([0,1].includes(code)) { a1='#f59e0b'; a2='#fb7185' } // sunny/warm
    else if([61,63,65,80,81,82].includes(code)) { a1='#22d3ee'; a2='#0ea5e9' } // rainy
    else if([71,73,75,77,85,86].includes(code)) { a1='#38bdf8'; a2='#a5b4fc' } // snowy
    document.querySelector('.logo').style.background=`linear-gradient(135deg, ${a1}, ${a2})`;
}

renderFavs();
selectPlace({name:'Berlin, DE', lat:52.52, lon:13.405});

// I18N 

function codeToText(code){
  const mapRU = {
    0:'Ясно',1:'Преимущественно ясно',2:'Переменная облачность',3:'Пасмурно',
    45:'Туман',48:'Иний/изморось',
    51:'Легкая морось',53:'Морось',55:'Сильная морось',
    56:'Ледяная морось',57:'Сильная ледяная морось',
    61:'Небольшой дождь',63:'Дождь',65:'Сильный дождь',
    66:'Ледяной дождь',67:'Сильный ледяной дождь',
    71:'Небольшой снег',73:'Снег',75:'Сильный снег',77:'Снежные зерна',
    80:'Ливни (слабые)',81:'Ливни (умеренные)',82:'Ливни (сильные)',
    85:'Снегопад (слаб.)',86:'Снегопад (сильн.)',95:'Гроза',96:'Гроза с градом',99:'Гроза с сильным градом'
  };
  const mapEN = {
    0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',
    45:'Fog',48:'Depositing rime fog',
    51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',
    56:'Freezing drizzle',57:'Heavy freezing drizzle',
    61:'Light rain',63:'Rain',65:'Heavy rain',
    66:'Freezing rain',67:'Heavy freezing rain',
    71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',
    80:'Rain showers (slight)',81:'Rain showers (moderate)',82:'Rain showers (heavy)',
    85:'Snow showers (slight)',86:'Snow showers (heavy)',95:'Thunderstorm',96:'Thunderstorm with hail',99:'Thunderstorm with heavy hail'
  };
  const map = (store.lang==='ru'?mapRU:mapEN);
  return map[code] || (store.lang==='ru'?'Неизвестно':'Unknown');
}

function drawHourly(labels, temps){
  const ctx=document.getElementById('hourly');
  if(window._chart){ window._chart.destroy() }
  window._chart = new Chart(ctx,{
    type:'line',
    data:{ labels, datasets:[{ label: (t('chartTemp')+store.unit), data:temps, borderWidth:3, tension:.3, pointRadius:2 }] },
    options:{
      plugins:{ legend:{ display:false }, tooltip:{ intersect:false, mode:'index' } },
      scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(255,255,255,.08)' } } }
    }
  })
}

function renderFavs(){
  const wrap=$('#favorites'); if(!wrap) return; wrap.innerHTML='';
  store.k.forEach(f=>{ const b=document.createElement('button'); b.className='chip'; b.textContent=f.name; b.onclick=()=>selectPlace(f); wrap.appendChild(b)});
  if(store.k.length===0){ const hint=document.createElement('span'); hint.className='muted'; hint.textContent=t('noFavs'); wrap.appendChild(hint) }
  else {
    const clear=document.createElement('button');
    clear.className='chip chip-clear';
    const L=(store?.lang||'ru');
    clear.textContent = (L==='ru'?'Удалить':(L==='es'?'Borrar':'Clear'));
    clear.onclick=()=>{ store.k=[]; renderFavs(); };
    wrap.appendChild(clear);
  }
}

function renderAll(data){
  const {w,a} = data; const cur=w.current; const unit=store.unit; const toUnit=(c)=> unit==='C'?c:cToF(c);
  $('#subtitle').textContent = `${t('updatedAt')}: ${new Date().toLocaleTimeString(locale(),{hour:'2-digit',minute:'2-digit'})}`;
  $('#icon').innerHTML = iconHTML(cur.weather_code);
  $('#temp').textContent = Math.round(toUnit(cur.temperature_2m)) + '°';
  $('#desc').textContent = codeToText(cur.weather_code);

  const u = store.lang==='ru' ? {speed:'м/с', press:'гПа'} : {speed:'m/s', press:'hPa'};
  $('#wind').textContent = `${Math.round(cur.wind_speed_10m)} ${u.speed}`;
  $('#humid').textContent = `${Math.round(cur.relative_humidity_2m)}%`;
  $('#press').textContent = `${Math.round(cur.pressure_msl)} ${u.press}`;
  $('#sunrise').textContent = fmtTime(w.daily.sunrise[0]);
  $('#sunset').textContent = fmtTime(w.daily.sunset[0]);
  $('#meta').innerHTML = `<span>${t('feelsLike')} <strong>${Math.round(toUnit(cur.apparent_temperature))}°</strong></span><span class="muted">·</span><span>${t('uvIndex')}: ${w.daily.uv_index_max[0]}</span>`;

  const times = (a.hourly?.time||[]).map(t=>new Date(t).getTime());
  const vals = a.hourly?.us_aqi || [];
  let aqiIndex = -1;
  if(times.length){
    const now = Date.now();
    let i = times.findIndex(ts => ts > now) - 1; if(i < 0) i = times.length - 1;
    for(let k=i; k>=0; k--){ if(vals[k]!=null && !isNaN(vals[k])) { aqiIndex = k; break } }
  }
  const aqiVal = (aqiIndex>=0) ? Math.round(vals[aqiIndex]) : null;
  const meter = document.querySelector('.aqi .meter');
  const circumference = 2*Math.PI*46;
  if(aqiVal!=null){
    let color='var(--ok)'; let label=t('aqiGood');
    if(aqiVal<=50){ color='var(--ok)'; label=t('aqiGood') }
    else if(aqiVal<=100){ color='var(--warn)'; label=t('aqiModerate') }
    else { color='var(--bad)'; label=t('aqiUnhealthy') }
    const ratio=Math.min(aqiVal,150)/150;
    meter.setAttribute('stroke', color);
    meter.setAttribute('stroke-dasharray', circumference);
    meter.setAttribute('stroke-dashoffset', (1-ratio)*circumference);
    $('#aqiValue').textContent=aqiVal; $('#aqiLabel').textContent=label;
  }else{
    meter.setAttribute('stroke-dashoffset', circumference);
    $('#aqiValue').textContent='—'; $('#aqiLabel').textContent='';
  }

  const hTimes=w.hourly.time.map(t=>new Date(t));
  const now=Date.now();
  const next24 = hTimes.map((t,i)=>({t,i})).filter(o=> (o.t - now) <= 24*3600*1000 && (o.t - now) >= 0);
  const idx0 = next24.length? next24[0].i : 0;
  const idx1 = next24.length? next24[next24.length-1].i : 24;
  const hLabels=hTimes.slice(idx0, idx1+1).map(t=>t.toLocaleTimeString(locale(),{hour:'2-digit'}));
  const hTemps=w.hourly.temperature_2m.slice(idx0, idx1+1).map(toUnit);
  $('#hourRange').textContent = `${hLabels[0]}—${hLabels[hLabels.length-1]}`;
  drawHourly(hLabels, hTemps);

  const daily = w.daily.time.map((d,i)=>({ day: fmtDay(d), code: w.daily.weather_code[i], tmax: Math.round(toUnit(w.daily.temperature_2m_max[i])), tmin: Math.round(toUnit(w.daily.temperature_2m_min[i])) }));
  const wrap=$('#daily'); if(wrap){ wrap.innerHTML='';
    daily.forEach(d=>{
      const el=document.createElement('div'); el.className='pill';
      el.innerHTML=`<div style="margin-bottom:6px">${d.day}</div>
        <div style="display:flex; align-items:center; justify-content:center; gap:8px">
          <div class="wx" style="transform:scale(.6)">${iconHTML(d.code)}</div>
          <div><strong>${d.tmax}°</strong> <span class="muted">/${d.tmin}°</span></div>
        </div>`;
      wrap.appendChild(el);
    })
  }

  applyDynamicAccent(cur.weather_code);
}

applyLanguage();
const unitBtn=document.getElementById('unit'); if(unitBtn) unitBtn.textContent = '°'+store.unit;

function rebindControls(){
  const save=document.getElementById('save');
  if(save){
    const s2=save.cloneNode(true); save.replaceWith(s2);
    s2.textContent = t('btnSave');
    s2.addEventListener('click',()=>{
      if(!last) return; const fav={name:last.name, lat:last.lat, lon:last.lon};
      const exists=store.k.some(f=>f.name===fav.name);
      if(!exists){ store.k=[...store.k,fav]; renderFavs(); toast(t('toastSaved')); }
      else{ toast(t('toastExists')); }
    })
  }
  const geo=document.getElementById('geo');
  if(geo){
    const g2=geo.cloneNode(true); geo.replaceWith(g2);
    g2.textContent = t('btnGeo');
    g2.addEventListener('click',()=>{
      if(!navigator.geolocation){ toast(t('geoNotSupported')); return }
      navigator.geolocation.getCurrentPosition(async(pos)=>{
        const {latitude:lat, longitude:lon}=pos.coords;
        try{
          const rev=`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=${store.lang}&format=json`;
          const r=await (await fetch(rev)).json();
          const name=r && r.results && r.results[0] ? `${r.results[0].name}, ${r.results[0].country_code}` : (store.lang==='ru'?'Мое местоположение':'My location');
          selectPlace({name, lat, lon});
        }catch{
          selectPlace({name:(store.lang==='ru'?'Место по геолокации':'Location by GPS'), lat, lon})
        }
      },()=> toast(store.lang==='ru'?'Нет доступа к геолокации':'Cannot access geolocation'))
    })
  }
}

rebindControls();
renderFavs();
document.addEventListener('click', (e)=>{ if(e.target && e.target.id==='lang'){ setTimeout(rebindControls, 0) } });

function updateHeaderPortfolio(){
  try{
    const el = document.querySelector('header .brand .muted');
    if(el){ el.textContent = t('headerPortfolio'); }
  }catch(_){ }
}
updateHeaderPortfolio();
document.addEventListener('click', (e)=>{ if(e.target && e.target.id==='lang'){ setTimeout(updateHeaderPortfolio, 0) } });

try {
  const __origDrawHourly = drawHourly;
  drawHourly = function(labels, temps){
    const ctx=document.getElementById('hourly');
    if(window._chart){ window._chart.destroy() }
    window._chart = new Chart(ctx,{
      type:'line',
      data:{ labels, datasets:[{ label:(t('chartTemp')+store.unit), data:temps, borderWidth:3, tension:.3, pointRadius:2 }] },
      options:{ plugins:{ legend:{ display:false }, tooltip:{ intersect:false, mode:'index' } }, scales:{ x:{ grid:{ display:false } }, y:{ grid:{ color:'rgba(255,255,255,.08)' } } } }
    })
  }
} catch(_) {}

try {
  codeToText = function(code){
    const mapRU = {
      0:'Ясно',1:'Преимущественно ясно',2:'Переменная облачность',3:'Пасмурно',
      45:'Туман',48:'Иний/изморось',
      51:'Легкая морось',53:'Морось',55:'Сильная морось',
      56:'Ледяная морось',57:'Сильная ледяная морось',
      61:'Небольшой дождь',63:'Дождь',65:'Сильный дождь',
      66:'Ледяной дождь',67:'Сильный ледяной дождь',
      71:'Небольшой снег',73:'Снег',75:'Сильный снег',77:'Снежные зерна',
      80:'Ливни (слабые)',81:'Ливни (умеренные)',82:'Ливни (сильные)',
      85:'Снегопад (слаб.)',86:'Снегопад (сильн.)',95:'Гроза',96:'Гроза с градом',99:'Гроза с сильным градом'
    };
    const mapEN = {
      0:'Clear',1:'Mostly clear',2:'Partly cloudy',3:'Overcast',
      45:'Fog',48:'Depositing rime fog',
      51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',
      56:'Freezing drizzle',57:'Heavy freezing drizzle',
      61:'Light rain',63:'Rain',65:'Heavy rain',
      66:'Freezing rain',67:'Heavy freezing rain',
      71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',
      80:'Rain showers (slight)',81:'Rain showers (moderate)',82:'Rain showers (heavy)',
      85:'Snow showers (slight)',86:'Snow showers (heavy)',95:'Thunderstorm',96:'Thunderstorm with hail',99:'Thunderstorm with heavy hail'
    };
    const mapES = {
      0:'Despejado',1:'Mayormente despejado',2:'Parcialmente nublado',3:'Nublado',
      45:'Niebla',48:'Niebla con cencellada',
      51:'Llovizna ligera',53:'Llovizna',55:'Llovizna intensa',
      56:'Llovizna helada',57:'Llovizna helada intensa',
      61:'Lluvia ligera',63:'Lluvia',65:'Lluvia intensa',
      66:'Lluvia helada',67:'Lluvia helada intensa',
      71:'Nieve ligera',73:'Nieve',75:'Nieve intensa',77:'Granos de nieve',
      80:'Chubascos (ligeros)',81:'Chubascos (moderados)',82:'Chubascos (fuertes)',
      85:'Chubascos de nieve (ligeros)',86:'Chubascos de nieve (fuertes)',95:'Tormenta eléctrica',96:'Tormenta con granizo',99:'Tormenta con granizo fuerte'
    };
    const map = (store.lang==='ru'?mapRU : store.lang==='es'?mapES : mapEN);
    return map[code] || (store.lang==='ru'?'Неизвестно': store.lang==='es'?'Desconocido':'Unknown');
  }
} catch(_) {}

try { const ub=document.getElementById('unit'); if(ub) ub.textContent='°'+store.unit; } catch(_) {}
