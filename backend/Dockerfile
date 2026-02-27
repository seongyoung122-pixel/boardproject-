FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

COPY pom.xml .
RUN apk add --no-cache maven

COPY src ./src
RUN mvn package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN apk add --no-cache dumb-init
COPY --from=build /app/target/*.jar app.jar

RUN mkdir -p /app/uploads
ENV UPLOAD_PATH=/app/uploads

EXPOSE 8080
ENTRYPOINT ["dumb-init", "java", "-jar", "app.jar"]
