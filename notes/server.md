# Transport Server with NodeJs and WebSockets

## The server is used to transport and direct the log to the specific user and log

* This project was created specifically since I didn't know what logger to use, I decided it was a great opportunity to make my own.



## TECH STACK 

- NodeJs/TS (Fastify)
- Socket.io
- Cron



## HOW THE SERVER WORKS  

* Server gets a request (POST). 

* On first request a socket room is created utilizing the user's userKey. 
  (check client notes to understand how the user and log key are emitted and how they can be obtained.)
  (check sdk notes to understand how the userKey and log is implemented.)


* Once the request is successfully sent, the request body will contain the userKey and log. The body will be funneled to the webSocket utilizing the userKey to direct which socket room the msg event will be sent to.
  The shape of the sent data will be an object ({ projectKey:string, logs:Array<object> }). 
  (check client notes to understand how the log is saved and displayed)   



## FASTIFY vs EXPRESS 

** GO OVER THE UPSIDES OF EXPRESS
** THEN EXPRESS WHY EXPRESS ISN'T THE BEST OPTION
** GO OVER WHY FASTIFY WAS THE THE CHOICE 
** IT'S UPSIDES COMPARED TO EXPRESS
** AND WHAT IS SOME POSSIBLE DOWNSIDES THAT WAS UNDERSTOOD BUT ACCPETED

** DISPLAY THE SPEED DIFFERENCE BETWEEN SAMPLE EXPRESS AND FASTIFY SERVER
** DISPLAY THE THROUGHPUT DIFFERENCE BETWEEN THE TWO 



## Why Socket.io instead of raw TCP

Now the easy answer simplicity. Socket.io handles everything that I don't want to handle manually when it comes to a raw socket.

# PROS
1) Connection Retry/Auto Reconnection
2) Middleware
3) Packet Buffering

Packet Buffering and reconnection is a pain in the ass in order to get working correctly and using socket.io it handles just that. 

# CONS
1) Added overhead, socket.io adds alot of overhead compared to raw sockets. Now that's a plus but also a con since I don't use all of the abstractions but the simplicity that socket.io was worth the possible hit on performance.
2) Handling and creating new events is a bit messy of course there are certains ways and methods that be used in order to make it neater but that doesn't change the fact it can be messy it's just moving the mess.
3) Of course this isn't a problem and I don't it'll be a problem in the near coming future but 9-10k msgs per sec is about the limit that Socket.io can withstand before buffering starts to occur. 

