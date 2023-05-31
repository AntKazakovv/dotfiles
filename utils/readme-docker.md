# Создание образа контейнера chromium-node на dockerproxy.egamings.com для запуска пайплайнов

1. Залогинися в Container Registry (логин и пароль от Redmie):
```bash
docker login drxa.egamings.com
docker login dockerproxy.egamings.com
```
два раза потому что у нас бесплатная версия, а там нельзя использовать для прокси и основного Registry один домен

2. В файле ./utils/Dockerfle поменять версию node (NODE_VERSION), версию npm (NPM_VERSION) и если требуется nvm (NVM_VERSION)

3. Находясь в директории с Dockerfile запустить:
```bash
docker build -t drxa.egamings.com:5000/chromium-node:18 .
```
точка в конце путь до Dockerfile, так что она тут не просто так

4. Запушить его:
```bash
docker push drxa.egamings.com:5000/chromium-node:18
```

5. Указать его в image в .gitlab-ci.yml
```
image: dockerproxy.egamings.com/chromium-node:18
```
