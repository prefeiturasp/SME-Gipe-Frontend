import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterAll,
    type Mock,
} from "vitest";
import axios from "axios";
import { getDREs, getUEs } from "@/actions/unidades";

vi.mock("axios");

const axiosGetMock = axios.get as Mock;

describe("unidades actions", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetAllMocks();
        process.env = { ...originalEnv };
        process.env.NEXT_PUBLIC_API_URL = "https://api.exemplo.com";
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("getDREs retorna lista de DREs", async () => {
        const fakeDREs = [{ uuid: "1", nome: "DRE 1" }];
        axiosGetMock.mockResolvedValueOnce({ data: fakeDREs });

        const result = await getDREs();

        expect(axiosGetMock).toHaveBeenCalledWith(
            "https://api.exemplo.com/unidades",
            { params: { tipo: "DRE" } }
        );
        expect(result).toEqual(fakeDREs);
    });

    it("getUEs retorna lista de UEs para uma DRE", async () => {
        const fakeUEs = [{ uuid: "2", nome: "UE 1" }];
        axiosGetMock.mockResolvedValueOnce({ data: fakeUEs });

        const result = await getUEs("dre-uuid");

        expect(axiosGetMock).toHaveBeenCalledWith(
            "https://api.exemplo.com/unidades",
            { params: { tipo: "UE", dre: "dre-uuid" } }
        );
        expect(result).toEqual(fakeUEs);
    });
});
