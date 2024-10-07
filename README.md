# Y Project

Y Project é um aplicativo de rede social desenvolvido com **React Native**, contendo diversas funcionalidades modernas como autenticação, criação de postagens e interações entre usuários.

## Funcionalidades Principais
- **Cadastro/Login com Autenticação**
- **Criação de Postagem**: Crie postagens de texto com ou sem fotos.
- **Interações**: Siga outros usuários, curta e comente nas postagens.
- **Personalização de Perfil**: Adicione uma biografia e altere a foto do perfil.

## Tecnologias Utilizadas
- **React Native**
- **Firebase** (Autenticação e Banco de Dados)
- **Expo**

## Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/BobRachador/Y-Project.git
   
2. Instalando Dependências
   ```bash
   cd Y-Project
  
   npm install expo@latest

3. Para alterar o banco de dados
   **Basta entrar na pasta raiz /firebase/config.js**
   **e alterar a variável App dentro do arquivo**
      ```bash
          const firebaseConfig = {
          apiKey: "SUA_API_KEY",
          authDomain: "SEU_AUTH_DOMAIN",
          projectId: "SEU_PROJECT_ID",
          storageBucket: "SEU_STORAGE_BUCKET",
          messagingSenderId: "SEU_MESSAGING_SENDER_ID",
          appId: "SEU_APP_ID"
        };

4. Agora é rodar o app
     ```bash
       npm run start

##Licença

Esse modelo segue uma estrutura organizada, fornece instruções claras para instalação e execução do projeto, além de informações essenciais sobre a configuração e tecnologias utilizadas.

  
