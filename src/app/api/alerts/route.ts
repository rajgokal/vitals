import { NextRequest, NextResponse } from 'next/server';
import { kvGet, kvSet } from '@/lib/kv';
import { isAgentRequest } from '@/lib/api-helpers';
import type { Alert, AlertStatus } from '@/lib/types';

function sortAlerts(alerts: Alert[]): Alert[] {
  return alerts.sort((a, b) => {
    // Sort by severity first: critical > warning > info
    const severityOrder = { critical: 3, warning: 2, info: 1 };
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    if (severityDiff !== 0) return severityDiff;
    
    // Within same severity, newest first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function expireAlerts(alerts: Alert[]): Alert[] {
  const now = new Date().toISOString();
  return alerts.map(alert => {
    if (alert.expiresAt && alert.expiresAt < now && alert.status === 'active') {
      return { ...alert, status: 'expired' as const };
    }
    return alert;
  });
}

export async function GET(request: NextRequest) {
  const rawAlerts = await kvGet<Alert[]>('vitals:alerts') ?? [];
  const alerts = expireAlerts(rawAlerts);
  
  // Update any expired alerts back to storage
  const hasExpired = alerts.some((alert, index) => alert.status !== rawAlerts[index]?.status);
  if (hasExpired) {
    await kvSet('vitals:alerts', alerts);
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status') || 'active';
  const severity = searchParams.get('severity');
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '50', 10);

  let filtered = alerts;

  // Filter by status
  filtered = filtered.filter(alert => alert.status === status);
  
  // Filter by severity if specified
  if (severity) {
    filtered = filtered.filter(alert => alert.severity === severity);
  }
  
  // Filter by category if specified
  if (category) {
    filtered = filtered.filter(alert => alert.category === category);
  }

  // Sort and limit
  const sorted = sortAlerts(filtered);
  const limited = sorted.slice(0, limit);

  return NextResponse.json(limited);
}

export async function POST(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }
  
  try {
    const alert: Alert = await request.json();
    
    if (!alert.id || !alert.title || !alert.message || !alert.category || !alert.severity) {
      return NextResponse.json({ 
        error: 'id, title, message, category, and severity are required' 
      }, { status: 400 });
    }
    
    const existing = await kvGet<Alert[]>('vitals:alerts') ?? [];
    const existingIndex = existing.findIndex(a => a.id === alert.id);
    
    const now = new Date().toISOString();
    
    if (existingIndex >= 0) {
      // Upsert: preserve dismissedAt if already dismissed
      const existingAlert = existing[existingIndex];
      const updatedAlert = {
        ...alert,
        createdAt: existingAlert.createdAt,
        updatedAt: now,
        dismissedAt: existingAlert.dismissedAt,
        dismissedBy: existingAlert.dismissedBy,
        status: existingAlert.dismissedAt ? existingAlert.status : alert.status,
      };
      existing[existingIndex] = updatedAlert;
    } else {
      // New alert
      const newAlert = {
        ...alert,
        createdAt: now,
        updatedAt: now,
      };
      existing.push(newAlert);
    }
    
    await kvSet('vitals:alerts', existing);
    const storedAlert = existing[existingIndex] ?? existing[existing.length - 1];
    
    return NextResponse.json(storedAlert);
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, dismissedAt, dismissedBy } = await request.json() as {
      id: string;
      status?: AlertStatus;
      dismissedAt?: string;
      dismissedBy?: string;
    };
    
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    
    const existing = await kvGet<Alert[]>('vitals:alerts') ?? [];
    const alertIndex = existing.findIndex(alert => alert.id === id);
    
    if (alertIndex < 0) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    
    const alert = existing[alertIndex];
    
    // Cannot dismiss critical genetic_safety alerts
    if (alert.category === 'genetic_safety' && alert.severity === 'critical' && status === 'dismissed') {
      return NextResponse.json({ 
        error: 'Critical genetic safety alerts cannot be dismissed' 
      }, { status: 400 });
    }
    
    // Update the alert
    const updatedAlert = {
      ...alert,
      updatedAt: new Date().toISOString(),
      ...(status && { status }),
      ...(dismissedAt && { dismissedAt }),
      ...(dismissedBy && { dismissedBy }),
    };
    
    existing[alertIndex] = updatedAlert;
    await kvSet('vitals:alerts', existing);
    
    return NextResponse.json(updatedAlert);
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAgentRequest(request)) {
    return NextResponse.json({ error: 'Agent key required' }, { status: 403 });
  }
  
  try {
    const { id } = await request.json() as { id: string };
    
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }
    
    const existing = await kvGet<Alert[]>('vitals:alerts') ?? [];
    const filtered = existing.filter(alert => alert.id !== id);
    
    if (filtered.length === existing.length) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    
    await kvSet('vitals:alerts', filtered);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}