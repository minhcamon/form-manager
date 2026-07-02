import React from "react";
import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const FormHeaderCard = ({
  title,
  setTitle,
  description,
  setDescription,
  status,
  setStatus,
  allowMultipleSubmission,
  setAllowMultipleSubmission,
  startAt,
  setStartAt,
  endAt,
  setEndAt,
  readOnly = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Title & Description Card */}
      <Card className="rounded-2xl border border-border border-t-8 border-t-primary bg-card p-6 space-y-4 shadow-sm">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề biểu mẫu"
          disabled={readOnly}
          className={`w-full text-2xl font-bold text-foreground bg-transparent border-b border-transparent ${!readOnly ? "hover:border-border/60 focus:border-primary" : ""} pb-1 outline-none transition-all font-heading`}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Mô tả biểu mẫu (không bắt buộc)"
          rows={2}
          disabled={readOnly}
          className={`w-full text-sm text-muted-foreground bg-transparent border-b border-transparent ${!readOnly ? "hover:border-border/60 focus:border-primary" : ""} pb-1 outline-none resize-none transition-all min-h-[40px]`}
        />
      </Card>

      {/* Settings Card */}
      <Card className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <button className="flex w-full items-center justify-between px-6 py-3.5 hover:bg-muted/30 text-xs font-semibold text-muted-foreground cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="font-heading">Thiết lập biểu mẫu nâng cao</span>
              </div>
              <span className="text-primary font-medium">{readOnly ? "Xem" : "Thay đổi"}</span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t border-border p-6 bg-muted/5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground uppercase">Trạng thái biểu mẫu</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={readOnly}
                  className="flex w-full h-9 items-center justify-between rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="DRAFT">Bản nháp (Draft)</option>
                  <option value="PUBLISHED">Công khai (Published)</option>
                </select>
              </div>
              <div className="flex items-center gap-2.5 pt-4">
                <input
                  id="header-allow-mult"
                  type="checkbox"
                  checked={allowMultipleSubmission}
                  onChange={(e) => setAllowMultipleSubmission(e.target.checked)}
                  disabled={readOnly}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
                />
                <label htmlFor="header-allow-mult" className="text-xs font-bold text-foreground cursor-pointer select-none">
                  Nộp câu trả lời nhiều lần
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground uppercase">Thời gian bắt đầu</label>
                <input
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  disabled={readOnly}
                  className="flex w-full h-9 items-center justify-between rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-foreground uppercase">Thời gian kết thúc</label>
                <input
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  disabled={readOnly}
                  className="flex w-full h-9 items-center justify-between rounded-lg border border-input bg-background px-3 py-1 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default FormHeaderCard;
