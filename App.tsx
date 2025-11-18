import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import SymptomTracker from './pages/SymptomTracker';
import Vitals from './pages/Vitals';
import Medications from './pages/Medications';
import Goals from './pages/Goals';
import AICoach from './pages/AICoach';
import Insights from './pages/Insights';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/symptoms" element={<SymptomTracker />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/coach" element={<AICoach />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

