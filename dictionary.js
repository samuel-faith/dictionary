// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const errorMessage = document.getElementById('error-message');
const wordInfoSection = document.getElementById('word-info');
const playAudioButton = document.getElementById('play-audio');
const themeToggle = document.querySelector('.theme-toggle');
const toggleSwitch = document.querySelector('.toggle-switch');
const slider = document.querySelector('.slider');

// Event Listeners
searchForm.addEventListener('submit', handleSearch);
playAudioButton.addEventListener('click', playAudio);
toggleSwitch.addEventListener('click', toggleTheme);

// Handle Search Form Submission
async function handleSearch(event) {
    event.preventDefault();
    const word = searchInput.value.trim();

    if (!word) {
        errorMessage.classList.remove('hidden');
        return;
    }

    errorMessage.classList.add('hidden');

    try {
        const data = await fetchWordDefinition(word);
        updateWordInfo(data[0]); // Assuming the API returns an array
    } catch (error) {
        console.error('Error fetching word definition:', error);
        wordInfoSection.innerHTML = `<p>Error: Could not find the word "${word}". Please try again.</p>`;
    }
}

// Fetch Word Definition from API
async function fetchWordDefinition(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!response.ok) {
        throw new Error('Word not found');
    }
    return response.json();
}

// Update DOM with Word Information
function updateWordInfo(data) {
    const { word, phonetic, meanings, phonetics } = data;

    // Update word and pronunciation
    wordInfoSection.innerHTML = `
        <h2>${word}</h2>
        <p> ${phonetic || 'Not available'}</p>
    `;

    // Update meanings
    meanings.forEach(meaning => {
        const partOfSpeech = meaning.partOfSpeech;
        const definitions = meaning.definitions.map(def => `<li>${def.definition}</li>`).join('');
        wordInfoSection.innerHTML += `
            <h3>${partOfSpeech}</h3>
            <ul>${definitions}</ul>
        `;
    });

    // Update audio button if audio is available
    const audio = phonetics.find(phonetic => phonetic.audio)?.audio;
    if (audio) {
        playAudioButton.style.display = 'inline-block';
        playAudioButton.dataset.audio = audio;
    } else {
        playAudioButton.style.display = 'none';
    }
}

// Play Audio Pronunciation
function playAudio() {
    const audioUrl = playAudioButton.dataset.audio;
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    }
}

// Toggle Light/Dark Theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);

    // Update slider position
    slider.style.transform = newTheme === 'dark' ? 'translateX(25px)' : 'translateX(2px)';
}