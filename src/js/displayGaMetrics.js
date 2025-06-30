async function fetchMetrics() {
  try {
    const response = await fetch('/src/data/metrics.json');

    if (!response.ok) {
      throw new Error('Failed to fetch metrics');
    }

    const data = await response.json();

    // Total Visits
    document.getElementById('totalVisits').textContent = data.totalSessions?.toLocaleString() || 'N/A';

    // Device Usage
    if (data.deviceBreakdown) {
      const deviceUsage = Object.entries(data.deviceBreakdown)
        .map(([device, info]) => `${device}: ${info.sessions.toLocaleString()}`)
        .join(', ');
      document.getElementById('deviceUsage').textContent = deviceUsage;
    } else {
      document.getElementById('deviceUsage').textContent = 'N/A';
    }

    // Average Time on Site
    if (data.averageSessionDuration != null) {
      const totalSeconds = Math.round(data.averageSessionDuration);
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      document.getElementById('avgTimeOnSite').textContent = `${mins}m ${secs}s`;
    } else {
      document.getElementById('avgTimeOnSite').textContent = 'N/A';
    }

    // Pages Per Session
    if (data.pagesPerSession != null) {
      document.getElementById('pagesPerSession').textContent = data.pagesPerSession.toFixed(2);
    }

  } catch (error) {
    console.error('Error loading GA metrics:', error);
  }
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', fetchMetrics);