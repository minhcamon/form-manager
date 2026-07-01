import React from "react";
import { Plus } from "lucide-react";
import { useFormDashboard } from "../hooks/useFormDashboard";
import FormCard from "../components/FormCard";
import FormListSkeleton from "../components/FormListSkeleton";
import EmptyFormState from "../components/EmptyFormState";
import { Button } from "@/components/ui/button";

export const FormDashboardPage = () => {
  const {
    forms,
    loading,
    handleCreate,
    handlePreview,
    handleEdit,
    handleDelete,
    handlePublish,
  } = useFormDashboard();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight sm:text-3xl font-heading">
            Danh sách Biểu mẫu
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Quản lý và thiết kế các biểu mẫu khảo sát trong hệ thống.
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

      {/* Content */}
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
