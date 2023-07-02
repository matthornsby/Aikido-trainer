
async function fetchTechniques() {
  const response = await fetch('data/data.json');

  response.ok;     // => false
  response.status; // => 404

  const techniques = await response.json();
  return techniques;
}


fetchTechniques().then(techniques => {
  //console.log(techniques);
  writeList(techniques);
}
);


function writeList(techniques) {

  
  // Test to see if the browser supports the HTML template element by checking, for the presence of the template element's content attribute.
  if ('content' in document.createElement('template')) {
    // Instantiate the table with the existing HTML tbody
    // and the row with the template
    const list = document.querySelector('#list');
    const tSet = document.querySelector('#technique-set');
    const tItem = document.querySelector('#technique-item');



    for (const techniqueSet in techniques) {
      //console.log(techniques[techniqueSet].name);
      
      // clone the new set template
       const set = tSet.content.cloneNode(true);

       //add the set name
       set.querySelector('li').prepend(techniques[techniqueSet].name);

       for (const techniqueItem in techniques[techniqueSet].list) {
        //clone the new item template
        const item = tItem.content.cloneNode(true);

        //console.log(techniques[techniqueSet].list[techniqueItem]);

        item.querySelector('.english').append(techniques[techniqueSet].list[techniqueItem].english);
        item.querySelector('.japanese').append(techniques[techniqueSet].list[techniqueItem].japanese);


       var rateModifier = 1;

        if (techniques[techniqueSet].list[techniqueItem].rate){
          rateModifier = techniques[techniqueSet].list[techniqueItem].rate;
        }

        //console.log(rateModifier)

        for(let i = 0; i < rateModifier; i++){
          console.log(techniques[techniqueSet].list[techniqueItem].english);
          set.querySelector('.technique-list').append(item);
        }
        

       }

       list.appendChild(set);
    

    }

  } else {
    console.log('no templates');
    // Find another way to add the rows to the table, because the HTML template element is not supported.
  }
}



if ('speechSynthesis' in window) {
  // Speech Synthesis supported

  var jap = new SpeechSynthesisUtterance();
  //var voices = window.speechSynthesis.getVoices();

  //console.log(voices);


  //jap.voice = voices[2]; 
  jap.volume = 1; // From 0 to 1
  jap.rate = 1; // From 0.1 to 10
  jap.pitch = 1; // From 0 to 2
  jap.text = "片手取り両手持ち";
  jap.lang = 'ja-JP';
  //speechSynthesis.speak(jap);




 }else{
   // Speech Synthesis Not Supported
   //alert("Sorry, your browser doesn't support text to speech!");
 }
