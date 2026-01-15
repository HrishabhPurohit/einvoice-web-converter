import React, { useState } from 'react';
import './App.css';
import ConversionEngine from './utils/ConversionEngine';

function App() {
  const [file, setFile] = useState(null);
  const [converting, setConverting] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.CSV')) {
        setFile(droppedFile);
        setStatus(`Selected: ${droppedFile.name}`);
      } else {
        setError('Please select a CSV file');
      }
    }
  };

  const handleFileChange = (e) => {
    setError('');
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv') || selectedFile.name.endsWith('.CSV')) {
        setFile(selectedFile);
        setStatus(`Selected: ${selectedFile.name}`);
      } else {
        setError('Please select a CSV file');
      }
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }

    setConverting(true);
    setStatus('Converting...');
    setError('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const csvContent = e.target.result;
          const jsonData = ConversionEngine.convertCSVtoJSON(csvContent);
          
          const jsonString = JSON.stringify(jsonData, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'EINVOICE_converted.json';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

          setStatus(`✓ Converted successfully! ${jsonData.length} invoice(s) created`);
          setConverting(false);
        } catch (err) {
          setError(`Conversion error: ${err.message}`);
          setConverting(false);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
        setConverting(false);
      };

      reader.readAsText(file);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setConverting(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>E-Invoice Converter</h1>
          <p>Convert CSV to E-Invoice JSON Format (V4)</p>
        </div>

        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-icon">📄</div>
          <h3>Drag & Drop CSV File Here</h3>
          <p>or</p>
          <label htmlFor="file-input" className="file-label">
            Browse Files
          </label>
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {status && (
          <div className="status-message">
            {status}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button
          className="convert-button"
          onClick={handleConvert}
          disabled={!file || converting}
        >
          {converting ? 'Converting...' : 'Convert to JSON'}
        </button>

        <div className="footer">
          <p>Supports E-Invoice V4 JSON format</p>
        </div>
      </div>
    </div>
  );
}

export default App;
