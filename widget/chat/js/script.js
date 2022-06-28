/**
 * Message Template data
 * avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/a88dd690-f653-435e-ae3f-cd312ee5b736-profile_image-300x300.png"
 * bits: 0
 * channel: "blackywersonst"
 * color: "#B33B19"
 * displayName: "Blackywersonst"
 * firstMessage: false
 * hasBits: false
 * internal: false
 * isAnonymous: false
 * isCustomReward: false
 * isHighlighted: false
 * isMe: false
 * isReply: false
 * message: "asdas"
 * monthsSubscribed: 57
 * msgId: "337d6353-d43a-4d21-b734-94d04688ff01"
 * role: 4
 * subscriber: true
 * userId: 27638012
 * username: "blackywersonst"
 * time: 19:36
 */

// General Variables
var settings = {
    "websocketURL": "ws://localhost:8080/",
    "debug": false,
    "blacklist": {
        "user": [],
        "words": []
    },
    "animations": {
        "animation": true,
        "hidedelay": 0,
        "hideAnimation": "fadeOut",
        "showAnimation": "bounceInLeft"
    },
    "defaultChatColor": "#fff",
    "template": "message"
};
var template;


/**
 * Storing avatars that have been called to save api calls
 * username: imageURL
 */
var avatars = {}


window.addEventListener('load', (event) => {
    template = document.querySelector('#message');
    connectws();

    if (settings.debug) {
        console.debug("Debug mode is enabled");
        debugMessages();
    }

});

function connectws() {
    if ("WebSocket" in window) {

        console.log("Connecting to Streamer.Bot");
        ws = new WebSocket(settings.websocketURL);
        bindEvents();
    }
}

function bindEvents() {
    ws.onopen = () => {
        ws.send(JSON.stringify({
            "request": "Subscribe",
            "id": "obs-chat",
            "events": {
                "general": [
                    "Custom"
                ],
                "Twitch": [
                    "ChatMessage",
                    "ChatMessageDeleted"
<<<<<<< Updated upstream
                ],
                "YouTube": [
                    "Message",
                    "MessageDeleted"
=======
>>>>>>> Stashed changes
                ]
            }
        }));
    };

    ws.onmessage = async (event) => {
        const wsdata = JSON.parse(event.data);

        if (wsdata.event == null) {
            return;
        }
        // Custom
        if (wsdata.data.name == "ClearChat") {
            ClearChat();
        }
<<<<<<< Updated upstream
        // Twitch
=======

>>>>>>> Stashed changes
        if (wsdata.event.source === 'Twitch') {
            switch (wsdata.event.type) {
                case 'ChatMessage':
                    add_message(wsdata.data.message);
                    break;
                case 'ChatMessageDeleted':
<<<<<<< Updated upstream
                    hideMessage(wsdata.data.targetMessageId);
                    break;
                default:
                    break;
            }
=======
                    delete_message(wsdata.data.message);
                    break;

                default:
                    break;
            }
        } else {
            console.log(['Event not implemented', event]);
>>>>>>> Stashed changes
        }

        // Youtube
        if (wsdata.event.source === 'Youtube') {
            switch (wsdata.event.type) {
                case 'Message':
                    add_message(wsdata.data.message);
                    break;
                case 'MessageDeleted':
                    console.debug(wsdata.data.message);
                    break;
                default:
                    break;
            }
        }
    };


    ws.onclose = function () {
        setTimeout(connectws, 10000);
    };
}

/**
 * Adding content to message and then render it on screen
 * @param {object} message
 */
async function add_message(message) {

    // Blacklist Filter
    if (settings.blacklist.user.includes(message.displayName)) {
        return;
    }

    // Adding time variable
    var today = new Date();
    message.time = today.getHours() + ":" + String(today.getMinutes()).padStart(2, '0');

    // Adding default classes
    message.classes = ["msg"];

    const msg = new Promise((resolve, reject) => {
        resolve(getProfileImage(message.username));
    }).then(avatar => {
        message.avatar = avatar;
        return renderBadges(message);
    }).then(bages => {
        message.badges = bages;
        return renderEmotes(message);
    })
        .then(msg => {
            $("#chat").append(renderMessage(msg));

            if (settings.animations.hidedelay > 0) {
                hideMessage(message.msgId);
            }

        }).catch(function (error) {
            console.error(error);
        });
}

<<<<<<< Updated upstream
=======

function remove_message(message) {
    $("#" + message.msgId).remove()
}

>>>>>>> Stashed changes
/**
 * Render message with template
 * @param {object} message
 * @returns
 */
function renderMessage(message = {}) {

    if (!message.color) {
        message.color = settings.defaultChatColor;
    }


    if (settings.animations.animation) {
        message.classes.push("animate__animated");

        if (settings.animations.showAnimation) {
            message.classes.push("animate__" + settings.animations.showAnimation);
        }
    }

    if (message.subscriber === true) {
        message.classes.push("subscriber");
    }

    // Blacklist word filter
    if (settings.blacklist.words) {
        settings.blacklist.words.forEach(word => {
            message.message = message.message.replace(word, "****");
        });
    }

    message.classes = message.classes.join(" ");

    // Get template and populate
    var tpl = template;

    const pattern = /{{\s*(\w+?)\s*}}/g; // {property}
    return tpl.innerHTML.replace(pattern, (_, token) => message[token] || '');
}

/**
 * Hides a message after an amount of time and deletes it aferwards
 * @param {string} msgId
 */
function hideMessage(msgId) {
    const msg = new Promise((resolve, reject) => {
        delay(settings.animations.hidedelay).then(function () {
            $("#" + msgId).addClass("animate__" + settings.animations.hideAnimation);
            $("#" + msgId).bind("animationend", function () {
                $("#" + msgId).remove()
            });
            resolve();
        });
    })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * Creates a markup of all Badges so it can be renderd as one
 * @param {object} message
 * @returns
 */
async function renderBadges(message) {
    var badges = "";

    message.badges.forEach(badge => {
        badges += `<img class="${badge.name}" title="${badge.name}" src="${badge.imageUrl}">`;
    });

    return badges;
}

/**
 * Swaping Emote names for emote images
 * @param {object} message
 * @returns
 */
async function renderEmotes(message) {

    // Check if Message is emote only
    if (message.message.split(' ').length == message.emotes.length) {
        message.classes.push("emoteonly");
    }

    message.emotes.forEach(emote => {
        message.message = message.message.replace(emote.name, `<img class="emote" src="${emote.imageUrl}">`);
    });

    return message;
}

/**
 * Calling decapi.me to recive avatar link as string
 * @param {string} username
 * @returns
 */
async function getProfileImage(username) {

    // Check if avatar is already stored
    if (avatars.username) {
        return `<img src="${avatars.username}"\>`;
    }

    return fetch(`https://decapi.me/twitch/avatar/${username}`)
        .then(response => {
            return response.text();
        })
        .then(avatar => {
            avatars[username] = avatar;
            return `<img src="${avatar}"\>`;
        });

}
// Command Code

function ClearChat() {
    $("#chat").html("");
}

// Helper Code

function delay(t, v) {
    return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, v), t)
    });
}


// Debug Code

function debugMessages() {

    setInterval(() => {
        const message = {
            avatar: "https://static-cdn.jtvnw.net/jtv_user_pictures/a88dd690-f653-435e-ae3f-cd312ee5b736-profile_image-300x300.png",
            bits: 0,
            badges: [{
                imageUrl: "https://static-cdn.jtvnw.net/badges/v1/5527c58c-fb7d-422d-b71b-f309dcb85cc1/3",
                name: "broadcaster",
            },
            {
                imageUrl: "https://static-cdn.jtvnw.net/badges/v1/31966bdb-b183-47a9-a691-7d50b276fc3a/3",
                name: "subscriber",
            },
            ],
            emotes: [],
            channel: "blackywersonst",
            color: "#B33B19",
            displayName: "Blackywersonst",
            firstMessage: false,
            hasBits: false,
            internal: false,
            isAnonymous: false,
            isCustomReward: false,
            isHighlighted: false,
            isMe: false,
            isReply: false,
            message: "Chat box is in Debug mode. Chat box is in Debug mode.",
            monthsSubscribed: 57,
            msgId: makeid(12),
            role: 4,
            subscriber: true,
            userId: 27638012,
            username: "blackywersonst",
            time: "19:36",
        }

        add_message(message)
    }, 8000);
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}