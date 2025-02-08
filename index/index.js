/*
   _____            _                  
  / ____|          | |                 
 | (___  _   _ _ __| |_ ___  _ __ ___  
  \___ \| | | | '__| __/ _ \| '_ ` _ \ 
  ____) | |_| | |  | || (_) | | | | | |
 |_____/ \__,_|_|   \__\___/|_| |_| |_|
                                       
*/

//cowboy bebop
let comment_modal = document.getElementById("comment-modal");
let status_modal = document.getElementById("status-modal");
let rating_modal = document.getElementById("rating-modal");
let stats_modal = document.getElementById("stats-modal");
const categories = ['films', 'series', 'animes', 'favoris'];

//charger l'ensemble des oeuvres
function loadEntries() {
    const favoris = JSON.parse(localStorage.getItem('entries-favoris')) || [];
    categories.forEach(category => {
        const entries = JSON.parse(localStorage.getItem(`entries-${category}`)) || [];
        const container = document.getElementById(`entries-${category}`);
        const titleContainer = document.getElementById(`container-${category}`);
        const titleContent = titleContainer.querySelector('.titre-section')
        container.innerHTML = '';

        if (entries.length !== 0) {
            //on ajoute le titre seulement si la catégorie contient des œuvres
            if (!titleContent) {
                const title = document.createElement('h2');
                title.classList.add('titre-section');
                title.textContent = `${formatCategoryName(category)} (${entries.length})`;

                //pliable/dépliable
                const toggleText = document.createElement('span');
                toggleText.classList.add('toggle-text');
                toggleText.textContent = "Tout replier";
                toggleText.style.cursor = "pointer";

                toggleText.addEventListener('click', () => {
                    toggleSection(category);
                    toggleText.textContent = container.style.display === "none" ? "Tout déplier" : "Tout replier";
                });

                title.appendChild(toggleText);
                titleContainer.insertBefore(title, container);
            }
            else {
                //mettre à jour le nombre d'œuvres si le titre existe déjà
                titleContent.textContent = `${formatCategoryName(category)} (${entries.length})`;

                //pliable/dépliable
                const toggleText = document.createElement('span');
                toggleText.classList.add('toggle-text');
                toggleText.textContent = "Tout replier";
                toggleText.style.cursor = "pointer";
 
                toggleText.addEventListener('click', () => {
                    toggleSection(category);
                    toggleText.textContent = container.style.display === "none" ? "Tout déplier" : "Tout replier";
                });
 
                titleContent.appendChild(toggleText);
            }

            entries.forEach((entry, index) => {
                if(entry) {
                    let platformImage;
                    if(entry.startDate === "" || entry.startDate === null || !entry.startDate) entry.startDate = "Pas commencé";
                    if(entry.endDate === "" || entry.endDate === null || !entry.endDate) entry.endDate = "Pas terminé";
                    
                    //choix de l'image de la plateforme
                    if(entry.plateforme) {
                        const platformImages = {
                            "netflix": "../assets/platforms/netflix.webp",
                            "amazon": "../assets/platforms/amazon.webp",
                            "disney+": "../assets/platforms/disney+.webp",
                            "canalvod": "../assets/platforms/canalvod.png",
                            "crunchyroll": "../assets/platforms/crunchyroll.png",
                            "ocs": "../assets/platforms/ocs.png",
                            "adn": "../assets/platforms/adn.png",
                            "yt": "../assets/platforms/yt.png",
                            "tele": "../assets/platforms/tele.svg"
                        };
                        platformImage = platformImages[entry.plateforme] || '../assets/platforms/autre.svg';      
                    }
                    else {
                        platformImage ='../assets/platforms/autre.svg';
                    }                  
                    

                    //détermination du statut et des couleurs
                    let statusText = "Pas commencé";
                    let statusClass = "status-not-started";
                    let statusOnClick = `openStatusModal('${category}', ${index})`;
                    let statusIcon = `<img src="../assets/edit.svg" class="status-icon" alt="Modifier statut" title="Modifier le statut">`;

                    if ((entry.startDate != "Pas commencé" && entry.startDate != "") && (!entry.endDate || entry.endDate === "Pas terminé" || entry.endDate === "")) {
                        statusText = "En cours";
                        statusClass = "status-in-progress";
                    } else if ((entry.startDate != "Pas commencé" && entry.startDate != "") && (entry.endDate != "Pas terminé" && entry.endDate != "")) {
                        statusText = "Terminé";
                        statusClass = "status-completed";
                        statusOnClick = "";
                        statusIcon = "";
                    }

                    //vérifier si l'œuvre est dans les favoris
                    const isFavorite = favoris.some(fav => fav.timestamp === entry.timestamp);
                    const heartIcon = isFavorite ? "../assets/full-heart.svg" : "../assets/heart.svg";
                    const titleHeartIcon = isFavorite ? "Retirer des favoris" : "Ajouter aux favoris";

                    let truncatedComment = entry.comment.length > 20 ? `"${entry.comment.substring(0, 20)}..." (voir plus)` : `"${entry.comment}"`;

                    let commentHtml = entry.comment ? 
                    `<span class="comment ${entry.comment.length > 20 ? 'clickable' : ''}" onclick="${entry.comment.length > 20 ? `showComment('${entry.comment.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')` : ''}">${truncatedComment}</span>`
                    : `<span class="no-value">Aucun commentaire</span>`;

                    container.innerHTML += `
                        <div class="entry">
                            <strong class="title-card">${entry.title}</strong>

                            <a href="${entry.imageUrl}" target="_blank">
                                <img class="entry-image" src="${entry.imageUrl}" alt="Image" title="Voir l'image">
                            </a>  

                            <div class="entry-content">
                            <div class="entry-details">

                                <span class="date-span">${formatDate(entry.startDate)} - ${formatDate(entry.endDate)}</span>

                                ${category !== "favoris" ? `
                                    <span class="status-badge ${statusClass}" onclick="${statusOnClick}">
                                        ${statusText} ${statusIcon}
                                    </span>
                                ` : `
                                    <span class="status-badge ${statusClass} disabled">
                                        ${statusText}
                                    </span>
                                `}

                                <span class="status-badge rating-badge ${category === "favoris" ? "disabled" : ""}"
                                    ${category === "favoris" ? "" : `onclick=\"openRatingModal('${category}', ${index})\"`}>
                                    <img src="../assets/star.svg" alt="Étoile" width="20px">
                                    ${entry.rating !== null && entry.rating !== undefined && entry.rating !== "" ? `${entry.rating}/10` : `<span class="no-value">Pas noté</span>`}
                                    ${category !== "favoris" ? `<img src="../assets/edit.svg" class="status-icon" alt="Modifier notation" title="Modifier la notation">` : ""}
                                </span>

                                <span class="status-badge comment-badge">
                                    <img src="../assets/comment.svg" alt="Commentaire" width="20px">
                                    ${commentHtml}
                                </span>

                               </div> 
                                <div class="entry-footer">
                                    <img class="platform-logo" src="${platformImage}" alt="Plateforme" width="60px" title="Plateforme de visionnage">
                                    <div class="actions">
                                        ${category !== "favoris" ? `<img src="../assets/bin.png" class="icons" alt="Supprimer" width="40px" onclick="deleteEntry('${category}', ${index})" title="Supprimer">` : ""}
                                        <img id="heart-icon-${category}-${index}" class="icons" src="${heartIcon}" alt="Favoris" width="40px" onclick="toggleFavorite('${category}', ${index})" title="${titleHeartIcon}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
            });

            //on affiche le tri
            document.getElementById(`sort-options-${category}`).style.display = "flex";

        } else {
            document.getElementById(`no-entries-${category}`).style.display = "flex";
            container.style.display = "none";

            //masquer le tri
            document.getElementById(`sort-options-${category}`).style.display = "none";

            if (titleContent) {
                titleContainer.removeChild(titleContent); //on retire le titre si aucune œuvre n'est présente
            }
        }
        checkEntries(category);
    });
}

//supprimer une oeuvre
function deleteEntry(category, index) {
    let  entries = JSON.parse(localStorage.getItem(`entries-${category}`)) || [];
    let  favoris = JSON.parse(localStorage.getItem('entries-favoris')) || [];
    const entryToDelete = entries[index];

    //supprimer l'œuvre de sa catégorie
    entries.splice(index, 1);
    localStorage.setItem(`entries-${category}`, JSON.stringify(entries));

    //supprimer l'œuvre des favoris
    favoris = favoris.filter(fav => 
        !(fav.timestamp === entryToDelete.timestamp)
    );
    localStorage.setItem('entries-favoris', JSON.stringify(favoris));

    loadEntries();
}

//supprimer toutes les oeuvres
function deleteAllEntries() {
    const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer toutes les œuvres ?");
    
    if (confirmDelete) {
        //utilisateur confirme, on supprime les 4 items dans le localStorage s'ils existent
        localStorage.removeItem('entries-films');
        localStorage.removeItem('entries-series');
        localStorage.removeItem('entries-animes');
        localStorage.removeItem('entries-favoris');
        
        loadEntries();
    }
}

//affichage dynamique des titres de sections 
function checkEntries(category) {
    const container = document.getElementById(`entries-${category}`);
    if (container.innerHTML === '' || !localStorage.getItem(`entries-${category}`) || localStorage.getItem(`entries-${category}`) === "[]") {
        document.getElementById(`no-entries-${category}`).style.display = "flex";
        container.style.display = "none";
    } else {
        document.getElementById(`no-entries-${category}`).style.display = "none";
        container.style.display = "grid";
    }
}

//ajouter une oeuvre aux favoris
function toggleFavorite(category, index) {
    let entries = JSON.parse(localStorage.getItem(`entries-${category}`)) || [];
    let entry = entries[index];
    let favoris = JSON.parse(localStorage.getItem('entries-favoris')) || [];
    const favoriteIndex = favoris.findIndex(fav => fav.timestamp === entry.timestamp);

    if (favoriteIndex === -1) {
        favoris.push(entry);
    } else {
        favoris.splice(favoriteIndex, 1);
    }

    localStorage.setItem('entries-favoris', JSON.stringify(favoris));
    loadEntries();
}

//formatage des 2 dates
function formatDate(dateString) {
    if (!dateString || dateString === "Pas commencé" || dateString === "Pas terminé") return "?";
    const parts = dateString.split("-");
    return parts.length === 3 ? `${parseInt(parts[2])}/${parseInt(parts[1])}/${parts[0]}` : "?";
}

//affichage du commentaire complet
function showComment(comment) {
    const formattedComment = comment.replace(/\\n/g, "<br>");
    document.getElementById("full-comment").innerHTML = formattedComment;
    comment_modal.style.display = "flex";
}

//plier/déplier une section
function toggleSection(category) {
    const container = document.getElementById(`entries-${category}`);
    const tri = document.getElementById(`sort-options-${category}`);

    if (container.style.display === "none") {
        container.style.display = "grid"; //afficher la section
        tri.style.display = "flex" //afficher le tri
    } else {
        container.style.display = "none"; //masquer la section
        tri.style.display = "none" //masquer le tri
    }
}

//CHANGEMENT STATUT
let currentCategory = "";
let currentIndex = 0;
let modifyingStartDate = true; //définit si on modifie la date de début ou de fin

//on prépare la fenêtre modale pour changer le statut, et on l'affiche
function openStatusModal(category, index) {
    let entries = JSON.parse(localStorage.getItem(`entries-${category}`)) || [];
    let entry = entries[index];

    currentCategory = category;
    currentIndex = index;

    const statusDateInput = document.getElementById("status-date");
    const modalTitle = document.getElementById("modal-title");

    if (!entry.startDate || entry.startDate === "Pas commencé" || entry.startDate === "") {
        modifyingStartDate = true;
        modalTitle.textContent = "Date de début de visionnage";
        statusDateInput.value = "";
    } else if (!entry.endDate || entry.endDate === "Pas terminé" || entry.endDate === "") {
        modifyingStartDate = false;
        modalTitle.textContent = "Date de fin de visionnage";
        statusDateInput.value = "";
    } else {
        return;
    }
    status_modal.style.display = "flex";
}

//on enregistre le changement de statut et les dates de l'oeuvre
function saveStatusChange() {
    let entries = JSON.parse(localStorage.getItem(`entries-${currentCategory}`)) || [];
    let entry = entries[currentIndex];
    let favoris = JSON.parse(localStorage.getItem('entries-favoris')) || [];

    const statusDateInput = document.getElementById("status-date").value;

    if (!statusDateInput) {
        alert("Veuillez sélectionner une date valide.");
        return;
    }

    //vérification que la date de fin soit >= à la date de début
    if (!modifyingStartDate) {
        let startDate = entry.startDate;
        if (startDate && statusDateInput < startDate) {
            alert("La date de fin ne peut pas être antérieure à la date de début !");
            return;
        }
    }

    //maj la date correspondante
    if (modifyingStartDate) {
        entry.startDate = statusDateInput;
    } else {
        entry.endDate = statusDateInput;
    }

    localStorage.setItem(`entries-${currentCategory}`, JSON.stringify(entries));

    //maj l'œuvre dans les favoris si elle y est
    const favIndex = favoris.findIndex(fav => fav.timestamp === entry.timestamp);
    if (favIndex !== -1) {
        favoris[favIndex].startDate = entry.startDate;
        favoris[favIndex].endDate = entry.endDate;
        localStorage.setItem('entries-favoris', JSON.stringify(favoris));
    }

    //on ferme et on rafraîchit
    closeStatusModal();
    loadEntries();
}

//CHANGEMENT NOTATION
let currentCategoryRating = "";
let currentIndexRating = 0;

//on prépare la fenêtre modale pour changer la notation, et on l'affiche
function openRatingModal(category, index) {
    let entries = JSON.parse(localStorage.getItem(`entries-${category}`)) || [];
    let entry = entries[index];

    currentCategoryRating = category;
    currentIndexRating = index;

    const ratingInput = document.getElementById("rating-number");
    ratingInput.value = entry.rating || "";
    rating_modal.style.display = "flex";
}

//on enregistre le changement de notation
function saveRatingChange() {
    let entries = JSON.parse(localStorage.getItem(`entries-${currentCategoryRating}`)) || [];
    let entry = entries[currentIndexRating];
    let favoris = JSON.parse(localStorage.getItem('entries-favoris')) || [];

    let ratingInput = document.getElementById("rating-number").value;

    if (ratingInput < 0 || ratingInput > 10) {
        alert("Veuillez sélectionner une notation valide.");
        return;
    }
    else if (!ratingInput || ratingInput === "" || isNaN(ratingInput) || ratingInput == null) {
        entry.rating = "";
    }
    else if(ratingInput === 0) {
        entry.rating = 0;
    }
    else {
        ratingInput = Math.round(ratingInput * 10) / 10; //arrondi au dixième
        entry.rating = ratingInput;
    }

    localStorage.setItem(`entries-${currentCategoryRating}`, JSON.stringify(entries));

    //maj l'œuvre dans les favoris si elle y est
    const favIndex = favoris.findIndex(fav => fav.timestamp === entry.timestamp);
    if (favIndex !== -1) {
        favoris[favIndex].rating = entry.rating;
        localStorage.setItem('entries-favoris', JSON.stringify(favoris));
    }

    //on ferme et on rafraîchit
    closeRatingModal();
    loadEntries();
}

//maj des stats
function updateStatsModal() {
    let totalEntries = 0;
    let ratings = [];
    let platformCount = {};
    let firstEntry = null;
    let lastEntry = null;

    let stats = {
        films: 0,
        series: 0,
        animes: 0,
        favoris: 0
    };

    const categories = ['films', 'series', 'animes'];

    categories.forEach(category => {
        const entries = JSON.parse(localStorage.getItem(`entries-${category}`)) || [];
        stats[category] = entries.length;
        totalEntries += entries.length;

        entries.forEach(entry => {
            // Notation moyenne (favoris exclus)
            if (entry.rating !== "" && entry.rating !== null && entry.rating !== undefined) {
                ratings.push(parseFloat(entry.rating));
            }

            // Plateformes les plus utilisées (favoris exclus)
            if (entry.plateforme) {
                let platformKey = entry.plateforme.toLowerCase();
                platformCount[platformKey] = (platformCount[platformKey] || 0) + 1;
            }

            // Dates d'ajout + Nom + Catégorie
            if (entry.timestamp) {
                let entryDate = new Date(entry.timestamp);

                if (!firstEntry || entryDate < new Date(firstEntry.timestamp)) {
                    firstEntry = { name: entry.title, category: entry.category, timestamp: entry.timestamp };
                }
                if (!lastEntry || entryDate > new Date(lastEntry.timestamp)) {
                    lastEntry = { name: entry.title, category: entry.category, timestamp: entry.timestamp };
                }
            }
        });
    });

    // Comptage des favoris séparé
    const favorisEntries = JSON.parse(localStorage.getItem("entries-favoris")) || [];
    stats.favoris = favorisEntries.length;

    // Calcul de la note moyenne
    const averageRating = ratings.length ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) : "N/A";

    // Plateforme(s) la plus fréquente(s)
    let mostUsedPlatforms = [];
    let maxPlatformCount = 0;
    for (let platform in platformCount) {
        if (platformCount[platform] > maxPlatformCount) {
            mostUsedPlatforms = [platform];
            maxPlatformCount = platformCount[platform];
        } else if (platformCount[platform] === maxPlatformCount) {
            mostUsedPlatforms.push(platform);
        }
    }

    // Mapping des plateformes vers leurs images
    const platformImages = {
        "netflix": "../assets/platforms/netflix.webp",
        "amazon": "../assets/platforms/amazon.webp",
        "disney+": "../assets/platforms/disney+.webp",
        "canalvod": "../assets/platforms/canalvod.png",
        "crunchyroll": "../assets/platforms/crunchyroll.png",
        "ocs": "../assets/platforms/ocs.png",
        "adn": "../assets/platforms/adn.png",
        "yt": "../assets/platforms/yt.png",
        "tele": "../assets/platforms/tele.svg"
    };

    // Génération des images des plateformes les plus utilisées
    const platformContainer = document.getElementById("most-used-platform");
    platformContainer.innerHTML = ""; // Réinitialisation du contenu

    if (mostUsedPlatforms.length) {
        mostUsedPlatforms.forEach(platform => {
            let platformImage = platformImages[platform] || '../assets/platforms/autre.svg';

            let img = document.createElement("img");
            img.src = platformImage;
            img.alt = platform;
            img.title = platform;
            img.style.width = "30px";
            img.style.margin = "0 5px";
            platformContainer.appendChild(img);
        });
    } else {
        platformContainer.textContent = "N/A";
    }

    //modif des titres des genres
    let genre1;
    let genre2;

    if(firstEntry && lastEntry) {
        switch (firstEntry.genre) {
            case "film":
                genre1 = "Film";
                break;
            case "serie":
                genre1 = "Série";
                break;
            case "anime":
                genre1 = "Animé";
                break;
            default:
                genre1 = "N/A";
                break;
        }
        switch (lastEntry.genre) {
            case "film":
                genre2 = "Film";
                break;
            case "serie":
                genre2 = "Série";
                break;
            case "anime":
                genre2 = "Animé";
                break;
            default:
                genre2 = "N/A";
                break;
        }
    }

    // Affichage des résultats dans le modal
    document.getElementById("total-entries").textContent = totalEntries;
    document.getElementById("total-films").textContent = stats.films;
    document.getElementById("total-series").textContent = stats.series;
    document.getElementById("total-animes").textContent = stats.animes;
    document.getElementById("total-favoris").textContent = stats.favoris;
    document.getElementById("average-rating").textContent = averageRating;
    document.getElementById("first-entry-date").textContent = firstEntry
    ? `${new Date(firstEntry.timestamp).toLocaleDateString()} - ${firstEntry.name} (${genre1})`
    : "N/A";

    document.getElementById("last-entry-date").textContent = lastEntry
    ? `${new Date(lastEntry.timestamp).toLocaleDateString()} - ${lastEntry.name} (${genre2})`
    : "N/A";
}

//fenêtre des statistiques
function openStatsModal() {
    updateStatsModal();
    stats_modal.style.display = "flex";
}

//arrondir et gérer les possibles incohérences
document.getElementById('rating-number').addEventListener('input', function () {
    let value = parseFloat(this.value);
    if (isNaN(value) || value < 0) {
        this.value = "";
    } else if (value > 10) {
        this.value = "10";
    }
});

//fermeture des fenêtres
function closeCommentModal() {
    comment_modal.style.display = "none";
}
function closeStatusModal() {
    status_modal.style.display = "none";
}
function closeRatingModal() {
    rating_modal.style.display = "none";
}
function closeStatsModal() {
    stats_modal.style.display = "none";
}

//on ferme aussi si on clique en dehors
window.onclick = function(event) {
    if (event.target === comment_modal) {
        closeCommentModal();
    }
    else if (event.target === status_modal) {
        closeStatusModal();
    }
    else if (event.target === rating_modal) {
        closeRatingModal();
    }
    else if (event.target === stats_modal) {
        closeStatsModal();
    }
};

//et si echap pressé
document.onkeydown = function(evt) {
    if (evt.key === "Escape") {
        closeCommentModal();
        closeStatusModal();
        closeRatingModal();
        closeStatsModal();
    }
    else if (evt.key === "F12") {
        alert("Bon allez ... 😏");
    }
};

//tri des oeuvres #mozzarella
function sortEntries(category) {
    let entries = JSON.parse(localStorage.getItem(`entries-${category}`)) || [];
    const sortType = document.getElementById(`sort-select-${category}`).value;

    switch (sortType) {
        case "title-asc":
            entries.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "title-desc":
            entries.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case "date-asc":
            entries.sort((a, b) => new Date(a.endDate || "9999-12-31") - new Date(b.endDate || "9999-12-31"));
            break;
        case "date-desc":
            entries.sort((a, b) => new Date(b.endDate || "9999-12-31") - new Date(a.endDate || "9999-12-31"));
            break;
        case "rating-asc":
            entries.sort((a, b) => {
                let ratingA = a.rating === "" || a.rating == null ? -1 : parseFloat(a.rating);
                let ratingB = b.rating === "" || b.rating == null ? -1 : parseFloat(b.rating);
                return ratingA - ratingB;
            });
            break;
        case "rating-desc":
            entries.sort((a, b) => {
                let ratingA = a.rating === "" || a.rating == null ? -1 : parseFloat(a.rating);
                let ratingB = b.rating === "" || b.rating == null ? -1 : parseFloat(b.rating);
                return ratingB - ratingA;
            });
            break;
        case "date-ajout":
            entries.sort((a, b) => new Date(b.timestamp || "9999-12-31") - new Date(a.timestamp || "9999-12-31")); //ajouté récemment
            break;
        case "default":
        default:
            entries.sort((a, b) => new Date(a.timestamp || "9999-12-31") - new Date(b.timestamp || "9999-12-31")); //ordre d'ajout dans le site
            break;
    }
    localStorage.setItem(`entries-${category}`, JSON.stringify(entries));
    loadEntries();
}

//tri initial
function initialSort() {
    categories.forEach(category => {
        const entries = JSON.parse(localStorage.getItem(`entries-${category}`)) || [];
        entries.sort((a, b) => new Date(a.timestamp || "9999-12-31") - new Date(b.timestamp || "9999-12-31")); //ordre d'ajout dans le site
        localStorage.setItem(`entries-${category}`, JSON.stringify(entries));
    });
}

//formater le nom des catégories
function formatCategoryName(category) {
    switch (category) {
        case "animes": return "Animés";
        case "series": return "Séries";
        default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
}

//appel initial
initialSort();
loadEntries();