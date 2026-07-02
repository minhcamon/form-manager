import React from "react";
import { 
  ArrowUp, ArrowDown, Trash2, Copy, Circle, Square, 
  List, CalendarDays, AlignLeft, Type, Hash, Phone, ToggleLeft, Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const FormBuilderFieldCard = ({
  field,
  index,
  isActive,
  onFocus,
  onUpdate,
  onSave,
  onDuplicate,
  onDelete,
  readOnly = false,
}) => {
  const isChoiceType = field.type === "SELECT";

  // Parse option JSON safely
  const getOptions = () => {
    try {
      const parsed = JSON.parse(field.optionsJson || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  };

  const options = getOptions();

  // Helper to render type icons
  const getTypeIcon = (type) => {
    switch (type) {
      case "TEXT": return <Type className="h-4 w-4 text-muted-foreground" />;
      case "NUMBER": return <Hash className="h-4 w-4 text-muted-foreground" />;
      case "DATE": return <CalendarDays className="h-4 w-4 text-muted-foreground" />;
      case "COLOR": return <span className="h-3 w-3 rounded-full border border-border inline-block bg-primary/20 shrink-0" />;
      case "SELECT": return <List className="h-4 w-4 text-muted-foreground" />;
      default: return <Type className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div
      onClick={() => !readOnly && !isActive && onFocus()}
      className={`group relative rounded-2xl border transition-all duration-200 bg-card overflow-hidden ${
        !readOnly && isActive 
          ? "border-l-4 border-l-primary border-border shadow-md" 
          : "border-border hover:border-zinc-300 shadow-sm cursor-pointer"
      }`}
    >
      {/* 1. EDIT MODE */}
      {!readOnly && isActive ? (
        <div className="p-6 space-y-4">
          {/* Label Input & Select Type */}
          <div className="flex gap-4 items-start">
            <div className="flex-1 space-y-1">
              <Input
                value={field.label}
                onChange={(e) => onUpdate({ label: e.target.value })}
                onBlur={onSave}
                placeholder="Câu hỏi"
                className="text-base font-bold font-heading border-0 border-b border-border focus-visible:border-primary rounded-none shadow-none focus-visible:ring-0 px-0 h-10 bg-transparent"
              />
            </div>

            <div className="w-[170px]">
              <select
                value={field.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  const wasChoice = field.type === "SELECT";
                  const isNowChoice = newType === "SELECT";
                  
                  const updatePayload = { type: newType };
                  if (isNowChoice && !wasChoice) {
                    updatePayload.optionsJson = JSON.stringify(["Tùy chọn 1"]);
                  }
                  onUpdate(updatePayload, true);
                }}
                className="flex w-full h-10 items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-xs text-foreground shadow-sm outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer"
              >
                <option value="TEXT">Trả lời ngắn (Text)</option>
                <option value="NUMBER">Số (Number)</option>
                <option value="DATE">Ngày tháng (Date)</option>
                <option value="COLOR">Bảng màu (Color)</option>
                <option value="SELECT">Menu thả xuống (Select)</option>
              </select>
            </div>
          </div>

          {/* Placeholder (optional) */}
          {field.type !== "SELECT" && (
            <div className="space-y-1 max-w-xs">
              <label className="text-[9px] font-bold text-muted-foreground uppercase">Gợi ý nhập (Placeholder)</label>
              <Input
                value={field.placeholder || ""}
                onChange={(e) => onUpdate({ placeholder: e.target.value })}
                onBlur={onSave}
                placeholder="Nhập gợi ý..."
                className="h-8 text-xs rounded-lg"
              />
            </div>
          )}

          {/* Options Manager */}
          {isChoiceType && (
            <div className="space-y-2 pt-2 border-t border-border border-dashed">
              <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Các tùy chọn</label>
              <div className="space-y-2">
                {options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground/60 font-mono shrink-0">{optIdx + 1}.</span>
                    <Input
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[optIdx] = e.target.value;
                        onUpdate({ optionsJson: JSON.stringify(newOpts) });
                      }}
                      onBlur={onSave}
                      className="h-8 text-xs px-2 border-0 border-b border-border/40 hover:border-border focus-visible:border-primary rounded-none shadow-none focus-visible:ring-0 flex-1 bg-transparent"
                    />
                    
                    {options.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newOpts = options.filter((_, oIdx) => oIdx !== optIdx);
                          onUpdate({ optionsJson: JSON.stringify(newOpts) }, true);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const newOpts = [...options, `Tùy chọn ${options.length + 1}`];
                  onUpdate({ optionsJson: JSON.stringify(newOpts) }, true);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:text-indigo-700 mt-1.5 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Thêm tùy chọn</span>
              </button>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex items-center justify-end border-t border-border pt-4 mt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 border-r border-border pr-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDuplicate}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Nhân bản"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 cursor-pointer"
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Bắt buộc</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => onUpdate({ required: e.target.checked }, true)}
                    className="sr-only peer"
                  />
                  <div className="w-8 h-4.5 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 2. PREVIEW MODE */
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground font-heading">
                {field.label || "Câu hỏi không có tiêu đề"}
              </span>
              {field.required && <span className="text-red-500 text-sm font-bold">*</span>}
            </div>
            <Badge variant="outline" className="h-5 gap-1 text-[9px] text-muted-foreground bg-muted/20 border-border capitalize rounded-lg px-2">
              {getTypeIcon(field.type)}
              <span>{field.type.toLowerCase().replace("_", " ")}</span>
            </Badge>
          </div>

          <div className="pt-1 pointer-events-none">
            {field.type === "TEXT" && (
              <div className="w-1/2 border-b border-dashed border-border py-1 text-xs text-muted-foreground/45">
                {field.placeholder || "Văn bản trả lời ngắn"}
              </div>
            )}
            {field.type === "NUMBER" && (
              <div className="w-1/3 border-b border-dashed border-border py-1 text-xs text-muted-foreground/45">
                {field.placeholder || "Giá trị số"}
              </div>
            )}
            {field.type === "DATE" && (
              <div className="w-1/3 border-b border-dashed border-border py-1 text-xs text-muted-foreground/45 flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-muted-foreground/30" />
                <span>Ngày tháng năm</span>
              </div>
            )}
            {field.type === "COLOR" && (
              <div className="flex items-center gap-2">
                <div className="h-6 w-10 rounded-lg border border-border bg-muted/40 shrink-0" />
                <span className="text-xs text-muted-foreground/50">Mã màu (#000000)</span>
              </div>
            )}
            {field.type === "SELECT" && (
              <div className="space-y-1.5">
                {options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground/60 font-mono shrink-0">{optIdx + 1}.</span>
                    <span className="text-xs text-muted-foreground/80">{opt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilderFieldCard;
