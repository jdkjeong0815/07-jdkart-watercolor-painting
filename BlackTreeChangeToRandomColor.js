let imgs = [];
let img;
let randomColor, randomColor2;
let shadowColor; // 회색 + 투명도
let shadowThickness; // 테두리 두께의 10% (5px)
let scaleFactor = 1; // 나무 이미지를 줄일 비율
let groundHeight = 100; // 땅의 높이
let snowflakes = []; // 눈송이 배열
let dep = 30; // 테두리 두께 50px
let innerDep = 80; // 안쪽 프레임 두께 설정

function preload() {
  // 나무 이미지를 로드합니다.
  for (let i = 0; i <= 38; i++) {
    imgs[i] = loadImage(`assets/dead-tree-silhouette-${i}.png`);
  }
}

function setup() {
 
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.getContext('2d', { willReadFrequently: true });
 
  noScroll(); // 스크롤 금지. 스크롤바 생기는 것 방지
  //background(255, 0,0);
  
  // 랜덤 색상 생성
  randomColor = [random(185), random(185), random(185)];
  //print(randomColor[0], randomColor[1], randomColor[2]);
  randomColor2 = [randomColor[0]-35, randomColor[1]-35, randomColor[2]-35];
  
  // 그림자 색상 설정 (회색)
  shadowColor = color(20, 20, 20, 220); // 회색 + 투명도
  shadowThickness = dep * 0.46; // 테두리 두께의 10% (5px)

  // 눈송이 배열 초기화
  //snowflakes = [];

  drawGradientBackground();
  drawGradientMoon(width / 2, height / 3, 100);
  drawGradientTree();
  drawFrame(width, height, dep, innerDep);

  // 60초마다 자동 갱신
  setInterval(refreshSketch, 60000);
}

function draw() {
  // 1) 배경 그리기
  // background(0); // 배경을 매 프레임마다 지우기
  // drawGradientBackground();

  // 2) 달 그리기
  // drawGradientMoon(width / 2, height / 3, 100);

  // 3) 나무 이미지 그리기
  // drawGradientTree();

  // 4) 땅 그리기
  // drawGradientGround(groundHeight);

  // 5) 프레임 테두리 그리기
  // drawFrame(width, height, dep);

}  // END draw() ========================================== 

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
      //print(r, g, b, a);

      // 완전히 검은색인 픽셀을 확인 (r, g, b 값이 모두 0)
      if (a > 0 && r < 50 && g < 50 && b < 50) {
        //img.pixels[index] = randomColor[0];     // R 값
        //img.pixels[index + 1] = randomColor[1]; // G 값
        //img.pixels[index + 2] = randomColor[2]; // B 값
        // a 값은 그대로 둡니다 (투명도 유지)
        
        let interDK = map(x, 0, img.width, 0.9, 0);
        let cDK = lerpColor(color(0, 0, 0), color(randomColor), interDK);
        
        img.pixels[index + 0] = red(cDK);
        img.pixels[index + 1] = green(cDK);
        img.pixels[index + 2] = blue(cDK);
      }
    }
  }

  // 변경된 픽셀 데이터를 업데이트합니다.
  img.updatePixels();

  // 이미지 축소
  let newHeight = (height - 2 * (dep + innerDep)) * 4 / 5;
  let newWidth = img.width * (newHeight / img.height);
  img.resize(newWidth, newHeight);

  console.log("width: " + width + ", height: " + height, ", img.width: " + img.width + ", img.height: " + img.height, scaleFactor);
  // 이미지를 캔버스에 그립니다.
  image(img, (width - newWidth) / 2, height - newHeight - dep - innerDep + 20);
}

function drawGradientMoon(x, y, size) {
  // 달의 위치 계산 (top까지 범위 확장)
  let moonX = random(size + dep + innerDep, width - size - dep - innerDep);
  let moonY = random(size + dep + innerDep, (height / 3) - dep - innerDep);
  let moonSize = random(30, 80); // 달의 크기 변수
  
  // 노란색 그라디언트 달 그리기
  let ccc = random(104, 204);
  for (let r = moonSize; r > 0; --r) {
    let inter = map(r, 0, moonSize, 0, 1);
  
    let c = lerpColor(color(255, 255, 0), color(255, ccc, 0), inter);
    //let c = lerpColor(color(255, ccc, 0), color(255, 255, 0), inter);
    fill(c);
    noStroke();
    ellipse(moonX, moonY, r * 2, r * 2);
  }

  // 안개 효과 추가
  drawingContext.filter = 'blur(15px)';
  for (let i = 0; i < 10; i++) {
    let fogColor = color(255, 255, 255, 20);
    fill(fogColor);
    ellipse(moonX + random(-20, 20), moonY + random(-20, 20), moonSize * 2.5, moonSize * 2.5);
  }
  drawingContext.filter = 'none';
}

function drawGradientBackground() {
  let direction = random([0, 1, 2, 3]); // 0: top-bottom, 1: bottom-top, 2: left-right, 3: right-left
  let c1 = color(random(255), random(255), random(255));
  //let c2 = color(random(255, 255, random(255)));
  let c2 = color(random(255), random(255), random(255));

  let xStart = dep + innerDep;
  let yStart = dep + innerDep;
  let xEnd = width - dep - innerDep;
  let yEnd = height - dep - innerDep;

  for (let i = yStart; i <= yEnd; i++) {
    let inter = map(i, yStart, yEnd, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    if (direction === 0) {
      line(xStart, i, xEnd, i);
    } else if (direction === 1) {
      line(xStart, yEnd - (i - yStart), xEnd, yEnd - (i - yStart));
    } else if (direction === 2) {
      line(i, yStart, i, yEnd);
    } else if (direction === 3) {
      line(xEnd - (i - xStart), yStart, xEnd - (i - xStart), yEnd);
    }
  }
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

function drawSnowflakes() {
  // 새로운 눈송이 추가
  if (random(1) < 0.1) {
    snowflakes.push(new Snowflake());
  }

  for (let i = snowflakes.length - 1; i >= 0; i--) {
    let flake = snowflakes[i];
    //flake.update();
    flake.display();
    // if (flake.posY > height - dep || flake.posX < dep || flake.posX > width - dep) {
    //   snowflakes.splice(i, 1); // 화면 밖으로 나간 눈송이 삭제
    // }
  }
}

function drawFrame(width, height, dep, innerDep) {
  // 액자 프레임 색상 설정 (검은색)
  noStroke();

  // 바깥쪽 프레임 금속 재질 그라디언트
  for (let i = 0; i < dep; i++) {
    let inter = map(i, 0, dep, 10, 100); // 50, 150 어두운 회색에서 밝은 회색으로 그라디언트
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

class Snowflake {
  constructor() {
    this.posX = random(dep, width - dep);
    this.posY = random(-50, 0); // 위에서 시작
    this.size = random(2, 5);
    this.speed = random(1, 3);
    this.alpha = random(100, 255); // 투명도 설정
    this.wind = random(-0.5, 0.5); // 바람 효과
  }

  update() {
    this.posY += this.speed;
    this.posX += this.wind;
  }

  display() {
    fill(255, this.alpha);
    noStroke();
    ellipse(this.posX, this.posY, this.size);
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
