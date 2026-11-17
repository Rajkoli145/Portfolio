"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ChevronLeft,
  Plus,
  Save,
  Trash2,
  FileEdit,
  Tag,
  FolderGit2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Maximize2,
  Minimize2,
  RefreshCw,
  Check,
  Lock,
  LogOut,
  Rocket,
  NotebookPen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResearchEntry {
  slug: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  project: string;
  tags: string[];
  status: "draft" | "published";
  summary: string;
  content: string;
  notes?: string[];
}

const LOCAL_STORAGE_KEY = "research_editor_unsaved_draft";

export default function LocalResearchEditorPage() {
  const [entries, setEntries] = useState<ResearchEntry[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("Saved");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const hasRestoredDraft = useRef(false);

  const [authed, setAuthed] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authenticating, setAuthenticating] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [modal, setModal] = useState<{
    open: boolean;
    type: "confirm" | "alert";
    title: string;
    message: string;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm?: () => void;
  }>({ open: false, type: "alert", title: "", message: "" });

  const showAlert = (title: string, message: string) =>
    setModal({ open: true, type: "alert", title, message });

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmLabel = "Confirm",
    destructive = false
  ) =>
    setModal({ open: true, type: "confirm", title, message, onConfirm, confirmLabel, destructive });

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("",);

  // Editor Form State
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("failure-recovery-benchmark");
  const [tagsInput, setTagsInput] = useState("research-notes, experiment-log");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<string[]>([]);

  const skipAutosaveRef = useRef(true);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const selectedSlugRef = useRef<string | null>(null);

  const updateSelectedSlug = useCallback((newSlug: string | null) => {
    selectedSlugRef.current = newSlug;
    setSelectedSlug(newSlug);
  }, []);

  const loadEntryIntoForm = useCallback((entry: ResearchEntry) => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    skipAutosaveRef.current = true;
    updateSelectedSlug(entry.slug);
    setSlug(entry.slug);
    setTitle(entry.title);
    setProject(entry.project || "failure-recovery-benchmark");
    setTagsInput(Array.isArray(entry.tags) ? entry.tags.join(", ") : "");
    setStatus(entry.status || "draft");
    setSummary(entry.summary || "");
    setContent(entry.content || "");
    setNotes(Array.isArray(entry.notes) ? entry.notes : []);
  }, [updateSelectedSlug]);

  const handleNewEntry = useCallback(() => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    skipAutosaveRef.current = true;
    updateSelectedSlug(null);
    setSlug("");
    setTitle("");
    setProject("failure-recovery-benchmark");
    setTagsInput("research-notes, experiment-log");
    setStatus("draft");
    setSummary("");
    setContent("");
    setNotes([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, [updateSelectedSlug]);

  const computeSlug = useCallback((targetTitle: string) => {
    const currentSlug = selectedSlugRef.current;
    if (currentSlug && currentSlug.trim() !== "") {
      return currentSlug;
    }
    const today = new Date().toISOString().split("T")[0];
    const cleanTitle = (targetTitle || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slugBody = cleanTitle || `note-${Date.now().toString(36)}`;
    return `${today}-${slugBody}`;
  }, []);

  const autoSaveToDisk = useCallback(async (draftData: { title: string; project: string; tagsInput: string; status: "draft" | "published"; summary: string; content: string; notes: string[] }) => {
    const originalSlug = selectedSlugRef.current;
    try {
      setAutoSaveStatus("Auto-saving...");
      const parsedTags = (draftData.tagsInput || "")
        .split(",")
        .map((t: string) => t.trim())
        .filter(Boolean);

      const targetSlug = computeSlug(draftData.title);

      const payload = {
        slug: targetSlug,
        title: draftData.title || "Untitled Note",
        project: draftData.project,
        tags: parsedTags,
        notes: draftData.notes,
        status: draftData.status,
        summary: draftData.summary,
        content: draftData.content,
      };

      const res = await fetch("/api/research/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Autosave failed");
      if (selectedSlugRef.current !== originalSlug) return;
      if (res.ok) {
        const data = await res.json();
        if (data.slug) {
          updateSelectedSlug(data.slug);
          setSlug(data.slug);
        }
        setAutoSaveStatus("Auto-saved to disk");
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    } catch {
      setAutoSaveStatus("Saved to localStorage");
    }
  }, [computeSlug, updateSelectedSlug]);

  // Load entries from server API
  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/research/entries");
      if (!res.ok) {
        if (res.status === 403) {
          setError("Local editor is only available in development mode.");
          return;
        }
        throw new Error("Failed to load entries");
      }
      const data = await res.json();
      const loadedEntries: ResearchEntry[] = data.entries || [];
      setEntries(loadedEntries);

      // Check if there is an unsaved draft in localStorage
      const savedDraftRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedDraftRaw && !hasRestoredDraft.current) {
        try {
          const draft = JSON.parse(savedDraftRaw);
          if (draft.title || draft.content) {
            setSlug(draft.slug || "");
            setTitle(draft.title || "Restored Unsaved Draft");
            setProject(draft.project || "failure-recovery-benchmark");
            setTagsInput(draft.tagsInput || "research-notes");
            setStatus(draft.status || "draft");
            setSummary(draft.summary || "");
            setContent(draft.content || "");
            setNotes(Array.isArray(draft.notes) ? draft.notes : []);
            skipAutosaveRef.current = false;
            updateSelectedSlug(draft.slug || null);
            hasRestoredDraft.current = true;
            setMessage("Restored unsaved draft from local storage.");
            setLoading(false);
            return;
          }
        } catch {}
      }

      if (loadedEntries.length > 0 && !selectedSlugRef.current && !hasRestoredDraft.current) {
        loadEntryIntoForm(loadedEntries[0]);
      } else if (loadedEntries.length === 0 && !hasRestoredDraft.current) {
        handleNewEntry();
      }
      hasRestoredDraft.current = true;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [handleNewEntry, loadEntryIntoForm, updateSelectedSlug]);

  useEffect(() => {
    fetch("/api/editor-auth")
      .then((res) => res.json())
      .then((data) => setAuthed(data.unlocked === true))
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (authed === true) {
      fetchEntries();
    }
  }, [authed, fetchEntries]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/editor-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthed(true);
        setPasswordInput("");
      } else {
        setAuthError(data.error || "Authentication failed");
      }
    } catch {
      setAuthError("Network error");
    } finally {
      setAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/editor-auth", { method: "DELETE" });
    setAuthed(false);
  };

  // Save current form state to localStorage automatically on edit
  useEffect(() => {
    if (authed !== true || loading) return;
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }

    if (!title.trim() && !content.trim()) {
      return;
    }

    const currentDraft = {
      slug: selectedSlugRef.current || "",
      title,
      project,
      tagsInput,
      status,
      summary,
      content,
      notes,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDraft));
    setAutoSaveStatus("Unsaved changes");

    // Debounced auto-save to disk after 2.5 seconds of idle typing
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      if (title.trim()) {
        autoSaveToDisk(currentDraft);
      }
    }, 2500);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [authed, loading, title, project, tagsInput, status, summary, content, notes, autoSaveToDisk]);

  // Handle Tab close / refresh warning
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (title.trim() || content.trim()) {
        const draft = {
          slug: selectedSlugRef.current || "",
          title,
          project,
          tagsInput,
          status,
          summary,
          content,
          notes,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [title, project, tagsInput, status, summary, content, notes]);

  const handleSave = async () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (!title.trim()) {
      showAlert("Title Required", "Please enter a title before saving.");
      return;
    }

    try {
      setSaving(true);
      setMessage(null);

      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const targetSlug = computeSlug(title);

      const payload = {
        slug: targetSlug,
        title,
        project,
        tags: parsedTags,
        notes,
        status,
        summary,
        content,
      };

      const res = await fetch("/api/research/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save entry");

      const data = await res.json();
      setMessage(`Entry saved successfully to research/entries/${data.slug}.md!`);
      setAutoSaveStatus("Saved to disk");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      updateSelectedSlug(data.slug);
      setSlug(data.slug);
      await fetchEntries();
    } catch (err: any) {
      showAlert("Save Failed", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSlug) return;
    showConfirm(
      "Delete Entry",
      `Are you sure you want to delete research/entries/${selectedSlug}.md? This cannot be undone.`,
      async () => {
        try {
          const res = await fetch(`/api/research/entries?slug=${selectedSlug}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete file");

          setMessage(`Deleted entry ${selectedSlug}.md`);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          setSelectedSlug(null);
          await fetchEntries();
          handleNewEntry();
        } catch (err: any) {
          showAlert("Delete Failed", err.message);
        }
      },
      "Delete",
      true
    );
  };

  const handlePublish = async () => {
    if (!selectedSlug) {
      showAlert("No Entry Selected", "Select an entry to publish first.");
      return;
    }
    showConfirm(
      "Publish to Live Site",
      `Publish "${title}"? This will set status to "published", git commit, and push — Vercel redeploys automatically.`,
      async () => {
        try {
          if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
          setPublishing(true);
          setMessage(null);

          const saveRes = await fetch("/api/research/entries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: selectedSlug, title, project, tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean), notes, status, summary, content }),
          });
          if (!saveRes.ok) throw new Error("Failed to save before publishing");

          const pubRes = await fetch("/api/research/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slug: selectedSlug }),
          });
          const pubData = await pubRes.json();
          if (!pubRes.ok) throw new Error(pubData.error || "Publishing failed");

          if (pubData.warning) {
            showAlert("Push Warning", `Published locally but push failed: ${pubData.detail || pubData.warning}`);
          } else if (pubData.error) {
            throw new Error(pubData.error);
          } else {
            setMessage(pubData.message || `Published "${selectedSlug}" and pushed to git.`);
            setStatus("published");
          }
          await fetchEntries();
        } catch (err: any) {
          showAlert("Publish Failed", err.message);
        } finally {
          setPublishing(false);
        }
      },
      "Publish",
      false
    );
  };

  const addNote = () => setNotes([...notes, ""]);

  const updateNote = (i: number, value: string) =>
    setNotes(notes.map((n, idx) => (idx === i ? value : n)));

  const removeNote = (i: number) => setNotes(notes.filter((_, idx) => idx !== i));

  const saveNotes = async () => {
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    if (!selectedSlug || !title.trim()) return;
    try {
      const parsedTags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const response = await fetch("/api/research/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: selectedSlug, title, project, tags: parsedTags, notes: notes.filter((n) => n.trim()), status, summary, content }),
      });
      if (!response.ok) throw new Error("Unable to save notes");
      setMessage(`Notes saved for "${selectedSlug}".`);
      await fetchEntries();
    } catch (err: any) {
      showAlert("Notes Save Failed", err.message);
    }
  };

  // Derive unique projects & tags for filter dropdowns
  const uniqueProjects = Array.from(new Set(entries.map((e) => e.project).filter(Boolean)));
  const uniqueTags = Array.from(
    new Set(entries.flatMap((e) => (Array.isArray(e.tags) ? e.tags : [])))
  );

  const filteredEntries = entries.filter((entry) => {
    if (statusFilter !== "all" && entry.status !== statusFilter) return false;
    if (projectFilter !== "all" && entry.project !== projectFilter) return false;
    if (tagFilter !== "all" && (!entry.tags || !entry.tags.includes(tagFilter))) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = entry.title.toLowerCase().includes(q);
      const matchSummary = entry.summary.toLowerCase().includes(q);
      if (!matchTitle && !matchSummary) return false;
    }
    return true;
  });

  if (authed === null) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-6 text-center">
        <div className="rounded-2xl border bg-card p-8 space-y-4 shadow-sm">
          <RefreshCw className="size-8 text-muted-foreground mx-auto animate-spin" />
          <p className="text-sm text-muted-foreground">Checking editor access…</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="max-w-md mx-auto py-24 px-6">
        <form
          onSubmit={handleAuth}
          className="rounded-2xl border bg-card p-8 space-y-6 shadow-sm"
        >
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Lock className="size-6" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Editor Locked</h1>
            <p className="text-sm text-muted-foreground">
              Enter the editor password to manage and publish research logs.
            </p>
          </div>

          <div className="space-y-2">
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Editor password"
              autoFocus
              className="w-full text-sm px-4 py-2.5 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
            {authError && (
              <p className="text-xs text-red-500 flex items-center gap-1.5">
                <AlertCircle className="size-3.5" />
                {authError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={authenticating || !passwordInput.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {authenticating ? (
              <>
                <RefreshCw className="size-4 animate-spin" />
                <span>Unlocking…</span>
              </>
            ) : (
              <>
                <Lock className="size-4" />
                <span>Unlock Editor</span>
              </>
            )}
          </button>

          <Link
            href="/research"
            className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Research Log
          </Link>
        </form>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-6 text-center">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 space-y-4">
          <AlertCircle className="size-10 text-red-500 mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Local Development Mode Only</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Link
            href="/research"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground"
          >
            Go to Public Research Log
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      <BlurFade delay={0.02}>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/research"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 border rounded-md px-2.5 py-1 bg-card"
              >
                <ChevronLeft className="size-3.5" />
                View Public Research Log
              </Link>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Sparkles className="size-3" />
                Local Dev Editor (Localhost Only)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground px-2 py-0.5 rounded-md border bg-muted/40 font-mono">
                <Check className="size-3 text-emerald-500" />
                {autoSaveStatus}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Research Log Editor
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleNewEntry}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border border-border bg-background hover:bg-muted transition-colors"
            >
              <Plus className="size-4" />
              <span>New Entry</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="size-4" />
              <span>{saving ? "Saving..." : "Save Entry"}</span>
            </button>
            <button
              onClick={handlePublish}
              disabled={publishing || !selectedSlug}
              title={selectedSlug ? "Publish to live site (git commit + push)" : "Select an entry to publish"}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
            >
              <Rocket className="size-4" />
              <span>{publishing ? "Publishing..." : "Publish"}</span>
            </button>
            {selectedSlug && (
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
              >
                <Trash2 className="size-4" />
              </button>
            )}
            <button
              onClick={handleLogout}
              title="Lock editor"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-border bg-background hover:bg-muted transition-colors"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="size-4" />
            <span>{message}</span>
          </div>
        )}

        {/* Main Grid: Sidebar List + Editor & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar List (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border bg-card p-4 space-y-3 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                <span>Filter & Search</span>
                <span className="text-[10px] text-muted-foreground">{filteredEntries.length} Entries</span>
              </div>

              <input
                type="text"
                placeholder="Search entries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] font-medium text-muted-foreground mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-md border bg-background text-xs"
                  >
                    <option value="all">All Statuses</option>
                    <option value="draft">Drafts</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-muted-foreground mb-1">Project</label>
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-md border bg-background text-xs"
                  >
                    <option value="all">All Projects</option>
                    {uniqueProjects.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Entry Cards List */}
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {filteredEntries.map((entry) => {
                const isSelected = selectedSlug === entry.slug;
                return (
                  <button
                    key={entry.slug}
                    onClick={() => loadEntryIntoForm(entry)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "bg-card hover:bg-muted/60 border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          entry.status === "published"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {entry.status === "published" ? (
                          <CheckCircle2 className="size-2.5" />
                        ) : (
                          <Clock className="size-2.5" />
                        )}
                        <span className="capitalize">{entry.status}</span>
                      </span>

                      <span className="text-[10px] text-muted-foreground truncate">
                        {entry.createdAt.split("T")[0]}
                      </span>
                    </div>

                    <h4 className="font-semibold text-foreground line-clamp-1">{entry.title}</h4>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground truncate">
                      <span className="flex items-center gap-1">
                        <FolderGit2 className="size-3 text-muted-foreground" />
                        <span className="truncate">{entry.project}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form & Live Markdown Preview (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Metadata Fields */}
            <div className="rounded-2xl border bg-card p-5 space-y-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Entry Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Failure Recovery Latency Benchmark"
                    className="w-full text-sm px-3.5 py-2 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Project Field
                  </label>
                  <input
                    type="text"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    placeholder="e.g. failure-recovery-benchmark"
                    className="w-full text-sm px-3.5 py-2 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. research-notes, experiment-log, finding"
                    className="w-full text-xs px-3.5 py-2 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Publish Status
                  </label>
                  <div className="flex items-center gap-3 pt-1">
                    <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={status === "draft"}
                        onChange={() => setStatus("draft")}
                        className="accent-amber-500"
                      />
                      <span>Draft (Local Only)</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="published"
                        checked={status === "published"}
                        onChange={() => setStatus("published")}
                        className="accent-emerald-500"
                      />
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Published (Live on Web)
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief 1-2 sentence overview of this research log..."
                  className="w-full text-xs px-3.5 py-2 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Markdown Body & Live Preview Card */}
            <div
              className={`border bg-card p-5 space-y-4 shadow-sm transition-all ${
                isMaximized
                  ? "fixed inset-0 z-[9999] w-screen h-screen bg-background border-none p-6 shadow-2xl flex flex-col overflow-hidden"
                  : "rounded-2xl"
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 shrink-0">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <FileEdit className="size-4 text-primary" />
                  <span>Markdown Entry Content</span>
                  {isMaximized && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      True Fullscreen Mode
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground font-mono ml-2 hidden sm:inline">
                    ({autoSaveStatus})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline text-[10px] text-muted-foreground">
                    Markdown & GFM Supported
                  </span>

                  {isMaximized && (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <Save className="size-3.5" />
                      <span>{saving ? "Saving..." : "Save Entry"}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setIsMaximized(!isMaximized)}
                    title={isMaximized ? "Exit Fullscreen (Minimize)" : "Maximize Fullscreen Editor"}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted text-foreground transition-colors shadow-sm"
                  >
                    {isMaximized ? (
                      <>
                        <Minimize2 className="size-3.5" />
                        <span className="hidden sm:inline">Minimize</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="size-3.5 text-primary" />
                        <span className="hidden sm:inline">Maximize</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                  isMaximized ? "flex-1 min-h-0 h-full" : ""
                }`}
              >
                {/* Editor Column */}
                <div className={`space-y-1 flex flex-col ${isMaximized ? "h-full min-h-0" : ""}`}>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block shrink-0">
                    Editor (Input)
                  </span>
                  <textarea
                    rows={isMaximized ? undefined : 18}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Document your research..."
                    className={`w-full text-xs font-mono p-4 rounded-xl border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed ${
                      isMaximized ? "flex-1 h-full min-h-0 resize-none" : ""
                    }`}
                  />
                </div>

                {/* Live Preview Column */}
                <div className={`space-y-1 flex flex-col ${isMaximized ? "h-full min-h-0" : ""}`}>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider block flex items-center gap-1 shrink-0">
                    <Eye className="size-3 text-muted-foreground" /> Live Preview
                  </span>
                  <div
                    className={`w-full p-4 rounded-xl border bg-background prose prose-neutral dark:prose-invert max-w-none text-xs leading-relaxed overflow-y-auto ${
                      isMaximized ? "flex-1 h-full min-h-0" : "h-[375px]"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content || "*No content entered yet...*"}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Editor Section */}
            {!isMaximized && (
              <div className="rounded-2xl border bg-card p-5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <NotebookPen className="size-4 text-primary" />
                    <span>Notes for this Entry</span>
                    {notes.length > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {notes.length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={addNote}
                      disabled={!selectedSlug}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-border bg-background hover:bg-muted transition-colors disabled:opacity-50"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Note</span>
                    </button>
                    {notes.length > 0 && (
                      <button
                        onClick={saveNotes}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        <Save className="size-3.5" />
                        <span>Save Notes</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {notes.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-6">
                      No notes for this entry yet. Click &ldquo;Add Note&rdquo; to create one.
                    </p>
                  ) : (
                    notes.map((note, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground mt-3 shrink-0 w-6">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <textarea
                          value={note}
                          onChange={(e) => updateNote(i, e.target.value)}
                          placeholder="Write a note for this research log... (markdown supported)"
                          rows={3}
                          className="flex-1 text-xs p-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                        />
                        <button
                          onClick={() => removeNote(i)}
                          className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors shrink-0 mt-1"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </BlurFade>

      <Dialog
        open={modal.open}
        onOpenChange={(open) => setModal((m) => ({ ...m, open }))}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {modal.destructive ? (
                <AlertCircle className="size-5 text-red-500" />
              ) : modal.type === "confirm" ? (
                <Rocket className="size-5 text-emerald-500" />
              ) : (
                <AlertCircle className="size-5 text-amber-500" />
              )}
              {modal.title}
            </DialogTitle>
            <DialogDescription className="whitespace-pre-line">
              {modal.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            {modal.type === "confirm" && (
              <Button
                variant="outline"
                onClick={() => setModal((m) => ({ ...m, open: false }))}
              >
                Cancel
              </Button>
            )}
            <Button
              variant={modal.destructive ? "destructive" : "default"}
              onClick={() => {
                const cb = modal.onConfirm;
                setModal((m) => ({ ...m, open: false }));
                if (cb) cb();
              }}
            >
              {modal.type === "confirm" ? modal.confirmLabel || "Confirm" : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
