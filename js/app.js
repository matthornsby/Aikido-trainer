
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

  
  // Test to see if the browser supports the HTML template element by checking
  // for the presence of the template element's content attribute.
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

       for (const techniqueItem in techniques[techniqueSet]) {
        //clone the new item template
        const item = tItem.content.cloneNode(true);

        console.log(techniques[techniqueSet].list)

       }

       list.appendChild(set);
      

    }




  } else {
    console.log('no templates');
    // Find another way to add the rows to the table because
    // the HTML template element is not supported.
  }
}

