const { EventSubscription } = require("obs-websocket-js");

const OBSWebSocket = require("obs-websocket-js").default;

const obs = new OBSWebSocket();
const config = require("./config.js");

const cameras = config.server.cameras;
let camerasMap = new Map();

const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer);

httpServer.listen(config.server.port);

io.on("connection", (socket) => {
  console.log("client connected " + socket.id);
});

async function main() {
  for (let camera of cameras) {
    camerasMap.set(camera, false);
  }

  obs.on("ConnectionOpened", (data) => {
    console.log("connected with obs websocket");
  });

  obs.on("CurrentProgramSceneChanged", async (data) => {
    //console.log({ string: "CurrentProgramSceneChanged", data });
    try {
      let items = await obs.call("GetSceneItemList", { sceneName: data.sceneName });
      if (items.sceneItems.length) {
        for (let item of items.sceneItems) {
          let name = item.sourceName;
          // now check if the item is a camera
          // first check if caps
          let activeCams = [];
          if ((name = name.toUpperCase()) && name.includes("_")) {
            let camID = parseInt(name.split("_")[1]);
            // check if the camera exists
            if (cameras.includes(camID)) {
              activeCams.push(camID);
            }
          }
          setCameraStatus(activeCams);
        }
      }
    } catch (error) {
      console.error(error);
    }
  });

  // Connect to localhost with password
  await obs.connect(config.server.obsWebsocket.address, config.server.obsWebsocket.password, { eventSubscriptions: EventSubscription.All, rpcVersion: 1 });
}
main();

async function setCameraStatus(cameraID) {
  for (let [key, value] of camerasMap) {
    if (!cameraID.includes(key)) {
      setCameraInactive(key);
    } else {
      setCameraActive(key);
    }
  }
}

async function setCameraActive(cameraID) {
  console.log(cameraID + " active");
  camerasMap.set(cameraID, true);
  io.emit("broadcast", { id: cameraID, status: "active" });
}
async function setCameraInactive(cameraID) {
  console.log(cameraID + " inactive");
  io.emit("broadcast", { id: cameraID, status: "inactive" });

  camerasMap.set(cameraID, false);
}

if (config.server.obsWebsocket.eventDebug) {
  // debug thing to show all events
  function patchEmitter(emitter, websocket) {
    var oldEmit = emitter.emit;

    emitter.emit = function () {
      var emitArgs = arguments;

      //console.log(emitArgs);

      return oldEmit.apply(emitter, arguments);
    };
  }
  patchEmitter(obs);
}
