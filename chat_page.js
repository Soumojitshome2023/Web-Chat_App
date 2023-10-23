
// ========================================On Load=========================================

document.getElementById("user_pic_head").src = localStorage.getItem("user_photoURL");
document.getElementById("fav_icon").href = localStorage.getItem("user_photoURL");
let sndr_name;
let rcvr_name;
let rcvr_uid;

window.addEventListener("load", () => {
    sndr_name = localStorage.getItem("user_name");
});

// ========================================================================================


// =====================================Button Disabled=====================================

document.getElementById("chat_entry").addEventListener("input", () => {
    button_disable();
})

function button_disable() {
    if (document.getElementById("chat_entry").value.trim() != "") {
        document.getElementById("submit-btn").disabled = false;
    }
    else {
        document.getElementById("submit-btn").disabled = true;
    }
}
// ======================================================================================


// =========================================Wait=========================================

function waiting_message() {

    data_submit();

    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("wait_mess").style.display = "inline-flex";

    setTimeout(() => {

        chat_bottom();

        document.getElementById("chat_entry").value = "";
        document.getElementById("wait_mess").style.display = "none";
        document.getElementById("submit-btn").style.display = "";
        document.getElementById("submit-btn").disabled = true;

    }, 1000);

}

// ======================================================================================


// ================================Chat Scroll to Bottom================================

function chat_bottom() {
    var scrollbarElement = document.getElementById('chat_area');
    scrollbarElement.scrollTop = scrollbarElement.scrollHeight;
}
// ======================================================================================



// ==========================Last Open Other Profile====================================

function last_open_other_profile(name) {
    if (localStorage.getItem("contact") != null) {
        let obj = JSON.parse(localStorage.getItem("contact"));
        obj.forEach((ele, ind) => {
            if (ele[0] == name) {
                ele[3] = Math.trunc((new Date().getTime()) / 1000);
                localStorage.setItem("contact", JSON.stringify(obj));
            }
        })
    }
}

// ======================================================================================

// =====================================User Wish=====================================

function user_wish(name, receiver_profilepicurl, uid) {

    last_open_other_profile(name);

    document.getElementById("receiver_name_on_head").innerHTML = name;
    localStorage.setItem("receiver_name", name);
    localStorage.setItem("receiver_profilepicurl", receiver_profilepicurl);
    localStorage.setItem("receiver_uid", uid);

    document.getElementById("receiver_pic_on_head").src = receiver_profilepicurl;

    rcvr_name = name;
    rcvr_uid = uid;

    old_len = 0;
    document.getElementById("inside_chat_area").innerHTML = "";
    document.getElementById("line_status").innerHTML = "";
    document.getElementById("main_chat_screen").style.display = "block";
    button_disable();

    function myFunction(x) {
        if (x.matches) {
            document.getElementsByClassName("avaible_people")[0].style.display = "none"
            document.getElementById("main_chat_screen").style.display = "block"
        }
    }

    let x = window.matchMedia("(max-width: 800px)")
    myFunction(x)
    x.addListener(myFunction)
}
// ======================================================================================


// =============================================Back=========================================
function back() {
    document.getElementsByClassName("avaible_people")[0].style.display = "block";
    document.getElementById("main_chat_screen").style.display = "none";
}
// ======================================================================================


// ==================================Auto Back==========================================

if (localStorage.getItem("user_name") == null) {
    location.href = "login.html"
}
else {
    document.getElementById("user_name").innerText = "You : " + localStorage.getItem("user_name");
}
// ======================================================================================


// ===============================Contact Update===========================================

setInterval(() => {
    cntct_update();
}, 2000);


function cntct_update() {

    if (localStorage.getItem("user_uid") == null) {
        location.href = "login.html"
    }
    else {
        let username = localStorage.getItem("user_name");
        let useruid = localStorage.getItem("user_uid");
        let useremail = localStorage.getItem("user_email");
        let current_time = Math.trunc(new Date().getTime() / 1000);

        let newData = {
            name: username,
            user_uid: useruid,
            time: current_time,
            user_email: useremail,
            user_photoURL: localStorage.getItem("user_photoURL"),
        };

        firebase.database().ref("online/" + useruid).set(newData);

        firebase.database().ref("online").on("value", function (snapshot) {
            document.getElementById("chats").innerHTML = "";
            let flag = 0;
            let s = 0;
            snapshot.forEach(function (childSnapshot) {
                let userData = childSnapshot.val();

                let name = userData.name;
                let time = userData.time;
                let uid = userData.user_uid;
                let userphotoURL = userData.user_photoURL;

                if (current_time < time + 5) {
                    if (name != username) {
                        let tmp4 = `
                        <div class="chat_profile">
                            <img class="chat_profile_pic" src="${userphotoURL}" alt="">
                            <div onclick="user_wish('${name}', '${userphotoURL}', '${uid}')">
                                <p class="chat_person_name">${name}</p>
                            </div>
                            <button class="contact_add_btn" onclick="add_to_contact('${name}', '${userphotoURL}', '${uid}')">
                                <i class="fa-sharp fa-regular fa-bookmark"></i>
                            </button>
                        </div> `;
                        document.getElementById("chats").innerHTML += tmp4;
                        if (localStorage.getItem("contact") != null) {
                            let obj = JSON.parse(localStorage.getItem("contact"));

                            obj.forEach((ele) => {
                                if (ele[0] == name) {
                                    document.getElementsByClassName("contact_add_btn")[s].innerHTML = `<i class="fa-sharp fa-solid fa-bookmark"></i>`
                                }
                            })
                        }
                        s++;
                    }
                    if (name == rcvr_name) {
                        flag = 1;
                    }
                }
                else {
                    if (name == rcvr_name) {
                        let d = new Date(time * 1000);
                        document.getElementById("line_status").innerHTML = `Last seen ${d.toString().slice(0, 21)}`
                    }
                }
            });
            if (s == 0) {
                document.getElementById("chats").innerHTML = "<p>No One Online</p>";
            }
            if (flag == 1) {
                document.getElementById("line_status").innerHTML = "Online"
            }
        });
    }
}

// ===========================================================================================


// ==================================Data Submit==================================

function data_submit() {

    let receiver_name = rcvr_name;
    let receiver_uid = rcvr_uid;
    let receiver_pic = localStorage.getItem("receiver_profilepicurl");

    let sender_name = localStorage.getItem("user_name");
    let sender_uid = localStorage.getItem("user_uid");
    let sender_pic = localStorage.getItem("user_photoURL");

    let chat_entry = document.getElementById("chat_entry").value;
    let date_time = new Date().toString().slice(0, 21);
    let current_time = new Date().getTime() / 1000;

    let user1_name;
    let user1_uid;
    let user1_pic;

    let user2_name;
    let user2_uid;
    let user2_pic;

    let result = sender_uid.localeCompare(receiver_uid);
    let doc_id;
    let chat_send_id;

    if (result == -1) {
        doc_id = `${sender_uid}_${receiver_uid}`;
        chat_send_id = 1;
        user1_name = sender_name;
        user1_uid = sender_uid;
        user1_pic = sender_pic;

        user2_name = receiver_name;
        user2_uid = receiver_uid;
        user2_pic = receiver_pic;
    }
    else if (result == 1) {
        doc_id = `${receiver_uid}_${sender_uid}`;
        chat_send_id = 2;
        user1_name = receiver_name;
        user1_uid = receiver_uid;
        user1_pic = receiver_pic;

        user2_name = sender_name;
        user2_uid = sender_uid;
        user2_pic = sender_pic;
    }

    let chats;
    firebase.database().ref("messages/" + doc_id).once("value", function (snapshot) {
        if (snapshot.exists()) {
            let userData = snapshot.val();
            let get_chats_details = userData.chats_details;
            chats = JSON.parse(get_chats_details);
        }
        else {
            chats = [];
        }

        chats.push([chat_entry, date_time, current_time, chat_send_id]);
        let newData = {
            user1_name: user1_name,
            user1_uid: user1_uid,
            user1_pic: user1_pic,

            user2_name: user2_name,
            user2_uid: user2_uid,
            user2_pic: user2_pic,

            chats_details: JSON.stringify(chats)
        };
        firebase.database().ref("messages/" + doc_id).set(newData);
    });
}

// ======================================================================================


// ==================================Data Load==================================

let sender_name;
let sndr_uid = localStorage.getItem("user_uid");
let receiver_name;

let chat_entry;
let date_time;

let length;
let old_len = 0;
let chat_send_id;

setInterval(() => {
    load();
}, 1000);

document.getElementById("inside_chat_area").innerHTML = "";

function load() {
    let result = sndr_uid.localeCompare(rcvr_uid);
    let doc_id;
    if (result == -1) {
        doc_id = `${sndr_uid}_${rcvr_uid}`;
    }
    else if (result == 1) {
        doc_id = `${rcvr_uid}_${sndr_uid}`;
    }

    firebase.database().ref("messages/" + doc_id).once("value", function (snapshot) {
        if (snapshot.exists()) {
            var userData = snapshot.val();
            var get_chats_details = userData.chats_details;
            chats = JSON.parse(get_chats_details);
            length = chats.length;

            if (length > old_len) {
                for (let i = old_len; i < length; i++) {
                    chat_entry = chats[i][0];
                    date_time = chats[i][1];
                    chat_send_id = chats[i][3];

                    if (chat_send_id == 1) {
                        sender_name = userData.user1_name;
                        receiver_name = userData.user2_name;
                    }
                    else if (chat_send_id == 2) {
                        sender_name = userData.user2_name;
                        receiver_name = userData.user1_name;
                    }
                    if (sender_name == sndr_name && receiver_name == rcvr_name) {
                        let tmp1 = `
                            <div class="send_message">
                                <div class="mess_time">
                                    <p class="time">${date_time}</p>
                                    <p class="message">${chat_entry}</p>
                                </div>
                                <img src="${localStorage.getItem("user_photoURL")}" alt="">
                            </div>  `;
                        document.getElementById("inside_chat_area").innerHTML += tmp1;
                    }
                    else if (sender_name == rcvr_name && receiver_name == sndr_name) {
                        let tmp2 = `
                            <div class="received_message">
                                <div class="mess_time">
                                    <p class="time">${date_time}</p>
                                    <p class="message">${chat_entry}</p>
                                </div>
                                <img src="${localStorage.getItem("receiver_profilepicurl")}" alt="">
                            </div> `;
                        document.getElementById("inside_chat_area").innerHTML += tmp2;
                    }
                    chat_bottom();
                }
                old_len = length;
            }
        }
    });
}

// =============================================================================================


// ================================Last Location====================================

let last_location;

function lastlocation_call() {
    if (last_location == 1) {
        online_toggle_btn();
    }
    else if (last_location == 2) {
        contact_toggle_btn();
    }
    else if (last_location == 3) {
        friends_toggle_btn();
    }
}
// ======================================================================================


// ==================================Add to Contact====================================

function add_to_contact(name, profile_pic, uid) {

    if (localStorage.getItem("contact") == null) {
        let obj = [];

        obj.push([name, profile_pic, uid, Math.trunc((new Date().getTime()) / 1000)]);

        localStorage.setItem("contact", JSON.stringify(obj));
        // cntct_update();
        // friends_bar();
        lastlocation_call();

    }
    else {
        let obj = JSON.parse(localStorage.getItem("contact"));

        let flag = 0;
        obj.forEach((ele, ind) => {

            if (ele[0] == name) {
                flag = 1;
                obj.splice(ind, 1);
                localStorage.setItem("contact", JSON.stringify(obj));
            }
        })
        if (flag == 0) {
            obj.push([name, profile_pic, uid, Math.trunc((new Date().getTime()) / 1000)]);
            localStorage.setItem("contact", JSON.stringify(obj));
        }
        // cntct_update();
        // friends_bar();
        lastlocation_call();
    }
}


// =========================================================================================


// =========================Online,  Contact & Friends Toggle========================

document.getElementById("online_btn").style.boxShadow = "0 0 5px 2px yellow";
document.getElementById("your_contact").style.display = "none";

function online_toggle_btn() {
    last_location = 1;

    document.getElementById("chats").style.display = "block";
    document.getElementById("online_btn").style.boxShadow = "0 0 5px 2px yellow";

    document.getElementById("your_contact").style.display = "none";
    document.getElementById("contact_btn").style.boxShadow = "none";

    document.getElementById("friends_sec").style.display = "none";
    document.getElementById("friends_btn").style.boxShadow = "none";

}

function contact_toggle_btn() {
    last_location = 2;

    document.getElementById("your_contact").innerHTML = "";

    document.getElementById("chats").style.display = "none";
    document.getElementById("online_btn").style.boxShadow = "none";

    document.getElementById("your_contact").style.display = "block";
    document.getElementById("contact_btn").style.boxShadow = "0 0 5px 2px yellow";

    document.getElementById("friends_sec").style.display = "none";
    document.getElementById("friends_btn").style.boxShadow = "none";

    let s = 0;

    if (localStorage.getItem("contact") != null) {
        let obj = JSON.parse(localStorage.getItem("contact"));

        obj.forEach((ele, ind) => {
            let b = ` 
            <div class="chat_profile">
                <img class="chat_profile_pic" src="${ele[1]}" alt="">
                <div onclick="user_wish('${ele[0]}', '${ele[1]}','${ele[2]}')">
                    <p class="chat_person_name">${ele[0]}</p>
                </div>
                <button class="contact_add_btn" onclick="add_to_contact('${ele[0]}', '${ele[1]}','${ele[2]}')">
                    <i class="fa-sharp fa-solid fa-bookmark"></i>
                </button>
            </div> `;
            document.getElementById("your_contact").innerHTML += b;
            s++;
        });
        setInterval(() => {
            new_msg_notification();
        }, 2000);
    }
    if (s == 0) {
        document.getElementById("your_contact").innerHTML = "<p>Not Found</p>";
    }
}


function friends_toggle_btn() {

    last_location = 3;


    document.getElementById("chats").style.display = "none";
    document.getElementById("online_btn").style.boxShadow = "none";

    document.getElementById("your_contact").style.display = "none";
    document.getElementById("contact_btn").style.boxShadow = "none";

    document.getElementById("friends_sec").style.display = "block";
    document.getElementById("friends_btn").style.boxShadow = "0 0 5px 2px yellow";
    friends_bar();

}


function friends_bar() {
    document.getElementById("friends_sec").innerHTML = "";
    let sender_uid = localStorage.getItem("user_uid");

    firebase.database().ref("messages").orderByChild('user1_uid').equalTo(sender_uid).once('value', (snapshot) => {
        if (snapshot.exists()) {
            let s = 0;
            snapshot.forEach(function (childSnapshot) {
                let userData = childSnapshot.val();
                let sender_name = userData.user1_name;
                let receiver_name = userData.user2_name;
                let receiver_pic = userData.user2_pic;
                let receiver_uid = userData.user2_uid;

                let get_chats_details = userData.chats_details;
                let chats = JSON.parse(get_chats_details);
                let length = chats.length;
                let last_chat_time = chats[length - 1][2];

                let tmp4 = `
                    <div class="chat_profile">
                        <img class="chat_profile_pic" src="${receiver_pic}" alt="pic">
                        <div onclick="user_wish('${receiver_name}', '${receiver_pic}', '${receiver_uid}')">
                            <p class="chat_person_name friendn">${receiver_name}</p>
                        </div>
                        <button class="contact_add_btn friendb" onclick="add_to_contact('${receiver_name}', '${receiver_pic}','${receiver_uid}')">
                            <i class="fa-sharp fa-regular fa-bookmark"></i>
                        </button>
                    </div> `;
                document.getElementById("friends_sec").innerHTML += tmp4;

                if (localStorage.getItem("contact") != null) {
                    let obj = JSON.parse(localStorage.getItem("contact"));
                    obj.forEach((ele) => {
                        if (ele[0] == receiver_name) {
                            document.getElementsByClassName("friendb")[s].innerHTML = `<i class="fa-sharp fa-solid fa-bookmark"></i>`
                        }
                        if (ele[3] <= last_chat_time) {
                            document.getElementsByClassName("friendn")[s].innerHTML += ` <i class="fa-solid fa-envelope fa-fade"></i>`
                        }
                    })
                }
                s++;
            })
        }
    });
    firebase.database().ref("messages").orderByChild('user2_uid').equalTo(sender_uid).once('value', (snapshot) => {
        if (snapshot.exists()) {
            let s = 0;
            snapshot.forEach(function (childSnapshot) {
                let userData = childSnapshot.val();
                let sender_name = userData.user2_name;
                let receiver_name = userData.user1_name;
                let receiver_pic = userData.user1_pic;
                let receiver_uid = userData.user1_uid;

                let get_chats_details = userData.chats_details;
                let chats = JSON.parse(get_chats_details);
                let length = chats.length;
                let last_chat_time = chats[length - 1][2];

                let tmp4 = `
                    <div class="chat_profile">
                        <img class="chat_profile_pic" src="${receiver_pic}" alt="pic">
                        <div onclick="user_wish('${receiver_name}', '${receiver_pic}', '${receiver_uid}')">
                            <p class="chat_person_name friendn">${receiver_name}</p>
                        </div>
                        <button class="contact_add_btn friendb" onclick="add_to_contact('${receiver_name}', '${receiver_pic}','${receiver_uid}')">
                            <i class="fa-sharp fa-regular fa-bookmark"></i>
                        </button>
                    </div> `;
                document.getElementById("friends_sec").innerHTML += tmp4;
                if (localStorage.getItem("contact") != null) {
                    let obj = JSON.parse(localStorage.getItem("contact"));
                    obj.forEach((ele) => {
                        if (ele[0] == receiver_name) {
                            document.getElementsByClassName("friendb")[s].innerHTML = `<i class="fa-sharp fa-solid fa-bookmark"></i>`
                        }
                        if (ele[3] <= last_chat_time) {
                            document.getElementsByClassName("friendn")[s].innerHTML += ` <i class="fa-solid fa-envelope fa-fade"></i>`
                        }
                    })
                }
                s++;
            })
        }
    });
}

// =======================================================================================


// =====================================sign out==========================================

function sign_out_btn() {
    localStorage.clear();
    location.href = "login.html";
}
// =========================================================================================