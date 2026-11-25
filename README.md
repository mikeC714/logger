# T:Log Node.js Library


This guide is assuming that you have already installed the T:Log app 


## Installation

Install package with:

    npm install @tlog


## Configuration 

The package needs your userKey and projectKey:

```javascript
    import { Logger } from "@tlog";
    
    const logger = new Logger({
        userKey:"Hash from application",
        projectKey:"Name of the log"
    });
```


## Basic Usage


```javascript
    app.use(async(err:Error | any, req:Request, res:Response, next:NextFunction) => {
		let status = 500;

		if(err instanceof AppError){

            await logger.log({
                lvl:"info", // "info" | "warn" | "error" | "fatal" | "debug"  Default: "info"
                msg:"", 
                meta:{
                    timeStamp: new Date(Date.now()).toISOString().split("T").join("  ") 
                }
            }); 

			return res.status(err.statusCode).json({ error: err.message })

		};

		return res.status(err.statusCode || status).json({ error: err.message })
	});
```


