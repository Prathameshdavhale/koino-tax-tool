// src/components/TaxCards.jsx
import React from 'react';

const formatCurrency = (val) => {
  const isNegative = val < 0;
  const formatted = Math.abs(val).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return isNegative ? `- ${formatted}` : formatted;
};

const DataRow = ({ label, shortTerm, longTerm, isLoss }) => (
  <div className="data-grid">
    <div className="font-medium">{label}</div>
    <div className={`text-right ${isLoss ? 'text-red' : ''}`}>{isLoss ? `- ${formatCurrency(Math.abs(shortTerm))}` : formatCurrency(shortTerm)}</div>
    <div className={`text-right ${isLoss ? 'text-red' : ''}`}>{isLoss ? `- ${formatCurrency(Math.abs(longTerm))}` : formatCurrency(longTerm)}</div>
  </div>
);

export default function TaxCards({ preHarvestData, postHarvestData }) {
  const preStNet = preHarvestData.stcg.profits - preHarvestData.stcg.losses;
  const preLtNet = preHarvestData.ltcg.profits - preHarvestData.ltcg.losses;
  const preRealised = preStNet + preLtNet;

  const postStNet = postHarvestData.stcg.profits - postHarvestData.stcg.losses;
  const postLtNet = postHarvestData.ltcg.profits - postHarvestData.ltcg.losses;
  const postRealised = postStNet + postLtNet;
  
  const savings = preRealised - postRealised;

  return (
    <div className="cards-wrapper">
      {/* Pre-Harvesting */}
      <div className="card card-pre">
        <h2>Pre Harvesting</h2>
        <div className="row-header">
          <div></div><div>Short-term</div><div>Long-term</div>
        </div>
        <DataRow label="Profits" shortTerm={preHarvestData.stcg.profits} longTerm={preHarvestData.ltcg.profits} />
        <DataRow label="Losses" shortTerm={preHarvestData.stcg.losses} longTerm={preHarvestData.ltcg.losses} isLoss />
        <DataRow label="Net Capital Gains" shortTerm={preStNet} longTerm={preLtNet} />
        <div className="divider"></div>
        <div className="total-row">
          <span>Realised Capital Gains:</span>
          <span className="total-value">{formatCurrency(preRealised)}</span>
        </div>
      </div>

      {/* Post-Harvesting */}
      <div className="card card-post">
        <h2>After Harvesting</h2>
        <div className="row-header">
          <div></div><div>Short-term</div><div>Long-term</div>
        </div>
        <DataRow label="Profits" shortTerm={postHarvestData.stcg.profits} longTerm={postHarvestData.ltcg.profits} />
        <DataRow label="Losses" shortTerm={postHarvestData.stcg.losses} longTerm={postHarvestData.ltcg.losses} isLoss={false} /> {/* White text on blue */}
        <DataRow label="Net Capital Gains" shortTerm={postStNet} longTerm={postLtNet} />
        <div className="divider"></div>
        <div className="total-row">
          <span>Effective Capital Gains:</span>
          <span className="total-value">{formatCurrency(postRealised)}</span>
        </div>
        {savings > 0 && (
          <div className="savings-banner">
            🎉 You are going to save upto {formatCurrency(savings)}
          </div>
        )}
      </div>
    </div>
  );
}
