import puppeteer from "puppeteer";
import { Anuncio } from "./model/Anuncio";
import { Usuario } from "./model/Usuario";
import { AppUtils } from "./util/AppUtils";
let usuarios = require('./dados/usuarios.json');
let anuncios = require('./dados/anuncios.json');

export class Robo {
    private browser: any;

    constructor() {}

    async run() {
        for (let usuario of usuarios) {
            if (usuario.ativo) {
                const page = await this.novaPagina();
                await this.login(page, usuario);
                for (let anuncio of anuncios) {
                    if (anuncio.ativo) {
                        await this.publicarAnuncio(page, anuncio);
                        await this.alertUser(page, 'Anúncio foi criado com sucesso!');
                    }
                }
                // encerrar anúncios do usuário
                await this.reiniciarBrowser();
            }
        }
    }

    private async reiniciarBrowser() {
        await this.browser.close();
        this.browser = null;
    }

    private async novaPagina() {
        if (!this.browser) {
            const options = {
                headless: false,
                timeout: 0,
                args: [`--window-size=1920,1080`],
                defaultViewport: {
                  width: 1920,
                  height: 1080
                }
            }
            this.browser = await puppeteer.launch(options);
        }
        const page = await this.browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 1080
        });
        return page;
    }

    private async login(page: any, usuario: Usuario) {
        // Navegar para a página de login
        await page.goto('https://conta.olx.com.br/acesso', { timeout: 0 });
      
        // Preencher os campos de e-mail e senha
        await page.type('#input-1', usuario.email);
        await page.type('#password-input', usuario.senha);
      
        // Clique no botão "Entrar" para fazer login
        await page.keyboard.press('Enter');

        // teste deu ruim no login por excesso de tentativas
        await this.validarLogin(page);

        // Aguarde a página carregar completamente
        await page.waitForNavigation();
    }

    /**
     * Se a OLX bloquear o login, aparecerá um link para acesso instantâneo.
     * É necessário abrir o e-mail, clicar no botão de ACESSO PELO SITE com o botão direito,
     * copiar o link e colar na janela (prompt) aberta pelo robô e pressionar ENTER. O robô
     * deve seguir o fluxo normalmente.
     * @param page
     */
    private async validarLogin(page: any) {
        await AppUtils.sleep(3);
        const elemento = await page.$('[href="https://ajuda.olx.com.br/fale-conosco"]');
        if (elemento) {
            await elemento.click();
            const novoLink = await page.evaluate(() => {
                return prompt('Digite o link de acesso instantâneo:');
            });
            await page.goto(novoLink, { timeout: 0 });
        }
    }
      
    private async publicarAnuncio(page: any, anuncio: Anuncio) {
        try {
            // Navegar para a página de criar anúncio
            await page.goto('https://www2.olx.com.br/ai/form/0', { timeout: 0 });
            // await page.waitForSelector('#subject');
        
            // Preencher os campos de e-mail e senha
            await page.type('#subject', anuncio.titulo);
            await page.type('#body', anuncio.descricao);

            // categorias
            for (const categoria of anuncio.categorias) {
                try {
                    const element = await page.$(`[title='${categoria}']`);
                    if (element) {
                        await element.click();
                        await AppUtils.sleep(1);
                    } else {
                        console.log(`Elemento não encontrado: [title='${categoria}']`);
                    }
                } catch (error) {
                    console.error(`Erro ao tentar selecionar categorias. Elemento: [title='${categoria}']`, error);
                }
            }

            // outras informações
            for (const info of anuncio.outrasInformacoes) {
                try {
                    const select = await page.$(`[label='${info.elemento}']`);
                    if (select) {
                        await select.click();
                        await AppUtils.sleep(1);
                        await page.select(`[label='${info.elemento}']`, '' + info.valor);
                    } else {
                        console.log(`Elemento não encontrado: select[label='${info.elemento}']`);
                    }
                } catch (error) {
                    console.error(`Erro ao tentar selecionar categorias. Elemento: ${JSON.stringify(info)}']`, error);
                }
            }

            // preço
            await page.type('#price', '' + anuncio.preco, {delay: 100});

            // fotos
            for (const fotoUrl of anuncio.fotos) {
                try {
                    const fileInput = await page.$('[type="file"]');
                    await fileInput.uploadFile(fotoUrl);
                    await AppUtils.sleep(2);
                } catch (error) {
                    console.error(`Erro ao tentar selecionar fotos. Foto: ${fotoUrl}']`, error);
                }
            }

            // CHECKBOX Ocultar meu telefone neste anúncio
            const element = await page.$('[data-ds-component="DS-Text"]');
            if (element) {
                await element.click();
            } else {
                console.log(`Elemento não encontrado: [data-ds-component="DS-Text"]`);
            }
            // await page.click('.sc-bwzfXH');

            // ENVIAR
            await AppUtils.sleep(2);
            await page.click('#ad_insertion_submit_button');
            await AppUtils.sleep(30);
        } catch (error) {
            console.error('Erro ao tentar publicar o anúncio.', error);
        }
    }

    private async alertUser(page: any, message: string): Promise<string> {
        return await page.evaluate((message: string) => {
            return alert(message);
        }, message);
    }
}