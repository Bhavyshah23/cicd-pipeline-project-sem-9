# ──────────────────────────────────────────────────────────
# Dockerfile — Cloud-Native CI/CD Pipeline
# M.Sc. IT — Cloud & Application Development
# Multi-stage build for optimized production image
# ──────────────────────────────────────────────────────────

# ── STAGE 1: BUILD STAGE ─────────────────────────────────
# Uses Maven + JDK to compile and package the application
FROM maven:3.9.6-eclipse-temurin-17 AS builder

# Set working directory inside container
WORKDIR /app

# Copy pom.xml first (for dependency caching)
COPY pom.xml .

# Download all dependencies (cached if pom.xml unchanged)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the JAR file (skip tests — tests run in pipeline)
RUN mvn clean package -DskipTests

# ── STAGE 2: PRODUCTION STAGE ────────────────────────────
# Uses only JRE (smaller image — no Maven needed)
FROM eclipse-temurin:17-jre-alpine

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy JAR from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Change ownership to non-root user
RUN chown appuser:appgroup app.jar

# Switch to non-root user
USER appuser

# Expose port 8080
EXPOSE 8080

# Health check — AWS Load Balancer uses this
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8080/api/products/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]