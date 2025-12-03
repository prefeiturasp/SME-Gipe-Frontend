import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import Editar from "@/assets/icons/Editar";

type ListaDeUsuariosProps = {
    status: "ativos" | "inativos";
};

const mockUsuarios = [
    {
        id: 1,
        perfil: "Diretor(a)",
        nome: "João Silva",
        rfOuCpf: "123.456.789-00",
        email: "joao.silva@example.com",
        rede: "Indireta",
        diretoriaRegional: "Butantã",
        unidadeEducacional: "EMEI Camilo Ashcar",
    },
    {
        id: 2,
        perfil: "Assistente de direção",
        nome: "Maria Oliveira",
        rfOuCpf: "987.654.321-00",
        email: "maria.oliveira@example.com",
        rede: "Direta",
        diretoriaRegional: "Penha",
        unidadeEducacional: "EMEF Prof. Carlos Drummond de Andrade",
    },
    {
        id: 3,
        perfil: "Ponto focal",
        nome: "Carlos Pereira",
        rfOuCpf: "456.789.123-00",
        email: "carlos.pereira@example.com",
        rede: "Direta",
        diretoriaRegional: "Campo Limpo",
        unidadeEducacional: "",
    },
    {
        id: 4,
        perfil: "GIPE",
        nome: "Ana Souza",
        rfOuCpf: "321.654.987-00",
        email: "ana.souza@example.com",
        rede: "Direta",
        diretoriaRegional: "",
        unidadeEducacional: "",
    }
];

const styeTable = "px-2 text-[#42474a] text-left last:text-text-left!";


export default function ListaDeUsuarios({
    status,
}: Readonly<ListaDeUsuariosProps>) {
    return (
        <>
        <p className="p-2">Exibindo o Status: {status}</p>

        <div className="rounded-md border border-gray-300">

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className={styeTable}>Perfil</TableHead>
                        <TableHead className={styeTable}>Nome</TableHead>
                        <TableHead className={styeTable}>RF ou CPF</TableHead>
                        <TableHead className={styeTable}>Email</TableHead>
                        <TableHead className={styeTable}>Rede</TableHead>
                        <TableHead className={styeTable}>Diretoria Regional</TableHead>
                        <TableHead className={styeTable}>Unidade Educacional</TableHead>
                        <TableHead className="text-center">Ação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mockUsuarios.map((usuario) => (
                        <TableRow key={usuario.id}>
                            <TableCell>{usuario.perfil}</TableCell>
                            <TableCell className={styeTable}>{usuario.nome}</TableCell>
                            <TableCell className={styeTable}>{usuario.rfOuCpf}</TableCell>
                            <TableCell className={styeTable}>{usuario.email}</TableCell>
                            <TableCell className={styeTable}>{usuario.rede}</TableCell>
                            <TableCell className={styeTable}>{usuario.diretoriaRegional}</TableCell>
                            <TableCell className={styeTable}>{usuario.unidadeEducacional}</TableCell>
                            <TableCell className={styeTable}><Editar /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
        </>
    );
}
