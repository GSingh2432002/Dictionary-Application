const wrapper = document.querySelector(".wrapper"), // Selects the first element with the class "wrapper" and assigns it to the variable "wrapper".
searchInput = wrapper.querySelector("input"),// Selects the first "input" element within "wrapper".
volume = wrapper.querySelector(".word i"), // Selects the first "i" element within an element with the class "word" inside "wrapper".
infoText = wrapper.querySelector(".info-text"), // Selects the first element with the class "info-text" inside "wrapper".
synonyms = wrapper.querySelector(".synonyms .list"), // Selects the first element with the class "list" inside an element with the class "synonyms" within "wrapper".
removeIcon = wrapper.querySelector(".search span"); // Selects the first "span" element inside an element with the class "search" within "wrapper".
let audio; // Declares a variable 'audio' without assigning a value.

// Defines a function 'data' that takes two parameters: 'result'(API response) and 'word'(searched word).
function data(result, word){
    // Checks if the "result" has a 'title' property which indicates an error.
    if(result.title){
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`; // Updates 'infoText' with an error message if the word is not found.
    // Executes if the word is found.
    }else{
        wrapper.classList.add("active"); // Adds the 'active' class to 'wrapper'.
        let definitions = result[0].meanings[0].definitions[0],
        phontetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`; // Retrieves the first definition from the API response.'Phontetics' construct a string with the part of speech and phonetic text.
        document.querySelector(".word p").innerText = result[0].word; // Updates the word displayed in the '.word p' element.
        document.querySelector(".word span").innerText = phontetics; // Updates the phonetic text displayed in the '.word span' element.
        document.querySelector(".meaning span").innerText = definitions.definition; // Updates the meaning displayed in the '.meaning span' element.
        document.querySelector(".example span").innerText = definitions.example; // Updates the example displayed in the '.meaning span' element.
        audio = new Audio("https:" + result[0].phonetics[0].audio); // Creates a new 'Audio' object for pronounciation.

        // Checks if there are no synonyms.
        if(definitions.synonyms[0] == undefined){
            synonyms.parentElement.style.display = "none"; // Hide the synonyms section if no synonyms are available.
        // Executes if synonyms are available.
        }else{
            synonyms.parentElement.style.display = "block"; // Displays the synonyms section.
            synonyms.innerHTML = ""; // Clears any existing synonyms.

            // Loops through teh first fivve synonyms.
            for (let i=0; i<5; i++){
                let tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[i]},</span>`; // Creates a span element for each synonym with an onclick event trigger a new search.
                tag = i == 4 ? tag = `<span onclick="search('${definitions.synonyms[i]}')">${definitions.synonyms[4]}</span>`:
                tag; // Removes the trailing comma for the last synonym.
                synonyms.insertAdjacentHTML("beforeend", tag); // Insert the synonym span elements into the synonyms list.
            }
        }
    }
}

// Defines a function 'search' that takes a 'word' as a parameter.
function search(word){
    fetchApi(word); // Calls the 'fetchApi' function with the given word.
    searchInput.value = word; // Updates the search input value with the word.
}

// Defines a function 'fetchApi' that takes a 'word' as a parameter.
function fetchApi(word){
    wrapper.classList.remove("active"); // Removes the 'active' class from 'wrapper'.
    infoText.style.color = "#000"; // Sets the text color of 'infoText' to black.
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`; // Updates 'infoText' with a searching message.
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`; // Constructs the API URL with the given word.
    fetch(url).then(response => response.json()).then(result => data(result, word)).catch(() =>  {
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
    });
    // fetch(url): Sends a request to the API.
    // .then(response => response.json()): Converts the response to JSON.
    // .then(result => data(result, word)): Calls the 'data' function with the API result and word.
    // .catch(() => ... ): Handles any error by displaying an error message in 'infoText'.
}

// Adds a keyup event listener to search input.
searchInput.addEventListener("keyup", e => {
    let word = e.target.value.trim(); // Removes extra spaces from the input value.
    if(e.key == "Enter" && word){
        fetchApi(word); // Calls 'fetchApi' if the Enter key is pressed and the input is not empty.
    }
});

// Adds a click event listener to the volume icon.
volume.addEventListener("click", ()=>{
    volume.style.color = "#4D59FB"; // Changes the volume icon color.
    audio.play(); // Plays the audio pronounciation.
    setTimeout(() => {
        volume.style.color = "#999";
    }, 800); // Resets the volume icon color after 800ms.
});

// Adds a click event listener to the remove icon.
removeIcon.addEventListener("click", () => {
    searchInput.value = ""; // Clears the search input.
    searchInput.focus(); // Focuses the search input.
    wrapper.classList.remove("active"); // Removes the 'active' class 'wrapper'.
    infoText.style.color = "#9A9A9A"; // Sets the text color of 'infoText' to gray.
    infoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc."; // Resets 'infoText' to the default message.
})