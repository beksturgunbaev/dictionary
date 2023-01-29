const results = document.querySelector('.results');
const input = document.getElementById('word-input');
const wordContainer = document.querySelector('.results-word');
const form = document.querySelector('.form');
const soundBtn = document.querySelector('.results-sound');
const resultsList = document.querySelector('.results-list');

const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

let state = {
    word: "",
    meanings: [],
    phonetics: []
}

// Functions:

const handleKeyup = (e) => {
    let value = e.target.value;
    state.word = value;
}
const renderDefinition = (itemDefinition) => {
    const example = itemDefinition.example
    ? `<div class="results-item__example">
        <p>Example: <span>${itemDefinition.example}</span></p>
    </div>`
    : "";
    return `<div class="results-item__definition">
                <p>${itemDefinition.definition}</p>
                ${example}
            </div>`
}
const getDefinition = (definitions) => {
    return definitions.map(renderDefinition).join("");
}
const renderItem = (item) => {
    console.log(getDefinition(item.definitions))

    const itemDefinition = item.definitions[0];
    return `<div class="results-item">
                <div class="results-item__part">${item.partOfSpeech}</div>
                <div class="results-item__definitions">
                    ${getDefinition(item.definitions)}
                </div>
            </div>`;
}
const showResults = () => {
    resultsList.innerHTML = "";
    results.style.display = "block";

    state.meanings.forEach((item) => resultsList.innerHTML += renderItem(item));
}
const handleSubmit = async (e) => {
    e.preventDefault();

    if(!state.word.trim()) return;

    try {
        const res = await fetch(`${url}${state.word}`);
        const data = await res.json();
        
        if(res.ok && data.length) {
            const item = data[0];
            state = {
                ...state,
                meanings: item.meanings,
                phonetics: item.phonetics
            }
            wordContainer.innerText = state.word;
            showResults();
        }
    } catch (error) {
        console.log(error)
    }

}

const handleSound = () => {
    if(state.phonetics.length) {
        const sound = state.phonetics[0];
        
        if(sound.audio) {
            new Audio(sound.audio).play();
        }
    }
}


// Events:

input.addEventListener('keyup', handleKeyup);
form.addEventListener('submit', handleSubmit);
soundBtn.addEventListener('click', handleSound);