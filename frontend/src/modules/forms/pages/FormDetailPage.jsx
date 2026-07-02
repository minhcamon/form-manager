import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, ClipboardList, FileText } from "lucide-react";
import FormBuilder from "../components/FormBuilder";
import FormSubmissionsList from "../components/FormSubmissionsList";
import FormViewer from "../components/FormViewer";
import formService from "../../../services/formService";
import { useAuth } from "../../../contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const FormDetailPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isViewMode = type === "VIEW";
  const isAdmin = user?.role === "ADMIN";

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);

  useEffect(() => {
    if (isViewMode && id) {
      const fetchForm = async () => {
        try {
          setLoading(true);
          const data = await formService.getFormById(id);
          setForm(data.data || data);
        } catch (err) {
          window.toast.error(err.message || "Không thể tải thông tin biểu mẫu.");
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      fetchForm();

      if (isAdmin) {
        const fetchFormSubmissions = async () => {
          try {
            setSubmissionsLoading(true);
            const res = await formService.getSubmissionsByFormId(id);
            setSubmissions(res.data || res || []);
          } catch (err) {
            window.toast.error(err.message || "Không thể tải lịch sử câu trả lời.");
          } finally {
            setSubmissionsLoading(false);
          }
        };
        fetchFormSubmissions();
      }
    }
  }, [isViewMode, id, navigate, isAdmin]);

  if (isViewMode) {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Đang tải thông tin biểu mẫu...</p>
        </div>
      );
    }

    if (isAdmin) {
      return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-24">
          {/* Navigation & Header */}
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <button
              onClick={() => navigate("/")}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-lg">
              Quản trị biểu mẫu
            </span>
          </div>

          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2 rounded-xl mb-6">
              <TabsTrigger value="preview" className="text-xs cursor-pointer flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                <span>Xem trước giao diện</span>
              </TabsTrigger>
              <TabsTrigger value="submissions" className="text-xs cursor-pointer flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4" />
                <span>Kết quả phản hồi ({submissions.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-6">
              <FormBuilder
                type="EDIT"
                readOnly={form?.status === "PUBLISHED"}
                hideNavigation={true}
              />
            </TabsContent>

            <TabsContent value="submissions" className="space-y-4">
              <FormSubmissionsList
                submissions={submissions}
                loading={submissionsLoading}
                fields={form?.fields || []}
              />
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    return (
      <FormViewer
        formId={id}
        title={form?.title}
        description={form?.description}
        fields={form?.fields || []}
        readOnly={false}
      />
    );
  }

  return <FormBuilder type={type} />;
};

export default FormDetailPage;
