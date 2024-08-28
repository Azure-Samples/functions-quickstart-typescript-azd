import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

interface Person {
    name: string;
    age: number;
}

function isPerson(obj: any): obj is Person {
    return typeof obj === 'object' && obj !== null && 
           typeof obj.name === 'string' && 
           typeof obj.age === 'number';
}

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

app.http('httppost', {
    methods: ['POST'],
    authLevel: 'function',
    handler: httpPostBodyFunction
});
