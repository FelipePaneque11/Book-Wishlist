// Fetch JSON data and dynamically generate the pie chart
fetch('/wishlist')
  .then(response => response.json())
  .then(wishlist => {
    // Extract genre data and count occurrences
    const genreCounts = wishlist.reduce((acc, book) => {
      const genre = book.categories;
      acc[genre] = (acc[genre] || 0) + 1;
      return acc;
    }, {});

    // Prepare data for Chart.js
    const labels = Object.keys(genreCounts);
    const data = Object.values(genreCounts);

    const ctx = document.getElementById('genrePieChart').getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Books by Genre',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        }
      }
    });
  })
  .catch(error => console.error('Error fetching the JSON file:', error));
