// 전역 변수
let cheersInterval;
let recordedText = "/야광봉//야광봉//야광봉/"; // 기본 텍스트
let selectedTime = 2; // 기본 시간 (초)
let startButton, stopButton;

// 로컬 스토리지에서 저장된 설정 불러오기
function loadSavedSettings() {
  const savedTime = localStorage.getItem("cheerInterval");
  if (savedTime) {
    selectedTime = parseFloat(savedTime);
  }

  const savedText = localStorage.getItem("recordedText");
  if (savedText) {
    recordedText = savedText;
  }
}

// 현재 텍스트 표시 요소 생성
function createRecordedTextDisplay() {
  const recordedTextDisplay = document.createElement("div");
  recordedTextDisplay.id = "recorded-text-display";
  recordedTextDisplay.textContent = `현재 텍스트: ${recordedText}`;

  // 스타일 적용
  recordedTextDisplay.style.position = "fixed";
  recordedTextDisplay.style.bottom = "1px";
  recordedTextDisplay.style.right = "1px";
  recordedTextDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  recordedTextDisplay.style.color = "#fff";
  recordedTextDisplay.style.padding = "1px 5px";
  recordedTextDisplay.style.borderRadius = "2px";
  recordedTextDisplay.style.fontSize = "10px";
  recordedTextDisplay.style.zIndex = "9999";

  document.body.appendChild(recordedTextDisplay);
}

// 버튼 및 선택 상자 생성 및 페이지에 주입
function injectControls() {
  const recordLi = document.createElement("li");
  const recordButton = document.createElement("button");
  recordButton.type = "button";
  recordButton.innerText = "📝"; // 기록하기 이모지
  recordButton.id = "record-button";
  recordButton.className = "cheer-button";
  recordButton.title = "기록하기";
  recordLi.appendChild(recordButton);

  const startLi = document.createElement("li");
  startButton = document.createElement("button");
  startButton.type = "button";
  startButton.innerText = "▶️"; // 시작하기 이모지
  startButton.id = "start-button";
  startButton.className = "cheer-button";
  startButton.title = "시작하기";
  startLi.appendChild(startButton);

  const stopLi = document.createElement("li");
  stopButton = document.createElement("button");
  stopButton.type = "button";
  stopButton.innerText = "⏹️"; // 멈추기 이모지
  stopButton.id = "stop-button";
  stopButton.className = "cheer-button";
  stopButton.title = "멈추기";
  stopLi.appendChild(stopButton);

  // 시간 선택 상자 생성
  const timeSelectorLi = document.createElement("li");
  const timeSelector = createTimeSelector();
  timeSelectorLi.appendChild(timeSelector);

  // 이벤트 리스너 추가
  recordButton.addEventListener("click", recordText);
  startButton.addEventListener("click", () => startCheering());
  stopButton.addEventListener("click", stopCheering);

  // 초기 버튼 상태 설정
  startButton.disabled = false;
  stopButton.disabled = true;

  // ul3 생성 또는 기존 ul3에 추가
  let ul3 = document.querySelector("#ul3");
  if (!ul3) {
    ul3 = document.createElement("ul");
    ul3.id = "ul3";
    ul3.className = "ul3";
    // ul2 다음에 ul3 추가
    const ul2 = document.querySelector("#ul2");
    if (ul2 && ul2.parentNode) {
      ul2.parentNode.insertBefore(ul3, ul2.nextSibling);
    } else {
      showToast("#ul2 요소를 찾을 수 없습니다.");
      return;
    }
  }

  // 컨트롤 요소 추가
  ul3.appendChild(recordLi);
  ul3.appendChild(startLi);
  ul3.appendChild(stopLi);
  ul3.appendChild(timeSelectorLi);

  // 현재 텍스트 표시 요소 생성
  createRecordedTextDisplay();
}

// #write_area에서 텍스트 불러오기
function recordText() {
  const writeArea = document.querySelector("#write_area");
  if (writeArea) {
    const userText = writeArea.textContent.trim() || "/야광봉//야광봉//야광봉/";
    recordedText = userText;
    localStorage.setItem("recordedText", recordedText); // 로컬 스토리지에 저장

    // 기록된 텍스트 표시 업데이트
    const recordedTextDisplay = document.querySelector(
      "#recorded-text-display"
    );
    if (recordedTextDisplay) {
      recordedTextDisplay.textContent = `현재 텍스트: ${recordedText}`;
    }

    showToast(`녹화된 텍스트: ${recordedText}`);
  } else {
    showToast("#write_area 요소를 찾을 수 없습니다.");
  }
}

// 자동 응원 메시지 전송 시작
function startCheering() {
  stopCheering(); // 이전 인터벌이 있으면 중지
  cheersInterval = setInterval(() => {
    const item = recordedText;
    const writeArea = document.querySelector("#write_area");
    const sendButton = document.querySelector("#btn_send");

    if (writeArea && sendButton) {
      writeArea.textContent = item;
      writeArea.dispatchEvent(new Event("input", { bubbles: true })); // 입력 이벤트 트리거
      sendButton.click();
    } else {
      showToast("#write_area 또는 #btn_send 요소를 찾을 수 없습니다.");
      stopCheering();
    }
  }, selectedTime * 1000);

  // 버튼 상태 업데이트
  startButton.disabled = true;
  stopButton.disabled = false;
  startButton.classList.add("active");

  showToast("자동 응원 시작!");
}

// 자동 전송 중지
function stopCheering() {
  if (cheersInterval) {
    clearInterval(cheersInterval);
    cheersInterval = null;
  }

  // 버튼 상태 업데이트
  startButton.disabled = false;
  stopButton.disabled = true;
  startButton.classList.remove("active");

  showToast("자동 응원 중지!");
}

// 시간 선택 상자 생성
function createTimeSelector() {
  const timeSelector = document.createElement("select");
  timeSelector.id = "time-selector";

  const times = [0.8, 1, 1.5, 2, 3, 5, 10];
  times.forEach((time) => {
    const option = document.createElement("option");
    option.value = time;
    option.text = `${time}초`;
    if (time === selectedTime) {
      option.selected = true;
    }
    timeSelector.appendChild(option);
  });

  // 변경 이벤트 리스너 추가
  timeSelector.addEventListener("change", (event) => {
    selectedTime = parseFloat(event.target.value);
    // 로컬 스토리지에 선택한 시간 저장
    localStorage.setItem("cheerInterval", selectedTime);
  });

  return timeSelector;
}

// 토스트 메시지 표시 함수
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "cheer-toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("cheer-toast-show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("cheer-toast-show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

// 초기화 함수
function init() {
  loadSavedSettings();
  injectControls();
}

// 스크립트 실행 시 초기화
init();
