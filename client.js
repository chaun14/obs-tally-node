const { io } = require("socket.io-client");
const { SerialPort } = require("serialport");
const config = require("./config.example.js");

const currentCamID = config.client.cameraID;

// ARDUINO STUFF ===========================================================
let ArduinoPort;
let ArduinoFail = true;

async function connectArduino() {
  if (ArduinoFail || !ArduinoPort) {
    // list and connect automatically to the arduino card
    SerialPort.list().then((ports) => {
      let done = false;
      let count = 0;
      let allports = ports.length;
      ports.forEach(function (port) {
        count = count + 1;
        pm = port.manufacturer;
        if (typeof pm !== "undefined" && pm.toLowerCase().includes("arduino")) {
          path = port.path;

          ArduinoPort = new SerialPort({ baudRate: 9600, path });
          ArduinoPort.on("open", function () {
            ArduinoFail = false;
            console.log(`connected! arduino is now connected at port ${path}`);
          });
          // Open errors will be emitted as an error event
          ArduinoPort.on("error", function (err) {
            console.log("Error: ", err.message);
            ArduinoFail = true;
          });

          done = true;
        }

        if (count === allports && done === false) {
          console.log(`can't find any arduino`);
          ArduinoFail = true;
        }
      });
    });
  } else {
    // check if the arduino is still connected
    ArduinoPort.write("test");
  }
}
setInterval(connectArduino, 1000); // check every second if the arduino is connected

// SOCKET STUFF ===========================================================
const socket = io(config.client.serverAdress, { autoConnect: true });

socket.on("connect", () => {
  console.log("connected to server");
  if (ArduinoPort) ArduinoPort.write("0");
});

socket.on("disconnect", () => {
  console.log("disconnected from server");
  if (ArduinoPort) ArduinoPort.write("2");
});

socket.on("broadcast", (data) => {
  if (data.id == currentCamID) {
    if (data.status == "active") {
      console.log("camera is active");
      if (ArduinoPort) ArduinoPort.write("1");
    } else {
      console.log("camera is inactive");
      if (ArduinoPort) ArduinoPort.write("0");
    }
  }
});
