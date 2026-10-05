/**
 * CONTEÚDO DO SITE
 * ----------------
 * Este é o único arquivo que você precisa editar para trocar textos e mídias.
 *
 * - Trechos no formato { accent: '...' } aparecem em VERMELHO (palavras de emoção).
 * - Fotos ficam em public/fotos/ e vídeos em public/videos/ (veja os LEIA-ME.txt).
 *   Enquanto o arquivo não existir, aparece um bloco bege numerado no lugar.
 * - O nome pode ser trocado pela URL: ?name=Mariana
 *
 * Todos os textos abaixo são RASCUNHOS — reescreva com as suas palavras.
 */

export const content = {
  name: 'Mariana',

  hero: {
    kicker: 'Hoje é o seu dia',
    // {name} é substituído pelo nome (ou pelo ?name= da URL)
    title: ['Feliz', 'aniversário,', { accent: '{name}' }],
    subtitle: 'Role devagar. Cada parte daqui foi feita pensando em você.',
  },

  letter: {
    label: 'Uma carta',
    paragraphs: [
      ['Tem dias que parecem comuns até alguém aparecer e mudar tudo. Você mudou ', { accent: 'todos' }, ' os meus.'],
      ['Eu gosto do jeito que você ri antes de terminar a piada, de como você presta atenção nas pessoas, de como tudo fica mais leve quando você está perto.'],
      ['Hoje o mundo comemora mais um ano seu. Eu comemoro a ', { accent: 'sorte' }, ' de dividir esses dias com você.'],
    ],
    signature: 'Com todo o meu amor',
  },

  gallery: {
    label: 'Nossos momentos',
    title: ['Pequenas coisas que viraram ', { accent: 'tudo' }],
    items: [
      { src: 'fotos/01.jpg', title: 'O primeiro encontro', meta: 'Onde tudo começou' },
      { src: 'fotos/02.jpg', title: 'Aquela viagem', meta: 'Lembra?' },
      { src: 'fotos/03.jpg', title: 'Seu sorriso', meta: 'Meu favorito' },
      { src: 'fotos/04.jpg', title: 'Domingo qualquer', meta: 'Os melhores' },
      { src: 'fotos/05.jpg', title: 'Nós dois', meta: 'Sempre' },
      { src: 'fotos/06.jpg', title: 'Um dia perfeito', meta: 'Sem planejar' },
      { src: 'fotos/07.jpg', title: 'Risadas', meta: 'Sem motivo' },
      { src: 'fotos/08.jpg', title: 'O agora', meta: 'E o que vem' },
    ],
  },

  messages: {
    label: 'Coisas que eu quero te dizer',
    items: [
      ['Você é a parte ', { accent: 'mais bonita' }, ' da minha rotina.'],
      ['Obrigado por me escolher, de novo, todos os dias.'],
      ['Com você até esperar na fila vira um ', { accent: 'bom momento' }, '.'],
      ['Eu admiro a mulher que você é — e a que você está se tornando.'],
      ['Que esse novo ano seja tão gentil com você quanto você é com o mundo.'],
      ['E que eu esteja do seu lado em ', { accent: 'cada um' }, ' dos próximos.'],
    ],
  },

  footer: {
    // type: 'img' para foto, 'video' para vídeo (toca mudo, em loop, como um GIF)
    rows: [
      [
        { type: 'img', src: 'fotos/01.jpg' },
        { type: 'video', src: 'videos/01.mp4' },
        { type: 'img', src: 'fotos/02.jpg' },
        { type: 'img', src: 'fotos/03.jpg' },
        { type: 'video', src: 'videos/02.mp4' },
        { type: 'img', src: 'fotos/04.jpg' },
        { type: 'img', src: 'fotos/09.jpg' },
        { type: 'img', src: 'fotos/10.jpg' },
        { type: 'img', src: 'fotos/11.jpg' },
      ],
      [
        { type: 'img', src: 'fotos/05.jpg' },
        { type: 'img', src: 'fotos/06.jpg' },
        { type: 'video', src: 'videos/03.mp4' },
        { type: 'img', src: 'fotos/07.jpg' },
        { type: 'img', src: 'fotos/08.jpg' },
        { type: 'video', src: 'videos/04.mp4' },
        { type: 'img', src: 'fotos/12.jpg' },
        { type: 'img', src: 'fotos/13.jpg' },
        { type: 'img', src: 'fotos/14.jpg' },
      ],
    ],
    closing: ['Eu te amo,', { accent: 'hoje e sempre.' }],
    note: 'Feliz aniversário, {name}.',
  },
};
