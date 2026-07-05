const PASSWORD = "36522";
const MAX_DIGITS = 5;

const digitDisplay = document.getElementById("digitDisplay");
const digitBoxes = [...digitDisplay.querySelectorAll(".digit-box")];
const keypad = document.getElementById("keypad");
const clearBtn = document.getElementById("clearBtn");
const toggleVis = document.getElementById("toggleVis");
const nextBtn = document.getElementById("nextBtn");
const statusMsg = document.getElementById("statusMsg");
const pageLoader = document.getElementById("pageLoader");
const confettiWrap = document.getElementById("confettiWrap");
const loginScreen = document.getElementById("loginScreen");

let entered = "";
let unlocked = false;
let showDigits = true;

updateDisplay();

window.addEventListener("load", () => {
  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
    setTimeout(() => pageLoader.remove(), 1000);
  });
});

function updateDisplay() {
  digitBoxes.forEach((box, i) => {
    const hasChar = i < entered.length;
    const char = entered[i] || "";
    const charEl = box.querySelector(".digit-char") || box;

    box.classList.toggle("filled", hasChar);
    box.classList.toggle("active", i === entered.length && !unlocked);
    box.classList.toggle("hidden-digit", !showDigits && hasChar);

    if (!hasChar) {
      charEl.textContent = "";
    } else if (showDigits) {
      charEl.textContent = char;
    } else {
      charEl.textContent = "●";
    }
  });

  clearBtn.disabled = entered.length === 0;
  digitDisplay.classList.toggle("masked", !showDigits);
}

function setStatus(text, type) {
  statusMsg.textContent = text;
  statusMsg.className = "status-msg";
  if (type) statusMsg.classList.add(type);
}

function clearDisplay(animateBtn) {
  entered = "";
  unlocked = false;
  nextBtn.disabled = true;
  nextBtn.classList.remove("ready");
  digitDisplay.classList.remove("success", "shake");
  updateDisplay();
  setStatus("");
  if (animateBtn && clearBtn) {
    clearBtn.classList.add("pulse");
    setTimeout(() => clearBtn.classList.remove("pulse"), 400);
  }
}

function shakeDisplay() {
  digitDisplay.classList.remove("shake");
  void digitDisplay.offsetWidth;
  digitDisplay.classList.add("shake");
  setStatus("wrong code, try again", "error");
  digitDisplay.addEventListener(
    "animationend",
    () => digitDisplay.classList.remove("shake"),
    { once: true }
  );
}

function successDisplay() {
  unlocked = true;
  digitDisplay.classList.add("success");
  showDigits = true;
  toggleVis.classList.remove("hide-mode");
  updateDisplay();
  setStatus("correct! tap next →", "success");
  nextBtn.disabled = false;
  nextBtn.classList.add("ready");
  launchConfetti();
}

function checkPassword() {
  if (entered.length !== MAX_DIGITS) return;

  if (entered === PASSWORD) {
    successDisplay();
  } else {
    shakeDisplay();
    setTimeout(clearDisplay, 650);
  }
}

function pressKey(value) {
  if (unlocked && value >= "0" && value <= "9") return;

  if (value >= "0" && value <= "9") {
    if (entered.length < MAX_DIGITS) {
      entered += value;
      updateDisplay();
      if (entered.length === MAX_DIGITS) {
        setTimeout(checkPassword, 320);
      }
    }
    return;
  }

  if (value === "*") {
    if (entered.length > 0) {
      entered = entered.slice(0, -1);
      unlocked = false;
      nextBtn.disabled = true;
      nextBtn.classList.remove("ready");
      digitDisplay.classList.remove("success");
      updateDisplay();
      setStatus("");
    }
    return;
  }

  if (value === "clear") {
    clearDisplay(true);
    return;
  }

  if (value === "#") {
    checkPassword();
  }
}

function launchConfetti(count = 48) {
  confettiWrap.innerHTML = "";
  const colors = ["#fff", "#ffcdd2", "#ffeb3b", "#ff8a80", "#f48fb1", "#81c784"];
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "confetti-piece";
    p.style.setProperty("--cx", `${Math.random() * 100}%`);
    p.style.setProperty("--delay", `${Math.random() * 0.5}s`);
    p.style.setProperty("--rot", `${Math.random() * 360}deg`);
    p.style.setProperty("--clr", colors[i % colors.length]);
    p.style.setProperty("--dur", `${1.2 + Math.random() * 1.5}s`);
    p.style.setProperty("--sz", `${5 + Math.random() * 8}px`);
    confettiWrap.appendChild(p);
  }
  setTimeout(() => {
    confettiWrap.innerHTML = "";
  }, 4000);
}

function goToNextPage() {
  if (!unlocked) return;

  loginScreen.classList.add("exit");
  setTimeout(() => {
    loginScreen.classList.remove("active");
    loginScreen.hidden = true;
    document.querySelector(".bg-decor")?.style.setProperty("display", "none");
    if (typeof launchBirthdayExperience === "function") {
      launchBirthdayExperience();
    }
  }, 550);
}

clearBtn.addEventListener("click", () => clearDisplay(true));

toggleVis.addEventListener("click", () => {
  showDigits = !showDigits;
  toggleVis.classList.toggle("hide-mode", !showDigits);
  updateDisplay();
});

nextBtn.addEventListener("click", goToNextPage);

keypad.addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (!btn) return;

  btn.classList.add("pressed", "ripple");
  setTimeout(() => {
    btn.classList.remove("pressed", "ripple");
  }, 350);

  pressKey(btn.dataset.key);
});

document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") {
    pressKey(e.key);
    highlightKey(e.key);
  } else if (e.key === "Backspace" && e.shiftKey) {
    pressKey("clear");
  } else if (e.key === "Backspace") {
    pressKey("*");
  } else if (e.key === "Escape") {
    pressKey("clear");
  } else if (e.key === "Enter") {
    if (unlocked) goToNextPage();
    else pressKey("#");
  }
});

function highlightKey(val) {
  const btn = keypad.querySelector(`[data-key="${val}"]`);
  if (!btn) return;
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 150);
}
