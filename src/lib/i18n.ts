// 集中管理中英對照文字 / Central bilingual (Chinese + English) text
export interface Bi {
  zh: string;
  en: string;
}

const b = (zh: string, en: string): Bi => ({ zh, en });

export const T = {
  appName: b("開心中文樂園", "Happy Chinese Playground"),
  mascotName: b("中文熊貓", "Chinese Panda"),
  homeHello: b("嗨！一齊學中文啦！", "Hi! Let's learn Chinese!"),
  startK2: b("K2 開始", "Start K2"),
  startK3: b("K3 開始", "Start K3"),
  k2Sub: b("4-5 歲", "Ages 4-5"),
  k3Sub: b("5-6 歲", "Ages 5-6"),
  myStars: b("我的星星與獎章", "My Stars & Badges"),
  parentReport: b("家長報告", "Parent Report"),
  back: b("返回", "Back"),
  backHome: b("返回主頁", "Back to Home"),
  playAgain: b("再玩一次", "Play Again"),
  chooseTopic: b("揀一個主題", "Pick a topic"),
  mixed: b("綜合挑戰", "Mixed Challenge"),
  mixedSub: b("所有主題隨機 10 題", "10 random questions"),
  questionOf: b("第", "Question"),
  next: b("下一題", "Next"),
  finish: b("看成績", "See Results"),
  continue: b("繼續", "Continue"),
  listen: b("聽一聽", "Listen"),
  correct1: b("答啱喇！好叻！", "Correct! Well done!"),
  correct2: b("好嘢！你好叻！", "Great job! You're clever!"),
  correct3: b("正呀！繼續加油！", "Awesome! Keep going!"),
  correct4: b("叮！答啱咗！", "Ding! That's right!"),
  tryAgain: b("再試一次，你得嘅！", "Try again! You can do it!"),
  combo: b("連續答對", "Combo"),
  halfway: b("好叻！完成 5 題！", "Great! 5 questions done!"),
  halfwaySub: b("你得到一粒小星星獎勵！", "You earned a little star reward!"),
  stars: b("星星", "Stars"),
  accuracy: b("正確率", "Accuracy"),
  time: b("用時", "Time"),
  firstTry: b("一次答對", "First-try correct"),
  newBadge: b("新獎章！", "New badge!"),
  newSticker: b("新貼紙！", "New sticker!"),
  resultGreat: b("太棒了！你係小冠軍！", "Amazing! You're a champion!"),
  resultGood: b("做得好！你越嚟越叻！", "Well done! You're getting better!"),
  resultKeep: b("好努力！再玩多次會更叻！", "Nice effort! Play again to get even better!"),
  sound: b("音效", "Sound"),
  music: b("音樂", "Music"),
  speech: b("朗讀", "Voice"),
  on: b("開", "On"),
  off: b("關", "Off"),
  totalStars: b("星星總數", "Total stars"),
  badges: b("獎章", "Badges"),
  stickers: b("貼紙", "Stickers"),
  locked: b("未獲得", "Locked"),
  gamesPlayed: b("已玩次數", "Games played"),
  noRecords: b("未有紀錄，快啲開始玩啦！", "No records yet. Let's play!"),
  recent10: b("最近 10 次練習", "Last 10 Practices"),
  topicAccuracy: b("各主題正確率", "Accuracy by Topic"),
  practiceRecommended: b("建議再練習", "Practice recommended"),
  doingWell: b("表現良好", "Doing well"),
  notEnoughData: b("資料未夠", "Not enough data"),
  clearRecords: b("清除紀錄", "Clear Records"),
  clearAsk: b("確定要清除所有紀錄嗎？星星、獎章同練習紀錄都會刪除。", "Clear everything? Stars, badges and practice records will be deleted."),
  clearYes: b("確定清除", "Yes, clear"),
  cancel: b("取消", "Cancel"),
  cleared: b("紀錄已清除", "Records cleared"),
  wrongList: b("需要多練習嘅題目", "Questions to practice"),
  wrongCount: b("答錯次數", "Times missed"),
  practiceWrong: b("練習錯題", "Practice Missed Questions"),
  noWrong: b("暫時未有錯題，好叻！", "No missed questions yet. Great!"),
  overall: b("整體正確率", "Overall accuracy"),
  questionsDone: b("已答題數", "Questions answered"),
  storageOff: b("此瀏覽器未能儲存進度，但仍可以玩。", "Progress can't be saved in this browser, but you can still play."),
  parentTip: b("給家長：星星代表一次答對嘅題數；正確率低於 70% 嘅主題會建議再練習。", "For parents: each star is a first-try correct answer. Topics under 70% are flagged for more practice."),
  date: b("日期", "Date"),
  level: b("級別", "Level"),
  topic: b("主題", "Topic"),
  score: b("分數", "Score"),
  answered: b("已答", "answered"),
  tapToHear: b("按喇叭聽題目", "Tap to hear the question"),
  hearChoice: b("聽選項", "Hear choice"),
  offlineReady: b("離線可玩", "Works offline"),
  seconds: b("秒", "sec"),
  minutes: b("分", "min"),
  allDone: b("全部完成", "All done"),
  pool: b("題", "questions"),
} as const;

export const CORRECT_PRAISES: Bi[] = [T.correct1, T.correct2, T.correct3, T.correct4];

export function formatDuration(totalSec: number): Bi {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m > 0) return b(`${m} 分 ${s} 秒`, `${m} min ${s} sec`);
  return b(`${s} 秒`, `${s} sec`);
}
