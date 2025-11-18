
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
    <div className={cn("min-w-lg divide-y divide-slate-300 border-y border-slate-300 border-t-2", className)}>
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
    <FormItem className={cn(`flex flex-col ${className ?? ""}`)}>
      <div className="flex">
        <div className="flex items-center bg-zinc-200/80 justify-center w-40 px-3 py-2 bg-muted-light-gray border-r border-slate-300">
          <FormLabel className="text-slate-400 data-[error=true]:text-foreground font-bold">
            {label}
          </FormLabel>
        </div>
        <div className={cn("flex-1 px-3 py-3")}>
          <FormControl>
            {children}
          </FormControl>
          {message && (<FormMessage className="pt-1">{message}</FormMessage>)}
          {description && !message && (<FormDescription className="pt-1 text-sm text-slate-400">{description}</FormDescription>)}
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