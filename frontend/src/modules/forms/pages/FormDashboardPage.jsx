import React from "react";
import { Plus, ClipboardList, Calendar, User, ArrowRight, CheckCircle2, FileText, Globe2 } from "lucide-react";
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

  const handleTabChange = (value) => {
    if (value === "submissions") {
      fetchSubmissions();
    }
  };

  const renderAnswerValue = (valStr) => {
    try {
      const parsed = JSON.parse(valStr);
      if (Array.isArray(parsed)) return parsed.join(", ");
      if (typeof parsed === "boolean") return parsed ? "Có / Đúng" : "Không / Sai";
      return String(parsed);
    } catch (e) {
      return valStr;
    }
  };

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
    const publishedForms = forms.filter((f) => f.status === "PUBLISHED");
    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl font-heading">
            Biểu mẫu đang mở
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Chọn một biểu mẫu bên dưới để điền thông tin và gửi câu trả lời.
          </p>
        </div>

        {/* Published forms grid */}
        {loading ? (
          <FormListSkeleton count={3} />
        ) : publishedForms.length === 0 ? (
          <Card className="rounded-2xl border border-border p-14 text-center bg-card shadow-sm">
            <Globe2 className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <h3 className="text-sm font-bold text-foreground font-heading mb-1">
              Chưa có biểu mẫu nào được công khai
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Hiện tại chưa có biểu mẫu nào đang mở. Vui lòng quay lại sau.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publishedForms.map((form) => (
              <Card
                key={form.id}
                className="group relative flex flex-col justify-between border border-border bg-card hover:bg-zinc-50/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/forms/preview/${form.id}`)}
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
                    onClick={(e) => { e.stopPropagation(); navigate(`/forms/preview/${form.id}`); }}
                  >
                    Điền ngay
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
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

      {/* Tabs */}
      <Tabs defaultValue="forms" onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 rounded-xl mb-6">
          <TabsTrigger value="forms" className="text-xs cursor-pointer">
            Biểu mẫu ({forms.length})
          </TabsTrigger>
          <TabsTrigger value="submissions" className="text-xs cursor-pointer">
            Lịch sử câu trả lời
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Forms management */}
        <TabsContent value="forms" className="space-y-6">
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
        </TabsContent>

        {/* Tab 2: Submissions history */}
        <TabsContent value="submissions" className="space-y-4">
          {submissionsLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[250px] space-y-3">
              <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              <p className="text-xs text-muted-foreground">Đang tải lịch sử câu trả lời...</p>
            </div>
          ) : submissions.length === 0 ? (
            <Card className="rounded-2xl border border-border p-12 text-center bg-card shadow-sm">
              <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <h3 className="text-sm font-bold text-foreground font-heading mb-1">
                Chưa có câu trả lời nào
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Khi người dùng nộp câu trả lời, thông tin chi tiết sẽ xuất hiện tại đây.
              </p>
            </Card>
          ) : (
            <div className="space-y-4 max-w-3xl">
              {submissions.map((sub) => (
                <Card
                  key={sub.id}
                  className="rounded-2xl border border-border bg-card shadow-sm hover:border-zinc-300 transition-all overflow-hidden"
                >
                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                          Form ID: #{sub.formId}
                        </span>
                        <h4 className="text-sm font-bold text-foreground font-heading">
                          {sub.formTitle || "Biểu mẫu không có tiêu đề"}
                        </h4>
                      </div>
                      <Badge
                        variant="secondary"
                        className="w-fit h-6 gap-1 bg-green-50 text-green-700 border-green-200/50 rounded-lg px-2 text-[10px]"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{sub.status || "SUBMITTED"}</span>
                      </Badge>
                    </div>

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                      <div className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" />
                        <span>
                          {sub.submittedByFullname || sub.submittedByEmail
                            ? `${sub.submittedByFullname || ""} (${sub.submittedByEmail || ""})`
                            : "Người dùng ẩn danh"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Nộp lúc: {formatDate(sub.submittedAt)}</span>
                      </div>
                    </div>

                    {/* Collapsible answers */}
                    <Collapsible className="border-t border-border pt-3">
                      <CollapsibleTrigger asChild>
                        <button className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer">
                          <span>Xem chi tiết câu trả lời</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-3 animate-fadeIn">
                        <div className="rounded-xl border border-border/80 bg-zinc-50/20 p-4 space-y-3.5">
                          {sub.values && sub.values.length > 0 ? (
                            sub.values.map((val) => (
                              <div key={val.id} className="space-y-1">
                                <p className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">
                                  {val.fieldLabel || val.fieldName}
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                                  {renderAnswerValue(val.value) || (
                                    <span className="italic text-muted-foreground/40">(Không có câu trả lời)</span>
                                  )}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground italic text-center py-2">
                              Không chứa câu trả lời nào.
                            </p>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormDashboardPage;
