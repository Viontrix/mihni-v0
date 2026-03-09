import { supabase } from "@/lib/supabase"

export type ProjectRecord = {
  id: string
  user_id: string
  name: string
  tool_id: string
  tool_name: string | null
  data: Record<string, unknown> | null
  thumbnail: string | null
  created_at: string
  updated_at: string
}

type CreateProjectInput = {
  name: string
  toolId: string
  toolName?: string
  data?: Record<string, unknown>
  thumbnail?: string | null
}

type UpdateProjectInput = {
  id: string
  name?: string
  data?: Record<string, unknown>
  thumbnail?: string | null
}

type SubscriptionPlan = {
  projects_limit: number
  daily_limit: number
  name_ar?: string | null
  code?: string | null
}

type UsageTrackingRow = {
  id: string
  user_id: string
  projects_count: number | null
  daily_usage: number | null
  storage_used: number | null
  last_reset: string | null
}

function isSameDay(dateA: Date, dateB: Date) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

async function getUserPlanLimits(userId: string): Promise<SubscriptionPlan | null> {
  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("user_id", userId)
    .single()

  if (subscriptionError || !subscription) {
    console.error(subscriptionError)
    return null
  }

  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("projects_limit, daily_limit, name_ar, code")
    .eq("id", subscription.plan_id)
    .single()

  if (planError || !plan) {
    console.error(planError)
    return null
  }

  return plan as SubscriptionPlan
}

async function getOrCreateUsageTracking(userId: string): Promise<UsageTrackingRow | null> {
  const { data: usage, error } = await supabase
    .from("usage_tracking")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (!error && usage) {
    return usage as UsageTrackingRow
  }

  const { data: created, error: createError } = await supabase
    .from("usage_tracking")
    .insert({
      user_id: userId,
      projects_count: 0,
      daily_usage: 0,
      storage_used: 0,
      last_reset: new Date().toISOString(),
    })
    .select()
    .single()

  if (createError) {
    console.error(createError)
    return null
  }

  return created as UsageTrackingRow
}

async function refreshUsageTracking(userId: string) {
  const usage = await getOrCreateUsageTracking(userId)
  if (!usage) return null

  const now = new Date()
  const lastReset = usage.last_reset ? new Date(usage.last_reset) : now
  const shouldResetDaily = !isSameDay(now, lastReset)

  if (!shouldResetDaily) return usage

  const { data: updated, error } = await supabase
    .from("usage_tracking")
    .update({
      daily_usage: 0,
      last_reset: now.toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error(error)
    return usage
  }

  return updated as UsageTrackingRow
}

async function syncProjectCounters(userId: string) {
  const { count, error: countError } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  if (countError) {
    console.error(countError)
    return count ?? 0
  }

  const totalProjects = count ?? 0

  const { error: updateError } = await supabase
    .from("usage_tracking")
    .update({
      projects_count: totalProjects,
    })
    .eq("user_id", userId)

  if (updateError) {
    console.error(updateError)
  }

  return totalProjects
}

export async function getUserProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false })

  if (error) {
    console.error(error)
    return []
  }

  return data as ProjectRecord[]
}

export async function getProjectById(projectId: string) {
  const user = await getCurrentUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data as ProjectRecord
}

export async function createProject(project: CreateProjectInput) {
  const user = await getCurrentUser()
  if (!user) return null

  const plan = await getUserPlanLimits(user.id)

  if (!plan) {
    alert("تعذر قراءة بيانات الباقة الحالية")
    return null
  }

  const totalProjects = await syncProjectCounters(user.id)

  if (totalProjects >= plan.projects_limit) {
    alert(
      `لقد وصلت الحد المسموح في باقة ${plan.name_ar ?? plan.code ?? "الحالية"} (${plan.projects_limit} مشاريع).\nقم بالترقية للمتابعة.`
    )
    return null
  }

  const usage = await refreshUsageTracking(user.id)

  if (!usage) {
    alert("تعذر قراءة بيانات الاستخدام اليومية")
    return null
  }

  const currentDailyUsage = usage.daily_usage ?? 0

  if (currentDailyUsage >= plan.daily_limit) {
    alert(
      `لقد وصلت الحد اليومي للاستخدام في باقة ${plan.name_ar ?? plan.code ?? "الحالية"} (${plan.daily_limit} عملية اليوم).\nقم بالترقية أو حاول مرة أخرى غدًا.`
    )
    return null
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: project.name,
      tool_id: project.toolId,
      tool_name: project.toolName ?? null,
      data: project.data ?? {},
      thumbnail: project.thumbnail ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error(error)
    return null
  }

  const estimatedStorage = JSON.stringify(project.data ?? {}).length * 2

  const { error: usageUpdateError } = await supabase
    .from("usage_tracking")
    .update({
      daily_usage: currentDailyUsage + 1,
      projects_count: totalProjects + 1,
      storage_used: (usage.storage_used ?? 0) + estimatedStorage,
    })
    .eq("user_id", user.id)

  if (usageUpdateError) {
    console.error(usageUpdateError)
  }

  return data as ProjectRecord
}

export async function updateProject(project: UpdateProjectInput) {
  const user = await getCurrentUser()
  if (!user) return null

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }

  if (typeof project.name === "string") payload.name = project.name
  if (typeof project.data !== "undefined") payload.data = project.data
  if (typeof project.thumbnail !== "undefined") payload.thumbnail = project.thumbnail

  const { data, error } = await supabase
    .from("projects")
    .update(payload)
    .eq("id", project.id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error(error)
    return null
  }

  return data as ProjectRecord
}

export async function deleteProject(projectId: string) {
  const user = await getCurrentUser()
  if (!user) return

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id)

  if (error) {
    console.error(error)
    return
  }

  await syncProjectCounters(user.id)
}
