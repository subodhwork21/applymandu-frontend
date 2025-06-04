interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ className, type, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

interface InputFieldProps extends InputProps {
  label?: string;
  error?: string;
}

// FormInput component that shows error message
const FormInput = ({ 
  label, 
  error, 
  className,
  required,
  ...props 
}: InputFieldProps) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-sm font-medium pb-3 block text-statsValue">
          {label}{required && <span className="text-[#EF4444] ml-1">*</span>}
        </label>
      )}
      <Input 
        className={`text-manduBorder ${error ? 'border-red-500' : ''} ${className}`}
        required={required}
        {...props} 
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
