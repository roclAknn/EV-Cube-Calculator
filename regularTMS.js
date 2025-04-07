


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
  data.potentialinfotemplate = regularKMS.potentialinfotemplate;


  
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
    , [[pigndam1, pigndam2], 2]
    , [[spwb], 1] /* 公式ではパサーブル系列は1行のみという書き方で、別のパサーブルが重複するか未確認 */
    , [[spse], 1]
    , [[spab], 1]
    , [[spco], 1]
    , [[sphb], 1]
    , [[spht], 1]
    , [[spmd], 1]
    //, [[pboss1, pboss2], 2] /* JMSで3重複確認済み */
    //, [[pign1, pign2], 2]
    //, [[pdrop], 2]
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






