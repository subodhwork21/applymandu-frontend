import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Loader2, Upload, X } from "lucide-react";
// Either use all imports from @radix-ui/react-dialog
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogFooter, DialogHeader } from "./ui/dialog";
import { Button } from "./ui/button";

interface ImportJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => Promise<void>;
}

const ImportJobsModal: React.FC<ImportJobsModalProps> = ({ isOpen, onClose, onImport }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'csv' || fileExtension === 'json') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a CSV or JSON file');
        setFile(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    maxFiles: 1,
  });

  const handleImport = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      await onImport(file);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during import');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import LinkedIn Jobs</DialogTitle>
          <DialogDescription>
            Upload a CSV or JSON file containing LinkedIn job listings.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-manduPrimary bg-manduPrimary/5' 
                : 'border-gray-300 hover:border-manduPrimary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <Upload className="h-10 w-10 text-gray-400 mx-auto" />
              {isDragActive ? (
                <p className="text-sm text-gray-600">Drop the file here...</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600">
                    Drag & drop a CSV or JSON file here, or click to select
                  </p>
                  <p className="text-xs text-gray-500">
                    (Only .csv and .json files are accepted)
                  </p>
                </>
              )}
            </div>
          </div>
          
          {file && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-manduPrimary mr-2" />
                <span className="text-sm font-medium truncate max-w-[200px]">
                  {file.name}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setFile(null)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!file || isUploading}
            className="bg-manduPrimary hover:bg-manduPrimary/90"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Import Jobs
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportJobsModal