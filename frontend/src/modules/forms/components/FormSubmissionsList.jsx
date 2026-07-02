import React from "react";
import { Loader2, ClipboardList, CheckCircle2, User, Calendar, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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

export const FormSubmissionsList = ({ submissions = [], loading = false, fields = [] }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] space-y-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Đang tải lịch sử câu trả lời...</p>
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card className="rounded-2xl border border-border p-12 text-center bg-card shadow-sm">
        <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
        <h3 className="text-sm font-bold text-foreground font-heading mb-1">
          Chưa có câu trả lời nào
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Khi người dùng nộp câu trả lời, thông tin chi tiết sẽ xuất hiện tại đây.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
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
                  Mã lượt nộp: #{sub.id}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="w-fit h-6 gap-1 bg-green-50 text-green-700 border-green-200/50 rounded-lg px-2 text-[10px]"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>{sub.status === "SUBMITTED" ? "Đã nộp" : (sub.status || "Đã nộp")}</span>
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

            {/* Collapsible dropdown answers */}
            <Collapsible className="border-t border-border pt-3 group">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer">
                  <span>Xem chi tiết câu trả lời</span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 animate-fadeIn">
                <div className="rounded-xl border border-border/80 bg-zinc-50/20 p-4 space-y-3.5">
                  {fields.length > 0 ? (
                    fields.map((field) => {
                      const valObj = sub.values?.find(
                        (v) => v.fieldId === field.id || v.fieldName === field.name
                      );
                      const valStr = valObj ? valObj.value : "";
                      const isColor = field.type === "COLOR";

                      return (
                        <div key={field.id || field.name} className="space-y-1">
                          <p className="text-[10px] font-bold text-foreground/75 uppercase tracking-wider">
                            {field.label}
                          </p>
                          {isColor && valStr ? (
                            <div className="flex items-center gap-2 pl-1 pt-0.5">
                              <div
                                className="h-4 w-4 rounded-full border border-border shrink-0"
                                style={{ backgroundColor: valStr }}
                              />
                              <span className="text-xs font-mono text-foreground/80">{valStr}</span>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground leading-relaxed pl-1">
                              {renderAnswerValue(valStr) || (
                                <span className="italic text-muted-foreground/40">(Không có câu trả lời)</span>
                              )}
                            </p>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-muted-foreground italic text-center py-2">
                      Không chứa thông tin câu trả lời nào.
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FormSubmissionsList;
