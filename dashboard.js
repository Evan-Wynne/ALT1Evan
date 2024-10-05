const flightsData = [];
const airportsData = {};
const routesData = {};
const airlinesData = {};
const flightTimesData = [];
const aircraftTypesData = {};
const travelReasonsData = {};
const travelClassesData = {};
const seatTypesData = {};

auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = 'login.html';
  } else {
    const flightsRef = db.collection('users').doc(user.uid).collection('flights');

    // Fetch data from Firestore
    flightsRef.get()
      .then((querySnapshot) => {
        const tableBody = document.getElementById('flight-table').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';

        if (querySnapshot.empty) {
          document.getElementById('flight-data').style.display = 'none';
          document.getElementById('no-flight-data').style.display = 'block';
          // Add a flight button
          document.getElementById('add-flight-button').addEventListener('click', () => {
            window.location.href = 'form.html';
          });
        } else {
          querySnapshot.forEach((doc) => {
            const flight = doc.data();
            const flightId = doc.id;

            // Populate the table with data
            const row = tableBody.insertRow();
            row.innerHTML = `
              <td>${flight.date}</td>
              <td>${flight.flightNumber}</td>
              <td>${flight.departureAirport}</td>
              <td>${flight.arrivalAirport}</td>
              <td>${flight.airline}</td>
              <td>${flight.aircraft}</td>
              <td>${flight.travelClass || ''}</td>
              <td>${flight.flightTime || ''}</td>
              <td>
                <button class="delete-btn" data-id="${flightId}">Delete</button>
              </td>
            `;

            // event listener for delete button
            row.querySelector('.delete-btn').addEventListener('click', handleDeleteFlight);

            // Collect data for charts
            collectChartData(flight);
          });

          // Show the table and charts
          document.getElementById('flight-data').style.display = 'block';
          document.getElementById('no-flight-data').style.display = 'none';

          // Generate charts after data is collected
          generateCharts();
        }
      })
      .catch((error) => {
        alert('Error fetching flight details: ' + error.message);
      });
  }
});

// Handle deleting a flight
function handleDeleteFlight(event) {
  const flightId = event.target.getAttribute('data-id');

  if (confirm('Are you sure you want to delete this flight?')) {
    db.collection('users').doc(auth.currentUser.uid).collection('flights').doc(flightId).delete()
      .then(() => {
        alert('Flight deleted successfully!');
        location.reload();
      })
      .catch((error) => {
        alert('Error deleting flight: ' + error.message);
      });
  }
}


// Collect data for charts
function collectChartData(flight) {
  // Extract year from the date
  const year = flight.date ? new Date(flight.date).getFullYear() : null;
  if (year) flightsData.push(year);

  // Collect airport data
  if (flight.departureAirport) {
    airportsData[flight.departureAirport] = (airportsData[flight.departureAirport] || 0) + 1;
  }
  if (flight.arrivalAirport) {
    airportsData[flight.arrivalAirport] = (airportsData[flight.arrivalAirport] || 0) + 1;
  }
  // Collect route data (departure to arrival)
  const route = `${flight.departureAirport} to ${flight.arrivalAirport}`;
  routesData[route] = (routesData[route] || 0) + 1;
  // Collect airline data
  if (flight.airline) {
    airlinesData[flight.airline] = (airlinesData[flight.airline] || 0) + 1;
  }
  // Collect flight time data
  if (flight.flightTime) {
    const [hours, minutes] = flight.flightTime.split(':').map(Number);
    flightTimesData.push(hours * 60 + minutes);
  }
  // Collect aircraft types
  if (flight.aircraft) {
    aircraftTypesData[flight.aircraft] = (aircraftTypesData[flight.aircraft] || 0) + 1;
  }
  // Collect travel reasons
  if (flight.reasonForTravel) {
    travelReasonsData[flight.reasonForTravel] = (travelReasonsData[flight.reasonForTravel] || 0) + 1;
  }
  // Collect travel class data
  if (flight.travelClass) {
    travelClassesData[flight.travelClass] = (travelClassesData[flight.travelClass] || 0) + 1;
  }
  // Collect seat types
  if (flight.seatType) {
    seatTypesData[flight.seatType] = (seatTypesData[flight.seatType] || 0) + 1;
  }
}

// Generate all charts based on collected data
function generateCharts() {
  generateFlightsPerYearChart();
  generateCommonAirportsChart();
  generateMostFlownRouteChart();
  generateAirlinesChart();
  generateFlightTimesChart();
  generateAircraftTypesChart();
  generateTravelReasonChart();
  generateTravelClassChart();
  generateSeatTypeChart();
}

// Chart Functions

// Bar Chart: Number of Flights Per Year
function generateFlightsPerYearChart() {
  const years = [...new Set(flightsData)].sort();
  const counts = years.map(year => flightsData.filter(y => y === year).length);

  new Chart(document.getElementById('flightsPerYearChart'), {
    type: 'bar',
    data: {
      labels: years,
      datasets: [{
        label: 'Flights Per Year',
        data: counts,
        backgroundColor: '#4e79a7'
      }]
    }
  });
}

// Bar Chart: Most Common Airports
function generateCommonAirportsChart() {
  const airports = Object.keys(airportsData);
  const counts = Object.values(airportsData);

  new Chart(document.getElementById('commonAirportsChart'), {
    type: 'bar',
    data: {
      labels: airports,
      datasets: [{
        label: 'Most Common Airports',
        data: counts,
        backgroundColor: '#f28e2b'
      }]
    }
  });
}

// Sideways Bar Chart: Most Flown Route
function generateMostFlownRouteChart() {
  const routes = Object.keys(routesData);
  const counts = Object.values(routesData);

  new Chart(document.getElementById('mostFlownRouteChart'), {
    type: 'bar',
    data: {
      labels: routes,
      datasets: [{
        label: 'Most Flown Routes',
        data: counts,
        backgroundColor: '#e15759'
      }]
    },
    options: {
      indexAxis: 'y'
    }
  });
}

// Bar Chart: Airlines
function generateAirlinesChart() {
  const airlines = Object.keys(airlinesData);
  const counts = Object.values(airlinesData);

  new Chart(document.getElementById('airlinesChart'), {
    type: 'bar',
    data: {
      labels: airlines,
      datasets: [{
        label: 'Airlines',
        data: counts,
        backgroundColor: '#76b7b2'
      }]
    }
  });
}

// Plot Chart: Flight Times
function generateFlightTimesChart() {
  new Chart(document.getElementById('flightTimesChart'), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Flight Times',
        data: flightTimesData.map((time, index) => ({ x: index + 1, y: time })),
        backgroundColor: '#59a14f'
      }]
    }
  });

  // Calculate average and total flight time
  const totalMinutes = flightTimesData.reduce((acc, curr) => acc + curr, 0);
  const averageMinutes = totalMinutes / flightTimesData.length || 0;
  const averageHours = Math.floor(averageMinutes / 60);
  const averageMins = averageMinutes % 60;

  // Display average and total flight times
  document.getElementById('averageFlightTime').textContent = `Average Flight Time: ${averageHours}h ${averageMins}m`;
  document.getElementById('totalFlightTime').textContent = `Total Flight Time: ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
}

// Pie Chart: Aircraft Types
function generateAircraftTypesChart() {
  new Chart(document.getElementById('aircraftTypesChart'), {
    type: 'pie',
    data: {
      labels: Object.keys(aircraftTypesData),
      datasets: [{
        data: Object.values(aircraftTypesData),
        backgroundColor: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f']
      }]
    }
  });
}

// Pie Chart: Travel Reasons
function generateTravelReasonChart() {
  new Chart(document.getElementById('travelReasonChart'), {
    type: 'pie',
    data: {
      labels: Object.keys(travelReasonsData),
      datasets: [{
        data: Object.values(travelReasonsData),
        backgroundColor: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f']
      }]
    }
  });
}

// Pie Chart: Travel Class
function generateTravelClassChart() {
  new Chart(document.getElementById('travelClassChart'), {
    type: 'pie',
    data: {
      labels: Object.keys(travelClassesData),
      datasets: [{
        data: Object.values(travelClassesData),
        backgroundColor: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f']
      }]
    }
  });
}

// Pie Chart: Seat Type
function generateSeatTypeChart() {
  new Chart(document.getElementById('seatTypeChart'), {
    type: 'pie',
    data: {
      labels: Object.keys(seatTypesData),
      datasets: [{
        data: Object.values(seatTypesData),
        backgroundColor: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f']
      }]
    }
  });
}