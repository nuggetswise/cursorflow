// Simple test script for the Nuggetwise MCP server
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testBuild() {
  try {
    console.log('🧪 Testing Nuggetwise MCP Server...\n');

    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data);

    // Test build endpoint
    console.log('\n2. Testing build endpoint...');
    const buildResponse = await axios.post(`${BASE_URL}/api/build`, {
      prompt: 'Create a simple todo app with a form to add tasks and a list to display them',
      mode: 'quick-build',
      userId: 'test-user-123'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test-user-123'
      }
    });

    console.log('✅ Build request successful:', {
      chatId: buildResponse.data.data?.chatId,
      projectUrl: buildResponse.data.data?.projectUrl,
      cost: buildResponse.data.data?.cost,
      buildTime: buildResponse.data.data?.buildTime
    });

    // Test budget status
    console.log('\n3. Testing budget status...');
    const budgetResponse = await axios.get(`${BASE_URL}/api/budget/test-user-123`);
    console.log('✅ Budget status:', budgetResponse.data.data);

    console.log('\n🎉 All tests passed!');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testBuild(); 