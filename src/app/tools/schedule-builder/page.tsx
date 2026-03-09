"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { GeneratorTypeSelector, useGeneratorType, type GeneratorType } from "@/components/tools/GeneratorTypeSelector"
import { ROUTES } from "@/lib/routes"
import { createProject, getProjectById, updateProject } from "@/lib/supabase/projects"
import {
  ArrowRight,
  Calendar,
  Download,
  Printer,
  Save,
  Trash2,
  Copy,
  Plus,
  Loader2,
} from "lucide-react"

type ClassSession = {
  subject: string
  teacher: string
  room: string
  color: string
}

type DaySchedule = {
  day: string
  sessions: (ClassSession | null)[]
}

type UploadedFileMeta = {
  name: string
  size: number
  type: string
  lastModified: number
}

type ScheduleProjectPayload = {
  version: 1
  tool: "schedule-builder"
  generatorType: GeneratorType
  customTitle: string
  uploadedFile: UploadedFileMeta | null
  scheduleTitle: string
  grade: string
  schedule: DaySchedule[]
}

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"]
const TIME_SLOTS = [
  "الحصة 1",
  "الحصة 2",
  "الحصة 3",
  "الحصة 4",
  "الحصة 5",
  "الحصة 6",
  "الحصة 7",
]

const SUBJECT_PRESETS = [
  { name: "الرياضيات", color: "bg-blue-500" },
  { name: "اللغة العربية", color: "bg-green-500" },
  { name: "العلوم", color: "bg-purple-500" },
  { name: "اللغة الإنجليزية", color: "bg-amber-500" },
  { name: "التربية الإسلامية", color: "bg-emerald-500" },
  { name: "الدراسات الاجتماعية", color: "bg-orange-500" },
  { name: "الحاسب الآلي", color: "bg-cyan-500" },
  { name: "الاجتماعات", color: "bg-rose-500" },
  { name: "المواعيد", color: "bg-slate-500" },
]

function createEmptySchedule(): DaySchedule[] {
  return DAYS.map((day) => ({
    day,
    sessions: Array(TIME_SLOTS.length).fill(null),
  }))
}

function buildDefaultTitle(generatorType: GeneratorType) {
  if (generatorType === "company") return "جدول اجتماعات الأسبوع"
  if (generatorType === "government") return "جدول المواعيد الرسمية"
  if (generatorType === "individual") return "جدولي الأسبوعي"
  if (generatorType === "custom") return "جدول مخصص"
  return "جدول الحصص الدراسية"
}

function buildProjectName(scheduleTitle: string, grade: string) {
  const title = scheduleTitle.trim() || "جدول"
  const level = grade.trim()
  return level ? `${title} - ${level}` : title
}

function sanitizeUploadedFile(file: File | null): UploadedFileMeta | null {
  if (!file) return null
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  }
}

export default function ScheduleBuilderPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams.get("project")

  const [mounted, setMounted] = useState(false)
  const [scheduleTitle, setScheduleTitle] = useState("جدول الحصص الدراسية")
  const [grade, setGrade] = useState("")
  const [schedule, setSchedule] = useState<DaySchedule[]>(createEmptySchedule())
  const [selectedCell, setSelectedCell] = useState<{ dayIndex: number; slotIndex: number } | null>(null)
  const [loadedProjectId, setLoadedProjectId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingProject, setIsLoadingProject] = useState(true)
  const [hasLoadedProject, setHasLoadedProject] = useState(false)

  const {
    generatorType,
    setGeneratorType,
    customTitle,
    setCustomTitle,
    uploadedFile,
    setUploadedFile,
  } = useGeneratorType("school")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (hasLoadedProject) return
    setScheduleTitle(buildDefaultTitle(generatorType as GeneratorType))
  }, [generatorType, hasLoadedProject])

  useEffect(() => {
    let cancelled = false

    const loadProject = async () => {
      if (!projectId) {
        setIsLoadingProject(false)
        setLoadedProjectId(null)
        return
      }

      setIsLoadingProject(true)
      const project = await getProjectById(projectId)

      if (!project) {
        if (!cancelled) {
          alert("تعذر تحميل المشروع أو أنك لا تملك صلاحية الوصول إليه")
          router.push(ROUTES.DASHBOARD)
        }
        return
      }

      const payload = (project.data ?? {}) as Partial<ScheduleProjectPayload>
      if (cancelled) return

      setScheduleTitle(payload.scheduleTitle ?? "جدول الحصص الدراسية")
      setGrade(payload.grade ?? "")
      setSchedule(payload.schedule ?? createEmptySchedule())
      setGeneratorType((payload.generatorType ?? "school") as GeneratorType)
      setCustomTitle(payload.customTitle ?? "")
      setUploadedFile(null)
      setLoadedProjectId(project.id)
      setHasLoadedProject(true)
      setIsLoadingProject(false)
    }

    void loadProject()

    return () => {
      cancelled = true
    }
  }, [projectId, router, setCustomTitle, setGeneratorType, setUploadedFile])

  const projectPayload: ScheduleProjectPayload = {
    version: 1,
    tool: "schedule-builder",
    generatorType: generatorType as GeneratorType,
    customTitle,
    uploadedFile: sanitizeUploadedFile(uploadedFile),
    scheduleTitle,
    grade,
    schedule,
  }

  const filledCount = useMemo(
    () => schedule.reduce((count, day) => count + day.sessions.filter(Boolean).length, 0),
    [schedule],
  )

  const updateSession = (dayIndex: number, slotIndex: number, session: ClassSession | null) => {
    setSchedule((prev) => {
      const next = prev.map((day) => ({ ...day, sessions: [...day.sessions] }))
      next[dayIndex].sessions[slotIndex] = session
      return next
    })
  }

  const clearSchedule = () => {
    setSchedule(createEmptySchedule())
    setSelectedCell(null)
  }

  const copyDay = (fromDayIndex: number, toDayIndex: number) => {
    setSchedule((prev) => {
      const next = prev.map((day) => ({ ...day, sessions: [...day.sessions] }))
      next[toDayIndex].sessions = next[fromDayIndex].sessions.map((session) =>
        session ? { ...session } : null,
      )
      return next
    })
  }

  const exportSchedule = () => {
    const blob = new Blob([JSON.stringify(projectPayload, null, 2)], {
      type: "application/json",
    })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `${buildProjectName(scheduleTitle, grade)}.json`
    link.click()
  }

  const printSchedule = () => {
    window.print()
  }

  const handleSaveProject = async () => {
    try {
      setIsSaving(true)
      const projectName = buildProjectName(scheduleTitle, grade)

      if (loadedProjectId) {
        const updated = await updateProject({
          id: loadedProjectId,
          name: projectName,
          data: projectPayload as unknown as Record<string, unknown>,
        })

        if (!updated) {
          alert("تعذر تحديث المشروع")
          return
        }

        alert("تم تحديث المشروع بنجاح")
        return
      }

      const created = await createProject({
        name: projectName,
        toolId: "schedule-builder",
        toolName: "منشئ الجداول",
        data: projectPayload as unknown as Record<string, unknown>,
      })

      if (!created) {
        alert("تعذر حفظ المشروع")
        return
      }

      setLoadedProjectId(created.id)
      setHasLoadedProject(true)
      router.replace(`/tools/schedule-builder?project=${created.id}`)
      alert("تم حفظ المشروع بنجاح")
    } finally {
      setIsSaving(false)
    }
  }

  if (!mounted || isLoadingProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">جاري تحميل منشئ الجداول...</p>
        </div>
      </div>
    )
  }

  const activeSession = selectedCell
    ? schedule[selectedCell.dayIndex]?.sessions[selectedCell.slotIndex]
    : null

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1B2D2B]/95 backdrop-blur border-b border-border print:hidden">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={ROUTES.START}>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4 ml-2" />
                الأدوات
              </Button>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <Calendar className="w-5 h-5 text-teal-500" />
            <div className="min-w-0">
              <h1 className="text-lg font-bold truncate">منشئ الجداول</h1>
              <p className="text-xs text-muted-foreground truncate">
                {loadedProjectId ? "وضع التعديل" : "مشروع جديد"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            <Button onClick={handleSaveProject} disabled={isSaving} size="sm" className="bg-blue-600 hover:bg-blue-700">
              {isSaving ? <Loader2 className="w-4 h-4 ml-2 animate-spin" /> : <Save className="w-4 h-4 ml-2" />}
              {loadedProjectId ? "تحديث" : "حفظ"}
            </Button>
            <Button variant="outline" size="sm" onClick={printSchedule}>
              <Printer className="w-4 h-4 ml-2" />
              طباعة
            </Button>
            <Button variant="outline" size="sm" onClick={exportSchedule}>
              <Download className="w-4 h-4 ml-2" />
              تصدير JSON
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto p-4 lg:p-8 space-y-6">
        <div className="rounded-2xl border bg-card p-4 lg:p-5 print:hidden">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
            <div className="xl:col-span-2">
              <Label className="mb-3 block">نوع الجدول</Label>
              <GeneratorTypeSelector
                value={generatorType}
                onChange={setGeneratorType}
                customTitle={customTitle}
                onCustomTitleChange={setCustomTitle}
                uploadedFile={uploadedFile}
                onFileUpload={setUploadedFile}
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">اسم المشروع</Label>
                <Input value={scheduleTitle} onChange={(e) => setScheduleTitle(e.target.value)} placeholder="مثال: جدول الحصص الدراسية" />
              </div>
              <div>
                <Label className="mb-2 block">الصف / المستوى / القسم</Label>
                <Input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="مثال: الصف الثالث المتوسط - أ" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <CardTitle>{scheduleTitle || "منشئ الجداول"}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{grade || "أضف الصف أو المستوى لإكمال عنوان الجدول"}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">الخانات المعبأة: {filledCount}</div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="min-w-[900px]">
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    <div className="rounded-xl bg-muted/60 p-3 text-center font-semibold">اليوم / الوقت</div>
                    {TIME_SLOTS.map((slot) => (
                      <div key={slot} className="rounded-xl bg-muted/60 p-3 text-center font-semibold text-sm">
                        {slot}
                      </div>
                    ))}
                  </div>

                  {schedule.map((day, dayIndex) => (
                    <div key={day.day} className="grid grid-cols-8 gap-2 mb-2">
                      <div className="rounded-xl border bg-card p-3 flex items-center justify-center font-semibold">
                        {day.day}
                      </div>

                      {day.sessions.map((session, slotIndex) => (
                        <button
                          key={`${day.day}-${slotIndex}`}
                          type="button"
                          onClick={() => {
                            if (!session) {
                              updateSession(dayIndex, slotIndex, {
                                subject: "",
                                teacher: "",
                                room: "",
                                color: "bg-blue-500",
                              })
                            }
                            setSelectedCell({ dayIndex, slotIndex })
                          }}
                          className={`min-h-[96px] rounded-xl border p-3 text-right transition hover:shadow-sm ${
                            selectedCell?.dayIndex === dayIndex && selectedCell?.slotIndex === slotIndex
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-border"
                          } ${session ? "bg-white dark:bg-slate-900" : "bg-muted/20"}`}
                        >
                          {session ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`h-3 w-3 rounded-full ${session.color}`} />
                                <span className="text-xs text-muted-foreground">اضغط للتعديل</span>
                              </div>
                              <div className="font-semibold truncate">{session.subject || "مادة بدون اسم"}</div>
                              <div className="text-xs text-muted-foreground truncate">{session.teacher || "بدون معلم"}</div>
                              <div className="text-xs text-muted-foreground truncate">{session.room || "بدون قاعة"}</div>
                            </div>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                              <Plus className="w-4 h-4" />
                              إضافة
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 print:hidden">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">إعدادات الخانة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedCell ? (
                  <>
                    <div className="text-sm text-muted-foreground">
                      {schedule[selectedCell.dayIndex].day} - {TIME_SLOTS[selectedCell.slotIndex]}
                    </div>

                    <div>
                      <Label className="mb-2 block">المادة / العنوان</Label>
                      <Input
                        value={activeSession?.subject ?? ""}
                        onChange={(e) =>
                          updateSession(selectedCell.dayIndex, selectedCell.slotIndex, {
                            subject: e.target.value,
                            teacher: activeSession?.teacher ?? "",
                            room: activeSession?.room ?? "",
                            color: activeSession?.color ?? "bg-blue-500",
                          })
                        }
                        placeholder="مثال: الرياضيات"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">المعلم / المسؤول</Label>
                      <Input
                        value={activeSession?.teacher ?? ""}
                        onChange={(e) =>
                          updateSession(selectedCell.dayIndex, selectedCell.slotIndex, {
                            subject: activeSession?.subject ?? "",
                            teacher: e.target.value,
                            room: activeSession?.room ?? "",
                            color: activeSession?.color ?? "bg-blue-500",
                          })
                        }
                        placeholder="اسم المعلم أو المسؤول"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">الفصل / القاعة</Label>
                      <Input
                        value={activeSession?.room ?? ""}
                        onChange={(e) =>
                          updateSession(selectedCell.dayIndex, selectedCell.slotIndex, {
                            subject: activeSession?.subject ?? "",
                            teacher: activeSession?.teacher ?? "",
                            room: e.target.value,
                            color: activeSession?.color ?? "bg-blue-500",
                          })
                        }
                        placeholder="مثال: 3A أو القاعة 12"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block">اللون</Label>
                      <div className="grid grid-cols-4 gap-2">
                        {SUBJECT_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            title={preset.name}
                            onClick={() =>
                              updateSession(selectedCell.dayIndex, selectedCell.slotIndex, {
                                subject: activeSession?.subject || preset.name,
                                teacher: activeSession?.teacher ?? "",
                                room: activeSession?.room ?? "",
                                color: preset.color,
                              })
                            }
                            className={`h-10 rounded-lg border ${preset.color}`}
                          />
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        updateSession(selectedCell.dayIndex, selectedCell.slotIndex, null)
                        setSelectedCell(null)
                      }}
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      حذف الخانة
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">اختر أي خانة من الجدول لإضافة أو تعديل المادة.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">عمليات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={clearSchedule}>
                  <Trash2 className="w-4 h-4 ml-2" />
                  مسح الجدول
                </Button>

                <div className="space-y-2">
                  <Label className="block">نسخ يوم إلى يوم</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {DAYS.map((day, fromIndex) => (
                      <div key={day} className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" disabled={fromIndex === 0} onClick={() => copyDay(fromIndex - 1, fromIndex)}>
                          <Copy className="w-4 h-4 ml-2" />
                          نسخ من السابق إلى {day}
                        </Button>
                        <Button variant="outline" size="sm" disabled={fromIndex === DAYS.length - 1} onClick={() => copyDay(fromIndex, fromIndex + 1)}>
                          <Copy className="w-4 h-4 ml-2" />
                          نسخ إلى التالي
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
