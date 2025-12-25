import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface PageView {
  id: string;
  page_path: string;
  visitor_id: string | null;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
  browser: string | null;
  created_at: string;
}

export function usePageViews() {
  return useQuery({
    queryKey: ["page-views"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_views")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PageView[];
    },
  });
}

export function useRecordPageView() {
  return useMutation({
    mutationFn: async (pagePath: string) => {
      const visitorId = getVisitorId();
      const userAgent = navigator.userAgent;
      const referrer = document.referrer || null;
      const deviceType = getDeviceType();
      const browser = getBrowser();

      const { error } = await supabase.from("page_views").insert({
        page_path: pagePath,
        visitor_id: visitorId,
        user_agent: userAgent,
        referrer: referrer,
        device_type: deviceType,
        browser: browser,
      });
      if (error) throw error;
    },
  });
}

function getVisitorId(): string {
  let visitorId = localStorage.getItem("visitor_id");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("visitor_id", visitorId);
  }
  return visitorId;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return "Mobile";
  return "Desktop";
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
  if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
  if (ua.includes("Edg")) return "Edge";
  if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";
  return "Other";
}

export function useTrackPageView(pagePath: string) {
  const recordPageView = useRecordPageView();

  useEffect(() => {
    const sessionKey = `pageview_${pagePath}`;
    const hasRecordedInSession = sessionStorage.getItem(sessionKey);
    
    if (!hasRecordedInSession) {
      recordPageView.mutate(pagePath);
      sessionStorage.setItem(sessionKey, "true");
    }
  }, [pagePath]);
}

export function useAnalytics() {
  const { data: pageViews = [], isLoading } = usePageViews();

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const todayViews = pageViews.filter((v) => v.created_at.startsWith(todayStr)).length;
  const weekViews = pageViews.filter((v) => new Date(v.created_at) >= weekAgo).length;
  const monthViews = pageViews.filter((v) => new Date(v.created_at) >= monthAgo).length;
  const totalViews = pageViews.length;

  const uniqueVisitors = new Set(pageViews.map((v) => v.visitor_id)).size;
  const uniqueVisitorsToday = new Set(
    pageViews.filter((v) => v.created_at.startsWith(todayStr)).map((v) => v.visitor_id)
  ).size;

  // Device breakdown
  const deviceCounts = pageViews.reduce((acc, v) => {
    const device = v.device_type || "Unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Browser breakdown
  const browserCounts = pageViews.reduce((acc, v) => {
    const browser = v.browser || "Unknown";
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Page breakdown
  const pageCounts = pageViews.reduce((acc, v) => {
    acc[v.page_path] = (acc[v.page_path] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Views by day (last 7 days)
  const viewsByDay: { date: string; views: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const views = pageViews.filter((v) => v.created_at.startsWith(dateStr)).length;
    viewsByDay.push({ date: dateStr, views });
  }

  return {
    isLoading,
    todayViews,
    weekViews,
    monthViews,
    totalViews,
    uniqueVisitors,
    uniqueVisitorsToday,
    deviceCounts,
    browserCounts,
    pageCounts,
    viewsByDay,
    recentViews: pageViews.slice(0, 10),
  };
}
