class ConsultaFiltroLocalizadores {
  titulo_historico() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > h1'
  }

  btn_filtrar_principal() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div.mt-1.mb-4.flex.flex-row.space-x-4.items-center.justify-between > div > button:nth-child(2)'
  }

  titulo_periodo() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div.my-\\[44px\\] > div.grid.grid-cols-1.md\\:grid-cols-3.gap-4.md\\:gap-6.mt-4 > div.min-w-0.w-full > fieldset > legend'
  }

  titulo_tipo_ocorrencia() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div.my-\\[44px\\] > div.grid.grid-cols-1.md\\:grid-cols-3.gap-4.md\\:gap-6.mt-4 > div:nth-child(2) > label'
  }

  titulo_status() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div.my-\\[44px\\] > div.grid.grid-cols-1.md\\:grid-cols-3.gap-4.md\\:gap-6.mt-4 > div:nth-child(3) > label'
  }

  input_data_inicial() {
    return '//*[@id="periodo-inicial"]'
  }

  input_data_final() {
    return '//*[@id="periodo-final"]'
  }

  select_tipo_ocorrencia() {
    return '//*[@id="tipo-violencia"]'
  }

  select_status() {
    return 'button#status[role="combobox"]'
  }

  btn_limpar_painel() {
    return '/html/body/div/div/div[2]/main/div/div[3]/div/div[2]/div[2]/button[1]'
  }

  btn_filtrar_painel() {
    return 'body > div > div > div.flex.flex-col.flex-1.w-full > main > div > div:nth-child(3) > div > div.my-\\[44px\\] > div.flex.justify-end.space-x-2.mt-4 > button.inline-flex.items-center.justify-center.whitespace-nowrap.ring-offset-background.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.text-center.rounded-md.text-\\[14px\\].font-\\[700\\].bg-\\[\\#717FC7\\].text-white.hover\\:bg-\\[\\#5a65a8\\].h-10.px-4.py-2'
  }

  listagem_ocorrencias() {
    return 'main div.bg-white.rounded-\\[4px\\].shadow-\\[4px_4px_12px_0px_rgba\\(0\\,0\\,0\\,0\\.12\\)\\]'
  }
}

export default ConsultaFiltroLocalizadores;
