
if (localCheck){


 
} 


//-------//

async function fetchTechniques() {
  const response = await fetch('data/data.json');

  response.ok;     // => false
  response.status; // => 404

  const techniques = await response.json();
  return techniques;
}


fetchTechniques().then(techniques => {
  //console.log(techniques);
  
  //app
  writeStack(techniques.attacks,  '#attack');
  writeStack(techniques.techniques,  '#response');

  rotateStacks();

  var cards = document.querySelectorAll('.stack-item button');
  
  //console.log(cards);
  
  document.querySelectorAll('.stack-item button').forEach(card => {
    
    card.addEventListener('click', function() {

      //discard existing card, reveal new card
      discard(card);

      speakCards();
      
    } );
  });

  //settings
  writeSettings(techniques.attacks, 'attacks', '#settings-attacks .settings-set');
  writeSettings(techniques.techniques, 'responses', '#settings-responses .settings-set');

  }
);

document.querySelector('#new-cards button').addEventListener('click', function() {

  document.querySelectorAll('.stack-item:first-child button').forEach(card => {
    //console.log(card);
      discard(card);
  });

  speakCards();
  
});

function writeStack(data, element) {
  //console.log(techniques.attacks.list);

  const list = document.querySelector(element);

  function Attacks() {
    //console.log(techniques.attacks.list);

    var techniqueList = rateWeight(data.list);

    shuffle(techniqueList);
    
    return techniqueList.map(attack =>
      <li class="stack-item" id={"stack-item-" + attack.id}>
        <button type="button">
          <span class="english" lang="en-US">{attack.english}</span> 
          <span class="japanese" lang="ja-JP">{attack.japanese}</span>
        </button>
      </li>
    );

  }
  ReactDOM.render(<Attacks/>, list);
}

function handleChange(event){
  this.setState({selected: !this.state.selected});
}



function writeSettings(data, key, element) {

  const list = document.querySelector(element);

  
  function Settings() {
    //console.log(techniques.attacks.list);
    
    return data.list.map(technique =>
      <li class="settings-set-item">
        <label class="toggle-component">
          <span class="toggle-lable">{technique.english}</span>
          <input 
            name={key + "-" + technique.id} 
            id={key + "-" + technique.id}
            type="checkbox" 
            class="toggle-checkbox" 
            defaultChecked="checked"
            onChange={e => uncheckItem(e.target)}
            ></input>
          <span class="toggle-switch"></span>
        </label>
        </li>
    );

  }

  ReactDOM.render(<Settings/>, list);
}

function uncheckItem(target){
  console.log(target.id + " - " + target.checked)
}


function rotateStacks (){

  var cards = document.querySelectorAll('.stack-item');
  
  //console.log(cards.length);

  for(let i = 0; i < cards.length; i++) {

    //get a random rotation between -3 and 3
    var rotate = Math.random() * (3 - (-3)) + (-3);

    //console.log(cards[i]);

    //console.log(Math.round(rotate));
    
    //rotate each card just a little
    cards[i].style.setProperty('--card-angle', `${ rotate }deg`);

  }

}

function rateWeight(list){

  var returnList = [];

    for (const i in list) {
      
      var item = list[i];
     
      var repeat = 1;
      if (item.rate){
        repeat = item.rate
      } 

      for (let i = 0; i < repeat; i++) {
        returnList.push(item);
      }
      
    }

    return returnList;
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function discard(card){

  var thisCard = card.parentElement;
      //the cards's stack
      var stack = card.closest('.stack');

      //move top card to the bottom of the stack
      stack.appendChild(thisCard);
}


function speak(phrase){

  if ( document.querySelector('#menu-speak').checked ){
    if ('speechSynthesis' in window) {
      // Speech Synthesis supported
    
      const jap = new SpeechSynthesisUtterance();
      //var voices = window.speechSynthesis.getVoices();
  
      //clear the queue so phrases don't stack up pn repeat
      speechSynthesis.cancel();
    
      //voice config
      //jap.voice = voices[2]; 
      jap.volume = 1; // From 0 to 1
      jap.rate = .9; // From 0.1 to 10
      jap.pitch = 1.2; // From 0 to 2
      jap.lang = 'ja-JP';
  
      //set the phrase to speak
      jap.text = phrase;
      
      console.log('Speaking');
      speechSynthesis.speak(jap);  
    
     }else{
       // Speech Synthesis Not Supported
       console.log('no words for you')
     }
  } else {
    console.log('shhhh')
  }

  
}

function speakCards(){
  var phrase = "";
      var cards = document.querySelectorAll('.stack > .stack-item:first-child .japanese');
      
      cards.forEach( function(card){
        phrase += card.textContent + ", ";
      });

      //console.log(userSettings);

       speak(phrase);
       console.log(phrase);
}

function localCheck(){
  if (typeof(Storage) !== "undefined") {
    //supports local storage
    return true
    } else {
    // No web storage Support.
    return true
    }
}

function getLocal(){

}

function setLocal(){

}

function showSettings(){
  document.querySelector('body').classList.add("set-settings");
}

function hideSettings(){
  document.querySelector('body').classList.remove("set-settings");
}