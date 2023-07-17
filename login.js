// ======================================================================
function signInWithGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then(function (result) {
            var user = result.user;
            // console.log("User signed in with Google:", user);
            // localStorage.setItem("user_name", user.displayName);


            localStorage.setItem("user_uid", user.uid);
            localStorage.setItem("user_name", user.email.split("@")[0]);
            localStorage.setItem("user_email", user.email);
            localStorage.setItem("user_photoURL", user.photoURL);


            location.href = "chat_page.html";


        })
        .catch(function (error) {
            console.log("Sign in with Google error:", error);

        });
}


// ======================================================================

