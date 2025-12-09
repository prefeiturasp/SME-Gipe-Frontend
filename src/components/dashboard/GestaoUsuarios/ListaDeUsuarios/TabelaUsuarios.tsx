import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import Editar from "@/assets/icons/Editar";
import { Usuario } from "@/types/usuarios";


type TabelaUsuariosProps = {
    dataUsuarios: Usuario[];
};

export default function TabelaUsuarios({ dataUsuarios }: Readonly<TabelaUsuariosProps>) {
    const styeTable = "px-2 text-[#42474a] text-left last:text-text-left!";

    return (
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
                    {dataUsuarios.map((usuario) => (
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
    );
}
