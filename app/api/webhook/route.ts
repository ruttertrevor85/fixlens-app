import Stripe from 'stripe'
import { createSupabaseAdminClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(req: Request) {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return new Response('Missing STRIPE_WEBHOOK_SECRET', { status: 500 })
  }

  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error?.message)
    return new Response(`Webhook Error: ${error?.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const repairRequestId = session.metadata?.repairRequestId

    if (!repairRequestId) {
      return new Response('Missing repairRequestId metadata', { status: 400 })
    }

    const paymentIntentId =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id || null

    const supabase = createSupabaseAdminClient()

    const paymentInsert = await supabase.from('payments').insert({
      repair_request_id: repairRequestId,
      stripe_payment_id: paymentIntentId,
      amount: session.amount_total || 0,
      status: 'paid',
    })

    if (paymentInsert.error) {
      console.error('Payment insert error:', paymentInsert.error)
      return new Response(paymentInsert.error.message, { status: 500 })
    }

    const requestUpdate = await supabase
      .from('repair_requests')
      .update({ status: 'review_requested' })
      .eq('id', repairRequestId)

    if (requestUpdate.error) {
      console.error('Repair request update error:', requestUpdate.error)
      return new Response(requestUpdate.error.message, { status: 500 })
    }

    console.log('Review unlocked for request:', repairRequestId)
  }

  return new Response('ok', { status: 200 })
}