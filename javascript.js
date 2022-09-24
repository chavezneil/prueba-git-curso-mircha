const d = document,
  $form = d.querySelector("form"),
  $meaning = d.querySelector(".meaning"),
  API = "https://api.dictionaryapi.dev/api/v2/entries/en/";

const retrieveWord = (word) => {
  fetch(`${API}${word}`)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      console.log(json);

      let meanings = "";

      json[0].meanings.forEach((el) => {
        console.log(el);
        let definitionText = ""
        el.definitions.forEach( definition => definitionText += `<p class="definition"> ${definition.definition}</p> <br>`);
        meanings += `
                <p>${el.partOfSpeech}:</p>
                <p>${definitionText}</p>
            `;
      });

      $meaning.innerHTML = `
            <h2><strong> ${json[0].word} </strong></h2>
            <p>Phonetics: ${json[0].phonetics[1] ? json[0].phonetics[1].text : json[0].phonetics[0].text} <p>
            <br>
            <p> ${meanings}</p>
        
        `;
    })
    .catch(async (err) => {
      console.log(err);
      if (err.status === 404) {
        let data = await err.json();
        // console.log(data)
        $meaning.innerHTML = `
            <h2> ${data.title}</h2>
            <br>
            <div><strong>${data.message}</strong></div>
            <p> <small> ${data.resolution}</small></p>
            `;
      } else {
        let message = err.responseText || "Something went wrong :( ";
        $meaning.innerHTML = `
            <div>${message}</div>
            `;
      }
    });
};

d.addEventListener("submit", (e) => {
  if (e.target.matches("form")) {
    e.preventDefault();
    retrieveWord(e.target.search_word.value);
  }
});
