
//トピックデータの形式
/*
{
  "topicname": [x, y, w, h, htmlText],
  ...
}
*/

var cam = {
  X:0,
  Y:0,
  zoom:1,
};

//タイトル
const title = document.getElementsByClassName("title_start")[0];

//メイン画面
const MainContainer = document.getElementsByClassName("MainContainer")[0];

//グリッド
const grid = document.getElementsByClassName("grid")[0];

//トピック表示
const world =  document.getElementsByClassName("world")[0];

//その他の操作インターフェースなど
const UITab = document.getElementsByClassName("UITab")[0];



//ユーザーの操作管理
document.addEventListener("keydown", (e)=>{
  console.log(e.key);
});


//マウスでのズーム操作管理
document.addEventListener("wheel",(e)=>{
  e.preventDefault();

  const mx = e.clientX;
  const my = e.clientY;
  const before = cam.zoom;

  if(e.deltaY>0){
    cam.zoom*=0.9;
  }else{
    cam.zoom*=1.1;
  }
  cam.zoom = Math.max(0.5,Math.min(cam.zoom,3));

  const ratio = cam.zoom/before;

  cam.X = mx - (mx-cam.X)*ratio;
  cam.Y = my - (my-cam.Y)*ratio;

  updateCamera();
});
//タッチパネルでのズーム管理
const pointers = new Map();


var startX, startY;//タッチ開始点
var moving = false;
MainContainer.addEventListener("pointerdown", (e)=>{
  pointers.set(e.pointerId,{x:e.clientX, y:e.clientY});

  moving = true;
  startX = e.clientX;
  startY = e.clientY;
  MainContainer.setPointerCapture(
    e.pointerId
  );
});

function removePointer(e){
  pointers.delete(e.pointerId);
}

MainContainer.addEventListener("pointerup", (e)=>{
  moving = false;
  removePointer(e);
  MainContainer.releasePointerCapture(
    e.pointerId
  );
});
MainContainer.addEventListener("pointercancel",(e)=>{
  moving = false;
  removePointer(e);
  MainContainer.releasePointerCapture(
    e.pointerId
  );
});


let pinchDistance = null;
let dragPointerId = null;
MainContainer.addEventListener("pointermove", (e)=>{
  
  if(!pointers.has(e.pointerId))return;
  pointers.set(e.pointerId, {
    x:e.clientX,
    y:e.clientY
  });

  if(!moving) return;

  if(pointers.size === 1){
    dragPointerId = e.pointerId;
    if(pointers.size === 1 && e.pointerId === dragPointerId){
    cam.X += e.clientX-startX;
    cam.Y += e.clientY-startY;
    startX=e.clientX;
    startY=e.clientY;
    }
  }

  //タッチ画面用
  if(pointers.size == 2){
    const p = [...pointers.values()];
    const dx = p[1].x-p[0].x;
    const dy = p[1].y-p[0].y;
    const dist = Math.hypot(dx, dy);
    const before = cam.zoom;
    
    if(pinchDistance!== null){
      cam.zoom *= dist / pinchDistance;

      cam.zoom = Math.max(0.5, Math.min(cam.zoom, 3));
    }
    pinchDistance=dist;

    
    const cx = (p[0].x+p[1].x)/2;
    const cy = (p[0].y+p[1].y)/2;
    const ratio = cam.zoom/before;
    cam.X = cx - (cx-cam.X)*ratio;
    cam.Y = cy - (cy-cam.Y)*ratio;

    updateCamera();
    return;
  }

  //共通画面移動処理
  cam.X += e.clientX - startX;
  cam.Y += e.clientY - startY;
  startX = e.clientX;
  startY = e.clientY;
  updateCamera();
});

//表示関数
function updateCamera(){
  world.style.transform =`translate(${cam.X}px,${cam.Y}px) scale(${cam.zoom})`;

  grid.style.backgroundPosition = `${cam.X}px ${cam.Y}px`;
  grid.style.backgroundSize = `${32*cam.zoom}px ${32*cam.zoom}px`;
}

//ここらへんの管理機能は後に修正
//トピックを表示する2次元コンテナ
function create_topic(x, y, w, h, ht){
  const ifr = document.createElement("div");
  ifr.classList.add("topic");
  ifr.innerHTML = ht;

  world.appendChild(ifr);
  ifr.setAttribute("style", `width:${w}px;height:${h}px;left:${x}px;top:${y}px;position:absolute;`);
};

function init_container(topics){
  if(topics === null || typeof topics != "object") return;

  //topics = JSON.parse(topics);
  const topicsname = Object.keys(topics);
  topicsname.forEach((e,i)=>{
    var np = topics[e];
    create_topic(np[0], np[1], np[2], np[3], np[4]);
  });
}

//フェードアウト
function feed_out(e){
  e.style.opacity = "1";
  e.style.transition = "opacity 1s ease-in-out";
  e.style.opacity = "0";
  
  setTimeout(()=>{
    e.style.display = "none";//イベントを拾わないように完全に非表示
    MainContainer.style.display = "block";

  }, 1000);
}

async function a(){
  const a = await getTopics();
  console.log(a);
}

async function getTopics(){
  const r = await fetch("./topics/topics_name.json");
  const res = await r.json();
  if((typeof res) != "object") return;
  let count=0;
  let topics = {};
  while(count<res["topics"].length){
    const tr = await fetch(`./topics/topicsData/${res.topics[count]}.topic`);//実態はJSON文字列
    const td = await tr.json();
    if(td === null || typeof td !== "object") return;
    topics[res.topics[count]] = td["data"];
    count++;
  }
  return topics;
}

function title_patch(){
  title.addEventListener("click", async()=>{
    const title = document.getElementsByClassName("title_start")[0];
    
    feed_out(title);
    
    const topics = await getTopics();
    
    init_container(topics);

    cam.X = window.innerWidth/2;
    cam.Y = window.innerHeight/2;
    updateCamera();//原点を中央に
  });
}


title_patch();
MainContainer.style.display = "none";