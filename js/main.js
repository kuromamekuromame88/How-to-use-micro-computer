//トピックデータの形式
/*
{
  "topicname": [x, y, w, h, htmlText],
  ...
}
*/

//====================
// カメラ
//====================

const cam = {
  X: 0,
  Y: 0,
  zoom: 1,
  minZoom: 0.5,
  maxZoom: 3
};


//====================
// 要素取得
//====================

const title = document.querySelector(".title_start");

const MainContainer = document.querySelector(".MainContainer");

const grid = document.querySelector(".grid");

const world = document.querySelector(".world");

const UITab = document.querySelector(".UITab");


//====================
// ポインタ管理
//====================

const pointers = new Map();

let pinchDistance = null;

let lastX = 0;

let lastY = 0;


//====================
// カメラ制御
//====================

function setZoom(centerX, centerY, factor){

  const before = cam.zoom;
  cam.zoom *= factor;
  cam.zoom = Math.max(cam.minZoom, Math.min(cam.zoom, cam.maxZoom));

  const ratio = cam.zoom/before;

  cam.X = centerX - (centerX-cam.X)*ratio;
  cam.Y = centerY - (centerY-cam.Y)*ratio;
}


function updateCamera(){
  world.style.transform = `translate(${cam.X}px,${cam.Y}px) scale(${cam.zoom})`;

  //背景グリッド
  const cell = 32*cam.zoom;

  grid.style.backgroundPosition = `${cam.X%cell}px ${cam.Y%cell}px`;
  grid.style.backgroundSize = `${cell}px ${cell}px`;
}


//====================
// キーボード
//====================

document.addEventListener("keydown",(e)=>{
  console.log(e.key);
  switch(e.key){
    case "Up":
      cam.Y+=100;
      break; 
    case "Down":
      cam.Y-=100;
      break;
    case "Left":
      cam.x+=100;
      break;
    case "Right":
      cam.x-=100;
  } 
});


//====================
// ホイールズーム
//====================

document.addEventListener("wheel",(e)=>{
  e.preventDefault();
  setZoom(e.clientX, e.clientY, e.deltaY>0?0.9:1.1);
  updateCamera();
}, {passive:false});


//====================
// Pointer
//====================

MainContainer.addEventListener("pointerdown",(e)=>{

  pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});

  lastX=e.clientX;
  lastY=e.clientY;
  MainContainer.setPointerCapture(e.pointerId);
});


function removePointer(e){
  pointers.delete(e.pointerId);

  if(pointers.size<2) pinchDistance = null;
}


MainContainer.addEventListener("pointerup",(e)=>{
  removePointer(e);
  MainContainer.releasePointerCapture(e.pointerId);

});


MainContainer.addEventListener("pointercancel",(e)=>{

  removePointer(e);

  MainContainer.releasePointerCapture(e.pointerId);
});

MainContainer.addEventListener("pointermove",(e)=>{
  if(!pointers.has(e.pointerId)) return;

  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});

  //====================
  //2本指ズーム
  //====================
  if(pointers.size===2){
    const p = [...pointers.values()];
    const dx = p[1].x-p[0].x;
    const dy = p[1].y-p[0].y;
    const dist = Math.hypot(dx, dy);
    if(pinchDistance!==null){
      const cx=(p[0].x+p[1].x)/2;
      const cy=(p[0].y+p[1].y)/2;
      setZoom(cx, cy, dist/pinchDistance);
    }

    pinchDistance=dist;
    updateCamera();
    return;
  }
  //====================
  //1本指移動
  //====================

  if(pointers.size===1){
    cam.X += e.clientX-lastX;
    cam.Y += e.clientY-lastY;
    lastX=e.clientX;
    lastY=e.clientY;
    updateCamera();
  }
});


//====================
// トピック生成
//====================

function create_topic(x, y, w, h, ht){
  const topic = document.createElement("div");
  topic.classList.add("topic");
  topic.innerHTML = ht;
  topic.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
  world.appendChild(topic);

}


//====================
// トピック初期化
//====================

function init_container(topics){
  if(topics===null || typeof topics!=="object") return;

  for(const tdata of topics){
    const d = tdata[Object.keys(tdata)][1];
    create_topic(d[0], d[1], d[2], d[3], tdata[Object.keys(tdata)][0]);
  }
}


//====================
// フェードアウト
//====================

function feed_out(e){
  e.style.transition ="opacity 1s";
  e.style.opacity="0";
  setTimeout(()=>{
    e.style.display="none";
    MainContainer.style.display = "block";
  },1000);
}


//====================
// JSON読み込み
//====================
let topics = [];

async function getTopics(){
  const r = await fetch("./topics/topics_name.json");

  const res=await r.json();

  if(typeof res!=="object") return {};

  for(const tdata of res.topics){
    const tr=await fetch(`./topics/topicsData/${Object.keys(tdata)}.html`);
    topics.push({[Object.keys(tdata)]: [await tr.text(), tdata[Object.keys(tdata)]]});
  }

  return topics;
}


//====================
// タイトル画面
//====================

function title_patch(){
  title.addEventListener("click", async()=>{
      feed_out(title);

      const topics=await getTopics();

      init_container(topics);

      cam.X=window.innerWidth/2;
      cam.Y=window.innerHeight/2;

      updateCamera();
    }
  );
}


//====================
// 起動
//====================

title_patch();

MainContainer.style.display ="none";