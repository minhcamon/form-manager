import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { useFormBuilder } from "../hooks/useFormBuilder";
import FormHeaderCard from "../components/FormHeaderCard";
import FormBuilderFieldCard from "../components/FormBuilderFieldCard";
import { Button } from "@/components/ui/button";

export const FormCreatePage = () => {
  const {
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
    fields,
    isSaving,
    activeFieldIndex,
    setActiveFieldIndex,
    handleAddField,
    handleUpdateField,
    handleDuplicateField,
    handleDeleteField,
    handleMoveField,
    handleSaveForm,
  } = useFormBuilder();

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn pb-24">
      {/* Navigation Row */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
            Google Forms Style Builder
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSaveForm}
            disabled={isSaving}
            className="h-9 rounded-xl px-5 cursor-pointer font-semibold shadow-sm text-xs"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <span>Lưu biểu mẫu</span>
            )}
          </Button>
        </div>
      </div>

      {/* 1. Header Card Component */}
      <FormHeaderCard
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        status={status}
        setStatus={setStatus}
        allowMultipleSubmission={allowMultipleSubmission}
        setAllowMultipleSubmission={setAllowMultipleSubmission}
        startAt={startAt}
        setStartAt={setStartAt}
        endAt={endAt}
        setEndAt={setEndAt}
      />

      {/* 2. Questions list */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <FormBuilderFieldCard
            key={index}
            field={field}
            index={index}
            isActive={index === activeFieldIndex}
            onFocus={() => setActiveFieldIndex(index)}
            onUpdate={(updatedData) => handleUpdateField(index, updatedData)}
            onDuplicate={() => handleDuplicateField(index)}
            onDelete={() => handleDeleteField(index)}
            onMove={(direction) => handleMoveField(index, direction)}
            isFirst={index === 0}
            isLast={index === fields.length - 1}
          />
        ))}
      </div>

      {/* 3. Bottom controls panel */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <Button
          variant="outline"
          asChild
          className="rounded-xl cursor-pointer text-xs"
        >
          <Link to="/">Quay lại trang chủ</Link>
        </Button>
        <Button
          onClick={handleAddField}
          variant="secondary"
          className="h-10 rounded-xl px-4 cursor-pointer text-primary border border-border text-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm câu hỏi mới</span>
        </Button>
      </div>
    </div>
  );
};

export default FormCreatePage;
