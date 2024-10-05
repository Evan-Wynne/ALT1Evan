auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
    }
});

document.getElementById('deal-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert('You must be logged in to submit deal details.');
        return;
    }

    const dealDetails = {
        date: document.getElementById('deal-date').value,
        companyName: document.getElementById('company-name').value,
        hqLocation: document.getElementById('hq-location').value,
        amountInvested: document.getElementById('amount-invested').value,
        valuation: document.getElementById('valuation').value,
        industrySector: document.getElementById('industry-sector').value || null,
        fundingStage: document.getElementById('funding-stage').value || null
    };

    console.log('Submitting deal details:', dealDetails);

    try {
        await db.collection('users').doc(user.uid).collection('deals').add(dealDetails);
        console.log('Data saved successfully to Firestore.');
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Error saving deal details: ' + error.message);
        console.error('Error saving to Firestore:', error);
    }
});
