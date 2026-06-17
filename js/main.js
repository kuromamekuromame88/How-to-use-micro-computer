
//トピックデータの形式
/*
[
  [x, y, w, h, htmlText],
  ...
]
*/

var cameraX, cameraY;

const MainContainer = document.getElementsByClassName("MainContainer")[0];

MainContainer.addEventListener("keydown", (e)=>{
  console.log(e.key);
});

var pointerX, pointerY, moveX, moveY;

MainContainer.addEventListener("pointerdown", (e)=>{
  pointerX = e.clientX;
  pointerY = e.clientY;
  console.log(`pX:${pointerX}, pY:${pointerY}`);
})
const l = document.getElementById("logp");
MainContainer.addEventListener("pointermove", (e)=>{
  moveX = e.clientX - pointerX;
  moveY = e.clientY - pointerY;
  l.innerText = `mX: ${moveX}, mY: ${moveY}`;
});



//トピックを表示する2次元コンテナ
function create_topic(x, y, w, h, ht){
  const ifr = document.createElement("div");
  ifr.classList.add("topic");
  ifr.innerHTML = ht;
  //ifr.style = `width:${w};height:${h};left:calc(50vw + ${x}px)important;top:calc(50vh + ${y}px)important;`;

  console.log(ifr);
  MainContainer.appendChild(ifr);

  ifr.setAttribute("style", `width:${w}px;height:${h}px;left:calc(50vw + ${x}px);top:calc(50vh + ${y}px);position:absolute;`);
  //ifr.width = w;
  //ifr.height = h;
  //ifr.left = `calc(50vw + ${x}px)`;
  //ifr.top = `calc(50vh + ${y}px)`;
  
  //cont.style=`translate(${x}px, ${y}px);`;
  //scale
  //translate
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
    e.style.display = "none";
  }, 1000);
}

function title_patch(){
  const title = document.getElementsByClassName("title_start")[0];
  title.addEventListener("click", ()=>{
    const title = document.getElementsByClassName("title_start")[0];
    feed_out(title);
    init_container([[0,0,100,100,"a"]]);
  });
}


title_patch();