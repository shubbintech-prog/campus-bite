import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useVendorApplications, useReviewApplication } from "@/hooks/use-vendor-application-api";

export default function AdminApplicationReview() {
  const { data: applications, isLoading, refetch } = useVendorApplications();
  const reviewMutation = useReviewApplication();

  const handleReview = async (id: string | number, status: 'approved' | 'rejected') => {
    if (window.confirm(`Are you sure you want to ${status} this application?`)) {
      await reviewMutation.mutateAsync({ id, status });
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const pendingApps = applications?.filter((app: any) => app.status === 'pending') || [];
  const reviewedApps = applications?.filter((app: any) => app.status !== 'pending') || [];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Vendor Applications</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and manage vendor requests</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Pending Applications */}
        <div>
          <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2 text-warning">
            <Clock className="w-5 h-5" />
            Pending Review ({pendingApps.length})
          </h2>
          <div className="grid gap-4">
            {pendingApps.length > 0 ? (
              pendingApps.map((app: any) => (
                <ApplicationCard key={app.id} app={app} onReview={handleReview} isReviewing={reviewMutation.isPending} />
              ))
            ) : (
              <div className="p-8 text-center bg-card rounded-xl border border-dashed border-border text-muted-foreground text-sm">
                No pending applications at the moment.
              </div>
            )}
          </div>
        </div>

        {/* Reviewed Applications */}
        {reviewedApps.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-lg mb-4">Recent Decisions</h2>
            <div className="grid gap-4 opacity-70">
              {reviewedApps.map((app: any) => (
                <ApplicationCard key={app.id} app={app} reviewed />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ app, onReview, isReviewing, reviewed }: { app: any, onReview?: any, isReviewing?: boolean, reviewed?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 card-shadow">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg">{app.business_name}</h3>
              <p className="text-xs text-muted-foreground">Applicant: {app.applicant_name} ({app.applicant_email})</p>
            </div>
            {reviewed && (
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                app.status === 'approved' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
              }`}>
                {app.status}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Phone</p>
              <p className="text-sm font-medium">{app.phone_number}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Category</p>
              <p className="text-sm font-medium">{app.food_category}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Landmark</p>
              <p className="text-sm font-medium">{app.location_landmark}</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Description</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{app.description}</p>
          </div>
        </div>

        {!reviewed && (
          <div className="flex md:flex-col gap-2 shrink-0 md:justify-center">
            <button
              onClick={() => onReview(app.id, 'approved')}
              disabled={isReviewing}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-success text-success-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onReview(app.id, 'rejected')}
              disabled={isReviewing}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-destructive/10 text-destructive rounded-xl text-sm font-semibold hover:bg-destructive/20 transition-all disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
