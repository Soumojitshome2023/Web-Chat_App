
// ========================================On Load=========================================

document.getElementById("user_pic_head").src = localStorage.getItem("user_photoURL");
document.getElementById("fav_icon").href = localStorage.getItem("user_photoURL");
let sndr_name;
let rcvr_name;

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

                ele[2] = Math.trunc((new Date().getTime()) / 1000);
                localStorage.setItem("contact", JSON.stringify(obj));
            }
        })
    }
}



// ======================================================================================


// =====================================User Wish=====================================


function user_wish(name, receiver_profilepicurl) {

    last_open_other_profile(name);

    document.getElementById("receiver_name_on_head").innerHTML = name;
    localStorage.setItem("receiver_name", name);
    localStorage.setItem("receiver_profilepicurl", receiver_profilepicurl);

    document.getElementById("receiver_pic_on_head").src = receiver_profilepicurl;

    rcvr_name = name;

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

        var newData = {
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
                var userData = childSnapshot.val();

                let name = userData.name;
                let time = userData.time;
                let userphotoURL = userData.user_photoURL;

                if (current_time < time + 5) {

                    if (name != username) {

                        let tmp4 = `
                        <div class="chat_profile">
                            <img class="chat_profile_pic" src="${userphotoURL}" alt="">
                            <div onclick="user_wish('${name}', '${userphotoURL}')">
                                <p class="chat_person_name">${name}</p>
                            </div>
                            <button class="contact_add_btn" onclick="add_to_contact('${name}', '${userphotoURL}')">
                                <i class="fa-sharp fa-regular fa-bookmark"></i>
                            </button>
                        </div> `;
                        s++;

                        document.getElementById("chats").innerHTML += tmp4;


                        if (localStorage.getItem("contact") != null) {
                            let obj = JSON.parse(localStorage.getItem("contact"));

                            obj.forEach((ele) => {

                                if (ele[0] == name) {
                                    document.getElementsByClassName("contact_add_btn")[s - 1].innerHTML = `<i class="fa-sharp fa-solid fa-bookmark"></i>`
                                }
                            })
                        }
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
    let sender_name = localStorage.getItem("user_name");
    let chat_entry = document.getElementById("chat_entry").value;
    let date_time = new Date().toString().slice(0, 21);
    let current_time = new Date().getTime() / 1000;
    // let sender_uid = localStorage.getItem("user_uid");
    let sender_pic = localStorage.getItem("user_photoURL");
    let receiver_pic = localStorage.getItem("receiver_profilepicurl");

    var newData = {
        sender_name: sender_name,
        sender_pic: sender_pic,
        chat_entry: chat_entry,
        receiver_name: receiver_name,
        receiver_pic: receiver_pic,
        date_time: date_time,
        current_time: current_time,

    };
    firebase.database().ref("messages").push(newData);
}



// ======================================================================================



// ==================================Data Load==================================

let sender_name;
let chat_entry;
let receiver_name;
let date_time;
let length;
let old_len = 0;
let temp;


setInterval(() => {
    load();
}, 1000);

document.getElementById("inside_chat_area").innerHTML = "";

function load() {

    firebase.database().ref("messages").once("value", function (snapshot) {

        length = snapshot.numChildren();

        if (length > old_len) {
            temp = 1;

            // console.log("run 1")

            snapshot.forEach(function (childSnapshot) {
                var userData = childSnapshot.val();
                // console.log("run 2")


                sender_name = userData.sender_name;
                chat_entry = userData.chat_entry;
                receiver_name = userData.receiver_name;
                date_time = userData.date_time;

                if (temp > old_len) {

                    // console.log("run 3")
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
                temp++;
            });
            old_len = length;
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

function add_to_contact(name, profile_pic) {

    if (localStorage.getItem("contact") == null) {
        let obj = [];

        obj.push([name, profile_pic, Math.trunc((new Date().getTime()) / 1000)]);

        localStorage.setItem("contact", JSON.stringify(obj));
        cntct_update();

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
            obj.push([name, profile_pic, Math.trunc((new Date().getTime()) / 1000)]);
            localStorage.setItem("contact", JSON.stringify(obj));
        }
        cntct_update();
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
                <div onclick="user_wish('${ele[0]}', '${ele[1]}')">
                    <p class="chat_person_name">${ele[0]}</p>
                </div>
                <button class="contact_add_btn" onclick="add_to_contact('${ele[0]}', '${ele[1]}')">
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

    document.getElementById("friends_sec").innerHTML = "";

    document.getElementById("chats").style.display = "none";
    document.getElementById("online_btn").style.boxShadow = "none";

    document.getElementById("your_contact").style.display = "none";
    document.getElementById("contact_btn").style.boxShadow = "none";

    document.getElementById("friends_sec").style.display = "block";
    document.getElementById("friends_btn").style.boxShadow = "0 0 5px 2px yellow";

    let obj = [];

    firebase.database().ref("messages").once("value", function (snapshot) {

        snapshot.forEach(function (childSnapshot) {
            var userData = childSnapshot.val();

            sender_name = userData.sender_name;
            receiver_name = userData.receiver_name;
            receiver_pic = userData.receiver_pic;

            if (sender_name == sndr_name) {
                let flag = 0;

                if (obj[0] != null) {
                    obj.forEach((ele, ind) => {
                        if (obj[ind] == sender_name + "_" + receiver_name) {
                            flag = 1;
                        }
                    })
                }

                if (flag == 0) {

                    let tmp4 = `
                    <div class="chat_profile">
                        <img class="chat_profile_pic" src="${receiver_pic}" alt="pic">
                        <div onclick="user_wish('${receiver_name}', '${receiver_pic}')">
                            <p class="chat_person_name">${receiver_name}</p>
                        </div>
                        <button class="contact_add_btn" onclick="add_to_contact('${receiver_name}', '${receiver_pic}')">
                            <i class="fa-sharp fa-regular fa-bookmark"></i>
                        </button>
                    </div> `;

                    obj.push(sender_name + "_" + receiver_name);

                    document.getElementById("friends_sec").innerHTML += tmp4;
                }
            }
        });
    });
}

// =======================================================================================




// =====================================sign out==========================================


function sign_out_btn() {

    localStorage.clear();
    location.href = "login.html";

}

// =========================================================================================





// ================================New Msg Notification================================

let mn_sender_name;
let mn_receiver_name;
let mn_length;
let mn_old_len = 0;
let mn_temp;
let msg_time;

function new_msg_notification() {
    firebase.database().ref("messages").once("value", function (snapshot) {

        let obj = JSON.parse(localStorage.getItem("contact"));

        snapshot.forEach(function (childSnapshot) {

            var mn_userData = childSnapshot.val();

            mn_sender_name = mn_userData.sender_name;
            mn_receiver_name = mn_userData.receiver_name;
            msg_time = mn_userData.current_time;


            if (mn_receiver_name == sndr_name) {

                obj.forEach((ele, ind) => {

                    if (ele[0] == mn_sender_name) {

                        if (ele[2] <= msg_time) {

                            document.querySelectorAll("#your_contact .chat_profile")[ind].innerHTML = `

                                <img class="chat_profile_pic" src="${ele[1]}" alt="pic">
                                <div onclick="user_wish('${ele[0]}', '${ele[1]}')">
                                    <p class="chat_person_name">${ele[0]} 
                                    <i class="fa-solid fa-envelope fa-fade"></i>
                                    </p>
                                </div>
                                <button class="contact_add_btn" onclick="add_to_contact('${ele[0]}', '${ele[1]}')">
                                    <i class="fa-sharp fa-solid fa-bookmark"></i>
                                </button>`;
                        }
                        else {
                            document.querySelectorAll("#your_contact .chat_profile")[ind].innerHTML = `

                                <img class="chat_profile_pic" src="${ele[1]}" alt="pic">
                                <div onclick="user_wish('${ele[0]}', '${ele[1]}')">
                                    <p class="chat_person_name">${ele[0]}</p>
                                </div>
                                <button class="contact_add_btn" onclick="add_to_contact('${ele[0]}', '${ele[1]}')">
                                    <i class="fa-sharp fa-solid fa-bookmark"></i>
                                </button> `;
                        }
                    }
                })
            }
        })
    })
}


// ==========================================================================================