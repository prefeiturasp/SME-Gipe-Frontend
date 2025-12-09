import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi } from "vitest";
import { useFetchDREs, useFetchUEs, useFetchTodasUEs } from "./useUnidades";
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

    it("useFetchDREs retorna o resultado correto", async () => {
        const fakeDREs = [{ uuid: "1", nome: "DRE 1" }];
        vi.spyOn(unidadesActions, "getDREs").mockResolvedValueOnce(fakeDREs);

        const { result } = renderHook(() => useFetchDREs(), {
            wrapper,
        });

        await waitFor(() => result.current.isSuccess);
        expect(result.current.data).toEqual(fakeDREs);
    });

    it("useFetchUEs retorna o resultado correto quando dreUuid é passado", async () => {
        const fakeUEs = [{ uuid: "2", nome: "UE 1" }];
        vi.spyOn(unidadesActions, "getUEs").mockResolvedValueOnce(fakeUEs);

        const { result } = renderHook(() => useFetchUEs("dre-uuid"), {
            wrapper,
        });

        await waitFor(() => result.current.isSuccess);
        expect(result.current.data).toEqual(fakeUEs);
    });

    it("useFetchTodasUEs retorna o resultado correto te todas as unidades", async () => {
        const fakeUEs = [{ uuid: "2", nome: "UE 1" }];
        vi.spyOn(unidadesActions, "getTodasUEs").mockResolvedValueOnce(fakeUEs);

        const { result } = renderHook(() => useFetchTodasUEs(), {
            wrapper,
        });

        await waitFor(() => result.current.isSuccess);
        expect(result.current.data).toEqual(fakeUEs);
    });
});
