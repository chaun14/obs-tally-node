module.exports = {
  server: {
    cameras: [0], // list of the cameras id that are used

    port: 3000, // http port
    obsWebsocket: {
      address: "ws://127.0.0.1:4455", // obs websocket address
      password: "", // obs websocket password: must be set
      eventDebug: false, // debug obs websocket events
    },
  },
  client: {
    serverAdress: "http://127.0.0.1:3000", // socket server adress
    cameraID: 0, // the camera id of this client
  },
};
