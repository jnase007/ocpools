// OC Pools — Floating Pool Chemistry Calculator Widget
(function() {
  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #calcFloat {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      background: linear-gradient(135deg, #0b426e 0%, #015da1 100%);
      color: #fff; border: none; padding: 14px 22px; cursor: pointer;
      font-family: 'DM Sans', system-ui, sans-serif; font-size: 13px; font-weight: 600;
      letter-spacing: 0.15em; text-transform: uppercase;
      box-shadow: 0 8px 30px rgba(0,0,0,0.18); transition: all 0.3s ease;
      display: flex; align-items: center; gap: 8px;
    }
    #calcFloat:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.25); }
    #calcOverlay {
      position: fixed; inset: 0; z-index: 10000; background: rgba(0,0,0,0.5);
      display: none; align-items: center; justify-content: center;
      backdrop-filter: blur(2px); padding: 16px;
    }
    #calcOverlay.show { display: flex; }
    #calcModal {
      background: #fff; width: 100%; max-width: 560px; max-height: 90vh;
      overflow-y: auto; position: relative; padding: 0;
      box-shadow: 0 25px 80px rgba(0,0,0,0.2);
    }
    #calcModal::-webkit-scrollbar { width: 6px; }
    #calcModal::-webkit-scrollbar-thumb { background: #d5c7b3; border-radius: 3px; }
    .calc-header {
      background: linear-gradient(135deg, #072a49 0%, #0b426e 100%);
      padding: 28px 32px; color: #fff; position: sticky; top: 0; z-index: 1;
    }
    .calc-header h3 { font-family: 'DM Serif Display', Georgia, serif; font-size: 1.5rem; margin: 0 0 4px; }
    .calc-header p { font-size: 14px; opacity: 0.6; margin: 0; font-weight: 300; }
    .calc-close {
      position: absolute; top: 20px; right: 20px; background: none; border: none;
      color: rgba(255,255,255,0.5); font-size: 20px; cursor: pointer; transition: color 0.2s;
    }
    .calc-close:hover { color: #fff; }
    .calc-body { padding: 28px 32px; }
    .calc-label {
      display: block; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase;
      color: #b3967b; font-weight: 600; margin-bottom: 6px;
    }
    .calc-input {
      width: 100%; border: 1px solid #e5e7eb; padding: 10px 14px; font-size: 15px;
      color: #1f2937; font-family: 'DM Sans', system-ui, sans-serif;
      transition: border-color 0.2s; outline: none; box-sizing: border-box;
    }
    .calc-input:focus { border-color: #015da1; }
    .calc-input::placeholder { color: #9ca3af; }
    .calc-hint { font-size: 11px; color: #9ca3af; margin-top: 3px; }
    .calc-vol-btns { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
    .calc-vol-btn {
      border: 1px solid #e5e7eb; background: #fff; padding: 7px 16px; font-size: 13px;
      color: #6b7280; cursor: pointer; font-family: 'DM Sans', system-ui, sans-serif;
      transition: all 0.2s;
    }
    .calc-vol-btn:hover, .calc-vol-btn.active { border-color: #015da1; color: #015da1; background: #f0f7ff; }
    .calc-toggle {
      display: flex; align-items: center; gap: 10px; margin: 20px 0 8px;
      font-size: 14px; color: #4b5563; cursor: pointer; user-select: none;
    }
    .calc-toggle input { display: none; }
    .calc-switch {
      width: 44px; height: 24px; background: #d1d5db; border-radius: 12px;
      position: relative; transition: background 0.3s; flex-shrink: 0;
    }
    .calc-switch::after {
      content: ''; position: absolute; top: 2px; left: 2px;
      width: 20px; height: 20px; background: #fff; border-radius: 50%;
      transition: transform 0.3s;
    }
    .calc-toggle input:checked + .calc-switch { background: #015da1; }
    .calc-toggle input:checked + .calc-switch::after { transform: translateX(20px); }
    .calc-salt-fields { display: none; }
    .calc-salt-fields.show { display: block; }
    .calc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 480px) { .calc-grid { grid-template-columns: 1fr; } }
    .calc-btn {
      width: 100%; background: #111827; color: #fff; border: none; padding: 14px;
      font-size: 13px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
      cursor: pointer; font-family: 'DM Sans', system-ui, sans-serif;
      transition: background 0.2s; margin-top: 24px;
    }
    .calc-btn:hover { background: #1f2937; }
    .calc-result {
      border: 1px solid; padding: 16px; margin-bottom: 12px;
    }
    .calc-result.ok { background: #f0fdf4; border-color: #bbf7d0; }
    .calc-result.low { background: #fef2f2; border-color: #fecaca; }
    .calc-result.high { background: #eff6ff; border-color: #bfdbfe; }
    .calc-result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .calc-result-label { font-family: 'DM Serif Display', Georgia, serif; font-size: 16px; color: #111827; display: flex; align-items: center; gap: 6px; }
    .calc-badge {
      font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
      font-weight: 700; padding: 2px 8px;
    }
    .calc-badge.ok { background: #dcfce7; color: #166534; }
    .calc-badge.low { background: #fee2e2; color: #991b1b; }
    .calc-badge.high { background: #dbeafe; color: #1e40af; }
    .calc-result-meta { font-size: 12px; color: #9ca3af; margin-bottom: 6px; }
    .calc-result-action { font-size: 14px; color: #374151; line-height: 1.6; }
    .calc-result-action strong { color: #111827; }
    .calc-cta {
      background: #faf8f5; border: 1px solid #e6ddd0; padding: 20px; text-align: center;
      margin-top: 20px;
    }
    .calc-cta p { font-size: 14px; color: #6b7280; margin: 0 0 12px; }
    .calc-cta a {
      display: inline-block; background: #111827; color: #fff; padding: 10px 24px;
      font-size: 12px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase;
      text-decoration: none; transition: background 0.2s;
    }
    .calc-cta a:hover { background: #1f2937; }
    .calc-results-wrap { display: none; padding: 0 32px 28px; }
    .calc-results-wrap.show { display: block; }
    .calc-divider { border: none; border-top: 1px solid #f3f4f6; margin: 0 0 20px; }
    .calc-results-title { font-family: 'DM Serif Display', Georgia, serif; font-size: 18px; color: #111827; margin: 0 0 16px; }
  `;
  document.head.appendChild(style);

  // Floating button
  const btn = document.createElement('button');
  btn.id = 'calcFloat';
  btn.innerHTML = '<i class="fa-solid fa-flask"></i> Check My Levels';
  document.body.appendChild(btn);

  // Overlay + Modal
  const overlay = document.createElement('div');
  overlay.id = 'calcOverlay';
  overlay.innerHTML = `
    <div id="calcModal">
      <div class="calc-header">
        <button class="calc-close" id="calcCloseBtn"><i class="fa-solid fa-xmark"></i></button>
        <h3>Pool Chemistry Calculator</h3>
        <p>Enter your readings — we'll tell you what to add.</p>
      </div>
      <div class="calc-body">
        <div style="margin-bottom:20px">
          <span class="calc-label">Pool Volume (gallons)</span>
          <div class="calc-vol-btns">
            <button class="calc-vol-btn" data-vol="5000">5,000</button>
            <button class="calc-vol-btn active" data-vol="10000">10,000</button>
            <button class="calc-vol-btn" data-vol="15000">15,000</button>
            <button class="calc-vol-btn" data-vol="20000">20,000</button>
          </div>
          <input type="number" class="calc-input" id="cVol" value="10000" min="1000" max="100000" placeholder="Or enter custom">
        </div>

        <label class="calc-toggle" id="saltToggle">
          <input type="checkbox" id="cSaltToggle">
          <span class="calc-switch"></span>
          <span>Salt water pool</span>
        </label>

        <div class="calc-salt-fields" id="saltFields">
          <div style="margin-bottom:16px; margin-top:12px">
            <span class="calc-label">Salt Level (ppm)</span>
            <input type="number" class="calc-input" id="cSalt" step="100" min="0" max="10000" placeholder="e.g. 2800">
            <p class="calc-hint">Ideal: 2,700 – 3,400 ppm (check your cell manual)</p>
          </div>
          <div style="margin-bottom:16px">
            <span class="calc-label">CYA / Stabilizer (ppm)</span>
            <input type="number" class="calc-input" id="cCYA" step="1" min="0" max="200" placeholder="e.g. 25">
            <p class="calc-hint">Ideal: 30 – 50 ppm (critical for salt pools)</p>
          </div>
        </div>

        <div class="calc-grid" style="margin-top:16px">
          <div>
            <span class="calc-label">Current pH</span>
            <input type="number" class="calc-input" id="cPH" step="0.1" min="5" max="10" placeholder="e.g. 7.0">
            <p class="calc-hint">Ideal: 7.2 – 7.6</p>
          </div>
          <div>
            <span class="calc-label">Free Chlorine (ppm)</span>
            <input type="number" class="calc-input" id="cCL" step="0.1" min="0" max="20" placeholder="e.g. 1.0">
            <p class="calc-hint">Ideal: 2 – 4 ppm</p>
          </div>
          <div>
            <span class="calc-label">Total Alkalinity (ppm)</span>
            <input type="number" class="calc-input" id="cTA" step="1" min="0" max="500" placeholder="e.g. 60">
            <p class="calc-hint">Ideal: 80 – 120 ppm</p>
          </div>
          <div>
            <span class="calc-label">Calcium Hardness (ppm)</span>
            <input type="number" class="calc-input" id="cCH" step="1" min="0" max="1000" placeholder="e.g. 150">
            <p class="calc-hint">Ideal: 200 – 400 ppm</p>
          </div>
        </div>

        <button class="calc-btn" id="calcRunBtn">Calculate What to Add</button>
      </div>
      <div class="calc-results-wrap" id="calcResultsWrap">
        <hr class="calc-divider">
        <h3 class="calc-results-title">Your Results</h3>
        <div id="calcResultsList"></div>
        <div class="calc-cta">
          <p>Want us to handle this for you?</p>
          <a href="/index.html#contact">Get a Free Quote</a>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Volume buttons
  overlay.querySelectorAll('.calc-vol-btn').forEach(b => {
    b.addEventListener('click', () => {
      overlay.querySelectorAll('.calc-vol-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      document.getElementById('cVol').value = b.dataset.vol;
    });
  });

  // Salt toggle
  document.getElementById('cSaltToggle').addEventListener('change', function() {
    document.getElementById('saltFields').classList.toggle('show', this.checked);
  });

  // Open / close
  btn.addEventListener('click', () => overlay.classList.add('show'));
  document.getElementById('calcCloseBtn').addEventListener('click', () => overlay.classList.remove('show'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('show'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.classList.remove('show'); });

  // Calculate
  document.getElementById('calcRunBtn').addEventListener('click', runCalc);

  function runCalc() {
    const vol = parseFloat(document.getElementById('cVol').value) || 10000;
    const ph = parseFloat(document.getElementById('cPH').value);
    const cl = parseFloat(document.getElementById('cCL').value);
    const ta = parseFloat(document.getElementById('cTA').value);
    const ch = parseFloat(document.getElementById('cCH').value);
    const isSalt = document.getElementById('cSaltToggle').checked;
    const salt = parseFloat(document.getElementById('cSalt').value);
    const cya = parseFloat(document.getElementById('cCYA').value);
    const r = vol / 10000;
    const res = [];

    // pH
    if (!isNaN(ph)) {
      if (ph < 7.2) {
        const oz = ((7.4 - ph) / 0.2 * 7 * r).toFixed(0);
        res.push({ label:'pH', status:'low', current:ph, target:'7.4',
          action:`Add <strong>${oz} oz soda ash</strong> (pH Increaser) to raise pH from ${ph} to ~7.4. Add slowly with pump running, retest after 20 min. <br><em>⏱ Wait 20–30 min before swimming.</em>` });
      } else if (ph > 7.6) {
        const oz = ((ph - 7.4) / 0.2 * 10 * r).toFixed(0);
        const cups = ((ph - 7.4) / 0.2 * 0.75 * r).toFixed(1);
        let note = isSalt ? ' <em>Salt pools run high pH naturally — you\'ll dose acid weekly.</em>' : '';
        res.push({ label:'pH', status:'high', current:ph, target:'7.4',
          action:`Add <strong>${oz} oz dry acid</strong> OR <strong>${cups} cups muriatic acid</strong> to lower pH from ${ph} to ~7.4. Pour into deep end with pump on. <br><em>⏱ Wait 15–30 min before swimming.</em>${note}` });
      } else {
        res.push({ label:'pH', status:'ok', current:ph, target:'7.2–7.6', action:'pH is in range. No adjustment needed.' });
      }
    }

    // Chlorine
    if (!isNaN(cl)) {
      if (cl < 2) {
        const lbs = (Math.max(3 - cl, 1) / 2.5 * r).toFixed(1);
        const gals = lbs;
        const note = isSalt ? ' Also check your salt cell — it may not be generating enough. Inspect for scale buildup.' : '';
        res.push({ label:'Free Chlorine', status:'low', current:cl+' ppm', target:'3 ppm',
          action: cl < 1
            ? `<strong>Shock your pool!</strong> Add <strong>${(1*r).toFixed(1)} lbs granular shock</strong> OR <strong>${(1*r).toFixed(1)} gal liquid chlorine</strong>. Run pump 8+ hrs. <br><em>⏱ Do NOT swim for at least 8 hours — retest and confirm chlorine is below 4 ppm.</em>${note}`
            : `Add <strong>${lbs} lbs granular chlorine</strong> OR <strong>${gals} gal liquid chlorine</strong> to raise from ${cl} to ~3 ppm. Broadcast into deep end at dusk. <br><em>⏱ Wait 30 min before swimming (with pump running).</em>${note}` });
      } else if (cl > 4) {
        const note = isSalt ? ' Turn your salt cell output down or set to standby mode.' : '';
        res.push({ label:'Free Chlorine', status:'high', current:cl+' ppm', target:'2–4 ppm',
          action:`<strong>Stop adding chlorine.</strong>${note} Run pump and let sunlight burn it off. Retest in 24–48 hrs. ${cl > 8 ? 'Consider partial drain — levels are very high.' : 'Don\'t swim until chlorine drops below 4 ppm — retest to confirm.'}` });
      } else {
        res.push({ label:'Free Chlorine', status:'ok', current:cl+' ppm', target:'2–4 ppm', action:'Chlorine is in range. No adjustment needed.' });
      }
    }

    // Total Alkalinity
    if (!isNaN(ta)) {
      if (ta < 80) {
        const lbs = ((100 - ta) / 10 * 1.5 * r).toFixed(1);
        res.push({ label:'Total Alkalinity', status:'low', current:ta+' ppm', target:'100 ppm',
          action:`Add <strong>${lbs} lbs baking soda</strong> (Alkalinity Increaser) to raise from ${ta} to ~100 ppm. Add max 2 lbs at a time, retest after 6 hrs. Always adjust alkalinity before pH. <br><em>⏱ Wait 20–30 min before swimming.</em>` });
      } else if (ta > 120) {
        const qts = ((ta - 100) / 10 * 1 * r).toFixed(1);
        res.push({ label:'Total Alkalinity', status:'high', current:ta+' ppm', target:'100 ppm',
          action:`Add <strong>${qts} qts muriatic acid</strong> to lower from ${ta} to ~100 ppm. Max 1 qt per 10K gal at a time. Pour into deep end, retest after 4 hrs. This will also lower pH. <br><em>⏱ Wait 30 min before swimming.</em>` });
      } else {
        res.push({ label:'Total Alkalinity', status:'ok', current:ta+' ppm', target:'80–120 ppm', action:'Alkalinity is in range. No adjustment needed.' });
      }
    }

    // Calcium Hardness
    if (!isNaN(ch)) {
      if (ch < 200) {
        const lbs = ((300 - ch) / 10 * 1.25 * r).toFixed(1);
        res.push({ label:'Calcium Hardness', status:'low', current:ch+' ppm', target:'300 ppm',
          action:`Add <strong>${lbs} lbs calcium chloride</strong> to raise from ${ch} to ~300 ppm. Dissolve in a bucket first, pour around edges. Max 5 lbs at a time, retest next day. <br><em>⏱ Wait 2–4 hours before swimming — calcium chloride generates heat.</em>` });
      } else if (ch > 400) {
        const pct = Math.min(Math.round(((ch - 300) / ch) * 100), 33);
        res.push({ label:'Calcium Hardness', status:'high', current:ch+' ppm', target:'200–400 ppm',
          action:`<strong>Partial drain & refill required.</strong> Drain ~${pct}% of water and refill with fresh. No chemical lowers calcium. ${isSalt ? 'Be careful — salt pools scale faster with high calcium. Inspect your cell. <br><em>⏱ Safe to swim once refill is complete and water is rebalanced.</em>' : 'Consider calling a pro — improper draining can damage plaster. <br><em>⏱ Safe to swim once refill is complete and water is rebalanced.</em>'}` });
      } else {
        res.push({ label:'Calcium Hardness', status:'ok', current:ch+' ppm', target:'200–400 ppm', action:'Calcium hardness is in range. No adjustment needed.' });
      }
    }

    // Salt (salt pools only)
    if (isSalt && !isNaN(salt)) {
      if (salt < 2700) {
        // ~0.83 lbs salt per 10K gal raises 100 ppm... actually ~83 lbs per 10K raises 1000 ppm
        // Standard: add ~30 lbs per 10K gal to raise ~360 ppm
        const deficit = 3200 - salt;
        const lbs = (deficit / 360 * 30 * r).toFixed(0);
        res.push({ label:'Salt Level', status:'low', current:salt+' ppm', target:'3,200 ppm',
          action:`Add <strong>${lbs} lbs pool-grade salt</strong> to raise from ${salt} to ~3,200 ppm. Spread around pool perimeter, brush to dissolve. Run pump 24 hrs. Your cell can't generate chlorine below ~2,500 ppm. <br><em>⏱ Wait 20–30 min before swimming (after salt is brushed in and dissolved).</em>` });
      } else if (salt > 3400) {
        const pct = Math.min(Math.round(((salt - 3200) / salt) * 100), 25);
        res.push({ label:'Salt Level', status:'high', current:salt+' ppm', target:'2,700–3,400 ppm',
          action:`<strong>Partially drain & refill</strong> — remove ~${pct}% of water and replace with fresh. No chemical removes salt. High salt corrodes equipment and metal fixtures. <br><em>⏱ Safe to swim once refill is complete and water is rebalanced.</em> ${salt > 4000 ? '<strong>Warning: levels this high can damage your salt cell.</strong>' : ''}` });
      } else {
        res.push({ label:'Salt Level', status:'ok', current:salt+' ppm', target:'2,700–3,400 ppm', action:'Salt level is in range. Your cell should be generating properly.' });
      }
    }

    // CYA / Stabilizer (salt pools)
    if (isSalt && !isNaN(cya)) {
      if (cya < 30) {
        // ~3 lbs CYA per 10K gal raises ~30 ppm
        const lbs = ((50 - cya) / 30 * 3 * r).toFixed(1);
        res.push({ label:'CYA / Stabilizer', status:'low', current:cya+' ppm', target:'30–50 ppm',
          action:`Add <strong>${lbs} lbs cyanuric acid</strong> (stabilizer) to raise from ${cya} to ~50 ppm. Dissolve in a sock/stocking in the skimmer basket. Takes 3–5 days to fully dissolve. <strong>Critical for salt pools</strong> — without CYA, sunlight destroys chlorine faster than your cell makes it. <br><em>⏱ Wait 20 min after stabilizer dissolves before swimming.</em>` });
      } else if (cya > 50) {
        const note = cya > 80 ? '<strong>Warning:</strong> Above 80 ppm, chlorine effectiveness drops significantly. Partial drain is urgent.' : '';
        const pct = Math.min(Math.round(((cya - 40) / cya) * 100), 40);
        res.push({ label:'CYA / Stabilizer', status:'high', current:cya+' ppm', target:'30–50 ppm',
          action:`<strong>Partially drain & refill</strong> — remove ~${pct}% of water. No chemical lowers CYA. ${note}` });
      } else {
        res.push({ label:'CYA / Stabilizer', status:'ok', current:cya+' ppm', target:'30–50 ppm', action:'Stabilizer is in range. Your chlorine is protected from UV.' });
      }
    }

    // Render results
    const container = document.getElementById('calcResultsList');
    const wrap = document.getElementById('calcResultsWrap');

    if (res.length === 0) {
      container.innerHTML = '<p style="color:#9ca3af;font-size:14px">Enter at least one reading to see results.</p>';
      wrap.classList.add('show');
      return;
    }

    const icons = { ok:'fa-check', low:'fa-arrow-down', high:'fa-arrow-up' };
    const iconColors = { ok:'color:#22c55e', low:'color:#f87171', high:'color:#60a5fa' };
    const badgeClass = { ok:'ok', low:'low', high:'high' };
    const badgeText = { ok:'In Range', low:'Too Low', high:'Too High' };

    container.innerHTML = res.map(r => `
      <div class="calc-result ${r.status}">
        <div class="calc-result-header">
          <span class="calc-result-label"><i class="fa-solid ${icons[r.status]}" style="${iconColors[r.status]}"></i> ${r.label}</span>
          <span class="calc-badge ${badgeClass[r.status]}">${badgeText[r.status]}</span>
        </div>
        <p class="calc-result-meta">Current: <strong style="color:#111827">${r.current}</strong> · Target: ${r.target}</p>
        <p class="calc-result-action">${r.action}</p>
      </div>
    `).join('');

    wrap.classList.add('show');
    wrap.scrollIntoView({ behavior:'smooth', block:'start' });
  }
})();
