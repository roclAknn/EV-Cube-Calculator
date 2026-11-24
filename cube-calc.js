/**
 * cube-calc.js - キューブ確率計算ロジック＆UIコントローラー
 */

/*==================== キューブ定義＆設定データ ====================*/
const cubetypes = [
  ["レッドキューブ（ネオ）", regularKMS, "red", 0],
  ["ブラックキューブ（メガ）", regularKMS, "black", 1],
  ["名匠キューブ・イベントリング", regularKMS, "meister", 2],
  ["職人キューブ", regularKMS, "craftman", 3],
  ["怪しいキューブ", regularKMS, "occult", 4],
  ["アディショナル・ホワイトアディ", additionalKMS, "additional", 5],
  ["怪しいアディショナル（レアアディ）", additionalKMS, "rareadditional", 6],
  ["TMS/ユニキューブ", regularTMS, "uni", 7],
  ["***/ヘキサキューブ（無償テーブル）", regularKMS, "hexa", 8],
  ["KMS/プライムキューブ", regularKMS, "prime", 9],
  ["KMS/プライムアディショナル", additionalKMS, "primeadditional", 10]
];

const cubegroups = [
  ["KMS / 上潜在 / 有償テーブル", [0, 1]],
  ["KMS / 上潜在 / 無償テーブル", [2, 3, 4]],
  ["KMS / 下潜在 / 共通テーブル", [5, 6]],
  ["特殊キューブ", [7, 8]],
  ["JMS未実装", [9, 10]]
];

const tempeqplv = [250, 200, 160, 150, 140, 130, 120, 110, 100, 0];

window.selectedcube = null;
window.selectedequipmenttype = -1;
window.selectedequipmentlevel = -1;
window.selectedrank = -1;
window.selectedmaxline = 3;
window.checkedapplyerrlist = true;
window.exportdata = {};
window.scoretemps = {};

/* Decimal.jsの設定 */
Decimal.set({ precision: 40 });
Decimal.one = new Decimal(1);
Decimal.zero = new Decimal(0);
window.calcRoundDegit = 25;   // 出力累積計算の丸め位置
window.exportRoundDegit = 12; // 出力結果の丸め位置

/*==================== 初期化 ====================*/
function initialize() {
  if (typeof buildHeader === "function") {
    buildHeader(
      "/MapleStory/ キューブの確率計算器",
      [["GitHub(使い方)", "https://github.com/roclAknn/EV-Cube-Calculator/"]]
    );
  }

  initcubedatas();
  UIinitialize();
  initScoreModal();
  createTable(ondo());
}

/*==================== UI初期化・生成 ====================*/
function UIinitialize() {
  initCustomCubeSelect();
  initCustomEqpSelect();

  // 装備レベル（ドロップダウン付き）
  const eqpLvInput = document.getElementById("input-equipmentlevel");
  eqpLvInput.parentElement.appendChild(createDropdown(eqpLvInput, tempeqplv, onchangesetting));
  eqpLvInput.disabled = false;

  // 潜在等級
  const rankSel = document.getElementById("input-potentialrank");
  let rankOptions = '<option value="" hidden>未選択</option>';
  commons.ranknames.slice(0, 4).forEach((name, i) => {
    rankOptions += `<option value="${i}" ${i === 0 ? "selected" : ""}>${name}</option>`;
  });
  rankSel.innerHTML = rankOptions;
  rankSel.disabled = false;

  // ユニキューブ用 変更候補行数
  const maxlineSel = document.getElementById("input-maxline");
  maxlineSel.onchange = onchangesetting;

  // ヘッダー開閉（アコーディオン）
  const toggleBtn = document.getElementById("panel-toggle-btn");
  if (toggleBtn) {
    toggleBtn.onclick = function () {
      const headerDiv = document.getElementById("header-config-panel");
      const isClosed = headerDiv.classList.toggle("collapsed");
      toggleBtn.classList.toggle("is-closed", isClosed);
    };
  }

  // 出力タイプ切り替え設定
  initExportTypeControls();

  // 有効オプション絞り込みスライダー（ドラッグ対応）
  initDisplayAmountSlider();

  // 初期選択（ネオキューブ、武器、レジェンダリー）
  selectCubeByIndex(0);
  selectEqpByIndex(0);
  rankSel.value = "0";

  onchangesetting();
  createTable({ rank: -1, cubename: "", list: {} });
}

/* 独自キューブ選択SELECT */
function initCustomCubeSelect() {
  const trigger = document.getElementById("cube-select-trigger");
  const dropdown = document.getElementById("cube-select-dropdown");

  let html = "";
  cubegroups.forEach(([groupName, indices]) => {
    if (indices.length === 0) return;
    html += `<div class="select-group"><div class="select-group-title">${groupName}</div>`;
    indices.forEach(idx => {
      const [name, , , imgIdx] = cubetypes[idx];
      html += `
        <div class="custom-select-item" data-cube-index="${idx}">
          <span class="cube-icon-wrapper"><span class="cube-icon-thumb" style="background-position: 50% ${-32 * imgIdx}px;"></span></span>
          <span class="custom-select-item-name">${name}</span>
        </div>
      `;
    });
    html += `</div>`;
  });
  dropdown.innerHTML = html;

  trigger.onclick = function (e) {
    e.stopPropagation();
    // 装備のドロップダウンが開いていれば閉じる
    document.getElementById("eqp-select-dropdown")?.classList.remove("open");
    document.getElementById("eqp-select-trigger")?.classList.remove("active");

    const isOpen = dropdown.classList.toggle("open");
    trigger.classList.toggle("active", isOpen);
  };

  dropdown.onclick = function (e) {
    const item = e.target.closest(".custom-select-item");
    if (!item) return;
    const idx = +item.dataset.cubeIndex;
    selectCubeByIndex(idx);
    dropdown.classList.remove("open");
    trigger.classList.remove("active");
  };
}

function selectCubeByIndex(idx) {
  const [name, , , imgIdx] = cubetypes[idx];
  const trigger = document.getElementById("cube-select-trigger");
  trigger.querySelector(".cube-selected-icon").style.backgroundPosition = `50% ${-32 * imgIdx}px`;
  trigger.querySelector(".cube-selected-name").innerText = name;
  trigger.dataset.value = idx;

  onchangecube();
}

function getSelectedCubeIndex() {
  const trigger = document.getElementById("cube-select-trigger");
  const val = trigger.dataset.value;
  return val === undefined || val === "" ? null : +val;
}

/* 独自装備選択SELECT */
function initCustomEqpSelect() {
  const trigger = document.getElementById("eqp-select-trigger");
  const dropdown = document.getElementById("eqp-select-dropdown");

  let html = `<div class="select-group">`;
  commons.equipmentnames.forEach((name, idx) => {
    html += `
      <div class="custom-select-item" data-eqp-index="${idx}">
        <span class="eqp-icon-wrapper"><span class="eqp-icon-thumb" style="background-position: 50% ${-38 * idx}px;"></span></span>
        <span class="custom-select-item-name">${name}</span>
      </div>
    `;
  });
  html += `</div>`;
  dropdown.innerHTML = html;

  trigger.onclick = function (e) {
    e.stopPropagation();
    // キューブのドロップダウンが開いていれば閉じる
    document.getElementById("cube-select-dropdown")?.classList.remove("open");
    document.getElementById("cube-select-trigger")?.classList.remove("active");

    const isOpen = dropdown.classList.toggle("open");
    trigger.classList.toggle("active", isOpen);
  };

  dropdown.onclick = function (e) {
    const item = e.target.closest(".custom-select-item");
    if (!item) return;
    const idx = +item.dataset.eqpIndex;
    selectEqpByIndex(idx);
    dropdown.classList.remove("open");
    trigger.classList.remove("active");
  };

  document.addEventListener("click", () => {
    dropdown.classList.remove("open");
    trigger.classList.remove("active");
    document.getElementById("cube-select-dropdown")?.classList.remove("open");
    document.getElementById("cube-select-trigger")?.classList.remove("active");
  });
}

function selectEqpByIndex(idx) {
  const name = commons.equipmentnames[idx];
  const trigger = document.getElementById("eqp-select-trigger");
  trigger.querySelector(".eqp-selected-icon").style.backgroundPosition = `50% ${-38 * idx}px`;
  trigger.querySelector(".eqp-selected-name").innerText = name;
  trigger.dataset.value = idx;

  onchangesetting();
}

function getSelectedEqpIndex() {
  const trigger = document.getElementById("eqp-select-trigger");
  const val = trigger.dataset.value;
  return val === undefined || val === "" ? null : +val;
}

/* キューブ変更時処理 */
function onchangecube() {
  const val = getSelectedCubeIndex();
  if (val === null) return;
  const cubeDef = cubetypes[val];
  const data = cubeDef[1];
  const cubename = cubeDef[2];
  const ratetable = data.ratetable[cubename];

  const rankSel = document.getElementById("input-potentialrank");
  let isSelected = false;
  let primary = null;

  for (let opt of rankSel.options) {
    let optVal = opt.value;
    if (optVal === "") continue;
    if (ratetable[+optVal]) {
      opt.disabled = false;
      if (opt.selected) isSelected = true;
      if (primary === null) primary = opt;
    } else {
      opt.disabled = true;
    }
  }
  if (!isSelected) {
    rankSel.selectedIndex = primary == null ? 0 : primary.index;
  }

  // ユニキューブ用 行数設定の表示切替
  const maxlineRow = document.getElementById("form-row-maxline");
  if (maxlineRow) {
    maxlineRow.style.display = cubename === "uni" ? "flex" : "none";
  }

  onchangesetting();
  updateCubeInfoView();
}

/* 設定変更時総合処理 */
function onchangesetting() {
  const cubeIdx = getSelectedCubeIndex();
  const eqpIdx = getSelectedEqpIndex();
  const eqpLvInput = document.getElementById("input-equipmentlevel");
  const rankSel = document.getElementById("input-potentialrank");
  const maxlineSel = document.getElementById("input-maxline");

  if (cubeIdx === null) return;
  const cubeDef = cubetypes[cubeIdx];
  window.selectedcube = cubeDef;

  const tempExport = {
    cubename: cubeDef[2],
    eqp: eqpIdx === null ? -1 : eqpIdx,
    lv: eqpLvInput.validity.badInput || +eqpLvInput.value < 0 ? -1 : +eqpLvInput.value,
    rank: rankSel.value === "" ? -1 : +rankSel.value
  };

  eqpLvInput.classList.toggle("error", tempExport.lv < 0);

  window.selectedequipmenttype = tempExport.eqp;
  window.selectedequipmentlevel = tempExport.lv;
  window.selectedrank = tempExport.rank;
  window.selectedmaxline = tempExport.cubename === "uni" ? +(maxlineSel?.value || 1) : 3;
  window.checkedapplyerrlist = true;

  if (tempExport.cubename) {
    if (tempExport.eqp < 0 || tempExport.lv < 0 || tempExport.rank < 0) {
      if (tempExport.rank >= 0) {
        createTable({ rank: tempExport.rank, cubename: tempExport.cubename, list: {} });
      }
      return;
    }

    conditionUpdate();

    let hasDiff = false;
    const curExport = window.exportdata;
    ["cubename", "eqp", "rank", "lv"].forEach(k => {
      if (tempExport[k] !== curExport[k]) hasDiff = true;
    });

    if (hasDiff) {
      createcubetable(tempExport);
    } else {
      createTable(ondo());
    }
  }
}

/* コンディションバー（表示中設定）更新 */
function conditionUpdate() {
  const cubeDef = window.selectedcube;
  if (!cubeDef) return;

  const cubeImgIdx = cubeDef[3];
  const eqp = window.selectedequipmenttype;
  const lv = window.selectedequipmentlevel;
  const rank = window.selectedrank;

  const cubeIcon = document.getElementById("condition-cube-icon");
  cubeIcon.style.backgroundPosition = `50% ${-32 * cubeImgIdx}px`;

  const eqpIcon = document.getElementById("condition-eqp-icon");
  if (eqp >= 0) {
    eqpIcon.style.backgroundPosition = `50% ${-38 * eqp}px`;
  }

  document.getElementById("condition-level").innerText = `Lv.${lv}`;
  const rankBadge = document.getElementById("condition-rank");
  rankBadge.innerText = commons.ranknames[rank] || "";
  rankBadge.className = `rank-pill ${commons.rankclassnames[rank] || ""}`;
}

/*==================== キューブ情報表の描画（縦横入れ替え） ====================*/
function updateCubeInfoView() {
  const cubeDef = window.selectedcube;
  if (!cubeDef) return;

  const data = cubeDef[1];
  const cubename = cubeDef[2];
  const ratetable = data.ratetable[cubename];
  const upgtable = data.upgradetable[cubename];
  const remarks = data.remarks?.[cubename] || "";

  const container = document.getElementById("cube-info-panel");
  container.innerHTML = "";

  if (cubename === "hexa") {
    // ヘキサキューブ専用テーブル（等級非表示、2列上級率、備考表示）
    renderHexaCubeInfo(container, cubeDef, ratetable, remarks);
  } else {
    // 通常キューブテーブル（縦横入れ替え版）
    renderNormalCubeInfo(container, cubeDef, ratetable, upgtable, remarks);
  }
}

function renderNormalCubeInfo(container, cubeDef, ratetable, upgtable, remarks) {
  // 縦横を入れ替え：
  // 列: 項目名 | レジェンダリー | ユニーク | エピック | レア
  // 行: 1行目上級, 2行目上級, 3行目上級, 等級上昇
  // 等級に合わせて下線を引く（数値でなければ引かない）
  const rowLabels = ["1行目上級", "2行目上級", "3行目上級", "等級上昇"];
  const rankClasses = ["legendary", "unique", "epic", "rare"];
  const cubename = cubeDef[2];

  let tableHtml = `
    <div class="cube-info-card normal-card">
      <div class="cube-info-card-header summary-wrap">
        <span class="cube-info-title">キューブ情報</span>
      </div>
      <div class="cube-transposed-table">
        <div class="ct-row ct-header-row">
          <div class="ct-th-item">　</div>
          <div class="ct-th legendary">レジェ</div>
          <div class="ct-th unique">ユニーク</div>
          <div class="ct-th epic">エピック</div>
          <div class="ct-th rare">レア</div>
        </div>
  `;

  for (let r = 0; r < 4; r++) {
    tableHtml += `
      <div class="ct-row">
        <div class="ct-item-label">${rowLabels[r]}</div>
    `;

    for (let c = 0; c < 4; c++) {
      const rankClass = rankClasses[c];
      const rates = ratetable[c] || [];
      const upgProb = upgtable ? upgtable[c] : null;

      let valStr = "--";
      let isNumeric = false;

      if (r < 3) {
        if (cubename === "prime" || cubename === "primeadditional") {
          if (r === 0) {
            valStr = c === 0 ? "固定" : "--";
          } else if (rates[r - 1]) {
            const val = rates[r - 1][0];
            if (val > 0) {
              valStr = `${+(new Decimal(val).times(100))}%`;
              isNumeric = true;
            }
          }
        } else if (rates[r]) {
          const val = rates[r][0];
          if (val > 0) {
            valStr = `${+(new Decimal(val).times(100))}%`;
            isNumeric = true;
          }
        }
      } else {
        // 等級上昇確率
        if (typeof upgProb === "number" && upgProb > 0) {
          valStr = `${+(new Decimal(upgProb).times(100))}%`;
          isNumeric = true;
        }
      }

      // 数値の場合のみ等級色アンダーラインを引く
      const underlineClass = isNumeric ? `has-underline underline-${rankClass}` : "no-underline";
      tableHtml += `<div class="ct-cell ${rankClass} ${underlineClass}">
        <div class="ct-cell-text">${valStr}</div>
      </div>`;
    }

    tableHtml += `</div>`;
  }

  tableHtml += `</div>`;

  if (remarks) {
    tableHtml += `
      <div class="cube-remarks">
        <span class="remarks-badge">備考</span>
        <span class="remarks-text">${remarks}</span>
      </div>
    `;
  }
  tableHtml += `</div>`;

  container.innerHTML = tableHtml;
}

function renderHexaCubeInfo(container, cubeDef, ratetable, remarks) {
  const rates = ratetable[0] || [];

  let tableHtml = `
    <div class="cube-info-card hexa-card">
      <div class="cube-info-card-header summary-wrap">
        <span class="cube-info-title">キューブ情報</span>
      </div>
      <div class="hexa-grid-table">
        <div class="hexa-col">
          <div class="hexa-th">1～3行目 上級確率</div>
          <div class="hexa-row"><span>1行目</span><strong>${+(new Decimal(rates[0]?.[0] || 0).times(100))}%</strong></div>
          <div class="hexa-row"><span>2行目</span><strong>${+(new Decimal(rates[1]?.[0] || 0).times(100))}%</strong></div>
          <div class="hexa-row"><span>3行目</span><strong>${+(new Decimal(rates[2]?.[0] || 0).times(100))}%</strong></div>
        </div>
        <div class="hexa-col">
          <div class="hexa-th">4～6行目 上級確率</div>
          <div class="hexa-row"><span>4行目</span><strong>${+(new Decimal(rates[3]?.[0] || 0).times(100))}%</strong></div>
          <div class="hexa-row"><span>5行目</span><strong>${+(new Decimal(rates[4]?.[0] || 0).times(100))}%</strong></div>
          <div class="hexa-row"><span>6行目</span><strong>${+(new Decimal(rates[5]?.[0] || 0).times(100))}%</strong></div>
        </div>
      </div>
  `;

  if (remarks) {
    tableHtml += `
      <div class="cube-remarks">
        <span class="remarks-badge">備考</span>
        <span class="remarks-text">${remarks}</span>
      </div>
    `;
  }
  tableHtml += `</div>`;

  container.innerHTML = tableHtml;
}

/*==================== 出力設定コントロール（#displayToggleBtn 準拠） ====================*/
const exportType1Items = [
  { val: "numavg", label: "平均消費数[個]" },
  { val: "num50", label: "50%ライン[個]" },
  { val: "nump", label: "ライン[個]" },
  { val: "prob1", label: "で引く確率[x1]" },
  { val: "prob100", label: "で引く確率[x100]" },
  { val: "prob10000", label: "で引く確率[x10000]" }
];
let exportType1Index = 0;
let exportType2Index = 0; // 0: ">=", 1: "=="

function initExportTypeControls() {
  const toggleBtn1 = document.getElementById("displayToggleBtn");
  const toggleLabel1 = document.getElementById("displayToggleLabel");
  const paramNWrap = document.getElementById("paramNWrap");
  const paramNInput = document.getElementById("paramNInput");
  const paramPWrap = document.getElementById("paramPWrap");
  const paramPInput = document.getElementById("paramPInput");

  toggleLabel1.innerText = exportType1Items[exportType1Index].label;

  toggleBtn1.onclick = function () {
    exportType1Index = (exportType1Index + 1) % exportType1Items.length;
    const cur = exportType1Items[exportType1Index];
    toggleLabel1.innerText = cur.label;

    const isProb = /^prob/.test(cur.val);
    const isPLine = cur.val === "nump";

    paramNWrap.classList.toggle("hidden", !isProb);
    paramPWrap.classList.toggle("hidden", !isPLine);

    createTable.switch();
  };

  const condBtn = document.getElementById("conditionToggleBtn");
  condBtn.onclick = function () {
    exportType2Index = (exportType2Index + 1) % 2;
    condBtn.innerText = exportType2Index === 0 ? "スコア以上 (>=)" : "スコア一致 (==)";
    createTable.switch();
  };

  paramNInput.oninput = () => createTable.switch();
  paramPInput.oninput = () => createTable.switch();

  const priceInput = document.getElementById("exportPriceInput");
  priceInput.oninput = () => createTable.switch();
}

/* 有効オプション絞り込みスライダー（ドラッグ＆クリック対応） */
function initDisplayAmountSlider() {
  const slider = document.getElementById("filter-slider");
  const fill = document.getElementById("filter-slider-fill");
  const knob = document.getElementById("filter-slider-knob");
  const labels = ["主要のみ", "有効のみ", "すべて"];
  const filterLabel = document.getElementById("filter-slider-label");

  let posIdx = filterLabel.posIdx = 1;
  const positions = [5, 50, 95];
  let isDragging = false;

  function setSliderPos(idx) {
    posIdx = filterLabel.posIdx = Math.min(2, Math.max(0, idx));
    knob.style.left = `${positions[posIdx]}%`;
    fill.style.width = `${positions[posIdx]}%`;
    if (filterLabel) filterLabel.innerText = labels[posIdx];
    onchangedisplayamount(posIdx);
  }

  function handleMove(clientX) {
    if (clientX === 0) return;
    const rect = slider.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const step = rect.width / 3;
    const nextIdx = Math.min(2, Math.max(0, Math.floor(offsetX / step)));
    if (nextIdx !== posIdx) {
      setSliderPos(nextIdx);
    }
  }

  function onPointerDown(e) {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    handleMove(clientX);

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", onPointerUp);
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    handleMove(clientX);
  }

  function onPointerUp() {
    isDragging = false;
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("mouseup", onPointerUp);
    window.removeEventListener("touchmove", onPointerMove);
    window.removeEventListener("touchend", onPointerUp);
  }

  slider.addEventListener("mousedown", onPointerDown);
  slider.addEventListener("touchstart", onPointerDown, { passive: true });

  setSliderPos(1);
}

function onchangedisplayamount(val) {
  const divs = document.querySelectorAll("#potential-list-body .pot-row");
  if (divs.length === 0) return;

  let visiblenum = 0;

  divs.forEach(el => {
    const d = +el.dataset.potentialdepth;
    const isShow = d <= val;
    el.style.display = isShow ? "grid" : "none";
    if (!isShow) return;

    visiblenum++;
    // 交互にmaskedクラスを付与して背景色を変化
    el.classList.toggle("masked", visiblenum % 2 === 0);
  });
  createTable(ondo());
}

/*==================== 潜在能力一覧テーブル生成 ====================*/
function createcubetable(exportdata) {
  const data = window.selectedcube[1];
  const { cubename, eqp, rank, lv } = exportdata;
  window.exportdata = { ...exportdata, weights: [] };

  const ownerdiv = document.getElementById("potential-list-body");

  // 既存スコアを保持
  // scoretemps = {};
  const names = ownerdiv.querySelectorAll(".pot-name");
  const vals = ownerdiv.querySelectorAll(".pot-val");
  const scoreInputs = ownerdiv.querySelectorAll(".input-score");
  for (let i = 0; i < names.length; i++) {
    const name = names[i].innerHTML;
    const val = vals[i].innerHTML;
    const score = scoreInputs[i].value;
    if (checkValueType(scoreInputs[i].value) >= 0) {
      const pname = name + val;
      let temp = scoretemps[pname];
      if (!temp) scoretemps[pname] = temp = {};

      Object.assign(temp, {
        name, val, score // scoreは評価値ではなく式のまま。エラー式は弾く
      });
    }
  }

  // 潜在能力一覧を生成
  ownerdiv.innerHTML = "";

  const fragment = new DocumentFragment();
  createpotentialline(eqp, rank, lv);
  createpotentialline(eqp, rank + 1, lv);
  ownerdiv.appendChild(fragment);

  // 絞り込み適用
  const filterLabel = document.getElementById("filter-slider-label");
  const curFilter = filterLabel?.posIdx ?? 1;
  
  onchangedisplayamount(curFilter);

  function createpotentialline(eqp, rank, lv) {
    if (!data.equipmentpotential[cubename] || !data.equipmentpotential[cubename][eqp] || !data.equipmentpotential[cubename][eqp][rank]) {
      return;
    }

    const trdatas = [];
    let sumweight = 0;
    const weights = [0];

    data.equipmentpotential[cubename][eqp][rank].forEach(pdata => {
      const { name, id, weight, depth } = pdata;
      const val = pdata.getValue(lv);
      sumweight += weight;
      weights.push({ id, weight });
      trdatas.push({ name, val, weight, depth, id });
    });

    weights[0] = sumweight;
    window.exportdata.weights.push(weights);

    trdatas.forEach(trdata => {
      const { name, val, weight, depth, id } = trdata;
      const rankClass = commons.rankclassnames[rank];

      const rowdiv = document.createElement("div");
      rowdiv.className = `pot-row ${rankClass}`;
      rowdiv.dataset.potentialdepth = depth;
      rowdiv.dataset.potentialrank = rank;
      rowdiv.dataset.potentialid = id;

      const ratePct = (weight * 100 / sumweight).toFixed(4);

      rowdiv.innerHTML = `
        <div class="pot-col pot-btn-col"><button type="button" class="auto-btn" tabindex="-1">&gt;</button></div>
        <div class="pot-col pot-val">${val || ""}</div>
        <div class="pot-col pot-name" title="${name}">${name}</div>
        <div class="pot-col pot-score">
          <div class="score-input-wrap">
            <input type="text" inputmode="decimal" class="input-score input-score-${id} no-spin" value="">
            <span class="calc-preview"></span>
          </div>
        </div>
        <div class="pot-col pot-rate">${ratePct}%</div>
      `;

      const input = rowdiv.querySelector(".input-score");
      const btn = rowdiv.querySelector(".auto-btn");
      input.autoinput = val || 1;
      btn.score = input;
      btn.inittext = (val || "") + name;
      input.autobutton = btn;

      setupScoreInputBehavior(input);
      btn.onclick = onautoinput;

      // 復元
      const temp = scoretemps[name + (val || "")];
      if (temp && temp.score !== "") {
        input.value = temp.score;
        btn.classList.add("delete");
        btn.innerText = "×";
        updateScorePreview(input);
      }
      fragment.appendChild(rowdiv);
    });
  }
}

function setupScoreInputBehavior(input) {
  const wrap = input.closest(".score-input-wrap");
  const preview = wrap?.querySelector(".calc-preview");

  input.onfocus = function () {
    wrap?.classList.add("expanded");
    input.placeholder = "数値・式を入力";
    updateScorePreview(input);
  };

  input.onblur = function () {
    wrap?.classList.remove("expanded");
    input.placeholder = "";
    updateScorePreview(input);
  };

  input.oninput = oninputscore;
}

function updateScorePreview(input) {
  const wrap = input.closest(".score-input-wrap");
  const preview = wrap?.querySelector(".calc-preview");
  if (!preview) return;

  const val = input.value.trim();
  if (!val) {
    preview.innerText = "";
    input.title = "";
    return;
  }

  // 式が入力されている場合（+ - * / () を含むか、式として計算できる場合）
  if (/[+\-*/\(\)]/.test(val)) {
    let expr = val;
    // 四則演算子から始まるときは自動入力数値への演算
    if (/^[+\-*/]/.test(val) && input.autoinput) {
      expr = input.autoinput + val;
    }
    const res = inputCalc(expr);
    if (res >= 0) {
      preview.innerText = `=${res}`;
      input.title = `計算結果: ${res}`;
      return;
    }
  }

  preview.innerText = "";
  input.title = "";
}

function oninputscore() {
  updateScorePreview(this);

  if (this.autobutton) {
    if (this.validity.badInput || this.value.length > 0) {
      this.autobutton.classList.add("delete");
      this.autobutton.innerText = "×";
    } else {
      this.autobutton.classList.remove("delete");
      this.autobutton.innerText = ">";
    }
  }

  const cubename = window.selectedcube ? window.selectedcube[2] : "";
  if (cubename !== "hexa") {
    return createTable(ondo());
  }

  clearTimeout(oninputscore.sid);
  oninputscore.sid = setTimeout(() => {
    createTable(ondo());
  }, 400);
}

function onautoinput() {
  const score = this.score;
  let val = score.value.trim();
  const valtype = checkValueType(val);
  if (valtype === 3) val = score.autoinput + val;
  const sc = inputCalc(val);

  if (this.classList.contains("delete")) {
    let ok = true;
    if (sc > 0 && sc !== score.autoinput) {
      if (window.isconfirm) return;
      window.isconfirm = true;
      ok = confirm(`このスコアを未入力にします\n[ ${this.inittext} ] = ${sc}`);
      window.isconfirm = false;
    }
    if (ok) {
      this.innerText = ">";
      this.classList.remove("delete");
      score.value = "";
      score.oninput();
    }
  } else if (sc !== score.autoinput) {
    score.value = score.autoinput;
    this.classList.add("delete");
    this.innerText = "×";
    score.oninput();
  }
}

function resetAllScore() {
  let list = document.querySelectorAll(`.potential-pane .input-score`);
  list = [...list].filter(e => e.value !== "");
  if (list.length <= 0) return;
  if (!confirm(`すべての入力スコアをリセットしますか (対象数: ${list.length}項目)`)) {
    return;
  }
  list.forEach(el => {
    el.value = "";
    el.oninput();
  });
}

/*==================== 計算結果表（出力テーブル）生成 ====================*/
function createTable(result) {
  createTable.result = result;
  createTable.switch();
}

createTable.switch = function () {
  if (!this.result) return;
  const type1Item = exportType1Items[exportType1Index];
  const type1 = type1Item.val;
  const type2 = exportType2Index === 0 ? ">=" : "==";

  let cubenum = document.getElementById("paramNInput").value;
  cubenum = inputCalc(cubenum);
  if (cubenum < 1) cubenum = 1;

  let paramPVal = document.getElementById("paramPInput")?.value || "95";
  let targetP = parseFloat(paramPVal) || 95;
  if (targetP <= 0) targetP = 1;
  if (targetP >= 100) targetP = 99.9999;

  let type3 = document.getElementById("exportPriceInput").value;
  type3 = inputCalc(type3);
  if (type3 <= 0) type3 = 1;

  const cubedata = window.selectedcube;
  const cubename = this.result.cubename;
  const linenum = window.selectedmaxline || 3;

  let list = { ...this.result.list };
  let list2 = {};

  const deci1 = Decimal.one;
  const deci0 = Decimal.zero;
  let r = deci0;

  const type1primary = type1.match(/^num|^prob/)?.at(0);
  const type1secondary = type1primary ? type1.match(new RegExp(type1primary + "(.+)"))?.at(1) : null;

  const keys = Object.keys(list).sort((a, b) => (+a < +b) - (+a > +b));

  // 昇級確率
  const upgradekey = ["昇級", "ﾐﾗｸﾙ"];
  const applymiracle = ["red", "black", "additional"];
  const isApplyMiracle = applymiracle.includes(cubename);
  const selrank = this.result.rank;

  if (cubedata && cubename) {
    let upgradeprob = cubedata[1]?.upgradetable?.[cubename]?.[selrank] ?? -1;
    if (isNaN(upgradeprob) || upgradeprob === null) upgradeprob = -1;
    keys.push(...upgradekey);
    list[upgradekey[0]] = new Decimal(upgradeprob);
    list[upgradekey[1]] = list[upgradekey[0]].times(2);
    if (!isApplyMiracle) list[upgradekey[1]] = new Decimal(-1);
  }

  // 出力タイプごとの計算関数
  let func;
  const e50 = new Decimal(2).ln().times(-1);
  const eP = new Decimal(1).minus(new Decimal(targetP).div(100)).ln();

  if (type1primary === "num") {
    if (type1secondary === "avg") {
      func = a => deci1.div(a);
    } else {
      const commonfunc = a => deci1.div(deci1.minus(a).ln());
      switch (type1secondary) {
        case "50":
          func = a => e50.times(commonfunc(a));
          break;
        case "p":
          // n%ライン
          func = a => eP.times(commonfunc(a));
          break;
      }
    }
  } else if (type1primary === "prob") {
    func = a => {
      const rem = deci1.minus(a).pow(cubenum);
      return deci1.minus(rem).times(+type1secondary);
    };
  }

  for (let v of keys) {
    let rr = list[v] instanceof Decimal ? list[v] : new Decimal(list[v]);
    let isAdjust = v === "0";
    const isUpgradekey = upgradekey.includes(v);
    const isUpgradable = isUpgradekey && rr.gt(0);

    if (!isUpgradekey) {
      if (rr.gt(1)) rr = deci1;
      else if (rr.lt(0)) rr = deci0;
    }

    if (cubename === "uni") {
      const targetlinenum = 3 - (linenum - 1);
      rr = rr.times(targetlinenum).div(3);
      if (targetlinenum < 3) isAdjust = false;
    }

    if (window.calcRoundDegit >= 0) {
      rr = rr.toDecimalPlaces(window.calcRoundDegit);
    }

    let __r;
    if (isUpgradekey) {
      __r = rr;
    } else {
      r = r.plus(rr);
      if (isAdjust || r.gt(1)) r = deci1;
      else if (r.lt(0)) r = deci0;
      __r = r;
    }

    const ffunc = a => {
      if (isUpgradekey && !isUpgradable) return a;
      return func ? func(a) : a;
    };

    list2[v] = [ffunc(rr), ffunc(__r)];
  }

  list = list2;
  const showPrice = type3 !== 0 && type3 !== 1;

  let problabel = type1Item.label;
  if (type1 === "nump") {
    problabel = `${targetP}%ライン[個]`;
  } else if (type1primary === "prob") {
    problabel = `${Math.round(cubenum * 100) / 100}個${type1Item.label}`;
  }
  problabel = `${problabel} (${type2})`;

  let tableHtml = `
    <div class="result-table ${showPrice ? 'has-price' : ''}">
      <div class="res-th">Score</div>
      <div class="res-th">${problabel}</div>
      ${showPrice ? `<div class="res-th">×${type3}</div>` : ""}
  `;

  keys.forEach((k, idx) => {
    const isUpg = upgradekey.includes(k);
    const borderStyle = idx > 0 && k === upgradekey[0] ? "border-top: 2px solid #ccc;" : "";
    const kk = type2 === "==" ? list[k][0] : list[k][1];

    const isMask = idx % 2 === 0;

    tableHtml += `
      <div class="res-td res-score-col ${isMask ? 'masked' : ''} ${isUpg ? 'upg-row' : ''}" style="${borderStyle}">${k}</div>
    `;

    for (let c = 0; c <= (showPrice ? 1 : 0); c++) {
      let val = c === 1 ? kk.times(type3) : kk;
      if (type1primary === "num") {
        val = Decimal(+val.toFixed(2));
      }
      if (window.exportRoundDegit >= 0) {
        val = val.toDecimalPlaces(window.exportRoundDegit);
      }

      let valstr = val.toFixed();
      if (type1primary === "num") {
        valstr = val.toFixed(2);
      }

      let [intPart, decPart] = valstr.split(".");
      if (isUpg && val.lte(0)) {
        intPart = "--";
        decPart = "";
      } else if (decPart) {
        intPart = `${intPart}.`;
      }

      tableHtml += `
        <div class="res-td ${isMask ? 'masked' : ''} ${isUpg ? 'upg-row' : ''}" style="${borderStyle}">
          <span class="val-int">${intPart}</span><span class="val-dec">${decPart || ""}</span>
        </div>
      `;
    }
  });

  tableHtml += `</div>`;
  document.getElementById("calc-result-panel").innerHTML = tableHtml;
};

/*==================== 確率計算ロジック（Decimal化） ====================*/
class scoredata {
  constructor({ input, eid, rankidx, val }) {
    this.vals = [Decimal.zero, Decimal.zero];
    this.input = input;
    this.eid = eid;
    this.add(rankidx, val);
  }
  add(rankidx, val) {
    this.vals[rankidx] = this.vals[rankidx].plus(val);
  }
  div(rankidx, val) {
    this.vals[rankidx] = this.vals[rankidx].div(val);
  }
}

class errdata {
  constructor() {
    this.probs = [Decimal.zero, Decimal.zero];
    this.counts = new Uint8Array(20);
    this.capped = new Uint8Array(20);
    this.hasCapped = false;
    this._stack = [];
  }
  store(eid) {
    this._stack.push({
      eid,
      probs: [this.probs[0], this.probs[1]],
      counts: this.counts[eid],
      capped: this.capped[eid],
      hasCapped: this.hasCapped
    });
  }
  restore() {
    const s = this._stack.pop();
    this.probs = s.probs;
    this.counts[s.eid] = s.counts;
    this.capped[s.eid] = s.capped;
    this.hasCapped = s.hasCapped;
  }
}

function inputCalc(expr) {
  if (typeof expr !== "string" || expr.trim() === "") return 0;
  try {
    if (!/^[0-9.+\-*/\(\)\s]+$/.test(expr)) throw new Error("invalid characters");
    const ret = Function(`"use strict"; return (${expr})`)();
    return +ret.toFixed(4);
  } catch {
    return -1;
  }
}

function checkValueType(val) {
  if (typeof val !== "string") val = String(val);
  val = val.trim();
  if (!isNaN(val)) {
    if (+val < 0) return -1;
    return +val > 0 ? 1 : 0;
  }
  if (/^[+\-*/]/.test(val)) return 3;
  const num = inputCalc(val);
  return num < 0 ? -1 : 2;
}

function ondo() {
  const cubeDef = window.selectedcube;
  if (!cubeDef) return { rank: -1, cubename: "", list: {} };

  const data = cubeDef[1];
  const applyerrlist = window.checkedapplyerrlist;
  const exportdata = window.exportdata;
  const { rank, cubename, weights } = exportdata;

  let maxline = cubename === "uni" ? window.selectedmaxline : 3;
  const cuberankrate = data.ratetable[cubename]?.[rank];
  if (!cuberankrate) return { rank, cubename, list: {} };

  const fixlinenum = data.fixlinenum?.[cubename];
  if (fixlinenum > 0) maxline = fixlinenum;

  const inputscores = document.querySelectorAll("#potential-list-body .input-score");
  const errlist1 = data.potentialerrorlist;
  const errlist2 = data.potentialerrorlist2;

  const scores = [];
  const scoremap = new Map();
  let maxscore = 0;

  for (let i = 0; i < inputscores.length; i++) {
    const inputscore = inputscores[i];
    let val = inputscore.value.trim();
    const valtype = checkValueType(val);
    if (valtype === 3) val = inputscore.autoinput + val;
    val = inputCalc(val);

    const potRow = inputscore.closest(".pot-row");
    if (potRow && potRow.style.display === "none") {
      val = 0;
    } else {
      inputscore.classList.toggle("error", val < 0);
      if (val < 0) val = 0;
    }

    const n = i < weights[0].length - 1 ? 0 : 1;
    const ws = weights[n];
    const wdata = ws[i + 1 - (n ? weights[0].length - 1 : 0)];

    const w = wdata.weight;
    const pid = wdata.id;
    let eid = errlist2[pid];
    if (!applyerrlist || eid === undefined) eid = -1;

    const key = `${val}|${eid}`;
    let sc = scoremap.get(key);
    if (sc) {
      sc.add(n, w);
    } else {
      if (maxscore < val) maxscore = val;
      sc = new scoredata({ input: val, eid, rankidx: n, val: w });
      scoremap.set(key, sc);
      scores.push(sc);
    }
  }

  for (let sc of scores) {
    sc.div(0, weights[0][0]);
    sc.div(1, weights[1][0]);
  }

  scores.sort((a, b) => b.input - a.input || a.eid - b.eid);

  const vs = [];
  const result = {};

  if (maxscore > 0) {
    calc(0, maxline, new errdata(), scores);
  } else {
    result["0"] = Decimal.one;
  }

  return { rank, cubename, list: result };

  function calc(line = 0, maxline = 3, edata, scores, prob = Decimal.one, topscores = []) {
    const one = Decimal.one;
    const zero = Decimal.zero;

    let scores2 = scores;
    if (maxline > 3) {
      let isUpdateTopscores = false;
      if (line === 3) {
        topscores = [...vs];
        topscores.sort((a, b) => a - b);
        isUpdateTopscores = true;
      } else if (line > 3) {
        let v = vs[line - 1];
        if (topscores[0] < v) {
          let idx = 0;
          for (let i = 1; i < 3; i++) {
            if (topscores[i] < v) idx++;
            else break;
          }
          topscores.shift();
          topscores.splice(idx, 0, v);
          isUpdateTopscores = true;
        }
      }
      if (isUpdateTopscores) {
        const topsum = topscores.reduce((sum, sc) => sum + sc);
        if (topsum - scores[0].input * 3 >= -1e-12) {
          setResult(vs, prob);
          return;
        }
        scores2 = [];
        const cutScore0 = new scoredata({ input: 0, eid: -1, rankidx: 0, val: 0 });
        let isCut = false;
        scores.forEach(sc => {
          if (sc.eid < 0 && sc.input < topscores[0]) {
            cutScore0.add(0, sc.vals[0]);
            cutScore0.add(1, sc.vals[1]);
            isCut = true;
          } else {
            scores2.push(sc);
          }
        });
        if (isCut) scores2.push(cutScore0);
      }
    }
    scores = scores2;

    const eprobs = edata.probs;
    let errprob = zero;
    if (edata.hasCapped) {
      errprob = eprobs[0].times(cuberankrate[line][0]).plus(
        eprobs[1].times(cuberankrate[line][1])
      );
    }

    for (let i = 0; i < scores.length; i++) {
      const sc = scores[i];
      const eid = sc.eid;
      if (edata.capped[eid]) continue;

      const r = sc.vals[0].times(cuberankrate[line][0]).plus(
        sc.vals[1].times(cuberankrate[line][1])
      );
      if (r.lte(0)) continue;

      vs[line] = sc.input;
      const prob2 = prob.times(errprob.isZero() ? r : r.div(one.minus(errprob)));

      if (line + 1 < maxline) {
        const isChange = eid >= 0;
        if (isChange) {
          edata.store(eid);
          edata.counts[eid] = 1 + (edata.counts[eid] || 0);
          if (errlist1[eid][1] <= edata.counts[eid]) {
            edata.capped[eid] = 1;
            edata.hasCapped = true;
            for (let esc of scores) {
              if (esc.eid === eid) {
                edata.probs[0] = edata.probs[0].plus(esc.vals[0]);
                edata.probs[1] = edata.probs[1].plus(esc.vals[1]);
              }
            }
          }
        }
        calc(line + 1, maxline, edata, scores, prob2, topscores);
        if (isChange) edata.restore();
        continue;
      }

      setResult(vs, prob2);
    }
  }

  function setResult(vs, prob) {
    let v = 0;
    if (maxline > 3) {
      let v0 = 0, v1 = 0, v2 = 0;
      for (let num of vs) {
        num = +num;
        if (num <= 0) continue;
        if (v2 >= num) continue;
        if (v1 >= num) {
          v2 = num;
          continue;
        }
        v2 = v1;
        if (v0 >= num) {
          v1 = num;
        } else {
          v1 = v0;
          v0 = num;
        }
      }
      v = v0 + v1 + v2;
    } else {
      for (let i = 0; i < maxline; i++) {
        v += vs[i];
      }
    }
    v = +v.toFixed(8);
    const key = v.toString();
    result[key] = (result[key] || Decimal.zero).plus(prob);
  }
}

/*==================== 入力補助プルダウン（Lv選択） ====================*/
function createDropdown(inputElement, items, callback) {
  const container = document.createElement("div");
  container.className = "button-dropdown-wrapper";

  const dropdown = document.createElement("div");
  dropdown.className = "template-dropdown";

  const ul = document.createElement("ul");
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    li.addEventListener("click", () => {
      inputElement.value = item;
      dropdown.style.display = "none";
      if (callback) callback();
    });
    ul.appendChild(li);
  });
  dropdown.appendChild(ul);

  const button = document.createElement("button");
  button.type = "button";
  button.className = "dropdown-arrow-btn";
  button.textContent = "▼";

  button.addEventListener("click", e => {
    e.stopPropagation();
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  });

  container.appendChild(button);
  container.appendChild(dropdown);
  return container;
}

document.addEventListener("click", () => {
  document.querySelectorAll(".template-dropdown").forEach(d => {
    d.style.display = "none";
  });
});

/*==================== スコア自動入力モーダル ====================*/
function initScoreModal() {
  const overlay = document.getElementById("score-modal-overlay");
  const closeBtn = document.getElementById("score-modal-close");
  const cancelBtn = document.getElementById("score-modal-cancel");
  const applyBtn = document.getElementById("score-modal-apply");

  closeBtn.onclick = closeModal;
  cancelBtn.onclick = closeModal;
  overlay.onclick = e => {
    if (e.target === overlay) closeModal();
  };

  applyBtn.onclick = applyScoreModal;
}

function openScoreModal() {
  const overlay = document.getElementById("score-modal-overlay");
  buildScoreModalBody();
  overlay.classList.add("open");
}

function closeModal() {
  document.getElementById("score-modal-overlay").classList.remove("open");
}

function buildScoreModalBody() {
  const body = document.getElementById("score-modal-body");
  body.innerHTML = "";

  const rows = document.querySelectorAll("#potential-list-body .pot-row");
  if (rows.length === 0) {
    body.innerHTML = `<p class="modal-empty-msg">潜在能力テーブルが空です。先に装備と等級を選択してください。</p>`;
    return;
  }

  // 現在テーブルに出現しているグループごとの最大値を集計
  let groupStats = new Map();

  rows.forEach(row => {
    const pid = +row.dataset.potentialid;
    const group = commons.potentialIdToGroup[pid] || null;
    if (!group) return;

    const valText = row.querySelector(".pot-val")?.innerText || "";
    const valNum = parseFloat(valText) || 0;

    if (!groupStats.has(group.id)) {
      groupStats.set(group.id, {
        group,
        maxVal: 0,
        count: 0
      });
    }
    const stat = groupStats.get(group.id);
    if (valNum > stat.maxVal) stat.maxVal = valNum;
    stat.count++;
  });

  groupStats = new Map(
    [...groupStats].sort((a, b) => {
      const g = commons.potentialGroups;
      return g.findIndex(e => e.id === a[0]) - g.findIndex(e => e.id === b[0]);
    })
  );

  let html = `
    <div class="score-modal-intro">
      ・同種の潜在能力タイプのスコアをまとめて設定します。<br>
      ・グループごとの最大値にスコアを付けて、適用してください。<br>
      ・0を入力すると削除。空なら無視されます。
    </div>
    <div class="modal-pot-table">
      <div class="modal-pane-header-row">
        <div class="pane-th" style="text-align: center; padding-left: 8px;">潜在能力</div>
        <div class="pane-th">Score</div>
      </div>
      <div class="modal-pot-list">
  `;

  let rowIdx = 0;
  groupStats.forEach((stat, gid) => {
    rowIdx++;
    const isMasked = rowIdx % 2 === 0;

    html += `
      <div class="modal-pot-row ${isMasked ? 'masked' : ''}" data-group-id="${gid}" data-max-val="${stat.maxVal}">
        <div class="pot-col pot-btn-col"><button type="button" class="auto-btn" tabindex="-1">&gt;</button></div>
        <div class="pot-col pot-val">${stat.maxVal || ""}</div>
        <div class="pot-col pot-name" title="${stat.group.name}">${stat.group.name}</div>
        <div class="pot-col pot-score">
          <div class="score-input-wrap">
            <input type="text" inputmode="decimal" class="input-score modal-group-score no-spin" value="" data-group-id="${gid}">
            <span class="calc-preview"></span>
          </div>
        </div>
      </div>
    `;
  });

  html += `
      </div>
    </div>
  `;
  body.innerHTML = html;


  // モーダル内の各行のイベントとauto-btn挙動をセットアップ
  body.querySelectorAll(".modal-pot-row").forEach(row => {
    const input = row.querySelector(".modal-group-score");
    const btn = row.querySelector(".auto-btn");
    const maxVal = parseFloat(row.dataset.maxVal) || 0;

    input.autoinput = maxVal || 1;
    btn.score = input;
    input.autobutton = btn;

    setupScoreInputBehavior(input);

    input.oninput = function () {
      updateScorePreview(this);
      if (this.autobutton) {
        if (this.value.trim().length > 0) {
          this.autobutton.classList.add("delete");
          this.autobutton.innerText = "×";
        } else {
          this.autobutton.classList.remove("delete");
          this.autobutton.innerText = ">";
        }
      }
    };

    btn.onclick = function () {
      const targetInput = this.score;
      if (this.classList.contains("delete")) {
        targetInput.value = "";
        this.classList.remove("delete");
        this.innerText = ">";
      } else {
        targetInput.value = targetInput.autoinput;
        this.classList.add("delete");
        this.innerText = "×";
      }
      if (targetInput.oninput) targetInput.oninput();
    };
  });
}

function applyScoreModal() {
  const body = document.getElementById("score-modal-body");
  const groupScores = new Map();

  body.querySelectorAll(".modal-pot-row").forEach(row => {
    const gid = row.dataset.groupId;
    const maxVal = parseFloat(row.dataset.maxVal) || 0;
    const input = row.querySelector(".modal-group-score");
    let val = input.value.trim();

    if (val !== "") {
      // 式が入力されている場合（+ - * / () を含むか、式として計算できる場合）
      if (/[+\-*/\(\)]/.test(val)) {
        let expr = val;
        // 四則演算子から始まるときは自動入力数値への演算
        if (/^[+\-*/]/.test(val) && input.autoinput) {
          expr = input.autoinput + val;
        }
        val = expr;
      }
      const num = inputCalc(val);
      if (num >= 0) {
        groupScores.set(gid, { score: num, maxVal });
      }
    }
  });

  // 潜在テーブルに反映
  const rows = document.querySelectorAll("#potential-list-body .pot-row");
  rows.forEach(row => {
    const pid = +row.dataset.potentialid;
    const pidname = commons.potentialIds[pid];
    const group = commons.potentialIdToGroup[pid] ?? null;
    if (group && groupScores.has(group.id)) {
      const { score: groupScore, maxVal } = groupScores.get(group.id);
      const valText = row.querySelector(".pot-val")?.innerText || "";
      const valNum = parseFloat(valText) || null;

      const input = row.querySelector(".input-score");
      const btn = row.querySelector(".auto-btn");

      let calculatedScore = 0;
      if (maxVal > 0 && valNum !== null && valNum >= 0) {
        let val = groupScore * valNum / maxVal;
        // レベルごと潜在の特殊処理
        if (pidname === "lvstr") {
          const charaLv = 300;
          const valPerLv = ~~(charaLv / 9);
          val *= valPerLv;
        }
        // STRをメインステとするのでそれ以外を削除
        if (
          ["dex", "int", "luk"].some(
            e => RegExp(`${e}\\d?$`).test(pidname)
          )
        ) {
          val = 0;
        }
        // 攻撃力を対象とするので魔力を削除
        if (
          ["pma", "ima1", "ima2"].some(e => e === pidname)
        ) {
          val = 0;
        }

        calculatedScore = +val.toFixed(2);
      } else {
        calculatedScore = groupScore;
      }

      if (calculatedScore > 0) {
        input.value = calculatedScore;
        btn.classList.add("delete");
        btn.innerText = "×";
      } else {
        input.value = "";
        btn.classList.remove("delete");
        btn.innerText = ">";
      }
      updateScorePreview(input);
    }
  });

  closeModal();
  createTable(ondo());
}
