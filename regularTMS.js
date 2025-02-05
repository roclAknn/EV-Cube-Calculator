


console.log("loaded regularTMS.js");

regularTMS = {};

regularTMS.init = function(){
  const data = this;
  
  /* 公式を確認した日付 */
  data.date = new Date("2024 06 04 GMT+0900");

  /*
    参考元(公式)
    https://maplestory-event.beanfun.com/eventad/eventad?eventadid=8421
  */
  /*==================== キューブの設定 =============================================*/
  (()=>{
    /**
    * キューブの種類>潜在等級>各行の同等級付与率
    * 汎用処理で[同等級率, 下位等級率]に書き換える
    */
    data.fixlinenum = {
        "uni": 1
    };
    data.ratetable = {
        "uni" :[/* ノーマル潜在(=レア等級下位)の確率が不明なのでエピ以上に制限 */
          [0.15, 0.15, 0.15]
        , [0.15, 0.15, 0.15]
        , [0.15, 0.15, 0.15]
        , null
      ]
    };
    
    data.upgradetable = {
        "uni"     : [ "レア等級の仕様不明", "N/a", "行数で行選択率指定", "N/a"]
    };
    data.images = {
        "uni"      : "unicube.png"
    };
    
    
    /*================== 装備別潜在設定 ===================================================================*/
    with(commons.consts){
      /* [].del([]) : filterの簡略化 */
      Array.prototype.del = function(arr){return this.filter( e => !arr.includes(e) )};
      
      /* 設定用テンプレート */
      const pstatus1 = [pstr1, pdex1, pint1, pluk1]
      ,     pstatus2 = [pstr2, pdex2, pint2, pluk2]
      ,     istatus1 = [istr1, idex1, iint1, iluk1]
      ,     istatus2 = [istr2, idex2, iint2, iluk2]
      ,     obads1   = [opsn1, ostn1, oslw1, oblk1, ofrz1, oseal1]
      ,     obads2   = [opsn2, ostn2, oslw2, oblk2, ofrz2, oseal2]
      ,     oemos    = [oemo1, oemo2, oemo3, oemo4, oemo5]
      ;
      
      data.equipmentpotential = {};
      let list;
      
      /*----------------- ユニキューブ装備別潜在 ------------------------------------------------------------*/
      list = [];
      data.equipmentpotential["uni"]
      = list;
      
      /* ノーマル潜在(=レア等級下位)の確率は不明 */
      
      list[武器] = [];
      list[武器][レジェ] = [
        [pstr1, 7], [pdex1, 7], [pint1, 7], [pluk1, 7], [pall1, 7]
      , [patk, 20], [pma, 20], [iatk2, 7], [ima2, 7]
      , [pdam, 100], [pboss1, 32], [pboss2, 7], [pign1, 160], [pign2, 100]
      , [pcri, 130]
      ];
      list[武器][ユニ] = [
        [pstr1, 2], [pdex1, 2], [pint1, 2], [pluk1, 2], [pall1, 2]
      , [patk, 6], [pma, 6]
      , [pdam, 12], [pboss1, 4], [pign1, 15]
      , [pcri, 20]
      ];
      list[武器][エピ] = [
        [pstr1, 7], [pdex1, 7], [pint1, 7], [pluk1, 7], [pall1, 6]
      , [patk, 3], [pma, 3]
      , [pdam, 3], [pign1, 5]
      , [pcri, 3], [php, 7], [pmp, 7], [ohp1, 3], [omp1, 5]
      ];
      list[武器][レア] = [
        [pstr1, 3], [pdex1, 3], [pint1, 3], [pluk1, 3]
      , [istr1, 4], [idex1, 4], [iint1, 4], [iluk1, 4], [iall1, 2]
      , [patk, 1], [pma, 1], [iatk1, 2], [ima1, 2]
      , [pdam, 1], [pign1, 1]
      , [pcri, 1], [ihp, 4], [imp, 4], [omp1, 1]
      , [opsn1, 1], [ostn1, 1], [oslw1, 1], [oblk1, 1], [ofrz1, 1], [oseal1, 1]
      ];
      list[武器][ノマ] = list[武器][レア];
      
      
      list[エンブレム] = [];
      list[エンブレム][レジェ] = [
        [pstr1, 7], [pdex1, 7], [pint1, 7], [pluk1, 7], [pall1, 7]
      , [patk, 20], [pma, 20], [iatk2, 7], [ima2, 7]
      , [pdam, 100], [pign1, 160], [pign2, 100]
      , [pcri, 130]
      ];
      list[エンブレム][ユニ]   = [
        [pstr1, 2], [pdex1, 2], [pint1, 2], [pluk1, 2], [pall1, 2]
      , [patk, 6], [pma, 6]
      , [pdam, 12], [pign1, 15]
      , [pcri, 20]
      ];
      list[エンブレム][エピ]   = list[武器][エピ];
      list[エンブレム][レア]   = list[武器][レア];
      list[エンブレム][ノマ]   = list[武器][ノマ];
      
      
      list[補助武器] = [];
      list[補助武器][レジェ]   = list[武器][レジェ];
      list[補助武器][ユニ]     = list[武器][ユニ];
      list[補助武器][エピ]     = list[武器][エピ];
      list[補助武器][レア]     = list[武器][レア];
      list[補助武器][ノマ]     = list[武器][ノマ];
      
      
      list[フォース] = [];
      list[フォース][レジェ]  = list[武器][レジェ];
      list[フォース][ユニ]    = list[武器][ユニ];
      list[フォース][エピ]    = [
        [pstr1, 7], [pdex1, 7], [pint1, 7], [pluk1, 7], [pall1, 6]
      , [patk, 3], [pma, 3]
      , [pdam, 3], [pign1, 5]
      , [pcri, 3], [php, 7], [ohp1, 3], [omp1, 5]
      ];
      list[フォース][レア]    = [
        [pstr1, 3], [pdex1, 3], [pint1, 3], [pluk1, 3]
      , [istr1, 4], [idex1, 4], [iint1, 4], [iluk1, 4], [iall1, 2]
      , [patk, 1], [pma, 1], [iatk1, 2], [ima1, 2]
      , [pdam, 1], [pign1, 1]
      , [pcri, 1], [ihp, 4], [omp1, 1]
      , [opsn1, 1], [ostn1, 1], [oslw1, 1], [oblk1, 1], [ofrz1, 1], [oseal1, 1]
      ];
      list[フォース][ノマ]    = list[フォース][レア];
      
      
      list[盾] = list[武器];
      
      
      list[帽子] = [];
      list[帽子][レジェ]   = [
        [pstr1, 4], [pdex1, 4], [pint1, 4], [pluk1, 4], [pall1, 1]
      , [php, 4], [pmp, 8], [pigndam1, 9], [pigndam2, 9], [ict1, 8], [ict2, 8], [spab, 9]
      ];
      list[帽子][ユニ]     = [
        [pstr1, 4], [pdex1, 4], [pint1, 4], [pluk1, 4], [pall1, 1]
      , [php, 4], [pmp, 8], [oeff, 8], [pigndam1, 8], [pigndam2, 8], [spmd, 8]
      ];
      list[帽子][エピ]     = [
        [pstr1, 10], [pdex1, 10], [pint1, 10], [pluk1, 10], [pall1, 1]
      , [php, 10], [pmp, 10], [pdef, 10]
      ];
      list[帽子][レア]     = [
        [pstr1, 3], [pdex1, 3], [pint1, 3], [pluk1, 3]
      , [istr1, 9], [idex1, 9], [iint1, 9], [iluk1, 9], [iall1, 9]
      , [php, 3], [pmp, 9], [ihp, 9], [imp, 9], [pdef, 8], [idef, 9]
      ];
      list[帽子][ノマ]     = list[帽子][レア];
      
      
      list[服上] = [];
      list[服上][レジェ]   = [
        [pstr1, 4], [pdex1, 4], [pint1, 4], [pluk1, 4], [pall1, 1]
      , [php, 4], [pmp, 7], [pigndam1, 7], [pigndam2, 7], [oinv, 8], [opinv, 8]
      ];
      list[服上][ユニ]     = [
        [pstr1, 4], [pdex1, 4], [pint1, 4], [pluk1, 4], [pall1, 1]
      , [php, 4], [pmp, 8], [oeff, 9], [pigndam1, 9], [pigndam2, 9], [prefdam1, 9], [prefdam2, 9], [oinv, 8], [opinv, 8]
      ];
      /* 無敵時間増加が2枠ある(？) */
      list[服上][エピ]     = [
        [pstr1, 14], [pdex1, 14], [pint1, 14], [pluk1, 14], [pall1, 1]
      , [php, 14], [pmp, 15], [pdef, 15], [oinv, 3*2]
      ];
      list[服上][レア]     = list[帽子][レア];
      list[服上][ノマ]     = list[帽子][ノマ];
      
      
      list[服全身]         = list[服上];
      
      
      list[服下] = [];
      list[服下][レジェ]   = [
        [pstr1, 4], [pdex1, 4], [pint1, 4], [pluk1, 4], [pall1, 1]
      , [php, 4], [pmp, 6], [pigndam1, 6], [pigndam2, 6]
      ];
      list[服下][ユニ]     = [
        [pstr1, 4], [pdex1, 4], [pint1, 4], [pluk1, 4], [pall1, 1]
      , [php, 4], [pmp, 7], [oeff, 7], [pigndam1, 7], [pigndam2, 7], [sphb, 7]
      ];
      list[服下][エピ]     = list[帽子][エピ];
      list[服下][レア]     = list[帽子][レア];
      list[服下][ノマ]     = list[帽子][ノマ];
      
      
      list[靴] = [];
      list[靴][レジェ]     = [
        [pstr1, 4], [pdex1, 4], [pint1, 4], [pluk1, 4], [pall1, 1]
      , [php, 4], [pmp, 7], [pigndam1, 7], [pigndam2, 7], [spco, 6]
      ];
      list[靴][ユニ]       = [
        [pstr1, 5], [pdex1, 5], [pint1, 5], [pluk1, 5], [pall1, 1]
      , [php, 5], [pmp, 9], [oeff, 10], [pigndam1, 9], [pigndam2, 9], [spht, 7]
      ];
      list[靴][エピ]       = [
        [pstr1, 10], [pdex1, 10], [pint1, 10], [pluk1, 10], [pall1, 1]
      , [php, 10], [pmp, 11], [pdef, 11]
      ];
      list[靴][レア]       = [
        [pstr1, 3], [pdex1, 3], [pint1, 3], [pluk1, 3]
      , [istr1, 10], [idex1, 10], [iint1, 10], [iluk1, 10], [iall1, 10]
      , [php, 3], [pmp, 10], [ihp, 10], [imp, 10], [pdef, 10], [idef, 10], [ispd, 11], [ijmp, 11]
      ];
      list[靴][ノマ]       = list[靴][レア];
      
      
      list[手袋] = [];
      list[手袋][レジェ]   = [
        [pstr1, 4], [pdex1, 4], [pint1, 4], [pluk1, 4], [pall1, 1]
      , [php, 4], [pmp, 10], [pcrd1, 2], [pigndam1, 9], [pigndam2, 9], [spwb, 8]
      ];
      list[手袋][ユニ]     = [
        [pstr1, 5], [pdex1, 5], [pint1, 5], [pluk1, 5], [pall1, 1]
      , [istr2, 5], [idex2, 5], [iint2, 5], [iluk2, 5]
      , [php, 5], [pmp, 8], [oeff, 8], [pigndam1, 8], [pigndam2, 8], [spse, 9]
      ];
      list[手袋][エピ]     = [
        [pstr1, 14], [pdex1, 14], [pint1, 14], [pluk1, 14], [pall1, 1]
      , [php, 14], [pmp, 15], [pdef, 15], [oehp, 3], [oemp, 3]
      ];
      list[手袋][レア]     = list[帽子][レア];
      list[手袋][ノマ]     = list[帽子][ノマ];
      
      
      list[マント] = [];
      list[マント][レジェ] = [
        [pstr1, 4], [pdex1, 4], [pint1, 4], [pluk1, 4], [pall1, 3]
      , [php, 4], [pmp, 6], [pigndam1, 5], [pigndam2, 5]
      ];
      list[マント][ユニ]   = [
        [pstr1, 5], [pdex1, 5], [pint1, 5], [pluk1, 5], [pall1, 1]
      , [php, 5], [pmp, 7], [oeff, 8], [pigndam1, 8], [pigndam2, 8]
      ];
      list[マント][エピ]   = list[帽子][エピ];
      list[マント][レア]   = list[帽子][レア];
      list[マント][ノマ]   = list[帽子][ノマ];
      
      
      list[ベルト] = list[マント];
      list[肩]     = list[マント];
      
      
      list[顔飾り] = [];
      list[顔飾り][レジェ] = [
        [pstr1, 4], [pdex1, 4], [pint1, 4], [pluk1, 4], [pall1, 1]
      , [php, 4], [pmp, 8], [pmeso, 6], [pdrop, 6], [pdmp1, 8], [pdmp2, 8]
      ];
      list[顔飾り][ユニ]   = [
        [pstr1, 5], [pdex1, 5], [pint1, 5], [pluk1, 5], [pall1, 1]
      , [php, 5], [pmp, 5], [oeff, 6]
      ];
      list[顔飾り][エピ]   = [
        [pstr1, 10], [pdex1, 10], [pint1, 10], [pluk1, 10], [pall1, 1]
      , [php, 10], [pmp, 11], [pdef, 11]
      ];
      list[顔飾り][レア]   = [
        [pstr1, 3], [pdex1, 3], [pint1, 3], [pluk1, 3]
      , [istr1, 9], [idex1, 9], [iint1, 9], [iluk1, 9], [iall1, 9]
      , [php, 3], [pmp, 9], [ihp, 10], [imp, 10], [pdef, 9], [idef, 10]
      ];
      list[顔飾り][ノマ]   = list[顔飾り][レア];
      
      
      list[目飾り]     = list[顔飾り];
      list[イヤリング] = list[顔飾り];
      list[指輪]       = list[顔飾り];
      list[ペンダント] = list[顔飾り];
      
      list[機械心臓] = [];
      list[機械心臓][レジェ] = list[マント][レジェ];
      list[機械心臓][ユニ]   = list[マント][ユニ];
      list[機械心臓][エピ]   = list[マント][エピ];
      list[機械心臓][レア]   = list[マント][レア];
      list[機械心臓][ノマ]   = list[マント][ノマ];
    }
    
  })();


  /*========================= 潜在能力の設定 =================================================*/
  /**
  *[ 潜在重要度(0職業によっては必須, 1小さい影響, 2影響なし不要)
  *, レジェ[確率比重, [レベル閾値, 潜在数値]...]
  *, ユニ[], エピ[], レア[], ノマ[]
  *]
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


  
  /*----------- 潜在能力表示名設定 ---------------------------------------*/
  let pt = data.potentialinfotemplate;
  let list = commons.createpotentialinfolist(data);
  data.potentialinfolist = list;

  /*=============== 汎用最終処理 ==========================================*/
  with(commons.consts){
    /* data.ratetableを扱いやすいように書き換え */
    for( let k of Object.keys(data.ratetable) ){
      data.ratetable[k].map( (e, i, arr) =>{
        if(!e) return;
        arr[i] = e.map( r => [ r, new BigNumber(1).minus( r ) ] );
      });
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
  }
};






