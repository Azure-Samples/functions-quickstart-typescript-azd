# Azure Functions JavaScript HTTP Trigger using AZD

This repository contains a Azure Functions HTTP trigger quickstart written in JavaScript and deployed to Azure using Azure Developer CLI (AZD). This sample uses manaaged identity and a virtual network to insure it is secure by default. 

## Features

This project framework provides the following features:

* Azure Function HTTP trigger
* Managed Identity
* Virtual Network (VNet)

## Getting Started

### Prerequisites

1) [Node.js 20](https://www.nodejs.org/) 
2) [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=v4%2Cmacos%2Ccsharp%2Cportal%2Cbash#install-the-azure-functions-core-tools)
3) [Azure Developer CLI (AZD)](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)

## Run on your local environment

1) Add a file named local.settings.json file to the root of the project with the following contents. This will allow you to debug your function locally.
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing"
  }
}
```
2) Start Azurite storage emulator
```bash
docker run -p 10000:10000 -p 10001:10001 -p 10002:10002 mcr.microsoft.com/azure-storage/azurite
```

### Using Functions CLI
1) Open a new terminal and do the following:

```bash
npm install
func start
```
2) Test the HTTP GET trigger by using the browser to open http://localhost:7071/api/httpGetFunction

### Using Visual Studio Code
1) Open this folder in a new terminal
2) Open VS Code by entering `code .` in the terminal
3) Press Run/Debug (F5) to run in the debugger
4) Use same approach above to test using an HTTP REST client

## Source Code

The key code that makes this work is as follows in [src/functions/http.js](src/functions/http.js).  

```javascript
const { app } = require('@azure/functions');

app.http('http', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || await request.text() || 'world';

        return { body: `Hello, ${name}!` };
    }
});
```

## Deploy to Azure

The easiest way to deploy this app is using the [Azure Dev CLI aka AZD](https://aka.ms/azd).  If you open this repo in GitHub CodeSpaces the AZD tooling is already preinstalled.

To provision and deploy:
```bash
azd up
```