var token;
// verifie si l'utilisateur est connecté
function isTokenValid() {
    getCookie("BugTrackerUser") ? token = getToken() : window.location.href = '/connexion.html'
}


//change le lien actif de la navbar
function updateActiveLink(link) {
    document.querySelectorAll('.link').forEach((e) => {
        e.classList.remove('active')
    })

    document.getElementById(link).classList.add('active')
}

// afficher et cacher le loader
function HideLoader(sectionClass) {
    $('.loader').hide();
    $(sectionClass).show();

}

function ShowLoader() {
    $('.col').hide();
    $('.loader').show();
}

// afficher les statistiques liés au bugs
function stats(bugs) {
    $("#total").text(bugs.length);
    $("#enCours").text(bugs.filter(bug => bug.state == "1").length);
    $("#Atraiter").text(bugs.filter(bug => bug.state == "2").length);
}


// creé un select
function Select(etatSelectionne) {
    const color = ['red', 'orange', 'green']
    const select = $("<select>").attr('data-color', color[etatSelectionne]) // Créer un élément select et l'ajouter au main

    
    const options = [{ value: 0, label: "Non traité " }, { value: 1, label: "En cours" }, { value: 2, label: "Traité" }]; // Définir les options 

    options.forEach((option) => { // Ajouter chaque option au select
        $("<option>", { value: option.value, text: option.label })
            .prop("selected", option.value == etatSelectionne) // Sélectionner l'option correspondant à l'état passé en paramètre
            .appendTo(select);
    });

    return select
}



// retourne un bouton de supression
function Delete(bugId) {
    const deleteBtn = $("<a>").html('<i class="bi bi-trash3"></i>').attr("data-id", bugId).addClass("delete"); // Créer un élément select et l'ajouter au main
    return deleteBtn
}



// récupere et affiche les bugs
function getBugs(userId) {
    var bugs, devs;
    // verifier si l'utilisateur et connecté
    isTokenValid();
    // changer le lien actif de la navbar
    userId != 0 ? updateActiveLink('me') : updateActiveLink('all')

    // afficher loader
    ShowLoader()

    // récuperer les utilisateur
    $.get("http://greenvelvet.alwaysdata.net/bugTracker/api/users/" + token)
        .done(function (data) {
            var obj = jQuery.parseJSON(data);
            devs = obj.result.user;
            // Récupérer les bugs après que les noms ont été récupérés
            $.get("http://greenvelvet.alwaysdata.net/bugTracker/api/list/" + token + "/" + userId)
                .done(function (data) {
                    var obj = jQuery.parseJSON(data);
                    bugs = obj.result.bug;

                    // afficher les statistiques liés au bug
                    stats(bugs);
                    // Si n'ya pas de bugs, ne rien afficher 
                    if (bugs.length == 0) {
                        HideLoader('.tableauVide')
                    } else {
                        // sinon afficher les résultat
                        rendu();
                    }

                })
                .fail(function () {
                    console.log("Erreur lors de la récupération des bugs");
                });
        })
        .fail(function () {
            console.log("Erreur lors de la récupération des noms de développeurs");
        });

    // afficher le tableau de bug
    const rendu = () => {
        // Créer le tableau HTML

        const tbody = $('.tbody');

        // initialiser le tableau
        $(tbody).html("");

        // Ajouter les lignes de données
        bugs.forEach(row => {
            // la ligne
            const tr = $('<tr>');

            // titre et description du bug
            bugLabel = $('<td>').addClass("designation")
            bugTitle = $('<h3>').text(row.title).appendTo(bugLabel);
            bugDesc = $('<p>').text(row.description).appendTo(bugLabel);
            tr.append($(bugLabel))
            // date
            const date = new Date(row.timestamp*1000);
            tr.append($('<td>').text(date.toLocaleString()).addClass('desktop-only'));
            // nom du dévelloper assigné
            tr.append($('<td>').text(devs[row.user_id]).addClass('desktop-only'));
            // etat
            tr.append($('<td>').html(Select(row.state).attr("data-bug", row.id).addClass("state-select")));
            //suprimer
            tr.append($('<td>').html(Delete(row.id)).addClass("white"));
            // ajouter la ligne au body
            tbody.append(tr);
        });
        // ajouter les evenements de changement d'etat et de suppression
        event();
        HideLoader(".tableau")
    }

    const event = () => {
        $('.state-select').change(function () {
            ShowLoader()
            isTokenValid();
            $.get("http://greenvelvet.alwaysdata.net/bugTracker/api/state/" + token + "/" + $(this).attr("data-bug") + "/" + $(this).val())
                .done(function (data) {
                    var obj = jQuery.parseJSON(data);
                    message('update')
                    getBugs(0);
                });
        });


        $('.delete').click(function () {

            var id = $(this).attr("data-id");
            // lier l'id du bug au popup
            $("#delete-paragraph").text("Vous êtes sur le pont de supprimer le bug n° " + id + " , voulez-vous continuer ? ");
            // affiche le popup
            $.magnificPopup.open({
                items: {
                    src: '#delete-popup',
                    type: 'inline'
                },
                removalDelay: 300,
                mainClass: 'mfp-fade'
            });

            $("#delete-button").click(function (e) {
                // fermer popup
                $.magnificPopup.close();

               ShowLoader()

                isTokenValid();

                $.get("http://greenvelvet.alwaysdata.net/bugTracker/api/delete/" + token + "/" + id)
                    .done(function (data) {
                        var obj = jQuery.parseJSON(data);
                        message('delete')
                        getBugs(0);
                    });
            });
        });
    }

}