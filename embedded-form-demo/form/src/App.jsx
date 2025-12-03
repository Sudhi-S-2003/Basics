import { Routes, Route } from 'react-router-dom';
import FormPage from './pages/FormPage';

function App() {
  return (
    <Routes>
      <Route path="/form" element={<FormPage />} />
      <Route path="/" element={
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Form Provider </h1>
            <p className="text-muted-foreground mb-4">
              Visit <a href="/form" className="text-primary hover:underline">/form</a> to see the embeddable form
            </p>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;