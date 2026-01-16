import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MensagemInativacao from './MensagemInativacao';

describe('MensagemInativacao', () => {
    const defaultProps = {
        motivoInativacao: 'Usuário solicitou desligamento',
        dataInativacaoFormatada: '15/01/2024',
        responsavelInativacaoNome: 'João Silva',
    };

    it('deve renderizar mensagem de inativação de perfil quando inativadoViaUnidade é false', () => {
        render(<MensagemInativacao {...defaultProps} />);

        expect(screen.getByText('Motivo da inativação UE:')).toBeInTheDocument();
        expect(screen.getByText(defaultProps.motivoInativacao)).toBeInTheDocument();
    });


    it('deve exibir informações do responsável e data da inativação', () => {
        render(<MensagemInativacao {...defaultProps} />);

        expect(screen.getByText(/Inativado por João Silva em 15\/01\/2024/)).toBeInTheDocument();
    });

    it('deve ter role="alert" e aria-label correto', () => {
        render(<MensagemInativacao {...defaultProps} />);

        const alertElement = screen.getByRole('alert');
        expect(alertElement).toHaveAttribute('aria-label', 'Informações sobre inativação da unidade educacional');
    });

    it('deve aplicar classes CSS corretas no container principal', () => {
        render(<MensagemInativacao {...defaultProps} />);

        const alertElement = screen.getByRole('alert');
        expect(alertElement).toHaveClass('p-4', 'mb-4', 'rounded-lg', 'bg-[#E8F0FE]', 'text-[#42474a]', 'text-sm');
    });

    it('deve renderizar com diferentes motivos de inativação', () => {
        const customProps = {
            ...defaultProps,
            motivoInativacao: 'Fechamento da unidade',
        };

        render(<MensagemInativacao {...customProps} />);

        expect(screen.getByText('Fechamento da unidade')).toBeInTheDocument();
    });

    it('deve renderizar com diferentes responsáveis e datas', () => {
        const customProps = {
            ...defaultProps,
            responsavelInativacaoNome: 'Maria Santos',
            dataInativacaoFormatada: '20/02/2024',
        };

        render(<MensagemInativacao {...customProps} />);

        expect(screen.getByText(/Inativado por Maria Santos em 20\/02\/2024/)).toBeInTheDocument();
    });
});
