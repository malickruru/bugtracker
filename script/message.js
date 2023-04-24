// gestion de message d'erreur et de success


function displayMessage(success, text) {
    $(".message").text(text);
    if (success) {
        $(".message").css({ backgroundColor: "#7ED957" });
    } else {
        $(".message").css({ backgroundColor: "#F67E7D" });
    }
    $(".message").show();
    setTimeout(() => {
        $(".message").hide();
    }, 5000)
}

function message(actions, text = "") {
    switch (actions) {
        case "update":
            displayMessage(1, 'Vous avez modifiez le status du bug ')
            break;
        case "delete":
            displayMessage(0, 'le bug à été supprimer ')
            break;
        case "add":
            displayMessage(1, 'le bug à bien été créé ')
            break;
        default:
            displayMessage(0, text)
            break;
    }
}
