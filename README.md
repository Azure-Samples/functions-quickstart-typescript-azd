<!--
---
name: Azure Functions TypeScript HTTP Trigger using Azure Developer CLI
description: This repository contains an Azure Functions HTTP trigger quickstart written in TypeScript and deployed to Azure Functions Flex Consumption using the Azure Developer CLI (azd). The sample uses managed identity and a virtual network to make sure deployment is secure by default.
page_type: sample
languages:
- azdeveloper
- bicep
- nodejs
- typescript
products:
- azure
- azure-functions
- entra-id
urlFragment: functions-quickstart-typescript-azd
---
-->

# Azure Functions TypeScript HTTP Trigger using Azure Developer CLI

This repository contains an Azure Functions HTTP trigger reference sample written in TypeScript and deployed to Azure using Azure Developer CLI (`azd`). The sample uses managed identity and a virtual network to make sure deployment is secure by default.

This source code supports the article [Quickstart: Create and deploy functions to Azure Functions using the Azure Developer CLI](https://learn.microsoft.com/azure/azure-functions/create-first-function-azure-developer-cli?pivots=programming-language-typescript).

## Prerequisites

+ [Node.js 20](https://www.nodejs.org/)
+ [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local?pivots=programming-language-typescript#install-the-azure-functions-core-tools)
+ [Azure Developer CLI (AZD)](https://learn.microsoft.com/azure/developer/azure-developer-cli/install-azd)
+ To use Visual Studio Code to run and debug locally:
  + [Visual Studio Code](https://code.visualstudio.com/)
  + [Azure Functions extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)

## Initialize the local project

You can initialize a project from this `azd` template in one of these ways:

+ Use this `azd init` command from an empty local (root) folder:

    ```shell
    azd init --template functions-quickstart-typescript-azd
    ```

    Supply an environment name, such as `flexquickstart` when prompted. In `azd`, the environment is used to maintain a unique deployment context for your app.

+ Clone the GitHub template repository locally using the `git clone` command:

    ```shell
    git clone https://github.com/Azure-Samples/functions-quickstart-typescript-azd.git
    cd functions-quickstart-typescript-azd
    ```

    You can also clone the repository from your own fork in GitHub.

## Prepare your local environment

Add a file named `local.settings.json` in the root of your project with the following contents:

```json
{
    "IsEncrypted": false,
    "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node"
    }
}
```

## Run your app from the terminal

1. Run these commands in the virtual environment:

    ```shell
    npm install
    npm start
    ```

1. From your HTTP test tool in a new terminal (or from your browser), call the HTTP GET endpoint: <http://localhost:7071/api/httpget>

1. Test the HTTP POST trigger with a payload using your favorite secure HTTP test tool. This example uses the `curl` tool with payload data from the [`testdata.json`](./src/functions/testdata.json) project file:

    ```shell
    curl -i http://localhost:7071/api/httppost -H "Content-Type: text/json" -d "@src/functions/testdata.json"
    ```

1. When you're done, press Ctrl+C in the terminal window to stop the `func.exe` host process.

## Run your app using Visual Studio Code

1. Open the root folder in a new terminal.
1. Run the `code .` code command to open the project in Visual Studio Code.
1. Press **Run/Debug (F5)** to run in the debugger. Select **Debug anyway** if prompted about local emulator not running.
1. Send GET and POST requests to the `httpget` and `httppost` endpoints respectively using your HTTP test tool (or browser for `httpget`). If you have the [RestClient](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension installed, you can execute requests directly from the [`test.http`](./src/functions/test.http) project file.

## Source Code

The source code for the GET and POST functions is in the [`httpGetFunction.ts`](./src/functions/httpGetFunction.ts) and [`httpPostBodyFunction.ts`](./src/functions/httpPostBodyFunction.ts) code files, respectively. Azure Functions requires the use of the `@azure/functions` library.

This code shows an HTTP GET triggered function:

```typescript
export async function httpGetFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get('name') || await request.text() || 'world';

    return { body: `Hello, ${name}!` };
};
```

This code shows an HTTP POST triggered function that expects `person` object with `name` and `age` values in the request body.

```typescript
export async function httpPostBodyFunction(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

        try {
            const data: any  = await request.json();
    
            if (!isPerson(data)) {
                return {
                    status: 400,
                    body: 'Please provide both name and age in the request body.'
                };
            }

            return {
                status: 200,
                body: `Hello, ${data.name}! You are ${data.age} years old.`
            };
        } catch (error) {
            return {
                status: 400,
                body: 'Invalid request body. Please provide a valid JSON object with name and age.'
            };
        }
};
```

## Deploy to Azure

Run this command to provision the function app, with any required Azure resources, and deploy your code:

```shell
azd up
```

By default, this sample prompts to enable a virtual network for enhanced security. If you want to deploy without a virtual network without prompting, you can configure `VNET_ENABLED` to `false` before running `azd up`:

```bash
azd env set VNET_ENABLED false
azd up

You're prompted to supply these required deployment parameters:

| Parameter | Description |
| ---- | ---- |
| _Environment name_ | An environment that's used to maintain a unique deployment context for your app. You won't be prompted if you created the local project using `azd init`.|
| _Azure subscription_ | Subscription in which your resources are created.|
| _Azure location_ | Azure region in which to create the resource group that contains the new Azure resources. Only regions that currently support the Flex Consumption plan are shown.|

After publish completes successfully, `azd` provides you with the URL endpoints of your new functions, but without the function key values required to access the endpoints. To learn how to obtain these same endpoints along with the required function keys, see [Invoke the function on Azure](https://learn.microsoft.com/azure/azure-functions/create-first-function-azure-developer-cli?pivots=programming-language-typescript#invoke-the-function-on-azure) in the companion article [Quickstart: Create and deploy functions to Azure Functions using the Azure Developer CLI](https://learn.microsoft.com/azure/azure-functions/create-first-function-azure-developer-cli?pivots=programming-language-typescript).

## Redeploy your code

You can run the `azd up` command as many times as you need to both provision your Azure resources and deploy code updates to your function app.

>[!NOTE]
>Deployed code files are always overwritten by the latest deployment package.

## Clean up resources

When you're done working with your function app and related resources, you can use this command to delete the function app and its related resources from Azure and avoid incurring any further costs:

```shell
azd down
```
