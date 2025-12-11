import { RecruitmentPipeline } from "@/components/candidates/RecruitmentPipeline";
import { getCandidates } from "@/actions/candidate-actions";

export const dynamic = 'force-dynamic';

export default async function PipelinePage() {
  const result = await getCandidates();
  const candidates = result.success && result.data ? result.data : [];

  return <RecruitmentPipeline initialCandidates={candidates} />;
}
