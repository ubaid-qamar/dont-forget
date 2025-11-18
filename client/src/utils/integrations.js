/**
 * Integration Helper Functions
 * 
 * This file contains utility functions to interact with connected third-party services
 */

// Get stored credentials for a service
export const getIntegrationCredentials = (integrationId) => {
  const stored = localStorage.getItem(`integration_${integrationId}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error(`Failed to load ${integrationId} credentials`);
      return null;
    }
  }
  return null;
};

// Check if a service is connected
export const isIntegrationConnected = (integrationId) => {
  return !!getIntegrationCredentials(integrationId);
};

/**
 * ChatGPT / OpenAI Integration
 */

// Call OpenAI API
export const callOpenAI = async (prompt, options = {}) => {
  const credentials = getIntegrationCredentials('chatgpt');
  
  if (!credentials || !credentials.apiKey) {
    throw new Error('ChatGPT is not connected. Please add your API key in Settings → Integrations.');
  }

  const {
    model = 'gpt-3.5-turbo',
    maxTokens = 500,
    temperature = 0.7
  } = options;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${credentials.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for task management. Provide concise, practical suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

// Generate task description using AI
export const generateTaskDescription = async (taskTitle) => {
  const prompt = `Given this task title: "${taskTitle}"
  
Generate a brief, professional description (2-3 sentences) that explains what this task involves and what needs to be accomplished.`;

  return await callOpenAI(prompt, { maxTokens: 150 });
};

// Generate key points for a task
export const generateKeyPoints = async (taskTitle, taskDescription = '') => {
  const prompt = `For this task:
Title: "${taskTitle}"
${taskDescription ? `Description: "${taskDescription}"` : ''}

Generate 3-5 key points or action items that should be covered when completing this task. Format as a simple list.`;

  const response = await callOpenAI(prompt, { maxTokens: 200 });
  
  // Parse the response into an array of key points
  const lines = response.split('\n')
    .filter(line => line.trim())
    .map(line => line.replace(/^[-•*\d.)\s]+/, '').trim())
    .filter(line => line.length > 0);
  
  return lines;
};

// Suggest task priority based on content
export const suggestTaskPriority = async (taskTitle, taskDescription = '', dueDate = null) => {
  const prompt = `Analyze this task and suggest an appropriate priority level (Low, Medium, High, or Urgent):

Title: "${taskTitle}"
${taskDescription ? `Description: "${taskDescription}"` : ''}
${dueDate ? `Due Date: ${dueDate}` : ''}

Respond with ONLY one word: Low, Medium, High, or Urgent, followed by a brief one-sentence explanation.`;

  const response = await callOpenAI(prompt, { maxTokens: 100, temperature: 0.5 });
  
  // Extract priority and reasoning
  const lines = response.split('\n').filter(line => line.trim());
  const firstLine = lines[0].toLowerCase();
  
  let priority = 'Medium'; // default
  if (firstLine.includes('urgent')) priority = 'Urgent';
  else if (firstLine.includes('high')) priority = 'High';
  else if (firstLine.includes('low')) priority = 'Low';
  else if (firstLine.includes('medium')) priority = 'Medium';
  
  const reasoning = lines.slice(1).join(' ').trim() || lines[0];
  
  return { priority, reasoning };
};

// Improve task title
export const improveTaskTitle = async (currentTitle) => {
  const prompt = `Improve this task title to make it more clear, actionable, and concise:
"${currentTitle}"

Provide ONLY the improved title, nothing else.`;

  return await callOpenAI(prompt, { maxTokens: 50, temperature: 0.7 });
};

// Generate follow-up note suggestion
export const generateFollowUpSuggestion = async (taskTitle, previousNotes = []) => {
  const notesContext = previousNotes.length > 0 
    ? `Previous notes:\n${previousNotes.map((n, i) => `${i + 1}. ${n.text}`).join('\n')}`
    : 'No previous notes.';

  const prompt = `For this task: "${taskTitle}"

${notesContext}

Suggest a helpful follow-up action or question to track progress. Keep it concise (1-2 sentences).`;

  return await callOpenAI(prompt, { maxTokens: 100 });
};

/**
 * Zoom Integration
 */

// Create Zoom meeting (placeholder - requires OAuth flow)
export const createZoomMeeting = async (taskData) => {
  const credentials = getIntegrationCredentials('zoom');
  
  if (!credentials || !credentials.apiKey) {
    throw new Error('Zoom is not connected. Please add your credentials in Settings → Integrations.');
  }

  // Note: Real implementation requires OAuth access token
  // This is a placeholder showing the structure
  console.log('Zoom meeting creation would happen here with:', taskData);
  
  return {
    meetingLink: `https://zoom.us/j/${Math.floor(Math.random() * 900000000) + 100000000}`,
    meetingId: Math.floor(Math.random() * 900000000) + 100000000,
    password: Math.random().toString(36).slice(2, 8)
  };
};

/**
 * Google Meet Integration
 */

// Create Google Meet (placeholder - requires OAuth flow)
export const createGoogleMeet = async (taskData) => {
  const credentials = getIntegrationCredentials('gmeet');
  
  if (!credentials || !credentials.apiKey) {
    throw new Error('Google Meet is not connected. Please add your credentials in Settings → Integrations.');
  }

  // Note: Real implementation requires OAuth access token and Calendar API
  console.log('Google Meet creation would happen here with:', taskData);
  
  const token = Math.random().toString(36).slice(2, 10);
  return {
    meetingLink: `https://meet.google.com/${token.slice(0, 3)}-${token.slice(3, 6)}-${token.slice(6, 9)}`,
    meetingCode: `${token.slice(0, 3)}-${token.slice(3, 6)}-${token.slice(6, 9)}`
  };
};

/**
 * Zapier Integration
 */

// Send webhook to Zapier
export const sendToZapier = async (eventType, data) => {
  const credentials = getIntegrationCredentials('zapier');
  
  if (!credentials || !credentials.webhookUrl) {
    console.log('Zapier not connected, skipping webhook');
    return;
  }

  try {
    await fetch(credentials.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        eventType,
        timestamp: new Date().toISOString(),
        data
      })
    });
    console.log('Zapier webhook sent successfully');
  } catch (error) {
    console.error('Failed to send Zapier webhook:', error);
  }
};

// Export all functions
export default {
  // General
  getIntegrationCredentials,
  isIntegrationConnected,
  
  // ChatGPT
  callOpenAI,
  generateTaskDescription,
  generateKeyPoints,
  suggestTaskPriority,
  improveTaskTitle,
  generateFollowUpSuggestion,
  
  // Zoom
  createZoomMeeting,
  
  // Google Meet
  createGoogleMeet,
  
  // Zapier
  sendToZapier
};
