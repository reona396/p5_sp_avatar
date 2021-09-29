// 女子
// https://charat.me/rouge/create/?share=9Pv33c6Q1
// 男子
// https://charat.me/blanc/create/?share=FPv33c6Q1

let imgs = [];
let displayIndex = 0;
let mabatakiCounter = 0;
let kuchipakuCounter = 0;
let yurashiAngle = 0;
let yurashiStep = 0;
let ox, oy;
let isSpeeching = false;
let mic;
let avatarIndex = 0;

/*
  まばたき系
*/
// 目を開けている秒数
let kaiganSeconds = 2.5;
// 目を閉じている秒数
let metojiSeconds = 0.16;

/*
  ゆらし系
*/
// ゆらす角度の幅(単位:度) ゼロを中心に-yurashiAmpからyurashiAmpの間ゆれる
let yurashiAmp = 0.75;
// ゆらすスピード
let yurashiSpeed = 1.5;
// 縦方向にゆらす幅
let tateYurashiAmp = 5.5;

let isStarted = false;

let imgScale = 1.0;

function preload() {
  let girls = [];
  for (let i = 0; i < 4; i++) {
    girls[i] = loadImage("avatar/makergirl_" + nf(i, 2) + ".png");
  }

  let boys = [];
  for (let i = 0; i < 4; i++) {
    boys[i] = loadImage("avatar/makerboy_" + nf(i, 2) + ".png");
  }

  imgs.push(girls);
  imgs.push(boys);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  frameRate(60);
  imageMode(CENTER);
  textSize(25);
  textAlign(CENTER, CENTER);

  // 秒数の変換
  kaiganSeconds *= 60;
  metojiSeconds *= 60;

  ox = width / 2;
  oy = height * 1.25;
}

function draw() {
  background("#E7ECF2");

  if (!isStarted) {
    text("Touch to Start", width / 2, height / 2);
    return;
  } else {

    background("#E7ECF2");

    push();
    translate(ox, oy);
    rotate(yurashiAngle);
    imgScale = height / 1000;
    scale(imgScale);

    // let y = -oy - imgs[0][0].height * imgScale * 0.5 + height + tateYurashiAmp * abs(sin(yurashiStep));
    let y = -oy + 1000 * imgScale * 0.95 + tateYurashiAmp * abs(sin(yurashiStep));
    image(imgs[avatarIndex][displayIndex], 0, y);
    pop();

    let micVol = mic.getLevel();

    // しゃべっている時
    if (micVol > 0.015) {
      // 無言からしゃべり始めた時
      if (!isSpeeching) {
        // まばたき状態の引き継ぎ
        displayIndex = displayIndex == 0 ? 2 : 3;
      }
      isSpeeching = true;
    }
    // 無言の時
    else {
      // しゃべっている状態から無言になった時
      if (isSpeeching) {
        // まばたき状態の引き継ぎ
        displayIndex = displayIndex == 2 ? 0 : 1;
      }
      isSpeeching = false;
    }

    // しゃべっている時
    if (isSpeeching) {
      // まばたき処理
      if (displayIndex == 2 && mabatakiCounter > kaiganSeconds) {
        displayIndex = 3;
        mabatakiCounter = 0;
      } else if (displayIndex == 3 && mabatakiCounter > metojiSeconds) {
        displayIndex = 2;
        mabatakiCounter = 0;
      }
    }
    // 無言の時
    else {
      // まばたき処理
      if (displayIndex == 0 && mabatakiCounter > kaiganSeconds) {
        displayIndex = 1;
        mabatakiCounter = 0;
      } else if (displayIndex == 1 && mabatakiCounter > metojiSeconds) {
        displayIndex = 0;
        mabatakiCounter = 0;
      }
    }

    // ゆらし処理
    yurashiAngle = yurashiAmp * sin(yurashiStep);
    yurashiStep += yurashiSpeed;

    mabatakiCounter++;
  }
}

function mousePressed() {
  if (!isStarted) {
    userStartAudio();

    mic = new p5.AudioIn();
    mic.start();
    isStarted = true;
  } else {
    avatarIndex = avatarIndex === 0 ? 1 : 0;
  }
}