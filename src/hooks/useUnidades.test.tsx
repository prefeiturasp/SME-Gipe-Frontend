import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { useFetchDREs, useFetchUEs } from "./useUnidades";
import * as unidadesActions from "@/actions/unidades";

describe("useUnidades hooks", () => {
    let queryClient: QueryClient;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
    });

    it("useFetchDREs chama setDreOptions com o resultado", async () => {
        const fakeDREs = [{ uuid: "1", nome: "DRE 1" }];
        const setDreOptions = vi.fn();
        vi.spyOn(unidadesActions, "getDREs").mockResolvedValueOnce(fakeDREs);

        const { result } = renderHook(() => useFetchDREs(setDreOptions), {
            wrapper,
        });

        await act(async () => {
            await result.current.mutateAsync();
        });

        expect(setDreOptions).toHaveBeenCalledWith(fakeDREs);
    });

    it("useFetchUEs chama setUeOptions com o resultado", async () => {
        const fakeUEs = [{ uuid: "2", nome: "UE 1" }];
        const setUeOptions = vi.fn();
        vi.spyOn(unidadesActions, "getUEs").mockResolvedValueOnce(fakeUEs);

        const { result } = renderHook(
            () => useFetchUEs("dre-uuid", setUeOptions),
            { wrapper }
        );

        await act(async () => {
            await result.current.mutateAsync();
        });

        expect(setUeOptions).toHaveBeenCalledWith(fakeUEs);
    });

    it("useFetchUEs retorna array vazio se dreUuid não for passado", async () => {
        const setUeOptions = vi.fn();

        const { result } = renderHook(
            () => useFetchUEs(undefined, setUeOptions),
            { wrapper }
        );

        await act(async () => {
            await result.current.mutateAsync();
        });

        expect(setUeOptions).toHaveBeenCalledWith([]);
    });
});
