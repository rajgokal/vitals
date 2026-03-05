'use client';

import { useState, useEffect } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import AlertCard from './AlertCard';
import type { Alert, AlertSeverity, AlertCategory } from '@/lib/types';

const severityOptions: { value: AlertSeverity | '', label: string }[] = [
  { value: '', label: 'All Severities' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' },
];

const categoryOptions: { value: AlertCategory | '', label: string }[] = [
  { value: '', label: 'All Categories' },
  { value: 'lab_out_of_range', label: 'Lab Out of Range' },
  { value: 'lab_trend', label: 'Lab Trend' },
  { value: 'medication_safety', label: 'Medication Safety' },
  { value: 'genetic_safety', label: 'Genetic Safety' },
  { value: 'screening_due', label: 'Screening Due' },
  { value: 'wearable_anomaly', label: 'Wearable Anomaly' },
  { value: 'body_composition', label: 'Body Composition' },
];

export default function AlertPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDismissed, setShowDismissed] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | ''>('');
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | ''>('');

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('status', showDismissed ? 'dismissed' : 'active');
      if (selectedSeverity) params.set('severity', selectedSeverity);
      if (selectedCategory) params.set('category', selectedCategory);
      params.set('limit', '100');

      const response = await fetch(`/api/alerts?${params}`);
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [showDismissed, selectedSeverity, selectedCategory]);

  const handleDismissAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: alertId,
          status: 'dismissed',
          dismissedAt: new Date().toISOString(),
          dismissedBy: 'user',
        }),
      });

      if (response.ok) {
        // Refresh the alerts list
        await fetchAlerts();
      } else {
        throw new Error('Failed to dismiss alert');
      }
    } catch (error) {
      console.error('Error dismissing alert:', error);
      throw error;
    }
  };

  const handleReactivateAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: alertId,
          status: 'active',
          dismissedAt: null,
          dismissedBy: null,
        }),
      });

      if (response.ok) {
        // Refresh the alerts list
        await fetchAlerts();
      } else {
        throw new Error('Failed to reactivate alert');
      }
    } catch (error) {
      console.error('Error reactivating alert:', error);
      throw error;
    }
  };

  // Group alerts by category
  const groupedAlerts = alerts.reduce((groups, alert) => {
    const category = alert.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(alert);
    return groups;
  }, {} as Record<AlertCategory, Alert[]>);

  const categoryLabels = {
    lab_out_of_range: 'Lab Out of Range',
    lab_trend: 'Lab Trends',
    medication_safety: 'Medication Safety',
    genetic_safety: 'Genetic Safety',
    screening_due: 'Screening Due',
    wearable_anomaly: 'Wearable Anomalies',
    body_composition: 'Body Composition',
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-muted" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted mb-2">
              Status
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDismissed(false)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-lg transition-colors',
                  !showDismissed
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted-hover'
                )}
              >
                Active
              </button>
              <button
                onClick={() => setShowDismissed(true)}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-lg transition-colors',
                  showDismissed
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted-hover'
                )}
              >
                Dismissed
              </button>
            </div>
          </div>
          
          <div>
            <label htmlFor="severity-filter" className="block text-xs font-medium text-muted mb-2">
              Severity
            </label>
            <select
              id="severity-filter"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as AlertSeverity | '')}
              className="w-full px-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {severityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="category-filter" className="block text-xs font-medium text-muted mb-2">
              Category
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as AlertCategory | '')}
              className="w-full px-3 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted">Loading alerts...</div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="text-muted mb-2">
            {showDismissed ? 'No dismissed alerts found' : 'No active alerts'}
          </div>
          {!showDismissed && (
            <div className="text-xs text-muted">
              All clear! No alerts require your attention.
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedAlerts).map(([category, categoryAlerts]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {categoryLabels[category as AlertCategory]}
                <span className="text-sm text-muted font-normal">
                  ({categoryAlerts.length})
                </span>
              </h3>
              
              <div className="space-y-3">
                {categoryAlerts.map(alert => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onDismiss={showDismissed ? handleReactivateAlert : handleDismissAlert}
                    showDismissButton={!showDismissed || showDismissed}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}