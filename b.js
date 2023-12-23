


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

window.selectedcube = null;
window.selectedequipmenttype = -1;
window.selectedequipmentlevel = -1;
window.selectedrank = -1;
window.selectedmaxline = -1;

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
  document.getElementById("condition-eqp").innerHTML = commons.equipmentnames[eqp];
  document.getElementById("condition-level").innerHTML = "Lv." + lv;
  document.getElementById("condition-rank").innerHTML = commons.ranknames[rank];
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
  let div = document.getElementById("cubeimagediv");
  div.style.backgroundImage = `url("./images/${data.images[cubename]}")`;
}

const trlist = [];
function createTable(list, type=1){/* type:出力タイプ デフォルトは期待値 */
  createTable.list = list;
  createTable.switch(type);
}

/* 期待値、中央値、確率の表示を設定/切替 */
createTable.switch = function(type=0){
  let list = this.list;
  let list2 = {};
  
  let keys = Object.keys(list).sort((a,b)=>{/* スコア降順ソート */ return (+a < +b) - (+a > +b)});
  let r = new BigNumber(0);
  let one = new BigNumber(1);
  let e50 = new BigNumber( Math.LN2 ).times(-1);
  let e05 = new BigNumber( Math.LN2 ).plus( Math.LN10 ).times( -1 );
  for(let v of keys){
    let rr = list[v];
    if     ( rr.gt(1) ) rr = new BigNumber(1);
    else if( rr.lt(0) ) rr = new BigNumber(0);
    r = r.plus(rr);
    if     ( r.gt(1) ) r = new BigNumber(1);
    else if( r.lt(0) ) r = new BigNumber(0);
    switch(type){
      case 0: 
        list2[v] = [rr, r];
        break;
      case 1: 
        list2[v] = [new BigNumber(1).div(rr), new BigNumber(1).div(r)];
        break;
      case 2: /* とりあえずライブラリ追加なしで */
        list2[v] = [ e50.div( Math.log( +one.minus(rr) ) ), e50.div( Math.log( one.minus(r) ))];
        break;
      case 3:
        list2[v] = [ e05.div( Math.log( +one.minus(rr) ) ), e05.div( Math.log( one.minus(r) ))];
        break;
    }
  }
  list = list2;
  
  let titlestr = ["確率[1/10000]", "平均値[個]", "50％ライン[個]", "95％ライン[個]"]
  
  
  let table = document.createElement("table");
  let tr = table.insertRow(0);
  tr.classList.add("coltitle");
  tr.innerHTML = `<td>Score</td><td>${titlestr[type]}(==Score)</td><td>${titlestr[type]}(>=Score)</td>`;
  tr.onclick = tr.ontouch = createTable.switch.bind( createTable, (type+1)%4 );
  trlist.length = 0;
  
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i];
    let row = table.insertRow(i+1);
    trlist.push(row);
    let inner =  `<td>${k}</td>`;
    
    for(let kk of list[k]){
      if(type == 0){/* 確率表示用 */
        kk = kk.times(10000);
      }
      let rateint = Math.trunc(kk);
      let ratedecimal = kk - rateint; /* 出力結果丸めたいのでBignumberを使わない */
      rateint = "" + rateint + (ratedecimal > 0 ? "." : "");
      ratedecimal = ("" + ratedecimal).split(".")[1] || "";
      inner += `<td><span class="int">${rateint}</span><span class="decimal">${ratedecimal}</span>`;
    }
    row.innerHTML = inner;
  }
  let tdiv = document.getElementById("tablediv");
  tdiv.innerHTML = "";
  tdiv.appendChild(table);
  return false;
};


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
    
    for(let trdata of trdatas){
      let valdiv = document.createElement("div");
      valdiv.className = `gridbox1 cell ${commons.rankclassnames[rank]}`;
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
      scorediv.innerHTML = `<input class="input-status no-spin input-score input-score-${trdata[4]}" type="number" oninput="oninputscore();">`;
      
      fragment.appendChild(valdiv);
      fragment.appendChild(namediv);
      fragment.appendChild(scorediv);
      fragment.appendChild(ratediv);
    }
  }
}

oninputscore.delay = 1000;
function oninputscore(){
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
      toggleclass(inputscore, "error", val < 0);
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
    if( eid == undefined ) eid = -1;
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
    if( erw[2].length ){ /* line-1行までに制限潜在があれば制限処理 */
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











