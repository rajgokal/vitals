#!/usr/bin/env node

// Simple test script to verify ProfileID support is working
// Run this with: node test-profile-support.js

const BASE_URL = process.env.VITALS_BASE_URL || 'http://localhost:3000';
const AGENT_KEY = process.env.VITALS_AGENT_KEY;

if (!AGENT_KEY) {
  console.error('ERROR: VITALS_AGENT_KEY environment variable is required');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'x-auth-type': 'agent',
  'x-agent-key': AGENT_KEY
};

async function testEndpoint(method, endpoint, profileId = 'raj', body = null) {
  const url = new URL(endpoint, BASE_URL);
  if (profileId && method === 'GET') {
    url.searchParams.set('profileId', profileId);
  }
  
  const options = {
    method,
    headers,
    ...(body && { body: JSON.stringify(body) })
  };

  if (body && method !== 'GET') {
    url.searchParams.set('profileId', profileId);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log(`${method} ${endpoint}?profileId=${profileId}: ${response.status}`);
    if (!response.ok) {
      console.log('  Error:', data.error || data);
    } else if (method === 'GET') {
      console.log(`  Data length: ${Array.isArray(data) ? data.length : 'object'}`);
    } else {
      console.log('  Success:', data.ok ? '✓' : data);
    }
  } catch (error) {
    console.log(`${method} ${endpoint}?profileId=${profileId}: ERROR`);
    console.log('  Error:', error.message);
  }
}

async function runTests() {
  console.log('Testing Vitals API ProfileID Support');
  console.log('====================================');
  
  // Test profile registry
  console.log('\n1. Profile Registry:');
  await testEndpoint('GET', '/api/profiles');
  
  console.log('\n2. Profile-scoped GET endpoints:');
  const endpoints = [
    '/api/medications',
    '/api/supplements', 
    '/api/labs',
    '/api/genetics',
    '/api/providers',
    '/api/records',
    '/api/interactions',
    '/api/immunizations',
    '/api/encounters',
    '/api/alerts'
  ];
  
  for (const endpoint of endpoints) {
    await testEndpoint('GET', endpoint, 'raj');
  }
  
  console.log('\n3. Test with different profiles:');
  await testEndpoint('GET', '/api/medications', 'shivani');
  await testEndpoint('GET', '/api/medications', 'arya');  
  await testEndpoint('GET', '/api/medications', 'privacy');
  
  console.log('\n4. Test invalid profile:');
  await testEndpoint('GET', '/api/medications', 'invalid');
  
  console.log('\n5. Migration check:');
  await testEndpoint('GET', '/api/migrate');
  
  console.log('\nProfileID support test completed!');
}

runTests().catch(console.error);