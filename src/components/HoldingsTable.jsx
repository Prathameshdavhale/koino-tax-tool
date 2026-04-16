// src/components/HoldingsTable.jsx
import React, { useState } from 'react';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

export default function HoldingsTable({ holdings, selectedAssets, toggleAsset, toggleAll }) {
  // State to track if the table is expanded
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Show 4 rows initially
  const INITIAL_ROW_COUNT = 4;

  const isAllSelected = holdings.length > 0 && selectedAssets.length === holdings.length;

  // Slice the array based on state
  const displayedHoldings = isExpanded ? holdings : holdings.slice(0, INITIAL_ROW_COUNT);

  return (
    <div className="table-container">
      <div className="table-header">Holdings</div>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" checked={isAllSelected} onChange={toggleAll} /></th>
            <th>Asset</th>
            <th>Holdings <br/><span className="asset-subtext">Avg Buy Price</span></th>
            <th>Current Price</th>
            <th>Short-Term Gain</th>
            <th>Long-Term Gain</th>
            <th>Amount to Sell</th>
          </tr>
        </thead>
        <tbody>
          {displayedHoldings.map((asset) => {
            const isSelected = selectedAssets.includes(asset.coin);
            return (
              <tr key={asset.coin}>
                <td>
                  <input type="checkbox" checked={isSelected} onChange={() => toggleAsset(asset.coin)} />
                </td>
                <td>
                  <div className="asset-cell">
                    <img src={asset.logo} alt={asset.coin} className="asset-logo" />
                    <div>
                      <div className="font-bold">{asset.coinName}</div>
                      <div className="asset-subtext">{asset.coin}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="font-medium">{asset.totalHolding.toFixed(4)} {asset.coin}</div>
                  <div className="asset-subtext">{formatCurrency(asset.averageBuyPrice)}</div>
                </td>
                <td className="font-medium">{formatCurrency(asset.currentPrice)}</td>
                <td className={asset.stcg.gain >= 0 ? 'text-green' : 'text-red'}>
                  {formatCurrency(asset.stcg.gain)}
                </td>
                <td className={asset.ltcg.gain >= 0 ? 'text-green' : 'text-red'}>
                  {formatCurrency(asset.ltcg.gain)}
                </td>
                <td className="font-medium">
                  {isSelected ? `${asset.totalHolding.toFixed(4)} ${asset.coin}` : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* THE VIEW ALL BUTTON */}
      {holdings.length > INITIAL_ROW_COUNT && (
        <div className="view-all-container">
          <button 
            className="view-all-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'View less' : 'View all'}
          </button>
        </div>
      )}
    </div>
  );
}