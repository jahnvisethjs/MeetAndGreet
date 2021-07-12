# Microsoft Teams Clone- Meet and Greet

Meet and Greet is a meeting web application which is built as a project under Microsoft Engage Mentorship Program. The challenge was to build a MS teams clone and solution should be a fully functional prototype with at least one mandatory functionality - a minimum of two participants should be able connect with each other using the product to have a video conversation.

Try it here: (https://videomeetgreet.herokuapp.com/)

--------------------------------------------------------------------------------------------------------------------------------------
My solution has following functionalities:
* ###### Video Call- can interact with each other on a video call
* ###### Mute/Unmute- can sswitch on/off their audio
* ###### Camera On/Off- can switch on/off their camera
* ###### Share Link- can share meeting id or link with others to join 
* ###### Join/Start Meeting- can join meeting via link/code or start instant meeting
* ###### Chat- can have a chat in meeting, before or after the meeting
* ###### End Call- can leave from a meeting

---------------------------------------------------------------------------------------------------------------------------------------

## Screenshots
#### HomePage
<img src="public\screenshots\homepage.png" alt="Homepage">

<img src="public\screenshots\enterName.png">

#### Chat Room
<img src="public\screenshots\ChatRoom.png" alt="chatRoom">

#### Meeting Screen
<img src="public\screenshots\meetingScreen.png" alt="meetingScreen">

#### Share link
<img src="public\screenshots\shareLink.png" alt="share link">

#### Chat in meeting
<img src="public\screenshots\chatIn.png">

#### EndPage
<img src="public\screenshots\endPage.png" alt="end screen">

---------------------------------------------------------------------------------------------------------------------------------------

## Tech Stack:

#### Front-end technologies:

* EJS
* HTML
* CSS
* JavaScript

#### Back-end technologies

* Node.js
* Express.js

#### Hostng platform

* Heroku

#### Other

* Socket.io (for real time communication)
* PeerJS (for peer to peer video calling)

---------------------------------------------------------------------------------------------------------------------------------------

## Known Bugs
* Video freeze issue-> if a person leaves the meeting, then their video freezes sometimes for the rest of the users
* If a person is connected through a mobile phone, if they go to a new room and come back, their video freezes
