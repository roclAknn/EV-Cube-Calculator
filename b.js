

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

BigNumber.config({ DECIMAL_PLACES: 25 }); // BigNumber.jsの計算精度
window.calcRoundDegit = 30; // 出力累積計算の丸め位置(-1：javascript/BigNumber仕様)
window.exportRoundDegit = 12; // 出力結果の丸め位置(-1：javascript/BigNumber仕様)

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
  
  createTable([]);
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
  if( window.selectedcube ){
    let cubename = window.selectedcube[2];
    Array.apply(null, inputmaxline.options).forEach((k, i)=>{
      if( cubename == "uni" ){
        k.innerHTML = "" + (i + 1) + "行狙い";
      }else{
        k.innerHTML = "" + (3 - i) + "行";
      }
    });
  }
  
  if( eqp < 0 || eqplv < 0 || rank < 0 || maxline <= 0 ) return;
  
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

function createTable(list){/* type:出力タイプ デフォルトは期待値 */
  createTable.list = list;
  createTable.switch();
}

/* 設定に従って確率表の表示 */
createTable.switch = function(){
  const type1 = document.getElementById("exporttype1").selectedOptions[0];
  const type2 = document.getElementById("exporttype2").selectedOptions[0];
  let type3 = document.getElementById("exporttype3");
  if( type3.validity.badInput ) type3 = 1;
  else type3 = +type3.value;
  
  let cubename;
  let linenum;
  if( window.selectedcube ) cubename = window.selectedcube[2];
  if( window.selectedmaxline ) linenum = window.selectedmaxline;
  
  let list = this.list;
  let list2 = {};
  
  let keys = Object.keys(list).sort((a,b)=>{/* スコア降順ソート */ return (+a < +b) - (+a > +b)});
  let r = new BigNumber(0);
  let zero = new BigNumber(0);
  let one = new BigNumber(1);
  let e50 = new BigNumber( Math.LN2 ).times(-1);
  let e05 = new BigNumber( Math.LN2 ).plus( Math.LN10 ).times( -1 );
  for(let v of keys){
    let rr = list[v];
    if     ( rr.gt(1) ) rr = one;
    else if( rr.lt(0) ) rr = zero;
    
    /* v==0で帳尻を合わせるフラグ */
    let isAdjust = (v == 0);
    
    /* ユニキューブは潜在行数を行選択確率として使う */
    /* 0スコアも潜在行数を含めた出力にする（平均値1ではなく3）行数の設定をここで確認できるようにするため */
    if(cubename == "uni"){
      let targetlinenum = 3-(linenum-1); // 1~3
      rr = rr.times(targetlinenum).div(3);
      if (targetlinenum < 3) isAdjust = false; // 3行狙いのみ修正
    }
    
    if(calcRoundDegit >= 0){
      rr = rr.decimalPlaces(calcRoundDegit); // 恣意的丸め(累積計算精度)
    }
    r = r.plus(rr);
    if     ( isAdjust ) r = one;
    else if( r.gt(1) ) r = one;
    else if( r.lt(0) ) r = zero;
    
    switch(type1.value){
      case "numavg": 
        list2[v] = [one.div(rr), one.div(r)];
        break;
      case "num50": /* とりあえずライブラリ追加なしで */
        list2[v] = [ e50.div( Math.log( +one.minus(rr) ) ), e50.div( Math.log( one.minus(r) ))];
        break;
      case "num95":
        list2[v] = [ e05.div( Math.log( +one.minus(rr) ) ), e05.div( Math.log( one.minus(r) ))];
        break;
      case "prob1":
        list2[v] = [rr, r];
        break;
      case "prob100":
        list2[v] = [rr.times(100), r.times(100)];
        break;
      case "prob10000": 
        list2[v] = [rr.times(10000), r.times(10000)];
        break;
    }
  }
  list = list2;
  let showbool = ( type3 != 0 && type3 != 1 );
  let table = document.createElement("div");
  table.classList.add("table");
  if( showbool ) table.classList.add("showsecondary");
  
  let tagstart = `<div class="coltitle">`;
  let inner = `${tagstart}<span>Score</span></div>${tagstart}<span>${type1.label}(${type2.value})</span></div>`;
  if( showbool ) inner += `${tagstart}<span>x${type3}</span></div>`;
  
  table.insertAdjacentHTML("beforeend", inner);
  
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i];
    let inner =  `<div><span>${k}</span></div>`;
    
    let kk = (type2.value == "==" ? list[k][0] : list[k][1]);
    for( let ii = 0; ii <= 1; ii++ ){
      if( ii == 1 && !showbool ) break;
      let kkk = (ii == 1) ? kk.times(type3) : kk;
      
      // 恣意的丸め(出力精度)
      if (exportRoundDegit >= 0){
        kkk = kkk.decimalPlaces(exportRoundDegit);
      }
      
      let [rateint, ratedecimal] = kkk.toFixed().split(".");
      if( ratedecimal > 0 ) rateint = "" + rateint + ".";
      inner += `<div><span><span class="int">${rateint}</span><span class="decimal">${ratedecimal||""}</span></span></div>`;
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
  //let pweights = data.weights[cubename];
  
  let ownerdiv = document.getElementById("potentialdiv");
  
  let fragment = new DocumentFragment();
  data.exportdata = [rank]; /*確率出力用データ初期化*/
  
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
      let pnum = pdata[0];
      
      let pname     = data.potentialinfolist[pnum][0];
      let pinfolist = data.potentialinfolist[pnum][1];
      let pdepth = pinfolist[0];
      let pinfo  = pinfolist[1 + rank];
      
      if(pinfo.length <= 0){
        console.error("潜在情報の指定等級の情報が空");
        console.log([pnum, pname, pinfo]);
      }
      
      let pval = null;
      for(let i = pinfo.length - 1; 0 <= i; i--){
        if(lv < pinfo[i][0]) continue;
        pval = pinfo[i];
        break;
      }
      if(!pval) return;
      
      //let rateweight = pweights[pnum][rank];
      let rateweight = pdata[1];
      if( !rateweight || isNaN(rateweight) ){
        console.error("重みづけが不正");
        //console.log([pnum, pname, rateweight, pweights]);
        console.log([pnum, pname, rateweight, pdata[1]]);
      }
      sumweight += rateweight;
      weights.push([rateweight, pnum]);
      
      trdatas.push([pname, pval, rateweight, pdepth, pnum]);
    });
    
    weights[0] = sumweight;
    data.exportdata.push(weights);
    
    for(let trdata of trdatas){
      let valdiv = document.createElement("div");
      valdiv.className = `gridbox1 cell ${commons.rankclassnames[rank]}`;
      valdiv.dataset.potentialdepth = trdata[3];
      valdiv.dataset.potentialrank = rank;
      
      let autodiv = valdiv.cloneNode();
      let namediv = valdiv.cloneNode();
      let scorediv = valdiv.cloneNode();
      let ratediv = valdiv.cloneNode();
      
      valdiv.classList.add("potential-val");
      namediv.classList.add("potential-name");
      scorediv.classList.add("potential-score");
      ratediv.classList.add("potential-rate");
      
      valdiv.innerHTML = trdata[1][1] || "";
      namediv.innerHTML = trdata[0];
      //ratediv.innerHTML = "" + (Math.round(trdata[2] * 100*10**4 / sumweight) / 10**4) + " %";
      ratediv.innerHTML = "" + (trdata[2] * 100 / sumweight).toFixed(4) + " %";
      
      
      let input = document.createElement("input");
      input.autoinput = trdata[1][1] || 1;
      input.type      = "number";
      input.className = `input-status no-spin input-score input-score-${trdata[4]}`;
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
    let list = ondo();
    if( sid != oninputscore.sid ) return;
    createTable(list);
  }, oninputscore.delay);
}

function onautoinput(){
  
  let score = this.score;
  //遅延処理の場合に対応できないのでerrorクラスで判定しない
  let sc = score.validity.badInput ? -1 : +score.value;
  
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
function ondo(){
  
  let data     = window.selectedcube[1];
  let cubename = window.selectedcube[2];
  let maxline  = window.selectedmaxline;
  let applyerrlist = window.checkedapplyerrlist;
  let rank = data.exportdata[0];
  let cuberankrate = data.ratetable[cubename][rank];
  let ws = [data.exportdata[1], data.exportdata[2]];
  
  let fixlinenum = data.fixlinenum[cubename];
  if(fixlinenum > 0) maxline = fixlinenum;
  
  let inputscores = document.getElementsByClassName("input-score");
  
  let errlist1 = data.potentialerrorlist;
  let errlist2 = data.potentialerrorlist2;
  
  let scores = [];
  let maxscore = 0; /* 全スコア未入力判定用 */
  
  for(let i = 0; i < inputscores.length; i++){
    let inputscore = inputscores[i];
    let val = inputscore.value;
    val = inputscore.validity.badInput ? -1 : +val;
    if(inputscore.parentElement.style.display == "none"){
      val = 0;
    }else{
      inputscore.classList.toggle("error", val < 0);
      if( val < 0 ) val = 0;
    }
    let n = +!( i+1 < ws[0].length );
    let wdata = ws[n][ i+1 - ( n ? (ws[0].length-1) : 0 ) ];
    
    /**
    * 最適化のためスコアと重複制限グループが同じなら抽選率の比重をまとめる
    * scores[i] = [スコア　[上位比重　下位比重]　重複エラーグループ]
    */
    let w = wdata[0];
    let pid = wdata[1];
    let eid = errlist2[pid];
    if( !applyerrlist || eid == undefined ) eid = -1;
    let bool = true;
    for(let sc of scores){
      if(sc[0] == val && sc[2] == eid){
        sc[1][n] += w;
        bool = false;
        break;
      }
    }
    if( bool ){
      if( maxscore < val ) maxscore = val;
      scores.push([val, (n ? [0, w] : [w, 0]), eid]);
    }
  }
  
  for(let sc of scores){
    sc[1][0] = new BigNumber(sc[1][0]).div(ws[0][0]);
    sc[1][1] = new BigNumber(sc[1][1]).div(ws[1][0]);
  }
  
  
  /**
  * 重複エラー処理について
  * KMS公式より：１行目から設定していき、潜在重複エラーならその行の等級抽選からやり直す？
  */
  let vs = [], rs = [];
  let result = {};
  
  if( 0 < maxscore ){
    calc( 0, maxline, [[new BigNumber(0), new BigNumber(0)], [], []] );
  }else{
    result["0"] = new BigNumber(1);
  }
  
  return result;
  
  
  /* line=line～maxline-1の再帰処理 */
  function calc(line=0, maxline=3, erw ){
    let err = new BigNumber(0);
    /*
    * line-1行までに制限潜在があれば制限処理
    * erw[2]にtrueを含むかの判定。truefalseを切り替えないのでlengthの確認で十分
    */
    if( erw[2].length ){
      /* line行で重複制限を引く(=この行を引き直す)確率 */
      err = erw[0][0].times( cuberankrate[line][0] ).plus( err );
      err = erw[0][1].times( cuberankrate[line][1] ).plus( err );
    }
    
    for(let sc of scores){
      let r, v;
      
      let eid = sc[2];
      if( erw[2][ eid ] ) continue; /* 重複制限チェック */
      
      r =         sc[1][0].times( cuberankrate[line][0] );
      r = r.plus( sc[1][1].times( cuberankrate[line][1] ) );
      if( +r <= 0 ) continue;
      
      vs[line] = new BigNumber( sc[0] );
      rs[line] = r.div( new BigNumber(1).minus(err) );
      
      if( line+1 < maxline ){
        let erw2 = erw;
        let eid = sc[2];
        if( eid < 0 ){
        }else{
          erw2 = [erw[0].concat(), erw[1].concat(), erw[2].concat()];
          erw2[1][eid] = 1 + ( erw2[1][eid] || 0 );
          if( errlist1[eid][1] <= erw2[1][eid] ){
            erw2[2][eid] = true;
            for(let esc of scores){
              if( esc[2] != eid ) continue;
              erw2[0][0] = erw2[0][0].plus(esc[1][0]);
              erw2[0][1] = erw2[0][1].plus(esc[1][1]);
            }
          }
        }
        calc(line+1, maxline, erw2);
        continue;
      }
      
      /* 以降は最終行のみ処理 */
      v = new BigNumber(0);
      if( 3 < maxline ){ /* 仮ヘキサキューブ用 スコアの高い順にmaxline行最大3行のスコアをまとめる */
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
        for(let i = 0, imax = Math.min(maxline, 3); i < imax; i++){
          v = v.plus(vs[i]);
        }
      }
      
      r = new BigNumber(1);
      for( let rr of rs ){
        r = r.times( rr );
      }
      
      result["" + v] = r.plus( result["" + v] || 0 );
    }
    return;
  }
  
}











