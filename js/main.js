function clear_title(){
  const title = document.getElementsByClassName("title_start")[0];
  // 初期状態で要素を透明にする
  title.style.opacity = "1";
  // フェードインのアニメーションを設定
  title.style.transition = "opacity 1s ease-in-out";
  // アニメーションを開始
  title.style.opacity = "0";
}