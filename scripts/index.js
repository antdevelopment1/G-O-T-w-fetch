//
//  const URL = "https://my-little-cors-proxy.herokuapp.com/https://anapioficeandfire.com/api/characters/?page=1&pageSize=50";
let allCharactersArray = [];

function urlForPage(pageNumber = 0) {
    return `https://my-little-cors-proxy.herokuapp.com/https://anapioficeandfire.com/api/characters/?page=${pageNumber}&pageSize=50`;
}

function accumulateCharacters(theActualData) {
    allCharactersArray = [
        ...allCharactersArray,
        ...theActualData
    ];
    storeCharacters(allCharactersArray);
    if (theActualData.length === 0) {
        main();
    }
}

const storageKey = 'game-of-thrones';

function storeCharacters(arrayOfCharacters) {
    const jsonCharacters = JSON.stringify(arrayOfCharacters);
    console.log(`saving ${arrayOfCharacters.lenght} characters`);
    localStorage.setItem(storageKey, jsonCharacters);
}

function loadCharacters() {
    const jsonCharacters = localStorage.getItem(storageKey);
    const arrayOfCharacters = JSON.parse(jsonCharacters);
    if (arrayOfCharacters) {
        console.log(`loaded ${arrayOfCharacters.length} characters`);
    } else {
        console.log('No characters in localStorage');
    }
    return arrayOfCharacters;
}

function retrievePageOfCharacters(pageNumber) {
    fetch(urlForPage(pageNumber))
        .then(function (response) {
            return response.json();
        })
        .then(accumulateCharacters)
        .then(function () {
            console.log(`Done with page ${pageNumber}`);
    })
}

function drawCharacterToDetail(characterObject) {
    console.log(characterObject);
    console.log('That was what got passed in');
    const detailArea = document.querySelector('[data-detail]');
    detailArea.textContent = '';

    const nameDiv = document.createElement('div');
    const bornDiv = document.createElement('div');
    const diedDiv = document.createElement('div');

    nameDiv.textContent = `Name: ${characterObject.name}`;
    bornDiv.textContent = `Born: ${characterObject.born}`;
    diedDiv.textContent = `Died: ${characterObject.died}`;
    
    detailArea.appendChild(nameDiv);    
    detailArea.appendChild(bornDiv);    
    detailArea.appendChild(diedDiv);    
}

function findCharacterInArray(url) {
    return allCharactersArray.find(function (character) {
        return character.url === url;
    });
}

function drawSingleCharacterToListing(characterObject) {

    const characterName = characterObject.name;
    if (characterName.length === 0) {
        return;
    }

    const anchorElement = document.createElement('a');
    anchorElement.textContent = characterName;
    anchorElement.addEventListener('click', function () {
        drawCharacterToDetail(characterObject);
    });

    const listItem = document.createElement('li');
    listItem.appendChild(anchorElement);

    const listArea = document.querySelector('[data-listing]');
    listArea.appendChild(listItem);
}

function drawListOfCharacters(characters = allCharactersArray) {
    const listArea = document.querySelector('[data-listing]');
    listArea.textContent = '';
    characters.forEach(drawSingleCharacterToListing);
}
function sortByName(obj1, obj2) {
    const letter1 = obj1.name[0];
    const letter2 = obj2.name[0];

    if (letter1 < letter2) {
        return -1;
    } else if (letter2 < letter1) {
        return 1;
    }
    return 0;
}

function filterByLetter(letter) {
    console.log(letter);
    if (letter.length === 1) {
        const filtered = allCharactersArray.filter(function (character) {
            return character.name.startsWith(letter.toUpperCase());
        });
        console.log(`drawing for ${letter}`);
        drawListOfCharacters(filtered);
    } else {
        console.lof('drawing all');
        drawListOfCharacters();
    }
}

function attachClickToLetters() {
    const letters = document.querySelectorAll('[data-index] a');
    letters.forEach(function (letter) {
        letter.addEventListener('click', function () {
            filterByLetter(letter.textContent);
        });
    });
}

function main() {
    let charactersInLocalStorage = loadCharacters();
    if (charactersInLocalStorage) {
        allCharactersArray = [
            ...charactersInLocalStorage.sort(sortByName)
        ];
        drawListOfCharacters();
        attachClickToLetters();
    } else {
        console.log("You got a whole lot of nothing!")
        console.log("Retrieving from the API...")
        for (let pageNumber = 0; pageNumber < 50; pageNumber++) {
            let delay = pageNumber * 500;

            setTimeout(function () {
                retrievePageOfCharacters(pageNumber);
            }, delay);
        }
    }
}

main();
