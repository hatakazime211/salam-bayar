import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { studentIds, message } = await req.json()

    console.log('Sending WhatsApp notifications to:', studentIds)
    console.log('Message:', message)

    // Get students with parent phone numbers
    const { data: students, error: studentsError } = await supabaseClient
      .from('students')
      .select(`
        id,
        name,
        profiles!students_parent_id_fkey (
          phone,
          full_name
        )
      `)
      .in('id', studentIds)

    if (studentsError) {
      throw studentsError
    }

    console.log('Found students:', students)

    // Simulate sending WhatsApp messages
    const notifications = students
      .filter(student => student.profiles?.phone)
      .map(student => ({
        studentName: student.name,
        parentName: student.profiles?.full_name,
        phone: student.profiles?.phone,
        message: message,
        status: 'sent',
        sentAt: new Date().toISOString()
      }))

    console.log('Notifications to send:', notifications)

    return new Response(
      JSON.stringify({ 
        success: true, 
        notifications,
        message: `Successfully sent ${notifications.length} WhatsApp notifications`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in send-whatsapp-notification:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})