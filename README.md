# 開心中文樂園 / Happy Chinese Playground

香港 K2（4-5 歲）及 K3（5-6 歲）小朋友嘅互動中文選擇題遊戲。
完全本地運作：冇登入、冇 API key、冇後端、冇雲端資料庫，所有進度只儲存喺瀏覽器 `localStorage`。

> **技術說明 / Tech note**
> 呢個專案喺 **Vite + React 19 + TypeScript + Tailwind CSS v4** 環境建立（不是 Next.js）。
> 檔案結構沿用 `src/app/**/page.tsx` 嘅命名，路由用 hash（`#/k2`、`#/quiz?...`），所以係純靜態網站，
> 可直接部署到 Vercel / 任何靜態主機，無需伺服器設定。
> 建置後只有一個 `dist/index.html`（JS、CSS、完整題庫都內嵌），加上 manifest、service worker 同圖示，離線都可以開。

## 本機執行

```bash
npm install
npm run dev        # 開發：http://localhost:5173
npm run build      # 建置到 dist/
npm run preview    # 預覽建置結果
```

驗證題庫（數量、4 選項、重複、圖形名稱、簡體字、負面字眼）：

```bash
npx esbuild scripts/validate-entry.ts --bundle --platform=node --format=esm --jsx=automatic --outfile=/tmp/validate.mjs && node /tmp/validate.mjs
```

重新產生 PWA 圖示（純 Node，無需套件）：`node scripts/make-icons.mjs`

## 部署到 Vercel

```bash
npm i -g vercel
vercel            # 首次部署（框架自動偵測 Vite）
vercel --prod     # 正式發佈
```

Vercel 設定：Build Command `npm run build`，Output Directory `dist`。或者將專案推上 GitHub，再喺 Vercel 匯入。

## 題庫

- 位置：`src/data/`
  - `types.ts` 題目型別 · `topics.ts` 8 個主題 · `helpers.ts` 出題 builder
  - `vocab.ts` 共用詞彙（動物、食物、身體、家人、顏色、筆畫、部首…）
  - `k2Core.ts`、`k2More.ts` K2 題目 · `k3Core.ts`、`k3More.ts` K3 題目
  - `questions.ts` 合併、統計 (`getBankStats()`)、抽題 (`pickQuiz()`)
- 目前共 **506 題**：K2 233、K3 273；8 個主題（認字、部首筆順、詞語、量詞、句子、聆聽、故事、生活常識）每級每主題至少 12 題。
- 每題欄位：`id, level, topic, topicEn, difficulty, questionZh, questionEn, audioText, imageType, imageConfig, choices(4), correctIndex, explanationZh, explanationEn, tags`（另有 `topicId`、`choiceStyle`）。
- 正確答案位置由 builder 平均分佈到 4 個位置。

### 如何新增題目

1. 揀返 K2 或 K3 對應檔案（例如 `src/data/k3More.ts`）嘅主題區段。
2. 用 `b.add({...})` 加一題：

```ts
b.add({
  topic: "words",                 // chars | radicals | words | measure | sentences | listening | story | life
  d: 2,                           // 難度 1-3
  qz: "「快」嘅反義詞係咩？",
  qe: 'What is the opposite of "快" (fast)?',
  img: "char", cfg: { text: "快" },   // none | char | radical | icon | count | stroke | structure | position | scene
  right: c("慢", "slow"),
  wrong: [c("高", "tall"), c("冷", "cold"), c("矮", "short")],   // 必須 3 個
  ez: "「快」同「慢」係相反嘅意思。",
  ee: '"快" and "慢" are opposites.',
  tags: ["反義詞"],
  style: "text",                  // 可選：text | icon（只顯示圖）| color | swatch
});
```

3. 如果要新圖形，喺 `src/components/Illustration.tsx` 嘅 `SHAPES` 加一個 SVG（viewBox 0 0 100 100）。
4. 執行上面嘅驗證指令，確保冇重複、冇未知圖形，再 `npm run build`。

大量同類題目可以直接擴充 `vocab.ts` 嘅詞彙表，模板會自動產生題目。

## localStorage

| Key | 內容 |
| --- | --- |
| `happyChinese.progress` | 星星、遊玩次數、最佳 combo、貼紙、各主題答題統計 |
| `happyChinese.badges` | 已獲得獎章與日期 |
| `happyChinese.recentResults` | 最近練習紀錄（保留 30 次，報告顯示 10 次） |
| `happyChinese.wrongQuestions` | 錯題 ID 與答錯次數（之後一次答對會逐步減少） |
| `happyChinese.settings` | 音效 / 音樂 / 朗讀設定 |

每份資料都有 `version: 1`；`src/lib/store.ts` 嘅 `load()` 預留升級位置。
如果 localStorage 被禁用，會自動改用記憶體，遊戲照玩，只係唔儲存進度（畫面會提示）。

## 功能簡介

- 首頁 4 個大按鈕：K2 開始、K3 開始、我的星星與獎章、家長報告。
- 8 個主題 + 綜合挑戰，每次隨機 10 題；答錯可即時再試，只記錄首次是否答對。
- 全部介面中文在上、英文在下；按鈕最少 64px 高；圓體大字。
- 全內建 SVG 圖形（約 80 款）：水果、動物、家人、身體、天氣、交通、文具、衣服、筆畫、字形結構、方位圖、故事場景；吉祥物「中文熊貓」。
- 答對：熊貓跳躍、星星爆開、confetti、combo；答錯：熊貓輕輕搖頭 +「再試一次，你得嘅！」。
- 每 5 題小獎勵，10 題成績頁（星星、正確率、用時、貼紙、獎章）。
- 朗讀：Web Speech API，優先 `zh-HK` / 粵語語音，否則其他中文語音；速度 0.7；不支援就隱藏喇叭。
- 音效（叮、柔和低音、點擊、星星、勝利旋律）同背景音樂全部用 Web Audio 即時合成，無外部音檔；可分別開關；朗讀同音效不會同時播放（音效會先中止朗讀，朗讀時音樂自動收細）。
- 家長報告：整體正確率圓環、K2/K3 各主題進度條、較弱主題提示、最近 10 次練習、錯題清單與錯題練習、二次確認嘅「清除紀錄」。
- PWA：`manifest.json`、`sw.js`、圖示；載入過一次後可離線開啟。

## 注意

- 廣東話語音取決於裝置（iOS / Android / Chrome 大多有 `zh-HK`）；冇嘅話會用國語等其他中文語音。
- 瀏覽器要求先有觸控／點擊，先可以播放聲音同音樂。
