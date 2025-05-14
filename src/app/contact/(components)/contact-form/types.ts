import type { UseFormReturn } from "react-hook-form";

import { ContactFormData } from "@/schema/contact-form-schema";

interface SubmitButtonProps {
  isValid: boolean;
  isSubmitting: boolean;
}

interface FormFieldsProps {
  form: UseFormReturn<ContactFormData>;
}

export type { FormFieldsProps, SubmitButtonProps };
