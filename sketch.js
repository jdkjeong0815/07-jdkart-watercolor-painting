// jdk
//2025-Jan-18
// 제목: 구상과 비구상의 경계
// 설명: 백색, 검은색을 기본 색상으로 하고, 눈송이가 떨어지는 애니메이션 효과를 추가한 작품입니다.
// 나무는 분위기를 맞는 나무 종류로 제한. 직선적이고 곧은 나무, 얇은 두께의 나무를 선택께
// 배경 색상은 2개의 랜덤 색상을 lerpColor() 함수를 사용하여 그라디언트로 적용
// 달은 주황색과 노란색 그라디언트로 그리고, 안개 효과를 추가
// 랜덤 요소: 배경색1, 배경색2, 나무 위치, 달 크기, 달 위치, 눈송이 크기


let imgs = []
let img;

let scaleFactor = 1; // 나무 이미지를 줄일 비율
let snowflakes = []; // 눈송이 배열
let dep; // 테두리 두께 30px
let innerDep; // 안쪽 프레임 두께 설정  80px

let mainLayer, snowLayer;
let randomElements = {};
let minCanvasSize;

function preload() {
  // 나무 이미지를 로드합니다.
  for (let i = 0; i <= 6; i++) {
    imgs[i] = loadImage(`assets/수채화-dead-tree-silhouette-${i}.png`);
  }
}

function goFullScreen() {
  fullscreen(true);
}

function setup() {
  
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.mousePressed(goFullScreen); // 캔버스를 클릭하면 전체 화면 모드로 전환

  // 레이어 생성
  mainLayer = createGraphics(width, height);
  snowLayer = createGraphics(width, height); // 별도의 레이어 생성
  minCanvasSize = min(width, height);

  
  frameRate(60); // 프레임 레이트 설정
  noScroll(); // 스크롤 금지. 스크롤바 생기는 것 방지

  dep = minCanvasSize / 30; // 바깥쪽 프레임 크기를 width, height 중 작은 것 기준으로 1/30로 설정
  innerDep = dep * 2; // 안쪽 프레임 크기를 바깥쪽 프레임의 2배로 설정

  // 랜덤 요소 초기화
  clear();
  initializeRandomElements();

  drawGradientBackground();
  drawGradientMoon();
  drawGradientTree();
  drawFrame();
  
  // 120초마다 자동 갱신
  setInterval(refreshSketch, 120000);  // 애니메이션 효과를 위해 120초로 변경
}

function draw() {
  // 눈송이를 그리는 레이어
  snowLayer.clear(); // 이전 프레임 지우기
  drawSnowflakes();
  image(mainLayer, 0, 0); // 메인 레이어를 메인 캔버스 위에 덮어씀
  image(snowLayer, 0, 0); // 눈 레이어를 메인 캔버스 위에 덮어씀
}

function initializeRandomElements() {
  let canvas = createCanvas(windowWidth, windowHeight);

  // 레이어 생성
  mainLayer = createGraphics(width, height);
  snowLayer = createGraphics(width, height); // 별도의 레이어 생성
  snowflakes = [];
  randomElements.backgroundColor1 = color(random(255), random(255), random(255));
  randomElements.backgroundColor2 = color(random(255), random(255), random(255));
  randomElements.moonColor = random(104, 204);
  randomElements.treeColor = random([color(0, 0, 0), color(255, 255, 255)]);
  randomElements.moonSize = random(minCanvasSize/28, minCanvasSize/28*1.5);  // 달의 크기를 min 캔버스 기준으로 1/28 ~ 1/28*1.5 사이로 설정
  randomElements.moonX = random(randomElements.moonSize + dep + innerDep, width - 30 - dep - innerDep);
  randomElements.moonY = random(dep + innerDep + randomElements.moonSize * 1.5, dep + innerDep + randomElements.moonSize * 3.5);
}

function drawGradientTree() {
  // 랜덤으로 나무 이미지 선택
  img = random(imgs);

  // 이미지의 픽셀 데이터를 가져옵니다.
  img.loadPixels();

  // 모든 픽셀을 순회하면서 검은색 픽셀을 찾아 랜덤 색상으로 변경합니다.
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index + 0];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let a = img.pixels[index + 3];

      // 완전히 검은색인 픽셀을 확인 (r, g, b 값이 모두 0)
      if (a > 0 && r < 50 && g < 50 && b < 50) {
        img.pixels[index + 0] = red(randomElements.treeColor);
        img.pixels[index + 1] = green(randomElements.treeColor);
        img.pixels[index + 2] = blue(randomElements.treeColor);
      }
    }
  }

  // 변경된 픽셀 데이터를 업데이트합니다.
  img.updatePixels();

  // 이미지 축소
  let newHeight = (height - 2 * (dep + innerDep)) * 4 / 5;
  let newWidth = img.width * (newHeight / img.height);
  img.resize(newWidth, newHeight);

  // 나무 위치를 좌우로 랜덤하게 선택
  let randomX = random((width - newWidth) / 4, (width - newWidth) * 3 / 4);
  
  // 이미지를 메인 레이어에 그립니다.
  mainLayer.image(img, randomX, height - newHeight - dep - innerDep + 20);
}

function drawGradientMoon() {  
  let moonX = randomElements.moonX;
  let moonY = randomElements.moonY;
  let moonSize = randomElements.moonSize;
  
  // 노란색 그라디언트 달 그리기
  let ccc = randomElements.moonColor;
  for (let r = moonSize; r > 0; --r) {
    let inter = map(r, 0, moonSize, 0, 1);
    let c = lerpColor(color(255, 255, 0), color(255, ccc, 0), inter);
    mainLayer.fill(c);
    mainLayer.noStroke();
    mainLayer.ellipse(moonX, moonY, r * 2, r * 2);
  }

  // 안개 효과 추가
  mainLayer.drawingContext.filter = 'blur(15px)';
  let fogSize = floor(random(10, 20));
  for (let i = 0; i < fogSize; i++) {
    let fogColor = color(255, 255, 255, 20);
    mainLayer.fill(fogColor);
    let ellipseWidth = moonSize * 2.5 * random(0.8, 1.2);
    let ellipseHeight = moonSize * 2.5 * random(0.8, 1.2);
    mainLayer.ellipse(moonX + random(-20, 20), moonY + random(-20, 20), ellipseWidth, ellipseHeight);
  }
  mainLayer.drawingContext.filter = 'none';
}

function drawGradientBackground() {
  let direction = random([0, 1, 2, 3]); // 0: top-bottom, 1: bottom-top, 2: left-right, 3: right-left
  let c1 = color(random(255), random(255), random(255));
  let c2 = color(random(255), random(255), random(255));

  let xStart = dep + innerDep;
  let yStart = dep + innerDep;
  let xEnd = width - dep - innerDep;
  let yEnd = height - dep - innerDep;
  //console.log("drawGradient-시작", xStart, yStart, xEnd, yEnd);

  // Get CanvasRenderingContext2D
  let ctx = mainLayer.drawingContext;

  // Create gradient
  let gradient;
  if (direction === 0) { // Top to Bottom
    gradient = ctx.createLinearGradient(0, yStart, 0, yEnd);
  } else if (direction === 1) { // Bottom to Top
    gradient = ctx.createLinearGradient(0, yEnd, 0, yStart);
  } else if (direction === 2) { // Left to Right
    gradient = ctx.createLinearGradient(xStart, 0, xEnd, 0);
  } else if (direction === 3) { // Right to Left
    gradient = ctx.createLinearGradient(xEnd, 0, xStart, 0);
  }

  // Add color stops
  gradient.addColorStop(0, c1.toString());
  gradient.addColorStop(1, c2.toString());

  // Apply gradient as fill style
  ctx.fillStyle = gradient;

  // Draw rectangle
  ctx.fillRect(xStart, yStart, xEnd - xStart, yEnd - yStart);
  //console.log("drawGradientBackground", xStart, yStart, xEnd, yEnd);
}

function drawFrame() {
  dep = minCanvasSize / 30; // 바깥쪽 프레임 크기를 width, height 중 작은 것 기준으로 1/30로 설정
  innerDep = dep * 2; // 안쪽 프레임 크기를 바깥쪽 프레임의 2배로 설정

  // 액자 프레임 색상 설정 (검은색)
  mainLayer.noStroke();

  // 1) 바깥쪽 프레임 금속 재질 그라디언트
  for (let i = 0; i < dep; i++) {
    let inter = map(i, 0, dep, 10, 100); // 50, 150/10, 100  어두운 회색에서 밝은 회색으로 그라디언트
    mainLayer.fill(inter);

    // 위쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(i, i);
    mainLayer.vertex(width - i, i);
    mainLayer.vertex(width - dep, dep);
    mainLayer.vertex(dep, dep);
    mainLayer.endShape(CLOSE);

    // 아래쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(i, height - i);
    mainLayer.vertex(dep, height - dep);
    mainLayer.vertex(width - dep, height - dep);
    mainLayer.vertex(width - i, height - i);
    mainLayer.endShape(CLOSE);

    // 왼쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(i, i);
    mainLayer.vertex(dep, dep);
    mainLayer.vertex(dep, height - i);
    mainLayer.vertex(i, height - i);
    mainLayer.endShape(CLOSE);

    // 오른쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(width - i, i);
    mainLayer.vertex(width - dep, dep);
    mainLayer.vertex(width - dep, height - dep);
    mainLayer.vertex(width - i, height - i);
    mainLayer.endShape(CLOSE);
  }

  // 2) 안쪽 프레임 그라디언트
  for (let i = 0; i < innerDep; i++) {
    let inter = map(i, 0, innerDep, 255, 255); // 밝은 회색에서 어두운 회색으로 그라디언트
    mainLayer.fill(inter);

    // 위쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(dep + i, dep + i);
    mainLayer.vertex(width - dep - i, dep + i);
    mainLayer.vertex(width - dep - innerDep, dep + innerDep);
    mainLayer.vertex(dep + innerDep, dep + innerDep);
    mainLayer.endShape(CLOSE);

    // 아래쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(dep + i, height - dep - i);
    mainLayer.vertex(width - dep - i, height - dep - i);
    mainLayer.vertex(width - dep - innerDep, height - dep - innerDep);
    mainLayer.vertex(dep + innerDep, height - dep - innerDep);
    mainLayer.endShape(CLOSE);

    // 왼쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(dep + i, dep + i);
    mainLayer.vertex(dep + innerDep, dep + innerDep);
    mainLayer.vertex(dep + innerDep, height - dep - i);
    mainLayer.vertex(dep + i, height - dep - i);
    mainLayer.endShape(CLOSE);

    // 오른쪽 테두리
    mainLayer.beginShape();
    mainLayer.vertex(width - dep - i, dep + i);
    mainLayer.vertex(width - dep - innerDep, dep + innerDep);
    mainLayer.vertex(width - dep - innerDep, height - dep - i);
    mainLayer.vertex(width - dep - i, height - dep - i);
    mainLayer.endShape(CLOSE);
  }

  // 3) 프레임의 입체감을 위해 밝은 색상 추가 (바깥 프레임과 안쪽 프레임 사이)
  mainLayer.fill(200); // 밝은 회색으로 설정
  let brightPartWidth = dep * 0.1; // 밝은 부분의 폭을 결정하는 변수

  // 위쪽 테두리의 밝은 부분
  mainLayer.beginShape();
  mainLayer.vertex(dep, dep);
  mainLayer.vertex(width - dep, dep);
  mainLayer.vertex(width - dep - brightPartWidth, dep + brightPartWidth);
  mainLayer.vertex(dep + brightPartWidth, dep + brightPartWidth);
  mainLayer.endShape(CLOSE);

  // 아래쪽 테두리의 밝은 부분
  mainLayer.beginShape();
  mainLayer.vertex(dep, height - dep);
  mainLayer.vertex(width - dep, height - dep);
  mainLayer.vertex(width - dep - brightPartWidth, height - dep - brightPartWidth);
  mainLayer.vertex(dep + brightPartWidth, height - dep - brightPartWidth);
  mainLayer.endShape(CLOSE);

  // 왼쪽 테두리의 밝은 부분
  mainLayer.beginShape();
  mainLayer.vertex(dep, dep);
  mainLayer.vertex(dep + brightPartWidth, dep + brightPartWidth);
  mainLayer.vertex(dep + brightPartWidth, height - dep - brightPartWidth);
  mainLayer.vertex(dep, height - dep);
  mainLayer.endShape(CLOSE);

  // 오른쪽 테두리의 밝은 부분
  mainLayer.beginShape();
  mainLayer.vertex(width - dep, dep);
  mainLayer.vertex(width - dep - brightPartWidth, dep + brightPartWidth);
  mainLayer.vertex(width - dep - brightPartWidth, height - dep - brightPartWidth);
  mainLayer.vertex(width - dep, height - dep);
  mainLayer.endShape(CLOSE);
}

function drawSnowflakes() {
  // 새로운 눈송이 추가
  if (random(1) < 0.04) { // 확률을 0.1에서 0.05로 줄여 눈송이 생성 빈도를 낮춤
    snowflakes.push(new Snowflake());
  }
  //console.log("snowflake: ", snowflakes.length);

  for (let i = snowflakes.length - 1; i >= 0; i--) {
    let flake = snowflakes[i];
    flake.update();
    flake.display(snowLayer);
    if (flake.posY > height - dep || flake.posX < dep || flake.posX > width - dep) {
      snowflakes.splice(i, 1); // 화면 밖으로 나간 눈송이 삭제
    }
  }
}

class Snowflake {
  constructor() {
    this.posX = random(dep + innerDep, width - dep - innerDep);
    this.posY = dep + innerDep; // 위에서 시작
    this.size = random(2, 5);
    this.speed = random(0.1, 0.3); // 눈송이가 떨어지는 속도 0.3 ~ 0.5
    this.alpha = random(100, 255); // 투명도 설정
    this.wind = random(-0.07, 0.08); // 바람 효과
  }

  update() {
    this.posY += this.speed;
    this.posX += this.wind;
  }

  display(layer) {
    layer.fill(255, this.alpha);
    layer.noStroke();
    if (this.posY <= height - dep - innerDep && this.posX > dep + innerDep && this.posX <= width - 2 * dep - 2 * innerDep) {
      layer.ellipse(this.posX, this.posY, this.size);
    }
  }
}

function refreshSketch() {
  clear();
  // 랜덤 요소 초기화
  initializeRandomElements();
  drawGradientBackground();
  drawGradientMoon();
  drawGradientTree();
  drawFrame();
}

function clearSnowflakes() {
  // 눈송이 배열 초기화
  snowflakes = [];
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('myCanvas', 'png'); // 캔버스를 'myCanvas.png'로 저장
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}

function noScroll() {
  document.body.style.overflow = 'hidden';
}