const { getData, saveData } = require('./api');
const fs = require('fs');
const sha1 = require('sha1');
const FormData = require('form-data');

async function getInfo() {
  const response = await getData();
  return response.data;
}

async function decrypt () {
  const {numero_casas, cifrado} = await getInfo();
 
  let phrase = [];

  for (let i = 0; i < cifrado.length; i++ ) {

    let letter = cifrado[i].charCodeAt();
    letter -= numero_casas;

    if (letter >= 97 && letter <= 122) {
      phrase.push( String.fromCharCode(letter));
    } else if ( letter < 97 && letter < 97-numero_casas ) {
      phrase.push( String.fromCharCode( letter + numero_casas ));
    } else if ( letter < 97 ) {
      let offset =  97 - letter;
      
      phrase.push( String.fromCharCode( 123 - offset ) );
    }
  }
  
  return phrase.join('');
}

async function createAnswer() {

  const { numero_casas, token, cifrado } = await getInfo();
  const phrase = await decrypt();
  const resume = sha1( phrase );

  const data = {
    "numero_casas": numero_casas,
    "token": token,
    "cifrado": cifrado,
    "decifrado": phrase,
    "resumo_criptografico": resume
  }

  fs.writeFileSync('answer.json', JSON.stringify( data ));
}

async function sendFile() {
  const form = new FormData();

  form.append('answer', fs.createReadStream('./answer.json'));


  await saveData( form );
}



async function main () {
  await decrypt();
  await createAnswer();
  await sendFile();
}

main();