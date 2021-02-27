const canvas = document.getElementById("JsCanvas");
const ctx = canvas.getContext("2d");
const canvasSize = 650;
const defaultColor= "white";
const canvasImage = ctx.createImageData(canvasSize, canvasSize);
const colors = document.getElementsByClassName("JsColor");
const range = document.getElementById("JsRange");
const mode = document.getElementById("JsMode");
const reDo = document.getElementById("reDo");
const unDo = document.getElementById("unDo");
const saveBtn = document.getElementById("JsSave");
const colorConceptOp = document.getElementById("colorConceptOp");
const reset = document.getElementById("JsReset");
const colorConcept = {
    primary : document.getElementById("primary"),
    pastel : document.getElementById("pastel"),
    spring : document.getElementById("spring"),
    summer : document.getElementById("summer"),
    fall : document.getElementById("fall"),
    winter : document.getElementById("winter")
};

canvas.width = canvasSize;
canvas.height = canvasSize; //캔버스 크기 지정

ctx.fillStyle = defaultColor;
ctx.fillRect(0, 0, canvasSize, canvasSize);
ctx.strokeStyle = defaultColor;
ctx.lineWidth = 2.5;

let painting = false; //기본 설정은 그림을 그리지 않음(false)
let filling = false;

function handleSaveClick(){
    const image = canvas.toDataURL("image");
    const link = document.createElement("a");

    link.href = image;
    link.download = "PaintJS[🎨]";
    link.click();
}

function handleModeClick(){
    
    if(filling === true){
        filling = false;
        mode.innerText = "Fill";
        canvas.classList.add("cursor_brush"); //
        canvas.classList.remove("cursor_paint");
        mode.title = "Fill up your canvas";
    }
    else{
        filling = true;
        mode.innerText = "Paint";
        canvas.classList.add("cursor_paint");
        canvas.classList.remove("cursor_brush");
        mode.title = "";
    }
}

function handleRangeChange(event){
    const size = event.target.value;
    ctx.lineWidth = size;
}

function stopPainting(){
    
    painting = false;
}

function startPainting(){

    painting = true;
}

function onMouseMove(event){
    const x = event.offsetX;
    const y = event.offsetY;

    if(!painting){
        ctx.beginPath(); //path를 만듬
        ctx.moveTo(x, y); //마우스의 x, y 좌표로 path의 시작점을 옮김
    }
    else{
        ctx.lineTo(x, y); //path의 직전 위치에서(moveTo(x, y)) 지금 위치까지 획을 그음
        ctx.stroke(); // 클릭을 하면 painting 값이 true로 바뀌며 storke 함수 실행(현재의 sub)

    }
}

function onMouseDown(){
   
    painting = true;
} //마우스를 누르면 그림을 그림

function onMouseUp(event){
    
    stopPainting();
} //마우스를 누르지 않았을 때 그림을 그리지 않음, stopPainting 함수 실행


function handleColorClick(event){
        const color = event.target.style.backgroundColor;

        ctx.strokeStyle = color;
        ctx.fillStyle = ctx.strokeStyle;

} // 클릭한 색의 background 요소로 선 색을 바꾸어줍니다


function handleCanvasClick(){
    
    if(filling){
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    }
}

function resetCanvas(){
    const currentColor = ctx.fillStyle;
    
    ctx.fillStyle = defaultColor;
    ctx.fillRect(0, 0, canvasSize, canvasSize);
    ctx.fillStyle = currentColor;
}

function handleRightClick(event){
    event.preventDefault();
}

function handleDisplay(){
    
    for(keys in colorConcept){
        if(colorConceptOp.value === colorConcept[keys].id){
            colorConcept[keys].style.display ="flex";
        }
        else{
            colorConcept[keys].style.display ="none";
        }
    }
} //선택한 옵션의 색 이외에는 보이지 않습니다

if(canvas){
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting); //마우스를 클릭했을 때의 이벤트
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting); // 마우스가 캔버스를 벗어나면 클릭 상태와 상관 없이 그림 그리기를 멈춥니다
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleRightClick);
}

Array.from(colors).forEach(color => color.addEventListener("click", handleColorClick));
//colors 객체를 배열로 만들고 배열의 각각의 요소에 대해 이벤트를 삽입합니다. 각각의 요소를 클릭할 때 마다 handleColorClick 함수 실행

if(range){
    range.addEventListener("input", handleRangeChange)
}

if(mode){
    mode.addEventListener("click", handleModeClick);
}

if(saveBtn){
    saveBtn.addEventListener("click", handleSaveClick);
}

if(reset){
    reset.addEventListener("click", resetCanvas);
}

colorConceptOp.addEventListener("change", handleDisplay); //colorConceptOp의 입력값이 바뀔 때 마다 handleDisplay 함수를 실행합니다

if(reDo){
    reDo.addEventListener("click", handleReDo);
}

if(unDo){
    unDo.addEventListener("click", handleUnDo);
}