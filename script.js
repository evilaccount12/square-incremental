document.addEventListener("DOMContentLoaded", () => {
  let credit = 0;
  let clickValue = 1;
  let autoCredit = 0;
  let globalMultiplier = 1;
  let negativeEventReduction = 1;

  const creditDisplay = document.getElementById("credit");
  const rankDisplay = document.getElementById("rank");
  const eventLog = document.getElementById("event-log");
  const flag = document.getElementById("flag");

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

  flag.addEventListener("click", () => {
    credit += clickValue * globalMultiplier;
    updateDisplay();
  });

  setInterval(() => {
    credit += autoCredit * globalMultiplier;
    updateDisplay();
  }, 1000);

  function randomEvent() {
    let eventChance = Math.random();
    let event;
    if (credit >= 5000) {
      event = eventChance < 0.5 ? { text: "🚨 Crackdown! -200 SC", effect: -200 } : { text: "📢 Propaganda bonus! +150 SC", effect: 150 };
    } else {
      event = eventChance < 0.5 ? { text: "📢 Local commendation! +50 SC", effect: 50 } : { text: "🚨 Minor infraction! -30 SC", effect: -30 };
    }
    if (event.effect < 0) event.effect *= negativeEventReduction;
    credit += event.effect;
    if (credit < 0) credit = 0;
    eventLog.textContent = event.text;
    updateDisplay();
  }

  setInterval(randomEvent, 20000);
});
