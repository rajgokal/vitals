'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ChevronUp, X, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Alert } from '@/lib/types';
import { usePrivacy } from '@/context/PrivacyContext';
import { anonymizeAlertText, anonymizeDrugName } from '@/lib/anonymize';

interface AlertCardProps {
  alert: Alert;
  onDismiss?: (alertId: string) => void;
  showDismissButton?: boolean;
}

const severityConfig = {
  critical: {
    icon: '🔴',
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-500/5',
  },
  warning: {
    icon: '🟡',
    borderColor: 'border-l-yellow-500',
    bgColor: 'bg-yellow-500/5',
  },
  info: {
    icon: '🔵',
    borderColor: 'border-l-blue-500',
    bgColor: 'bg-blue-500/5',
  },
};

const categoryLabels = {
  lab_out_of_range: 'Lab Out of Range',
  lab_trend: 'Lab Trend',
  medication_safety: 'Medication Safety',
  genetic_safety: 'Genetic Safety',
  screening_due: 'Screening Due',
  wearable_anomaly: 'Wearable Anomaly',
  body_composition: 'Body Composition',
};

export default function AlertCard({ alert, onDismiss, showDismissButton = true }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [dismissing, setDismissing] = useState(false);
  const { isPrivate } = usePrivacy();
  
  const config = severityConfig[alert.severity];
  const isPermanent = alert.category === 'genetic_safety' && alert.severity === 'critical';
  const canDismiss = showDismissButton && !isPermanent && onDismiss;

  const handleDismiss = async () => {
    if (!onDismiss || dismissing) return;
    
    setDismissing(true);
    try {
      await onDismiss(alert.id);
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
      setDismissing(false);
    }
  };

  return (
    <div className={cn(
      'bg-card rounded-xl border border-border p-4 border-l-4 transition-colors',
      config.borderColor,
      config.bgColor
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">{config.icon}</span>
            <span className="text-xs text-muted uppercase tracking-wider font-medium">
              {categoryLabels[alert.category]}
            </span>
            {isPermanent && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 rounded-full">
                <Shield className="w-3 h-3 text-red-400" />
                <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider">
                  PERMANENT
                </span>
              </div>
            )}
          </div>
          
          <h3 className="font-medium text-foreground mb-1 leading-snug">
            {alert.title}
          </h3>
          
          <div className="text-sm text-muted leading-relaxed transition-all duration-200">
            {(() => {
              const msg = isPrivate
                ? anonymizeAlertText(alert.message, alert.relatedProviders, alert.relatedMedications)
                : alert.message;
              return expanded ? msg : (
                <>
                  {msg.length > 120 ? `${msg.substring(0, 120)}...` : msg}
                  {msg.length > 120 && (
                    <button
                      onClick={() => setExpanded(true)}
                      className="ml-1 text-accent hover:text-accent-bright text-xs"
                    >
                      more
                    </button>
                  )}
                </>
              );
            })()}
          </div>
          
          {expanded && alert.message.length > 120 && (
            <button
              onClick={() => setExpanded(false)}
              className="flex items-center gap-1 text-xs text-muted hover:text-foreground mt-1 group"
            >
              <ChevronUp className="w-3 h-3" />
              Show less
            </button>
          )}
        </div>
        
        {canDismiss && (
          <button
            onClick={handleDismiss}
            disabled={dismissing}
            className={cn(
              'p-1.5 rounded-lg transition-colors shrink-0',
              dismissing
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-muted text-muted hover:text-foreground'
            )}
            title="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Related info and action items */}
      {(alert.relatedProviders?.length || alert.relatedMedications?.length || alert.actionItems?.length) && (
        <div className="mt-3 pt-3 border-t border-border/50 space-y-2">
          {alert.relatedProviders && alert.relatedProviders.length > 0 && (
            <div>
              <span className="text-xs text-muted font-medium">Providers: </span>
              <span className="text-xs text-foreground transition-all duration-200">
                {isPrivate
                  ? alert.relatedProviders.map(() => 'Provider').join(', ')
                  : alert.relatedProviders.join(', ')}
              </span>
            </div>
          )}
          
          {alert.relatedMedications && alert.relatedMedications.length > 0 && (
            <div>
              <span className="text-xs text-muted font-medium">Medications: </span>
              <span className="text-xs text-foreground transition-all duration-200">
                {isPrivate
                  ? alert.relatedMedications.map(m => anonymizeDrugName(m)).join(', ')
                  : alert.relatedMedications.join(', ')}
              </span>
            </div>
          )}
          
          {alert.actionItems && alert.actionItems.length > 0 && (
            <div>
              <span className="text-xs text-muted font-medium block mb-1">Action Items:</span>
              <ul className="space-y-1">
                {alert.actionItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="text-accent mt-0.5">•</span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Footer with timestamp */}
      <div className="mt-3 pt-2 border-t border-border/30">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>
            {new Date(alert.createdAt).toLocaleDateString()} at{' '}
            {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {alert.expiresAt && (
            <span>
              Expires {new Date(alert.expiresAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}