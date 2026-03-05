'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import AlertCard from './AlertCard';
import type { Alert } from '@/lib/types';

export default function AlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts?status=active');
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
  }, []);

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
        // Remove from local state
        setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      } else {
        throw new Error('Failed to dismiss alert');
      }
    } catch (error) {
      console.error('Error dismissing alert:', error);
      throw error;
    }
  };

  if (loading) return null;

  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  const warningAlerts = alerts.filter(alert => alert.severity === 'warning');
  const infoAlerts = alerts.filter(alert => alert.severity === 'info');

  // Don't show banner if no alerts
  if (alerts.length === 0) return null;

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      {/* Critical alerts - always visible */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-500/10 border-b border-red-500/20">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center gap-2 text-sm text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">
                {criticalAlerts.length} critical alert{criticalAlerts.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-auto flex items-center gap-1 hover:text-red-300 transition-colors"
              >
                <span className="text-xs">
                  {expanded ? 'Hide' : 'Show'} details
                </span>
                {expanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Warning/Info summary - only if no critical alerts visible */}
      {criticalAlerts.length === 0 && (warningAlerts.length > 0 || infoAlerts.length > 0) && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors w-full"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">
                {warningAlerts.length > 0 && (
                  <span>{warningAlerts.length} warning{warningAlerts.length !== 1 ? 's' : ''}</span>
                )}
                {warningAlerts.length > 0 && infoAlerts.length > 0 && <span>, </span>}
                {infoAlerts.length > 0 && (
                  <span>{infoAlerts.length} info alert{infoAlerts.length !== 1 ? 's' : ''}</span>
                )}
              </span>
              <div className="ml-auto flex items-center gap-1">
                <span className="text-xs">
                  {expanded ? 'Hide' : 'Show'} details
                </span>
                {expanded ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Expanded alert details */}
      {expanded && alerts.length > 0 && (
        <div className="border-b border-border">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {criticalAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={handleDismissAlert}
                />
              ))}
              {warningAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={handleDismissAlert}
                />
              ))}
              {infoAlerts.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDismiss={handleDismissAlert}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}