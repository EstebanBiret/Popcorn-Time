/*
__    ____      ________ _      _____ _   _ 
\ \   / /\ \    / /  ____| |    |_   _| \ | |
 \ \_/ /  \ \  / /| |__  | |      | | |  \| |
  \   /    \ \/ / |  __| | |      | | | . ` |
   | |      \  /  | |____| |____ _| |_| |\  |
   |_|       \/   |______|______|_____|_| \_|
*/

let success_modal = document.getElementById("success-modal");
let submit_button = document.getElementById("submit-button");

//partie création d'une oeuvre
function addEntry(event) {
    event.preventDefault();
    submit_button.disabled = true;

    const entry = {
        title: document.getElementById('title').value.trim(),
        imageUrl: document.getElementById('imageUrl').value.trim(),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        rating: document.getElementById('rating').value,
        comment: document.getElementById('comment').value.trim(),
        genre: document.getElementById('genre').value,
        plateforme: document.getElementById('plateforme').value,
        timestamp: new Date().getTime()
    };

    // Vérification que le titre et le genre sont bien renseignés
    if (!entry.title) {
        alert("Veuillez renseigner un titre.");
        submit_button.disabled = false;
        return;
    }
    if (!entry.genre) {
        alert("Veuillez sélectionner un genre.");
        submit_button.disabled = false;
        return;
    }
    if (!entry.plateforme) {
        alert("Veuillez sélectionner une plateforme.");
        submit_button.disabled = false;
        return;
    }

    //vérification des dates
    if (entry.endDate) {
        //si une date de fin est renseignée, on vérifie qu'il y a une date de début
        if (!entry.startDate) {
            alert("Veuillez renseigner une date de début si vous avez une date de fin.");
            submit_button.disabled = false;
            return;
        }

        //si les deux dates sont renseignées, on vérifie que la date de fin est après la date de début
        if(entry.startDate) {
            if (new Date(entry.endDate) < new Date(entry.startDate)) {
                alert("La date de fin ne peut pas être antérieure à la date de début !");
                submit_button.disabled = false;
                return;
            }
        }
    }

    //notation
    if(!entry.rating || isNaN(entry.rating) || entry.rating == null || entry.rating == "") {
        entry.rating = "";
    } else if (entry.rating === 0){
        entry.rating = 0;
    } else {
        entry.rating = Math.round(entry.rating * 10) / 10; //arrondi au dixième
    }

    //pas d'image ou format incorrect
    if (!entry.imageUrl || !entry.imageUrl.startsWith('http')) {
        entry.imageUrl = '../assets/no-image.jpg';
        saveEntry(entry);

    //lien correct
    } else {
        //on regarde sur Internet si cette image existe
        checkImageExists(entry.imageUrl, function(exists) {

            //image par défaut si elle n'existe pas
            if (!exists) {
                entry.imageUrl = '../assets/no-image.jpg';
            }
            saveEntry(entry);
        });
    }
}

//sauvegarder une oeuvre dans le localStorage
function saveEntry(entry) {
    let categoryKey = "";
    switch (entry.genre) {
        case "film":
            categoryKey = "entries-films";
            break;
        case "serie":
            categoryKey = "entries-series";
            break;
        case "anime":
            categoryKey = "entries-animes";
            break;
    }

    let entries = JSON.parse(localStorage.getItem(categoryKey)) || [];
    entries.push(entry);
    localStorage.setItem(categoryKey, JSON.stringify(entries));

    openSuccessModal();
}

//vérifier si l'image fournie existe sur Internet #jeSurfeSurLeWebJeSuisUnMecCool
function checkImageExists(url, callback) {
    let img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { 
        callback(false); 
    };
    img.src = url;
}

function redirectHome() {
    window.location.href = "index.html";
}

function closeSuccessModal() {
    success_modal.style.display = "none";
}

function openSuccessModal() {
    success_modal.style.display = "flex";
}

function closeAndResetSuccessModal() {
    closeSuccessModal();
    document.getElementById('addEntryForm').reset();
    submit_button.disabled = false;
}

//on ferme aussi si on clique en dehors
window.onclick = function(event) {
    if (event.target === success_modal) {
        closeAndResetSuccessModal();
    }
};

//et si echap pressé
document.onkeydown = function(evt) {
    if (evt.key === "Escape") {
        closeAndResetSuccessModal();
    }
    else if (evt.key === "F12") {
        alert("Bon allez ... 😏");
    }
};

//attachement de l'événement au formulaire
document.getElementById('addEntryForm').addEventListener('submit', addEntry);

//vérification et ajustement de la note
document.getElementById('rating').addEventListener('input', function () {
    let value = parseFloat(this.value);
    if (isNaN(value) || value < 0) {
        this.value = "";
    } else if (value > 10) {
        this.value = "10";
    }
});