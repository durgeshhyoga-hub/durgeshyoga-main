import { Link } from "react-router-dom";
import { MessageSquare, Calendar, Users, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInquiries } from "@/hooks/useInquiries";
import { useSessions } from "@/hooks/useSessions";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: inquiries = [], isLoading: loadingInquiries } = useInquiries();
  const { data: sessions = [], isLoading: loadingSessions } = useSessions();

  const newInquiries = inquiries.filter((i) => i.status === "new").length;
  const upcomingSessions = sessions.filter(
    (s) => new Date(s.session_date) >= new Date() && s.status === "scheduled"
  );
  const totalParticipants = sessions.reduce((sum, s) => sum + (s.participants || 0), 0);
  const uniqueOrgs = new Set(sessions.map((s) => s.organization)).size;

  const recentInquiries = inquiries.slice(0, 3);
  const nextSessions = upcomingSessions.slice(0, 3);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Total Inquiries</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{loadingInquiries ? "..." : inquiries.length}</p>
          {newInquiries > 0 && (
            <p className="text-xs text-accent mt-1">+{newInquiries} new</p>
          )}
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-accent" />
            </div>
            <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{loadingSessions ? "..." : upcomingSessions.length}</p>
          <p className="text-xs text-muted-foreground mt-1">of {sessions.length} total</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Participants</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{loadingSessions ? "..." : totalParticipants}</p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground">Organizations</p>
          </div>
          <p className="text-2xl font-bold text-foreground">{loadingSessions ? "..." : uniqueOrgs}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent Inquiries</h2>
            <Link to="/admin/inquiries">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {loadingInquiries ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : recentInquiries.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No inquiries yet</div>
            ) : (
              recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{inquiry.name}</p>
                    <p className="text-xs text-muted-foreground">{inquiry.organization || inquiry.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                        inquiry.status === "new"
                          ? "bg-accent/10 text-accent"
                          : inquiry.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-600"
                          : "bg-green-500/10 text-green-600"
                      }`}
                    >
                      {inquiry.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(inquiry.created_at), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Upcoming Sessions</h2>
            <Link to="/admin/sessions">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="divide-y divide-border">
            {loadingSessions ? (
              <div className="p-4 text-center text-muted-foreground">Loading...</div>
            ) : nextSessions.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">No upcoming sessions</div>
            ) : (
              nextSessions.map((session) => (
                <div key={session.id} className="p-4">
                  <p className="font-medium text-foreground text-sm mb-1">{session.title}</p>
                  <p className="text-xs text-muted-foreground">{session.organization} - {session.location}</p>
                  <p className="text-xs text-accent mt-1">
                    {format(new Date(session.session_date), "MMM d, yyyy")}
                    {session.session_time && ` at ${session.session_time}`}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
