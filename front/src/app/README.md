
# MDD (Monde de Dév)

Une application qui permet aux utilisateurs de s’abonner à des sujets liés à la programmation (comme JavaScript, Java, Python, Web3, etc.). Son fil d’actualité affichera chronologiquement les articles correspondants. L’utilisateur pourra également écrire des articles et poster des commentaires.

---

## Technologies utilisées

- Java 21
- Spring Boot 3.5.x
- Spring Security
- JWT (Json Web Token)
- JPA (Hibernate)
- MySQL / H2 (base de données)
- Maven
- Angular
- Node.js 18+
- npm 9+

---

## Démarrage rapide

### 1. Cloner le projet

```bash
git clone https://github.com/elwakarydiarra/Developpez-une-application-full-stack-complete.git
git checkout 2025.5
```
### 2. Lancer le back
```bash
cd back
```
### 3. Configurer la base de données

spring.datasource.url=jdbc:mysql://localhost:3306/mdd?serverTimezone=UTC
spring.datasource.username=your_user
spring.datasource.password=your_password

# Hibernate / DDL
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false

# Flyway (si présent)
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

### 4. Lancer l'application


```bash
mvn clean install
mvn spring-boot:run
```

---
## Lancer le front
```bash
cd front
```
### 2. Installer les dépendances

```bash
npm install
```
### 3. lancer le serveur
npm start
# ou
ng serve -o

---

## Auteur

Développé par El hadji Diarra(https://github.com/elwakarydiarra)

---
