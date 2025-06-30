const { google } = require('googleapis');
const fs = require('fs');

async function fetchMetrics() {
  // Decode base64 from env var and parse JSON
  const base64Key = process.env.GA_SERVICE_ACCOUNT_KEY;
  if (!base64Key) {
    console.error('Missing GA_SERVICE_ACCOUNT_KEY environment variable.');
    process.exit(1);
  }
  const keyJsonString = Buffer.from(base64Key, 'base64').toString('utf-8');
  const key = JSON.parse(keyJsonString);

  const propertyId = process.env.GA_PROPERTY_ID;
  if (!propertyId) {
    console.error('Missing GA_PROPERTY_ID environment variable.');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    credentials: key,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
  });

  const analyticsData = google.analyticsdata({
    version: 'v1beta',
    auth,
  });

  const request = {
    property: `properties/${propertyId}`,
    requestBody: {
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'screenPageViews' },
      ],
      dimensions: [{ name: 'deviceCategory' }],
    },
  };

  try {
    const response = await analyticsData.properties.runReport(request);

    let totalSessions = 0;
    let totalPageViews = 0;
    let averageSessionDuration = 0;
    let deviceBreakdown = {};

    if (response.data.rows) {
      for (const row of response.data.rows) {
        const device = row.dimensionValues[0].value;
        const sessions = parseInt(row.metricValues[0].value, 10);
        const avgDuration = parseFloat(row.metricValues[1].value);
        const pageViews = parseInt(row.metricValues[2].value, 10);

        totalSessions += sessions;
        totalPageViews += pageViews;

        deviceBreakdown[device] = {
          sessions,
          averageSessionDuration: avgDuration,
          pageViews,
        };
      }
    }

    const weightedDurationSum = Object.values(deviceBreakdown).reduce(
      (sum, d) => sum + d.sessions * d.averageSessionDuration,
      0
    );
    averageSessionDuration = totalSessions ? weightedDurationSum / totalSessions : 0;

    const pagesPerSession = totalSessions ? totalPageViews / totalSessions : 0;

    const metrics = {
      totalSessions,
      averageSessionDuration,
      pagesPerSession,
      deviceBreakdown,
    };

    fs.writeFileSync('src/data/metrics.json', JSON.stringify(metrics, null, 2));
    console.log('Metrics saved to src/data/metrics.json');
  } catch (err) {
    console.error('Error fetching metrics:', err);
    process.exit(1);
  }
}

fetchMetrics();