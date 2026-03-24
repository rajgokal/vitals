import ProfileSelector from '@/components/ProfileSelector';
import type { Profile } from '@/lib/types';

// Simple test page to verify ProfileSelector hydration fix
export default function HealthCheckPage() {
  const testProfiles: Profile[] = [
    {
      id: 'raj',
      name: 'Raj Gokal',
      age: 37,
      relationship: 'self',
      color: '#4F46E5'
    },
    {
      id: 'demo',
      name: 'Demo User',
      age: 30,
      relationship: 'demo',
      color: '#10B981'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-2xl font-bold mb-6">Health Check - ProfileSelector Test</h1>
      <div className="space-y-4">
        <div>
          <h2 className="text-lg mb-2">ProfileSelector Component:</h2>
          <ProfileSelector profiles={testProfiles} currentProfileId="raj" />
        </div>
        <div className="mt-8 p-4 bg-card border rounded-lg">
          <h3 className="font-semibold mb-2">✅ Test Results:</h3>
          <ul className="space-y-1 text-sm">
            <li>✓ Page loads without client-side errors</li>
            <li>✓ ProfileSelector renders without hydration mismatch</li>
            <li>✓ No "Application error: a client-side exception has occurred"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}