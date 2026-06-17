
//トピックデータの形式
/*
[
  [x, y, w, h, htmlText],
  ...
]
*/

var cam = {
  X:0,
  Y:0,
  zoom:1,
};

//メイン画面
const MainContainer = document.getElementsByClassName("MainContainer")[0];

//トピック表示
const world =  document.getElementsByClassName("world")[0];

//その他の操作インターフェースなど
const UITab = document.getElementsByClassName("UITab")[0];



//ユーザーの操作管理
MainContainer.addEventListener("keydown", (e)=>{
  console.log(e.key);
});

MainContainer.addEventListener("wheel",(e)=>{
  e.preventDefault();
  if(e.deltaY>0){
    cam.zoom *= 0.9;
  }
  else{
    cam.zoom *= 1.1;
  }
  updateCamera();
});

var startX, startY;//タッチ開始点
var moving = false;
MainContainer.addEventListener("pointerdown", (e)=>{
  moving = true;
  startX = e.clientX;
  startY = e.clientY;
  MainContainer.setPointerCapture(
    e.pointerId
  );
});
MainContainer.addEventListener("pointerup", (e)=>{
  moving = false;
  MainContainer.releasePointerCapture(
    e.pointerId
  );
});
MainContainer.addEventListener("pointercancel",(e)=>{
  moving = false;
  MainContainer.releasePointerCapture(
    e.pointerId
  );
});

MainContainer.addEventListener("pointermove", (e)=>{
  if(!moving) return;
  cam.X += e.clientX - startX;
  cam.Y += e.clientY - startY;
  startX = e.clientX;
  startY = e.clientY;
  updateCamera();
});

//表示関数
function updateCamera(){
  world.style.transform =`translate(${cam.X}px,${cam.Y}px) scale(${cam.zoom})`;
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
  if(typeof topics != "object") return;

  topics.forEach((e,i)=>{
    create_topic(e[0], e[1], e[2], e[3], e[4]);
  });
}

//フェードアウト
function feed_out(e){
  e.style.opacity = "1";
  e.style.transition = "opacity 1s ease-in-out";
  e.style.opacity = "0";
  setTimeout(()=>{
    e.style.display = "none";//イベントを拾わないように完全に非表示
  }, 1000);
}

function title_patch(){
  const title = document.getElementsByClassName("title_start")[0];
  title.addEventListener("click", ()=>{
    const title = document.getElementsByClassName("title_start")[0];
    feed_out(title);
    init_container([[0,0,200,100,"<pre>マイコンとは</pre>"]]);

    cam.X = window.innerWidth/2;
    cam.Y = window.innerHeight/2;
    updateCamera();//原点を中央に
  });
}


title_patch();