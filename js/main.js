
//トピックデータの形式
/*
[
  [x, y, w, h, htmlText],
  ...
]
*/

var cameraX = 0;
var cameraY = 0;

//メイン画面
const MainContainer = document.getElementsByClassName("MainContainer")[0];

//トピック表示
const world =  document.getElementsByClassName("world")[0];

//その他の操作インターフェースなど
const UITab = document.getElementsByClassName("UITab")[0];



//ユーザーの操作管理
world.addEventListener("keydown", (e)=>{
  console.log(e.key);
});

var startX, startY;//タッチ開始点
var moving = false;
world.addEventListener("pointerdown", (e)=>{
  moving = true;
  startX = e.clientX;
  startY = e.clientY;
  MainContainer.setPointerCapture(
    e.pointerId
  );
});
world.addEventListener("pointerup", ()=>{
  moving = false;
  MainContainer.releasePointerCapture(
    e.pointerId
  );
});
world.addEventListener("pointercancel",()=>{
    moving = false;
  }
);
const l = document.getElementById("logp");
world.addEventListener("pointermove", (e)=>{
  if(!moving) return;
  cameraX += e.clientX - startX;
  cameraY += e.clientY - startY;
  l.innerText = `mX: ${cameraX}, mY: ${cameraY}`;
});


//ここらへんの管理機能は後に修正
//トピックを表示する2次元コンテナ
function create_topic(x, y, w, h, ht){
  const ifr = document.createElement("div");
  ifr.classList.add("topic");
  ifr.innerHTML = ht;

  world.appendChild(ifr);
  ifr.setAttribute("style", `width:${w}px;height:${h}px;left:calc(50vw + ${x}px);top:calc(50vh + ${y}px);position:absolute;`);
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
    init_container([[0,0,100,100,"<h1>マイコンとは</h1>"]]);
  });
}


title_patch();