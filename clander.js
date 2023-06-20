// 行事曆 js
// 獲取當前日期
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();

// 獲取行事曆容器元素
const calendarContainer = document.getElementById("calendar");

// 建立行事曆
function createCalendar(year, month) {
  // 獲取該月份的第一天
  const firstDay = new Date(year, month, 1);
  const startingDay = firstDay.getDay();

  // 獲取該月份的總天數
  const totalDays = new Date(year, month + 1, 0).getDate();

  // 清空行事曆容器
  calendarContainer.innerHTML = "";

  // 添加每一天的格子到行事曆
  for (let i = 0; i < startingDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.classList.add("day");
    calendarContainer.appendChild(emptyDay);
  }

  for (let i = 1; i <= totalDays; i++) {
    const day = document.createElement("div");
    day.classList.add("day");
    day.textContent = i;
    calendarContainer.appendChild(day);

    // 綁定點擊事件
    day.addEventListener("click", function () {
      const note = prompt("請輸入備註");
      // 將備註存儲到 Local Storage
      localStorage.setItem(`${year}-${month + 1}-${i}`, note);
      updateCalendar();
    });

    // 檢查 Local Storage 中是否有備註，並在格子上顯示提示
    const storedNote = localStorage.getItem(`${year}-${month + 1}-${i}`);
    if (storedNote) {
      const noteIndicator = document.createElement("span");
      noteIndicator.classList.add("note-indicator");
      noteIndicator.textContent = storedNote;
      day.appendChild(noteIndicator);
    }
  }
}

// 更新行事曆
function updateCalendar() {
  createCalendar(currentYear, currentMonth);
}

// 初始化行事曆
updateCalendar();
