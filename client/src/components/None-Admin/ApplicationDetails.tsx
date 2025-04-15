import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, Download } from "lucide-react";
import { format } from "date-fns";
import { USeGetJobApplicationById } from "@/Api/Applications";

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const { application } = USeGetJobApplicationById(id!);

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Application not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/applications">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Applications
            </Button>
          </Link>
        </div>

        {application.map((application) => (
          <div
            className="bg-gray-800 rounded-2xl shadow-md p-6"
            key={application.id}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {application.title}
                </h1>
                <p className="text-gray-400 mt-1">
                  Applied on{" "}
                  {format(new Date(application.appliedDate), "MMM dd, yyyy")}
                </p>
              </div>
              <Badge
                variant={
                  application.status.toLowerCase() === "accepted"
                    ? "secondary"
                    : application.status.toLowerCase() === "rejected"
                    ? "destructive"
                    : "default"
                }
                className="text-sm capitalize"
              >
                {application.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <DetailItem label="Department" value={application.department} />
                <DetailItem label="Employment Type" value={application.type} />
                <DetailItem
                  label="Salary Range"
                  value={`$${application.sallary}`}
                />
              </div>
              <div className="space-y-4">
                <DetailItem
                  label="Required Skills"
                  value={application.skills}
                />
                <DetailItem
                  label="Qualifications"
                  value={application.qualifications}
                />
              </div>
            </div>

            <Section title="Job Description">
              <p className="text-gray-300 whitespace-pre-line">
                {application.jobDescription}
              </p>
            </Section>

            <Section title="Submitted Documents" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentCard url={application.cv} label="Curriculum Vitae" />
                <DocumentCard
                  url={application.coverLetter}
                  label="Cover Letter"
                />
              </div>
            </Section>
          </div>
        ))}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-sm font-medium text-gray-400">{label}</dt>
    <dd className="mt-1 text-white break-words">{value || "Not specified"}</dd>
  </div>
);

const Section = ({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={className}>
    <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
    {children}
  </section>
);

const DocumentCard = ({ url, label }: { url: string; label: string }) => (
  <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 hover:bg-gray-600 transition-colors">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-blue-400" />
        <div>
          <p className="font-medium text-white">{label}</p>
          <p className="text-sm text-gray-400">PDF Document</p>
        </div>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300"
      >
        <Download className="h-5 w-5" />
      </a>
    </div>
  </div>
);

export default ApplicationDetailsPage;
