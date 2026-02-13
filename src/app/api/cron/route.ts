import { generateAllUsersDailySummaries } from '@/lib/actions/daily-summary';
import { runDataRetentionPolicies } from '@/lib/actions/data-retention';

/**
 * API Route for running scheduled cron jobs
 * 
 * This can be called by:
 * 1. Vercel Cron (vercel.json configuration)
 * 2. External cron service (e.g., cron-job.org)
 * 3. GitHub Actions
 * 
 * Authentication: Use CRON_SECRET environment variable
 */

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const job = url.searchParams.get('job');

    try {
        let result;

        switch (job) {
            case 'daily-summary':
                result = await generateAllUsersDailySummaries();
                break;

            case 'data-retention':
                result = await runDataRetentionPolicies();
                break;

            case 'all':
                const dailySummaryResult = await generateAllUsersDailySummaries();
                const dataRetentionResult = await runDataRetentionPolicies();
                result = {
                    dailySummary: dailySummaryResult,
                    dataRetention: dataRetentionResult,
                };
                break;

            default:
                return Response.json({ error: 'Invalid job type' }, { status: 400 });
        }

        return Response.json(result);
    } catch (error: any) {
        console.error('Cron job error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
