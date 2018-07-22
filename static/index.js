// Set starting value of username.
if (!localStorage.getItem('username'))
    localStorage.setItem('username', "new user");

document.addEventListener('DOMContentLoaded', () => {
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    //load the page with username setted.
    document.querySelector('#username_display').innerHTML = localStorage.getItem('username');

    //update the new username when the user submit his name.
    document.querySelector('#form_username').onsubmit = () => {
        const username = document.querySelector('#username').value;
        document.querySelector('#username_display').innerHTML = username;
        localStorage.setItem('username', username);

        //clear the input
        document.querySelector('#username').value = '';
        // Stop form from submitting
        return false;
    };

    //create a new chatting channel.
    document.querySelector('#create_channel').onsubmit = () => {
        const new_channel = document.querySelector('#new_channel').value;
        socket.emit("create channel", new_channel);
        //clear the input
        document.querySelector('#new_channel').value = '';
        // Stop form from submitting
        return false;
    };

    //create and display all the chatting list.
    socket.on("display channels", data => {
        for (var channel in data) {
            const channel_option = document.createElement('option');
            channel_option.innerHTMl = channel;
            channel_option.dataset.channel = channel;
            document.querySelector('#choose_channels').append(channel_option);
        };
    });
    });