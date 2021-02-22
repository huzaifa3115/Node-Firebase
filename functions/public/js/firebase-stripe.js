const STRIPE_PUBLISHABLE_KEY = '';

// Replace with your tax ids
// https://dashboard.stripe.com/tax-rates
const taxRates = [''];
const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: '',
};
// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const functionLocation = 'us-central1';


firebase.auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
        currentUser = firebaseUser.uid;
        startDataListeners();
    } else {
        signout();
    }
});


function signout(params) {
    firebase.auth().signOut();
    window.location.assign('/sessionLogout');
}

//  STRIPE

function startDataListeners() {
    // Get all our products and render them to the page
    const products = document.querySelector('.products');
    const template = document.querySelector('#product');
    db.collection('products')
        .where('active', '==', true)
        .get()
        .then((querySnapshot) => {
            console.log('hi');
            querySnapshot.forEach(async function (doc) {
                const priceSnap = await doc.ref
                    .collection('prices')
                    .orderBy('unit_amount')
                    .get();
                if (!'content' in document.createElement('template')) {
                    console.error('Your browser doesn’t support HTML template elements.');
                    return;
                }

                const product = doc.data();
                const container = template.content.cloneNode(true);

                container.querySelector('h2').innerText = product.name.toUpperCase();
                container.querySelector('.description').innerText = product.description?.toUpperCase() || '';
                // Prices dropdown
                priceSnap.docs.forEach((doc) => {
                    const priceId = doc.id;
                    const priceData = doc.data();
                    const content = document.createTextNode(
                        `${new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: priceData.currency,
                        }).format((priceData.unit_amount / 100).toFixed(2))} per ${priceData.interval
                        }`,
                    );
                    const option = document.createElement('option');
                    option.value = priceId;
                    option.appendChild(content);
                    container.querySelector('#price').appendChild(option);
                });

                if (product.images.length) {
                    const img = container.querySelector('img');
                    img.src = product.images[0];
                    img.alt = product.name;
                }

                const form = container.querySelector('form');
                form.addEventListener('submit', subscribe);

                products.appendChild(container);
            });
        });
    // Get all subscriptions for the customer
    db.collection('customers')
        .doc(currentUser)
        .collection('subscriptions')
        .where('status', 'in', ['trialing', 'active'])
        .onSnapshot(async (snapshot) => {
            // console.log('huasf', snapshot.docs[0])
            if (snapshot.empty) {
                // Show products
                document.querySelector('#subscribe').style.display = 'block';
                return;
            }
            // document.querySelector('#subscribe').style.display = 'none';
            document.querySelector('#my-subscription').style.display = 'block';
            // In this implementation we only expect one Subscription to exist
            const subscription = snapshot.docs[0].data();
            const priceData = (await subscription.price.get()).data();
            document.querySelector(
                '#my-subscription p',
            ).textContent = `You are paying ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: priceData.currency,
            }).format((priceData.unit_amount / 100).toFixed(2))} per ${priceData.interval
                }`;
        });
}

/**
 * Event listeners
 */

// Signout button
document
    .getElementById('signout')
    .addEventListener('click', () => firebase.auth().signOut());

// Checkout handler
async function subscribe(event) {
    event.preventDefault();
    document.querySelectorAll('button').forEach((b) => (b.disabled = true));
    const formData = new FormData(event.target);

    const docRef = await db
        .collection('customers')
        .doc(currentUser)
        .collection('checkout_sessions')
        .add({
            price: formData.get('price'),
            allow_promotion_codes: true,
            // tax_rates: taxRates,
            success_url: window.location.origin,
            cancel_url: window.location.origin,
            metadata: {
                tax_rate: '10% sales tax exclusive',
            },
        });
    // Wait for the CheckoutSession to get attached by the extension
    docRef.onSnapshot((snap) => {
        const { error, sessionId } = snap.data();
        if (error) {
            // Show an error to your customer and then inspect your function logs.
            alert(`An error occured: ${error.message}`);
            document.querySelectorAll('button').forEach((b) => (b.disabled = false));
        }
        if (sessionId) {
            // We have a session, let's redirect to Checkout
            // Init Stripe
            const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
            stripe.redirectToCheckout({ sessionId });
        }
    });
}

// Billing portal handler
document
    .querySelector('#billing-portal-button')
    .addEventListener('click', async (event) => {
        document.querySelectorAll('button').forEach((b) => (b.disabled = true));

        // Call billing portal function
        const functionRef = firebase
            .app()
            .functions(functionLocation)
            .httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');
        const { data } = await functionRef({ returnUrl: window.location.origin });
        window.location.assign(data.url);
    });

// Get custom claim role helper
async function getCustomClaimRole() {
    await firebase.auth().currentUser.getIdToken(true);
    const decodedToken = await firebase.auth().currentUser.getIdTokenResult();
    console.log(decodedToken);
    return decodedToken.claims.stripeRole;
}
