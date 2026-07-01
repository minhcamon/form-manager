import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { useFormViewer } from "../hooks/useFormViewer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const FormViewer = ({ title, description, fields, readOnly = false }) => {
  const navigate = useNavigate();
  const {
    answers,
    handleAnswerChange,
    handleCheckboxChange,
    handleSubmitResponse
  } = useFormViewer();

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmitResponse(fields, () => navigate("/"));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn pb-24">
      {/* Navigation */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <Link
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
          Xem trước biểu mẫu
        </span>
      </div>

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
          } catch (e) {}

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

                {/* TEXTAREA */}
                {field.type === "TEXTAREA" && (
                  <textarea
                    placeholder={field.placeholder || "Câu trả lời của bạn"}
                    value={answers[field.name] || ""}
                    onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                    rows={3}
                    readOnly={readOnly}
                    disabled={readOnly}
                    className="block w-full rounded-xl border border-input bg-background py-2 px-3 text-sm text-foreground shadow-sm outline-none placeholder-muted-foreground/50 focus:ring-1 focus:ring-primary/20 focus:border-primary min-h-[80px] disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                )}

                {/* NUMBER */}
                {field.type === "NUMBER" && (
                  <Input
                    type="number"
                    placeholder={field.placeholder || "Nhập số..."}
                    value={answers[field.name] || ""}
                    onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                    className="h-10 rounded-xl"
                  />
                )}

                {/* EMAIL */}
                {field.type === "EMAIL" && (
                  <Input
                    type="email"
                    placeholder={field.placeholder || "name@example.com"}
                    value={answers[field.name] || ""}
                    onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                    className="h-10 rounded-xl"
                  />
                )}

                {/* PHONE */}
                {field.type === "PHONE" && (
                  <Input
                    type="tel"
                    placeholder={field.placeholder || "Nhập số điện thoại..."}
                    value={answers[field.name] || ""}
                    onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                    className="h-10 rounded-xl"
                  />
                )}

                {/* DATE */}
                {field.type === "DATE" && (
                  <Input
                    type="date"
                    value={answers[field.name] || ""}
                    onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                    className="h-10 rounded-xl"
                  />
                )}

                {/* BOOLEAN */}
                {field.type === "BOOLEAN" && (
                  <div className="flex items-center gap-2.5">
                    <input
                      id={field.name}
                      type="checkbox"
                      checked={!!answers[field.name]}
                      onChange={(e) => handleAnswerChange(field.name, e.target.checked)}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor={field.name} className="text-xs font-semibold text-foreground cursor-pointer select-none">
                      Đồng ý / Xác nhận
                    </label>
                  </div>
                )}

                {/* SELECT */}
                {field.type === "SELECT" && (
                  <select
                    value={answers[field.name] || ""}
                    onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                    className="flex w-full h-10 items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="">Chọn một tùy chọn</option>
                    {options.map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {/* RADIO */}
                {field.type === "RADIO" && (
                  <div className="space-y-2">
                    {options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name={field.name}
                          id={`${field.name}-${oIdx}`}
                          value={opt}
                          checked={answers[field.name] === opt}
                          onChange={(e) => handleAnswerChange(field.name, e.target.value)}
                          className="h-4 w-4 border-input text-primary focus:ring-primary cursor-pointer"
                        />
                        <label htmlFor={`${field.name}-${oIdx}`} className="text-xs font-medium text-foreground cursor-pointer select-none">
                          {opt}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* CHECKBOX */}
                {field.type === "CHECKBOX" && (
                  <div className="space-y-2">
                    {options.map((opt, oIdx) => {
                      const isChecked = (answers[field.name] || []).includes(opt);
                      return (
                          <div key={oIdx} className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              id={`${field.name}-${oIdx}`}
                              checked={isChecked}
                              onChange={(e) => handleCheckboxChange(field.name, opt, e.target.checked)}
                              className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                            />
                            <label htmlFor={`${field.name}-${oIdx}`} className="text-xs font-medium text-foreground cursor-pointer select-none">
                              {opt}
                            </label>
                          </div>
                      );
                    })}
                  </div>
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
              className="h-10 rounded-xl px-5 cursor-pointer font-semibold shadow-sm text-xs"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Gửi câu trả lời</span>
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};

export default FormViewer;
