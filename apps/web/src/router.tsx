import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import HomePage from './routes/HomePage';
import ReportsPage from './routes/ReportsPage';
import CalculatorLayout from './routes/calculators/CalculatorLayout';
import CalculatorLanding from './routes/calculators/CalculatorLanding';
import AirflowCalculatorPage from './routes/calculators/AirflowCalculatorPage';
import DuctCalculatorPage from './routes/calculators/DuctCalculatorPage';
import ManualJCalculatorPage from './routes/calculators/ManualJCalculatorPage';
import FilterCalculatorPage from './routes/calculators/FilterCalculatorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'calculators',
        element: <CalculatorLayout />,
        children: [
          { index: true, element: <CalculatorLanding /> },
          { path: 'airflow', element: <AirflowCalculatorPage /> },
          { path: 'duct', element: <DuctCalculatorPage /> },
          { path: 'manual-j', element: <ManualJCalculatorPage /> },
          { path: 'filter', element: <FilterCalculatorPage /> },
        ],
      },
      { path: 'reports', element: <ReportsPage /> },
    ],
  },
]);
