import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const repairRequestId = body.repairRequestId
    const amount = body.amount
    const origin = body.origin

    if (!repairRequestId) {
      return Response.json({ error: 'Missing repairRequestId' }, { status: 400 })
    }

    if (!amount) {
      return Response.json({ error: 'Missing amount' }, { status: 400 })
    }

    if (!origin) {
      return Response.json({ error: 'Missing origin' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'FixLens Professional Handyman Review',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        repairRequestId: repairRequestId,
      },
      success_url: `${origin}/success`,
      cancel_url: `${origin}/cancel`,
    })

    return Response.json({ url: session.url })
  } catch (error: any) {
    console.error('CREATE_CHECKOUT_ERROR:', error)
    return Response.json(
      { error: error?.message || 'Unable to create checkout session.' },
      { status: 500 }
    )
  }
}