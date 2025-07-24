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

    const { startDate, endDate, reportType } = await req.json()

    console.log('Generating report:', { startDate, endDate, reportType })

    // Get payments data with student information
    const { data: payments, error: paymentsError } = await supabaseClient
      .from('payments')
      .select(`
        *,
        students (
          name,
          class,
          nis,
          academic_year
        )
      `)
      .gte('payment_date', startDate)
      .lte('payment_date', endDate)
      .order('payment_date', { ascending: false })

    if (paymentsError) {
      throw paymentsError
    }

    console.log('Found payments:', payments.length)

    // Generate report based on type
    let reportData = {}

    switch (reportType) {
      case 'summary':
        reportData = {
          totalPayments: payments.length,
          totalAmount: payments.reduce((sum, p) => sum + Number(p.amount), 0),
          paidCount: payments.filter(p => p.status === 'paid').length,
          pendingCount: payments.filter(p => p.status === 'pending').length,
          overdueCount: payments.filter(p => p.status === 'overdue').length,
          byMonth: groupByMonth(payments),
          byClass: groupByClass(payments)
        }
        break

      case 'detailed':
        reportData = {
          payments: payments.map(p => ({
            id: p.id,
            studentName: p.students?.name,
            studentNis: p.students?.nis,
            class: p.students?.class,
            academicYear: p.students?.academic_year,
            amount: p.amount,
            monthYear: p.month_year,
            paymentDate: p.payment_date,
            dueDate: p.due_date,
            status: p.status,
            paymentMethod: p.payment_method,
            notes: p.notes
          }))
        }
        break

      default:
        throw new Error('Invalid report type')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: reportData,
        generatedAt: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in generate-payment-report:', error)
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

function groupByMonth(payments: any[]) {
  return payments.reduce((acc, payment) => {
    const month = payment.month_year
    if (!acc[month]) {
      acc[month] = { count: 0, total: 0 }
    }
    acc[month].count++
    acc[month].total += Number(payment.amount)
    return acc
  }, {})
}

function groupByClass(payments: any[]) {
  return payments.reduce((acc, payment) => {
    const className = payment.students?.class || 'Unknown'
    if (!acc[className]) {
      acc[className] = { count: 0, total: 0 }
    }
    acc[className].count++
    acc[className].total += Number(payment.amount)
    return acc
  }, {})
}