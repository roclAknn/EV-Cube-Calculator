

const cubetypes = [
  ["KMS/レッドキューブ",   regularKMS, "red", 0]
, ["KMS/ブラックキューブ", regularKMS, "black", 1]
, ["KMS/名匠のキューブ", regularKMS, "meister", 2]
, ["KMS/職人のキューブ", regularKMS, "craftman", 3]
, ["KMS/怪しいキューブ", regularKMS, "occult", 4]

, ["KMS/アディショナル・ホワイトアディショナルキューブ", additionalKMS, "additional", 5]
, ["KMS/怪しいアディショナルキューブ", additionalKMS, "rareadditional", 6]

, ["TMS/ユニキューブ", regularTMS, "uni", 7]
, ["非公式/ヘキサキューブ(KMS無償テーブル)", regularKMS, "hexa", 8]
];

const cubegroups = [
  ["KMS/上潜在/有償テーブル", [0, 1]]
, ["KMS/上潜在/無償テーブル", [2, 3, 4]]
, ["KMS/下潜在/共通テーブル", [5, 6]]
, ["その他", [7, 8]]
];

const tempeqplv = [250, 200, 160, 150, 140, 130, 120, 110, 100, 0];

window.selectedcube = null;
window.selectedequipmenttype = -1;
window.selectedequipmentlevel = -1;
window.selectedrank = -1;
window.selectedmaxline = -1;
window.checkedapplyerrlist = true;

/* BigNumberの設定　小数桁数精度 */
BigNumber.config({ DECIMAL_PLACES: 25 }); // 計算精度
window.calcRoundDegit = 25; // 出力累積計算の丸め位置
window.exportRoundDegit = 12; // 出力結果の丸め位置
BigNumber.one  = BigNumber(1); //頻出キャッシュ
BigNumber.zero = BigNumber(0); 

/* Decimal.jsの設定　有効桁数精度 */
Decimal.set({ precision: 40 }); // 計算制度
Decimal.one  = Decimal(1);
Decimal.zero = Decimal(0);

/*===== ページロード後初期化処理 ===============================================*/
function initialize(){
  initcubedatas();
  UIinitialize();
}

/*===== UI処理 =================================================================*/

function UIinitialize(){
  let sel = document.getElementById("input-cubetype");
  let inner = "";
  
  for(let gr of cubegroups){
    if(gr[1].length <= 0) continue;
    let grname = gr[0];
    inner += `<optgroup label="${gr[0]}">`;
    for(let i = 0; i < gr[1].length; i++){
      inner += `<option value=${gr[1][i]}>${cubetypes[gr[1][i]][0]}</option>`;
    }
    inner += `</optgroup>`;
  }
  
  sel.innerHTML += inner;
  sel.disabled = false;
  
  sel = document.getElementById("input-equipmenttype");
  inner = "";
  for(let i = 0; i < commons.equipmentnames.length; i++){
    inner += `<option value=${i}>${commons.equipmentnames[i]}</option>`;
  }
  sel.innerHTML += inner;
  sel.disabled = false;
  
  sel = document.getElementById("input-equipmentlevel");
  sel.parentElement.appendChild( createDropdown(sel, tempeqplv, onchangesetting) );
  sel.disabled = false;
  
  sel = document.getElementById("input-potentialrank");
  inner = "";
  for(let i = 0; i < 4; i++){
    inner += `<option value=${i}>${commons.ranknames[i]}</option>`;
  }
  sel.innerHTML += inner;
  sel.disabled = false;
  
  sel = document.getElementById("input-maxline");
  sel.disabled = false;
  
  sel = document.getElementById("input-applyerrlist");
  sel.disabled = false;
  
  let div = document.querySelector("#openerdiv>.wrapdiv");
  div.onclick = div.ontouch = function(){
    let div = document.getElementById("headerdiv");
    let ishide = div.classList.toggle("hide");
    div = document.getElementById("openerdiv");
    div.classList.toggle("opener", ishide);
  };
  
  createTable({rank: -1, cubename: "", list: []});
}

function onchangecube(){
  /* window.selectedcubeはここで更新しないこと */
  let val = document.getElementById("input-cubetype").value;
  if( val === "" ) return;
  val = cubetypes[+val];
  let data = val[1];
  let cubename = val[2];
  let ratetable = data.ratetable[cubename];
  
  let sel = document.getElementById("input-potentialrank");
  for( let opt of sel.options ){
    let val = opt.value;
    if( val === "") continue;
    if( ratetable[+val] ){
      opt.disabled = false;
    }else{
      opt.disabled = true;
      if( opt.selected ) sel.selectedIndex = 0;
    }
  }
  onchangesetting();
  setcubeinfodiv();
}


function onchangesetting(){
  let inputcube     = document.getElementById("input-cubetype");
  let inputeqp      = document.getElementById("input-equipmenttype");
  let inputeqplv   = document.getElementById("input-equipmentlevel");
  let inputrank     = document.getElementById("input-potentialrank");
  let inputmaxline  = document.getElementById("input-maxline");
  let inputapplyerr = document.getElementById("input-applyerrlist");
  
  let val = inputcube.value;
  if( val === "" ) return;
  let flg = false;
  val = cubetypes[+val];
  
  if( window.selectedcube ){
    let data = window.selectedcube[1];
    let cubename = window.selectedcube[2];
    let temp = data.equipmentpotential[cubename];
    data = val[1];
    cubename = val[2];
    if( temp != data.equipmentpotential[cubename] ) flg = true;
  }
  window.selectedcube = val;
  
  
  val = inputeqp.value;
  if( val === "" ) val = -1;
  if( window.selectedequipmenttype != +val ) flg = true;
  let eqp = window.selectedequipmenttype = +val;
  
  val = inputeqplv.validity.badInput ? -1 : +inputeqplv.value;
  inputeqplv.classList.toggle("error", val < 0);
  if( window.selectedequipmentlevel != val ) flg = true;
  let eqplv = window.selectedequipmentlevel = val;
  
  val = inputrank.value;
  if( val === "" ) val = -1;
  if( window.selectedrank != +val ) flg = true;
  let rank = window.selectedrank = +val;
  
  /* 行数は潜在一覧出力には影響しない */
  let flg2 = false;
  val = +inputmaxline.value;
  if( window.selectedmaxline != val )flg2 = true;
  let maxline = window.selectedmaxline = val;
  
  /* 重複制限は潜在一覧出力には影響しない */
  val = +inputapplyerr.checked;
  if( window.checkedapplyerrlist != val ) flg2 = true;
  let applyerrlist = window.checkedapplyerrlist = val
  
  /*----------------------------------------------*/
  
  /* ユニキューブかそれ以外かでmaxlineの表示を切り替える(valueはそのまま) */
  let cubename;
  if( window.selectedcube ){
    cubename = window.selectedcube[2];
    Array.apply(null, inputmaxline.options).forEach((k, i)=>{
      if( cubename == "uni" ){
        k.innerHTML = "" + (i + 1) + "行狙い";
      }else{
        k.innerHTML = "" + (3 - i) + "行";
      }
    });
  }
  
  if( eqp < 0 || eqplv < 0 || rank < 0 || maxline <= 0 ){
    if ( 0 <= rank ) createTable({rank, cubename, list: []}); // 昇級率のみ表示する
    return;
  }
  conditionupdate(); /* 出力条件の表示 */
  if( flg ){
    createcubetable(); /* スコア確率表も更新される */
  }else{
    createTable(ondo());
  }
  
}

/* 表示中の設定の表示更新 */
function conditionupdate(){
  let cubeimagenum = window.selectedcube[3];
  let eqp = window.selectedequipmenttype;
  let lv = window.selectedequipmentlevel;
  let rank = window.selectedrank;
  
  const cubeimage = document.querySelector("#condition-cube .cubeimage");
  cubeimage.style.display = "block";
  cubeimage.style.objectPosition = `50% ${-32 * cubeimagenum}px`;
  const eqpimage = document.querySelector("#condition-eqp .eqpimage");
  eqpimage.style.display = "block";
  eqpimage.style.objectPosition = `50% ${-38 * eqp}px`;
  document.getElementById("condition-level").innerHTML = "Lv." + lv;
  document.getElementById("condition-rank").innerHTML = commons.ranknames[rank];
}

function setcubeinfodiv(){
  let data = window.selectedcube[1];
  let cubename = window.selectedcube[2];
  let cubeimagenum = window.selectedcube[3];
  let ratetable = data.ratetable[cubename];
  let upgtable  = data.upgradetable[cubename];
  
  /* ヘキサキューブの確率を強引に表示する */
  if( cubename == "hexa" ){
    let newtable = [
        [["1行目上級"], ["2行目上級"], ["3行目上級"]]
      , [[], [], []]
      , [["4行目上級"], ["5行目上級"], ["6行目上級"]]
      , [[], [], []]
    ];
    for( let i = 0; i <= 1; i++ ){
      for( let ii = 0; ii <= 2; ii++ ){
        let rate = ratetable[0][ i*3+ii ][0];
        rate = +(new BigNumber(100).times( rate ));
        newtable[ i*2+1 ][ii][0] = "" + rate + "%";
      }
    }
    ratetable = newtable;
  }
  
  for(let i = 0; i < ratetable.length; i++){
    let cn = commons.rankclassnames[i];
    let divs = document.querySelectorAll("#cubeinfodiv .data." + cn);
    for(let ii = 0; ii <= 3; ii++){
      let rate;
      if( ii < 3 ){
        rate = !ratetable[i] ? 0 : ratetable[i][ii][0];
      }else{
        rate = upgtable[i];
      }
      let isnone = false;
      if( typeof(rate) == "number" ){
        if( rate > 0 ){
          rate = +(new BigNumber(100).times( rate ));
        }else{
          isnone = true;
          rate = "";
        }
      }else{
        isnone = true;
      }
      if ( isnone ){
        divs[ii].innerHTML = rate;
        divs[ii].classList.add("none");
      }else{
        divs[ii].innerHTML = "" + rate + "%";
        divs[ii].classList.remove("none");
      }
    }
  }
  let img = document.querySelector("#cubeimagediv .cubeimage");
  img.style.objectPosition = `50% ${-32 * cubeimagenum}px`;
  img.style.display = "block";
}

function createTable(result){
  createTable.result = result;
  createTable.switch();
}

/* 設定に従って確率表の表示 */
createTable.switch = function(){
  const type1sel = document.getElementById("exporttype1").selectedOptions[0];
  const type1 = type1sel.value;
  const type2 = document.getElementById("exporttype2").selectedOptions[0].value;
  let cubenum = document.getElementById("exporttype1input").value;
  cubenum = inputCalc(cubenum);
  if (cubenum < 1) cubenum = 1;
  let type3 = document.getElementById("exporttype3").value;
  type3 = inputCalc(type3);
  if (type3 <= 0) type3 = 1;
  
  const cubedata = window.selectedcube;
  let cubename = this.result.cubename;
  let linenum;
  // 共通処理で空のテーブルを表示させたいため中断returnしない
  if( window.selectedmaxline ) linenum = window.selectedmaxline;
  
  let list = {...this.result.list};
  let list2 = {};
  
  let zero = BigNumber.zero;
  let one = BigNumber.one;
  let r = zero;
  let deci1 = Decimal.one;
  let deci0 = Decimal.zero;
  
  let type1primary = type1.match(/^num|^prob/)?.at(0);
  let type1secondary = type1primary ? type1.match(new RegExp(type1primary + "(.+)")).at(1) : null;
  
  let keys = Object.keys(list).sort((a,b)=>{/* スコア降順ソート */ return (+a < +b) - (+a > +b)});
  
  // 昇級確率を末尾に追加
  const upgradekey = ["昇級", "ﾐﾗｸﾙ"];
  const selrank = this.result.rank;
  let upgradeprob;
  if ( cubedata && cubename ){
    upgradeprob = cubedata?.at(1).upgradetable[cubename]?.at(selrank);
    if (upgradeprob === undefined) upgradeprob = -1;
    if (cubename == "uni" || cubename == "hexa") upgradeprob = -1;
    keys.push(...upgradekey);
    list[upgradekey[0]] = new BigNumber( upgradeprob );
    list[upgradekey[1]] = new BigNumber( upgradeprob ).times(2);
  }
  
  // 出力タイプに応じた処理を設定
  let func;
  let e50 = new Decimal(2).ln().times(-1);
  let e05 = new Decimal(20).ln().times(-1);
  if (type1primary == "num"){
    if (type1secondary == "avg"){
      func = a => deci1.div(a);
    } else {
      const commonfunc = (a)=>{
        return deci1.div( deci1.minus( a ).ln() );
      }
      switch(type1secondary){
      case "50":
        func = a => e50.times(commonfunc(a)); break;
      case "95":
        func = a => e05.times(commonfunc(a)); break;
      }
    }
  } else if (type1primary == "prob"){
    func = a => {
      a = deci1.minus( a.toString() ).pow( cubenum );
      return deci1.minus( a ).times( +type1secondary );
    }
  }
  
  for(let v of keys){
    let rr = list[v];
    let isAdjust = (v == 0); /* v==0で帳尻を合わせるフラグ */
    const isUpgradekey = (0 <= upgradekey.indexOf(v));
    const isUpgradable = (isUpgradekey && rr > 0);
    if (!isUpgradekey){
      if     ( rr.gt(1) ) rr = one;
      else if( rr.lt(0) ) rr = zero;
    }
    
    /* ユニキューブは潜在行数を行選択確率として使う */
    /* 0スコアも潜在行数を含めた出力にする（平均値1ではなく3）行数の設定をここで確認できるようにするため */
    if( cubename == "uni" ){
      let targetlinenum = 3 - (linenum - 1); // 1~3
      rr = rr.times(targetlinenum).div(3);
      if (targetlinenum < 3) isAdjust = false; // 3行狙いのみ修正
    }
    
    if(calcRoundDegit >= 0){
      rr = rr.decimalPlaces(calcRoundDegit); // 恣意的丸め(累積計算精度)
    }
    
    let __r;
    if ( isUpgradekey ){
      __r = rr;
    }else{
      r = r.plus(rr);
      if     ( isAdjust ) r = one;
      else if( r.gt(1) ) r = one;
      else if( r.lt(0) ) r = zero;
      __r = r;
    }
    // log計算のため BigNumber -> Decimal に変換
    let _rr = Decimal(rr.toString()), _r = Decimal(__r.toString());
    const ffunc = a => {
      if ( isUpgradekey && !isUpgradable ) return a;
      return func(a);
    }
    //現状はBigNumberに戻して格納
    list2[v] = [ BigNumber(ffunc(_rr).toString()), BigNumber(ffunc(_r).toString()) ];
  }
  list = list2;
  let showbool = ( type3 != 0 && type3 != 1 );
  let table = document.createElement("div");
  table.classList.add("table");
  if( showbool ) table.classList.add("showsecondary");
  
  let tagstart = `<div class="coltitle">`;
  let problabel = `${type1sel.label}(${type2})`;
  if ( type1primary == "prob" ){
    problabel = Math.round(cubenum * 100)/100 + problabel;
  }
  let inner = `${tagstart}<span>Score</span></div>${tagstart}<span>${problabel}</span></div>`;
  if( showbool ) inner += `${tagstart}<span>x${type3}</span></div>`;
  
  table.insertAdjacentHTML("beforeend", inner);
  
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i];
    let divstyle = "";
    // 昇級確率行の開始を罫線で区切る
    if ( 0 < i && k == upgradekey[0] ){
      divstyle = "border-top: double #c0c0c0;";
    }
    let inner =  `<div style="${divstyle}"><span>${k}</span></div>`;
    
    let kk = (type2 == "==" ? list[k][0] : list[k][1]);
    for( let ii = 0; ii <= 1; ii++ ){
      if( ii == 1 && !showbool ) break;
      let kkk = (ii == 1) ? kk.times(type3) : kk;
      
      // 恣意的丸め(出力精度)
      if (exportRoundDegit >= 0){
        kkk = kkk.decimalPlaces(exportRoundDegit);
      }
      
      let [rateint, ratedecimal] = kkk.toFixed().split(".");
      if ( ratedecimal > 0 ) rateint = "" + rateint + ".";
      if ( 0 <= upgradekey.indexOf(k) &&  kkk.lte(0) ){
        rateint = "--"; ratedecimal = "";
      }
      inner += `<div style="${divstyle}"><span><span class="int">${rateint}</span><span class="decimal">${ratedecimal||""}</span></span></div>`;
    }
    table.insertAdjacentHTML("beforeend", inner);
  }
  let tdiv = document.getElementById("tablediv");
  tdiv.innerHTML = "";
  tdiv.appendChild(table);
  return false;
};

window.scoretemps = [];
function createcubetable(){
  
  let eqp  = window.selectedequipmenttype;
  let rank = window.selectedrank;
  let lv   = window.selectedequipmentlevel;
  
  let data     = window.selectedcube[1];
  let cubename = window.selectedcube[2];
  
  let ownerdiv = document.getElementById("potentialdiv");
  
  let fragment = new DocumentFragment();
  data.exportdata = {rank, cubename, weights:[]}; /*確率出力用データ初期化*/
  
  // スコアの保存
  scoretemps = [];
  {
    let names = document.getElementsByClassName("potential-name");
    let vals = document.getElementsByClassName("potential-val");
    let scores = document.querySelectorAll(".potential-score>input");
    for(let i = 0; i < names.length; i++){
      if( scores[i].value > 0 ){
        scoretemps.push( {name: names[i].innerHTML, val: vals[i].innerHTML, score: scores[i].value} );
      }
    }
  }
  
  createpotentialline(eqp, rank, lv);
  createpotentialline(eqp, rank+1, lv);
  
  // 見出し行以外の削除
  while (ownerdiv.children.length > 3) {
    ownerdiv.removeChild(ownerdiv.lastChild);
  }
  
  ownerdiv.appendChild(fragment);
  onchangedisplayamount(); /* スコア確率表も更新される */
  
  function createpotentialline(eqp, rank, lv){
    let trdatas = [];
    let sumweight = 0;
    let weights = [0];
    data.equipmentpotential[cubename][eqp][rank].forEach((pdata)=>{
      let {name, id, weight, depth} = pdata;
      let val = pdata.getValue(lv);
      
      sumweight += weight;
      weights.push({id, weight});
      
      trdatas.push({name, val, weight, depth, id});
    });
    weights[0] = sumweight;
    data.exportdata.weights.push(weights);
    
    for(let trdata of trdatas){
      let {name, val, weight, depth, id} = trdata;
      let valdiv = document.createElement("div");
      valdiv.className = `gridbox1 cell ${commons.rankclassnames[rank]}`;
      valdiv.dataset.potentialdepth = depth;
      valdiv.dataset.potentialrank = rank;
      
      let autodiv = valdiv.cloneNode();
      let namediv = valdiv.cloneNode();
      let scorediv = valdiv.cloneNode();
      let ratediv = valdiv.cloneNode();
      
      valdiv.classList.add("potential-val");
      namediv.classList.add("potential-name");
      scorediv.classList.add("potential-score");
      ratediv.classList.add("potential-rate");
      
      valdiv.innerHTML = val || "";
      namediv.innerHTML = name;
      ratediv.innerHTML = "" + (weight * 100 / sumweight).toFixed(4) + " %";
      
      let input = document.createElement("input");
      input.autoinput = val || 1;
      input.type      = "text";
      input.inputMode="decimal";
      input.className = `input-status no-spin input-score input-score-${id}`;
      input.oninput   = oninputscore;
      scorediv.appendChild(input);
      
      autodiv.classList.add("potential-auto");
      let button = document.createElement("input");
      button.type      = "button";
      button.value     = ">";
      button.style.zIndex = "10000";
      button.onclick   = onautoinput;
      button.score     = input;
      button.inittext  = valdiv.innerHTML + namediv.innerHTML;
      autodiv.appendChild(button);
      input.autobutton   = button;
      
      // スコアの復元
      for(let temp of scoretemps){
        if( temp.val == valdiv.innerHTML && temp.name == namediv.innerHTML ){
          input.value = temp.score;
          button.classList.add("delete");
          button.value = "x";
          break;
        }
      }
      fragment.appendChild(autodiv);
      fragment.appendChild(valdiv);
      fragment.appendChild(namediv);
      fragment.appendChild(scorediv);
      fragment.appendChild(ratediv);
    }
  }
}

oninputscore.delay = 1000;
function oninputscore(){
  if( this.validity.badInput || this.value.length > 0 ){
    this.autobutton.classList.add("delete");
    this.autobutton.value = "x";
  }else{
    this.autobutton.classList.remove("delete");
    this.autobutton.value = ">";
  }
  
  /* ヘキサキューブのみ重いので、スコアの入力がしやすいよう即時反映せずに遅延させる */
  let cubename = window.selectedcube[2];
  if( cubename != "hexa" ){
    return createTable(ondo());
  }
  clearTimeout(oninputscore.sid);
  oninputscore.sid = setTimeout(()=>{
    let sid = oninputscore.sid;
    let result = ondo();
    if( sid != oninputscore.sid ) return;
    createTable(result);
  }, oninputscore.delay);
}

function onautoinput(){
  let score = this.score;
  
  let val = score.value.trim();
  if ( /^[+\-*/]/.test(val) ) val = score.autoinput + val;
  let sc = inputCalc(val);
  // let sc = score.validity.badInput ? -1 : +score.value;
  
  if( this.classList.contains("delete") ){
    //入力済みの場合は削除ボタン
    let bool = true;
    if( sc > 0 && sc != score.autoinput ){
      if( window.isconfirm ) return;
      window.isconfirm = true;
      bool = confirm("このスコアを未入力にします\n[ " + this.inittext + " ] = " + sc);
      window.isconfirm = false;
    }
    if( bool ){
      this.value = ">";
      score.value = "";
      score.oninput();
    }
  }else if( sc != score.autoinput ){
    //未入力の場合は自動入力ボタン
    score.value = score.autoinput;
    score.oninput();
  }
}

function onchangedisplayamount(){
  const cellnum = 5;
  
  let divs = document.querySelectorAll(`#potentialdiv div[data-potentialdepth]`);
  if(divs.length <= 0) return;
  
  let val = +document.getElementById("input-potential-displayamount").value;
  let visiblenum = 0;
  let potentialrank = 0;
  for(e of divs){
    let d = +e.dataset.potentialdepth;
    e.style.display = (d <= val) ? "" : "none";
    if (d > val) continue;
    let r = +e.dataset.potentialrank;
    if( potentialrank != r ){ // 潜在等級が変わったらリセット
      potentialrank = r;
      visiblenum = 0;
    }
    visiblenum++;
    e.classList[ (~~((visiblenum-1) / cellnum)) % 2 == 0 ? "remove" : "add" ]("masked");
    e.classList.toggle("masked", (~~((visiblenum-1) / cellnum)) % 2 == 1);
  }
  createTable(ondo());
}


/* 引数のinput要素に対応した入力補助用のプルダウンを生成して返す(配置はしない) */
function createDropdown(inputElement, items, callback) {
  // メインのdivを作成
  let container = document.createElement('div');
  container.className = 'button-dropdown-wrapper';

  // プルダウンメニューを作成
  let dropdown = document.createElement('div');
  dropdown.className = 'template-dropdown';

  // リストを作成
  let ul = document.createElement('ul');
  items.forEach(item => {
    let li = document.createElement('li');
    li.textContent = item;

    // 項目をクリックしたときの処理
    li.addEventListener('click', function() {
      inputElement.value = item; // 入力欄に反映
      dropdown.style.display = 'none'; // メニューを閉じる
      if(callback) callback();
    });

    ul.appendChild(li);
  });

  dropdown.appendChild(ul);

  // ボタンを作成
  let button = document.createElement('button');
  button.textContent = '▼';

  // ボタンをクリックしたときの処理
  button.addEventListener('click', function(event) {
    event.stopPropagation(); // 他のクリックイベントをキャンセル
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block'; // メニューの表示/非表示切替
  });

  // コンテナにボタンとドロップダウンを追加
  container.appendChild(button);
  container.appendChild(dropdown);

  return container; // 生成した要素を返す(配置はしない)
}

// 領域外クリックでプルダウンメニューを閉じる処理
document.addEventListener('click', closeDropdowns);
function closeDropdowns(event) {
  let dropdowns = document.querySelectorAll('.template-dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.style.display = 'none'; // 全てのプルダウンを閉じる
  });
}






/*========= 計算処理 ================================================*/
class scoredata{
  vals = [BigNumber.zero, BigNumber.zero];
  constructor({input, eid, rankidx, val}){
    this.input = input;
    this.eid = eid;
    this.add(rankidx, val);
  }
  add(rankidx, val){
    this.vals[rankidx] = this.vals[rankidx].plus(val);
  }
  div(rankidx, val){
    this.vals[rankidx] = this.vals[rankidx].div(val);
  }
}

class errdata{
  probs = [BigNumber.zero, BigNumber.zero]; // [上級, 下級]
  counts = new Uint8Array(20); // eidごとの現在付与行数
  capped = new Uint8Array(20); // eidごとの制限到達チェック(キャッシュ)
  hasCapped = false; // 制限に到達しているものがあるか（キャッシュ）
  
  _stack = [];
  
  store(eid){
    this._stack.push({
      eid,
      probs: [this.probs[0], this.probs[1]],
      counts: this.counts[eid],
      capped: this.capped[eid],
      hasCapped: this.hasCapped
    });
  }
  
  restore(){
    const s = this._stack.pop();
    
    this.probs = s.probs;
    this.counts[s.eid] = s.counts;
    this.capped[s.eid] = s.capped;
    this.hasCapped = s.hasCapped;
  }
}

/* スコア入力に式を許可する */
function inputCalc(expr) {
  if (expr.trim() == "") return 0;
  try{
    // 許可する文字を制限する
    if (!/^[0-9+\-*/.\s]+$/.test(expr)) {
      throw new Error("invalid characters");
    }
    
    return Function(`"use strict"; return (${expr})`)();
  }catch(ex){
    return -1;
  }
}

function ondo(){
  
  const data     = window.selectedcube[1];
  let maxline  = window.selectedmaxline;
  let applyerrlist = window.checkedapplyerrlist;
  
  const exportdata = data.exportdata;
  let {rank, cubename, weights} = exportdata;
  let cuberankrate = data.ratetable[cubename][rank];
  
  let fixlinenum = data.fixlinenum[cubename];
  if(fixlinenum > 0) maxline = fixlinenum;
  
  let inputscores = document.getElementsByClassName("input-score");
  
  let errlist1 = data.potentialerrorlist;
  let errlist2 = data.potentialerrorlist2;
  
  let scores = [];
  let scoremap = new Map();
  let maxscore = 0; /* 全スコア未入力判定用 */
  let maxeid = -1;
  for(let i = 0; i < inputscores.length; i++){
    let inputscore = inputscores[i];
    let val = inputscore.value.trim();
    if ( /^[+\-*/]/.test(val) ) val = inputscore.autoinput + val;
    val = inputCalc(val);
    /*
    let val = inputscore.value;
    val = inputscore.validity.badInput ? -1 : +val;
    */
    if(inputscore.parentElement.style.display == "none"){
      val = 0;
    }else{
      inputscore.classList.toggle("error", val < 0);
      if( val < 0 ) val = 0;
    }
    
    let n = ( i < weights[0].length - 1 ) ? 0 : 1;
    let ws = weights[n];
    let wdata = ws[ i+1 - ( n ? (weights[0].length - 1) : 0 ) ];
    
    /* 最適化のためスコアと重複制限グループが同じなら抽選率の比重をまとめる */
    let w   = wdata.weight;
    let pid = wdata.id;
    let eid = errlist2[pid];
    if( !applyerrlist || eid == undefined ) eid = -1;
    let bool = true;
    
    const key = val + "|" + eid;
    let sc = scoremap.get(key);
    if (sc){
      /* スコアとエラーグループが一致するデータがあれば加算する */
      sc.add(n, w);
    } else {
      /* 新規グループなら追加する */
      if( maxscore < val ) maxscore = val;
      sc = new scoredata({input: BigNumber(val), eid, rankidx: n, val: w});
      scoremap.set(key, sc);
      scores.push(sc);
    }
  }
  
  for(let sc of scores){
    sc.div(0, weights[0][0]);
    sc.div(1, weights[1][0]);
  }
  
  // スコアをinput降順→eid昇順でソート
  scores.sort((a, b) =>
    b.input.comparedTo(a.input) || a.eid - b.eid
  );
  
  let vs = [];
  let result = {};
  
  let start = new Date();
  if( 0 < maxscore ){
    calc( 0, maxline, new errdata(), scores );
  }else{
    result["0"] = BigNumber.one;
  }
  
  return {rank, cubename, list: result};
  
  /* line=line～maxline-1の再帰処理 */
  function calc(line=0, maxline=3, edata, scores, prob = BigNumber.one, topscores = []){
    
    /**
    * 重複エラー処理について
    * KMS公式より：１行目から設定していき、潜在重複エラーならその行の等級抽選からやり直す？
    */
    
    const  one = BigNumber.one
    ,     zero = BigNumber.zero;
    
    // ヘキサキューブ用スコア足切り
    let scores2 = scores;
    if ( 3 < maxline ){
      let isUpdateTopscores = false;
      // スコア上位3行を格納したtopscoresを作成
      if ( 3 == line ){
        // 4行目開始(vs.length=3)の時点でコピーを作成し昇順ソート
        topscores = [...vs];
        topscores.sort( (a, b) => a.comparedTo(b) );
        isUpdateTopscores = true;
      } else if(3 < line){
        let v = vs[line-1];
        if ( topscores[0].lt(v) ){
          // 昇順になるように挿入位置を決める
          let idx = 0;
          for (let i = 1; i < 3; i++){
            if (topscores[i].lt(v)) idx++;
            else break;
          }
          topscores.shift();
          topscores.splice(idx, 0, v);
          isUpdateTopscores = true;
        }
      }
      if (isUpdateTopscores){
        let topsum = topscores.reduce( (sum, sc) => sum.plus(sc) );
        if ( topsum.gte( scores[0].input.times(3) ) ){
          // 理論最大値なので強制終了する
          setResult(vs, prob);
          return;
        }
        // 足切りしたスコアの作成
        scores2 = [];
        let cutScore0 = new scoredata({input: zero, eid: -1, rankidx: 0, val: 0});
        let isCut = false;
        scores.forEach( sc => {
          if ( sc.eid < 0 && sc.input.lt( topscores[0] ) ){
            cutScore0.add( 0, sc.vals[0] );
            cutScore0.add( 1, sc.vals[1] );
            isCut = true;
          }
          else scores2.push(sc);
        });
        if (isCut) scores2.push(cutScore0);
      }
    }
    scores = scores2;
    
    // いずれかが重複制限に達していれば制限処理
    let eprobs = edata.probs;
    let errprob = zero;
    if( edata.hasCapped ){
      /* この行で重複制限を引く(=引き直す)確率 */
      errprob = eprobs[0].times( cuberankrate[line][0] ).plus(
                  eprobs[1].times( cuberankrate[line][1] )
                );
    }
    
    for(let i = 0; i < scores.length; i++){
      const sc = scores[i];
      let eid = sc.eid;
      if( edata.capped[eid] ) continue; /* 重複制限チェック */
      
      let r =        sc.vals[0].times( cuberankrate[line][0] )
              .plus( sc.vals[1].times( cuberankrate[line][1] ) );
      if( r.lte(0) ) continue;
      
      vs[line] = sc.input;
      
      let prob2 = prob.times( errprob.isZero() ? r : r.div( one.minus(errprob) ) );
      
      // 最終行でなければ重複制限情報を更新して再帰
      if( line+1 < maxline ){
        let isChange = 0 <= eid;
        if (isChange){
          // 古い値を保持し、再帰終了後に戻す
          edata.store(eid);
          
          const {probs, counts, capped} = edata;
          counts[eid] = 1 + ( counts[eid] || 0 );
          if( errlist1[eid][1] <= counts[eid] ){
            capped[eid] = 1;
            edata.hasCapped = true;
            for(let esc of scores){
              if( esc.eid != eid ) continue;
              probs[0] = probs[0].plus(esc.vals[0]);
              probs[1] = probs[1].plus(esc.vals[1]);
            }
          }
        }
        calc(line+1, maxline, edata, scores, prob2, topscores);
        if (isChange) edata.restore();
        continue;
      }
      
      /* 以降は最終行のみ処理 */
      setResult(vs, prob2);
    }
    return;
  }
  
  function setResult(vs, prob){
    let v = BigNumber.zero;
    if( 3 < maxline ){
      /* ヘキサキューブ用 スコアの高い順にmaxline行最大3行のスコアをまとめる */
      //vs.sort((a,b)=>{/* 降順ソート */ return (a < b) - (a > b)});
      let v0 = 0, v1 = 0, v2 = 0;
      for(let v of vs){
        v = +v;
        if(v <= 0) continue;
        if(v2 >= v) continue;
        if(v1 >= v){
          v2 = v;  continue;
        }
        v2 = v1;
        if(v0 >= v){
          v1 = v;
        }else{
          v1 = v0;
          v0 = v;
        }
      }
      v = v.plus(v0).plus(v1).plus(v2);
    }else{
      for(let i = 0; i < maxline; i++){
        v = v.plus(vs[i]);
      }
    }
    result["" + v] = prob.plus( result["" + v] || 0 );
  }
}











