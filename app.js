const canvas = document.getElementById("JsCanvas");
const ctx = canvas.getContext("2d");
const canvasSize = 600;
const defaultColor = "white";
const InitialImage = ctx.getImageData(0, 0, canvasSize, canvasSize);
const colors = document.getElementsByClassName("JsColor");
const range = document.getElementById("JsRange");
const mode = document.getElementById("JsMode");
const reDo = document.getElementById("JsReDo");
const unDo = document.getElementById("JsUnDo");
const save = document.getElementById("JsSave");
const colorConceptOp = document.getElementById("colorConceptOp");
const reset = document.getElementById("JsReset");
const colorConcept = {
  primary: document.getElementById("primary"),
  pastel: document.getElementById("pastel"),
  spring: document.getElementById("spring"),
  summer: document.getElementById("summer"),
  fall: document.getElementById("fall"),
  winter: document.getElementById("winter"),
};
let processArray = [InitialImage];
let currentIndex = 0;
let currentCanvas = processArray[currentIndex];
let painting = false; //기본 설정은 그림을 그리지 않음(false)
let filling = false;

canvas.width = canvasSize;
canvas.height = canvasSize; //캔버스 크기 지정

ctx.fillStyle = defaultColor;
ctx.strokeStyle = defaultColor;
ctx.fillRect(0, 0, canvasSize, canvasSize);
ctx.lineWidth = 2.5;

function pushToArray() {
  if (currentIndex !== processArray.length - 1) {
    processArray.splice(currentIndex + 1);
  } //현재 그림이 가장 최근에 입력된 그림이 아니라면 배열을 수정합니다

  if (processArray.length === 5) {
    processArray.shift();
  } //배열의 길이가 5가 초과되면 가장 오래된 요소를 삭제합니다(배열 길이 유지)

  processArray.push(ctx.getImageData(0, 0, canvasSize, canvasSize));
  currentIndex = processArray.length - 1;
  currentCanvas = processArray[currentIndex];
  handleControlButtonsStatement(reDo, true);
}

function startPainting() {
  painting = true;
}

function stopPainting() {
  painting = false;
}

function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;

  if (!painting) {
    ctx.beginPath(); //path를 만듬
    ctx.moveTo(x, y); //마우스의 x, y 좌표로 path의 시작점을 옮김
  } else {
    ctx.lineTo(x, y); //path의 직전 위치에서(moveTo(x, y)) 지금 위치까지 획을 그음
    ctx.stroke(); // 클릭을 하면 painting 값이 true로 바뀌며 storke 함수 실행(현재의 sub)
  }
}

function onMouseDown() {
  painting = true;
} //마우스를 누르면 그림을 그림

function onMouseUp(event) {
  stopPainting();
} //마우스를 누르지 않았을 때 그림을 그리기를 멈추고 stopPainting 함수 실행합니다.

function handleCanvasClick() {
  if (filling) {
    ctx.fillRect(0, 0, canvasSize, canvasSize);
  }

  pushToArray();
  handleControlButtonsStatement(unDo, false);
  handleControlButtonsStatement(reset, false);
} //그림을 그리면 그 과정을 배열에 담습니다

function handleRightClick(event) {
  event.preventDefault();
}

function handleRangeChange(event) {
  const size = event.target.value;
  ctx.lineWidth = size;
}

function handleModeClick() {
  if (filling === true) {
    filling = false;
    mode.innerText = "Fill";
    canvas.classList.remove("cursor_paint");
    mode.title = "Fill up your canvas";
  } else {
    filling = true;
    mode.innerText = "Paint";
    canvas.classList.add("cursor_paint");
    mode.title = "";
  }
}

function handleUnDo() {
  currentIndex -= 1;
  currentCanvas = processArray[currentIndex];
  handleControlButtonsStatement(reDo, false);

  if (currentIndex === 0) {
    handleControlButtonsStatement(unDo, true);
  } //배열의 가장 첫 번째 요소에 도달하면 undo 버튼을 비활성화합니다

  ctx.putImageData(currentCanvas, 0, 0);
}

function handleReDo() {
  currentIndex += 1;
  currentCanvas = processArray[currentIndex];
  handleControlButtonsStatement(unDo, false);

  if (currentIndex === processArray.length - 1) {
    handleControlButtonsStatement(reDo, true);
  } //배열의 가장 마지막 요소에 도달하면 redo 버튼을 비활성화합니다

  ctx.putImageData(currentCanvas, 0, 0); // ctx에 Index 값에 맞는 currentCanvas를 덮어씌웁니다.
}

function handleControlButtonsStatement(button, state) {
  if (state) {
    button.classList.add("button_disabled");
    button.disabled = state;
  } else {
    button.classList.remove("button_disabled");
    button.disabled = state;
  }
}

function resetCanvas() {
  ctx.putImageData(InitialImage, 0, 0);
  processArray = [InitialImage];
  currentIndex = 0;

  handleControlButtonsStatement(unDo, true);
  handleControlButtonsStatement(reDo, true);
  handleControlButtonsStatement(reset, true);
}

function handleSaveClick() {
  const image = canvas.toDataURL("image");
  const link = document.createElement("a");

  link.href = image;
  link.download = "PaintJS[🎨]";
  link.click();
}

function handleDisplay() {
  for (keys in colorConcept) {
    if (colorConceptOp.value === colorConcept[keys].id) {
      colorConcept[keys].style.display = "flex";
    } else {
      colorConcept[keys].style.display = "none";
    }
  }
} //선택한 옵션의 색 이외에는 보이지 않습니다

function handleColorClick(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
} // 클릭한 색의 background 요소로 선 색을 바꾸어줍니다

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting); //마우스를 클릭했을 때의 이벤트
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting); // 마우스가 캔버스를 벗어나면 클릭 상태와 상관 없이 그림 그리기를 멈춥니다
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", handleRightClick);
}

if (range) {
  range.addEventListener("input", handleRangeChange);
}

if (mode) {
  mode.addEventListener("click", handleModeClick);
}

if (reDo) {
  reDo.addEventListener("click", handleReDo);
}

if (unDo) {
  unDo.addEventListener("click", handleUnDo);
}

if (reset) {
  reset.addEventListener("click", resetCanvas);
}

if (save) {
  save.addEventListener("click", handleSaveClick);
}

colorConceptOp.addEventListener("change", handleDisplay); //colorConceptOp의 입력값이 바뀔 때 마다 handleDisplay 함수를 실행합니다

Array.from(colors).forEach((color) =>
  color.addEventListener("click", handleColorClick)
);
//colors 객체를 배열로 만들고 배열의 각각의 요소에 대해 이벤트를 삽입합니다. 각각의 요소를 클릭할 때 마다 handleColorClick 함수 실행
