export const getValidationErrors = (
    errors?: Record<string, string[]>
  ): string => {
    if (!errors || Object.keys(errors).length === 0) return "";
    
    // Get the first field with errors
    const firstField = Object.keys(errors)[0];
    
    // Get the first error message for that field
    if (errors[firstField] && errors[firstField].length > 0) {
      return errors[firstField][0];
    }
    
    return "";
  };
  