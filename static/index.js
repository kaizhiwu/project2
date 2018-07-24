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
        //communicate with the server.
        socket.emit("create channel", {'new_channel': new_channel});
        //clear the input
        document.querySelector('#new_channel').value = '';
        // Stop form from submitting
        return false;
    };

    //create and display all the chatting list.
    socket.on("display channels", channelList => {
        //empty the selecting box.
        document.getElementById("choose_channels").innerHTML = "";
        //append all the options.
        for (var channel of channellist) {
            const channel_option = document.createElement('option');
            channel_option.innerHTML = channel;
            channel_option.value = channel;
            document.querySelector('#choose_channels').append(channel_option);
        }
    });

    //select the channel and fetch the messsage stored in that channel.
    document.querySelector('#choose_channels').onchange = function() {
        // Initialize new request
        const request = new XMLHttpRequest();
        const channel2display = this.value;
        request.open('POST', `/${channel2display}`);

        //callback function when the request completes.
        request.onload = () => {
            //extracts JSON data from request
            const data = JSON.parse(request.responseText);
            // Update the result div
            if (data.success) {
                const contents = data.message;
                document.querySelector('#channel_message').innerHTML = '';
                for (var message of contents) {
                    const li = document.createElement('li');
                    li.innerHTML = message;
                    document.querySelector('#channel_message').append(li);
                }}
            else {
                document.querySelector('#channel_message').innerHTML = 'There was an error.';
                }
            };
            // Add data to send with request
            const data = new FormData();
            data.append('channel2display', channel2display);

            // Send request
            request.send(data);
            return false;
        };

    //create a new message.
    document.querySelector('#submit_message').onsubmit = () => {
        const message = document.querySelector('#new_message').value;
        const channel = document.querySelector('#choose_channels').value;
        var d = new Date(); // get the system date.
        var user = localStorage.getItem('username');
        socket.emit("submit message", {'channel': channel, 'message':message,'time':d,'user':user});
        //clear the input.
        document.querySelector('#new_message').value = '';
        // Stop form from submitting.
        return false;
    };

    //display the new message.
    socket.on("new_message_added",data =>{
        document.querySelector('#channel_message').innerHTML = '';
        for (var message of data) {
            const li = document.createElement('li');
            li.innerHTML = message;
            document.querySelector('#channel_message').append(li);
        }
    });
});