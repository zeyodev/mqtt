# mqtt
Broker MQTT using Aedes and MongoDB

Para usar esse broker Mqtt, no servidor, basta clonar esse repositório. Será preciso [criar uma chave ssh](https://docs.oracle.com/en/cloud/cloud-at-customer/occ-get-started/generate-ssh-key-pair.html) e [adicionar no GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account#adding-a-new-ssh-key-to-your-account), caso já não tenha.

```
git clone git@github.com:zeyodev/mqtt.git
```

depois pode usar o Docker ou daemon, para fazer executar o programa.
### Usando o Docker
Para usar o Docker, o docker precisa estar previamente instalado, e então basta executar o comando dentro da pasta mqtt/
```
docker build . -t zeyodev/mqtt
```
e depois iniciar o container com o comando
```
docker run --name mqtt -d --restart unless-stopped --env MONGO_URL="link_MONGO_DB_ATLAS" -p 29367:29367 zeyodev/mqtt
```