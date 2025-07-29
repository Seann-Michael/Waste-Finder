import React, { memo, useCallback, useMemo } from 'react';
import { useForm, FormProvider, UseFormReturn } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { LoadingSpinner } from './LoadingStates';

/**
 * Optimized form field component that prevents unnecessary re-renders
 */
interface OptimizedFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea';
  placeholder?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  methods: UseFormReturn<any>;
}

export const OptimizedField = memo<OptimizedFieldProps>(({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  disabled = false,
  methods,
}) => {
  const { register, formState: { errors } } = methods;
  
  const fieldError = errors[name]?.message as string;
  const hasError = !!fieldError;

  const inputProps = useMemo(() => ({
    ...register(name, { required: required ? `${label} is required` : false }),
    placeholder,
    disabled,
    className: `${hasError ? 'border-red-500' : ''}`,
  }), [register, name, required, label, placeholder, disabled, hasError]);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      {type === 'textarea' ? (
        <Textarea
          id={name}
          {...inputProps}
          rows={4}
        />
      ) : (
        <Input
          id={name}
          type={type}
          {...inputProps}
        />
      )}
      
      {hasError && (
        <p className="text-red-500 text-sm" role="alert">
          {fieldError}
        </p>
      )}
    </div>
  );
});

OptimizedField.displayName = 'OptimizedField';

/**
 * Optimized select field component
 */
interface OptimizedSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  methods: UseFormReturn<any>;
}

export const OptimizedSelect = memo<OptimizedSelectProps>(({
  name,
  label,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  methods,
}) => {
  const { register, formState: { errors } } = methods;
  
  const fieldError = errors[name]?.message as string;
  const hasError = !!fieldError;

  const selectProps = useMemo(() => ({
    ...register(name, { required: required ? `${label} is required` : false }),
    disabled,
    className: `${hasError ? 'border-red-500' : ''}`,
  }), [register, name, required, label, disabled, hasError]);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <select
        id={name}
        {...selectProps}
        className={`w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${selectProps.className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <p className="text-red-500 text-sm" role="alert">
          {fieldError}
        </p>
      )}
    </div>
  );
});

OptimizedSelect.displayName = 'OptimizedSelect';

/**
 * Optimized checkbox group component
 */
interface OptimizedCheckboxGroupProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  methods: UseFormReturn<any>;
}

export const OptimizedCheckboxGroup = memo<OptimizedCheckboxGroupProps>(({
  name,
  label,
  options,
  required = false,
  disabled = false,
  methods,
}) => {
  const { watch, setValue, formState: { errors } } = methods;
  
  const selectedValues = watch(name) || [];
  const fieldError = errors[name]?.message as string;
  const hasError = !!fieldError;

  const handleCheckboxChange = useCallback((value: string, checked: boolean) => {
    const newValues = checked 
      ? [...selectedValues, value]
      : selectedValues.filter((v: string) => v !== value);
    
    setValue(name, newValues, { shouldValidate: true });
  }, [selectedValues, setValue, name]);

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${name}-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
              disabled={disabled}
              className="rounded border-gray-300 focus:ring-primary"
            />
            <Label 
              htmlFor={`${name}-${option.value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      
      {hasError && (
        <p className="text-red-500 text-sm" role="alert">
          {fieldError}
        </p>
      )}
    </div>
  );
});

OptimizedCheckboxGroup.displayName = 'OptimizedCheckboxGroup';

/**
 * Optimized form container
 */
interface OptimizedFormProps {
  children: React.ReactNode;
  onSubmit: (data: any) => void | Promise<void>;
  isLoading?: boolean;
  submitText?: string;
  loadingText?: string;
  className?: string;
  methods?: UseFormReturn<any>;
}

export const OptimizedForm = memo<OptimizedFormProps>(({
  children,
  onSubmit,
  isLoading = false,
  submitText = 'Submit',
  loadingText = 'Submitting...',
  className = '',
  methods: externalMethods,
}) => {
  const internalMethods = useForm();
  const methods = externalMethods || internalMethods;

  const handleSubmit = useCallback(
    methods.handleSubmit(async (data) => {
      try {
        await onSubmit(data);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }),
    [methods, onSubmit]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
        {children}
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {loadingText}
            </>
          ) : (
            submitText
          )}
        </Button>
      </form>
    </FormProvider>
  );
});

OptimizedForm.displayName = 'OptimizedForm';

/**
 * Hook for form optimization
 */
export function useOptimizedForm<T = any>(defaultValues?: Partial<T>) {
  return useForm<T>({
    defaultValues,
    mode: 'onChange',
    shouldFocusError: true,
    shouldUnregister: false,
  });
}

/**
 * Memoized form section wrapper
 */
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormSection = memo<FormSectionProps>(({
  title,
  description,
  children,
  className = '',
}) => (
  <div className={`space-y-4 ${className}`}>
    <div className="space-y-1">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
));

FormSection.displayName = 'FormSection';
