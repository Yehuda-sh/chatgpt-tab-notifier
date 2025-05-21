// Notifier: הודעה חדשה
console.log("[Notifier] Content script loaded");

let lastMessage = "";
let notified = false;

const audio = new Audio(chrome.runtime.getURL("notify.mp3"));
audio.volume = 0.6;
console.log("[Notifier] Audio initialized");

function checkForNewMessage() {
  const messages = document.querySelectorAll(
    '[data-message-author-role="assistant"]'
  );
  if (!messages.length) return;

  const latest = messages[messages.length - 1].innerText.trim();
  if (latest !== lastMessage) {
    console.log("[Notifier] New assistant message detected");
    lastMessage = latest;
    if (document.hidden && !notified) {
      console.log("[Notifier] Tab is inactive — triggering notification");
      document.title = "(1) הודעה מ־ChatGPT";
      audio
        .play()
        .catch((err) => console.warn("[Notifier] Failed to play sound:", err));
      notified = true;
    }
  } else {
    if (!document.hidden) {
      document.title = "ChatGPT";
      notified = false;
    }
  }
}

// RTL fixer: סידור השדה לימין (RTL)
function fixRTL() {
  // textarea
  let textArea = document.querySelector("textarea");
  if (textArea) {
    textArea.dir = "rtl";
    textArea.style.textAlign = "right";
  }
  // contenteditable
  let editable = document.querySelector('[contenteditable="true"]');
  if (editable) {
    editable.dir = "rtl";
    editable.style.textAlign = "right";
  }
}

// בדיקות אינטרוול – כל 2 שניות לבדוק הודעות, כל שנייה לסדר RTL
setInterval(checkForNewMessage, 2000);
setInterval(fixRTL, 1000);
