document.addEventListener("DOMContentLoaded", () => {
  let credit = 0;
  let clickValue = 1;
  let autoCredit = 0;
  let globalMultiplier = 1;
  let negativeEventReduction = 1;

  const creditDisplay = document.getElementById('credit');
  const rankDisplay = document.getElementById('rank');
  const eventLog = document.getElementById('event-log');
  const flag = document.getElementById('flag');
  const trumpCall = document.getElementById('trump-call');
  const trumpMessage = document.getElementById('trump-message');

  function updateDisplay() {
    creditDisplay.textContent = Math.floor(credit);
    rankDisplay.textContent = getRank();
  }

  function getRank() {
    if (credit >= 10000) return "Supreme Leader";
    if (credit >= 5000) return "High-Ranking Official";
    if (credit >= 2000) return "Trusted Citizen";
    if (credit >= 1000) return "Respected Party Member";
    return "Citizen";
  }

  flag.addEventListener('click', () => {
    credit += clickValue * globalMultiplier;
    updateDisplay();
  });

  setInterval(() => {
    credit += autoCredit * globalMultiplier;
    updateDisplay();
  }, 1000);

  function randomEvent() {
    let event = Math.random() < 0.5 ? { text: "🚨 Inspection! -50 SC", effect: -50 } : { text: "💰 Bonus! +50 SC", effect: 50 };
    credit += event.effect * negativeEventReduction;
    if (credit < 0) credit = 0;
    eventLog.textContent = event.text;
    updateDisplay();
  }
  setInterval(randomEvent, 20000);

  const trumpMessages = [
    "You're fired!",
    "Make Social Credit Great Again!",
    "Nobody builds social credit like me!",
    "Fake news!"
  ];
  function triggerTrumpCall() {
    trumpMessage.textContent = trumpMessages[Math.floor(Math.random() * trumpMessages.length)];
    trumpCall.style.display = "block";
    setTimeout(() => { trumpCall.style.display = "none"; }, 4000);
  }
  setInterval(triggerTrumpCall, 25000);

  updateDisplay();
});
