import React, { useEffect } from "react";
import { Plus, ClipboardList, Calendar, User, ArrowRight, CheckCircle2, FileText, Globe2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFormDashboard } from "../hooks/useFormDashboard";
import { useAuth } from "../../../contexts/AuthContext";
import FormCard from "../components/FormCard";
import FormListSkeleton from "../components/FormListSkeleton";
import EmptyFormState from "../components/EmptyFormState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const FormDashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const {
    forms,
    loading,
    submissions,
    submissionsLoading,
    handleCreate,
    handlePreview,
    handleEdit,
    handleDelete,
    handlePublish,
    fetchSubmissions,
  } = useFormDashboard();

  // Load submissions for non-admin users to filter out already submitted forms
  useEffect(() => {
    if (!isAdmin) {
      fetchSubmissions();
    }
  }, [isAdmin]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ── USER DASHBOARD ──────────────────────────────────────────────
  if (!isAdmin) {
    const submittedFormIds = submissions.map((sub) => sub.formId);
    const publishedForms = forms.filter(
      (f) => f.status === "PUBLISHED" && !submittedFormIds.includes(f.id)
    );

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl font-heading">
            Form của bạn
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Quản lý các form hiện tại và lịch sử gửi.
          </p>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 rounded-xl mb-6">
            <TabsTrigger value="available" className="text-xs cursor-pointer flex items-center gap-1.5">
              <FileText className="h-4 w-4" />
              <span>Biểu mẫu đang mở</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs cursor-pointer flex items-center gap-1.5">
              <ClipboardList className="h-4 w-4" />
              <span>Lịch sử gửi ({submissions.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            {/* Published forms grid */}
            {loading ? (
              <FormListSkeleton count={3} />
            ) : publishedForms.length === 0 ? (
              <Card className="rounded-2xl border border-border p-14 text-center bg-card shadow-sm">
                <Globe2 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <h3 className="text-sm font-bold text-foreground font-heading mb-1">
                  Chưa có biểu mẫu mới nào
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Bạn đã hoàn thành tất cả biểu mẫu đang mở hoặc chưa có biểu mẫu mới nào được công khai.
                </p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {publishedForms.map((form) => (
                  <Card
                    key={form.id}
                    className="group relative flex flex-col justify-between border border-border bg-card hover:bg-zinc-50/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/forms/view/${form.id}`)}
                  >
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200/60 px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Đang mở
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-foreground font-heading group-hover:text-primary transition-colors line-clamp-2">
                        {form.title || "Biểu mẫu không có tiêu đề"}
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {form.description || "Không có mô tả."}
                      </p>
                    </div>
                    <div className="border-t border-border px-6 py-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {form.fields?.length || 0} câu hỏi
                      </span>
                      <Button
                        size="sm"
                        className="h-8 rounded-xl px-4 text-xs font-semibold cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); navigate(`/forms/view/${form.id}`); }}
                      >
                        Điền ngay
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            {submissionsLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] space-y-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Đang tải lịch sử đăng ký...</p>
              </div>
            ) : submissions.length === 0 ? (
              <Card className="rounded-2xl border border-border p-14 text-center bg-card shadow-sm">
                <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
                <h3 className="text-sm font-bold text-foreground font-heading mb-1">
                  Chưa điền biểu mẫu nào
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Lịch sử đăng ký và các biểu mẫu bạn đã nộp sẽ xuất hiện tại đây.
                </p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {submissions.map((sub) => (
                  <Card
                    key={sub.id}
                    className="group relative flex flex-col justify-between border border-border bg-card hover:bg-zinc-50/10 hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden"
                  >
                    <div className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200/60 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Đã nộp
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          #{sub.id}
                        </span>
                      </div>
                      <h2 className="text-base font-bold text-foreground font-heading line-clamp-2">
                        {sub.formTitle || "Biểu mẫu đã điền"}
                      </h2>
                      <div className="flex flex-col gap-1.5 text-xs text-muted-foreground border-t border-border pt-3 mt-2">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Thời gian nộp: {formatDate(sub.submittedAt)}</span>
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ─────────────────────────────────────────────
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl font-heading">
            Quản lý Biểu mẫu
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Quản lý, thiết kế biểu mẫu và theo dõi câu trả lời của người dùng.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="h-10 rounded-xl px-4 text-sm font-semibold cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo Form mới</span>
        </Button>
      </div>

      {loading ? (
        <FormListSkeleton count={3} />
      ) : forms.length === 0 ? (
        <EmptyFormState onCreate={handleCreate} />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <FormCard
              key={form.id}
              form={form}
              onPreview={handlePreview}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPublish={handlePublish}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FormDashboardPage;
