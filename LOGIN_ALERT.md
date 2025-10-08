# 🔔 Sistema de Alerta de Login - DevTasks

Este documento explica como funciona o sistema de alerta de login implementado no DevTasks.

## 📋 Funcionalidades

O sistema de alerta de login envia um email para o usuário sempre que ele faz login na aplicação, incluindo:

- **Data e hora do login**
- **Endereço IP** do dispositivo
- **Localização geográfica** baseada no IP
- **Informações do dispositivo** (navegador, tipo de dispositivo)
- **Dicas de segurança**

## 🏗️ Arquitetura

### 1. Componente de Alerta (`src/components/login-alert.tsx`)
- Componente React que detecta quando o usuário acessa o dashboard
- Captura informações do dispositivo usando o hook `getDeviceInfo`
- Envia uma requisição para a API de alerta de login
- Garante que o alerta seja enviado apenas uma vez por sessão

### 2. API de Alerta (`src/app/api/auth/login-alert/route.ts`)
- Endpoint que processa as informações do login
- Obtém o IP do cliente
- Consulta serviço de geolocalização para obter localização
- Envia o email de alerta usando o serviço de email

### 3. Serviço de Email (`src/services/email.service.ts`)
- Função `sendLoginAlertEmail` que gera e envia o email
- Template HTML responsivo e profissional
- Inclui informações detalhadas do login
- Dicas de segurança para o usuário

### 4. Hook de Informações do Dispositivo (`src/hooks/use-mobile.ts`)
- Função `getDeviceInfo` que captura informações do navegador
- Detecta tipo de dispositivo (Workspace, Mobile, Tablet)
- Identifica navegador usado
- Obtém resolução da tela e timezone

## 📧 Template do Email

O email de alerta inclui:

- **Cabeçalho** com logo e título
- **Saudação personalizada** com nome do usuário
- **Mensagem de alerta** explicando o novo login
- **Detalhes técnicos** do login:
  - Data e hora
  - Endereço IP
  - Localização geográfica
  - Dispositivo e navegador
- **Dicas de segurança** para proteger a conta
- **Rodapé** com informações de contato

## 🔧 Configuração

### Variáveis de Ambiente Necessárias

```bash
# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=seu-email@gmail.com
MAIL_PASS=sua-senha-de-app

# NextAuth
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=seu-secret-key
```

### Serviços Externos

- **IP-API.com**: Serviço gratuito para geolocalização baseada em IP
- **Nodemailer**: Para envio de emails

## 🚀 Como Usar

1. **Login**: O usuário faz login normalmente através do GitHub ou Google
2. **Redirecionamento**: Após o login, é redirecionado para o dashboard
3. **Detecção**: O componente `LoginAlert` detecta o acesso ao dashboard
4. **Captura**: Informações do dispositivo são capturadas
5. **Envio**: Email de alerta é enviado automaticamente
6. **Controle**: Sistema garante que apenas um alerta seja enviado por sessão

## 🛡️ Segurança

- **Não bloqueia o login**: Se o email falhar, o login continua normalmente
- **Informações limitadas**: Apenas informações básicas são coletadas
- **Controle de frequência**: Apenas um alerta por sessão
- **Dados temporários**: Informações não são armazenadas permanentemente

## 🔍 Monitoramento

Para monitorar o funcionamento do sistema:

1. **Logs do servidor**: Verificar logs de erro no console
2. **Email de teste**: Fazer login e verificar se o email foi recebido
3. **Console do navegador**: Verificar se há erros no cliente

## 🐛 Troubleshooting

### Email não está sendo enviado
- Verificar configurações de SMTP
- Confirmar variáveis de ambiente
- Verificar logs do servidor

### Localização não aparece
- Verificar se o IP não é local (127.0.0.1)
- Confirmar conectividade com IP-API.com
- Verificar logs de erro na API

### Múltiplos emails sendo enviados
- Verificar se o `sessionStorage` está funcionando
- Confirmar que o componente `LoginAlert` está sendo montado apenas uma vez

## 📝 Próximas Melhorias

- [ ] Adicionar opção para desabilitar alertas
- [ ] Implementar histórico de logins
- [ ] Adicionar notificações push
- [ ] Melhorar detecção de dispositivos suspeitos
- [ ] Implementar autenticação de dois fatores
