// src/App.jsx
import React, { useState, useMemo, useEffect } from 'react'; // NEW: Imported useEffect
import { capitalGainsAPI, holdingsAPI } from './data/mockData';
import TaxCards from './components/TaxCards';
import HoldingsTable from './components/HoldingsTable';

function App() {
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  // NEW: State to track Dark/Light mode. Default is 'light' (white).
  const [theme, setTheme] = useState('light');

  // NEW: Apply the theme to the root HTML element whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Base Data
  const preHarvestData = capitalGainsAPI.capitalGains;

  // Calculate Post-Harvest dynamically
  const postHarvestData = useMemo(() => {
    let newData = {
      stcg: { profits: preHarvestData.stcg.profits, losses: preHarvestData.stcg.losses },
      ltcg: { profits: preHarvestData.ltcg.profits, losses: preHarvestData.ltcg.losses }
    };

    holdingsAPI.forEach(asset => {
      if (selectedAssets.includes(asset.coin)) {
        if (asset.stcg.gain > 0) newData.stcg.profits += asset.stcg.gain;
        else newData.stcg.losses += Math.abs(asset.stcg.gain);

        if (asset.ltcg.gain > 0) newData.ltcg.profits += asset.ltcg.gain;
        else newData.ltcg.losses += Math.abs(asset.ltcg.gain);
      }
    });

    return newData;
  }, [selectedAssets, preHarvestData]);

  const handleToggleAsset = (coinSymbol) => {
    setSelectedAssets(prev => 
      prev.includes(coinSymbol) 
        ? prev.filter(c => c !== coinSymbol) 
        : [...prev, coinSymbol]
    );
  };

  const handleToggleAll = () => {
    if (selectedAssets.length === holdingsAPI.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(holdingsAPI.map(asset => asset.coin));
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Tax Harvesting</h1>
        
        <div 
          className="header-link-container"
          onMouseEnter={() => setIsTooltipOpen(true)}
          onMouseLeave={() => setIsTooltipOpen(false)}
        >
          <button className="how-it-works-btn">
            How it works?
          </button>

          {isTooltipOpen && (
            <div className="tooltip-box">
              Lorem ipsum dolor sit amet consectetur. Euismod id posuere nibh 
              semper mattis scelerisque tellus. Vel mattis diam duis morbi tellus 
              dui consectetur. <a href="#" className="tooltip-link">Know More</a>
            </div>
          )}
        </div>

        {/* NEW: Dropdown to choose Light or Dark Mode */}
        <select 
          className="theme-selector" 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
        >
          <option value="light">Light Mode</option>
          <option value="dark">Dark Mode</option>
        </select>
      </div>

      <div className="notes-accordion">
        <button 
          className="notes-header-btn" 
          onClick={() => setIsNotesOpen(!isNotesOpen)}
        >
          <div className="notes-title-left">
            <span className="info-icon">i</span>
            Important Notes & Disclaimers
          </div>
          <span className={`chevron ${isNotesOpen ? 'open' : ''}`}>▼</span>
        </button>
        
        {isNotesOpen && (
          <div className="notes-content">
            <ul>
              <li>Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.</li>
              <li>Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.</li>
              <li>Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.</li>
              <li>Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.</li>
              <li>Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.</li>
            </ul>
          </div>
        )}
      </div>

      <TaxCards 
        preHarvestData={preHarvestData} 
        postHarvestData={postHarvestData} 
      />

      <HoldingsTable 
        holdings={holdingsAPI} 
        selectedAssets={selectedAssets}
        toggleAsset={handleToggleAsset}
        toggleAll={handleToggleAll}
      />
    </div>
  );
}

export default App;