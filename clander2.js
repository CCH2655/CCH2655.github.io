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
  const monthTitle = document.createElement("h2");
  monthTitle.textContent = getMonthName(calendar.month) + " " + calendar.year;
  container.appendChild(monthTitle);

  // 渲染行事曆內容
  const calendarContent = document.createElement("div");
  calendarContent.classList.add("calendar-content");

  // 渲染星期標題
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const weekRow = document.createElement("div");
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
  //   const startDay = firstDay === 0 ? 6 : firstDay - 1; // 將星期日從索引 0 轉為索引 6
  const startDay = firstDay;

  let daycounter = 1;
  const weekRow01 = document.createElement("div");
  weekRow01.classList.add("week-row");
  while (daycounter <= daysInMonth) {
    if (daycounter == 1) {
      if (startDay !== 0) {
        for (let i = 0; i < startDay; i++) {
          const emptyCell = document.createElement("div");
          emptyCell.classList.add("day-cell", "empty-cell");
          weekRow01.appendChild(emptyCell);
        }
      }
    }
    console.log(new Date(calendar.year, calendar.month, daycounter).getDay());
    daycounter++;
  }
  container.appendChild(weekRow01);

  for (let i = 1; i <= daysInMonth; i++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day-cell");
    dayCell.textContent = i;
    dayCell.dataset.date = i;
    dayCell.addEventListener("click", handleDayClick);
    calendarContent.appendChild(dayCell);
  }

  container.appendChild(calendarContent);
}

// 處理日期點擊事件
function handleDayClick(event) {
  const dayCell = event.target;
  const date = dayCell.dataset.date;

  // 彈出對話框輸入備註
  const note = prompt(`${date} 請輸入備註:`);
  if (note) {
    addNoteToCalendar(date, note);
  }
}

// 添加備註到行事曆
function addNoteToCalendar(date, note) {
  const dateKey = getDateKey(date);
  if (!calendar.notes[dateKey]) {
    calendar.notes[dateKey] = [];
  } else {
    calendar.notes[dateKey].pop();
  }
  calendar.notes[dateKey].push(note);
  saveNotesToLocalStorage();

  // 更新行事曆顯示
  const dayCell = document.querySelector(`[data-date="${date}"]`);
  const noteText = document.createElement("div");
  noteText.textContent = `${calendar.notes[dateKey]}`;
  if (dayCell.childNodes.length > 1) {
    console.log(dayCell.childNodes[1]);
    dayCell.lastChild.remove();
  }
  noteText.classList.add("click-disabled");
  dayCell.appendChild(noteText);
}

// 保存備註到 Local Storage
function saveNotesToLocalStorage() {
  localStorage.setItem("calendarNotes", JSON.stringify(calendar.notes));
}

// 從 Local Storage 中恢復備註
function restoreNotes() {
  const savedNotes = localStorage.getItem("calendarNotes");
  if (savedNotes) {
    calendar.notes = JSON.parse(savedNotes);
    // 更新行事曆顯示
    const dayCells = document.querySelectorAll(".day-cell");
    dayCells.forEach((dayCell) => {
      const date = dayCell.dataset.date;
      const dateKey = getDateKey(date);
      if (calendar.notes[dateKey]) {
        const noteContent = calendar.notes[dateKey];
        const noteText = document.createElement("div");
        noteText.classList.add("click-disabled");
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
