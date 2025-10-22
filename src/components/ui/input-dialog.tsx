import React, { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "./dialog";
import { AlertTriangle, Info } from "lucide-react";

interface InputDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  description: string;
  label: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "warning";
  isLoading?: boolean;
  required?: boolean;
}

const InputDialog: React.FC<InputDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  label,
  placeholder = "",
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "default",
  isLoading = false,
  required = true,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (required && !value.trim()) {
      setError(`${label} harus diisi`);
      return;
    }
    onConfirm(value);
    setValue("");
    setError("");
  };

  const handleClose = () => {
    setValue("");
    setError("");
    onClose();
  };

  const getIcon = () => {
    switch (variant) {
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-amber-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (variant) {
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white";
      default:
        return "bg-blue-600 hover:bg-blue-700 text-white";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle className="text-lg font-semibold">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="input-value" className="text-sm font-medium">
              {label}
            </Label>
            <Input
              id="input-value"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              placeholder={placeholder}
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || (required && !value.trim())}
            className={getConfirmButtonStyle()}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Memproses...
              </div>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InputDialog;
