
import { FormProvider} from "react-hook-form";
import { cn } from "../../lib/utils";
import { ModalFormContainerProps, ModalFormItemProps } from "./ModalForm.types";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "../../organisms/form";

const ModalForm = FormProvider
const ModalFormField = FormField
function ModalFormContainer({ 
  children,
  className
}: ModalFormContainerProps) {
  return (
    <div className={cn("w-full border-t-2 border-[#bbbecf]", className)}>
      {children}
    </div>
  )
}

function ModalFormItem({  
  label, 
  children, 
  className,
  description,
  message,
}: ModalFormItemProps) {
  return (
    <FormItem className={cn("border-b border-[#bbbecf]", className)}>
      <div className="flex">
        <div className="flex items-center bg-[#e2e8f0] justify-center w-40 px-3 py-2 ">
          <FormLabel className="text-muted-foreground font-bold text-sm">
            {label}
          </FormLabel>
        </div>
        <div className={cn("flex-1 px-3 py-3")}>
          <FormControl>
            {children}
          </FormControl>
          {message && (<FormMessage className="pt-1">{message}</FormMessage>)}
          {description && !message && (<FormDescription className="pt-1 text-sm text-muted-foreground">{description}</FormDescription>)}
        </div>
      </div>
    </FormItem>
  )
}

ModalFormItem.displayName = "ModalFormItem";
ModalFormContainer.displayName = "ModalFormContainer";

export {
  ModalForm,
  ModalFormItem,
  ModalFormField,
  ModalFormContainer,
};