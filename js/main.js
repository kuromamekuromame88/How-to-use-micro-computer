
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


//トピックを表示する2次元コンテナ

function init_container(topics){
  if(typeof topics == "object") console.log(typeof topics);
}



title_patch();