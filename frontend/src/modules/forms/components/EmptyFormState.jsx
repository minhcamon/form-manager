import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyFormState = ({ onCreate }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 py-16 text-center animate-fadeIn">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground border border-border mb-4">
        <FileText className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground font-heading">Chưa có biểu mẫu nào</h3>
      <p className="text-muted-foreground text-sm max-w-sm mt-2 mb-6">
        Hãy bắt đầu bằng cách tạo biểu mẫu đầu tiên của bạn để thu thập câu trả lời.
      </p>
      <Button
        onClick={onCreate}
        className="h-9 px-4 text-sm font-semibold rounded-xl cursor-pointer"
      >
        Tạo Form
      </Button>
    </div>
  );
};

export default EmptyFormState;
