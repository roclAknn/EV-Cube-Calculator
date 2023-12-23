# EV-Cube-Calculator
GitHub Pages -> https://roclaknn.github.io/EV-Cube-Calculator/index.html

#### 概要
潜在能力を重複させたい場合などにいくつのキューブが必要になるかをほぼ正確に出力します<br>
```bash
韓国版メイプルストーリー(KMS)公式より公開されているキューブの確率を参考にしています
日本版メイプルストーリー(JMS)は確率を公開していませんが、KMSの類似キューブの仕様に近いと言われています
```


#### 概要
1. キューブの種類などを設定してください
2. コンディションバーの内容が設定と同じになったことを確認してください
3. 潜在確率表上方のつまみを操作すると重要でない潜在能力の表示量が３段階に切り替わります
4. 潜在確率表のうち、価値のある能力の Score に適当な数値を入力してください
```bash
出力されるのは合計スコアに対するキューブの平均消費数(=期待値)の表です
これは総当たり処理によって出力されるため、正確な値に近いものです
表はエクセルなどにコピー＆ペーストできます
確率が知りたい場合は-1乗してください
中央値は期待値の約0.7倍です
```


#### 注意事項・他
装備等級の上昇は出力には考慮されていません
```bash
基本的には最高等級の装備を想定していること、設定や処理が煩雑化することが理由です
よって出力値は等級上昇率を0としたものと同じです
対応の予定はありません
```
潜在能力の重複制限ロジックについて
```bash
一部の潜在能力は重複数が制限されています
KMS公開情報の記載から、１行目から順に設定していき、制限を超えた場合は
その行の等級抽選からやり直すロジックであると仮定しています
```
ヘキサキューブ(実験的)について
```bash
KMSにはないヘキサキューブの確率も出力できるようにしています
-- 非常に重くなる場合があるので、選択する場合は注意してください
ヘキサキューブのみスコア変更による表出力を遅らせるようにしています
-- これはスコア入力を邪魔しないための処置です
最適化により、スコアの未入力(=0)項目が多いほど出力処理が短くなります
```

入力されている確率やロジックには間違いや誤解が含まれている可能性があります<br>

出力結果について公式に問い合わせることなどは絶対にしないでください<br>

![image](https://github.com/roclAknn/EV-Cube-Calculator/assets/80640021/0582402d-a351-4308-a5be-2529d8d0d54d)



