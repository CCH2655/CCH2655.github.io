function changImg() {
  // 獲取圖片元素
  var imageEl = document.getElementById("switchImg");
  console.log(imageEl);
  // 定義圖片資料夾路徑
  var imagePath = "img/";

  // 定義圖片陣列，存儲所有圖片的檔名
  var imageNames = [];
  for (let i = 0; i < 20; i++) {
    var imageName = "img_show_" + String(i).padStart(3, "0") + ".png";
    imageNames.push(imageName);
  }

  // 設置圖片索引
  var currentIndex = 0;

  // 監聽圖片的點擊事件
  imageEl.addEventListener("click", function () {
    // 切換到下一張圖片
    currentIndex++;

    // 若超出陣列範圍，循環回第一張圖片
    if (currentIndex >= imageNames.length) {
      currentIndex = 0;
    }

    // 組合圖片路徑
    var imagePathWithFileName = imagePath + imageNames[currentIndex];

    // 更新圖片的 src 屬性
    imageEl.src = imagePathWithFileName;
  });
}

changImg();
