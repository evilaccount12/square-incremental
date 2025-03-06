document.addEventListener("DOMContentLoaded", () => {
  // Game state variables
  let credit = 0;
  let highestCredit = 0;      // Tracks maximum social credit achieved
  let clickValue = 1;         // Base social credit per click
  let autoCredit = 0;         // Passive social credit per second
  let globalMultiplier = 1;   // Multiplier from global upgrades
  let negativeEventReduction = 1; // Reduction factor for negative events

  // Display elements
  const creditDisplay = document.getElementById('credit');
  const rankDisplay = document.getElementById('rank');
  const eventLog = document.getElementById('event-log');
  const flag = document.getElementById('flag');
  const trumpCall = document.getElementById('trump-call');
  const trumpMessage = document.getElementById('trump-message');

  // Upgrade cost definitions (scale up after purchase)
  let clickUpgradeCosts = {
    "click-upgrade-1": 50,
    "click-upgrade-2": 150,
    "click-upgrade-3": 500
  };
  let autoClickerCosts = {
    "autoclicker-1": 200,
    "autoclicker-2": 600,
    "autoclicker-3": 1500
  };
  let globalUpgradeCosts = {
    "global-upgrade-1": 800,
    "global-upgrade-2": 2500,
    "global-upgrade-3": 5000
  };

  // Upgrade effects
  const clickUpgradeEffects = {
    "click-upgrade-1": 1,
    "click-upgrade-2": 3,
    "click-upgrade-3": 10
  };
  const autoClickerEffects = {
    "autoclicker-1": 1,
    "autoclicker-2": 4,
    "autoclicker-3": 10
  };

  // Global upgrades can be purchased only once
  let globalUpgradesPurchased = {
    "global-upgrade-1": false,
    "global-upgrade-2": false,
    "global-upgrade-3": false
  };

  // Update display function (uses highestCredit for rank)
  function updateDisplay() {
    // Update highest credit reached so far
    if (credit > highestCredit) {
      highestCredit = credit;
    }
    creditDisplay.textContent = Math.floor(credit);
    rankDisplay.textContent = getRank(highestCredit);

    // Update upgrade cost displays
    document.getElementById('click-upgrade-1-cost').textContent = clickUpgradeCosts["click-upgrade-1"];
    document.getElementById('click-upgrade-2-cost').textContent = clickUpgradeCosts["click-upgrade-2"];
    document.getElementById('click-upgrade-3-cost').textContent = clickUpgradeCosts["click-upgrade-3"];
    document.getElementById('autoclicker-1-cost').textContent = autoClickerCosts["autoclicker-1"];
    document.getElementById('autoclicker-2-cost').textContent = autoClickerCosts["autoclicker-2"];
    document.getElementById('autoclicker-3-cost').textContent = autoClickerCosts["autoclicker-3"];
    document.getElementById('global-upgrade-1-cost').textContent = globalUpgradeCosts["global-upgrade-1"];
    document.getElementById('global-upgrade-2-cost').textContent = globalUpgradeCosts["global-upgrade-2"];
    document.getElementById('global-upgrade-3-cost').textContent = globalUpgradeCosts["global-upgrade-3"];

    // Toggle disabled state for upgrades based on available credit
    Object.keys(clickUpgradeCosts).forEach(id => {
      document.getElementById(id).classList.toggle('disabled', credit < clickUpgradeCosts[id]);
    });
    Object.keys(autoClickerCosts).forEach(id => {
      document.getElementById(id).classList.toggle('disabled', credit < autoClickerCosts[id]);
    });
    Object.keys(globalUpgradeCosts).forEach(id => {
      if (globalUpgradesPurchased[id]) {
        document.getElementById(id).classList.add('disabled');
      } else {
        document.getElementById(id).classList.toggle('disabled', credit < globalUpgradeCosts[id]);
      }
    });
  }

  // Determine player's rank based on maximum social credit achieved
  function getRank(value) {
    if (value >= 10000) return "Supreme Leader";
    if (value >= 5000) return "High-Ranking Official";
    if (value >= 2000) return "Trusted Citizen";
    if (value >= 1000) return "Respected Party Member";
    return "Citizen";
  }

  // Clicking the flag adds social credit (with global multiplier)
  flag.addEventListener('click', () => {
    credit += clickValue * globalMultiplier;
    updateDisplay();
  });

  // Purchase a click upgrade
  function buyClickUpgrade(id) {
    let cost = clickUpgradeCosts[id];
    if (credit >= cost) {
      credit -= cost;
      clickValue += clickUpgradeEffects[id];
      clickUpgradeCosts[id] = Math.floor(cost * 1.5);
      updateDisplay();
    }
  }

  // Purchase an auto-clicker
  function buyAutoClicker(id) {
    let cost = autoClickerCosts[id];
    if (credit >= cost) {
      credit -= cost;
      autoCredit += autoClickerEffects[id];
      autoClickerCosts[id] = Math.floor(cost * 1.5);
      updateDisplay();
    }
  }

  // Purchase a global upgrade (only once per upgrade)
  function buyGlobalUpgrade(id) {
    let cost = globalUpgradeCosts[id];
    if (credit >= cost && !globalUpgradesPurchased[id]) {
      credit -= cost;
      globalUpgradesPurchased[id] = true;
      if (id === "global-upgrade-1") {
        globalMultiplier *= 1.2; // Boost all gains by 20%
      } else if (id === "global-upgrade-2") {
        autoCredit *= 1.5;       // Boost auto-clickers by 50%
      } else if (id === "global-upgrade-3") {
        negativeEventReduction = 0.5; // Halve the impact of negative events
      }
      updateDisplay();
    }
  }

  // Attach event listeners to upgrades
  document.getElementById('click-upgrade-1').addEventListener('click', () => buyClickUpgrade("click-upgrade-1"));
  document.getElementById('click-upgrade-2').addEventListener('click', () => buyClickUpgrade("click-upgrade-2"));
  document.getElementById('click-upgrade-3').addEventListener('click', () => buyClickUpgrade("click-upgrade-3"));
  document.getElementById('autoclicker-1').addEventListener('click', () => buyAutoClicker("autoclicker-1"));
  document.getElementById('autoclicker-2').addEventListener('click', () => buyAutoClicker("autoclicker-2"));
  document.getElementById('autoclicker-3').addEventListener('click', () => buyAutoClicker("autoclicker-3"));
  document.getElementById('global-upgrade-1').addEventListener('click', () => buyGlobalUpgrade("global-upgrade-1"));
  document.getElementById('global-upgrade-2').addEventListener('click', () => buyGlobalUpgrade("global-upgrade-2"));
  document.getElementById('global-upgrade-3').addEventListener('click', () => buyGlobalUpgrade("global-upgrade-3"));

  // Passive income: auto-clickers add social credit each second
  setInterval(() => {
    credit += autoCredit * globalMultiplier;
    updateDisplay();
  }, 1000);

  // Random events with scaling effects based on current social credit
  function randomEvent() {
    let eventChance = Math.random();
    let event;
    
    if (credit >= 5000) {
      if (eventChance < 0.4) {
        event = { text: "🚨 Government crackdown!", baseEffect: -200 };
      } else if (eventChance < 0.7) {
        event = { text: "⚠️ Unexpected audit!", baseEffect: -100 };
      } else if (eventChance < 0.9) {
        event = { text: "📢 Propaganda bonus!", baseEffect: 150 };
      } else {
        event = { text: "🔍 Random inspection!", baseEffect: -50 };
      }
    } else {
      if (eventChance < 0.3) {
        event = { text: "📢 Local commendation!", baseEffect: 50 };
      } else if (eventChance < 0.6) {
        event = { text: "🚨 Minor infraction!", baseEffect: -30 };
      } else {
        event = { text: "💰 Small bonus!", baseEffect: 20 };
      }
    }
    
    // Scale event effects based on current social credit
    let scalingFactor = 1 + credit / 10000;  // For example, at 10000 credit factor becomes 2
    let effect = event.baseEffect * scalingFactor;
    
    // Apply negative event reduction if applicable
    if (effect < 0) {
      effect *= negativeEventReduction;
    }
    
    credit += effect;
    if (credit < 0) credit = 0;
    
    let effectRounded = Math.floor(effect);
    eventLog.textContent = event.text + " " + (effectRounded >= 0 ? "+" : "") + effectRounded + " SC";
    updateDisplay();
  }

  // Initial random event interval (20 seconds)
  let eventInterval = 20000;
  setInterval(randomEvent, eventInterval);

  // Gradually reduce the interval for random events (but never less than 5 seconds)
  setInterval(() => {
    if (eventInterval > 5000) {
      eventInterval -= 1000;
    }
  }, 30000);

  // Trump call messages
  const trumpMessages = [
    "You're fired!",
    "Make Social Credit Great Again!",
    "Nobody builds social credit like me!",
    "I know the best social credit, believe me!",
    "Fake news!"
  ];

  // Show the Trump call UI with a random message
  function triggerTrumpCall() {
    let message = trumpMessages[Math.floor(Math.random() * trumpMessages.length)];
    trumpMessage.textContent = message;
    trumpCall.style.display = "flex";
    setTimeout(() => { 
      trumpCall.style.display = "none"; 
    }, 4000);
  }
  setInterval(triggerTrumpCall, 25000);

  // Initialize display
  updateDisplay();
});
