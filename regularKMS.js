


console.log("loaded regularKMS.js");

regularKMS = {};

(function(data){

/* 公式を確認した日付 */
data.date = new Date("2023 12 20 GMT+0900");

/*
  参考元(公式)
  https://maplestory.nexon.com/Guide/OtherProbability/cube/red
  https://maplestory.nexon.com/Guide/OtherProbability/cube/black
  https://maplestory.nexon.com/Guide/OtherProbability/cube/strange
  https://maplestory.nexon.com/Guide/OtherProbability/cube/master
  https://maplestory.nexon.com/Guide/OtherProbability/cube/artisan
*/

/*---------- 汎用定義 -------------------------------------------------------- */

data.equipments = [
  "武器",   "エンブレム", "補助武器", "フォースシールド/ソウルリング", "盾"
, "帽子",   "服(上)",     "服(全身)", "服(下)",     "靴"
, "手袋",   "マント",     "ベルト",   "肩",         "顔飾り"
, "目飾り", "イヤリング", "指輪",     "ペンダント", "機械心臓"
];

let idx = [].indexOf.bind(data.equipments);
const 武器       = idx("武器")
,     エンブレム = idx("エンブレム")
,     補助武器   = idx("補助武器")
,     フォース   = idx("フォースシールド/ソウルリング")
,     盾         = idx("盾")
,     帽子       = idx("帽子")
,     服上       = idx("服(上)")
,     服全身     = idx("服(全身)")
,     服下       = idx("服(下)")
,     靴         = idx("靴")
,     手袋       = idx("手袋")
,     マント     = idx("マント")
,     ベルト     = idx("ベルト")
,     肩         = idx("肩")
,     顔飾り     = idx("顔飾り")
,     目飾り     = idx("目飾り")
,     イヤリング = idx("イヤリング")
,     指輪       = idx("指輪")
,     ペンダント = idx("ペンダント")
,     機械心臓   = idx("機械心臓")
;

data.ranks = [
  "レジェンダリー", "ユニーク", "エピック", "レア", "ノーマル"
];
idx = [].indexOf.bind(data.ranks);
const レジェ = idx("レジェンダリー")
,     ユニ   = idx("ユニーク")
,     エピ   = idx("エピック")
,     レア   = idx("レア")
,     ノマ   = idx("ノーマル")
;

let potentialnum = 0;
const pstr1 = potentialnum++, pdex1 = potentialnum++, pint1 = potentialnum++, pluk1 = potentialnum++
,     pstr2 = potentialnum++, pdex2 = potentialnum++, pint2 = potentialnum++, pluk2 = potentialnum++
,     pall1 = potentialnum++
,     pall2 = potentialnum++
,     patk = potentialnum++, pma  = potentialnum++
,     lvstr = potentialnum++, lvdex = potentialnum++, lvint = potentialnum++, lvluk = potentialnum++
,     istr1 = potentialnum++, idex1 = potentialnum++, iint1 = potentialnum++, iluk1 = potentialnum++
,     istr2 = potentialnum++, idex2 = potentialnum++, iint2 = potentialnum++, iluk2 = potentialnum++
,     iall1 = potentialnum++, iall2 = potentialnum++
,     iatk1 = potentialnum++, ima1  = potentialnum++
,     iatk2 = potentialnum++, ima2  = potentialnum++
,     php = potentialnum++,  pmp = potentialnum++
,     ihp = potentialnum++,  imp = potentialnum++
,     pcri = potentialnum++, pcrd1 = potentialnum++, pcrd2 = potentialnum++
,     pdam = potentialnum++
,     pboss1 = potentialnum++, pboss2 = potentialnum++
,     pign1 = potentialnum++,  pign2 = potentialnum++
,     ict1 = potentialnum++, ict2 = potentialnum++
,     ohp1 = potentialnum++,  omp1 = potentialnum++
,     ohp2 = potentialnum++,  omp2 = potentialnum++
,     oehp = potentialnum++, oemp = potentialnum++
,     orhp = potentialnum++, ormp = potentialnum++
,     oeff = potentialnum++
,     oinv = potentialnum++
,     opinv = potentialnum++
,     opsn1 = potentialnum++, ostn1 = potentialnum++, oslw1 = potentialnum++, oblk1 = potentialnum++, ofrz1 = potentialnum++, oseal1 = potentialnum++
,     opsn2 = potentialnum++, ostn2 = potentialnum++, oslw2 = potentialnum++, oblk2 = potentialnum++, ofrz2 = potentialnum++, oseal2 = potentialnum++
,     oemo1 = potentialnum++, oemo2 = potentialnum++, oemo3 = potentialnum++, oemo4 = potentialnum++, oemo5 = potentialnum++
,     ostl1 = potentialnum++, ostl2 = potentialnum++, ostl3 = potentialnum++
,     ispd = potentialnum++, ijmp = potentialnum++
,     pigndam1 = potentialnum++, pigndam2 = potentialnum++
,     iigndam1 = potentialnum++, iigndam2 = potentialnum++, iigndam3 = potentialnum++
,     prefdam1 = potentialnum++, prefdam2 = potentialnum++
,     pdef = potentialnum++
,     idef = potentialnum++
,     pdmp1 = potentialnum++, pdmp2 = potentialnum++
,     pdrop = potentialnum++, pmeso = potentialnum++
,     spwb = potentialnum++, spse = potentialnum++, spab = potentialnum++, spco = potentialnum++, sphb = potentialnum++, spht = potentialnum++, spmd = potentialnum++
;
data.potentialnum = potentialnum;

/*-------------------------------キューブの種類による違い-------------------------------------------*/
(()=>{
  /**
  * キューブの種類>潜在等級>各行の同等級付与率
  * 汎用処理で[同等級率, 下位等級率]に書き換える
  */
  data.ratetable = {
      "red": [
        [1, 0.1, 0.01]
      , [1, 0.1, 0.01]
      , [1, 0.1, 0.01]
      , [1, 0.1, 0.01]
    ]
    , "black": [
        [1, 0.2, 0.05,]
      , [1, 0.2, 0.05,]
      , [1, 0.2, 0.05,]
      , [1, 0.2, 0.05,]
    ]
    , "occult": [
        
      , 
      , [1, 0.009901, 0.009901]
      , [1, 0.000999, 0.000999]
    ]
    , "craftman" :[
        
      , [1, 0.011858, 0.011858, 0.988142]
      , [1, 0.047619, 0.047619, 0.952381]
      , [1, 0.166667, 0.166667, 0.833333]
    ]
    , "meister" :[
        [1, 0.001996, 0.001996]
      , [1, 0.016959, 0.016959]
      , [1, 0.079994, 0.079994]
      , [1, 0.166667, 0.166667]
    ]
    , "hexa" :[
        [1, 0.1, 0.01, 0.01, 0.1, 0.01]
      , [1, 0.1, 0.01, 0.01, 0.1, 0.01]
      , [1, 0.1, 0.01, 0.01, 0.1, 0.01]
      , [1, 0.1, 0.01, 0.01, 0.1, 0.01]
    ]
  };
  data.upgradetable = {
      "red"      : [ 0, 0.003, 0.018, 0.06 ]
    , "black"    : [ 0, 0.014, 0.035, 0.15 ]
    , "occult"   : [ 0, 0,        0,        0.009901 ]
    , "craftman" : [ 0, 0,        0.011858, 0.047619 ]
    , "meister"  : [ 0, 0.001996, 0.016959, 0.079994 ]
    , "hexa"     : [ "N/a", "N/a", "N/a", "N/a"]
  };
  data.images = {
      "red"      : "redcube.png"
    , "black"    : "blackcube.png"
    , "occult"   : "occultcube.png"
    , "craftman" : "craftmancube.png"
    , "meister"  : "meistercube.png"
    , "hexa"     : "hexacube.png"
  };
  
  
  data.weights = {};
  data.weights["red"]
  = data.weights["black"] = [];
  (()=>{
    let ws = data.weights.red;
    ws[pstr1] = [4,5,5,3,0]; ws[pdex1] = ws[pint1] = ws[pluk1] = ws[pstr1];
    ws[pall1] = [3,4,2,0,0];
    ws[patk] = [2,3,2,1,0]; ws[pma]  = ws[patk];
    ws[lvstr] = [2,2,,,]; ws[lvdex] = ws[lvint] = ws[lvluk] = ws[lvstr];
    ws[istr1] = [,,,3,3]; ws[idex1] = ws[iint1] = ws[iluk1] = ws[istr1];
    ws[istr2] = [,1,,,]; ws[idex2] = ws[iint2] = ws[iluk2] = ws[istr2]; /* 固定値 */
    ws[iall1] = [0,0,0,2,0];
    ws[iatk1] = [,,,2,2]; ws[ima1]  = ws[iatk1];
    ws[iatk2] = [2,,,,]; ws[ima2]  = ws[iatk2];
    ws[php]  = [4,6,5,3,0]; ws[pmp]  = ws[php];
    ws[ihp]  = [0,0,0,3,3]; ws[imp]  = ws[ihp];
    ws[pcri] = [2,4,2,1,0];
    ws[pcrd1] = [4,0,0,0,0];
    ws[pdam] = [2,3,2,1,0];
    ws[pboss1] = [4,3,0,0,0];
    ws[pboss2] = [2,0,0,0,0];
    ws[pign1] = [2,3,2,1,0];
    ws[pign2] = [2,0,0,0,0];
    ws[ict1]  = [3,0,0,0,0];
    ws[ict2]  = [2,0,0,0,0];
    ws[ohp1]   = [0,0,2,1,0]; ws[omp1]  = ws[ohp1];
    ws[ohp2]   = [,,,,]; ws[omp2]  = ws[ohp2];
    ws[oehp]  = [0,0,4,0,0]; ws[oemp] = ws[oehp];
    ws[orhp]  = [,,,,]; ws[ormp] = ws[orhp];
    ws[oeff]  = [ ,4,0,0,0];
    ws[oinv]  = [3,4,3,0,0];
    ws[opinv] = [3,4,0,0,0];
    ws[opsn1]  = [0,0,0,1,0]; ws[ostn1] = ws[oslw1] = ws[oblk1] = ws[ofrz1] = ws[oseal1] = ws[opsn1];
    ws[opsn2]  = [,,,,]; ws[ostn2] = ws[oslw2] = ws[oblk2] = ws[ofrz2] = ws[oseal2] = ws[opsn2];
    ws[oemo1] = [,,,,]; ws[oemo2] = ws[oemo3] = ws[oemo4] = ws[oemo5] = ws[oemo1];
    ws[ostl1] = [,,,,]; ws[ostl2] = ws[ostl3] = ws[ostl1];
    ws[ispd]  = [0,0,0,2,2]; ws[ijmp] = ws[ispd];
    ws[pigndam1] = [3,4,0,0,0];
    ws[pigndam2] = [3,4,0,0,0];
    ws[iigndam1] = [,,,,];
    ws[iigndam2] = [,,,,];
    ws[iigndam3] = [,,,,];
    ws[prefdam1] = [0,4,0,0,0];
    ws[prefdam2] = [0,2,0,0,0];
    ws[pdef]  = [0,0,3,2,0];
    ws[idef]  = [0,0,0,2,3];
    ws[pdmp1] = [3,0,0,0,0];
    ws[pdmp2] = [3,0,0,0,0];
    ws[pdrop] = [3,0,0,0,0];
    ws[pmeso] = ws[pdrop];
    ws[spwb]  = [3,0,0,0,0];
    ws[spse]  = [0,4,0,0,0];
    ws[spab]  = [3,0,0,0,0];
    ws[spco]  = [3,0,0,0,0];
    ws[sphb]  = [0,4,0,0,0];
    ws[spht]  = [0,4,0,0,0];
    ws[spmd]  = [0,4,0,0,0];
  })();
  
  data.weights["occult"]
  = data.weights["craftman"]
  = data.weights["meister"]
  = data.weights["hexa"] = [];
  (()=>{
    let ws = data.weights.occult;
    ws[pstr1]  = [4,2,2,2,0]; ws[pdex1] = ws[pint1] = ws[pluk1] = ws[pstr1];
    ws[pall1]  = [4,1,1,0,0];
    ws[patk]  = [2,1,1,1,0]; ws[pma]  = ws[patk];
    ws[istr1]  = [,,,2,2]; ws[idex1] = ws[iint1] = ws[iluk1] = ws[istr1];
    ws[istr2]  = [,,,,]; ws[idex2] = ws[iint2] = ws[iluk2] = ws[istr2]; /* 固定値 */
    ws[iall1]  = [,,,2,0];
    ws[iatk1]  = [,,,2,1]; ws[ima1]  = ws[iatk1];
    ws[iatk2]  = [,,,,]; ws[ima2]  = ws[iatk2]; /* 固定値 */
    ws[php]   = [6,3,3,3,0]; ws[pmp]  = ws[php];
    ws[ihp]   = [,,0,3,3]; ws[imp]  = ws[ihp];
    ws[pcri]  = [2,1,1,1,0];
    ws[pcrd1]  = [8,0,0,0,0];
    ws[pdam]  = [2,1,1,1,0];
    ws[pboss1] = [4,1,0,0,0];
    ws[pboss2] = [1,0,0,0,0];
    ws[pign1] = [2,1,1,1,0];
    ws[pign2] = [1,0,0,0,0];
    ws[ict1]  = [6,,,,];
    ws[ict2]  = [4,,,,];
    ws[ohp1]   = [,,,,]; ws[omp1]  = ws[ohp1];
    ws[ohp2]   = [0,0,3,3,0]; ws[omp2]  = ws[ohp2];
    ws[oehp]  = [,,3,,]; ws[oemp] = ws[oehp];
    ws[orhp]  = [,,,3,]; ws[ormp] = ws[orhp];
    ws[oeff]  = [6,3,,,];
    ws[oinv]  = [6,3,3,,];
    ws[opinv] = [6,3,,,];
    ws[opsn1]  = [,,,,]; ws[ostn1] = ws[oslw1] = ws[oblk1] = ws[ofrz1] = ws[oseal1] = ws[opsn1];
    ws[opsn2]  = [,,,3,]; ws[ostn2] = ws[oslw2] = ws[oblk2] = ws[ofrz2] = ws[oseal2] = ws[opsn2];
    ws[oemo1] = [,,,,3]; ws[oemo2] = ws[oemo3] = ws[oemo4] = ws[oemo5] = ws[oemo1];
    ws[ostl1] = [6,3,,,]; ws[ostl2] = ws[ostl3] = ws[ostl1];
    ws[ispd]  = [,,,3,3]; ws[ijmp] = ws[ispd];
    ws[pigndam1] = [6,3,,,];
    ws[pigndam2] = [6,3,,,];
    ws[iigndam1] = [,,3,,];
    ws[iigndam2] = [,,3,,];
    ws[iigndam3] = [,,3,,];
    ws[prefdam1] = [6,,,,];
    ws[prefdam2] = [6,,,,];
    ws[pdef]  = [,,3,3,];
    ws[idef]  = [,,,3,3];
    ws[pdmp1] = [6,,,,];
    ws[pdmp2] = [6,,,,];
    ws[pdrop] = [6,0,0,0,0]; ws[pmeso] = ws[pdrop];
    ws[spwb]  = [6,0,0,0,0];
    ws[spse]  = [0,2,0,0,0];
    ws[spab]  = [6,0,0,0,0];
    ws[spco]  = [6,0,0,0,0];
    ws[sphb]  = [0,2,0,0,0];
    ws[spht]  = [0,2,0,0,0];
    ws[spmd]  = [0,2,0,0,0];
  })();
  
  
  /* [].del([]) : filterの簡略化 */
  Array.prototype.del = function(arr){return this.filter( e => !arr.includes(e) )};
  
  const pstatus1 = [pstr1, pdex1, pint1, pluk1]
  ,     pstatus2 = [pstr2, pdex2, pint2, pluk2]
  ,     istatus1 = [istr1, idex1, iint1, iluk1]
  ,     istatus2 = [istr2, idex2, iint2, iluk2]
  ,     obads1   = [opsn1, ostn1, oslw1, oblk1, ofrz1, oseal1]
  ,     obads2   = [opsn2, ostn2, oslw2, oblk2, ofrz2, oseal2]
  ,     oemos  = [oemo1, oemo2, oemo3, oemo4, oemo5]
  ;
  data.equipmentpotential = {};
  (()=>{
    let list = [];
    data.equipmentpotential["red"]
    = data.equipmentpotential["black"]
    = list;
    list[武器] = [];
    list[武器][レジェ]       = [].concat(pstatus1, [pall1, patk, pma, iatk2, ima2, pcri, pdam, pboss1, pboss2, pign1, pign2]);
    list[武器][ユニ]         = [].concat(pstatus1, [pall1, patk, pma, pcri, pdam, pboss1, pign1]);
    list[武器][エピ]         = [].concat(pstatus1, [pall1, patk, pma, pcri, pdam, pign1, php, pmp, ohp1, omp1]);
    list[武器][レア]         = [].concat(pstatus1, [patk, pma], istatus1, [iall1, iatk1, ima1, pcri, pdam, pign1, ihp, imp, ohp1, omp1], obads1);
    list[武器][ノマ]         = [].concat(istatus1, [iatk1, ima1, ihp, imp]);
    
    list[エンブレム] = [];
    list[エンブレム][レジェ] = list[武器][レジェ].del([pboss1, pboss2]);
    list[エンブレム][ユニ]   = list[武器][ユニ].del([pboss1]);
    list[エンブレム][エピ]   = list[武器][エピ];
    list[エンブレム][レア]   = list[武器][レア];
    list[エンブレム][ノマ]   = list[武器][ノマ];
    
    list[補助武器] = [];
    list[補助武器][レジェ]   = list[武器][レジェ].concat(pigndam1, pigndam2);
    list[補助武器][ユニ]     = list[武器][ユニ].concat(pigndam1, pigndam2);
    list[補助武器][エピ]     = list[武器][エピ];
    list[補助武器][レア]     = list[武器][レア];
    list[補助武器][ノマ]     = list[武器][ノマ];
    
    list[フォース] = [];
    list[フォース][レジェ]  = list[補助武器][レジェ];
    list[フォース][ユニ]    = list[補助武器][ユニ];
    list[フォース][エピ]    = list[補助武器][エピ].del([pmp]);
    list[フォース][レア]    = list[補助武器][レア].del([imp]); /* MP回復が入ってる 無料キューブでは抜かれてる */
    list[フォース][ノマ]    = list[補助武器][ノマ].del([imp]);
    
    list[盾] = list[補助武器];
    
    list[帽子] = [];
    list[帽子][レジェ]   = [].concat(pstatus1, [pall1, php, pmp, pigndam1, pigndam2, ict1, ict2, spab]);
    list[帽子][ユニ]     = [].concat(pstatus1, [pall1, php, pmp, pigndam1, pigndam2, oeff, spmd]);
    list[帽子][エピ]     = [].concat(pstatus1, [pall1, php, pmp, pdef]);
    list[帽子][レア]     = [].concat(pstatus1, istatus1, [iall1, php, pmp, ihp, imp, pdef, idef]);
    list[帽子][ノマ]     = [].concat(istatus1, [ihp, imp, idef]);
    
    list[服上] = [];
    list[服上][レジェ]   = list[帽子][レジェ].del([ict1, ict2, spab]).concat(oinv, opinv);
    list[服上][ユニ]     = list[帽子][ユニ].del([spmd]).concat(prefdam1, prefdam2,  oinv, opinv);
    list[服上][エピ]     = list[帽子][エピ].concat(oinv);
    list[服上][レア]     = list[帽子][レア];
    list[服上][ノマ]     = list[帽子][ノマ];
    
    list[服全身]         = list[服上];
    
    list[服下] = [];
    list[服下][レジェ]   = list[帽子][レジェ].del([ict1, ict2, spab]);
    list[服下][ユニ]     = list[帽子][ユニ].del([spmd]).concat(sphb);
    list[服下][エピ]     = list[帽子][エピ];
    list[服下][レア]     = list[帽子][レア];
    list[服下][ノマ]     = list[帽子][ノマ];
    
    list[靴] = [];
    list[靴][レジェ]     = list[帽子][レジェ].del([ict1, ict2, spab]).concat(spco);
    list[靴][ユニ]       = list[帽子][ユニ].del([spmd]).concat(spht);
    list[靴][エピ]       = list[帽子][エピ];
    list[靴][レア]       = list[帽子][レア].concat(ispd, ijmp);
    list[靴][ノマ]       = list[帽子][ノマ].concat(ispd, ijmp);
    
    list[手袋] = [];
    list[手袋][レジェ]   = list[帽子][レジェ].del([ict1, ict2, spab]).concat(pcrd1, spwb);
    list[手袋][ユニ]     = list[帽子][ユニ].del([spmd]).concat(istatus2, spse);
    list[手袋][エピ]     = list[帽子][エピ].concat(oehp, oemp);
    list[手袋][レア]     = list[帽子][レア];
    list[手袋][ノマ]     = list[帽子][ノマ];
    
    list[マント] = [];
    list[マント][レジェ] = list[帽子][レジェ].del([ict1, ict2, spab]);
    list[マント][ユニ]   = list[帽子][ユニ].del([spmd]);
    list[マント][エピ]   = list[帽子][エピ];
    list[マント][レア]   = list[帽子][レア];
    list[マント][ノマ]   = list[帽子][ノマ];
    
    list[ベルト] = list[マント];
    list[肩]     = list[マント];
    
    list[顔飾り] = [];
    list[顔飾り][レジェ] = [].concat(pstatus1, [pall1, php, pmp, pmeso, pdrop, pdmp1, pdmp2]);
    list[顔飾り][ユニ]   = [].concat(pstatus1, [pall1, php, pmp, oeff]);
    list[顔飾り][エピ]   = [].concat(pstatus1, [pall1, php, pmp, pdef])
    list[顔飾り][レア]   = [].concat(pstatus1, istatus1, [iall1, php, pmp, ihp, imp, pdef, idef]);
    list[顔飾り][ノマ]   = [].concat(istatus1, [ihp, imp, idef]);
    
    list[目飾り]     = list[顔飾り];
    list[イヤリング] = list[顔飾り];
    list[指輪]       = list[顔飾り];
    list[ペンダント] = list[顔飾り];
    
    list[機械心臓] = [];
    list[機械心臓][レジェ] = [].concat(pstatus1, [pall1, php, pmp]);
    list[機械心臓][ユニ]   = [].concat(pstatus1, [pall1, php, pmp, oeff]);
    list[機械心臓][エピ]   = [].concat(pstatus1, [pall1, php, pmp, pdef]);
    list[機械心臓][レア]   = [].concat(pstatus1, istatus1, [iall1, php, pmp, ihp, imp, pdef, idef]);
    list[機械心臓][ノマ]   = [].concat(istatus1, [ihp, imp, idef]);
  })();
  (()=>{
    let temp = data.equipmentpotential.red;
    let list = [];
      data.equipmentpotential["occult"]
    = data.equipmentpotential["craftman"]
    = data.equipmentpotential["meister"]
    = data.equipmentpotential["hexa"]
    = list;
    
    list[武器] = [];
    list[武器][レジェ] = temp[武器][レジェ].del([iatk2, ima2]);
    list[武器][ユニ]   = temp[武器][ユニ];
    list[武器][エピ]   = temp[武器][エピ].del([ohp1, omp1]).concat(ohp2, omp2);
    list[武器][レア]   = temp[武器][レア].del([ohp1, omp1]).del(obads1).concat(ohp2, omp2,obads2);
    list[武器][ノマ]   = temp[武器][ノマ];
    
    list[エンブレム] = [];
    list[エンブレム][レジェ] = temp[エンブレム][レジェ].del([iatk2, ima2]);
    list[エンブレム][ユニ]   = temp[エンブレム][ユニ];
    list[エンブレム][エピ]   = temp[エンブレム][エピ].del([ohp1, omp1]).concat(ohp2, omp2);
    list[エンブレム][レア]   = temp[エンブレム][レア].del([ohp1, omp1]).del(obads1).concat(ohp2, omp2, obads2);
    list[エンブレム][ノマ]   = temp[エンブレム][ノマ];
    
    list[補助武器] = [];
    list[補助武器][レジェ] = temp[補助武器][レジェ].del([iatk2, ima2]);
    list[補助武器][ユニ]   = temp[補助武器][ユニ];
    list[補助武器][エピ]   = temp[補助武器][エピ].del([ohp1, omp1]).concat(ohp2, omp2, iigndam1, iigndam2, iigndam3);
    list[補助武器][レア]   = temp[補助武器][レア].del([ohp1, omp1]).del(obads1).concat(ohp2, omp2, obads2);
    list[補助武器][ノマ]   = temp[補助武器][ノマ];
    
    list[フォース] = [];
    list[フォース][レジェ] = list[補助武器][レジェ];
    list[フォース][ユニ]   = list[補助武器][ユニ];
    list[フォース][エピ]   = list[補助武器][エピ].del([pmp, omp2]);
    list[フォース][レア]   = list[補助武器][レア].del([imp, omp2]); /* MP回復が抜かれてる 課金キューブでは入ってる */
    list[フォース][ノマ]   = list[補助武器][ノマ].del([imp]);
    
    list[盾] = list[補助武器]
    
    list[帽子] = [];
    list[帽子][レジェ] =  temp[帽子][レジェ].concat(oeff);
    list[帽子][ユニ]   =  temp[帽子][ユニ];
    list[帽子][エピ]   =  temp[帽子][エピ].concat(iigndam1, iigndam2, iigndam3);
    list[帽子][レア]   =  temp[帽子][レア];
    list[帽子][ノマ]   =  temp[帽子][ノマ].concat(oemos);
    
    list[服上] = [];
    list[服上][レジェ] = temp[服上][レジェ].concat(oeff);
    list[服上][ユニ]   = temp[服上][ユニ].del([prefdam1, prefdam2]);
    list[服上][エピ]   = temp[服上][エピ].concat(iigndam1, iigndam2, iigndam3);
    list[服上][レア]   = temp[服上][レア];
    list[服上][ノマ]   = temp[服上][ノマ];
    
    list[服全身] = list[服上]
    
    list[服下] = [];
    list[服下][レジェ] = temp[服下][レジェ].concat(oeff, prefdam1, prefdam2);
    list[服下][ユニ]   = temp[服下][ユニ];
    list[服下][エピ]   = temp[服下][エピ].concat(iigndam1, iigndam2, iigndam3);
    list[服下][レア]   = temp[服下][レア];
    list[服下][ノマ]   = temp[服下][ノマ];
    
    list[靴] = [];
    list[靴][レジェ] = temp[靴][レジェ].concat(oeff);
    list[靴][ユニ]   = temp[靴][ユニ];
    list[靴][エピ]   = temp[靴][エピ].concat(iigndam1, iigndam2, iigndam3);
    list[靴][レア]   = temp[靴][レア];
    list[靴][ノマ]   = temp[靴][ノマ];
    
    list[手袋] = [];
    list[手袋][レジェ] = temp[手袋][レジェ].concat(oeff, ostl1, ostl2, ostl3);
    list[手袋][ユニ]   = temp[手袋][ユニ].del(istatus2).concat(ostl1, ostl2);
    list[手袋][エピ]   = temp[手袋][エピ].concat(iigndam1, iigndam2, iigndam3);
    list[手袋][レア]   = temp[手袋][レア];
    list[手袋][ノマ]   = temp[手袋][ノマ];
    
    list[マント] = [];
    list[マント][レジェ] = temp[マント][レジェ].concat(oeff);
    list[マント][ユニ]   = temp[マント][ユニ];
    list[マント][エピ]   = temp[マント][エピ].concat(iigndam1, iigndam2, iigndam3);
    list[マント][レア]   = temp[マント][レア];
    list[マント][ノマ]   = temp[マント][ノマ];
    
    list[ベルト] = list[マント];
    list[肩]     = list[マント];
    
    list[顔飾り] = [];
    list[顔飾り][レジェ] = temp[顔飾り][レジェ].concat(oeff);
    list[顔飾り][ユニ]   = temp[顔飾り][ユニ];
    list[顔飾り][エピ]   = temp[顔飾り][エピ];
    list[顔飾り][レア]   = temp[顔飾り][レア].concat(orhp, ormp);
    list[顔飾り][ノマ]   = temp[顔飾り][ノマ];
    
    list[目飾り]     = list[顔飾り];
    list[イヤリング] = list[顔飾り];
    list[指輪]       = list[顔飾り];
    list[ペンダント] = list[顔飾り];
    
    list[機械心臓] = [];
    list[機械心臓][レジェ] = temp[機械心臓][レジェ].concat(oeff);
    list[機械心臓][ユニ]   = temp[機械心臓][ユニ];
    list[機械心臓][エピ]   = temp[機械心臓][エピ];
    list[機械心臓][レア]   = temp[機械心臓][レア];
    list[機械心臓][ノマ]   = temp[機械心臓][ノマ];
  })();
})();


/*-------------------------------キューブ共通の設定-------------------------------------------*/
/**
*[ 潜在重要度(0職業によっては必須, 1小さい影響, 2影響なし不要)
*, レジェ[確率比重, [レベル閾値, 潜在数値]...]
*, ユニ[], エピ[], レア[], ノマ[]
*/
data.potentialinfotemplate = {
  "% STR1" : [ 0 /*共通 %DEX %INT %LUK */
  , [/*レジェ*/
      [0, 6], [31, 9], [71, 12], [201, 13]
    ]
  , [/*ユニ*/
      [0, 3], [31, 6], [71, 9], [201, 10]
    ]
  , [/*エピ*/
      [0, 2], [31, 4], [71, 6], [201, 7]
    ]
  , [/*レア*/
      [0, 1], [31, 2], [71, 3], [201, 4]
    ]
  , [/*ノーマル*/]
  ]
, "% STR2" : [ 0 /*共通 %DEX %INT %LUK */
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% オールステータス1" : [ 0
  , [/*レジェ*/
      [0, 3], [31, 6], [71, 9], [201, 10]
    ]
  , [/*ユニ*/
      [0, 2], [31, 4], [71, 6], [201, 7]
    ]
  , [/*エピ*/
      [0, 1], [31, 2], [71, 3], [201, 4]
    ]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% オールステータス2" : [ 0
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% 攻撃力" : [ 0 /*共通 %魔力*/
  , [/*レジェ*/
      [0, 6], [31, 9], [71, 12]
    ]
  , [/*ユニ*/
      [0, 3], [31, 6], [71, 9]
    ]
  , [/*エピ*/
      [0, 2], [31, 4], [71, 6]
    ]
  , [/*レア*/
      [0, 1], [31, 2], [71, 3]
    ]
  , [/*ノーマル*/]
  ]
, "STR レベル10当たり" : [ 0 /* 共通 DEX INT LUK */
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "STR1" : [ 1 /*共通 DEX INT LUK*/
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [0, 2], [21, 4], [41, 6], [51, 8], [71, 10], [91, 12], [201, 13]
    ]
  , [/*ノーマル*/
      [0, 1], [21, 2], [41, 3], [51, 4], [71,  5], [91,  6]
    ]
  ]
, "STR2" : [ 1 /*共通 DEX INT LUK 固定値*/
  , [/*レジェ*/]
  , [/*ユニ*/
      [30, 32] /*手袋専用 32固定*/
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "オールステータス1" : [ 1
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [0, 1], [21, 2], [41, 3], [61, 4], [81, 5], [201, 6]
    ]
  , [/*ノーマル*/]
  ]
, "オールステータス2" : [ 1
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "攻撃力1" : [ 1 /*共通 魔力*/
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [0, 2], [21, 4], [41, 6], [61, 8], [81, 10], [91, 12]
    ]
  , [/*ノーマル*/
      [0, 1], [21, 2], [41, 3], [61, 4], [81,  5], [91,  6]
    ]
  ]
, "攻撃力2" : [ 1 /*共通 魔力 固定値*/
  , [/*レジェ*/
      [0, 32] /*武器系 32固定*/
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
  
  
, "% HP" : [ 0 /*優先度以外共通 MP%*/
  , [/*レジェ*/
      [0, 6], [31, 9], [71, 12], [201, 13]
    ]
  , [/*ユニ*/
      [0, 3], [31, 6], [71, 9], [201, 10]
    ]
  , [/*エピ*/
      [0, 2], [31, 4], [71, 6], [201, 7]
    ]
  , [/*レア*/
      [0, 1], [31, 2], [71, 3], [201, 4]
    ]
  , [/*ノーマル*/]
  ]
, "% MP" : [ 2 /*優先度以外共通 HP%*/
  , [/*レジェ*/
      [0, 6], [31, 9], [71, 12], [201, 13]
    ]
  , [/*ユニ*/
      [0, 3], [31, 6], [71, 9], [201, 10]
    ]
  , [/*エピ*/
      [0, 2], [31, 4], [71, 6], [201, 7]
    ]
  , [/*レア*/
      [0, 1], [31, 2], [71, 3], [201, 4]
    ]
  , [/*ノーマル*/]
  ]
 
, "HP" : [ 1 /*優先度以外共通 MP*/
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [0, 10], [11, 20], [21, 30], [31, 40], [41, 50], [51, 60], [61, 70], [71, 80], [81, 90], [91, 100], [101, 110], [111, 120], [201, 125]
    ]
  , [/*ノーマル*/
      [0,  5], [11, 10], [21, 15], [31, 20], [41, 25], [51, 30], [61, 35], [71, 40], [81, 45], [91, 50], [101, 55], [111, 60]
    ]
  ]
, "MP" : [ 2 /*優先度以外共通 MP*/
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [0, 10], [11, 20], [21, 30], [31, 40], [41, 50], [51, 60], [61, 70], [71, 80], [81, 90], [91, 100], [101, 110], [111, 120], [201, 125]
    ]
  , [/*ノーマル*/
      [0,  5], [11, 10], [21, 15], [31, 20], [41, 25], [51, 30], [61, 35], [71, 40], [81, 45], [91, 50], [101, 55], [111, 60]
    ]
  ]
  
  
, "% クリティカル率" : [ 1
  , [/*レジェ*/
      [0, 6], [31, 9], [71, 12]
    ]
  , [/*ユニ*/
      [0, 3], [31, 6], [71, 9]
    ]
  , [/*エピ*/
      [0, 8]
    ]
  , [/*レア*/
      [0, 4]
    ]
  , [/*ノーマル*/]
  ]
, "% クリティカルダメージ1" : [ 0 /* 手袋 */
  , [/*レジェ*/
      [50, 5], [70, 6], [90, 8]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% クリティカルダメージ2" : [ 0
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% ダメージ" : [ 0
  , [/*レジェ*/
      [0, 6], [31, 9], [71, 12]
    ]
  , [/*ユニ*/
      [0, 3], [31, 6], [71, 9]
    ]
  , [/*エピ*/
      [0, 2], [31, 4], [71, 6]
    ]
  , [/*レア*/
      [0, 1], [31, 2], [71, 3]
    ]
  , [/*ノーマル*/]
  ]
, "% ボスダメージ1" : [ 0
  , [/*レジェ*/
      [100, 35]
    ]
  , [/*ユニ*/
      [100, 30]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% ボスダメージ2" : [ 0 /*武器系レジェ40%*/
  , [/*レジェ*/
      [100, 40]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
 
, "% 防御率無視1" : [ 0
  , [/*レジェ*/
      [50, 35]
    ]
  , [/*ユニ*/
      [50, 30]
    ]
  , [/*エピ*/
      [50, 15]
    ]
  , [/*レア*/
      [30, 15]
    ]
  , [/*ノーマル*/]
  ]
, "% 防御率無視2" : [ 0 /*武器系レジェ40%*/
  , [/*レジェ*/
      [100, 40]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]

, "秒 全スキルのクールタイム減少1" : [ 0
  , [/*レジェ*/
      [70, 1]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "秒 全スキルのクールタイム減少2" : [ 0
  , [/*レジェ*/
      [120, 2]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
  
, "HP回復 攻撃時20%の確率" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/
      [0, 30], [11, 60], [21, 90], [31, 120], [41, 150], [51, 180], [61, 210], [71, 240], [81, 270], [91, 300], [101, 330], [111, 360]
    ]
  , [/*レア*/
      [0, 20], [11, 40], [21, 60], [31, 80], [41, 100], [51, 120], [61, 140], [71, 160], [81, 180], [91, 200], [101, 220], [111, 240]
    ]
  , [/*ノーマル*/]
  ]
, "MP回復 攻撃時20%の確率" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/
      [0, 30], [11, 45], [21, 60], [31, 75], [41, 90], [51, 105], [61, 120], [71, 135], [81, 150], [91, 165], [101, 180]
    ]
  , [/*レア*/
      [0, 20], [11, 30], [21, 40], [31, 50], [41, 60], [51, 70], [61, 80], [71, 90], [81, 100], [91, 110], [101, 120]
    ]
  , [/*ノーマル*/]
  ]
  
  
  
, "HP回復 攻撃時3%の確率" : [ 2 /* 共通 MP回復 攻撃時3%の確率 */
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/
      [0, 20], [11, 23], [21, 26], [31, 29], [41, 32], [51, 35], [61, 38], [71, 41], [81, 44], [91, 47], [101, 50], [111, 53]
    ]
  , [/*レア*/
      [0, 10], [11, 12], [21, 14], [31, 16], [41, 18], [51, 20], [61, 22], [71, 24], [81, 26], [91, 28], [101, 30], [111, 32]
    ]
  , [/*ノーマル*/]
  ]
  
  
  
, "HP回復 モンスター退治時15%の確率" : [ 2 /*共通 MP回復 モンスター退治時15%の確率*/
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/
      [0, 40], [11, 45], [21, 50], [31, 55], [41, 60], [51, 65], [61, 70], [71, 75], [81, 80], [91, 85], [101, 90], [111, 95]
    ]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "HP回復 4秒ごと" : [ 2 /*共通 MP回復 4秒ごと*/
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [0, 2], [11, 4], [21, 6], [31, 8], [41, 10], [51, 12], [61, 14], [71, 16], [81, 18], [91, 20], [101, 22], [111, 24]
    ]
  , [/*ノーマル*/]
  ]

, "レベル中毒 攻撃時20%の確率" : [ 2 /*共通 レベル中毒 攻撃時10%の確率*/
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [10, 1], [21, 2], [41, 3], [61, 4], [81, 5], [101, 6]
    ]
  , [/*ノーマル*/]
  ]
, "レベル気絶 攻撃時10%の確率" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [10, 1], [71, 2]
    ]
  , [/*ノーマル*/]
  ]
, "レベルスロー 攻撃時20%の確率" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [10, 1], [71, 2]
    ]
  , [/*ノーマル*/]
  ]
, "レベル暗黒 攻撃時20%の確率" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [10, 1], [51, 2], [101, 3]
    ]
  , [/*ノーマル*/]
  ]
, "レベル氷結 攻撃時10%の確率" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [10, 1], [71, 2]
    ]
  , [/*ノーマル*/]
  ]
, "レベル封印 攻撃時10%の確率" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [10, 1], [71, 2]
    ]
  , [/*ノーマル*/]
  ]

, "被撃時10%の確率で10秒間を感じる" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/
      [0]
    ]
  ]

, "% 確率で攻撃時オートスチール1" : [ 1
  , [/*レジェ*/
      [20, 3]
    ]
  , [/*ユニ*/
      [20, 1]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% 確率で攻撃時オートスチール2" : [ 1
  , [/*レジェ*/
      [40, 5]
    ]
  , [/*ユニ*/
      [40, 2]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% 確率で攻撃時オートスチール3" : [ 1
  , [/*レジェ*/
      [60, 7]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
  
, "% HP回復効率" : [ 2
  , [/*レジェ*/
      [0, 20], [31, 30], [71, 40]
    ]
  , [/*ユニ*/
      [0, 10], [31, 20], [71, 30]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]

, "秒 襲撃後の無敵時間" : [ 1
  , [/*レジェ*/
      [0, 3]
    ]
  , [/*ユニ*/
      [0, 2]
    ]
  , [/*エピ*/
      [0, 1]
    ]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "秒 被撃時x%で無敵" : [ 2 /*確率も等級によって変動*/
  , [/*レジェ*/
      [0, 5, 4], [41, 6,  4], [81, 7,  4]
    ]
  , [/*ユニ*/
      [0, 5, 2], [41, 6,  2], [81, 7,  2]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
  
, "%の確率で 被撃時20%のﾀﾞﾒｰｼﾞ無視" : [ 2
  , [/*レジェ*/
      [20, 10]
    ]
  , [/*ユニ*/
      [20, 5]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "%の確率で 被撃時40%のﾀﾞﾒｰｼﾞ無視" : [ 2
  , [/*レジェ*/
      [40, 10]
    ]
  , [/*ユニ*/
      [40, 5]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
  
  
, "のﾀﾞﾒｰｼﾞ無視 被撃時%の確率で1" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/
      [0, 3], [11, 5],  [21, 7],  [31, 9],  [41, 11], [51, 13], [61, 15], [71, 17], [81, 19], [91, 21], [101, 23], [111, 25], [201, 26]
    ]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "のﾀﾞﾒｰｼﾞ無視 被撃時%の確率で2" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/
      [0, 5], [11, 8],  [21, 11], [31, 14], [41, 17], [51, 20], [61, 23], [71, 26], [81, 29], [91, 32], [101, 35], [111, 38], [201, 39]
    ]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "のﾀﾞﾒｰｼﾞ無視 被撃時%の確率で3" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/
      [0, 7], [11, 11], [21, 15], [31, 19], [41, 23], [51, 27], [61, 31], [71, 35], [81, 39], [91, 43], [101, 47], [111, 51], [201, 53]
    ]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
  
, "%の確率で 被撃時x%のﾀﾞﾒｰｼﾞ反射1" : [ 2 //反射量も変動
  , [/*レジェ*/ /* 服下無料キューブ */
      [0, 10, 20], [31, 10, 35], [51, 20, 35], [71, 20, 50], [101, 30, 50], [201, 35, 50]
    ]
  , [/*ユニ*/ /* 服上課金キューブ */
      [0, 10, 20], [31, 10, 35], [51, 20, 35], [71, 20, 50], [101, 30, 50], [201, 35, 50]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "%の確率で 被撃時x%のﾀﾞﾒｰｼﾞ反射2" : [ 2 //反射量も変動
  , [/*レジェ*/ /* 服下無料キューブ */
      3, [0, 10, 30], [31, 10, 50], [51, 20, 50], [71, 20, 70], [101, 30, 70], [201, 35, 70]
    ]
  , [/*ユニ*/ /* 服上課金キューブ */
      2, [0, 10, 30], [31, 10, 50], [51, 20, 50], [71, 20, 70], [101, 30, 70], [201, 35, 70]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% 消費MP減少1" : [ 2
  , [/*レジェ*/
      [0, 5], [51, 10], [101, 15]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% 消費MP減少2" : [ 2
  , [/*レジェ*/
      [0, 10], [51, 20], [101, 30]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "% アイテムドロップ率" : [ 0 /*共通 メル獲得量*/
  , [/*レジェ*/
      [0, 10], [31, 15], [71, 20]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
  
, "% 防御力" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/
      [0, 2], [31, 4], [71, 6], [201, 7]
    ]
  , [/*レア*/
      [0, 1], [31, 2], [71, 3], [201, 5]
    ]
  , [/*ノーマル*/]
  ]
, "防御力" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [0, 10], [11, 20], [21, 30], [31, 40], [41, 50], [51, 60], [61, 70], [71, 80], [81, 90], [91, 100], [101, 110], [111, 120], [201, 125]
    ]
  , [/*ノーマル*/
      [0,  5], [11, 10], [21, 15], [31, 20], [41, 25], [51, 30], [61, 35], [71, 40], [81, 45], [91, 50], [101, 55], [111, 60]
    ]
  ]
, "移動速度" : [ 2 /*共通 ジャンプ力*/
  , [/*レジェ*/]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/
      [0, 2], [31, 4], [71, 6], [111, 8]
    ]
  , [/*ノーマル*/
      [0, 1], [31, 2], [71, 3], [111, 4]
    ]
  ]

, "ﾊﾟｻｰﾌﾞﾙ ｳｨﾝﾄﾞﾌﾞｰｽﾀｰ" : [ 0
  , [/*レジェ*/
      [120]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "ﾊﾟｻｰﾌﾞﾙ ｼｬｰﾌﾟｱｲｽﾞ" : [ 0
  , [/*レジェ*/]
  , [/*ユニ*/
      [120]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "ﾊﾟｻｰﾌﾞﾙ ｱﾄﾞﾊﾞﾝｽﾌﾞﾚｽ" : [ 0
  , [/*レジェ*/
      [120]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "ﾊﾟｻｰﾌﾞﾙ ﾐｽﾃｨｯｸﾄﾞｱ" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/
      [70]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "ﾊﾟｻｰﾌﾞﾙ ｺﾝﾊﾞｯﾄｵｰﾀﾞｰ" : [ 0
  , [/*レジェ*/
      [70]
    ]
  , [/*ユニ*/]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "ﾊﾟｻｰﾌﾞﾙ ﾍｲｽﾄ" : [ 2
  , [/*レジェ*/]
  , [/*ユニ*/
      [70]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]
, "ﾊﾟｻｰﾌﾞﾙ ﾊｲﾊﾟｰﾎﾞﾃﾞｨ" : [ 0
  , [/*レジェ*/]
  , [/*ユニ*/
      [70]
    ]
  , [/*エピ*/]
  , [/*レア*/]
  , [/*ノーマル*/]
  ]



, "temp" : [ 0
  , [/*レジェ*/
    ]
  , [/*ユニ*/
    ]
  , [/*エピ*/
    ]
  , [/*レア*/
    ]
  , [/*ノーマル*/
    ]
  ]
};




let pt = data.potentialinfotemplate;
let list = [];
data.potentialinfolist = list;

list[pstr1]  = ["% STR", pt["% STR1"]];
list[pdex1]  = ["% DEX", pt["% STR1"]];
list[pint1]  = ["% INT", pt["% STR1"]];
list[pluk1]  = ["% LUK", pt["% STR1"]];
list[pall1]  = ["% ｵｰﾙｽﾃｰﾀｽ", pt["% オールステータス1"]];
list[patk]  = ["% 攻撃力", pt["% 攻撃力"]];
list[pma]   = ["% 魔力",   pt["% 攻撃力"]];

list[istr1]  = ["STR", pt["STR1"]];
list[idex1]  = ["DEX", pt["STR1"]];
list[iint1]  = ["INT", pt["STR1"]];
list[iluk1]  = ["LUK", pt["STR1"]];
list[istr2]  = ["STR", pt["STR2"]];
list[idex2]  = ["DEX", pt["STR2"]];
list[iint2]  = ["INT", pt["STR2"]];
list[iluk2]  = ["LUK", pt["STR2"]];
list[iall1]   = ["ｵｰﾙｽﾃｰﾀｽ", pt["オールステータス1"]];
list[iatk1]  = ["攻撃力", pt["攻撃力1"]];
list[ima1]   = ["魔力",   pt["攻撃力1"]];
list[iatk2]  = ["攻撃力", pt["攻撃力2"]];
list[ima2]   = ["魔力",   pt["攻撃力2"]];

list[pcri]  = ["% ｸﾘﾃｨｶﾙ率", pt["% クリティカル率"]];
list[pcrd1]  = ["% ｸﾘﾃｨｶﾙﾀﾞﾒｰｼﾞ", pt["% クリティカルダメージ1"]];
list[pcrd2]  = ["% ｸﾘﾃｨｶﾙﾀﾞﾒｰｼﾞ", pt["% クリティカルダメージ2"]];
list[pdam]  = ["% ダメージ", pt["% ダメージ"]];
list[pboss1] = ["% ボスダメージ", pt["% ボスダメージ1"]];
list[pboss2] = ["% ボスダメージ", pt["% ボスダメージ2"]];
list[pign1] = ["% 防御率無視", pt["% 防御率無視1"]];
list[pign2] = ["% 防御率無視", pt["% 防御率無視2"]];

list[php]   = ["% HP", pt["% HP"]];
list[pmp]   = ["% MP", pt["% MP"]];
list[ihp]   = ["HP",   pt["HP"]];
list[imp]   = ["MP",   pt["MP"]];

list[ict1]  = ["秒 全ｽｷﾙのｸｰﾙﾀｲﾑ減少", pt["秒 全スキルのクールタイム減少1"]];
list[ict2]  = ["秒 全ｽｷﾙのｸｰﾙﾀｲﾑ減少", pt["秒 全スキルのクールタイム減少2"]];

list[ohp1]   = ["HP回復 攻撃時20%の確率",       pt["HP回復 攻撃時20%の確率"]];
list[omp1]   = ["MP回復 攻撃時20%の確率",       pt["MP回復 攻撃時20%の確率"]];
list[ohp2]   = ["HP回復 攻撃時3%の確率",       pt["HP回復 攻撃時3%の確率"]];
list[omp2]   = ["MP回復 攻撃時3%の確率",       pt["HP回復 攻撃時3%の確率"]];

list[opsn1]  = ["レベル中毒 攻撃時20%の確率",   pt["レベル中毒 攻撃時20%の確率"]];
list[ostn1]  = ["レベル気絶 攻撃時10%の確率",   pt["レベル気絶 攻撃時10%の確率"]];
list[oslw1]  = ["レベルスロー 攻撃時20%の確率", pt["レベルスロー 攻撃時20%の確率"]];
list[oblk1]  = ["レベル暗黒 攻撃時20%の確率",   pt["レベル暗黒 攻撃時20%の確率"]];
list[ofrz1]  = ["レベル氷結 攻撃時10%の確率",   pt["レベル氷結 攻撃時10%の確率"]];
list[oseal1] = ["レベル封印 攻撃時10%の確率",   pt["レベル封印 攻撃時10%の確率"]];

list[opsn2]  = ["レベル中毒 攻撃時10%の確率",   pt["レベル中毒 攻撃時20%の確率"]];
list[ostn2]  = ["レベル気絶 攻撃時5%の確率",   pt["レベル気絶 攻撃時10%の確率"]];
list[oslw2]  = ["レベルスロー 攻撃時10%の確率", pt["レベルスロー 攻撃時20%の確率"]];
list[oblk2]  = ["レベル暗黒 攻撃時10%の確率",   pt["レベル暗黒 攻撃時20%の確率"]];
list[ofrz2]  = ["レベル氷結 攻撃時5%の確率",   pt["レベル氷結 攻撃時10%の確率"]];
list[oseal2] = ["レベル封印 攻撃時5%の確率",   pt["レベル封印 攻撃時10%の確率"]];

list[oemo1] = ["被撃時10%の確率で10秒間怒りを感じる",  pt["被撃時10%の確率で10秒間を感じる"]];
list[oemo2] = ["被撃時10%の確率で10秒間幸せを感じる",  pt["被撃時10%の確率で10秒間を感じる"]];
list[oemo3] = ["被撃時10%の確率で10秒間恋に落ちる",  pt["被撃時10%の確率で10秒間を感じる"]];
list[oemo4] = ["被撃時10%の確率で10秒間激怒を感じる",  pt["被撃時10%の確率で10秒間を感じる"]];
list[oemo5] = ["被撃時10%の確率で10秒間感動を感じる",  pt["被撃時10%の確率で10秒間を感じる"]];

list[ostl1] = ["% 確率で攻撃時オートスチール", pt["% 確率で攻撃時オートスチール1"]];
list[ostl2] = ["% 確率で攻撃時オートスチール", pt["% 確率で攻撃時オートスチール2"]];
list[ostl3] = ["% 確率で攻撃時オートスチール", pt["% 確率で攻撃時オートスチール3"]];

list[pigndam1]  = ["%の確率で 被撃時20%のﾀﾞﾒｰｼﾞ無視", pt["%の確率で 被撃時20%のﾀﾞﾒｰｼﾞ無視"]];
list[pigndam2]  = ["%の確率で 被撃時40%のﾀﾞﾒｰｼﾞ無視", pt["%の確率で 被撃時40%のﾀﾞﾒｰｼﾞ無視"]];

list[iigndam1]  = ["のﾀﾞﾒｰｼﾞ無視 被撃時20%の確率で", pt["のﾀﾞﾒｰｼﾞ無視 被撃時%の確率で1"]];
list[iigndam2]  = ["のﾀﾞﾒｰｼﾞ無視 被撃時20%の確率で", pt["のﾀﾞﾒｰｼﾞ無視 被撃時%の確率で2"]];
list[iigndam3]  = ["のﾀﾞﾒｰｼﾞ無視 被撃時20%の確率で", pt["のﾀﾞﾒｰｼﾞ無視 被撃時%の確率で3"]];

list[prefdam1] = ["%の確率で 被撃時x%のﾀﾞﾒｰｼﾞ反射", pt["%の確率で 被撃時x%のﾀﾞﾒｰｼﾞ反射1"]];
list[prefdam2] = ["%の確率で 被撃時x%のﾀﾞﾒｰｼﾞ反射", pt["%の確率で 被撃時x%のﾀﾞﾒｰｼﾞ反射2"]];

list[oehp]  = ["HP回復 モンスター退治時15%の確率", pt["HP回復 モンスター退治時15%の確率"]];
list[oemp]  = ["MP回復 モンスター退治時15%の確率", pt["HP回復 モンスター退治時15%の確率"]];

list[orhp]  = ["HP回復 4秒ごと", pt["HP回復 4秒ごと"]];
list[ormp]  = ["MP回復 4秒ごと", pt["HP回復 4秒ごと"]];

list[ict1]  = ["秒 全スキルのクールタイム減少", pt["秒 全スキルのクールタイム減少1"]];
list[ict2]  = ["秒 全スキルのクールタイム減少", pt["秒 全スキルのクールタイム減少2"]];

list[oeff]  = ["% HP回復効率", pt["% HP回復効率"]];

list[oinv]  = ["秒 襲撃後の無敵時間", pt["秒 襲撃後の無敵時間"]];
list[opinv] = ["秒 被撃時x%で無敵",   pt["秒 被撃時x%で無敵"]];

list[ispd]  = ["移動速度",   pt["移動速度"]];
list[ijmp]  = ["ジャンプ力", pt["移動速度"]];


list[pdef]  = ["% 防御力", pt["% 防御力"]];
list[idef]  = ["防御力",   pt["防御力"]];

list[pdmp1] = ["% 消費HP減少", pt["% 消費MP減少1"]];
list[pdmp2] = ["% 消費MP減少", pt["% 消費MP減少2"]];


list[pdrop]  = ["% アイテムドロップ率", pt["% アイテムドロップ率"]];
list[pmeso]  = ["% メル獲得量",         pt["% アイテムドロップ率"]];

list[spwb]   = ["ﾊﾟｻｰﾌﾞﾙ ｳｨﾝﾄﾞﾌﾞｰｽﾀｰ", pt["ﾊﾟｻｰﾌﾞﾙ ｳｨﾝﾄﾞﾌﾞｰｽﾀｰ"]];
list[spse]   = ["ﾊﾟｻｰﾌﾞﾙ ｼｬｰﾌﾟｱｲｽﾞ",   pt["ﾊﾟｻｰﾌﾞﾙ ｼｬｰﾌﾟｱｲｽﾞ"]];
list[spab]   = ["ﾊﾟｻｰﾌﾞﾙ ｱﾄﾞﾊﾞﾝｽﾌﾞﾚｽ", pt["ﾊﾟｻｰﾌﾞﾙ ｱﾄﾞﾊﾞﾝｽﾌﾞﾚｽ"]];
list[spco]   = ["ﾊﾟｻｰﾌﾞﾙ ｺﾝﾊﾞｯﾄｵｰﾀﾞｰ", pt["ﾊﾟｻｰﾌﾞﾙ ｺﾝﾊﾞｯﾄｵｰﾀﾞｰ"]];
list[sphb]   = ["ﾊﾟｻｰﾌﾞﾙ ﾊｲﾊﾟｰﾎﾞﾃﾞｨ",  pt["ﾊﾟｻｰﾌﾞﾙ ﾊｲﾊﾟｰﾎﾞﾃﾞｨ"]];
list[spht]   = ["ﾊﾟｻｰﾌﾞﾙ ﾍｲｽﾄ",        pt["ﾊﾟｻｰﾌﾞﾙ ﾍｲｽﾄ"]];
list[spmd]   = ["ﾊﾟｻｰﾌﾞﾙ ﾐｽﾃｨｯｸﾄﾞｱ",   pt["ﾊﾟｻｰﾌﾞﾙ ﾐｽﾃｨｯｸﾄﾞｱ"]];



/*------------ 汎用処理 ------------------------------------------------ */

/* data.ratetableを扱いやすいように書き換え */
for( let k of Object.keys(data.ratetable) ){
  for( let e of data.ratetable[k]){
    if(!e) continue;
    e.map( (r, i, arr)=>{
      arr[i] = [ r, +new BigNumber(1).minus( r ) ];
    });
  }
}

/* 潜在の重複制限 [制限グループ[], 制限数] */
data.potentialerrorlist = [
  [[oinv], 1]
, [[opinv], 2]
, [[pboss1, pboss2], 2]
, [[pign1, pign2], 2]
, [[pigndam1, pigndam2], 2]
, [[pdrop], 2]
];

/* 潜在IDから参照する用 */
data.potentialerrorlist2 = [];
data.potentialerrorlist.forEach((e, i)=>{
  e[0].forEach((pid)=>{
    data.potentialerrorlist2[pid] = i;
  });
});


})(regularKMS);





