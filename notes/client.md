# TLOG Client
# The client-side application for TLog, a terminal based log monitoring application.



## WHAT CLIENT HANDLES

* Established connection with Server
* Recieves logs 
* Persists logs locally
* Displays logs with terminal based interface 



## TECH STACK

* Bun/Typescript
* SQLite
* Socket.io/client 
* Opentui/core



## HOW CLIENT RECIEVES LOGS

* On first launch a Database is instantiated if a database does not already exist.

* When the application is launched a socket is generated connecting to the server socket, the socket is generated using the clients username from their system.

* Once a log is sent (typically in batches of 20) the socket event "msg" will fired with log(s), calling write function that utilizes transactions to iterate over the logs and store them,
  while also calling a rerender request to prevent stale data.


## CLIENT INITIALIZATION


          Client Initialization
                   |
                   v
       Check Database Existence
                   |
                   | If it doesn't exist
                   v
          Create Database
                   |
                   v
       Retrieve System Username
                   |
                   | Username
                   v
       Initialize Client Socket
                   |
                   v
          Connect to Server
                   |
                   | Socket Connection
                   v
          Join User Socket Room
                   |
                   v
          Listen for "msg" Event
                   |
                   | Await Incoming Messages
                   v
          Receive Log Payload
                   |
                   | Extract projectKey & logs
                   v
          Store & Display Logs


## HOW CLIENT RECEIVES LOGS

Client's socket listens for "msg" events.

Typically, logs are sent within batches of 20.

# WHEN THE CLIENT RECEIVES MSG EVENT 

1) Log write function is called
2) Write parses body obtaining the projectKey and logs
3) Db write function is then called passing the projectKey and logs 
4) Write utilizes transactions in order to iterate over the logs to save them locally
5) A render request is then triggered to ensure the UI isn't displaying stale data




## PERSISTENCE

- SQLite is used for persistence.
- The database is intailized on client's startup if one isn't already instantiated.



## SOCKET COMMUNICATION

- Socket.io is used in order to communicate with the server 

# CLIENT EVENTS

- msg 



## WHY BUN

1) Performance a fast JavaScript runtime with efficient startup and execution.
2) OpenTUI Compatibility
3) Built-in Tooling, integrated TypeScript support, package management, and SQLite capabilities.



# FUTURE IMPROVEMENTS / POSSIBILITIES

- If stuttering / latency becomes an issue maybe a re-write in a different language may be needed (go or rust maybe)
- Maybe create my own protocol instead of socket.io (just a thought)















