
let allTechniques = null;

async function fetchTechniques() {
  const response = await fetch('data/data.json');
  const techniques = await response.json();
  return techniques;
}

fetchTechniques().then(techniques => {
  allTechniques = techniques;

  writeStack(techniques.attacks, 'attacks', '#attack');
  writeStack(techniques.techniques, 'responses', '#response');

  writeSettings(techniques.attacks, 'attacks', '#settings-attacks .settings-set');
  writeSettings(techniques.techniques, 'responses', '#settings-responses .settings-set');
});

const speakToggle = document.querySelector('#menu-speak');
speakToggle.checked = localStorage.getItem('trainer-speak') !== 'false';
speakToggle.addEventListener('change', () => {
  localStorage.setItem('trainer-speak', speakToggle.checked);
});

const AUTOPLAY_INTERVAL_MS = 60 * 1000;
let autoplayTimer = null;

function dealNewCombination() {
  document.querySelectorAll('.stack-item:first-child button').forEach(card => discard(card));
  speakCards();
}

function startAutoplay() {
  dealNewCombination();
  autoplayTimer = setInterval(dealNewCombination, AUTOPLAY_INTERVAL_MS);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = null;
}

const autoplayToggle = document.querySelector('#menu-autoplay');
autoplayToggle.checked = localStorage.getItem('trainer-autoplay') === 'true';
autoplayToggle.addEventListener('change', () => {
  localStorage.setItem('trainer-autoplay', autoplayToggle.checked);
  autoplayToggle.checked ? startAutoplay() : stopAutoplay();
});

if (autoplayToggle.checked) startAutoplay();

document.querySelector('#new-cards button').addEventListener('click', dealNewCombination);

function getDisabled(key) {
  const stored = localStorage.getItem('trainer-disabled-' + key);
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

function setDisabled(key, disabledSet) {
  localStorage.setItem('trainer-disabled-' + key, JSON.stringify([...disabledSet]));
}

function writeStack(data, key, element) {
  const disabled = getDisabled(key);
  const filteredList = data.list.filter(item => !disabled.has(item.id));

  const list = document.querySelector(element);

  function Stack() {
    var techniqueList = rateWeight(filteredList);
    shuffle(techniqueList);

    return techniqueList.map(item =>
      <li class="stack-item" id={"stack-item-" + item.id}>
        <button type="button">
          <span class="english" lang="en-US">{item.english}</span>
          <span class="japanese" lang="ja-JP" data-speak={item.speak || item.japanese}>{item.japanese}</span>
        </button>
      </li>
    );
  }

  ReactDOM.render(<Stack/>, list);

  list.querySelectorAll('.stack-item button').forEach(card => {
    card.addEventListener('click', function() {
      discard(card);
      speakCards();
    });
  });

  rotateStacks();
}

function writeSettings(data, key, element) {
  const disabled = getDisabled(key);
  const list = document.querySelector(element);

  function Settings() {
    return data.list.map(technique =>
      <li class="settings-set-item">
        <label class="toggle-component">
          <span class="toggle-lable">{technique.english}</span>
          <input
            name={key + "-" + technique.id}
            id={key + "-" + technique.id}
            type="checkbox"
            class="toggle-checkbox"
            defaultChecked={!disabled.has(technique.id)}
            onChange={e => uncheckItem(e.target)}
          ></input>
          <span class="toggle-switch"></span>
        </label>
      </li>
    );
  }

  ReactDOM.render(<Settings/>, list);
}

function uncheckItem(target) {
  const lastDash = target.id.lastIndexOf('-');
  const key = target.id.slice(0, lastDash);
  const id = parseInt(target.id.slice(lastDash + 1));

  const disabled = getDisabled(key);
  if (target.checked) {
    disabled.delete(id);
  } else {
    disabled.add(id);
  }
  setDisabled(key, disabled);

  if (key === 'attacks') {
    writeStack(allTechniques.attacks, 'attacks', '#attack');
  } else if (key === 'responses') {
    writeStack(allTechniques.techniques, 'responses', '#response');
  }
}

function rotateStacks() {
  var cards = document.querySelectorAll('.stack-item');

  for (let i = 0; i < cards.length; i++) {
    var rotate = Math.random() * (3 - (-3)) + (-3);
    cards[i].style.setProperty('--card-angle', `${ rotate }deg`);
  }
}

function rateWeight(list) {
  var returnList = [];

  for (const i in list) {
    var item = list[i];
    var repeat = item.rate ? parseInt(item.rate) : 1;

    for (let j = 0; j < repeat; j++) {
      returnList.push(item);
    }
  }

  return returnList;
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

function discard(card) {
  var thisCard = card.parentElement;
  var stack = card.closest('.stack');
  stack.appendChild(thisCard);
}

let japaneseVoice = null;

function loadVoice() {
  const pick = () => {
    const voices = speechSynthesis.getVoices();
    const japanese = voices.filter(v => v.lang.startsWith('ja'));
    japaneseVoice = japanese.find(v => v.name.toLowerCase().includes('enhanced'))
      || japanese.find(v => v.localService)
      || japanese[0]
      || null;
  };
  pick();
  speechSynthesis.onvoiceschanged = pick;
}

loadVoice();

function speak(phrase, onDone) {
  if (!document.querySelector('#menu-speak').checked) return;
  if (!('speechSynthesis' in window)) return;

  const utt = new SpeechSynthesisUtterance(phrase);
  if (japaneseVoice) utt.voice = japaneseVoice;
  utt.lang = 'ja-JP';
  utt.volume = 1;
  utt.rate = 0.85;
  utt.pitch = 1.0;
  if (onDone) utt.onend = onDone;
  speechSynthesis.speak(utt);
}

function speakCards() {
  if (!document.querySelector('#menu-speak').checked) return;

  speechSynthesis.cancel();

  const cards = Array.from(document.querySelectorAll('.stack > .stack-item:first-child .japanese'));
  const phrases = cards.map(c => c.dataset.speak || c.textContent);

  if (phrases.length === 0) return;

  // Speak each phrase in sequence with a short pause between
  function speakNext(i) {
    if (i >= phrases.length) return;
    speak(phrases[i], () => setTimeout(() => speakNext(i + 1), 400));
  }
  speakNext(0);
}

function showSettings() {
  document.querySelector('body').classList.add("set-settings");
}

function hideSettings() {
  document.querySelector('body').classList.remove("set-settings");
}
