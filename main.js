const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    ignoreHTTPSErrors: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms * 1000));

function sleep(ms) {
  new Promise((resolve) => setTimeout(resolve, ms * 1000));
}

client.on('message', async (message) => {
  const chat = await message.getChat();
  const isGroup = chat.isGroup;
  const dataAgora = new Date();
  let horaAgora = dataAgora.getHours();
  const arquivoContatos = fs.readfileSync(
    './src/database/contatos.json',
    'utf8'
  );
  const contatosDados = JSON.parse(arquivoContatos);
  const contatos = contatosDados.contatos;

  if (message.body === '/cobrar') {
    for (let contato of contatos) {
      const numeroContatoFormatado = `55${contato}@c.us`;
      const chatContact = await client.getChatById(numeroContatoFormatado);
      await chatContact.sendMessage('Ta me devendo 100 conto, vai pagar não?');
      sleep(5);
    }
  }

  if (!isGroup) {
    // horaAgora = 12;

    if (horaAgora < 8 || horaAgora === 12 || horaAgora > 18) {
      // enviar mensagem de almoço
      message.reply(
        'Os serviços da empresa Tal Mania não estão funcionando no momento, retorne mais tarde!'
      );
    } else {
      message.reply('Os serviços estão disponíveis! Como posso ajudar?');
    }
  }
});

const timeoutValue = 60000; // 60 seconds
client.initialize({ timeout: timeoutValue }).catch((error) => {
  console.error('Failed to initialize client:', error);
});
