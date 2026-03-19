function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}
export const env = { appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000' };
export const requireEnv = {
  supabaseUrl: () => required('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: () => required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: () => required('SUPABASE_SERVICE_ROLE_KEY'),
  openAiApiKey: () => required('OPENAI_API_KEY'),
  stripeSecretKey: () => required('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: () => required('STRIPE_WEBHOOK_SECRET')
};
