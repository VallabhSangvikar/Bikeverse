import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "../hooks/use-toast";
import { Loader2, Upload, CheckCircle, X } from "lucide-react";

interface FileUploadProps {
  id: string;
  onUpload: (url: string) => void;
  currentFile?: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUpload({
  id,
  onUpload,
  currentFile,
  required = false,
  accept = "image/*,.pdf",
  maxSizeMB = 5
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(currentFile || null);
  const [fileName, setFileName] = useState<string | null>(
    currentFile ? currentFile.split('/').pop() : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSizeBytes) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', id); // Pass the document type (idProof or businessLicense)

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const response = await fetch(`${API_URL}/auth/upload-document`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadedFile(data.fileUrl);
      onUpload(data.fileUrl);

      toast({
        title: "Upload Successful",
        description: "Your document was uploaded successfully.",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document.",
        variant: "destructive",
      });
      setFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setUploadedFile(null);
    setFileName(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <Input
        ref={fileInputRef}
        type="file"
        id={id}
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        required={required && !uploadedFile}
      />

      {!uploadedFile ? (
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          
          {isUploading && fileName && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Uploading {fileName}...</span>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm truncate max-w-xs">{fileName || "File uploaded"}</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearFile}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      )}
    </div>
  );
}