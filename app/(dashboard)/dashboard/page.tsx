// app/(dashboard)/dashboard/page.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  FilePlus2,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useUserContext } from "@/app/context/UserContext";
import type { Doc } from "@/convex/_generated/dataModel";

function statusMeta(status: Doc<"businessPlans">["status"]) {
  switch (status) {
    case "ready":
      return { icon: CheckCircle2, variant: "default" as const };
    case "generating":
      return { icon: Clock, variant: "secondary" as const };
    case "failed":
      return { icon: XCircle, variant: "destructive" as const };
    default:
      return { icon: Clock, variant: "secondary" as const };
  }
}

export default function DashboardOverviewPage() {
  const user = useUserContext();
  const plans = useQuery(api.businessPlans.listMyPlans);

  const readyCount = plans?.filter((p) => p.status === "ready").length ?? 0;
  const draftCount = plans?.filter((p) => p.status === "draft").length ?? 0;
  const recent = plans?.slice(0, 5) ?? [];

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      {/* Full-bleed background photo, faded so text stays readable —
          matches the landing page treatment exactly. `isolate` pins a
          local stacking context so the -z-10 layers below stay behind
          this page's content but don't escape behind the dashboard
          layout's own background. */}
      <Image
        src="/cvcolleague.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-20 dark:opacity-10 -z-10 pointer-events-none select-none"
      />
      {/* Soft purple/indigo wash over the photo for depth in both themes.
    Light mode gets its own darker wash (rather than falling through
    to `transparent`) — a low-opacity photo on white reads as washed
    out, so the wash carries most of the depth and the image opacity
    above is raised too so it doesn't disappear entirely. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-950/30 via-slate-900/20 to-purple-950/35 dark:from-indigo-950/40 dark:via-black/30 dark:to-purple-950/45" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8 px-6 pt-16 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm font-medium tracking-wide uppercase text-purple-600 dark:text-purple-400">
            Same idea, sharper numbers
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl font-medium tracking-tight text-zinc-900 dark:text-white">
            Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 text-sm text-zinc-900/70 dark:text-white/70">
            Here&apos;s where things stand.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total plans", value: plans?.length ?? 0 },
            { label: "Ready to share", value: readyCount },
            { label: "Drafts", value: draftCount },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4"
            >
              <p className="font-[family-name:var(--font-display)] text-3xl text-zinc-900 dark:text-white">
                {stat.value}
              </p>
              <p className="text-sm text-zinc-900/70 dark:text-white/70">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/dashboard/create">
            <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/20">
              <FilePlus2 size={16} />
              Create a plan
            </Button>
          </Link>
          <Link href="/dashboard/plans">
            <Button
              variant="outline"
              className="gap-2 border-zinc-900/20 dark:border-white/20 text-zinc-900 dark:text-white hover:border-purple-600 hover:text-purple-600 dark:hover:border-purple-400 dark:hover:text-purple-400"
            >
              <FileText size={16} />
              View all plans
            </Button>
          </Link>
        </div>

        <div className="space-y-3">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-zinc-900 dark:text-white">
            Recent plans
          </h2>
          {plans?.length === 0 && (
            <p className="text-sm text-zinc-900/60 dark:text-white/60">
              Nothing here yet — your first plan is a couple of steps away.
            </p>
          )}
          {recent.map((plan) => {
            const { icon: Icon, variant } = statusMeta(plan.status);
            return (
              <Link
                key={plan._id}
                href={
                  plan.status === "ready"
                    ? `/plan/${plan.shareId}`
                    : "/dashboard/plans"
                }
                target={plan.status === "ready" ? "_blank" : undefined}
                rel={plan.status === "ready" ? "noreferrer" : undefined}
                className="flex items-center justify-between rounded-2xl border border-zinc-900/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-4 hover:border-purple-600/40 dark:hover:border-purple-400/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={16}
                    className="text-purple-600 dark:text-purple-400"
                  />
                  <span className="text-sm font-medium text-zinc-900 dark:text-white">
                    {plan.title}
                  </span>
                </div>
                <Badge variant={variant}>{plan.status}</Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
