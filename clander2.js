// 獲取當前日期
const today = new Date();

// 建立一個行事曆物件
let calendar = {
  year: today.getFullYear(),
  month: today.getMonth(),
  notes: {},
};

// 初始化行事曆
function initCalendar() {
  const calendarContainer = document.getElementById("calendar");

  // 渲染行事曆
  renderCalendar(calendarContainer);

  // 恢復已有的備註
  restoreNotes();
  addPrevNext();
}

function addPrevNext() {
  // 監聽切換月份按鈕
  const prevBtn = document.getElementById("prev-month");
  prevBtn.addEventListener("click", () => changeMonth(-1));

  const nextBtn = document.getElementById("next-month");
  nextBtn.addEventListener("click", () => changeMonth(1));
}
// 渲染行事曆
function renderCalendar(container) {
  container.innerHTML = "";

  // 渲染月份標題
  const monthTitle = document.createElement("div");
  monthTitle.classList.add("month-title");
  const prevMonth = document.createElement("span");
  prevMonth.setAttribute("id", "prev-month");
  prevMonth.textContent = "< 上個月";
  const thisMonth = document.createElement("span");
  thisMonth.setAttribute("id", "this-month");
  thisMonth.textContent = getMonthName(calendar.month) + " " + calendar.year;
  const nextMonth = document.createElement("span");
  nextMonth.setAttribute("id", "next-month");
  nextMonth.textContent = "下個月 >";
  monthTitle.appendChild(prevMonth);
  monthTitle.appendChild(thisMonth);
  monthTitle.appendChild(nextMonth);
  container.appendChild(monthTitle);

  addPrevNext();

  // 渲染行事曆內容
  const calendarContent = document.createElement("div");
  calendarContent.classList.add("calendar-content");

  // 渲染星期標題
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  var weekRow = document.createElement("div");
  weekRow.classList.add("week-row");
  for (const day of weekDays) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day-cell", "week-symbol");
    dayCell.textContent = day;
    weekRow.appendChild(dayCell);
  }
  calendarContent.appendChild(weekRow);

  // 渲染日期格子
  const firstDay = new Date(calendar.year, calendar.month, 1).getDay();
  const daysInMonth = getDaysInMonth(calendar.year, calendar.month);
  const lastDay = new Date(calendar.year, calendar.month, daysInMonth).getDay();
  //   const startDay = firstDay === 0 ? 6 : firstDay - 1; // 將星期日從索引 0 轉為索引 6

  // console.log("firstDay:" + firstDay);
  // console.log("lastDay:" + lastDay);

  const startDay = firstDay;
  // 先建立含有padding的陣列
  let new_month = [];
  let daycounter = 1;
  while (daycounter <= daysInMonth) {
    if (daycounter == 1) {
      for (let i = 0; i < startDay; i++) {
        console.log(i);
        new_month.push(0);
      }
    }
    new_month.push(daycounter);
    if (daycounter == daysInMonth) {
      for (let i = 0; i < 6 - lastDay; i++) {
        new_month.push(0);
      }
    }
    daycounter++;
  }

  // console.log(parseInt(new_month.length / 7));
  // 迴圈建立appendChild
  const weeks = parseInt(new_month.length / 7);
  for (let i = 0; i < weeks; i++) {
    let weekRow = document.createElement("div");
    weekRow.classList.add("week-row");
    for (var j = 0; j < 7; j++) {
      // 建立 span 元素
      if (new_month[i * 7 + j] == 0) {
        var emptyCell = document.createElement("div");
        emptyCell.classList.add("day-cell", "empty-cell");
        weekRow.appendChild(emptyCell);
      } else {
        var dayCell = document.createElement("div");
        dayCell.classList.add("day-cell");
        dayCell.textContent = new_month[i * 7 + j];
        dayCell.dataset.date = new_month[i * 7 + j];
        dayCell.addEventListener("click", handleDayClick);

        var noteText = document.createElement("div");
        noteText.classList.add("click-disabled", "note", "opacity0");
        noteText.textContent = "0";
        dayCell.appendChild(noteText);
        weekRow.appendChild(dayCell);
      }
    }
    calendarContent.appendChild(weekRow);
  }
  container.appendChild(calendarContent);
}

// 處理日期點擊事件
function handleDayClick(event) {
  const dayCell = event.target;
  const date = dayCell.dataset.date;
  var note;
  var isValid = false;

  swal({
    closeOnClickOutside: false,
    title: `${calendar.month + 1}/${date}  跳了幾下呢?`,
    content: "input",
    buttons: {
      cancel: "取消",
      confirm: {
        text: "確認",
        // confirm的value 為input
      },
      danger: {
        text: "刪除",
        value: "delete",
      },
    },
  }).then((value) => {
    if (value == "delete") {
      swal({
        title: "刪除成功!",
        icon: "info",
      });
      // 刪除該日記錄
      addNoteToCalendar(date, 0);
    } else {
      if (value !== null && value !== "") {
        if (value > 0 && value < 999) {
          swal({
            title: `成功! 跳了 ${value} 下`,
            icon: "success",
          });
          addNoteToCalendar(date, value);
        } else {
          swal({
            title: `請輸入正確的數字(1~999)`,
            icon: "info",
          });
        }
      }
    }
  });

  // while (!isValid) {
  //   note = prompt(`${calendar.month + 1}/${date} 跳了幾下呢?`);
  //   // 驗證輸入是否為數字且在指定範圍內
  //   if (isNaN(note) || note < 0 || note > 999) {
  //     alert("輸入無效，請重新輸入數字（0 到 999）:");
  //   } else {
  //     isValid = true;
  //   }
  // }

  // if (note != null) {
  //   addNoteToCalendar(date, note);
  // }
}

// 添加備註到行事曆
function addNoteToCalendar(date, note) {
  const dateKey = getDateKey(date);
  if (!calendar.notes[dateKey]) {
    calendar.notes[dateKey] = [];
  } else {
    calendar.notes[dateKey].pop();
  }
  // 如果輸入""或者0 都刪除
  if (note == "" || note == "0") {
    delete calendar.notes[dateKey];
  } else {
    calendar.notes[dateKey].push(note);
  }
  saveNotesToLocalStorage();
  console.log(note);
  // 更新行事曆顯示
  const dayCell = document.querySelector(`[data-date="${date}"]`);
  const noteText = document.createElement("div");
  if (dayCell.childNodes.length > 1) {
    console.log(dayCell.childNodes[1]);
    dayCell.lastChild.remove();
  }
  if (note == "" || note == "0") {
    noteText.textContent = 0;
    noteText.classList.add("click-disabled", "note", "opacity0");
    dayCell.appendChild(noteText);
  } else {
    noteText.textContent = `${calendar.notes[dateKey]}`;
    noteText.classList.add("click-disabled", "note");
    dayCell.appendChild(noteText);
  }
}

// 保存備註到 Local Storage
function saveNotesToLocalStorage() {
  localStorage.setItem("calendarNotes", JSON.stringify(calendar.notes));
}

// 從 Local Storage 中恢復備註
function restoreNotes() {
  const savedNotes = localStorage.getItem("calendarNotes");

  // console.log(savedNotes);

  if (savedNotes) {
    calendar.notes = JSON.parse(savedNotes);
    // 更新行事曆顯示
    const dayCells = document.querySelectorAll(".day-cell");
    dayCells.forEach((dayCell) => {
      const date = dayCell.dataset.date;
      const dateKey = getDateKey(date);
      if (calendar.notes[dateKey]) {
        const noteContent = calendar.notes[dateKey];
        // 原先如果有其他note，移除
        if (dayCell.childNodes.length > 1) {
          console.log(dayCell.childNodes[1]);
          dayCell.lastChild.remove();
        }

        const noteText = document.createElement("div");
        noteText.classList.add("click-disabled", "note");
        // Note
        noteText.textContent = `${noteContent}`;
        dayCell.appendChild(noteText);
      }
    });
  }
}

// 切換月份
function changeMonth(monthOffset) {
  calendar.month += monthOffset;

  if (calendar.month > 11) {
    calendar.month = 0;
    calendar.year++;
  } else if (calendar.month < 0) {
    calendar.month = 11;
    calendar.year--;
  }

  renderCalendar(document.getElementById("calendar"));

  // 切換候補上note
  restoreNotes();
}

// 獲取指定月份的天數
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// 獲取日期的鍵值
function getDateKey(date) {
  return `${calendar.year}-${calendar.month + 1}-${date}`;
}

// 獲取指定月份的名稱
function getMonthName(month) {
  const monthNames = [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ];
  return monthNames[month];
}

// 初始化行事曆
initCalendar();

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

// function animate() {
//   let rotation = 0;
//   var turnLeft = document.getElementById("my-div-left");
//   turnLeft.addEventListener("click", function () {
//     rotation -= 90;
//     gsap.to("#my-div", { rotation: rotation, duration: 1 });
//   });
//   var turnRight = document.getElementById("my-div-right");
//   turnRight.addEventListener("click", function () {
//     rotation += 90;
//     gsap.to("#my-div", { rotation: rotation, duration: 1 });
//   });
// }
// animate();
