# obs-tally-node
A nice OBS tally light system using nodejs &amp; arduino

[Demo video](https://youtube.com/shorts/Ne81Y_jzV8k)

![tellylight drawio](https://user-images.githubusercontent.com/42867004/199029517-dee0cebc-22c2-441d-b1d3-553a156be4ef.png)


# :page_facing_up: Table of content

1. [Components](#mag-components)
    - [Server](#1-server)
    - [Client](#2-client)
    - [Arduino](#3-hardware)
2. [Setup Instructions](#package-setup-instructions)
3. [Discord server](#headphones-discord-server)

# :mag: Components 

## 1 Server
The server is connected with the obs instance through the obs websocket plugin

For a source to be recognised as a camera, it is needed to follow the specific name formatting: `CAMERANAMEHEREINCAPS_CAMERAID`

![image](https://user-images.githubusercontent.com/42867004/199024380-555960e6-1fe4-4e58-b4f3-b548ec45eee8.png)

*for example, the main camera (id 0) will be named: MAIN_0*

The camera with id 0 is triggered everytime a source in caps followed by _0 is shown in a scene
![image](https://user-images.githubusercontent.com/42867004/199024724-326c69f2-3854-4fc7-ad40-65486094cd31.png)


## 2 Client 
The client is connected through websocket (socket.io) to the server (⚠️ not directly to obs to avoid dealing with too much traffic)

Each client is assigned an id (check in the server part what the id means) and communicate with an arduino-like controller through serial console (autodetect COM port, self reconnect)

## 3 Hardware
The arduino controller waits for data from serial console and change colors following recieved instructions from the client

![image](https://user-images.githubusercontent.com/42867004/199022512-efd3dbd6-2e95-435c-8eda-3dc9e3d3a043.png)
![image](https://user-images.githubusercontent.com/42867004/199023022-f32151b9-89f1-4941-98db-bbaf5ef3cbcb.png)

# :package: Setup instructions
Requirements: 
- Nodejs 16.9.0 or superior (not tested below)
- An arduino like microcontroller with 2 leds (red & green) + resistor in needed
- The system can run from the main host computer but is designed to run across different computers in a network

Installation:
- First make sure to download the repository
- Install dependencies: `npm install`
- Rename config.example.js to config.js and fill it according to your needs:
    - for the server part provide the list of camera(s) and the obs websocket platform
    - for the client part provide the server ip adress and the camera id attached to this telly light
- connect the arduino to the computer running the client, make sure it is running [this script](https://github.com/chaun14/obs-tally-node/tree/master/nodeOBSTally) and setup your leds following [the scheme before](#3-hardware)





# :headphones: Discord Server

If you need any help with this system or have a question regarding it, feel free to join and communicate with me on my discord server.
<p align="center">
  <a href="https://discord.gg/dFD2VzV">
    <img src="https://discordapp.com/api/guilds/661708081926897684/widget.png?style=banner3" alt="Discord Invite"/>
  </a>
</p>
