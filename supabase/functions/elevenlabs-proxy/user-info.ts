/* eslint-disable */
// This file contains the handler for user info requests

export async function handleUserInfoRequest(req: Request, apiKey: string, corsHeaders: Record<string, string>) {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: { 
        'Accept': 'application/json',
        'xi-api-key': apiKey 
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: response.statusText }));
      return new Response(
        JSON.stringify({ error: errorData.detail || `ElevenLabs API error: ${response.status}` }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const data = await response.json();
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching user info:", error);
    return new Response(
      JSON.stringify({ 
        error: {
          message: error.message || "Failed to fetch user info",
          type: error.name || "UnknownError"
        }
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
}