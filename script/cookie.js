


// cette fonction stock un cookie contenant les infos de l'utilisateur
// il expire dans 20min date à laquelle l'utilsateur est déconnecté du serveur
function setCookie(name, value) {
    var now = new Date();
    var time = now.getTime();
    time += 20 * 60 * 1000; // 20 minutes en millisecondes
    now.setTime(time);
    document.cookie = name + '=' + value + ';expires=' + now.toUTCString() + ';path=/';
  }
  

// retourner un cookie
  function getCookie(name) {
    const cookies = document.cookie.split(';');
  
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
  
      if (cookie.startsWith(`${name}=`)) {
        return JSON.parse(cookie.substring(name.length + 1));
      }
    }
  
    return null;
  }
  

  //supprimer un cookie
  function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }


  // récupérer le token 
  function getToken(){
    if(getCookie("BugTrackerUser") == null){
        window.location.href = '/login.html'
        return
    }

    return getCookie("BugTrackerUser").token

}

// récupérer l'id de l'utilisateur connecté
function getUserId(){
  if(getCookie("BugTrackerUser") == null){
      window.location.href = '/login.html'
      return
  }

  return getCookie("BugTrackerUser").id

}