
//フェードアウト
function feed_out(e){
  e.style.opacity = "1";
  e.style.transition = "opacity 1s ease-in-out";
  e.style.opacity = "0";
}

function title_patch(){
  const title = document.getElementsByClassName("title_start")[0];
  title.addEventListener("click", ()=>{
    const title = document.getElementsByClassName("title_start")[0];
    feed_out(title);
  });
}

//トピックの形式
/*
[
  [x, y, w, h, htmlText],
  ...
]
*/


//トピックを表示する2次元コンテナ
function create_topic(x, y, w, h, ht){
  const ifr = document.createElement("iframe");
  ifr.class="topic";
  ifr.srcdoc = ht;
  //ifr.style = `width:${w};height:${h};left:calc(50vw + ${x}px)important;top:calc(50vh + ${y}px)important;`;

  console.log(ifr);
  const cont = document.getElementsByClassName("MainContainer")[0];
  cont.appendChild(ifr);

  ifr.setAttribute("style", `width:${w};height:${h};left:calc(50vw + ${x}px)important;top:calc(50vh + ${y}px)important;position:absolute;`);
  //ifr.width = w;
  //ifr.height = h;
  //ifr.left = `calc(50vw + ${x}px)`;
  //ifr.top = `calc(50vh + ${y}px)`;
  
  //cont.style=`translate(${x}px, ${y}px);`;
  //scale
  //translate
};

function init_container(topics){
  if(typeof topics == "object") console.log(typeof topics);

  topics.forEach((e,i)=>{
    create_topic(e[0], e[1], e[2], e[3], e[4]);
  });
}



title_patch();