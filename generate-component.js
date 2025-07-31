#!/usr/bin/env node

const https = require('https');

const prompt = process.argv[2];

if (!prompt) {
  console.log('❌ Please provide a prompt');
  console.log('Usage: node generate-component.js "a green dot on white screen"');
  process.exit(1);
}

const data = JSON.stringify({
  prompt: prompt,
  options: {
    modelId: 'v0-1.5-sm',
    saveToWorkspace: true
  }
});

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/tools/v0.generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(responseData);
      if (result.success) {
        console.log('✅ Component generated successfully!');
        console.log('📁 Files:');
        result.data.files.forEach(file => {
          console.log(`  - ${file.name}`);
        });
        console.log('🌐 Preview:', result.data.deploymentUrl);
        console.log('💬 Chat:', result.data.projectUrl);
        console.log('\n📝 Generated Code:');
        console.log(result.data.components[0].code);
      } else {
        console.error('❌ Generation failed:', result.error.message);
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(data);
req.end(); 