
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
  ifr.style = `width:${w};height:${h};`;
  const cont = document.getElementsByClassName("MainContainer")[0];
  cont.style=`translate(${x}px, ${y}px);`;
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