const { createClient } = require('v0-sdk');
require('dotenv').config({ path: './backend/.env' });

async function generateCursorComponent() {
  try {
    const v0 = createClient({
      apiKey: process.env.V0_API_KEY,
    });
    
    console.log('🚀 Generating CURSOR component with V0...');
    
    const result = await v0.chats.create({
      system: 'You are an expert React developer. Generate clean, modern components.',
      message: 'Create a React component that displays "CURSOR" text in green font on a white background screen',
      modelConfiguration: {
        modelId: 'v0-1.5-sm',
        imageGenerations: false,
        thinking: false,
      },
    });
    
    console.log('✅ V0 generation successful!');
    console.log('📄 Chat ID:', result.id);
    console.log('🔗 Preview URL:', result.latestVersion?.demoUrl);
    
    // Save the generated component
    if (result.latestVersion?.files?.length > 0) {
      const fs = require('fs');
      const file = result.latestVersion.files[0];
      const fileName = 'cursor-v0-generated.tsx';
      
      fs.writeFileSync(fileName, file.content);
      console.log('✅ Saved:', fileName);
      
      return {
        success: true,
        chatId: result.id,
        previewUrl: result.latestVersion?.demoUrl,
        chatUrl: result.url,
        component: file.content
      };
    }
    
  } catch (error) {
    console.error('❌ V0 generation failed:', error.message);
    return { success: false, error: error.message };
  }
}

generateCursorComponent().then(result => {
  if (result.success) {
    console.log('\n🎉 V0 Generated Component:');
    console.log('==========================');
    console.log(result.component);
    console.log('\n🌐 Preview:', result.previewUrl);
    console.log('💬 Chat:', result.chatUrl);
  }
}); 