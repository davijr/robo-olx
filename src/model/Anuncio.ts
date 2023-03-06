
export class Anuncio {
    constructor(
        public ativo: boolean,
        public titulo: string,
        public descricao: string,
        public categorias: string[],
        public outrasInformacoes: any, // TODO type
        public preco: number,
        public fotos: string[]
    ) {}
}