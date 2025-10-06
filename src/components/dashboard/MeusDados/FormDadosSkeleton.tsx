import { Skeleton } from "@/components/ui/skeleton";

const FormDadosSkeleton = () => {
    return (
        <div className="w-full md:w-1/2 flex flex-col h-full flex-1">
            <div className="flex flex-col gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                {["nome", "email", "telefone", "cpf"].map((field) => (
                    <div key={`skeleton-field-${field}`} className="space-y-2">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormDadosSkeleton;
