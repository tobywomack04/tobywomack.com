async function loadLangChart() {
  try {
    const response = await fetch('src/data/languages.json');
    const data = await response.json();

    // Filter to only include HTML, CSS, and JavaScript
    const allowedLanguages = ['HTML', 'CSS', 'JavaScript'];

    // Create filtered arrays for labels and values
    const labels = allowedLanguages.filter(lang => lang in data);
    const values = labels.map(lang => data[lang]);

    // Colors for the three languages
    const backgroundColors = {
      'HTML': '#f16529',
      'CSS': '#2965f1',
      'JavaScript': '#f7df1e',
    };

    const colors = labels.map(lang => backgroundColors[lang]);

    const ctx = document.getElementById('langChart').getContext('2d');

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#FFFFFF'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percent = ((value / total) * 100).toFixed(1);
                return `${label}: ${percent}% (${value} bytes)`;
              }
            }
          }
        }
      }
    });

  } catch (error) {
    console.error('Failed to load tech stack data:', error);
  }
}

// Run the function
loadLangChart();