var nb = document.getElementById("nb");

var connectionString =
  "ws://" + window.location.host + "/ws/play/" + roomCode + "/";
var messageSocket = new WebSocket(connectionString);

// Main function which handles the connection
// of websocket.
function connect() {
  messageSocket.onopen = function open() {
    // on websocket open, send the START event.
    messageSocket.send(
      JSON.stringify({
        event: "START",
        message: "",
      })
    );
  };

  messageSocket.onclose = function (e) {
    setTimeout(function () {
      connect();
    }, 1000);
  };
  // Sending the info about the room
  messageSocket.onmessage = function (e) {
    // On getting the message from the server
    // Do the appropriate steps on each event.
    let data = JSON.parse(e.data);
    data = data["payload"];
    let message = data["message"];
    let event = data["event"];
    switch (event) {
      case "START":
        reset();
        break;
      case "END":
        alert(message);
        reset();
        break;
      case "MOVE":
        if (message["player"] != char_choice) {
          make_move(message["index"], message["player"]);
          myturn = true;
          document.getElementById("alert_move").style.display = "inline";
        }
        break;
      default:
    }
  };

  if (messageSocket.readyState == WebSocket.OPEN) {
    messageSocket.onopen();
  }
}

//call the connect function at the start.
connect();
