'use client';

import { useState } from 'react';

const defaultStandards: Record<string, number> = {
  CO2: 50.0,
  NO2: 40.0,
  SO2: 20.0,
  Dust: 30.0,
};

type ResultItem = {
  key: string;
  actual: number;
  standard: number;
  level: 'normal' | 'borderline' | 'high';
  msg: string;
};

export default function AirQualityChecker() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<{
    analysis: ResultItem[];
    summary: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const getOverallAssessment = (resultArr: ResultItem[]): string => {
    const exceeded = resultArr.filter((r) => r.level === 'high').length;
    if (exceeded === 0) return 'Хорошее';
    if (exceeded <= 2) return 'Умеренное';
    return 'Плохое';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const analysis: ResultItem[] = Object.keys(defaultStandards).map((key) => {
      const actual = parseFloat(values[key] || '0');
      const standard = defaultStandards[key];
      let level: 'normal' | 'borderline' | 'high' = 'normal';
      let msg = `Норма (${standard} мг/м3)`;

      if (actual > standard * 1.2) {
        level = 'high';
        msg = `Превышение на ${(actual - standard).toFixed(2)} мг/м3`;
      } else if (actual > standard) {
        level = 'borderline';
        msg = `Незначительное превышение`;
      }

      return { key, actual, standard, level, msg };
    });
    setResults({ analysis, summary: getOverallAssessment(analysis) });
  };

  const colorMap: Record<'normal' | 'borderline' | 'high', string> = {
    normal: 'bg-green-100 border-green-300',
    borderline: 'bg-yellow-100 border-yellow-300',
    high: 'bg-red-100 border-red-300',
  };

  const recommendation = (summary: string): string => {
    if (summary === 'Хорошее') return 'Никаких действий не требуется.';
    if (summary === 'Умеренное') return 'Рекомендуется проветрить помещение и сократить уличную активность.';
    return 'Ограничьте пребывание на улице и используйте очистители воздуха.';
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-100 px-4">
      <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Мониторинг качества воздуха</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {Object.keys(defaultStandards).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-lg font-semibold text-gray-700 mb-1">{key} (мг/м3)</label>
              <input
                type="number"
                step="0.01"
                name={key}
                value={values[key] || ''}
                onChange={handleChange}
                required
                className="transition-all duration-200 ease-in-out p-3 rounded-lg border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 bg-white"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
          >
            Сравнить
          </button>
        </form>

        {results && (
          <div className="mt-8 space-y-4 animate-fade-in">
            <h2 className="text-xl font-bold text-blue-800">Результаты:</h2>
            <ul className="space-y-3">
              {results.analysis.map((item) => (
                <li
                  key={item.key}
                  className={`p-4 rounded-lg border ${colorMap[item.level]} text-base`}
                >
                  <strong>{item.key}</strong>: {item.msg} (введено: {item.actual})
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t text-base">
              <p><strong>Общее состояние воздуха:</strong> {results.summary}</p>
              <p className="mt-2"><strong>Рекомендации:</strong> {recommendation(results.summary)}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
