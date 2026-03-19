import { createSupabaseAdminClient } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const repairRequestId = body.repairRequestId

    if (!repairRequestId) {
      return Response.json({ error: 'Missing repairRequestId' }, { status: 400 })
    }

    const supabase = createSupabaseAdminClient()

    const updateResult = await supabase
      .from('repair_requests')
      .update({ status: 'review_in_progress' })
      .eq('id', repairRequestId)

    if (updateResult.error) {
      return Response.json({ error: updateResult.error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error: any) {
    console.error('START_REVIEW_ERROR:', error)
    return Response.json(
      { error: error?.message || 'Unable to start review.' },
      { status: 500 }
    )
  }
}