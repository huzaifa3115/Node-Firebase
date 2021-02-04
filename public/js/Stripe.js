const Stripe = require('stripe');
const stripe = Stripe('pk_test_51IGQv5Cf13kNofjCL6JWqVkIRFlMnFFOOgG1dbCQSUXLqeJjkDPzprmkQ0lOL1iCyr47kU3rnRAv3hX74Rnv7b6O00xbNS9CBl');
const SceretStripeKey="sk_test_51IGQv5Cf13kNofjC9nh6YfKS4unR9d9FbGUagsnqBEoDWs9dCqPIa5scXcNS0TJiDkYEAEXgDqqoNNlcbNJJ2bJ700RzE3hnRh";

stripe.charges.create(
    {
        amount:100,
        currency:"usd",
        source:"Subcription",
        description: "ABC stripe",
        metadata: {'order_id': '1234'}
        
    },
    {
        idempotencyKey: "101NR3UQUt9IzyTk"
    }
    
    
);