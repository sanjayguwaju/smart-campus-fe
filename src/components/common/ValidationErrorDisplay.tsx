import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export interface ValidationError {
  field: string;
  message: string;
}

interface ValidationErrorDisplayProps {
  errors: ValidationError[];
  onClear?: () => void;
  title?: string;
}

const ValidationErrorDisplay: React.FC<ValidationErrorDisplayProps> = ({
  errors,
  onClear,
  title = "Please fix the following errors:"
}) => {
  if (errors.length === 0) return null;

  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            {title}
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="font-medium mr-1">
                  {error.field.charAt(0).toUpperCase() + error.field.slice(1)}:
                </span>
                <span>{error.message}</span>
              </li>
            ))}
          </ul>
        </div>
        {onClear && (
          <button
            onClick={onClear}
            className="ml-3 text-red-400 hover:text-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ValidationErrorDisplay; 