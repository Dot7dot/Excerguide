(function () {
  'use strict';

  // ---------------- 資料 ----------------

  // MET 值參考 Compendium of Physical Activities 的一般強度
  var CATEGORIES = [
    { id: 'run', name: '跑步', en: 'Run', met: 9.8, tips: [
      '新手可以從「跑走交替」開始，例如跑 1 分鐘、走 2 分鐘，循序漸進。',
      '輕鬆跑的強度大約是「還能邊跑邊講完整句子」的程度。',
      '每週跑量增加建議不超過 10%，可降低受傷風險。',
      '跑鞋大約每 600–800 公里就該考慮更換。'
    ]},
    { id: 'walk', name: '健走', en: 'Walk', met: 4.3, tips: [
      '快走的速度大約是每分鐘 100 步以上，微喘但能說話。',
      '飯後散步 10–15 分鐘有助於穩定血糖。',
      '走路時抬頭挺胸、手臂自然擺動，可以多動到上半身。'
    ]},
    { id: 'cycle', name: '騎自行車', en: 'Cycle', met: 7.5, tips: [
      '座墊高度：踩到最低點時膝蓋仍保有微微彎曲最理想。',
      '騎車對膝蓋衝擊比跑步小，適合體重較重或膝蓋不適的人。',
      '戶外騎乘請務必戴安全帽，並注意補水。'
    ]},
    { id: 'swim', name: '游泳', en: 'Swim', met: 8.0, tips: [
      '水的浮力能減輕關節負擔，是全身性的低衝擊運動。',
      '游泳時也會流汗，只是感覺不到，記得前後都要喝水。',
      '下水前做好肩膀與腳踝的暖身，可以減少抽筋。'
    ]},
    { id: 'weights', name: '重量訓練', en: 'Weights', met: 5.0, tips: [
      '建議每週至少 2 天進行主要肌群的肌力訓練。',
      '同一肌群兩次訓練之間，最好間隔 48 小時讓肌肉恢復。',
      '動作標準比重量重要，先用輕重量練好姿勢。',
      '用力時吐氣、放鬆時吸氣，避免憋氣。'
    ]},
    { id: 'yoga', name: '瑜伽', en: 'Yoga', met: 2.5, tips: [
      '瑜伽能改善柔軟度與平衡感，也有助於放鬆心情。',
      '伸展到「緊但不痛」的程度就好，不要勉強。',
      '空腹或飯後 2 小時再練習比較舒服。'
    ]},
    { id: 'rope', name: '跳繩', en: 'Jump Rope', met: 11.0, tips: [
      '用前腳掌輕跳，膝蓋微彎，可以吸收落地衝擊。',
      '跳繩長度：單腳踩住繩子中間，握把約到腋下高度。',
      '強度很高，新手可以跳 30 秒、休息 30 秒交替進行。'
    ]},
    { id: 'basketball', name: '籃球', en: 'Basketball', met: 6.5, tips: [
      '籃球有大量急停與跳躍，運動前記得充分暖身腳踝與膝蓋。',
      '穿著有包覆性的球鞋，可以降低扭傷機率。'
    ]},
    { id: 'badminton', name: '羽球', en: 'Badminton', met: 5.5, tips: [
      '羽球需要大量手腕與肩膀動作，打完記得伸展肩膀。',
      '步法比揮拍更重要，多練習回到場地中央。'
    ]},
    { id: 'hike', name: '登山健行', en: 'Hike', met: 6.0, tips: [
      '下坡時膝蓋負擔比上坡大，可以使用登山杖分擔。',
      '每小時約補充 300–500 毫升的水，視天氣增減。',
      '出發前確認天氣與路線，並讓家人知道你的行程。'
    ]},
    { id: 'hiit', name: 'HIIT', en: 'Interval', met: 8.0, tips: [
      'HIIT 是高強度與休息交替的訓練，短時間就有不錯效果。',
      '因為強度高，每週 2–3 次就足夠，其他天可做輕鬆運動。',
      '有心血管疾病或剛開始運動的人，建議先諮詢醫師。'
    ]},
    { id: 'stretch', name: '伸展', en: 'Stretch', met: 2.3, tips: [
      '運動前做「動態伸展」暖身，運動後再做「靜態伸展」收操。',
      '每個靜態伸展動作維持 15–30 秒，過程中保持呼吸。'
    ]}
  ];

  var GENERAL_TIPS = [
    '世界衛生組織建議成人每週至少 150 分鐘中等強度，或 75 分鐘高強度的有氧運動。',
    '運動前後各 5–10 分鐘的暖身與緩和，能有效降低受傷機率。',
    '運動中感到胸痛、頭暈或呼吸異常，請立刻停止並休息。',
    '睡眠也是訓練的一部分，肌肉是在休息時修復變強的。',
    '久坐每 30–60 分鐘起來動一動，對身體也有幫助。',
    '運動後 30–60 分鐘內補充蛋白質與碳水化合物，有助於恢復。',
    '「談話測試」：能說話但不能唱歌，大約就是中等強度。'
  ];

  var CUSTOM = { id: 'custom', name: '其他運動', en: 'Custom', met: 4.0, tips: [
    '找到自己喜歡的運動，是能長期持續的最大關鍵。'
  ]};

  var DEFAULT_PROFILE = { sex: 'none', age: 30, height: 170, weight: 65, goal: 150 };

  var KEYS = {
    profile: 'excerguide.profile',
    records: 'excerguide.records',
    onboarded: 'excerguide.onboarded'
  };

  // ---------------- 儲存 ----------------

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 無法儲存時忽略 */ }
  }
  function remove(key) {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  }

  var profile = Object.assign({}, DEFAULT_PROFILE, load(KEYS.profile, {}));
  var records = load(KEYS.records, []);
  if (!Array.isArray(records)) records = [];

  // ---------------- 工具 ----------------

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function findCategory(id) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].id === id) return CATEGORIES[i];
    return CUSTOM;
  }

  function kcal(met, minutes) {
    return Math.round(met * profile.weight * (minutes / 60));
  }

  function startOfDay(d) { var x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function startOfWeek(d) {
    var x = startOfDay(d);
    var day = (x.getDay() + 6) % 7; // 週一為一週開始
    x.setDate(x.getDate() - day);
    return x;
  }

  function formatDate(ts) {
    var d = new Date(ts);
    var now = new Date();
    var diff = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
    var hm = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    if (diff === 0) return '今天 ' + hm;
    if (diff === 1) return '昨天 ' + hm;
    return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + hm;
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  var toastTimer;
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }

  // ---------------- 分頁 ----------------

  function showView(id) {
    document.querySelectorAll('.view').forEach(function (v) { v.hidden = v.id !== id; });
    document.querySelectorAll('.tab').forEach(function (t) {
      t.classList.toggle('is-active', t.dataset.view === id);
    });
    $('#topbar-sub').textContent = document.getElementById(id).dataset.title;
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () { showView(t.dataset.view); });
  });

  // ---------------- 運動類別 ----------------

  function renderCategories() {
    var html = CATEGORIES.concat([CUSTOM]).map(function (c) {
      return '<button class="cat" type="button" data-cat="' + c.id + '" aria-label="新增' + c.name + '">' +
        '<span class="cat-plus" aria-hidden="true">+</span>' +
        '<span class="cat-name">' + c.name + '</span>' +
        '<span class="cat-en">' + c.en + '</span>' +
        '</button>';
    }).join('');
    $('#category-grid').innerHTML = html;
  }
  $('#category-grid').addEventListener('click', function (e) {
    var btn = e.target.closest('.cat');
    if (btn) openEntry({ category: btn.dataset.cat });
  });

  // ---------------- 新增 / 編輯 ----------------

  var editingId = null;
  var currentCat = CATEGORIES[0];
  var entryOverlay = $('#entry-overlay');
  var nameInput = $('#entry-name');
  var durInput = $('#entry-duration');
  var noteInput = $('#entry-note');

  function updateDuration() {
    var v = Number(durInput.value);
    var pct = ((v - durInput.min) / (durInput.max - durInput.min)) * 100;
    durInput.style.setProperty('--pct', pct + '%');
    $('#entry-duration-value').textContent = v;
    $('#entry-kcal').textContent = '≈ ' + kcal(currentCat.met, v) + ' 大卡';
  }
  durInput.addEventListener('input', updateDuration);

  function openEntry(opts) {
    var rec = opts.record || null;
    editingId = rec ? rec.id : null;
    currentCat = findCategory(rec ? rec.category : opts.category);

    $('#entry-tag').textContent = currentCat.name;
    nameInput.value = rec ? rec.name : (currentCat.id === 'custom' ? '' : currentCat.name);
    nameInput.placeholder = currentCat.id === 'custom' ? '例如：桌球、跳舞、划船…' : currentCat.name;
    durInput.value = rec ? rec.minutes : 30;
    noteInput.value = rec ? rec.note : '';
    $('#entry-submit').textContent = rec ? '儲存變更' : '新增紀錄';
    $('#entry-delete').hidden = !rec;

    var tip = currentCat.tips[Math.floor(Math.random() * currentCat.tips.length)];
    $('#entry-tip').innerHTML = '<b>小常識</b>　' + escapeHtml(tip);

    updateDuration();
    entryOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!rec && currentCat.id === 'custom') nameInput.focus();
  }

  function closeEntry() {
    entryOverlay.hidden = true;
    document.body.style.overflow = '';
    editingId = null;
  }

  entryOverlay.addEventListener('click', function (e) {
    if (e.target === entryOverlay || e.target.closest('[data-close]')) closeEntry();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !entryOverlay.hidden) closeEntry();
  });

  $('#entry-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = nameInput.value.trim() || currentCat.name;
    var minutes = Number(durInput.value);
    var note = noteInput.value.trim();

    if (editingId) {
      records = records.map(function (r) {
        return r.id === editingId ? Object.assign({}, r, { name: name, minutes: minutes, note: note }) : r;
      });
      toast('已更新紀錄');
    } else {
      records.unshift({
        id: uid(),
        category: currentCat.id,
        name: name,
        minutes: minutes,
        note: note,
        date: Date.now()
      });
      toast('已新增 ' + name + ' ' + minutes + ' 分鐘');
    }
    save(KEYS.records, records);
    closeEntry();
    renderRecords();
  });

  $('#entry-delete').addEventListener('click', function () {
    if (!editingId) return;
    if (!confirm('確定要刪除這筆紀錄嗎？')) return;
    records = records.filter(function (r) { return r.id !== editingId; });
    save(KEYS.records, records);
    closeEntry();
    renderRecords();
    toast('已刪除');
  });

  // ---------------- 紀錄列表 & 統計 ----------------

  function renderRecords() {
    var list = $('#record-list');
    $('#record-empty').hidden = records.length > 0;

    list.innerHTML = records.slice(0, 50).map(function (r) {
      var c = findCategory(r.category);
      return '<li class="record" data-id="' + escapeHtml(r.id) + '" tabindex="0" role="button" aria-label="編輯 ' + escapeHtml(r.name) + '">' +
        '<div class="record-min"><b>' + r.minutes + '</b><small>分鐘</small></div>' +
        '<div class="record-body">' +
          '<div class="record-top">' +
            '<span class="record-name">' + escapeHtml(r.name) + '</span>' +
            '<span class="record-meta">' + formatDate(r.date) + '</span>' +
          '</div>' +
          '<div class="record-meta">' + c.name + ' · ≈ ' + kcal(c.met, r.minutes) + ' 大卡</div>' +
          (r.note ? '<p class="record-note">' + escapeHtml(r.note) + '</p>' : '') +
        '</div>' +
      '</li>';
    }).join('');

    var today = startOfDay(new Date()).getTime();
    var week = startOfWeek(new Date()).getTime();
    var todayMin = 0, weekMin = 0, weekKcal = 0;
    records.forEach(function (r) {
      if (r.date >= today) todayMin += r.minutes;
      if (r.date >= week) {
        weekMin += r.minutes;
        weekKcal += kcal(findCategory(r.category).met, r.minutes);
      }
    });
    $('#stat-today-min').textContent = todayMin;
    $('#stat-week-min').textContent = weekMin;
    $('#stat-week-kcal').textContent = weekKcal;

    var goal = Math.max(1, Number(profile.goal) || DEFAULT_PROFILE.goal);
    var pct = Math.min(100, Math.round((weekMin / goal) * 100));
    $('#goal-fill').style.width = pct + '%';
    $('#goal-pct').textContent = pct + '%';
    $('.goal-head span').textContent = '每週目標 ' + goal + ' 分鐘';
  }

  function openRecord(el) {
    var rec = records.find(function (r) { return r.id === el.dataset.id; });
    if (rec) openEntry({ record: rec });
  }
  $('#record-list').addEventListener('click', function (e) {
    var li = e.target.closest('.record');
    if (li) openRecord(li);
  });
  $('#record-list').addEventListener('keydown', function (e) {
    var li = e.target.closest('.record');
    if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openRecord(li); }
  });

  // ---------------- 小常識 ----------------

  var allTips = GENERAL_TIPS.slice();
  CATEGORIES.forEach(function (c) { allTips = allTips.concat(c.tips); });
  var tipIndex = new Date().getDate() % allTips.length;

  function renderTips() {
    $('#tip-of-day').textContent = allTips[tipIndex];

    var groups = [{ name: '一般健康', tips: GENERAL_TIPS }].concat(CATEGORIES);
    $('#tip-list').innerHTML = groups.map(function (g, i) {
      return '<details class="tip-group"' + (i === 0 ? ' open' : '') + '>' +
        '<summary><span>' + g.name + (g.met ? '<span class="tip-met">MET ' + g.met + '</span>' : '') + '</span></summary>' +
        '<ul>' + g.tips.map(function (t) { return '<li>' + escapeHtml(t) + '</li>'; }).join('') + '</ul>' +
        '</details>';
    }).join('');
  }
  $('#tip-next').addEventListener('click', function () {
    tipIndex = (tipIndex + 1) % allTips.length;
    $('#tip-of-day').textContent = allTips[tipIndex];
  });

  // ---------------- 身體數據表單 ----------------

  var FIELDS = [
    { key: 'age', label: '年齡', unit: '歲', min: 10, max: 100, step: 1 },
    { key: 'height', label: '身高', unit: '公分', min: 100, max: 230, step: 0.5 },
    { key: 'weight', label: '體重', unit: '公斤', min: 25, max: 250, step: 0.5 },
    { key: 'goal', label: '每週運動目標', unit: '分鐘', min: 10, max: 2000, step: 10 }
  ];

  function profileFormHtml(prefix, p) {
    var sexes = [['male', '男'], ['female', '女'], ['none', '不透露']];
    var html = '<div class="field field-full"><span class="field-label">性別</span><div class="seg" role="radiogroup">' +
      sexes.map(function (s) {
        return '<label><input type="radio" name="' + prefix + '-sex" value="' + s[0] + '"' +
          (p.sex === s[0] ? ' checked' : '') + '><span>' + s[1] + '</span></label>';
      }).join('') + '</div></div>';
    html += FIELDS.map(function (f) {
      return '<label class="field"><span class="field-label">' + f.label + '（' + f.unit + '）</span>' +
        '<input type="number" inputmode="decimal" name="' + f.key + '" min="' + f.min + '" max="' + f.max +
        '" step="' + f.step + '" value="' + p[f.key] + '" placeholder="' + DEFAULT_PROFILE[f.key] + '"></label>';
    }).join('');
    return html;
  }

  function readProfileForm(form, prefix) {
    var next = Object.assign({}, profile);
    var sex = form.querySelector('input[name="' + prefix + '-sex"]:checked');
    next.sex = sex ? sex.value : 'none';
    FIELDS.forEach(function (f) {
      var v = parseFloat(form.elements[f.key].value);
      next[f.key] = isFinite(v) ? Math.min(f.max, Math.max(f.min, v)) : DEFAULT_PROFILE[f.key];
    });
    return next;
  }

  function renderSettings() {
    var form = $('#settings-form');
    form.innerHTML = profileFormHtml('set', profile) +
      '<div class="field-full sheet-actions"><button class="btn btn-ghost" type="button" id="settings-default">恢復預設</button>' +
      '<button class="btn btn-primary" type="submit">儲存</button></div>';
    renderBmi();
  }

  function renderBmi() {
    var h = profile.height / 100;
    var bmi = profile.weight / (h * h);
    var label, hint;
    if (bmi < 18.5) { label = '體重過輕'; hint = '可以搭配肌力訓練並注意營養攝取。'; }
    else if (bmi < 24) { label = '健康體位'; hint = '保持得很好！繼續維持規律運動。'; }
    else if (bmi < 27) { label = '過重'; hint = '每週累積 150 分鐘以上的有氧運動會很有幫助。'; }
    else { label = '肥胖'; hint = '建議從低衝擊運動開始，例如健走、騎車或游泳。'; }
    $('#bmi-card').innerHTML = '<span class="bmi-num">' + bmi.toFixed(1) + '</span>' +
      '<span class="bmi-text"><b>BMI · ' + label + '</b><span class="muted">' + hint + '</span></span>';
  }

  $('#settings-form').addEventListener('submit', function (e) {
    e.preventDefault();
    profile = readProfileForm(e.currentTarget, 'set');
    save(KEYS.profile, profile);
    renderSettings();
    renderRecords();
    toast('身體數據已儲存');
  });
  $('#settings-form').addEventListener('click', function (e) {
    if (e.target.id !== 'settings-default') return;
    profile = Object.assign({}, DEFAULT_PROFILE);
    save(KEYS.profile, profile);
    renderSettings();
    renderRecords();
    toast('已恢復預設值');
  });

  $('#clear-records').addEventListener('click', function () {
    if (!records.length) { toast('目前沒有紀錄'); return; }
    if (!confirm('確定要清除全部 ' + records.length + ' 筆運動紀錄嗎？此動作無法復原。')) return;
    records = [];
    save(KEYS.records, records);
    renderRecords();
    toast('已清除所有紀錄');
  });

  $('#reset-all').addEventListener('click', function () {
    if (!confirm('確定要重設 App 嗎？所有紀錄與身體數據都會被清除。')) return;
    remove(KEYS.records);
    remove(KEYS.profile);
    remove(KEYS.onboarded);
    records = [];
    profile = Object.assign({}, DEFAULT_PROFILE);
    renderAll();
    showView('view-log');
    showOnboarding();
  });

  // ---------------- 首次使用 ----------------

  function showOnboarding() {
    $('#onboard-form').innerHTML = profileFormHtml('onb', profile);
    $('#onboard-overlay').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function finishOnboarding() {
    save(KEYS.onboarded, true);
    save(KEYS.profile, profile);
    $('#onboard-overlay').hidden = true;
    document.body.style.overflow = '';
    renderAll();
  }
  $('#onboard-form').addEventListener('submit', function (e) {
    e.preventDefault();
    profile = readProfileForm(e.currentTarget, 'onb');
    finishOnboarding();
    toast('設定完成，開始運動吧！');
  });
  $('#onboard-skip').addEventListener('click', function () {
    profile = Object.assign({}, DEFAULT_PROFILE);
    finishOnboarding();
    toast('已使用預設值，可在設定中修改');
  });

  // ---------------- 啟動 ----------------

  function renderAll() {
    renderCategories();
    renderRecords();
    renderTips();
    renderSettings();
  }

  renderAll();
  if (!load(KEYS.onboarded, false)) showOnboarding();
})();
