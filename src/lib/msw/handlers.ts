import { http, HttpResponse } from 'msw';

const demoSeries = Array.from({ length: 12 }, (_, i) => ({
  month: i + 1,
  velocity: Math.round(60 + Math.random() * 25),
  completion: Math.round(50 + Math.random() * 40),
}));

export const handlers = [
  http.get('/api/kpis', () => HttpResponse.json({
    throughput: 127,
    cycleTimeDays: 4.3,
    onTimeRate: 0.86,
  })),
  http.get('/api/series', () => HttpResponse.json(demoSeries)),
];
