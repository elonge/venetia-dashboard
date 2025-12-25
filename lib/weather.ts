// lib/weather.ts
import clientPromise from './mongodb';

export async function getWeather(startDate: string, endDate?: string, location: string = 'London') {
  const client = await clientPromise;
  const db = client.db('venetia_project');
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  let query: any = {
    location: { $regex: location, $options: 'i' }
  };

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  } else {
    const endOfDay = new Date(startDate);
    endOfDay.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: endOfDay };
  }

  console.log('Weather query:', query);
  const records = await db.collection('weather')
    .find(query)
    .sort({ date: 1 })
    .toArray();

  if (records.length === 0) {
    return { info: `No weather records found for ${location} around this period.` };
  }

  return records.map(r => ({
    date: r.date.toISOString().split('T')[0],
    location: r.location,
    tmax: r.tmax,
    tmin: r.tmin,
    tavg: r.tavg,
    prcp: r.prcp,
    unit: r.temp_unit
  }));
}

// Keep the old name as an alias for compatibility if needed, but update implementation
export async function getWeatherForDate(dateStr: string, location: string = 'London') {
  return getWeather(dateStr, undefined, location);
}