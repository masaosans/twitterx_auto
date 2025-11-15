// post.js — 完全版（画像対応・CSVランダム・投稿済み管理）
').map(r => r.trim()).filter(Boolean);
const data = rows.map(line => {
const [text, image] = line.split(',');
return { text, image: image || '' };
});


// 過去投稿済みID読み込み
let used = [];
const usedPath = 'used.json';
if (fs.existsSync(usedPath)) used = JSON.parse(fs.readFileSync(usedPath, 'utf8'));


// 未投稿リスト抽出
const unused = data.filter(d => !used.includes(d.text));
if (unused.length === 0) {
console.log('全ての投稿を投稿済みです。CSVを追加してください。');
process.exit(0);
}


// ランダムで1件選択
const post = unused[Math.floor(Math.random() * unused.length)];


// Puppeteer起動
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setCookie(...cookies);


// X（twitter）へ移動
await page.goto('https://x.com/compose/tweet', { waitUntil: 'networkidle2' });
await page.waitForSelector('[data-testid="tweetTextarea_0"]');


// テキスト入力
await page.type('[data-testid="tweetTextarea_0"]', post.text, { delay: 30 });


// 画像がある場合アップロード
if (post.image && fs.existsSync(path.resolve(post.image))) {
const input = await page.$('input[type="file"]');
await input.uploadFile(path.resolve(post.image));
await page.waitForTimeout(1500);
}


// 投稿ボタン押す
await page.click('[data-testid="tweetButtonInline"]');
await page.waitForTimeout(3000);


console.log('投稿完了:', post.text);


// usedに追加
used.push(post.text);
fs.writeFileSync(usedPath, JSON.stringify(used, null, 2));


await browser.close();