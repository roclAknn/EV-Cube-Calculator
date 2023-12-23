
const commons = {
  equipmentnames: [
    "武器",   "エンブレム", "補助武器", "フォースシールド/ソウルリング", "盾"
  , "帽子",   "服(上)",     "服(全身)", "服(下)",     "靴"
  , "手袋",   "マント",     "ベルト",   "肩",         "顔飾り"
  , "目飾り", "イヤリング", "指輪",     "ペンダント", "機械心臓"
  ]
, ranknames: [
    "レジェンダリー", "ユニーク", "エピック", "レア", "ノーマル"
  ]
, rankclassnames: ["legendary", "unique", "epic", "rare", "normal"]
};

function initcubedatas(){
  
  
  let idx;
  idx1 = [].indexOf.bind(commons.equipmentnames);
  idx2 = [].indexOf.bind(commons.ranknames);
  let potentialnum = 0;
  commons.consts = {
    武器       : idx1("武器")
  , エンブレム : idx1("エンブレム")
  , 補助武器   : idx1("補助武器")
  , フォース   : idx1("フォースシールド/ソウルリング")
  , 盾         : idx1("盾")
  , 帽子       : idx1("帽子")
  , 服上       : idx1("服(上)")
  , 服全身     : idx1("服(全身)")
  , 服下       : idx1("服(下)")
  , 靴         : idx1("靴")
  , 手袋       : idx1("手袋")
  , マント     : idx1("マント")
  , ベルト     : idx1("ベルト")
  , 肩         : idx1("肩")
  , 顔飾り     : idx1("顔飾り")
  , 目飾り     : idx1("目飾り")
  , イヤリング : idx1("イヤリング")
  , 指輪       : idx1("指輪")
  , ペンダント : idx1("ペンダント")
  , 機械心臓   : idx1("機械心臓")
  
  , レジェ : idx2("レジェンダリー")
  , ユニ   : idx2("ユニーク")
  , エピ   : idx2("エピック")
  , レア   : idx2("レア")
  , ノマ   : idx2("ノーマル")
  
  , pstr1 : potentialnum++, pdex1 : potentialnum++, pint1 : potentialnum++, pluk1 : potentialnum++
  , pstr2 : potentialnum++, pdex2 : potentialnum++, pint2 : potentialnum++, pluk2 : potentialnum++
  , pall1 : potentialnum++
  , pall2 : potentialnum++
  , patk : potentialnum++, pma  : potentialnum++
  , lvstr : potentialnum++, lvdex : potentialnum++, lvint : potentialnum++, lvluk : potentialnum++
  , istr1 : potentialnum++, idex1 : potentialnum++, iint1 : potentialnum++, iluk1 : potentialnum++
  , istr2 : potentialnum++, idex2 : potentialnum++, iint2 : potentialnum++, iluk2 : potentialnum++
  , iall1 : potentialnum++, iall2 : potentialnum++
  , iatk1 : potentialnum++, ima1  : potentialnum++
  , iatk2 : potentialnum++, ima2  : potentialnum++
  , php : potentialnum++,  pmp : potentialnum++
  , ihp : potentialnum++,  imp : potentialnum++
  , pcri : potentialnum++, pcrd1 : potentialnum++, pcrd2 : potentialnum++
  , pdam : potentialnum++
  , pboss1 : potentialnum++, pboss2 : potentialnum++
  , pign1 : potentialnum++,  pign2 : potentialnum++
  , ict1 : potentialnum++, ict2 : potentialnum++
  , ohp1 : potentialnum++,  omp1 : potentialnum++
  , ohp2 : potentialnum++,  omp2 : potentialnum++
  , oehp : potentialnum++, oemp : potentialnum++
  , orhp : potentialnum++, ormp : potentialnum++
  , oeff : potentialnum++
  , oinv : potentialnum++
  , opinv : potentialnum++
  , opsn1 : potentialnum++, ostn1 : potentialnum++, oslw1 : potentialnum++, oblk1 : potentialnum++, ofrz1 : potentialnum++, oseal1 : potentialnum++
  , opsn2 : potentialnum++, ostn2 : potentialnum++, oslw2 : potentialnum++, oblk2 : potentialnum++, ofrz2 : potentialnum++, oseal2 : potentialnum++
  , oemo1 : potentialnum++, oemo2 : potentialnum++, oemo3 : potentialnum++, oemo4 : potentialnum++, oemo5 : potentialnum++
  , ostl1 : potentialnum++, ostl2 : potentialnum++, ostl3 : potentialnum++
  , ispd : potentialnum++, ijmp : potentialnum++
  , pigndam1 : potentialnum++, pigndam2 : potentialnum++
  , iigndam1 : potentialnum++, iigndam2 : potentialnum++, iigndam3 : potentialnum++
  , prefdam1 : potentialnum++, prefdam2 : potentialnum++
  , pdef : potentialnum++
  , idef : potentialnum++
  , pdmp1 : potentialnum++, pdmp2 : potentialnum++
  , pdrop : potentialnum++, pmeso : potentialnum++
  , spwb : potentialnum++, spse : potentialnum++, spab : potentialnum++, spco : potentialnum++, sphb : potentialnum++, spht : potentialnum++, spmd : potentialnum++
  };
  
  commons.potentialnum = potentialnum;
  
  
  
  regularKMS.init();
  additionalKMS.init();
}

commons.createpotentialinfolist = function(data){
  let pt = data.potentialinfotemplate;
  let list = [];
  with(commons.consts){
    list[pstr1]  = ["% STR", pt["% STR1"]];
    list[pdex1]  = ["% DEX", pt["% STR1"]];
    list[pint1]  = ["% INT", pt["% STR1"]];
    list[pluk1]  = ["% LUK", pt["% STR1"]];
    list[pstr2]  = ["% STR", pt["% STR2"]];
    list[pdex2]  = ["% DEX", pt["% STR2"]];
    list[pint2]  = ["% INT", pt["% STR2"]];
    list[pluk2]  = ["% LUK", pt["% STR2"]];
    list[pall1]  = ["% ｵｰﾙｽﾃｰﾀｽ", pt["% オールステータス1"]];
    list[pall2]  = ["% ｵｰﾙｽﾃｰﾀｽ", pt["% オールステータス2"]];
    list[patk]  = ["% 攻撃力", pt["% 攻撃力"]];
    list[pma]   = ["% 魔力",   pt["% 攻撃力"]];
   
    list[lvstr] = ["STR レベル9当たり", pt["STR レベル9当たり"]];
    list[lvdex] = ["DEX レベル9当たり", pt["STR レベル9当たり"]];
    list[lvint] = ["INT レベル9当たり", pt["STR レベル9当たり"]];
    list[lvluk] = ["LUK レベル9当たり", pt["STR レベル9当たり"]];
    
    list[istr1]  = ["STR", pt["STR1"]];
    list[idex1]  = ["DEX", pt["STR1"]];
    list[iint1]  = ["INT", pt["STR1"]];
    list[iluk1]  = ["LUK", pt["STR1"]];
    list[istr2]  = ["STR", pt["STR2"]];
    list[idex2]  = ["DEX", pt["STR2"]];
    list[iint2]  = ["INT", pt["STR2"]];
    list[iluk2]  = ["LUK", pt["STR2"]];
    list[iall1]  = ["ｵｰﾙｽﾃｰﾀｽ", pt["オールステータス1"]];
    list[iall2]  = ["ｵｰﾙｽﾃｰﾀｽ", pt["オールステータス2"]];
    list[iatk1]  = ["攻撃力", pt["攻撃力1"]];
    list[ima1]   = ["魔力",   pt["攻撃力1"]];
    list[iatk2]  = ["攻撃力", pt["攻撃力2"]];
    list[ima2]   = ["魔力",   pt["攻撃力2"]];
   
    list[pcri]   = ["% ｸﾘﾃｨｶﾙ率", pt["% クリティカル率"]];
    list[pcrd1]  = ["% ｸﾘﾃｨｶﾙﾀﾞﾒｰｼﾞ", pt["% クリティカルダメージ1"]];
    list[pcrd2]  = ["% ｸﾘﾃｨｶﾙﾀﾞﾒｰｼﾞ", pt["% クリティカルダメージ2"]];
    list[pdam]   = ["% ダメージ", pt["% ダメージ"]];
    list[pboss1] = ["% ボスダメージ", pt["% ボスダメージ1"]];
    list[pboss2] = ["% ボスダメージ", pt["% ボスダメージ2"]];
    list[pign1]  = ["% 防御率無視", pt["% 防御率無視1"]];
    list[pign2]  = ["% 防御率無視", pt["% 防御率無視2"]];
   
    list[php]   = ["% HP", pt["% HP"]];
    list[pmp]   = ["% MP", pt["% MP"]];
    list[ihp]   = ["HP",   pt["HP"]];
    list[imp]   = ["MP",   pt["MP"]];
   
    list[ict1]  = ["秒 全ｽｷﾙのｸｰﾙﾀｲﾑ減少", pt["秒 全スキルのクールタイム減少1"]];
    list[ict2]  = ["秒 全ｽｷﾙのｸｰﾙﾀｲﾑ減少", pt["秒 全スキルのクールタイム減少2"]];
   
    list[ohp1]   = ["HP回復 攻撃時20%の確率",      pt["HP回復 攻撃時20%の確率"]]; /*アディは確率が違う　テンプレート名は変えない*/
    list[omp1]   = ["MP回復 攻撃時20%の確率",      pt["MP回復 攻撃時20%の確率"]];
    list[ohp2]   = ["HP回復 攻撃時3%の確率",       pt["HP回復 攻撃時3%の確率"]];
    list[omp2]   = ["MP回復 攻撃時3%の確率",       pt["HP回復 攻撃時3%の確率"]];
   
    list[opsn1]  = ["レベル中毒 攻撃時20%の確率",   pt["レベル中毒 攻撃時20%の確率"]];
    list[ostn1]  = ["レベル気絶 攻撃時10%の確率",   pt["レベル気絶 攻撃時10%の確率"]];
    list[oslw1]  = ["レベルスロー 攻撃時20%の確率", pt["レベルスロー 攻撃時20%の確率"]];
    list[oblk1]  = ["レベル暗黒 攻撃時20%の確率",   pt["レベル暗黒 攻撃時20%の確率"]];
    list[ofrz1]  = ["レベル氷結 攻撃時10%の確率",   pt["レベル氷結 攻撃時10%の確率"]];
    list[oseal1] = ["レベル封印 攻撃時10%の確率",   pt["レベル封印 攻撃時10%の確率"]];
   
    list[opsn2]  = ["レベル中毒 攻撃時10%の確率",   pt["レベル中毒 攻撃時20%の確率"]];
    list[ostn2]  = ["レベル気絶 攻撃時5%の確率",    pt["レベル気絶 攻撃時10%の確率"]];
    list[oslw2]  = ["レベルスロー 攻撃時10%の確率", pt["レベルスロー 攻撃時20%の確率"]];
    list[oblk2]  = ["レベル暗黒 攻撃時10%の確率",   pt["レベル暗黒 攻撃時20%の確率"]];
    list[ofrz2]  = ["レベル氷結 攻撃時5%の確率",    pt["レベル氷結 攻撃時10%の確率"]];
    list[oseal2] = ["レベル封印 攻撃時5%の確率",    pt["レベル封印 攻撃時10%の確率"]];
   
    list[oemo1] = ["被撃時10%の確率で10秒間怒りを感じる",  pt["被撃時10%の確率で10秒間を感じる"]];
    list[oemo2] = ["被撃時10%の確率で10秒間幸せを感じる",  pt["被撃時10%の確率で10秒間を感じる"]];
    list[oemo3] = ["被撃時10%の確率で10秒間恋に落ちる",    pt["被撃時10%の確率で10秒間を感じる"]];
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
   
    list[pdmp1] = ["% 消費MP減少", pt["% 消費MP減少1"]];
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
  }
  
  return list;
}
