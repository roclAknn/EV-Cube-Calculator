
const cubetypes = [
  ["KMS/レッドキューブ",   regularKMS, "red"]
, ["KMS/ブラックキューブ", regularKMS, "black"]
, ["KMS/名匠のキューブ", regularKMS, "meister"]
, ["KMS/職人のキューブ", regularKMS, "craftman"]
, ["KMS/怪しいキューブ", regularKMS, "occult"]

, ["KMS/アディショナル・ホワイトアディショナルキューブ", additionalKMS, "additional"]
, ["KMS/怪しいアディショナルキューブ", additionalKMS, "rareadditional"]

, ["非公式/ヘキサキューブ(KMS無償テーブル)", regularKMS, "hexa"]
];

const cubegroups = [
  ["KMS/上潜在/有償テーブル", [0, 1]]
, ["KMS/上潜在/無償テーブル", [2, 3, 4]]
, ["KMS/下潜在/共通テーブル", [5, 6]]
, ["非公式テーブル", [7]]
];
const equipmenttypes = [
  "武器",   "エンブレム", "補助武器", "フォースシールド/ソウルリング", "盾"
, "帽子",   "服(上)",     "服(全身)", "服(下)",     "靴"
, "手袋",   "マント",     "ベルト",   "肩",         "顔飾り"
, "目飾り", "イヤリング", "指輪",     "ペンダント", "機械心臓"
];

const potentialranks = [
  "レジェンダリー", "ユニーク", "エピック", "レア", "ノーマル"
];

const rankclassnames = ["legendary", "unique", "epic", "rare", "normal"];

window.selectedcube = null;
window.selectedequipmenttype = -1;
window.selectedequipmentlevel = -1;
window.selectedrank = -1;
window.selectedmaxline = -1;


/*===== UI処理 =================================================================*/

function initialize(){
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
  for(let i = 0; i < equipmenttypes.length; i++){
    inner += `<option value=${i}>${equipmenttypes[i]}</option>`;
  }
  sel.innerHTML += inner;
  sel.disabled = false;
  
  sel = document.getElementById("input-equipmentlevel");
  sel.disabled = false;
  
  sel = document.getElementById("input-potentialrank");
  inner = "";
  for(let i = 0; i < 4; i++){
    inner += `<option value=${i}>${potentialranks[i]}</option>`;
  }
  sel.innerHTML += inner;
  sel.disabled = false;
  
  sel = document.getElementById("input-maxline");
  sel.disabled = false;
  
  
  let div = document.getElementById("openerdiv");
  div.onclick = div.ontouch = function(){
    let div = document.getElementById("headerdiv");
    let ishide = toggleclass(div, "hide");
    div = document.getElementById("openerdiv");
    toggleclass(div, "opener", ishide);
  };
  
  createTable([]);
}

function toggleclass(element, cn, force=-1){
  let ret = false;
  let c = element.classList;
  if( force < 0 ){
    ret = !c.contains(cn);
  }else{
    ret = force;
  }
  c[ ret ? "add" : "remove"](cn);
  return ret;
}

function onchangecube(){
  /* window.selectedcubeはここで更新しないこと */
  let val = +document.getElementById("input-cubetype").value;
  if( val < 0 ) return;
  val = cubetypes[val];
  let data = val[1];
  let cubename = val[2];
  let ratetable = data.ratetable[cubename];
  
  let sel = document.getElementById("input-potentialrank");
  for( let opt of sel.options ){
    let val = +opt.value;
    if( val < 0) continue;
    if( ratetable[val] ){
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
  let val = +document.getElementById("input-cubetype").value;
  if( val < 0 ) return;
  let flg = false;
  val = cubetypes[val];
  if( window.selectedcube ){
    let data = window.selectedcube[1];
    let cubename = window.selectedcube[2];
    let temp = data.equipmentpotential[cubename];
    data = val[1];
    cubename = val[2];
    if( temp != data.equipmentpotential[cubename] ) flg = true;
  }
  window.selectedcube = val;
  
  
  val = +document.getElementById("input-equipmenttype").value;
  if( window.selectedequipmenttype != val ) flg = true;
  let eqp = window.selectedequipmenttype = val;
  
  let input = document.getElementById("input-equipmentlevel");
  val = input.validity.badInput ? -1 : +input.value;
  toggleclass(input, "error", val < 0);
  if( window.selectedequipmentlevel != val ) flg = true;
  let lv   = window.selectedequipmentlevel = val;
  
  val = +document.getElementById("input-potentialrank").value;
  if( window.selectedrank != val ) flg = true;
  let rank = window.selectedrank = val;
  
  /* 行数は潜在一覧出力には影響しない */
  let flg2 = false;
  val = +document.getElementById("input-maxline").value;
  if( window.selectedmaxline != val ) flg2 = true;
  let maxline = window.selectedmaxline = val;
  
  if( eqp < 0 || lv < 0 || rank < 0 || maxline <= 0 ) return;
  
  conditionupdate(); /* 出力条件の表示 */
  if( flg ){
    createcubetable(); /* スコア確率表も更新される */
  }else{
    createTable(ondo());
  }
  
}

function conditionupdate(){
  let name = window.selectedcube[0];
  let eqp = window.selectedequipmenttype;
  let lv = window.selectedequipmentlevel;
  let rank = window.selectedrank;
  let date = window.selectedcube[1].date;
  
  document.getElementById("condition-cube").innerHTML = name;
  document.getElementById("condition-eqp").innerHTML = equipmenttypes[eqp];
  document.getElementById("condition-level").innerHTML = "Lv." + lv;
  document.getElementById("condition-rank").innerHTML = potentialranks[rank];
  document.getElementById("condition-date").innerHTML = date.toLocaleDateString();
}

function setcubeinfodiv(){
  let data = window.selectedcube[1];
  let cubename = window.selectedcube[2];
  let ratetable = data.ratetable[cubename];
  let upgtable  = data.upgradetable[cubename];
  
  /* ヘキサキューブの確率を強引に表示する */
  if( cubename == "hexa" ){
    let newtable = [
        [["1行目同等級"], ["2行目同等級"], ["3行目同等級"]]
      , [[], [], []]
      , [["4行目同等級"], ["5行目同等級"], ["6行目同等級"]]
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
    let cn = rankclassnames[i];
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
  let div = document.getElementById("cubeimagediv");
  div.style.backgroundImage = `url("./images/${data.images[cubename]}")`;
}

const trlist = [];
function createTable(list) {
  let keys = Object.keys(list).sort((a,b)=>{/* 降順ソート */ return (+a < +b) - (+a > +b)});
  
  let table = document.createElement("table");
  let tr = table.insertRow(0);
  tr.classList.add("coltitle");
  tr.innerHTML = `<td>Score</td><td>平均消費数 (==Score)</td><td>平均消費数 (>=Score)</td>`;
  trlist.length = 0;
  
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i];
    let row = table.insertRow(i+1);
    trlist.push(row);
    let inner =  `<td>${k}</td>`;
    
    for(let kk of list[k]){
      let rateint = Math.trunc(kk);
      let ratedecimal = kk - rateint; /* Bignumberを使わない */
      rateint = "" + rateint + (ratedecimal > 0 ? "." : "");
      ratedecimal = ("" + ratedecimal).split(".")[1] || "";
      inner += `<td><span class="int">${rateint}</span><span class="decimal">${ratedecimal}</span></td>`;
    }
    row.innerHTML = inner;
  }
  let tdiv = document.getElementById("tablediv");
  tdiv.innerHTML = "";
  tdiv.appendChild(table);
  return false;
}


function createcubetable(){
  
  let eqp  = window.selectedequipmenttype;
  let rank = window.selectedrank;
  let lv   = window.selectedequipmentlevel;
  
  let data     = window.selectedcube[1];
  let cubename = window.selectedcube[2];
  let pweights = data.weights[cubename];
  
  let ownerdiv = document.getElementById("potentialdiv");
  
  let fragment = new DocumentFragment();
  fragment.appendChild(ownerdiv.children[0].cloneNode(true));
  fragment.appendChild(ownerdiv.children[1].cloneNode(true));
  fragment.appendChild(ownerdiv.children[2].cloneNode(true));
  
  data.exportdata = [rank]; /*確率出力用データ初期化*/
  
  createpotentialline(eqp, rank, lv);
  createpotentialline(eqp, rank+1, lv);
  
  ownerdiv.innerHTML = "";
  ownerdiv.appendChild(fragment);
  
  onchangedisplayamount(); /* スコア確率表も更新される */
  
  function createpotentialline(eqp, rank, lv){
    let trdatas = [];
    let sumweight = 0;
    let weights = [0];
    data.equipmentpotential[cubename][eqp][rank].forEach((pnum)=>{
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
      
      let rateweight = pweights[pnum][rank];
      if( !rateweight || isNaN(rateweight) ){
        console.error("重みづけが不正");
        console.log([pnum, pname, rateweight, pweights]);
      }
      sumweight += rateweight;
      weights.push([rateweight, pnum]);
      
      trdatas.push([pname, pval, rateweight, pdepth, pnum]);
    });
    
    weights[0] = sumweight;
    data.exportdata.push(weights);
    
    /* 等級などを表示するヘッダーを作成 */
    //let headdiv = document.createElement("div");
    //headdiv.className = "gridbox1 cell potentialrank-" + rank;
    //headdiv.style.cssText = "grid-column: 1 / span 4; display: grid; grid-template-columns: repeat(3, 1fr);";
    //headdiv.innerHTML = `<div class="gridbox1 cell">${data.ranks[rank]}</div><div class="gridbox1 cell">${data.equipments[eqp]}</div><div class="gridbox1 cell">レベル ${lv}</div>`;
    //fragment.appendChild(headdiv);
    
    for(let trdata of trdatas){
      let valdiv = document.createElement("div");
      valdiv.className = `gridbox1 cell ${rankclassnames[rank]}`;
      valdiv.dataset.potentialdepth = trdata[3];
      
      let namediv = valdiv.cloneNode();
      let scorediv = valdiv.cloneNode();
      let ratediv = valdiv.cloneNode();
      
      valdiv.classList.add("potential-val");
      namediv.classList.add("potential-name");
      scorediv.classList.add("potential-score");
      ratediv.classList.add("potential-rate");
      
      valdiv.innerHTML = trdata[1][1] || "";
      namediv.innerHTML = trdata[0];
      ratediv.innerHTML = "" + (Math.round(trdata[2] * 100*10**4 / sumweight) / 10**4) + " %";
      scorediv.innerHTML = `<input class="input-status no-spin input-score input-score-${trdata[4]}" type="number" oninput="createTable(ondo());">`;
      
      fragment.appendChild(valdiv);
      fragment.appendChild(namediv);
      fragment.appendChild(scorediv);
      fragment.appendChild(ratediv);
    }
  }
}

function onchangedisplayamount(){
  let divs = document.querySelectorAll(`#potentialdiv div[data-potentialdepth]`)
  if(divs.length <= 0) return;
  
  let val = +document.getElementById("input-potential-displayamount").value;
  let visiblenum = 0;
  for(e of divs){
    let d = +e.dataset.potentialdepth;
    e.style.display = (d <= val) ? "" : "none";
    if (d > val) continue;
    visiblenum++;
    e.classList[ (~~((visiblenum-1) / 4)) % 2 == 0 ? "remove" : "add" ]("masked");
    toggleclass(e, "masked", (~~((visiblenum-1) / 4)) % 2 == 1);
  }
  createTable(ondo());
}



/*========= 計算処理 ================================================*/
function ondo(){
  
  let data     = window.selectedcube[1];
  let cubename = window.selectedcube[2];
  let maxline  = window.selectedmaxline;
  let rank = data.exportdata[0];
  let cuberankrate = data.ratetable[cubename][rank];
  let ws = [data.exportdata[1], data.exportdata[2]];
  
  if(cubename == "hexa") maxline = 6;
  
  let inputscores = document.getElementsByClassName("input-score");
  
  
  let scores = [];
  
  let errlist = data.potentialerrorlist;
  let weight0 = [0, 0];
  
  for(let i = 0; i < inputscores.length; i++){
    let inputscore = inputscores[i];
    let val = inputscore.value;
    val = inputscore.validity.badInput ? -1 : +val;
    if(inputscore.parentElement.style.display == "none"){
      val = 0;
    }else{
      toggleclass(inputscore, "error", val < 0);
      if( val < 0 ) val = 0;
    }
    let n = +!( i+1 < ws[0].length );
    let wdata = ws[n][ i+1 - ( n ? (ws[0].length-1) : 0 ) ];
    
    /**
    * 最適化のため潜在の評価値が0かつ重複制限リストにないなら抽選率の比重をまとめる
    */
    let id = wdata[1];
    let boolweight0 = (val == 0);
    switch( boolweight0 ){
      case true:
        a:for(let err of errlist){
          for(let e of err[0]){
            if( id != e ) continue;
            boolweight0 = false;
            break a;
          }
        }
        if( boolweight0 ){
          weight0[n] += wdata[0];
          break;
        }
      default:
        /* スコア, 同等級か(=0), 抽選比重, 潜在id */
        scores.push([ val, n, wdata[0], wdata[1] ]);
    }
  }
  scores.sort((a,b)=>{/* スコアで降順ソート */ return (a[0] < b[0]) - (a[0] > b[0])});
  scores.push([ 0, 0, weight0[0], -1]);
  scores.push([ 0, 1, weight0[1], -1]);
  
  /**
  * 重複エラー処理について
  * KMS公式より：１行目から設定していき、潜在重複エラーならその行の等級抽選からやり直す？
  */
  let scs = [], vs = [], rs = [];
  let result = {};
  
  if( 0 < scores[0][0] ){
    calc(0, maxline, false);
  }else{
    result["0"] = 1;
  }
  
  /* line=line～maxline-1の再帰処理 */
  function calc(line=0, maxline=3, boolchkerr=false){
    let erw = [[0, 0], []];
    let err = new BigNumber(0);
    if( boolchkerr ){ /* line-1行までに制限潜在があれば制限処理 */
      /* line行で重複制限を引く(=この行を引き直す)確率 */
      erw = getreachweight(data, scores, scs);
      erw[0].forEach(( w, i )=>{
        if( !w ) return;
        let r = new BigNumber( w ).div( ws[ i ][0] ).times( cuberankrate[line][i] );
        err = err.plus( r );
      });
    }
    
    for(let sc of scores){
      scs[line] = sc;
      if( erw[1][ sc[3] ] ) continue; /* 重複制限チェック */
      if( cuberankrate[line][ sc[1] ] <= 0 ) continue; /* 等級抽選率が0なら次 */
      
      vs[line] = new BigNumber( sc[0] );
      rs[line] = new BigNumber( sc[2] ).div( ws[ sc[1] ][0] ).times( cuberankrate[line][sc[1]] ).div( new BigNumber(1).minus(err) );
      
      if( line+1 < maxline ){
        let eid = data.potentialerrorlist2[ sc[3] ];
        calc(line+1, maxline, boolchkerr || 0 <= eid);
        continue;
      }
      
      /* 最終行の処理 */
      let vs2 = vs;
      if( 3 < maxline ){
        /* 仮ヘキサキューブ用 スコアの高い順にmaxline行最大3行のスコアをまとめる */
        vs2 = vs2.concat().sort((a,b)=>{/* 降順ソート */ return (a < b) - (a > b)});
      }
      let v = new BigNumber(0);
      for(let i = 0, imax = Math.min(maxline, 3); i < imax; i++){
        v = v.plus(vs2[i]);
      }
      let r = new BigNumber(1);
      for( let rr of rs ){
        r = r.times( rr );
      }
      result["" + v] = r.plus( result["" + v] || 0 );
    }
    return;
  }
  
  
  /**
  *  スコア個別の確率から個別＆合計の期待値に変換
  */
  let keys = Object.keys(result).sort((a,b)=>{/* 降順ソート */ return (+a < +b) - (+a > +b)});
  let r = new BigNumber(0);
  for(let v of keys){
    r = r.plus(result[v]);
    result[v] = [new BigNumber(1).div(result[v]), new BigNumber(1).div(r)];
  }
  return result;
}

/**
* 潜在の重複制限に達しているかの判定 (ボスダメや被撃時無敵など)
* return [ [重み0, 重み1], 制限到達[潜在ID: true/undefined] ]
*/

function getreachweight(data, scores, sn = []){
  let reachs = [];
  let result = [[0, 0], reachs];
  let errlist1 = data.potentialerrorlist;
  let errlist2 = data.potentialerrorlist2;
  let errs = [];
  let isreach = false;
  for(let i = 0; i < sn.length; i++){
    let eid = errlist2[sn[i][3]];
    if( eid == undefined ) continue;
    let edata = errlist1[eid];
    errs[eid] = 1 + (errs[eid] || 0);
    if( edata[1] == errs[eid] ){
      for(let pid of edata[0]){
        reachs[pid] = true;
        isreach = true;
      };
    }
  }
  if(isreach){
    for(let sc of scores){
      if( !reachs[sc[3]] ) continue;
      result[0][ sc[1] ] += sc[2];
    }
  }
  return result;
}
