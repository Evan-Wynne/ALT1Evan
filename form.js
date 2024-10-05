auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = 'login.html';
    }
  });
  
  document.getElementById('flight-form').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const user = auth.currentUser;
    if (!user) {
      alert('You must be logged in to submit flight details.');
      return;
    }
  
    const flightDetails = {
      date: document.getElementById('flight-date').value,
      flightNumber: document.getElementById('flight-number').value,
      departureAirport: document.getElementById('departure-airport').value,
      arrivalAirport: document.getElementById('arrival-airport').value,
      airline: document.getElementById('airline').value,
      aircraft: document.getElementById('aircraft').value,
      reasonForTravel: document.getElementById('reason-for-travel').value || null,
      seatType: document.getElementById('seat-type').value || null,
      travelClass: document.getElementById('travel-class').value || null, 
      flightTime: formatFlightTime(
        document.getElementById('flight-time-hours').value,
        document.getElementById('flight-time-minutes').value
      )
    };
  
    console.log('Submitting flight details:', flightDetails);
  
    try {
      await db.collection('users').doc(user.uid).collection('flights').add(flightDetails);
      console.log('Data saved successfully to Firestore.');
      window.location.href = 'dashboard.html';
    } catch (error) {
      alert('Error saving flight details: ' + error.message);
      console.error('Error saving to Firestore:', error);
    }
  });
  
  // Function to format flight time as HH:MM
  function formatFlightTime(hours, minutes) {
    const h = hours ? parseInt(hours, 10) : 0;
    const m = minutes ? parseInt(minutes, 10) : 0;
    return h || m ? `${h}:${m < 10 ? '0' : ''}${m}` : null;
  }