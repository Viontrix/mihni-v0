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
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

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

  return data as ProjectRecord
}

export async function updateProject(project: UpdateProjectInput) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
  const { error } = await supabase.from("projects").delete().eq("id", projectId)

  if (error) {
    console.error(error)
  }
}
