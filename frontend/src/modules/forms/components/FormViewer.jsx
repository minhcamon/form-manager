import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useFormViewer } from "../hooks/useFormViewer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const FormViewer = ({ formId, title, description, fields, readOnly = false, hideNavigation = false }) => {
  const navigate = useNavigate();
  const {
    answers,
    isSubmitting,
    handleAnswerChange,
    handleSubmitResponse
  } = useFormViewer(formId);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmitResponse(fields, () => navigate("/"));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn pb-24">
      {/* Navigation */}
      {!hideNavigation && (
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
            {readOnly ? "Xem trước biểu mẫu" : "Điền biểu mẫu"}
          </span>
        </div>
      )}

      {/* Title Card */}
      <Card className="rounded-2xl border border-border border-t-8 border-t-primary bg-card p-6 space-y-3 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground font-heading">{title || "Biểu mẫu không có tiêu đề"}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </Card>

      {/* Dynamic Fields */}
      <form onSubmit={onSubmit} className="space-y-4">
        {fields.map((field) => {
          let options = [];
          try {
            options = JSON.parse(field.optionsJson || "[]");
          } catch (e) { }

          return (
            <Card key={field.id || field.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-1">
                <label className="text-sm font-semibold text-foreground font-heading">
                  {field.label}
                </label>
                {field.required && <span className="text-red-500 text-sm font-bold">*</span>}
              </div>

              <div className="pt-1">
                {/* TEXT */}
                {field.type === "TEXT" && (
                  <Input
                    type="text"
                    placeholder={field.placeholder || "Câu trả lời của bạn"}
                    value={answers[field.name] || ""}
                    onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                    className="h-10 rounded-xl"
                  />
                )}

                {/* NUMBER */}
                {field.type === "NUMBER" && (
                  <Input
                    type="number"
                    placeholder={field.placeholder || "Nhập số..."}
                    value={answers[field.name] || ""}
                    onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                    className="h-10 rounded-xl"
                  />
                )}

                {/* DATE */}
                {field.type === "DATE" && (
                  <Input
                    type="date"
                    value={answers[field.name] || ""}
                    onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                    readOnly={readOnly}
                    disabled={readOnly}
                    className="h-10 rounded-xl"
                  />
                )}

                {/* COLOR */}
                {field.type === "COLOR" && (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={answers[field.name] || "#3b82f6"}
                      onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                      disabled={readOnly}
                      className="h-10 w-16 cursor-pointer rounded-xl border border-border bg-background p-1 disabled:opacity-60"
                    />
                    <Input
                      type="text"
                      placeholder="#3b82f6"
                      value={answers[field.name] || ""}
                      onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                      readOnly={readOnly}
                      disabled={readOnly}
                      className="h-10 rounded-xl max-w-[120px] font-mono text-center"
                    />
                  </div>
                )}

                {/* SELECT */}
                {field.type === "SELECT" && (
                  <select
                    value={answers[field.name] || ""}
                    onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                    disabled={readOnly}
                    className="flex w-full h-10 items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer disabled:opacity-60"
                  >
                    <option value="">Chọn một tùy chọn</option>
                    {options.map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}
              </div>
            </Card>
          );
        })}

        {!readOnly && (
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
              className="rounded-xl cursor-pointer text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-xl px-5 cursor-pointer font-semibold shadow-sm text-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Gửi câu trả lời</span>
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormViewer;
