// Inicializa o EmailJS com sua chave de usuário
(function(){
    emailjs.init("cAxVHyDMz_h5_TB2N"); // Substitua SEU_USER_ID pela sua chave de usuário do EmailJS
})();

// Array de e-mails
const emailArray = [
    'funcionario1@example.com',
    'funcionario2@example.com',
    'funcionario3@example.com'
    // Adicione mais e-mails conforme necessário
];

const sendEmailToAll = async () => {
    // Define os parâmetros do e-mail
    const templateParams = {
        to_name: 'Funcionário', // Nome do destinatário (pode ser personalizado mais tarde)
        activity_id: '123', // ID da atividade ou qualquer outro parâmetro que você queira enviar
    };

    // Envia e-mails para cada endereço no array
    const emailPromises = emailArray.map(email => {
        templateParams.to_email = email; // Define o e-mail do destinatário

        return emailjs
          .send("service_xwnjvvm", "template_b1lfxzj", templateParams) // Substitua pelos IDs corretos
          .then(() => {
            console.log(`E-mail enviado para ${email}`);
          })
          .catch((error) => {
            console.error(`Erro ao enviar e-mail para ${email}:`, error);
          });
    });

    // Aguarde o envio de todos os e-mails
    try {
        await Promise.all(emailPromises);
        alert('E-mails enviados com sucesso!');
    } catch (error) {
        console.error('Erro ao enviar e-mails:', error);
        alert('Erro ao enviar e-mails. Confira o console para mais detalhes.');
    }
};

// Adiciona o evento de clique ao botão
document.getElementById('sendEmailButton').addEventListener('click', sendEmailToAll);

