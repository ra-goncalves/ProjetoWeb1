# Define a imagem base para o Node.js
FROM node:14

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o código da aplicação para o diretório de trabalho
COPY . .

# Define as variáveis de ambiente para o Redis
ENV REDIS_HOST=localhost
ENV REDIS_PORT=6379

# Expõe a porta em que a aplicação estará em execução
EXPOSE 5000

# Comando para iniciar a aplicação
CMD ["npm", "run dev"]
