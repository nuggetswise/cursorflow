# Notification Agent - Testing Examples

## 🎯 **Agent Overview**

The Notification Agent is responsible for sending real-time updates and alerts to various channels (Slack, email, etc.) during the build process. It formats messages appropriately, handles delivery failures, and ensures team members stay informed about project progress.

---

## **🧪 Testing Examples**

### **Test Case 1: Build Completion Notification**
```json
{
  "input": {
    "event": "build_completed",
    "data": {
      "projectId": "proj_123",
      "projectName": "Todo App",
      "components": 5,
      "buildTime": "2m 30s",
      "status": "success",
      "url": "https://v0.dev/projects/proj_123"
    },
    "channel": "#nuggetwise-alerts"
  },
  "expected_output": {
    "success": true,
    "messageId": "msg_456",
    "channel": "#nuggetwise-alerts",
    "formattedMessage": {
      "text": "✅ Build completed successfully!",
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "🎉 Build Completed: Todo App"
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "*Project:*\nproj_123"
            },
            {
              "type": "mrkdwn", 
              "text": "*Components:*\n5 generated"
            },
            {
              "type": "mrkdwn",
              "text": "*Build Time:*\n2m 30s"
            },
            {
              "type": "mrkdwn",
              "text": "*Status:*\n✅ Success"
            }
          ]
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "View Project"
              },
              "url": "https://v0.dev/projects/proj_123"
            }
          ]
        }
      ]
    },
    "deliveryStatus": "sent",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### **Test Case 2: Build Failure Notification**
```json
{
  "input": {
    "event": "build_failed",
    "data": {
      "projectId": "proj_124",
      "projectName": "E-commerce Dashboard",
      "error": "API rate limit exceeded",
      "attempts": 3,
      "buildTime": "1m 45s"
    },
    "channel": "#nuggetwise-alerts"
  },
  "expected_output": {
    "success": true,
    "messageId": "msg_457",
    "channel": "#nuggetwise-alerts",
    "formattedMessage": {
      "text": "❌ Build failed: E-commerce Dashboard",
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "🚨 Build Failed: E-commerce Dashboard"
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "*Project:*\nproj_124"
            },
            {
              "type": "mrkdwn",
              "text": "*Error:*\nAPI rate limit exceeded"
            },
            {
              "type": "mrkdwn",
              "text": "*Attempts:*\n3"
            },
            {
              "type": "mrkdwn",
              "text": "*Build Time:*\n1m 45s"
            }
          ]
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": "⚠️ Please check the build logs for more details"
            }
          ]
        }
      ]
    },
    "deliveryStatus": "sent",
    "timestamp": "2024-01-15T10:32:00Z"
  }
}
```

### **Test Case 3: Project Started Notification**
```json
{
  "input": {
    "event": "project_started",
    "data": {
      "projectId": "proj_125",
      "projectName": "Analytics Dashboard",
      "user": "john.doe@company.com",
      "intent": "create_analytics_dashboard",
      "estimatedTime": "5-7 minutes"
    },
    "channel": "#nuggetwise-projects"
  },
  "expected_output": {
    "success": true,
    "messageId": "msg_458",
    "channel": "#nuggetwise-projects",
    "formattedMessage": {
      "text": "🚀 New project started: Analytics Dashboard",
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*🚀 New Project Started*\n\n*Project:* Analytics Dashboard\n*User:* john.doe@company.com\n*Intent:* Create analytics dashboard\n*Estimated Time:* 5-7 minutes"
          }
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": "⏱️ Build in progress..."
            }
          ]
        }
      ]
    },
    "deliveryStatus": "sent",
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

### **Test Case 4: Agent Error Notification**
```json
{
  "input": {
    "event": "agent_error",
    "data": {
      "agent": "V0PromptBuilderAgent",
      "error": "OpenAI API timeout",
      "projectId": "proj_126",
      "retryAttempt": 2,
      "maxRetries": 3
    },
    "channel": "#nuggetwise-errors"
  },
  "expected_output": {
    "success": true,
    "messageId": "msg_459",
    "channel": "#nuggetwise-errors",
    "formattedMessage": {
      "text": "⚠️ Agent error: V0PromptBuilderAgent",
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "⚠️ Agent Error Alert"
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "*Agent:*\nV0PromptBuilderAgent"
            },
            {
              "type": "mrkdwn",
              "text": "*Error:*\nOpenAI API timeout"
            },
            {
              "type": "mrkdwn",
              "text": "*Project:*\nproj_126"
            },
            {
              "type": "mrkdwn",
              "text": "*Retry:*\n2/3"
            }
          ]
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": "🔄 Retrying automatically..."
            }
          ]
        }
      ]
    },
    "deliveryStatus": "sent",
    "timestamp": "2024-01-15T10:38:00Z"
  }
}
```

### **Test Case 5: System Status Update**
```json
{
  "input": {
    "event": "system_status",
    "data": {
      "status": "healthy",
      "uptime": "99.8%",
      "activeProjects": 12,
      "queueLength": 3,
      "lastIncident": "2024-01-10T15:30:00Z"
    },
    "channel": "#nuggetwise-status"
  },
  "expected_output": {
    "success": true,
    "messageId": "msg_460",
    "channel": "#nuggetwise-status",
    "formattedMessage": {
      "text": "✅ System Status: Healthy",
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*🟢 System Status Report*\n\n*Status:* Healthy\n*Uptime:* 99.8%\n*Active Projects:* 12\n*Queue Length:* 3\n*Last Incident:* 2024-01-10 15:30 UTC"
          }
        }
      ]
    },
    "deliveryStatus": "sent",
    "timestamp": "2024-01-15T10:40:00Z"
  }
}
```

### **Test Case 6: Multi-Channel Notification**
```json
{
  "input": {
    "event": "critical_error",
    "data": {
      "error": "Database connection lost",
      "severity": "critical",
      "affectedServices": ["auth", "projects", "builds"],
      "estimatedDowntime": "10-15 minutes"
    },
    "channels": ["#nuggetwise-alerts", "#engineering", "#oncall"]
  },
  "expected_output": {
    "success": true,
    "messageIds": ["msg_461", "msg_462", "msg_463"],
    "channels": ["#nuggetwise-alerts", "#engineering", "#oncall"],
    "formattedMessage": {
      "text": "🚨 CRITICAL: Database connection lost",
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "🚨 CRITICAL SYSTEM ERROR"
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "*Error:*\nDatabase connection lost"
            },
            {
              "type": "mrkdwn",
              "text": "*Severity:*\nCritical"
            },
            {
              "type": "mrkdwn",
              "text": "*Affected Services:*\nauth, projects, builds"
            },
            {
              "type": "mrkdwn",
              "text": "*Estimated Downtime:*\n10-15 minutes"
            }
          ]
        },
        {
          "type": "context",
          "elements": [
            {
              "type": "mrkdwn",
              "text": "🔧 Engineering team has been notified"
            }
          ]
        }
      ]
    },
    "deliveryStatus": "sent",
    "timestamp": "2024-01-15T10:42:00Z"
  }
}
```

---

## **🔧 Testing Scripts**

### **Manual Testing**
```javascript
// test-notification-agent.js
const { NotificationAgent } = require('../packages/nw-mcp/src/agents/NotificationAgent');

async function testNotificationAgent() {
  const agent = new NotificationAgent();
  
  const testCases = [
    {
      name: "Build Completion",
      input: {
        event: "build_completed",
        data: {
          projectId: "proj_123",
          projectName: "Todo App",
          components: 5,
          buildTime: "2m 30s",
          status: "success"
        },
        channel: "#nuggetwise-alerts"
      },
      expected: {
        success: true,
        deliveryStatus: "sent"
      }
    },
    {
      name: "Build Failure",
      input: {
        event: "build_failed",
        data: {
          projectId: "proj_124",
          projectName: "E-commerce Dashboard",
          error: "API rate limit exceeded"
        },
        channel: "#nuggetwise-alerts"
      },
      expected: {
        success: true,
        deliveryStatus: "sent"
      }
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    try {
      const result = await agent.notify(
        testCase.input.event,
        testCase.input.data,
        testCase.input.channel
      );
      console.log('Result:', JSON.stringify(result, null, 2));
      
      // Validate result
      if (result.success === testCase.expected.success) {
        console.log('✅ Success status matches expected');
      } else {
        console.log('❌ Success status mismatch');
      }
    } catch (error) {
      console.error('❌ Test failed:', error.message);
    }
    console.log('---');
  }
}

testNotificationAgent();
```

### **Automated Testing**
```typescript
// __tests__/notification-agent.test.ts
import { NotificationAgent } from '../src/agents/NotificationAgent';

describe('Notification Agent', () => {
  let agent: NotificationAgent;

  beforeEach(() => {
    agent = new NotificationAgent();
  });

  test('should send build completion notification', async () => {
    const data = {
      projectId: 'proj_123',
      projectName: 'Todo App',
      components: 5,
      buildTime: '2m 30s',
      status: 'success'
    };
    
    const result = await agent.notify('build_completed', data, '#nuggetwise-alerts');
    
    expect(result.success).toBe(true);
    expect(result.deliveryStatus).toBe('sent');
    expect(result.formattedMessage.text).toContain('Build completed');
  });

  test('should handle build failure notification', async () => {
    const data = {
      projectId: 'proj_124',
      projectName: 'E-commerce Dashboard',
      error: 'API rate limit exceeded'
    };
    
    const result = await agent.notify('build_failed', data, '#nuggetwise-alerts');
    
    expect(result.success).toBe(true);
    expect(result.formattedMessage.text).toContain('Build failed');
    expect(result.formattedMessage.blocks).toHaveLength(3);
  });

  test('should format messages correctly', async () => {
    const data = {
      projectId: 'proj_125',
      projectName: 'Analytics Dashboard',
      user: 'john.doe@company.com'
    };
    
    const result = await agent.notify('project_started', data, '#nuggetwise-projects');
    
    expect(result.formattedMessage.blocks[0].text.text).toContain('New Project Started');
    expect(result.formattedMessage.blocks[0].text.text).toContain('Analytics Dashboard');
  });

  test('should handle multiple channels', async () => {
    const data = {
      error: 'Database connection lost',
      severity: 'critical'
    };
    
    const channels = ['#nuggetwise-alerts', '#engineering'];
    const result = await agent.notify('critical_error', data, channels);
    
    expect(result.success).toBe(true);
    expect(result.channels).toEqual(channels);
    expect(result.messageIds).toHaveLength(2);
  });

  test('should handle Slack API errors gracefully', async () => {
    // Mock Slack API failure
    jest.spyOn(agent, 'sendToSlack').mockRejectedValue(new Error('Slack API error'));
    
    const data = { projectId: 'proj_123', status: 'success' };
    
    const result = await agent.notify('build_completed', data, '#nuggetwise-alerts');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Slack API error');
    expect(result.deliveryStatus).toBe('failed');
  });

  test('should retry failed notifications', async () => {
    const data = { projectId: 'proj_123', status: 'success' };
    
    // Mock first attempt fails, second succeeds
    const mockSlack = jest.spyOn(agent, 'sendToSlack')
      .mockRejectedValueOnce(new Error('Temporary error'))
      .mockResolvedValueOnce({ ok: true, ts: '1234567890.123456' });
    
    const result = await agent.notify('build_completed', data, '#nuggetwise-alerts');
    
    expect(result.success).toBe(true);
    expect(mockSlack).toHaveBeenCalledTimes(2);
  });

  test('should validate input data', async () => {
    const invalidData = { projectId: null, status: 'invalid' };
    
    const result = await agent.notify('build_completed', invalidData, '#nuggetwise-alerts');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid input data');
  });

  test('should handle unknown event types', async () => {
    const data = { projectId: 'proj_123' };
    
    const result = await agent.notify('unknown_event', data, '#nuggetwise-alerts');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Unknown event type');
  });
});
```

---

## **📊 Performance Benchmarks**

### **Expected Performance**
```javascript
const benchmarks = {
  responseTime: {
    max: 2000, // 2 seconds
    average: 800, // 800ms
    target: 500 // 500ms
  },
  tokenUsage: {
    max: 1500,
    average: 800,
    target: 600
  },
  deliverySuccess: {
    rate: 0.99, // 99% success rate
    retryAttempts: 3,
    maxRetryDelay: 5000 // 5 seconds
  },
  concurrentNotifications: {
    max: 50,
    average: 10,
    target: 20
  }
};
```

---

## **🚨 Error Handling**

### **Slack API Failures**
```javascript
test('should handle Slack API rate limiting', async () => {
  const agent = new NotificationAgent();
  
  // Mock rate limit error
  jest.spyOn(agent, 'sendToSlack').mockRejectedValue({
    code: 'RATE_LIMITED',
    message: 'Rate limit exceeded'
  });
  
  const result = await agent.notify('build_completed', {
    projectId: 'proj_123',
    status: 'success'
  }, '#nuggetwise-alerts');
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Rate limit exceeded');
  expect(result.retryAfter).toBeDefined();
});

test('should handle Slack channel not found', async () => {
  const agent = new NotificationAgent();
  
  // Mock channel not found error
  jest.spyOn(agent, 'sendToSlack').mockRejectedValue({
    code: 'CHANNEL_NOT_FOUND',
    message: 'Channel #invalid-channel not found'
  });
  
  const result = await agent.notify('build_completed', {
    projectId: 'proj_123',
    status: 'success'
  }, '#invalid-channel');
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Channel not found');
});
```

### **Network Issues**
```javascript
test('should handle network timeouts', async () => {
  const agent = new NotificationAgent();
  
  // Mock network timeout
  jest.spyOn(agent, 'sendToSlack').mockRejectedValue({
    code: 'NETWORK_TIMEOUT',
    message: 'Request timeout'
  });
  
  const result = await agent.notify('build_completed', {
    projectId: 'proj_123',
    status: 'success'
  }, '#nuggetwise-alerts');
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Request timeout');
  expect(result.retryAttempt).toBe(1);
});
```

### **Invalid Input Handling**
```javascript
test('should handle empty event type', async () => {
  const agent = new NotificationAgent();
  const result = await agent.notify('', { projectId: 'proj_123' }, '#nuggetwise-alerts');
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Event type is required');
});

test('should handle missing channel', async () => {
  const agent = new NotificationAgent();
  const result = await agent.notify('build_completed', { projectId: 'proj_123' });
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Channel is required');
});

test('should handle invalid data format', async () => {
  const agent = new NotificationAgent();
  const result = await agent.notify('build_completed', 'invalid-data', '#nuggetwise-alerts');
  
  expect(result.success).toBe(false);
  expect(result.error).toContain('Invalid data format');
});
```

---

## **📋 Testing Checklist**

### **Functional Testing**
- [ ] Sends build completion notifications
- [ ] Sends build failure notifications
- [ ] Sends project started notifications
- [ ] Sends agent error notifications
- [ ] Sends system status updates
- [ ] Handles multiple channels
- [ ] Formats messages correctly
- [ ] Includes appropriate attachments
- [ ] Uses correct channel routing

### **Error Handling Testing**
- [ ] Handles Slack API failures
- [ ] Handles network timeouts
- [ ] Handles rate limiting
- [ ] Handles invalid channels
- [ ] Handles invalid input data
- [ ] Implements retry logic
- [ ] Provides meaningful error messages
- [ ] Logs errors appropriately

### **Performance Testing**
- [ ] Response time within limits
- [ ] Token usage optimized
- [ ] Concurrent notification handling
- [ ] Memory usage stable
- [ ] Retry mechanism efficient
- [ ] Queue management working

### **Integration Testing**
- [ ] Works with agent orchestrator
- [ ] Integrates with Slack API
- [ ] Handles different event types
- [ ] Maintains notification history
- [ ] Supports multiple notification channels
- [ ] Provides delivery status tracking 