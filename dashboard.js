const dealsData = [];
const industryData = {};
const fundingStageData = {};
let totalInvested = 0;
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        const dealsRef = db.collection('users').doc(user.uid).collection('deals');

        // Fetch data from Firestore
        dealsRef.get()
            .then((querySnapshot) => {
                const tableBody = document.getElementById('deal-table').getElementsByTagName('tbody')[0];
                tableBody.innerHTML = '';

                if (querySnapshot.empty) {
                    document.getElementById('deal-data').style.display = 'none';
                    document.getElementById('no-deal-data').style.display = 'block';
                } else {
                    querySnapshot.forEach((doc) => {
                        const deal = doc.data();
                        dealsData.push(deal);
                        totalInvested += deal.amountInvested || 0;  // Total amount invested

                        // Count deals by industry
                        if (deal.industrySector) {
                            industryData[deal.industrySector] = (industryData[deal.industrySector] || 0) + 1;
                        }

                        // Count funding stages
                        if (deal.fundingStage) {
                            fundingStageData[deal.fundingStage] = (fundingStageData[deal.fundingStage] || 0) + 1;
                        }

                        const dealId = doc.id;

                        // Populate the table with data
                        const row = tableBody.insertRow();
                        row.innerHTML = `
                          <td>${deal.date}</td>
                          <td>${deal.companyName}</td>
                          <td>${deal.hqLocation}</td>
                          <td>${deal.amountInvested}</td>
                          <td>${deal.valuation}</td>
                          <td>${deal.industrySector || ''}</td>
                          <td>${deal.fundingStage || ''}</td>
                          <td>
                            <button class="delete-btn" data-id="${dealId}">Delete</button>
                          </td>
                        `;

                        // Event listener for delete button
                        row.querySelector('.delete-btn').addEventListener('click', handleDeleteDeal);
                    });

                    // Show the table
                    document.getElementById('deal-data').style.display = 'block';
                    document.getElementById('no-deal-data').style.display = 'none';

                    // Debugging: Check the structure of your deals data

                    console.log("Deals Data:", dealsData);
                    console.log("Total Invested:", totalInvested);
                    console.log("Industry Data:", industryData);
                    console.log("Funding Stage Data:", fundingStageData);


                    // Generate charts after deals are fetched
                    generateCharts();
                }
            })
            .catch((error) => {
                alert('Error fetching deal details: ' + error.message);
            });
    }
});

// Handle deleting a deal
function handleDeleteDeal(event) {
    const dealId = event.target.getAttribute('data-id');

    if (confirm('Are you sure you want to delete this deal?')) {
        db.collection('users').doc(auth.currentUser.uid).collection('deals').doc(dealId).delete()
            .then(() => {
                alert('Deal deleted successfully!');
                location.reload();
            })
            .catch((error) => {
                alert('Error deleting deal: ' + error.message);
            });
    }
}

// Generate charts based on collected data
function generateCharts() {
    generateTotalAmountInvestedChart();
    generateDealsByIndustryChart();
    generateFundingStageChart();
}

// Line Chart: Total Amount Invested Over Time
function generateTotalAmountInvestedChart() {
    const labels = dealsData.map(deal => new Date(deal.date).toLocaleDateString());
    const amounts = dealsData.map(deal => deal.amountInvested || 0);

    new Chart(document.getElementById('totalAmountInvestedChart'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Total Amount Invested',
                data: amounts,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: true
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Pie Chart: Deals by Industry Sector
function generateDealsByIndustryChart() {
    const industries = Object.keys(industryData);
    const counts = Object.values(industryData);

    new Chart(document.getElementById('dealsByIndustryChart'), {
        type: 'pie',
        data: {
            labels: industries,
            datasets: [{
                data: counts,
                backgroundColor: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f']
            }]
        }
    });
}

// Pie Chart: Funding Stage Distribution
function generateFundingStageChart() {
    const stages = Object.keys(fundingStageData);
    const counts = Object.values(fundingStageData);

    new Chart(document.getElementById('fundingStageChart'), {
        type: 'pie',
        data: {
            labels: stages,
            datasets: [{
                data: counts,
                backgroundColor: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f']
            }]
        }
    });
}
