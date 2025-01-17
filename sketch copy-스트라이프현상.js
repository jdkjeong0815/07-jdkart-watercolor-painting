let imgs = [];
let img;

let scaleFactor = 1; // 나무 이미지를 줄일 비율
let groundHeight = 100; // 땅의 높이
let snowflakes = []; // 눈송이 배열
let dep = 30; // 테두리 두께 50px
let innerDep = 80; // 안쪽 프레임 두께 설정

let mainLayer, snowLayer;
let randomElements = {};

function preload() {
  // 나무 이미지를 로드합니다.
  for (let i = 0; i <= 7; i++) {
    imgs[i] = loadImage(`assets/수채화-dead-tree-silhouette-${i}.png`);
  }
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.getContext('2d', { willReadFrequently: true });

  // 레이어 생성
  mainLayer = createGraphics(width, height);
  snowLayer = createGraphics(width, height); // 별도의 레이어 생성
  
  snowflakes = [];
  frameRate(60); // 프레임 레이트 설정
 
  noScroll(); // 스크롤 금지. 스크롤바 생기는 것 방지

  // 랜덤 요소 초기화
  initializeRandomElements();

  drawGradientBackground();
  drawGradientMoon(width / 2, height / 3, 100);
  drawGradientTree();
  drawFrame(width, height, dep, innerDep);
  
  // 60초마다 자동 갱신
  setInterval(refreshSketch, 60000);
}

function draw() {
  // 눈송이를 그리는 레이어
  snowLayer.clear(); // 이전 프레임 지우기
  drawSnowflakes();
  image(mainLayer, 0, 0); // 메인 레이어를 메인 캔버스 위에 덮어씀
  image(snowLayer, 0, 0); // 눈 레이어를 메인 캔버스 위에 덮어씀
}

function initializeRandomElements() {
  randomElements.backgroundColor1 = color(random(255), random(255), random(255));
  randomElements.backgroundColor2 = color(random(255), random(255), random(255));
  randomElements.moonColor = random(104, 204);
  randomElements.treeColor = random([color(0, 0, 0), color(255, 255, 255)]);
  randomElements.moonSize = random(30, 50);
  randomElements.moonX = random(randomElements.moonSize + dep + innerDep, width - 30 - dep - innerDep);
  randomElements.moonY = random(dep + innerDep + randomElements.moonSize * 1.5, dep + innerDep + randomElements.moonSize * 3.5);
  console.log(randomElements.moonY);
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

function drawGradientMoon(x, y, size) {
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

  mainLayer.noStroke(); // Remove stroke for smooth rectangles

  if (direction === 0 || direction === 1) { // Vertical gradient
    let step = ceil((yEnd - yStart) / 100); // Divide into steps for smoothness
    for (let y = yStart; y <= yEnd; y += step) {
      let inter = map(y, yStart, yEnd, 0, 1);
      let c = lerpColor(c1, c2, inter);
      mainLayer.fill(c);
      mainLayer.rect(xStart, y, xEnd - xStart, step); // Draw horizontal stripe
    }
  } else if (direction === 2 || direction === 3) { // Horizontal gradient
    let step = (xEnd - xStart) / 100; // Divide into steps for smoothness
    for (let x = xStart; x <= xEnd; x += step) {
      let inter = map(x, xStart, xEnd, 0, 1);
      let c = lerpColor(c1, c2, inter);
      mainLayer.fill(c);
      mainLayer.rect(x, yStart, step, yEnd - yStart); // Draw vertical stripe
    }
  }
}

function drawFrame(width, height, dep, innerDep) {
  // 액자 프레임 색상 설정 (검은색)
  noStroke();

  // 바깥쪽 프레임 금속 재질 그라디언트
  for (let i = 0; i < dep; i++) {
    let inter = map(i, 0, dep, 10, 100); // 50, 150/10, 100  어두운 회색에서 밝은 회색으로 그라디언트
    fill(inter);

    // 위쪽 테두리
    beginShape();
    vertex(i, i);
    vertex(width - i, i);
    vertex(width - dep, dep);
    vertex(dep, dep);
    endShape(CLOSE);

    // 아래쪽 테두리
    beginShape();
    vertex(i, height - i);
    vertex(dep, height - dep);
    vertex(width - dep, height - dep);
    vertex(width - i, height - i);
    endShape(CLOSE);

    // 왼쪽 테두리
    beginShape();
    vertex(i, i);
    vertex(dep, dep);
    vertex(dep, height - i);
    vertex(i, height - i);
    endShape(CLOSE);

    // 오른쪽 테두리
    beginShape();
    vertex(width - i, i);
    vertex(width - dep, dep);
    vertex(width - dep, height - dep);
    vertex(width - i, height - i);
    endShape(CLOSE);
  }

  // 안쪽 프레임 그라디언트
  for (let i = 0; i < innerDep; i++) {
    let inter = map(i, 0, innerDep, 255, 245); // 밝은 회색에서 어두운 회색으로 그라디언트
    fill(inter);

    // 위쪽 테두리
    beginShape();
    vertex(dep + i, dep + i);
    vertex(width - dep - i, dep + i);
    vertex(width - dep - innerDep, dep + innerDep);
    vertex(dep + innerDep, dep + innerDep);
    endShape(CLOSE);

    // 아래쪽 테두리
    beginShape();
    vertex(dep + i, height - dep - i);
    vertex(width - dep - i, height - dep - i);
    vertex(width - dep - innerDep, height - dep - innerDep);
    vertex(dep + innerDep, height - dep - innerDep);
    endShape(CLOSE);

    // 왼쪽 테두리
    beginShape();
    vertex(dep + i, dep + i);
    vertex(dep + innerDep, dep + innerDep);
    vertex(dep + innerDep, height - dep - i);
    vertex(dep + i, height - dep - i);
    endShape(CLOSE);

    // 오른쪽 테두리
    beginShape();
    vertex(width - dep - i, dep + i);
    vertex(width - dep - innerDep, dep + innerDep);
    vertex(width - dep - innerDep, height - dep - i);
    vertex(width - dep - i, height - dep - i);
    endShape(CLOSE);
  }

  // 프레임의 입체감을 위해 밝은 색상 추가
  fill(200); // 밝은 회색으로 설정
  let brightPartWidth = dep * 0.2; // 밝은 부분의 폭을 결정하는 변수

  // 위쪽 테두리의 밝은 부분
  beginShape();
  vertex(dep, dep);
  vertex(width - dep, dep);
  vertex(width - dep - brightPartWidth, dep + brightPartWidth);
  vertex(dep + brightPartWidth, dep + brightPartWidth);
  endShape(CLOSE);

  // 아래쪽 테두리의 밝은 부분
  beginShape();
  vertex(dep, height - dep);
  vertex(width - dep, height - dep);
  vertex(width - dep - brightPartWidth, height - dep - brightPartWidth);
  vertex(dep + brightPartWidth, height - dep - brightPartWidth);
  endShape(CLOSE);

  // 왼쪽 테두리의 밝은 부분
  beginShape();
  vertex(dep, dep);
  vertex(dep + brightPartWidth, dep + brightPartWidth);
  vertex(dep + brightPartWidth, height - dep - brightPartWidth);
  vertex(dep, height - dep);
  endShape(CLOSE);

  // 오른쪽 테두리의 밝은 부분
  beginShape();
  vertex(width - dep, dep);
  vertex(width - dep - brightPartWidth, dep + brightPartWidth);
  vertex(width - dep - brightPartWidth, height - dep - brightPartWidth);
  vertex(width - dep, height - dep);
  endShape(CLOSE);
}

function drawSnowflakes() {
  // 새로운 눈송이 추가
  if (random(1) < 0.1) {
    snowflakes.push(new Snowflake());
  }

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
    this.speed = random(0.3, 0.5); // 눈송이가 떨어지는 속도 0.3 ~ 0.5
    this.alpha = random(100, 255); // 투명도 설정
    this.wind = random(-0.5, 0.5); // 바람 효과
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
  drawGradientBackground();
  drawGradientMoon(width / 2, height / 3, 100);
  drawGradientTree();
  drawFrame(width, height, dep, innerDep);
  //snowflakes = []; // 눈송이 배열 초기화
}

function clearSnowflakes() {
  // 눈송이 배열 초기화
  snowflakes = [];
}

// 키보드 입력 감지 함수
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