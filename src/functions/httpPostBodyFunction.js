const { app } = require('@azure/functions');

app.http('httpPostBodyFunction', {
    methods: ['POST'],
    authLevel: 'function',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            const person = await request.json();
            const { name, age } = person;

            if (!name || !age) {
                return {
                    status: 400,
                    body: 'Please provide both name and age in the request body.'
                };
            }

            return {
                status: 200,
                body: `Hello, ${name}! You are ${age} years old.`
            };
        } catch (error) {
            return {
                status: 400,
                body: 'Invalid request body. Please provide a valid JSON object with name and age.'
            };
        }
    }
});